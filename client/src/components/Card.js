import React from "react";

function Card(artist) {
  const { _id, name, image, rating, location } = artist.props;

  return (
    <div className="card">
      <a href={`artists/${_id}`}>
        <img className="medium" src={image} alt="artist" />
      </a>
      <div className="card-body">
        <a href={`artists/${_id}`}>
          <h2>{name}</h2>
        </a>
        <div className="rating">
          <span><i className="fa fa-star"></i></span>
          <span><i className="fa fa-star"></i></span>
          <span><i className="fa fa-star"></i></span>
          <span><i className="fa fa-star"></i></span>
          <span><i className="fa fa-star"></i></span>
        </div>
        <div className="location">{location}</div>
      </div>
    </div>
  );
}

export default Card;