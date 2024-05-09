import React,{useEffect, useState} from 'react'
import welcome from "../assets/welcome.gif"

const Welcome = () => {
  const [userName, setUserName] = useState("");
  useEffect( () => {
    const fetchData =async()=>{

      setUserName(
        await JSON.parse(
          localStorage.getItem("chat-app-user")
          ).username
          );
        }
        fetchData();
  }, []);
  return (
    <>
    {/* jab user open kare tab wala welcome message */}
     <div className='flex flex-col gap-4'>
        <img src={welcome} alt="welcome guys" className='h-[75vh]'/>
        <h1 className='text-center font-bold text-2xl'>
        Welcome, <span className='text-blue-500 underline '>{userName}!</span>
        </h1>
        <h3 className='text-center font-semibold '>Please select a chat to Start messaging.</h3>
     </div>
    </>
  )
}

export default Welcome
