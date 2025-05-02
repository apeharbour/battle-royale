// src/contexts/WebSocketContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [countdownEndTime, setCountdownEndTime] = useState(null);

  useEffect(() => {
    const webSocket = new WebSocket(
      "wss://dm2d6wt8a5.execute-api.eu-north-1.amazonaws.com/production/"
    );

    webSocket.onopen = () => {
      console.log("WebSocket Connected");
      setWs(webSocket);
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.action === "startInitialCountdown") {
        // still storing endTime in context, even if Timer chooses to read ws directly
        setCountdownEndTime(message.endTime);
      }
    };

    webSocket.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      webSocket.close();
    };
  }, []);

  // memoize so that { ws, countdownEndTime } isn't a new object each render
  const value = useMemo(
    () => ({ ws, countdownEndTime }),
    [ws, countdownEndTime]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
