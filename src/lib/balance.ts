export const getDisplayAmount = (balance: number | string) => {
  const balanceNumber = Number(balance);
  if (balanceNumber < 100) {
    return balanceNumber.toFixed(2);
  }
  return balanceNumber.toFixed(0);
};
