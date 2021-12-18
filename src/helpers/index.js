export const numberWithCommas = number => {
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  return number.toString().replace(regex, ',');
};

export const toLogPercentage = (value, maxValue) => (Math.log(value) / Math.log(maxValue)) * 100;
