const format = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format;

const getStageInfo = (playID, stages) => {
  const stage = stages[playID];

  if (!stage) throw new Error(`${playID} => 해당 공연 정보가 존재하지 않습니다.`);

  return stage;
};

const getStageAmount = (perf, stage) => {
  const stageTypes = {
    tragedy: () => 40000 + (perf.audience > 30 ? 1000 * (perf.audience - 30) : 0),
    comedy: () =>
      30000 + (perf.audience > 20 ? 10000 + 500 * (perf.audience - 20) : 0) + 300 * perf.audience,
  };

  const getAmount = stageTypes[stage.type];

  if (!getAmount) throw new Error(`알 수 없는 장르: ${stage.type}`);

  return getAmount();
};

const getEarnPoint = (perf, stage) =>
  Math.max(perf.audience - 30, 0) + (stage.type === 'comedy' ? Math.floor(perf.audience / 5) : 0);

const getPerformanceData = (perf, stages) => {
  const stage = getStageInfo(perf.playID, stages);

  return {
    stageName: stage.name,
    amount: getStageAmount(perf, stage),
    earnPoint: getEarnPoint(perf, stage),
  };
};

const getBillingHistory = (bill, stages) => {
  const { customer, performances } = bill;

  const totalAmount = performances.reduce((total, perf) => {
    const { amount } = getPerformanceData(perf, stages);
    return total + amount;
  }, 0);

  const earnPoint = performances.reduce((total, perf) => {
    const { earnPoint } = getPerformanceData(perf, stages);

    return total + earnPoint;
  }, 0);

  let result = `청구 내역 (고객명: ${customer})\n`;

  for (let perf of performances) {
    const { stageName, amount } = getPerformanceData(perf, stages);
    result += `${stageName}: ${format(amount / 100)} (${perf.audience}석)\n`;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${earnPoint}점\n`;

  return result;
};

const statement = (bill, stages) => {
  return getBillingHistory(bill, stages);
};

export default statement;
