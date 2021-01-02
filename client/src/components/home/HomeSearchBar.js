import React from 'react'

export default function HomeSearchBar({onSubmit, input, setInput}) {
    return (
        <form style={{display: "flex", width: "80%", maxWidth: "600px"}} onSubmit={(e) => onSubmit(e, input)}>
              <input type="text" placeholder="Search for artists, genres, etc" style={{flex: "1", fontFamily: "Montserrat, sans-serif", padding: ".35rem"}} onChange={(e) => setInput(e.target.value)} value={input}></input>
              <button type="submit" className="search" style={{background: "#ff5678", padding: ".5rem", fontFamily: "Montserrat"}}>Search</button>
          </form>
    )
}
