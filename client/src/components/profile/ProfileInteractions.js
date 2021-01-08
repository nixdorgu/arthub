import React from 'react';
import { fetch } from '../../utils/fetch';

function ProfileInteractions(props) {
    const { isMe, setShowHireModal, setShowSnackbar, setSnackbarMessage, profileData, user } = props.props;

    const chatArtist = () => {
        fetch("/api/messages/room", {
            method: "POST",
            data: {user_id: user.id, user_classification: user['user_classification'], id: profileData['user_id'], classification: profileData['user_classification'] },
            success: (success) => {
                window.location.href = `/messages/${success.room.room_id}`
            },
            error: (error) => {
                setShowSnackbar(true);
                setSnackbarMessage(error.message);
            }
        });
    }

    const viewMessages = () => window.location = '/messages';

    const options = {
        message: isMe ? 'View Messages' : 'Message',
        profile: isMe ? 'Edit Profile' : 'Hire'
    }

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

export default ProfileInteractions;