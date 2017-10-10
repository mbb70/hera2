function isNumber(value) {
  return notEmpty(value) && !isNaN(+value);
}

function isInteger(value) {
  return notEmpty(value) && value % 1 === 0;
}

function notEmpty(value) {
  return value !== undefined && value.toString().trim() !== '';
}

export default { isNumber, notEmpty, isInteger };
