function isEmptyObject(object) {
    return JSON.stringify(object) === JSON.stringify({});
}

module.exports = isEmptyObject;
