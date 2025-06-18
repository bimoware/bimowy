export function formatNumber(n:number,n_digits:number = 2) {
  return parseFloat(n.toFixed(n_digits));
}
