import {createContext, useState, useEffect, useContext} from 'react';
import Facade from '../utils/Facade';
import {getToken} from '../utils/Tokens';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider ({children}) {
    const [authenticated, setAuthenticated] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = getToken();

        if (token) {
            new Facade()
            .post(
                '/api/verify', {token},
                (response) => {
                    setAuthenticated(true);

                    let user = response.user;
                    user = {id: user['user_id'], first_name: user['first_name'], last_name: user['last_name'], email: user['email'], user_classification: user['user_classification']}

                    // authenticated
                    // if res contains token then setToken('arthub_token', response.token)
                    setUser(user);
                    // alert(response)
                    console.log(user)
                },
                (error) => {
                    console.log(error)
                    // invalid token ie not authenticated
                    setAuthenticated(false);
                }
            )

        } else {
            setAuthenticated(false);
        }
    }, [authenticated]);
    
    return (
        <AuthContext.Provider value={{authenticated, setAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}