import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import ChatContainer from "./ChatContainer";
import Welcome from "./Welcome";

const Contacts = ({
  contacts,
  changeChat,
  currentChat,
  currentUser,
  socket,
}) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(localStorage.getItem("chat-app-user"));
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    // Assuming changeChat is a function you have elsewhere
    changeChat(contact);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Top Bar (Logo, App Name, and Current User) */}
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="logo" className="w-8 h-8 mr-4" />
            <h3 className="text-3xl font-bold ">
              Free_Chat
            </h3>
          </div>
          <div className="flex items-center border-2 border-white rounded-lg p-2">
            <div className="avatar mr-2">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>

        {/* Middle Section (Contacts List) */}
        <div className="flex-1 flex bg-white">
          <div className="w-1/4 p-4 bg-gray-100 border-r-2 border-gray-300 overflow-y-auto">
            <div className="contacts flex flex-col">
              {contacts.map((contact, index) => (
                <div
                  key={contact._id}
                  className={`contact cursor-pointer flex items-center p-2 mb-2 rounded bg-blue-400 hover:bg-blue-600 hover:border-2 ${
                    index === currentSelected ? "bg-green-500" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className=" ml-2 w-full">
                    <h3 className="text-center font-bold text-2xl sm:text-xl">
                      {contact.username}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section (Chat Section) */}
          <div className="flex-1 ">
            {currentSelected === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                socket={socket}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
