import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { sendMessageRoute, getAllMessageRoute } from "../utils/APIRoutes";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem("chat-app-user"));
      const response = await axios.post(getAllMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    fetchData();
  }, [currentChat]);

  const handleSendMsg = (msg) => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem("chat-app-user"));
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    };
    fetchData();
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(()=>{
    arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage])
  },[arrivalMessage]);

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  },[messages])

  return (
    <>
      {currentChat && (
        <div className="h-[85vh] flex flex-col">
          {/* chat header starts here */}
          <div className="chat-header bg-blue-700 p-4 border-t-2">
            <div className="user-details flex items-center justify-between gap-2">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt=""
                  className="rounded-full h-12 w-12"
                />
              </div>
              <div className="username text-white">
                <h3 className="font-bold text-2xl uppercase">
                  {currentChat.username}
                </h3>
              </div>
              <button
                className="bg-red-500 text-white rounded-md p-2 border-2
              hover:bg-red-600 "
              >
                <Logout />
              </button>
            </div>
          </div>
          {/* chat message content starts here */}
          <div className="chat-messages flex-grow overflow-y-auto">
            {messages.map((message) => (
              <div
                key={uuidv4()}
                className={`${
                  message.fromSelf ? "flex justify-end" : "flex justify-start"
                } items-end`}
              >
                <div
                  className={`message p-2 mt-2 rounded-md ${
                    message.fromSelf ? "bg-blue-500 text-white" : "bg-gray-300"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          {/* chat input starts */}
          <div className="chatinput flex-shrink-0 ">
            <ChatInput handleSendMsg={handleSendMsg} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatContainer;
