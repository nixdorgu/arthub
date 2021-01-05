function shallowEquality(object, objectTwo) {
  if (typeof object !== 'object' || typeof objectTwo !== 'object') return false;

  return JSON.stringify(object) === JSON.stringify(objectTwo);
}

module.exports = shallowEquality;