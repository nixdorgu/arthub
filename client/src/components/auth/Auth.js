import {useEffect} from 'react'
import {useAuth} from '../../context/AuthContext';
import {setToken} from '../../utils/Tokens';

export default function Auth({match}) {
    const auth = useAuth();

    useEffect(() => {
        if (!auth.authenticated) {
            setToken(match.params.token);
            auth.setAuthenticated(true);
        }
        
        window.location.replace('/')
    });

    return null;
}
