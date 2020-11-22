import React from 'react';

function Profile(props) {
    const imgStyle = {
        borderRadius: "10px",
        width: "100px",
        height: "100px",
        objectFit: "cover",
        boxShadow: "1px 1px 5px 1px #aaa"
    }
    const {image, name} = props.props;

    const metadata = {
        isArtist: true,
        notProfile: true
    }
    
    const Possibilities = (props) => {
        const {metadata} = props;

        if (metadata.isArtist && metadata.notProfile) {
            return (
                <div style={{justifyContent: "center", background: "#ddd", display: "flex", width: "100%"}}>
                    <button style={{flex: "1", padding: ".3rem .5rem", border: "2px solid #000055", outline: "#000055"}}>Message</button>
                    <button style={{flex: "1", padding: ".3rem .5rem", background: "#000055", color: "#fff"}}>Hire</button>
                </div>
            );
        } else if (metadata.isArtist && !metadata.notProfile) {
            return (
                <div>
                    <button>View Messages</button>
                    <button>Edit Profile</button>
                </div>
            );
        } else if (!metadata.isArtist && metadata.notProfile) {
            // it makes no sense for non artists to see this stuff
            // profile accessible only to self unless artist
            return (
                <div></div>
            );
        } else {
            // di ka artist tapos imo profile
            return (
                <div>
                    <button>Message</button>
                    <button>Edit Profile</button>
                </div>
            );
        }
    }
    return (
        <div style={{flexDirection: "column", display: "flex", alignItems:"center", width: "100%"}}>
            <div className="profile-proper" style={{width: "100%"}}>
                <div className="profile header" style={{display: "flex", justifyContent: "center", height: "100px", width: "100%"}}>
                    <div className="image" style={{flex: "2"}}>
                        <img src={image} style={imgStyle} alt="profile"/>
                    </div>
                    <div className="bio" style={{flex: "3", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", width: "100%"}}>
                        <p>{name}</p>
                        <i style={{padding: ".5rem 0", fontSize: "small"}}>Member since Nov. 17, 2020</i>
                        <Possibilities metadata={metadata}/>
                    </div>
                </div>
                
            </div>
            <div className="bottom-portion" style={{width:"100%", marginTop:"3vh"}}>
                <div id="options" className="row" style={{background: "blue", padding: "1rem", marginBottom: "1vh"}}>
                    <span>Reviews</span>
                    <span>Works</span>
                    <span>About the Artist</span>
                </div>
                <div style={{background: "red", height: "100%", width:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                    <div className="card">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Profile;