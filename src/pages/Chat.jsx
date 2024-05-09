import React, {useState, useEffect, useRef} from 'react'
import axios from "axios"
import { useNavigate} from "react-router-dom"
import Contacts from '../components/Contacts'
import { allUsersRoute, host } from '../utils/APIRoutes';
import io from "socket.io-client"


const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  // for chat space--
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect( () => {
    const fetchData = async()=>{
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem("chat-app-user")
          )
        );
      }
    };
    fetchData();
  }, []);

  useEffect( () => {
   const fetchData = async()=>{
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
   }
   fetchData()
  }, [currentUser]);

  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id)
    }
  },[currentUser])


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

// start all contacts---
  return (
    <>
      <div className="flex items-center justify-center bg-blue-950">
        <div className='min-h-screen w-4/5'>
          <Contacts contacts={contacts} changeChat={handleChatChange}
          currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        </div>

    </div>
    </>
  )
}

export default Chat
