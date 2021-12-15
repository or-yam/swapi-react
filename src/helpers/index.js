export const toNumberWithCommas = number => {
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  return number.toString().replace(regex, ',');
};

export const getLogMaxHeightFromNumsList = list => Math.max(...list.map(num => Math.log(num)));

export const toPercentage = (value, maxValue) => (Math.log(value) / maxValue) * 100;
