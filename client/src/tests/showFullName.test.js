const showFullName = require("./showFullName");

describe("Test outputs correct name", () => {
  it("Outputs correct name when user has no name property", () => {
    expect(
      showFullName(
        {
          first_name: "Anike",
          last_name: "Dorgu",
        }
      )
    ).toBe("Anike Dorgu");
  });

  it("Outputs correct name when user has name property", () => {
    expect(
      showFullName(
        {
            email: "test99@gmail.com",
            name: "Em Bastiero",
        }
      )
    ).toBe("Em Bastiero");
  });

  it("Outputs correct name when user has neither name, first_name or last_name property", () => {
    expect(
      showFullName(
        {
            email: "test99@gmail.com",
        }
      )
    ).toBe("");
  });
});
