import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }
    
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'https://testing-server-z2ib.onrender.com', {
      auth: {
        token,
      },
    });
    
    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, token]);
  
  return { socket };
}
