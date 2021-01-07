import React from 'react'
import Image from './Image'

export default function Favorite({src, name}) {
    return (
        <div className="favorite-container">
            <Image alt={name} src={src}/>
            <p className="favorite-p">{name || ''}</p>
        </div>
    )
}
