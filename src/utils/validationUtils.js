function isNumber(value) {
  return !isNaN(+value);
}

function notEmpty(value) {
  return value.trim() !== '';
}

export default { isNumber, notEmpty };
