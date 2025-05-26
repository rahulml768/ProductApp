import { io } from "socket.io-client";

let socketInstance = null;

//getSocket function
const getSocket = () => {
  if (!socketInstance) {
    //connected with server
    socketInstance = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socketInstance;
};

//receive messages
export const receiveMessage = (eventName, cb) => {
  const socket = getSocket();
  socket.on(eventName, cb);
};
//send messages
export const sendMessage = (eventName, data) => {
  const socket = getSocket();
  socket.emit(eventName, data);
};
