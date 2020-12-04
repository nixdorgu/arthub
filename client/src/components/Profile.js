import React, { useCallback, useContext, useEffect, useState } from 'react';
// import {Redirect} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import Facade from '../utils/Facade';
import CommissionModal from './modals/CommissionModal';
import LoadingIndicator from './LoadingIndicator';

function Profile({match}) { 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMe, setIsMe] = useState(null);
    const [showHireModal, setShowHireModal] = useState(false);

    const user = useContext(AuthContext).user;
    const [profileData, setProfileData] = useState({});

    const checkProfileUser = useCallback(() => JSON.stringify(match.params) === JSON.stringify({}) ? setIsMe(true) : setIsMe(false), [match.params]);
    const fetchProfileData = useCallback(() => {
        if (!isMe && match.params.id !== undefined) {
            const id = match.params.id;
            new Facade().get(`/api/profile/${id}`,
            (success) => {
                setProfileData(success);
                setIsMe(false);
            },
            (error) => {
                setError(error.message);
            });
        } else {
            setProfileData(user);
            setIsMe(true);
        }
    }, [match, isMe, user]);

    const imgStyle = {
        borderRadius: "10px",
        width: "100px",
        height: "100px",
        objectFit: "cover",
        boxShadow: "1px 1px 5px 1px #aaa"
    }

    useEffect(() => {
        setLoading(true);
        checkProfileUser();
        fetchProfileData();

        if (!error) {
            setLoading(false);
        } else {
            window.location = '/404';
        }
        // fetch profile and 
    }, [match, error, fetchProfileData, checkProfileUser]);

    const UserInteractions = () => {
        const chatArtist = () => {
            new Facade().post("/api/messages/room", {user_id: user.id, user_classification: user['user_classification'], id: profileData['user_id'], classification: profileData['user_classification'] }, (success) => {
                window.location.href = `/messages/${success.room.room_id}`
            }, (error) => {
                console.log(error.message)
                // modal informing user of what went wrong
            })
        }

        const viewMessages = () => window.location = '/messages';

        const options = {
            message: isMe ? 'View Messages' : 'Message',
            profile: isMe ? 'Edit Profile' : 'Hire'
        }

        // artist or profile or artist to customer
        if (profileData['user_classification'] === 'artist' || isMe || (profileData['user_classification'] !== 'artist' && user['user_classification'] === 'artist')) {
            return (
                <div style={{justifyContent: "center", background: "#ddd", display: "flex", width: "100%"}}>
                    <button style={{flex: "1", padding: ".3rem .5rem", border: "2px solid #ff5678", outline: "#ff5678", background: "#fff", color: "#ff5678"}}  onClick={() => {isMe ? viewMessages() : chatArtist()}}>{options.message}</button>
                    <button onClick={() => isMe ? window.location = '/edit/profile' : setShowHireModal(true)}style={{flex: "1", padding: ".3rem .5rem", background: "#ff5678", color: "#fff"}}>{options.profile}</button>
                </div>
            );
        } else {
            return (
                <div/>
            );
        }
    }

    // LOGIC
    return (
        <div style={{flexDirection: "column", display: "flex", alignItems:"center", width: "100%"}}>
        {loading ?  <LoadingIndicator/> : (
            // TODO: refactor this
            <div className="profile-proper" style={{width: "100%"}}>
                <div className="profile header" style={{display: "flex", justifyContent: "center", height: "100px", width: "100%"}}>
                    <div className="image" style={{flex: "2"}}>
                        <img src='' style={imgStyle} alt="profile"/>
                    </div>
                    <div className="bio" style={{flex: "3", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", width: "100%"}}>
                        <p>{isMe ? `${user.first_name} ${user.last_name}` : profileData.name}</p>
                        <i style={{padding: ".5rem 0", fontSize: "small"}}>{isMe? 'Member since Nov. 17, 2020' : ` Member since ${new Date(profileData['member_since']).toLocaleDateString()}`}</i>
                        <UserInteractions/>
                    </div>
                </div>
                {/* modal should close when clicked anywhere else same with hamburger */}
                {!isMe && profileData['user_classification'] === 'artist' && (<CommissionModal show={showHireModal} handleClose={(e) => setShowHireModal(false)} handleSubmit={() => {console.log('submit form')}}/>)}
                <div style={{lineBreak: "normal", wordBreak: "break-word"}}>
                {JSON.stringify(profileData)}
                </div>
            </div>
        )}
            {/* <div className="bottom-portion" style={{width:"100%", marginTop:"3vh"}}>
                <div id="options" className="row" style={{background: "blue", padding: "1rem", marginBottom: "1vh"}}>
                    <span>Reviews</span>
                    <span>Works</span>
                    <span>About the Artist</span>
                </div>
                <div style={{background: "red", height: "100%", width:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                    <div className="card">
                        
                    </div>
                </div>
            </div> */}
        </div>
    );
}
 
export default Profile;