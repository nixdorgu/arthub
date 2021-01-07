import React from 'react'

export default function Image({src, alt}) {
    return (
        <div className="profile-favorite-image-container">
            <img className="profile-favorite-image" src={src || 'https://i.ibb.co/XV9b3h2/Untitled-1.png'} alt={alt} title={alt} />
        </div>
    )
}
