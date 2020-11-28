import {createContext, useState, useEffect} from 'react';
import Facade from '../utils/Facade';
import {getToken} from '../utils/Tokens';

export const AuthContext = createContext({
    authenticated: false,
    user: {},
    setAuthenticated: null,
});


export function AuthProvider ({children}) {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState({});

    function getAuthState() {
        const token = getToken();

        if (token) {
            new Facade()
            .post(
                '/api/verify', {token},
                (response) => {
                    let user = response.user;
                    user = {id: user['user_id'], first_name: user['first_name'], last_name: user['last_name'], email: user['email'], user_classification: user['user_classification']}

                    // authenticated
                    // if res contains token then setToken('arthub_token', response.token)
                    setAuthenticated(true);
                    setUser(user);
                    // alert(response)
                    console.log(user)
                },
                (error) => {
                    // invalid token ie not authenticated
                    setAuthenticated(false);
                }
            )

        }
    }

    useEffect(() => {
        getAuthState();
    }, [authenticated]);
    
    return (
        <AuthContext.Provider value={{authenticated, setAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}