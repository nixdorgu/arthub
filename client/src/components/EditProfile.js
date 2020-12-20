import React, {useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function EditProfile() {
    const {user} = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

    // fetch profile image url
    const initialData = {
        firstName: user.first_name,
        lastName: user.last_name,
    }


    function preview(e) {
        e.preventDefault();
        const profile = document.querySelector('#profile');
        profile.src = URL.createObjectURL(e.target.files[0]);
    }

    function hasChanges(e, handler) {
        handler(e.target.value);
        const hasChanged = initialData.firstName === firstName || initialData.lastName === lastName; 
        setIsDisabled(!hasChanged);
    }

    useEffect(() => {
        if (user.hasOwnProperty('id')) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
        }
    }, [user])

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
             console.log('hi')}}>
                 <div className="initial-photo">
                 <img id="profile" src="#" alt="profile" style={{maxWidth: "50vw"}}/>

                 </div>
                <div>
                    <input type="file" name="filename" accept="image/jpeg, image/png" onChange={e => preview(e)}/>
                </div>
                <div className="form-element">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => hasChanges(e, setFirstName)} id="firstName" name="firstName"/>
                </div>
                <div className="form-element">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => hasChanges(e, setLastName)} id="lastName" name="lastName"/>
                </div>
                {
                    user.user_classification === 'artist' ? (
                        <div>
                            Genres here
                        </div>
                    ) : (
                        <div></div>
                    )
                }
                <button disabled={isDisabled}>Save Changes</button>
            </form>
        </div>
    )
}
