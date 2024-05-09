import React, { useState, useEffect } from "react";
import zxcvbn from "zxcvbn"; // A library for password strength estimate
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import BackgroundVideo from "../assets/bg.mp4";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  // useeffect
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  // handleChange jo value change dekhaega---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Calculate and update password strength
    if (name === "password") {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  };

  // handle validation sab theek hai ya nhi---
  const handleValidation = () => {
    const { username, password } = formData;
    if (password === "") {
      toast("Email and Password is required.", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "bg-red-700 text-white p-4 rounded",
      });
      return false;
    } else if (username === "") {
      toast("Email and Password is required.", {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "bg-red-700 text-white p-4 rounded",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, password } = formData;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast(data.msg, {
          position: toast.POSITION.BOTTOM_LEFT,
          className: "bg-red-700 text-white p-4 rounded",
        });
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
        console.log(username, password);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center h-screen relative">
        <video
          src={BackgroundVideo}
          muted
          autoPlay
          loop
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        ></video>
        <div className="z-10">
          <div className="text-white text-center bg-blue-500 font-bold text-2xl">
            Free_Chat
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
          >
            <h2 className="text-2xl font-bold mb-6">Login</h2>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                value={formData.username}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your password"
                required
              />
              <p
                className={`text-sm mt-2 ${
                  passwordStrength === 3 || passwordStrength === 4
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                Password Strength:{" "}
                {
                  ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"][
                    passwordStrength
                  ]
                }
              </p>
            </div>

            <div className="flex items-center justify-center ">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center">
              Don't have an account ?{" "}
              <Link
                className="font-bold text-blue-500 hover:text-blue-900"
                to="/register"
              >
                REGISTER
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
