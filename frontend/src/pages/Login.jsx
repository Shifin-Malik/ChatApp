import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-around px-10 sm:px-8 py-10 sm:py-16 gap-8 sm:gap-16 max-sm:flex-col backdrop-blur-md bg-black/20">
      <img src={assets.logo_big} alt="Logo" className="w-[min(60vw,250px)]" />

      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white/10 border border-white/30 text-white backdrop-blur-lg rounded-xl shadow-xl p-6 sm:p-8 flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{currState}</h2>
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 cursor-pointer"
            />
          )}
        </div>

        {currState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
            className="p-3 rounded-md border border-gray-500 bg-white/10 text-white placeholder-gray-300"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="p-3 rounded-md border border-gray-500 bg-white/10 text-white placeholder-gray-300"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="p-3 rounded-md border border-gray-500 bg-white/10 text-white placeholder-gray-300"
            />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Provide a short bio..."
            className="p-3 rounded-md border border-gray-500 bg-white/10 text-white placeholder-gray-300"
          />
        )}

        <button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-md"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" className="accent-violet-500" />
          Agree to the terms of use & privacy policy
        </label>

        <p className="text-sm text-center text-gray-300">
          {currState === "Sign up" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-violet-400 hover:underline cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-violet-400 hover:underline cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                  setIsDataSubmitted(false);
                }}
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
