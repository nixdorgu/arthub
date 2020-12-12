const isArtist = require("./isArtist");

describe("Test returns a boolean indicating whether the current user is the commissioned artist or not", () => {
  it("Outputs correct value when user is the artist", () => {
    expect(
      isArtist(
        {artist_id: 5},
        {id: 5}
      )
    ).toStrictEqual(true);
  });

  it("Outputs correct value when user is not the artist", () => {
    expect(
      isArtist(
        {artist_id: 5},
        {id: 7}
      )
    ).toStrictEqual(false);
  });
});
