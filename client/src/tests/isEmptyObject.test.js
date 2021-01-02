const isEmptyObject = require("./isEmptyObject");

describe("Test returns a boolean indicating whether an object is empty", () => {
  it("Outputs true when object is empty", () => {
    expect(isEmptyObject({})).toStrictEqual(true);
  });

  it("Outputs false when object is not empty", () => {
    expect(isEmptyObject({artist_id: 5})).toStrictEqual(false);
  });

  it("Outputs false when given an array", () => {
    expect(isEmptyObject([])).toStrictEqual(false);
  });
  
  it("Outputs true when given an empty map", () => {
    expect(isEmptyObject(new Map())).toStrictEqual(true);
  });
});
