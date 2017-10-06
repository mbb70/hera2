function isNumber(value) {
  return !isNaN(+value);
}

function isInteger(value) {
  return notEmpty(value) && value % 1 === 0;
}

function notEmpty(value) {
  return value.toString().trim() !== '';
}

export default { isNumber, notEmpty, isInteger };
