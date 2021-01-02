import React from 'react'

export default function ArtistCard(props) {
    const {artist} = props.props;

    const navigate = (e, artist) =>  {
        const link = `/profile/${artist.user_id}`
        window.location.href = link;
    }

    return (
        <div style={{padding: ".8rem", boxShadow: "1px 1px 1px 1px #ff5678", flex: "1", margin: ".2rem", borderRadius: "10px", cursor: "pointer"}} onClick={(e) => navigate(e, artist)}>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                  <h4>{artist.name}</h4>
                  <p>{artist.biography || <span>Reach me at <a href={`mailto:${artist.email}`}>{artist.email}</a></span>}</p>
            </div>
        </div>  
    )
}
