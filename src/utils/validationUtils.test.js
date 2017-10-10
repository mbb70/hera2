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

it('works', () => {
  Object.entries(inputs).forEach(([input, outputs]) => {
    Object.entries(outputs).forEach(([fnName, correctOutput]) => {
      expect(vu[fnName](input)).toEqual(correctOutput);
    });
  });

});

it('works with undefined and null', () => {
  [undefined, null].forEach((v) => {
    expect(vu.isInteger(undefined)).toEqual(false);
    expect(vu.isNumber(undefined)).toEqual(false);
    expect(vu.notEmpty(undefined)).toEqual(false);
  });
});
