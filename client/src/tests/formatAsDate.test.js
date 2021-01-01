const formatAsDate = require("./formatAsDate");

describe("Test correctly outputs membership date string", () => {
  it("Outputs empty string when given data has no member_since property", () => {
    expect(
      formatAsDate({
        user_id: 3,
        name: "Anike Dorgu",
        user_classification: "customer",
        source: "https://i.ibb.co/XV9b3h2/Untitled-1.png",
      })
    ).toStrictEqual("");
  });

  it("Outputs member since string when given data has member_since property", () => {
    expect(
      formatAsDate({
        user_id: 3,
        name: "Anike Dorgu",
        member_since: "2020-11-13T08:44:12.645Z",
        user_classification: "customer",
        source: "https://i.ibb.co/XV9b3h2/Untitled-1.png",
      })
    ).toStrictEqual("Member since 11/13/2020");
  });
});
