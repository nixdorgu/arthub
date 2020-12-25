import { createContext, useState, useEffect, useContext } from "react";
import io from 'socket.io-client';

export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const ENDPOINT = 'http://localhost:5000';
  const [socket, setSocket] = useState(() => io(ENDPOINT));

  useEffect(() => {
    return () => socket.disconnect();
  });

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
