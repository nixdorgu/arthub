const validate = require('./validate');

describe('Checks that input is valid based on constraints', () => {
  it('Correctly assess an invalid string', () => {
    expect(validate(null)).toBe(false);
  });

  it('Correctly assess a valid string', () => {
    expect(
      validate('Lorem ipsum lorem ipsum lorem ipsum', { type: 'TEXT', max: 35 })
    ).toBe(true);
  });

  it('Correctly assess an invalid number', () => {
    expect(validate('e', { type: 'NUMBER' })).toBe(false);
  });

  it('Correctly assess a valid number', () => {
    expect(validate('3', { type: 'NUMBER' })).toBe(true);
  });

  it('Correctly assess a invalid constraint type', () => {
    expect(validate('Coo', { type: 'NUMERIC' })).toBe(false);
  });
});
