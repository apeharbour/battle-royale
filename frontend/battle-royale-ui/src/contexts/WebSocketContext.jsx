// src/contexts/WebSocketContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [ws, setWs] = useState(null);
    const [countdownEndTime, setCountdownEndTime] = useState(null);

    useEffect(() => {
        const webSocket = new WebSocket('wss://dm2d6wt8a5.execute-api.eu-north-1.amazonaws.com/production/');

        webSocket.onopen = () => {
            console.log('WebSocket Connected');
            setWs(webSocket);
        };

        webSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.action === 'startInitialCountdown') {
                // Assume the message includes the endTime for the countdown
                setCountdownEndTime(message.endTime);
            }
        };

        webSocket.onclose = () => console.log('WebSocket Disconnected');

        return () => {
            webSocket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ ws, countdownEndTime }}>
            {children}
        </WebSocketContext.Provider>
    );
};
