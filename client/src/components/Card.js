import React from "react";

function Card(props) {
  const { name, image, rating, location } = props;

  return (
    <div className="card">
      <a href="#">
        <img className="medium" src={image} alt="artist" />
      </a>
      <div className="card-body">
        <a href="">
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
