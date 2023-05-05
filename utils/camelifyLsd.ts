const camelMap = {
  STETH: "stETH",
  RETH: "rETH",
  FRXETH: "frxETH",
  SFRXETH: "sfrxETH",
};

const camelifyLsd = (lsd: string): string => {
  return camelMap[lsd] || lsd;
};

export default camelifyLsd;
