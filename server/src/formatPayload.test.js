const formatPayload = require("./formatPayload");

describe("Correctly formats JWT payload", () => {
  it("Removes password, status, and member_since fields", () => {
    expect(
      formatPayload({
        user_id: 1,
        first_name: "Ann",
        last_name: "Devereux",
        password: "thisisapassword",
        status: "active",
        member_since: "2020-11-19",
      })
    ).toEqual(
      expect.objectContaining({
        user_id: expect.any(Number),
        first_name: expect.any(String),
        last_name: expect.any(String),
        iat: expect.any(Number),
      })
    );
  });

  it("Returns an object different from the input", () => {
    expect(
      formatPayload({
        user_id: 1,
        first_name: "Ann",
        last_name: "Devereux",
        password: "thisisapassword",
        status: "active",
        member_since: "2020-11-19",
      })
    ).not.toEqual({
      user_id: 1,
      first_name: "Ann",
      last_name: "Devereux",
      password: "thisisapassword",
      status: "active",
      member_since: "2020-11-19",
    });
  });
});
