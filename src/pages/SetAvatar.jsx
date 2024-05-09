import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loader from "../assets/loader.gif";
import axios from "axios";
import { Buffer } from "buffer";
import { setAvatarRoute } from "../utils/APIRoutes";

const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // If rate-limited, wait for a specified time before retrying
          setTimeout(
            () => fetchData(),
            error.response.headers["retry-after"] * 2000
          );
        } else {
          // Handle other errors
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast("Please select an image", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "bg-red-700 text-white p-4 rounded",
      });
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast("Error setting your avatar, Please try again", {
          position: toast.POSITION.BOTTOM_LEFT,
          className: "bg-red-700 text-white p-4 rounded",
        });
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center bg-blue-950 items-center h-screen">
          <img src={loader} alt="loader" className="h-96 w-96" />
        </div>
      ) : (
        <div className="text-center bg-blue-950 h-screen flex flex-col items-center justify-center ">
          <div className="title mb-4">
            <h1 className="text-3xl font-bold">
              Pick an avatar for your profile
            </h1>
          </div>
          <div className="avatars grid grid-cols-4 gap-4">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar cursor-pointer flex justify-center ${
                  selectedAvatar === index
                    ? "border-4 border-blue-500 rounded"
                    : ""
                }`}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => setSelectedAvatar(index)}
                  className="w-16 h-16 object-cover "
                />
              </div>
            ))}
          </div>
          <button
            className="submit mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={setProfilePicture}
          >
            Set as Profile Picture
          </button>
        </div>
      )}
    </>
  );
};

export default SetAvatar;
