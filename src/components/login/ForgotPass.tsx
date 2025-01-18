import React, { startTransition, useEffect, useState } from "react";
import back from "../../assets/login/back.svg";
import eye from "../../assets/login/eye.svg";
import Captch from "./Captch";
import Opt from "./Opt";
import { motion, AnimatePresence } from "framer-motion";
import eyeClose from "../../assets/login/eyeClose.svg";
import "../../pages/login/login.css";
import { useDispatch, useSelector } from "react-redux";
import CloseBtn from "../../assets/svg/CloseBtn";
import BackBtn from "../../assets/svg/BackBtn";
import {
  setAuthModel,
  setCaptchaOpen,
  setLoginOpen,
  setSignupOpen,
} from "../../features/login/ModelSlice";
import axios from "axios";
import Capt from "./forgot/Capt";
// import { RecoverPassword } from "../../services/userService";
import Panding from "./Panding";
import Verify from "./forgot/Varify";
import { showToast } from "../../pages/profile/error/ErrorSlice";
import ErrorToast from "../../pages/profile/error/ErrorToast";
import { selectTheme } from "../../pages/search/slice/ThemeSlice";
import SecQues from "./forgot/SecQues";
import Loader from "./Loader";
import { get_ques_forgot } from "../../services/userService";

interface ForgotPassProps {
  setForgot: React.Dispatch<React.SetStateAction<boolean>>;
  forgot: boolean;
}

const ForgotPass: React.FC<ForgotPassProps> = ({ setForgot }) => {
  const darkmode = useSelector(selectTheme);
  const [graphicKey, setGraphicKey] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { openCaptcha, captchaCode, captchaKey } = useSelector(
    (state: any) => state.model
  );
  const [panding, setPanding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showCapt, setShowCapt] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [ques_id, setQues_id] = useState<any>();
  const [ques, setQues] = useState<any>("");

  const validatePassword = (password: string) => {
    const lengthValid = password.length >= 6 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  const show = () => {
    setShowPassword(!showPassword);
  };

  const Reshow = () => {
    setShowRePassword(!showRePassword);
  };

  const passwordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validatePassword(email);
    // console.log(validationError);
    if (!validationError) {
      dispatch(showToast({ message: "请输入5-25位用户名", type: "error" }));
      return;
    }
    setShowCapt(true);
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

  const getAnswer = async () => {
    setPanding(true);
    try {
      const data = await get_ques_forgot(email, graphicKey);
      if (data) {
        // console.log(data.data);
        setQues(data.data[0].question);
        setQues_id(data.data[0].id);
        setIsVisible(false);
        setShowQuestion(true);
      } else {
        throw new Error();
      }
    } catch (error: any) {
      const msg = error.response.data.msg;
      dispatch(showToast({ message: msg, type: "error" }));
    }
    setPanding(false);
  };

  useEffect(() => {
    if (graphicKey) {
      getAnswer();
    } else {
      return;
    }
  }, [graphicKey]);
  // console.log(ques, ques_id);

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };
  return (
    <>
      {panding && <Loader />}
      {showQuestion && <SecQues graphicKey={graphicKey} email={email} ques={ques} ques_id={ques_id} />}

      {isVisible && (
        <div className=" min-h-screen flex items-center justify-center overflow-hidde fixed z-[99999]">
          {showCapt && (
            <Capt
              setGraphicKey={setGraphicKey}
              setShowCapt={setShowCapt}
              password={password}
              confirmPassword={confirmPassword}
              email={email}
            />
          )}

          <motion.div
            className={`login_box h-[480px] fixed bottom-0 z-[9999] w-screen py-4 px-[20px] ${
              darkmode ? "bg-[#2B2B2D]" : "bg-white"
            } rounded-t-2xl`}
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
              <motion.p className="w-[60px] h-[4px] drag_line mt-[8px] cursor-pointer bg-gray-400"></motion.p>
              <div className="flex justify-between items-center w-full pb-[20px]">
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => setForgot(false)}
                >
                  {darkmode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M7.828 10.9999H20V12.9999H7.828L13.192 18.3639L11.778 19.7779L4 11.9999L11.778 4.22192L13.192 5.63592L7.828 10.9999Z"
                        fill="white"
                      />
                    </svg>
                  ) : (
                    <BackBtn />
                  )}
                </div>
                <h2
                  className={`text-[18px] font-[600] leading-[20px] ${
                    darkmode ? " text-white" : "text-black"
                  }`}
                >
                  找回密码
                </h2>

                <div className="p-3 cursor-pointer" onClick={closeAllModals}>
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
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-[40px] px-[10px]"
              >
                <div className="relative ">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocusedEmail(true)}
                    onBlur={() => setIsFocusedEmail(email !== "")}
                    className={`w-full px- py-2 ${
                      darkmode ? "input_border_dark" : "input_border"
                    }  bg-transparent focus:outline-none ${
                      darkmode ? "text-white" : "text-black"
                    } placeholder-[#5B5B5B]`}
                    required
                    placeholder="请输入您的用户名"
                  />
                </div>

                <button
                  // disabled={!validatePassword(email)}
                  type="submit"
                  className={`w-full text-[14px] text-white font-[600] leading-[22px]  mt-[20px] py-[10px] px-[16px] rounded-[80px] ${
                    validatePassword(password) ? "next_button " : "next_button"
                  } transition duration-300 ease-in-out`}
                >
                  注册
                </button>
              </form>

              {/* <button className=" bg-white text-black px-2 py-2" onClick={getOtp}>test</button> */}

              {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
            </div>
          </motion.div>
        </div>
      )}
      <ErrorToast />
    </>
  );
};

export default ForgotPass;
