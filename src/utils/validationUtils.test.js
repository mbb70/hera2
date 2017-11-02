import vu from './validationUtils';

const inputs = {
  '': { isInteger: false, isNumber: false, notEmpty: false },
  ' ': { isInteger: false, isNumber: false, notEmpty: false },
  fish: { isInteger: false, isNumber: false, notEmpty: true },
  '-0.99': { isInteger: false, isNumber: true, notEmpty: true },
  '-10.0': { isInteger: true, isNumber: true, notEmpty: true },
  '-1': { isInteger: true, isNumber: true, notEmpty: true },
  '1': { isInteger: true, isNumber: true, notEmpty: true },
  '1.0': { isInteger: true, isNumber: true, notEmpty: true },
  '1.5': { isInteger: false, isNumber: true, notEmpty: true },
};

it('works', () => {
  Object.entries(inputs).forEach(([input, outputs]) => {
    Object.entries(outputs).forEach(([fnName, correctOutput]) => {
      expect(vu[fnName](input)).toEqual(correctOutput);
    });
  });
});

it('works with undefined and null', () => {
  [undefined, null].forEach(v => {
    expect(vu.isInteger(undefined)).toEqual(false);
    expect(vu.isNumber(undefined)).toEqual(false);
    expect(vu.notEmpty(undefined)).toEqual(false);
  });
});

const caseInputs = [
  { inp: ['has test', 'test'], out: true },
  { inp: ['has tEst', 'tesT'], out: true },
  { inp: ['has tesT', ''], out: true },
  { inp: ['has tesT', 'has tesT'], out: true },
  { inp: ['has tesT', 'tEt'], out: false },
  { inp: [undefined, 'has tesT'], out: false },
  { inp: ['has testT', undefined], out: false },
];

it('identifies case insensitive includes', () => {
  caseInputs.forEach(({ inp, out }) => {
    expect(vu.caseInsIncludes(inp[0], inp[1])).toBe(out);
  });
});
