import React from "react";
import Favorite from "./Favorite";

export default function FavoriteArtists({ data = [] }) {
  return data.length > 0 ? (
    <div className="container">
      <h1 className="favorite-header">Favorite Artists: </h1>
      <div className="profile-favorite-container">
        {data.map((item, index) => (
          <Favorite key={index} src={item.image} name={item.name} />
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
}
