import React from 'react'

export default function RatingDetail({ rating }) {
    const number = Number(rating).toFixed(0);
    const ratingClassName = "rating " + (number < 49 ? "bad" : (number < 80 ? "fair" : "good"));

    return (
        <div className="profile-rating">
            <p className={ratingClassName}>{number}<span>%</span></p>
        </div>
    )
}
