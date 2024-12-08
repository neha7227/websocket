import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSocketIO } from "./useSocketIO";

const url = "wss://x5dfsg-4005.csb.app";
//init socket

const socket2 = io(url, {
  transports: ["websocket"],
});
console.log(socket2, "socket2");

function App() {
  const {
    socket,
    connectionError,
    sendMessage,
    setOnMessage,
    setOnDriverData,
    setOnConnect,
    setOnDisconnect,
    setOnError,
  } = useSocketIO(url);
  // console.log(socket, "socket");

  const [driverData, setDriverData] = useState(null);

  //Old method 1
  useEffect(() => {
    socket2.on("connect", () => {
      console.log("socket connected");
      socket2.emit("sendDriverData", { frequency: "weekly" });
      // socket.on("getDriverData", (data) => {
      //   console.log("data received from BE :", data);
      // });
    });
    socket2.on("getDriverData", (data) => {
      console.log("data received from BE :", data);
    });
    return () => {
      if (socket2) {
        socket2.off("message"); // Remove event listeners
        socket2.off("connect"); // Remove event listeners
        socket2.off("getDriverData");
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Add a listener for the "getDriverData" event
    // const handleDriverData = (data) => {
    //   console.log("Received driver data:", data);
    //   setDriverData(data);
    // };

    // socket.on("getDriverData", handleDriverData);

    setOnDriverData((data) => {
      // if (data) {
      console.log("Received driver data on client:", data);
      setDriverData(data); // Update the driver data in state
      // }
    });

    // Handle connection and error events
    setOnConnect(() => {
      console.log("Socket connected!");

      // Send a message to the server with the "frequency" data
      const message = { frequency: "monthly" };
      socket.emit("sendDriverData", message);
    });

    setOnError((error) => {
      console.error("Socket connection error:", error);
    });

    // Clean up listeners on component unmount or when socket changes
    return () => {
      socket.off("getDriverData");
      socket.disconnect();
    };
  }, [socket, setOnConnect, setOnError]);

  return (
    <div className="App">
      <p>Learn Socket</p>
    </div>
  );
}

export default App;
