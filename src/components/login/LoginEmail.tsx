import React, { startTransition, useEffect, useRef, useState } from "react";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import eye from "../../assets/login/eye.svg";
import eyeClose from "../../assets/login/eyeClose.svg";
import { motion, AnimatePresence } from "framer-motion";
import ForgotPass from "./ForgotPass";
import { useDispatch, useSelector } from "react-redux";
import "../../pages/login/login.css";
import {
  setAuthModel,
  setCaptchaOpen,
  setLoginOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import Captch from "./Captch";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../pages/profile/error/ErrorSlice";
import CloseBtn from "../../assets/svg/CloseBtn";
import { selectTheme } from "../../pages/search/slice/ThemeSlice";

interface LoginEmailProps {
  handleBack: () => void; // Accept handleBack as a prop
}

const LoginEmail: React.FC<LoginEmailProps> = ({ handleBack }) => {
  const [key, setKey] = useState("");
  const darkmode = useSelector(selectTheme);
  const dispatch = useDispatch();
  const { openCaptcha } = useSelector((state: any) => state.model);
  const [forgot, setForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigate = useNavigate();
  const currentLocation = useLocation(); // Use the `useLocation` hook from react-router-dom
  const previousPathname = useRef(currentLocation.pathname);

  useEffect(() => {
    if (previousPathname.current !== currentLocation.pathname) {
      setIsVisible(false);
      closeAllModals();
    }
    previousPathname.current = currentLocation.pathname;
  }, [currentLocation.pathname]);

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 6 && password.length <= 25;
    // const containsLetters = /[a-zA-Z]/.test(password);
    // const containsNumbers = /\d/.test(password);
    // return lengthValid && containsLetters && containsNumbers;
    return lengthValid;
  };

  const validateEmail = (email: string) => {
    return email.length >= 6 && email.length <= 40;
  };

  const toggleVisibility = (login: boolean, signup: boolean) => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(login));
      dispatch(setSignupOpen(signup));
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      console.log("not correct");
      dispatch(showToast({ message: "请输入5-25位用户名", type: "error" }));
      return;
    }
    try {
      dispatch(setCaptchaOpen(true));
      // setIsVisible(false);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleClose = () => {
    dispatch(setLoginOpen(false));
    dispatch(setSignupOpen(false));
    dispatch(setAuthModel(false));
    setIsVisible(false);
  };

  const variants = {
    hidden: { y: 300 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
      y: "100%",
      transition: { type: "tween", duration: 0.5 },
    },
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      setIsVisible(false);
    }
  };

  const show = () => {
    console.log("show");
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Conditionally render the ForgotPass component if `forgot` is true */}
      {openCaptcha && (
        <Captch
          key={key}
          setKey={setKey}
          setIsVisible={setIsVisible}
          isLogin={true}
          username={email}
          password={password}
        />
      )}
      {forgot ? (
        <ForgotPass forgot={forgot} setForgot={setForgot} />
      ) : (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="login_box h-[480px] fixed bottom-0 z-[99999] w-screen  py-4 px-[20px] bg-[#fff] dark:bg-[#2B2B2D] dark:text-white rounded-t-2xl"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col justify-center items-center gap-[16px]">
                <motion.p className="w-[60px] h-[4px] drag_line mt-[1px] mb-[12px] cursor-pointer bg-[#fff]"></motion.p>
                <div className=" flex justify-center items-center w-full pb-[20px] relative">
                  {/* <img
                    className="p-3 cursor-pointer"
                    src={back}
                    alt="Back"
                    onClick={handleBack}
                  /> */}
                  <div className=""></div>
                  <h2 className="text-[18px] font-[600] leading-[20px] text-black dark:text-white">
                    登录
                  </h2>
                  <div
                    className="p-3 cursor-pointer fixed z-[999991] right-[30px]"
                    onClick={handleClose}
                  >
                    {darkmode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z"
                          fill="white"
                          fill-opacity="0.8"
                        />
                      </svg>
                    ) : (
                      <CloseBtn />
                    )}
                  </div>
                </div>

                <form
                  onSubmit={handleLogin}
                  className="w-full flex flex-col gap-[40px] px-[10px]"
                >
                  <div className="relative ">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocusedEmail(true)}
                      onBlur={() => setIsFocusedEmail(email !== "")}
                      className="w-full px- py-2 bg-[#fff] border-b-[1px] border-b-[#777] dark:border-b-white/40 focus:outline-none text-black placeholder-[#5B5B5B] dark:bg-[#2B2B2D] dark:text-white"
                      required
                      placeholder="输入用户名"
                    />
                    {/* <label
                      htmlFor="email"
                      className={`absolute text-[12px] left-4 text-[#5B5B5B] transition-all duration-300 pointer-events-none ${
                        isFocusedEmail || email
                          ? "top-[-8px] text-xs text-blue-500"
                          : "top-1/2 transform -translate-y-1/2"
                      }`}
                    >
                      请输入账号，手机号，邮箱
                    </label> */}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocusedPassword(true)}
                      onBlur={() => setIsFocusedPassword(password !== "")}
                      className="w-full px- py-2 bg-[#fff] border-b-[1px] border-b-[#777] dark:border-b-white/40 focus:outline-none text-black placeholder-[#5B5B5B] dark:bg-[#2B2B2D] dark:text-white"
                      required
                      placeholder="输入登录密码"
                    />
                    {/* <label
                      htmlFor="password"
                      className={`absolute text-[12px] left-4 transition-all text-[#5B5B5B] pointer-events-none ${
                        isFocusedPassword || password
                          ? "top-0 text-xs text-blue-500 -translate-y-full"
                          : "top-1/2 -translate-y-1/2"
                      }`}
                    >
                      请输入密码
                    </label> */}
                    <div
                      onClick={show}
                      className=" w-[50px] flex justify-end items-center absolute right-0 bottom-[15px] h-[10px]"
                    >
                      <img
                        className=""
                        src={showPassword ? eye : eyeClose}
                        alt="Show Password"
                      />
                    </div>
                  </div>
                  <div className=" flex justify-between">
                    <div
                      onClick={() => toggleVisibility(false, true)}
                      className={`text-left mt-[-10px] text-sm cursor-pointer ${
                        darkmode ? " text-white" : " text-black"
                      }`}
                    >
                      注册账号
                    </div>
                    <div
                      onClick={() => setForgot(true)} // When clicked, set `forgot` to true to show the ForgotPass component
                      className="text-left mt-[-10px] text-[#fe58b5] text-sm cursor-pointer"
                    >
                      忘记密码？
                    </div>
                  </div>

                  <button
                    disabled={!validatePassword(password)}
                    type="submit"
                    className={`w-full text-[14px] font-[600] leading-[22px]  mt-[20px] py-[10px] px-[16px] rounded-[80px]  ${
                      !validatePassword(password)
                        ? "login_button text-white"
                        : "next_button text-[#fff]"
                    } transition duration-300 ease-in-out`}
                  >
                    登录
                  </button>
                </form>

                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default LoginEmail;
