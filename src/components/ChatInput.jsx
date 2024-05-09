import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiFromInput = () => {
    if (showEmojiPicker === true) {
      setShowEmojiPicker(!showEmojiPicker);
    }
  };

// (_) this use as an event
  const handleEmojiClick = (_) => {
    let message = msg;
    message += _.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      console.log(msg);
    }
  };
  return (
    <>
      <div className="p-4 bg-gray-200">
        <div className="flex items-center">
          <div className="relative mr-2">
            <button
              className="text-2xl text-blue-500 focus:outline-none"
              onClick={handleEmojiPickerhideShow}
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-0 mb-12">
                <Picker
                  onEmojiClick={handleEmojiClick}
                  height={400}
                  width={350}
                />
              </div>
            )}
          </div>
          <form
            className="flex-grow flex items-center border rounded-md px-4"
            onSubmit={(event) => sendChat(event)}
          >
            <input
              className="flex-grow py-2 px-4 rounded-md focus:outline-none border-r-0"
              type="text"
              placeholder="Type your message here"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              onClick={handleEmojiFromInput}
            />
            <button
              type="submit"
              className="p-2 ml-2 bg-blue-700 text-white rounded-md flex items-center gap-2 hover:animate-pulse"
            >
              <span className="hidden md:inline-block">Send</span>
              <IoMdSend />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
