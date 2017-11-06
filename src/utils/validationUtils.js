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

function notEmpty(value) {
  return value !== undefined && value.toString().trim() !== '';
}

function isNumber(value) {
  return notEmpty(value) && !Number.isNaN(+value);
}

function isInteger(value) {
  return notEmpty(value) && value % 1 === 0;
}

export default {
  caseInsIncludes,
  isNumber,
  notEmpty,
  isInteger,
};
