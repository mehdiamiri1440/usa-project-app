export const generateKey = (pre = 'buskool') => {
  return `${pre}_${new Date().getTime()}_${Math.floor(Math.random() * 99999) + 1}`;
};
