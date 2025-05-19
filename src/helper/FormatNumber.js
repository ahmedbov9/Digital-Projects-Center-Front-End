export function FormatNumber(number) {
  if (number === null || number === undefined) {
    return '0';
  }

  const formattedNumber = (value) => new Intl.NumberFormat('EN').format(value);

  return formattedNumber(number);
}
