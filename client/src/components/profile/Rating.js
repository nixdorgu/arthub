import React from 'react'
import RatingDetail from './RatingDetail';
import RatingHeader from './RatingHeader';

export default function Rating({ rating }) {
    return (
      <div className="container">
        <RatingHeader/>
        <RatingDetail rating={rating}/>
      </div>
    )
}
