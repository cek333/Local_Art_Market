const constants = {
  PRICE_QUERY_MAP: {
    0: { $lt: 25 },
    25: { $gte: 25, $lt: 50 },
    50: { $gte: 50, $lt: 100 },
    100: { $gte: 100, $lt: 250 },
    250: { $gte: 250 }
  },
  PRICE_LEVELS: [0, 25, 50, 100, 250, Infinity]
};

module.exports = constants;

