import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({children}) {
    const [socket, setSocket] = useState();
    const id = useContext(AuthContext).user?.id;

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {query: {id}})
        setSocket(newSocket);

        return () => newSocket.close(); // cleanup
    }, [id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
