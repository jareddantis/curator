export function withCommas(n: number) {
  // Comma delimited digits https://stackoverflow.com/a/2901298
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
