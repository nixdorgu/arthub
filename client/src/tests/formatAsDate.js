function formatAsDate(profileData, locale = "en") {
  if (profileData.hasOwnProperty("member_since")) {
    const date = new Date(profileData["member_since"]).toLocaleDateString(locale)
    return `Member since ${date}`;
  }

  return "";
}

module.exports = formatAsDate;
