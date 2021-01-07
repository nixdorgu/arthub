const isDefined = require('./isDefined');

function validate(item, constraint = { type: '', max: 0 }) {
  if (!isDefined(item)) return false;

  const { type, max } = constraint;
  const caseInsensitiveType = type.toUpperCase();

  if (caseInsensitiveType === 'TEXT') {
    return typeof item === 'string' && item.trim() !== '' && item.trim().length <= max;
  }

  if (caseInsensitiveType === 'NUMBER') {
    return !Number.isNaN(item) && Number(item) > 0;
  }

  return false;
}

validate('Lorem ipsum lorem ipsum lorem ipsum', { type: 'TEXT', max: 35 });
module.exports = validate;
