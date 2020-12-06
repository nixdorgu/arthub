import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function EditProfile() {
    const user = useContext(AuthContext).user;
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);

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

    function noChanges() {
        return initialData.firstName === firstName && initialData.lastName === lastName;
    }

    useEffect(() => {
        setFirstName(user.last_name);
    }, [user])

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
             console.log('hi')}}>
                <div>
                    <input type="file" name="filename" accept="image/jpeg, image/png" onChange={e => preview(e)}/>
                    <img id="profile" src="#" alt="profile" style={{maxWidth: "50vw"}}/>
                </div>
                <div>
                    <label htmlFor="firstName"></label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName" name="firstName"/>
                </div>
                <div>
                    <label htmlFor="lastName"></label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" name="lastName"/>
                </div>
                {
                    user.user_classification === 'artist' ? (
                        <div>
                            Genres here
                        </div>
                    ) : (
                        <div>
                            No gneres here
                        </div>
                    )
                }
                <button disabled={noChanges}>BUTTON</button>
            </form>
        </div>
    )
}
