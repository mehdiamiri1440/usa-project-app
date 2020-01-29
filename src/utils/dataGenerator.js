export const generateKey = (pre = 'rsee_elem') => {
  return `${pre}_${new Date().getTime()}_${Math.floor(Math.random() * 99999) + 1}`;
};
