import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSocketIO } from "./useSocketIO";

const url = "wss://x5dfsg-4005.csb.app";
//init socket

const socket2 = io(url, {
  transports: ["websocket"],
});
console.log(socket2, "socket");
function App() {
  const {
    socket,
    connectionError,
    sendMessage,
    setOnMessage,
    setOnConnect,
    setOnDisconnect,
    setOnError,
  } = useSocketIO(url);
  console.log(socket, "socket");

  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    // Listen for the "getDriverData" event (response from the server)
    setOnMessage((data) => {
      // if (data) {
      console.log("Received driver data:", data);
      setDriverData(data); // Update the driver data in state
      // }
    });

    // Optionally, handle the connect and error events
    setOnConnect(() => {
      console.log("Socket connected!");

      // Send a message to the server with the "frequency" data
      const message = { frequency: "weekly" };
      socket.emit("sendDriverData", message); // Emit the "sendDriverData" event with the message
    });

    // Handle socket connection errors
    if (connectionError) {
      console.error("Socket connection error:", connectionError);
    }

    socket2.on("connect", () => {
      console.log("connected");
      socket2.on("getDriverData", (data) => {
        console.log("data received from BE :", data);
      });
    });

    // Clean up on unmount
    return () => {
      if (socket) {
        // socket.off("message"); // Remove event listeners
        socket.off("getDriverData");
      }
    };
  }, [setOnMessage, setOnConnect]);
  console.log(driverData, "driverData");
  return (
    <div className="App">
      <p>Learn Socket</p>
    </div>
  );
}

export default App;
