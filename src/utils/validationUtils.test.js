import vu from './validationUtils'

const inputs = {
  '' : { isInteger: false, isNumber: false, notEmpty: false },
  ' ' : { isInteger: false, isNumber: false, notEmpty: false },
  'fish' : { isInteger: false, isNumber: false, notEmpty: true },
  '-0.99' : { isInteger: false, isNumber: true, notEmpty: true },
  '-10.0' : { isInteger: true, isNumber: true, notEmpty: true },
  '-1' : { isInteger: true, isNumber: true, notEmpty: true },
  '1' : { isInteger: true, isNumber: true, notEmpty: true },
  '1.0' : { isInteger: true, isNumber: true, notEmpty: true },
  '1.5' : { isInteger: false, isNumber: true, notEmpty: true },
};

it('identifies integers', () => {
  Object.entries(inputs).forEach(([v, k]) => {
    expect(vu.isInteger(v)).toEqual(k.isInteger);
  });
});

it('identifies numbers', () => {
  Object.entries(inputs).forEach(([v, k]) => {
    expect(vu.isNumber(v)).toEqual(k.isNumber);
  });
});

it('identifies emptiness', () => {
  Object.entries(inputs).forEach(([v, k]) => {
    expect(vu.notEmpty(v)).toEqual(k.notEmpty);
  });
});
