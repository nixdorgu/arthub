import React from 'react'
import showFullName from '../../tests/showFullName';
import ProfileInteractions from './ProfileInteractions';

export default function ProfileHeader({isMe, user, setShowHireModal, profileData, src, imgStyle}) {
    return (
        <div className="profile header" style={{display: "flex", justifyContent: "center", alignItems: "center", height: "max-content", width: "100%"}}>
                    <div className="image" style={{marginRight: "3vw"}}>
                        <img src={src} style={imgStyle} alt="profile"/>
                    </div>
                    <div className="bio" style={{display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", width: "100%"}}>
                        <p>{showFullName(profileData)}</p>
                        <i style={{padding: ".5rem 0", fontSize: "1.5vh"}}>{`Member since ${new Date(profileData['member_since']).toLocaleDateString()}`}</i>
                        <ProfileInteractions props={{isMe, user, setShowHireModal, profileData}}/>

                    </div>
                </div>
    )
}
