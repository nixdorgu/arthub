const isDefined = require('./isDefined');

describe('Checks that input is neither null or undefined', () => {
  it('Correctly assess a null input', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('Correctly assess an undefined input', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('Correctly assess a defined input', () => {
    expect(isDefined('Coo')).toBe(true);
  });
});
