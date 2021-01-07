import React, { useEffect, useState, useRef } from 'react';
import Snackbar from '../Snackbar';
import {useAuth} from "../../context/AuthContext";

import { fetch } from '../../utils/fetch';
import CommissionModal from '../modals/CommissionModal';
import UserFlow from '../../utils/UserFlow';
import ProfileHeader from './ProfileHeader';
import { Redirect } from 'react-router-dom';

function Profile({match}) { 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isMe, setIsMe] = useState(null);
    const [showHireModal, setShowHireModal] = useState(false);

    const snackbarRef = useRef();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const {user} = useAuth();
    const [profileData, setProfileData] = useState({});
    const [src, setSrc] = useState('#');

    const processTransaction = (e) => {
        e.preventDefault();

        const [title, shortDescription, description, price] = e.target.childNodes;
        const data = {title: title.value, shortDescription: shortDescription.value, description: description.value, userId: user.id, artistId: profileData['user_id'], price: price.value };

        fetch('/api/transactions', {
            method: "POST",
            data,
            success: (success) => {
                setShowSnackbar(true);
                setSnackbarMessage(success.message);
            },
            error: (error) => {
                setShowSnackbar(true);
                setSnackbarMessage(error.message);
            }
        });
    }

    useEffect(() => {
        setLoading(true);

        if (user.hasOwnProperty("id")) {
            const id = match.params.id || user.id;

            fetch(`/api/profile/${id}`, {
                method : "GET",
                success: (success) => {
                    const ownProfile = success.user_id === user.id;
                    setError(false);
                    setProfileData(success);
                    setIsMe(ownProfile);
                },
                error: (error) => {
                    setError(true);
                }
            });
        }
    }, [user, match.params]);
    
    useEffect(() => {
        setLoading(true);

        if (profileData.hasOwnProperty("user_id")) {
            setSrc(profileData.source);

            if (profileData.user_classification === "artist") {    
            // fetch("URL HERE", {
            //   method: "GET",
            //   success: (data) => {
            //     setLoading(false);
            //   },
            //   error: (error) => {
            //     // console.log(error)
            //     setError(true);
            //     // setGenres(["None"]);
            //   }
            // });
            }
            
            setLoading(false);
        }
    }, [profileData]);
    
    // LOGIC
    return (
        <div style={{flexDirection: "column", display: "flex", alignItems:"center", width: "100%"}}>
        <Snackbar hidden={showSnackbar} props={{ message: snackbarMessage, snackbarRef, error: true, showSnackbar, setShowSnackbar}}/>
        <UserFlow isLoading={loading} 
        isError={error}
        // empty to either redirect OR show error500
        error={<Redirect to="/404"/>}
        success={
            <div className="profile-proper" style={{width: "80%"}}>
                <ProfileHeader isMe={isMe} user={user} setShowHireModal={setShowHireModal} setShowSnackbar={setShowSnackbar} setSnackbarMessage={setSnackbarMessage} profileData={profileData} src={src} />
                <CommissionModal show={showHireModal && !isMe && profileData['user_classification'] === 'artist'} handleClose={(e) => setShowHireModal(false)} handleSubmit={processTransaction}/>
                <div style={{lineBreak: "normal", wordBreak: "break-word"}}>
                {/* {JSON.stringify(profileData)} */}
                </div>
            </div>
        }/>
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