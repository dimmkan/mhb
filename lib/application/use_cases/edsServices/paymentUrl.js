const { AppError, errorCodes } = require('shared/errors');
const { v4: uuidv4 } = require('uuid');

const Floor10 = (val) => Math.floor(val / 10) * 10;

const bonusesTypeAmount = ({ bonuses, tipsFromBonuses, tips }) => {
  if (bonuses) return { amount: Floor10(tipsFromBonuses ? bonuses + (tips * 100) : bonuses), type: 'PAY' };
  if (!bonuses && tipsFromBonuses && tips) return { amount: Floor10(tips * 100), type: 'TIPS' };
  return { amount: 0, type: 'NONE' };
};

const paymentUrl = async (
  dependencies,
  {
    userId, id: requestId, ...paymentData
  },
) => {
  const {
    edsServicesProfileRepository,
    loyaltyManager,
    edsServicesExternal,
  } = dependencies;

  const bonuses = paymentData.bonuses || 0;
  const tips = paymentData.tips || 0;
  const tipsFromBonuses = paymentData.tipsFromBonuses || false;

  try {
    await edsServicesProfileRepository.getByUserId(userId);

    const bonusesAmount = bonusesTypeAmount({ bonuses, tipsFromBonuses, tips });

    if (bonusesAmount.type === 'PAY') {
      const {
        can_pay_bonus: canPayBonus,
        wanttobonus: wantToBonus,
        payable: isPayable,
        act_sum: requestSum,
      } = await edsServicesExternal.getRequest(requestId);

      if (isPayable !== 1 || canPayBonus !== 1 || wantToBonus !== 1 || !requestSum) {
        throw new AppError(errorCodes.EDS_REQ_NOT_PAYABLE);
      }
      if ((Floor10(bonuses) / 100) > (requestSum / 2)) {
        throw new AppError(errorCodes.EDS_REQ_POINTS_LIMIT);
      }
    }

    if (bonusesAmount.amount) {
      const creditTransactionId = uuidv4();

      await loyaltyManager.credit(dependencies, {
        userId,
        source: 'eds',
        sourceId: requestId.toString(),
        amount: bonusesAmount.amount,
        approved: false,
        type: loyaltyManager.types.user.EDS_SERVICE_REQ_PAYMENT.type,
        transactionId: creditTransactionId,
      });

      const edsPayment = await edsServicesExternal.paymentUrl({
        requestId,
        bonuses,
        tips,
        tipsFromBonuses,
        transactionId: creditTransactionId,
      });
      return edsPayment;
    }

    const edsPayment = await edsServicesExternal.paymentUrl({ requestId, tips, tipsFromBonuses });
    return edsPayment;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(errorCodes.EXTERNAL, { origin: e });
  }
};

module.exports = paymentUrl;
