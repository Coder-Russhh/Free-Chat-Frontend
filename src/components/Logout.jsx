import React from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove "chat-app-user" key from local storage
    localStorage.removeItem("chat-app-user");
    // Redirect to login page or any other route
    navigate("/login");
  };
  return (
    <div className="flex items-center" onClick={handleLogout}>
      <RiLogoutBoxLine className="text-xl mr-2" />
      <h1 className="font-semibold">Logout</h1>
    </div>
  );
};

export default Logout;
