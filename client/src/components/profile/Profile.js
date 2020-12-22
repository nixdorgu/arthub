import React, { useCallback, useEffect, useState, useRef } from 'react';
import Snackbar from '../Snackbar';
import {useAuth} from "../../context/AuthContext";
import Facade from '../../utils/Facade';
import CommissionModal from '../modals/CommissionModal';
import LoadingIndicator from '../LoadingIndicator';
import ProfileInteractions from './ProfileInteractions';
import showFullName from '../../tests/showFullName';

function Profile({match}) { 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMe, setIsMe] = useState(null);
    const [showHireModal, setShowHireModal] = useState(false);

    const snackbarRef = useRef();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const {user} = useAuth();
    const [profileData, setProfileData] = useState({});

    const checkProfileUser = useCallback(() => JSON.stringify(match.params) === JSON.stringify({}) ? setIsMe(true) : setIsMe(false), [match.params]);
    const fetchProfileData = useCallback(() => {
            const id = match.params.id || user.id;

            new Facade().get(`/api/profile/${id}`,
            (success) => {
                const ownProfile = success.user_id === user.id;
                setProfileData(success);
                setIsMe(ownProfile);
            },
            (error) => {
                setError(error.message);
            });
    }, [match, user]);

    const processTransaction = (e) => {
        e.preventDefault();

        const [title, shortDescription, description, price] = e.target.childNodes;
        const data = {title: title.value, shortDescription: shortDescription.value, description: description.value, userId: user.id, artistId: profileData['user_id'], price: price.value };

        new Facade().post('/api/transactions', data, (success) => {
            setShowSnackbar(true);
            setSnackbarMessage(success.message);
        }, (error) => {
            setShowSnackbar(true);
            setSnackbarMessage(error.message);
        })
    }

    const imgStyle = {
        borderRadius: "10px",
        width: "100px",
        height: "100px",
        objectFit: "cover",
        boxShadow: "1px 1px 5px 1px #aaa"
    }

    useEffect(() => {
        setLoading(true);

        if (user.hasOwnProperty('id')) {
            checkProfileUser();
            fetchProfileData();
    
            if (!error) {
                setLoading(false);
            } else {
                window.location = '/404';
            }
        }
    }, [match, error, user, fetchProfileData, checkProfileUser]);

    // LOGIC
    return (
        <div style={{flexDirection: "column", display: "flex", alignItems:"center", width: "100%"}}>
        {<Snackbar hidden={showSnackbar} props={{ message: snackbarMessage, snackbarRef, error: true, showSnackbar, setShowSnackbar}}/> }

        {loading ?  <LoadingIndicator/> : (
            // TODO: refactor this
            <div className="profile-proper" style={{width: "100%"}}>
                <div className="profile header" style={{display: "flex", justifyContent: "center", height: "100px", width: "100%"}}>
                    <div className="image" style={{flex: "2"}}>
                        <img src='' style={imgStyle} alt="profile"/>
                    </div>
                    <div className="bio" style={{flex: "3", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", width: "100%"}}>
                        <p>{showFullName(profileData)}</p>
                        <i style={{padding: ".5rem 0", fontSize: "small"}}>{`Member since ${new Date(profileData['member_since']).toLocaleDateString()}`}</i>
                        <ProfileInteractions props={{isMe, user, setShowHireModal, profileData}}/>

                    </div>
                </div>
                {/* modal should close when clicked anywhere else same with hamburger */}
                {!isMe && profileData['user_classification'] === 'artist' && (<CommissionModal show={showHireModal} handleClose={(e) => setShowHireModal(false)} handleSubmit={processTransaction}/>)}
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