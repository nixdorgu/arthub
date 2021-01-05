const shallowEquality = require('./shallowEquality');

describe('Checks shallow equality between two objects', () => {
  it('Returns false on non-object input in first parameter', () => {
    expect(shallowEquality([], {})).toBe(false);
  });

  it('Returns false on non-object input in first parameter', () => {
    expect(shallowEquality({}, '')).toBe(false);
  });

  it('Returns false on non-equivalent objects', () => {
    expect(shallowEquality({}, { name: 'Coo' })).toBe(false);
  });

  it('Returns true on equivalent objects', () => {
    expect(shallowEquality({ name: 'Coo' }, { name: 'Coo' })).toBe(true);
  });
});
