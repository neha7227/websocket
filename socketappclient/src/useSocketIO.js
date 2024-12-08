import { useState, useEffect, useRef } from "react";

import io from "socket.io-client";

// Function to initialize WebSocket connection with socket.io-client
export function useSocketIO(url) {
  // const url = SOCKET_URL
  const [socket, setSocket] = useState(null);
  // const [token, setToken] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const onMessage = useRef(null);
  const onDriverData = useRef(null);
  const onConnect = useRef(null);
  const onDisconnect = useRef(null);
  const onError = useRef(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // const token = Cookies.get("authToken");

        const socketInstance = io(url, {
          transports: ["websocket"], // Force WebSocket transport
          // auth: {
          //   token: `carrum ${token}`, // Adjust token format if required
          // },
          secure: true,
          // reconnectionAttempts: 3, // Retry connection if it fails
          // reconnectionDelay: 1000, // Retry delay in milliseconds
        });

        console.log(socketInstance, "socketInstance");

        // Set up event listeners for socket.io
        socketInstance.on("connect", () => {
          if (onConnect.current) onConnect.current();
          console.log("Socket.IO connected");
        });

        socketInstance.on("message", (data) => {
          if (onMessage.current) onMessage.current(data);
          console.log("Received message:", data);
        });

        socketInstance.on("getDriverData", (data) => {
          if (onDriverData.current) onDriverData.current(data);
          console.log("Received Driver Data:", data);
        });

        socketInstance.on("disconnect", () => {
          if (onDisconnect.current) onDisconnect.current();
          console.log("Socket.IO disconnected");
        });

        socketInstance.on("error", (error) => {
          if (onError.current) onError.current(error);
          console.error("Socket.IO error:", error);
          setConnectionError(error);
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error("Error establishing Socket.IO connection:", error);
        setConnectionError(error);
      }
    };

    initializeSocket();

    // Cleanup socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Method to send data over the WebSocket connection
  const sendMessage = (message) => {
    if (socket && socket.connected) {
      socket.emit("message", message);
    } else {
      console.error("Socket.IO is not connected");
    }
  };

  // Setters for handling socket events
  const setOnMessage = (callback) => {
    onMessage.current = callback;
  };

  const setOnDriverData = (callback) => {
    onDriverData.current = callback;
  };

  const setOnConnect = (callback) => {
    onConnect.current = callback;
  };

  const setOnDisconnect = (callback) => {
    onDisconnect.current = callback;
  };

  const setOnError = (callback) => {
    onError.current = callback;
  };

  return {
    socket,
    connectionError,
    sendMessage,
    setOnMessage,
    setOnDriverData,
    setOnConnect,
    setOnDisconnect,
    setOnError,
  };
}
