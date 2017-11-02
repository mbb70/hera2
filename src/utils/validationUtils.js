function caseInsIncludes(t1, t2) {
  return (
    t1 !== undefined &&
    t2 !== undefined &&
    t1
      .toString()
      .toUpperCase()
      .includes(t2.toString().toUpperCase())
  );
}

function isNumber(value) {
  return notEmpty(value) && !isNaN(+value);
}

function isInteger(value) {
  return notEmpty(value) && value % 1 === 0;
}

function notEmpty(value) {
  return value !== undefined && value.toString().trim() !== '';
}

export default { caseInsIncludes, isNumber, notEmpty, isInteger };
