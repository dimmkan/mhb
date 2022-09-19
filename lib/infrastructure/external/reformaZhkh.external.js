const soap = require('soap');
const env = require('infrastructure/config/env');
const _ = require('ramda');
const first = require('shared/utils/helper/first');
const NodeCache = require('node-cache');

const cache = new NodeCache();

const notUndefined = (n) => n !== undefined;
const getLastFile = (items) => _.reduce(_.maxBy((item) => item.create_date), first(items), items);
const formatHouseList = (item) => {
  const address = item.full_address;
  return {
    house_id: item.house_id,
    ...address,
  };
};

const houseInfoFields = [
  'management_contract_date_start',
  'cadastral_number',
  'method_of_forming_overhaul_fund',
  'built_year',
  'exploitation_start_year',
  'project_type',
  'floor_count_max',
  'floor_count_min',
  'entrance_count',
  'elevators_count',
  'area_land',
  'flats_count',
  'living_quarters_count',
  'not_living_quarters_count',
  'area_total',
  'area_residential',
  'area_non_residential',
  'area_common_property',
  'energy_efficiency',
  'is_alarm',
  'alarm_document',
  'alarm_reason',
];
const typesObject = {
  energyEfficiency: {
    1: 'Не присвоен',
    2: 'A',
    3: 'B++',
    4: 'B+',
    5: 'C',
    6: 'D',
    7: 'E',
    8: 'B',
    9: 'A++',
    10: 'A+',
    11: 'F',
    12: 'G',
  },
  methodOfFund: {
    1: 'На специальном счете организации',
    2: 'На специальном счете у регионального оператора',
    3: 'На счете регионального оператора',
    4: 'Не определен',
  },
};

const reformaZhkhExternal = () => {
  const getClient = async (authData) => {
    const client = cache.get(`soap${authData.login}`);
    if (client) return client;
    const instance = await soap.createClientAsync(env.GIS_ZHKH_WSDL_URL);
    instance.addSoapHeader(await instance.LoginAsync(authData).then(
      _.compose(
        _.objOf('authenticate'),
        _.path(['return', '$value']),
        _.head,
      ),
    ));
    cache.set(`soap${authData.login}`, instance, 9 * 60);
    return instance;
  };

  const getReportingPeriodList = async (authData) => {
    const periodList = cache.get('periodList');
    if (periodList) return periodList;
    const client = await getClient(authData);
    const result = await client.GetReportingPeriodListAsync(null).then(
      _.compose(
        _.map(
          _.compose(
            _.omit(['attributes']),
            _.map(_.prop('$value')),
          ),
        ),
        _.path(['return', 'item']),
        _.head,
      ),
    );
    cache.set('periodList', result, 86400);
    return result;
  };

  const getHouseList = async (authData, inn) => {
    const houseList = cache.get(`houseList${inn}`);
    if (houseList) return houseList;
    const client = await getClient(authData);
    const result = await client.GetHouseListAsync({ inn }).then(
      _.compose(
        _.map(_.compose(
          _.filter(notUndefined),
          _.map(_.prop('$value')),
          formatHouseList,
          _.omit(['attributes']),
        )),
        _.path(['return', 'item']),
        _.head,
      ),
    );
    cache.set(`houseList${inn}`, result, 86400);
    return result;
  };

  const getHouseProfile = async (authData, sendData) => {
    const client = await getClient(authData);

    const fileInfo = (result) => (_.compose(
      getLastFile,
      _.map(
        _.compose(
          _.map(_.prop('$value')),
          _.omit(['attributes']),
        ),
      ),
      (ctx) => [ctx].flat(1),
    ))(result.files_info.item);

    const houseProfileData = _.compose(
      _.filter(notUndefined),
      _.map(_.prop('$value')),
      _.path(['house_profile_data']),
    );

    const contractDateStart = _.compose(
      _.objOf('management_contract_date_start'),
      _.pathOr('', ['management_contract', 'date_start', '$value']),
      _.path(['house_profile_data']),
    );

    const cadastralNumber = _.compose(
      _.objOf('cadastral_number'),
      _.pathOr('', ['cadastral_number', '$value']),
      _.head,
      (ctx) => [ctx].flat(1),
      _.path(['house_profile_data', 'cadastral_numbers', 'item']),
    );

    const getAlarmDocument = (data) => (data ? `${data.document_number} от ${data.document_date.toLocaleString('ru')}` : '');

    const alarmDocument = _.compose(
      _.objOf('alarm_document'),
      getAlarmDocument,
      _.path(['house_profile_data', 'alarm_info', 'item']),
    );

    const alarmReason = _.compose(
      _.objOf('alarm_reason'),
      _.pathOr('', ['reason']),
      _.path(['house_profile_data', 'alarm_info', 'item']),
    );

    const getEnergyEfficiencyDescription = (value) => (
      typesObject.energyEfficiency[value] || typesObject.energyEfficiency[1]
    );

    const energyEfficiencyDescription = _.compose(
      _.objOf('energy_efficiency'),
      getEnergyEfficiencyDescription,
      _.path(['houseProfileData', 'energy_efficiency', '&value']),
    );

    const getmethodOfFundDescription = (value) => (
      typesObject.methodOfFund[value] || typesObject.methodOfFund[4]
    );

    const methodOfFundDescription = _.compose(
      _.objOf('method_of_forming_overhaul_fund'),
      getmethodOfFundDescription,
      _.path(['house_profile_data', 'method_of_forming_overhaul_fund', '$value']),
    );

    const result = await client.GetHouseProfile988Async(sendData).then(_.compose(
      _.converge(
        _.unapply(_.reduce(_.mergeDeepRight, {})),
        [
          _.compose(
            _.objOf('houseProfileData'),
            _.pick(houseInfoFields),
            _.converge(
              _.unapply(_.reduce(_.mergeDeepRight, {})),
              [
                houseProfileData,
                methodOfFundDescription,
                contractDateStart,
                alarmDocument,
                alarmReason,
                energyEfficiencyDescription,
                cadastralNumber,
              ],
            ),
          ),
          _.compose(
            _.objOf('fileInfo'),
            fileInfo,
          ),
        ],
      ),
      _.omit(['attributes']),
      _.path(['return']),
      _.head,
    ));

    return result;
  };

  const logout = async (authData) => {
    const client = await getClient(authData);
    return client.LogoutAsync(null);
  };

  const getFileById = async (authData, sendData) => {
    const client = await getClient(authData);
    const result = await client.GetFileByIDAsync(sendData).then(
      _.compose(
        _.map(_.prop('$value')),
        _.omit(['attributes']),
        _.path(['return']),
        _.head,
      ),
    );
    return result;
  };

  const getManagingReport = async (authData, sendData) => {
    const client = await getClient(authData);
    const result = await client.GetHouseProfile988Async(sendData).then(
      _.compose(
        _.map(_.prop('$value')),
        _.omit(['attributes']),
        _.path(['return', 'house_profile_data', 'report', 'common']),
        _.head,
      ),
    );
    return result;
  };

  return {
    getReportingPeriodList,
    getHouseList,
    getHouseProfile,
    logout,
    getFileById,
    getManagingReport,
  };
};

module.exports = reformaZhkhExternal();
