import React, { useCallback, useEffect, useState, useRef } from 'react';
import Snackbar from '../Snackbar';
import {useAuth} from "../../context/AuthContext";

import Facade from '../../utils/Facade';
import CommissionModal from '../modals/CommissionModal';
import UserFlow from '../../utils/UserFlow';
import ProfileHeader from './ProfileHeader';
import isEmptyObject from '../../tests/isEmptyObject';
import PageNotFound from '../PageNotFound';

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

    const checkProfileUser = useCallback(() => isEmptyObject(match.params) ? setIsMe(true) : setIsMe(false), [match.params]);
    const fetchProfileData = useCallback(() => {
        const id = match.params.id || user.id;

        if (isEmptyObject(profileData)) {
            new Facade().get(`/api/profile/${id}`,
                (success) => {
                    const ownProfile = success.user_id === user.id;

                    setError(false);
                    setProfileData(() => success);
                    setIsMe(ownProfile);

                    if (success.hasOwnProperty('source')) {
                        const source = success.source;

                        if (success.source.hasOwnProperty('type')) {
                            const buffer = Buffer.from(source.image)
                            const image = `data:${source.type};base64,${buffer.toString('base64')}`;
                            setSrc(image);
                        } else {
                            setSrc(source);
                        }
                    }
                },
                (error) => {
                    setError(true);
                });
            }       
    }, [match, user, profileData]);

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
        boxShadow: "1px 1px 3px 1px #ccc"
    }

    useEffect(() => {
        setLoading(true);

        if (user.hasOwnProperty('id')) {
            checkProfileUser();
            fetchProfileData();   
            setLoading(false);
        }
        
    }, [match, user, fetchProfileData, checkProfileUser]);

    // LOGIC
    return (
        <div style={{flexDirection: "column", display: "flex", alignItems:"center", width: "100%"}}>
        {<Snackbar hidden={showSnackbar} props={{ message: snackbarMessage, snackbarRef, error: true, showSnackbar, setShowSnackbar}}/> }

        <UserFlow isLoading={loading} 
        isError={error}
        error={<PageNotFound/>}
        success={
            <div className="profile-proper" style={{width: "80%"}}>
                <ProfileHeader isMe={isMe} user={user} setShowHireModal={setShowHireModal} profileData={profileData} src={src} imgStyle={imgStyle}/>
                {/* modal should close when clicked anywhere else same with hamburger */}
                {!isMe && profileData['user_classification'] === 'artist' && (<CommissionModal show={showHireModal} handleClose={(e) => setShowHireModal(false)} handleSubmit={processTransaction}/>)}
                <div style={{lineBreak: "normal", wordBreak: "break-word"}}>
                {JSON.stringify(profileData)}
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