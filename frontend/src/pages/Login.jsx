import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assets";

import {
  Mail,
  Lock,
  User,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [tab, setTab] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);
 
  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (tab === "signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(tab, {
      fullName,
      email,
      password,
      bio,
    });
  };

  const inputClasses =
    "pl-10 w-full p-3 text-sm  dark:bg-(--foreground) rounded-(--border-radius-xl)  border-2 border-(--border-color) bg-primary text-black dark:text-(--text-color) placeholder-(--text-color-input)  focus:outline-none focus:ring-2 focus:ring-(--color-green)";
  const iconClasses = "absolute left-3 top-1/2  -translate-y-1/2 text-(--icon-color) hover:text-[var(--icon-color-hover)]";

  return (
    <div className="min-h-screen bg-primary dark:bg-(--background) px-6 py-12 flex items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-around gap-8">
        {/* Left Branding */}
        <div className="text-center md:text-left">
          <img src={assets.logo_icon} alt="Logo" className="md:w-48 w-32 mx-auto md:mx-0" />
         
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary mt-4">Textrox</h1>
        </div>
            
        {/* Right Form Section */}
        <div className="w-full max-w-md bg-secondary dark:bg-(--foreground)  border-2 border-(--border-color) text-black backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8">
          <Tabs className="" defaultValue="login" value={tab} onValueChange={setTab} >
            <TabsList className="w-full justify-between bg-primary dark:bg-(--foreground) h-12 p-1  shadow-lg">
              <TabsTrigger
                className="w-full  data-[state=active]:bg-green data-[state=active]:text-primary rounded-2xl  font-semibold text-xs md:text-sm"
                value="login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="w-full  data-[state=active]:bg-green data-[state=active]:text-primary rounded-2xl  font-semibold text-xs md:text-sm"
                value="signup"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login">
              <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 mt-4">
                <div className="relative">
                  <Mail className={iconClasses} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className={inputClasses}
                  />
                </div>

                <div className="relative">
                  <Lock className={iconClasses} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className={`${inputClasses} pr-10`}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="text-(--icon-color) hover:text-[var(--icon-color-hover)]" size={20} /> : <Eye className="text-(--icon-color) hover:text-[var(--icon-color-hover)]" size={20} />}
                  </div>
                </div>

                <Button
                  type="submit"
                  
                >
                  Login Now
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP FORM */}
            <TabsContent value="signup">
              <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 mt-4">
                {!isDataSubmitted ? (
                  <>
                    <div className="relative">
                      <User className={iconClasses} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div className="relative">
                      <Mail className={iconClasses} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div className="relative">
                      <Lock className={iconClasses} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className={`${inputClasses} pr-10`}
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative">
                    <Info className="absolute left-3 top-4 text-gray-400" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Write a short bio..."
                      className="pl-10 w-full p-3 rounded-md border border-gray-500 bg-white/10 text-black placeholder-gray-400"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className=""
                >
                  {isDataSubmitted ? "Create Account" : "Continue"}
                </Button>
              </form>

              {isDataSubmitted && (
                <p
                  className="text-sm text-center text-[#00A9FF] underline cursor-pointer mt-3"
                  onClick={() => setIsDataSubmitted(false)}
                >
                  ← Go Back
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
