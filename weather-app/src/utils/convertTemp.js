export function convertTemp(temp, unit) {
  if (unit === "fahrenheit") {
    return (temp * 9) / 5 + 32;
  }
  return temp;
}