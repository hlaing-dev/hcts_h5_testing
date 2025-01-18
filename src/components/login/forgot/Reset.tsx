import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import CloseBtn from "../../../assets/svg/CloseBtn";
import eye from "../../../assets/login/eye.svg";
import eyeClose from "../../../assets/login/eyeClose.svg";
import {
  setAuthModel,
  setLoginOpen,
  setSignupOpen,
} from "../../../features/login/ModelSlice";
import { selectTheme } from "../../../pages/search/slice/ThemeSlice";
import { showToast } from "../../../pages/profile/error/ErrorSlice";
import { reset_pass_forgot } from "../../../services/userService";
interface ResetProps {
  closeAllModals: () => any;
  variants: any;
  session_token: any;
  graphicKey: any;
}

const Reset: React.FC<ResetProps> = ({
  closeAllModals,
  variants,
  session_token,
  graphicKey,
}) => {
  console.log(session_token);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const darkmode = useSelector(selectTheme);
  const dispatch = useDispatch();

  const validatePassword = (username: string) => {
    const lengthValid = confirmPassword.length >= 6 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  const RevalidatePassword = (password: string) => {
    const lengthValid = confirmPassword.length >= 6 && password.length <= 25;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    return lengthValid && containsLetters && containsNumbers;
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      //   setIsVisible(false);
      closeAllModals();
    }
  };

  const passwordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };
  const Reshow = () => {
    setShowRePassword(!showRePassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordsMatch(password, confirmPassword)) {
      dispatch(showToast({ message: "密码不匹配", type: "error" }));
      return;
    }
    try {
      const formData = {
        password: password,
        repassword: confirmPassword,
        session_token: session_token,
        captcha: graphicKey,
      };

      const data = await reset_pass_forgot(formData);
      if (data?.data) {
        dispatch(showToast({ message: "找回成功", type: "error" }));

        setTimeout(() => {
          closeAllModals();
        }, 700);
      }
    } catch (error: any) {
      const msg = error.response.data.msg;
      dispatch(showToast({ message: msg, type: "error" }));
    }
  };
  const show = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
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
            <div className=""></div>
            <h2
              className={`text-[18px] font-[600] leading-[20px] opacity- ${
                darkmode ? " text-white" : "text-black"
              }`}
            >
              Reset Password
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
            {/* pass */}
            <div className="relative ">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px- py-2 ${
                  darkmode ? "input_border_dark" : "input_border"
                }  bg-transparent focus:outline-none ${
                  darkmode ? "text-white" : "text-black"
                } placeholder-[#5B5B5B]`}
                required
                placeholder="请输入您的答案"
              />
              <div
                onClick={show}
                className=" w-[50px] flex justify-end items-center absolute right-0 bottom-[15px] h-[10px]"
              >
                {darkmode ? (
                  <img
                    className=""
                    src={showPassword ? eye : eyeClose}
                    alt="Show Password"
                  />
                ) : (
                  <>
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="14"
                        viewBox="0 0 20 14"
                        fill="none"
                      >
                        <path
                          d="M19.9425 6.72992C19.9133 6.66409 19.2075 5.09826 17.6383 3.52909C15.5475 1.43825 12.9067 0.333252 10 0.333252C7.09333 0.333252 4.4525 1.43825 2.36166 3.52909C0.792493 5.09826 0.0833254 6.66659 0.0574921 6.72992C0.0195863 6.81518 0 6.90745 0 7.00076C0 7.09406 0.0195863 7.18633 0.0574921 7.27159C0.0866587 7.33742 0.792493 8.90243 2.36166 10.4716C4.4525 12.5616 7.09333 13.6666 10 13.6666C12.9067 13.6666 15.5475 12.5616 17.6383 10.4716C19.2075 8.90243 19.9133 7.33742 19.9425 7.27159C19.9804 7.18633 20 7.09406 20 7.00076C20 6.90745 19.9804 6.81518 19.9425 6.72992ZM10 12.3333C7.435 12.3333 5.19416 11.4008 3.33916 9.56243C2.57803 8.8055 1.93048 7.94239 1.41666 6.99992C1.93034 6.05737 2.57791 5.19424 3.33916 4.43742C5.19416 2.59909 7.435 1.66659 10 1.66659C12.565 1.66659 14.8058 2.59909 16.6608 4.43742C17.4235 5.19405 18.0724 6.05719 18.5875 6.99992C17.9867 8.12159 15.3692 12.3333 10 12.3333ZM10 2.99992C9.20887 2.99992 8.43551 3.23452 7.77772 3.67404C7.11992 4.11357 6.60723 4.73828 6.30448 5.46919C6.00173 6.20009 5.92251 7.00436 6.07686 7.78029C6.2312 8.55621 6.61216 9.26894 7.17157 9.82835C7.73098 10.3878 8.44371 10.7687 9.21964 10.9231C9.99556 11.0774 10.7998 10.9982 11.5307 10.6954C12.2616 10.3927 12.8864 9.88 13.3259 9.22221C13.7654 8.56441 14 7.79105 14 6.99992C13.9989 5.9394 13.5771 4.92262 12.8272 4.17271C12.0773 3.42281 11.0605 3.00102 10 2.99992ZM10 9.66659C9.47258 9.66659 8.95701 9.51019 8.51848 9.21718C8.07995 8.92416 7.73815 8.50768 7.53632 8.02041C7.33449 7.53314 7.28168 6.99697 7.38457 6.47968C7.48746 5.9624 7.74144 5.48724 8.11438 5.1143C8.48732 4.74136 8.96248 4.48739 9.47976 4.38449C9.99704 4.2816 10.5332 4.33441 11.0205 4.53624C11.5078 4.73808 11.9242 5.07987 12.2173 5.5184C12.5103 5.95693 12.6667 6.47251 12.6667 6.99992C12.6667 7.70717 12.3857 8.38545 11.8856 8.88554C11.3855 9.38564 10.7072 9.66659 10 9.66659Z"
                          fill="#080808"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="10"
                        viewBox="0 0 20 10"
                        fill="none"
                      >
                        <path
                          d="M19.583 7.60905C19.4954 7.659 19.3988 7.69118 19.2988 7.70376C19.1987 7.71634 19.0972 7.70906 19 7.68235C18.9027 7.65564 18.8117 7.61001 18.7321 7.54809C18.6526 7.48616 18.586 7.40915 18.5362 7.32146L16.7148 4.1388C15.6559 4.85478 14.4878 5.39415 13.256 5.73588L13.8188 9.11218C13.8354 9.21158 13.8322 9.31327 13.8095 9.41145C13.7868 9.50963 13.7449 9.60236 13.6863 9.68436C13.6278 9.76635 13.5536 9.836 13.4681 9.88932C13.3826 9.94263 13.2874 9.97857 13.188 9.99508C13.1471 10.0018 13.1057 10.0053 13.0643 10.0056C12.8829 10.0054 12.7074 9.94077 12.5691 9.82335C12.4308 9.70593 12.3386 9.54328 12.3089 9.3643L11.7558 6.04935C10.5893 6.21168 9.40599 6.21168 8.23952 6.04935L7.68639 9.3643C7.65663 9.54361 7.56415 9.70651 7.42544 9.82397C7.28674 9.94143 7.11082 10.0058 6.92907 10.0056C6.88668 10.0055 6.84436 10.0019 6.80253 9.99508C6.70312 9.97857 6.60794 9.94263 6.52242 9.88932C6.43691 9.836 6.36274 9.76635 6.30416 9.68436C6.24558 9.60236 6.20373 9.50963 6.18101 9.41145C6.15829 9.31327 6.15514 9.21158 6.17175 9.11218L6.73734 5.73588C5.5061 5.39307 4.33865 4.85273 3.28051 4.13592L1.46486 7.32146C1.36316 7.49867 1.19524 7.62822 0.998018 7.68161C0.800801 7.73501 0.590451 7.70787 0.413242 7.60617C0.236033 7.50447 0.106481 7.33654 0.0530872 7.13933C-0.000307042 6.94211 0.0268297 6.73176 0.128528 6.55455L2.04579 3.19934C1.37235 2.61752 0.753094 1.9758 0.195632 1.28207C0.126111 1.20445 0.0731378 1.11347 0.0399459 1.0147C0.00675413 0.915922 -0.00596004 0.811417 0.00257981 0.707565C0.0111196 0.603712 0.0407343 0.502689 0.0896159 0.410662C0.138497 0.318635 0.20562 0.237535 0.286888 0.172312C0.368155 0.10709 0.461862 0.0591131 0.562288 0.0313105C0.662714 0.00350794 0.767752 -0.00353737 0.870991 0.0106052C0.97423 0.0247477 1.0735 0.0597814 1.16275 0.113567C1.252 0.167353 1.32936 0.238763 1.39009 0.323438C2.98142 2.29247 5.76529 4.63729 9.99669 4.63729C14.2281 4.63729 17.012 2.28959 18.6033 0.323438C18.6633 0.23703 18.7405 0.163901 18.83 0.1086C18.9195 0.0533003 19.0195 0.0170119 19.1236 0.0019932C19.2278 -0.0130255 19.3339 -0.00645329 19.4354 0.0213009C19.5369 0.049055 19.6316 0.0973977 19.7136 0.163321C19.7956 0.229244 19.8632 0.311337 19.9121 0.404494C19.961 0.49765 19.9902 0.599876 19.9979 0.704812C20.0057 0.809749 19.9917 0.91515 19.9569 1.01446C19.9222 1.11377 19.8673 1.20486 19.7958 1.28207C19.2384 1.9758 18.6191 2.61752 17.9457 3.19934L19.8629 6.55455C19.9144 6.64201 19.948 6.73882 19.9618 6.83936C19.9756 6.9399 19.9693 7.04218 19.9432 7.14026C19.9172 7.23835 19.8719 7.33029 19.8101 7.41076C19.7483 7.49123 19.6711 7.55863 19.583 7.60905Z"
                          fill="#080808"
                        />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* comfirm pass */}
            <div className="relative ">
              <input
                type={showRePassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px- py-2 ${
                  darkmode ? "input_border_dark" : "input_border"
                }  bg-transparent focus:outline-none ${
                  darkmode ? "text-white" : "text-black"
                } placeholder-[#5B5B5B]`}
                required
                placeholder="请输入您的答案"
              />
              <div
                onClick={Reshow}
                className=" w-[50px] flex justify-end items-center absolute right-0 bottom-[15px] h-[10px]"
              >
                {darkmode ? (
                  <img
                    className=""
                    src={showRePassword ? eye : eyeClose}
                    alt="Show Password"
                  />
                ) : (
                  <>
                    {showRePassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="14"
                        viewBox="0 0 20 14"
                        fill="none"
                      >
                        <path
                          d="M19.9425 6.72992C19.9133 6.66409 19.2075 5.09826 17.6383 3.52909C15.5475 1.43825 12.9067 0.333252 10 0.333252C7.09333 0.333252 4.4525 1.43825 2.36166 3.52909C0.792493 5.09826 0.0833254 6.66659 0.0574921 6.72992C0.0195863 6.81518 0 6.90745 0 7.00076C0 7.09406 0.0195863 7.18633 0.0574921 7.27159C0.0866587 7.33742 0.792493 8.90243 2.36166 10.4716C4.4525 12.5616 7.09333 13.6666 10 13.6666C12.9067 13.6666 15.5475 12.5616 17.6383 10.4716C19.2075 8.90243 19.9133 7.33742 19.9425 7.27159C19.9804 7.18633 20 7.09406 20 7.00076C20 6.90745 19.9804 6.81518 19.9425 6.72992ZM10 12.3333C7.435 12.3333 5.19416 11.4008 3.33916 9.56243C2.57803 8.8055 1.93048 7.94239 1.41666 6.99992C1.93034 6.05737 2.57791 5.19424 3.33916 4.43742C5.19416 2.59909 7.435 1.66659 10 1.66659C12.565 1.66659 14.8058 2.59909 16.6608 4.43742C17.4235 5.19405 18.0724 6.05719 18.5875 6.99992C17.9867 8.12159 15.3692 12.3333 10 12.3333ZM10 2.99992C9.20887 2.99992 8.43551 3.23452 7.77772 3.67404C7.11992 4.11357 6.60723 4.73828 6.30448 5.46919C6.00173 6.20009 5.92251 7.00436 6.07686 7.78029C6.2312 8.55621 6.61216 9.26894 7.17157 9.82835C7.73098 10.3878 8.44371 10.7687 9.21964 10.9231C9.99556 11.0774 10.7998 10.9982 11.5307 10.6954C12.2616 10.3927 12.8864 9.88 13.3259 9.22221C13.7654 8.56441 14 7.79105 14 6.99992C13.9989 5.9394 13.5771 4.92262 12.8272 4.17271C12.0773 3.42281 11.0605 3.00102 10 2.99992ZM10 9.66659C9.47258 9.66659 8.95701 9.51019 8.51848 9.21718C8.07995 8.92416 7.73815 8.50768 7.53632 8.02041C7.33449 7.53314 7.28168 6.99697 7.38457 6.47968C7.48746 5.9624 7.74144 5.48724 8.11438 5.1143C8.48732 4.74136 8.96248 4.48739 9.47976 4.38449C9.99704 4.2816 10.5332 4.33441 11.0205 4.53624C11.5078 4.73808 11.9242 5.07987 12.2173 5.5184C12.5103 5.95693 12.6667 6.47251 12.6667 6.99992C12.6667 7.70717 12.3857 8.38545 11.8856 8.88554C11.3855 9.38564 10.7072 9.66659 10 9.66659Z"
                          fill="#080808"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="10"
                        viewBox="0 0 20 10"
                        fill="none"
                      >
                        <path
                          d="M19.583 7.60905C19.4954 7.659 19.3988 7.69118 19.2988 7.70376C19.1987 7.71634 19.0972 7.70906 19 7.68235C18.9027 7.65564 18.8117 7.61001 18.7321 7.54809C18.6526 7.48616 18.586 7.40915 18.5362 7.32146L16.7148 4.1388C15.6559 4.85478 14.4878 5.39415 13.256 5.73588L13.8188 9.11218C13.8354 9.21158 13.8322 9.31327 13.8095 9.41145C13.7868 9.50963 13.7449 9.60236 13.6863 9.68436C13.6278 9.76635 13.5536 9.836 13.4681 9.88932C13.3826 9.94263 13.2874 9.97857 13.188 9.99508C13.1471 10.0018 13.1057 10.0053 13.0643 10.0056C12.8829 10.0054 12.7074 9.94077 12.5691 9.82335C12.4308 9.70593 12.3386 9.54328 12.3089 9.3643L11.7558 6.04935C10.5893 6.21168 9.40599 6.21168 8.23952 6.04935L7.68639 9.3643C7.65663 9.54361 7.56415 9.70651 7.42544 9.82397C7.28674 9.94143 7.11082 10.0058 6.92907 10.0056C6.88668 10.0055 6.84436 10.0019 6.80253 9.99508C6.70312 9.97857 6.60794 9.94263 6.52242 9.88932C6.43691 9.836 6.36274 9.76635 6.30416 9.68436C6.24558 9.60236 6.20373 9.50963 6.18101 9.41145C6.15829 9.31327 6.15514 9.21158 6.17175 9.11218L6.73734 5.73588C5.5061 5.39307 4.33865 4.85273 3.28051 4.13592L1.46486 7.32146C1.36316 7.49867 1.19524 7.62822 0.998018 7.68161C0.800801 7.73501 0.590451 7.70787 0.413242 7.60617C0.236033 7.50447 0.106481 7.33654 0.0530872 7.13933C-0.000307042 6.94211 0.0268297 6.73176 0.128528 6.55455L2.04579 3.19934C1.37235 2.61752 0.753094 1.9758 0.195632 1.28207C0.126111 1.20445 0.0731378 1.11347 0.0399459 1.0147C0.00675413 0.915922 -0.00596004 0.811417 0.00257981 0.707565C0.0111196 0.603712 0.0407343 0.502689 0.0896159 0.410662C0.138497 0.318635 0.20562 0.237535 0.286888 0.172312C0.368155 0.10709 0.461862 0.0591131 0.562288 0.0313105C0.662714 0.00350794 0.767752 -0.00353737 0.870991 0.0106052C0.97423 0.0247477 1.0735 0.0597814 1.16275 0.113567C1.252 0.167353 1.32936 0.238763 1.39009 0.323438C2.98142 2.29247 5.76529 4.63729 9.99669 4.63729C14.2281 4.63729 17.012 2.28959 18.6033 0.323438C18.6633 0.23703 18.7405 0.163901 18.83 0.1086C18.9195 0.0533003 19.0195 0.0170119 19.1236 0.0019932C19.2278 -0.0130255 19.3339 -0.00645329 19.4354 0.0213009C19.5369 0.049055 19.6316 0.0973977 19.7136 0.163321C19.7956 0.229244 19.8632 0.311337 19.9121 0.404494C19.961 0.49765 19.9902 0.599876 19.9979 0.704812C20.0057 0.809749 19.9917 0.91515 19.9569 1.01446C19.9222 1.11377 19.8673 1.20486 19.7958 1.28207C19.2384 1.9758 18.6191 2.61752 17.9457 3.19934L19.8629 6.55455C19.9144 6.64201 19.948 6.73882 19.9618 6.83936C19.9756 6.9399 19.9693 7.04218 19.9432 7.14026C19.9172 7.23835 19.8719 7.33029 19.8101 7.41076C19.7483 7.49123 19.6711 7.55863 19.583 7.60905Z"
                          fill="#080808"
                        />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* decs */}
            <div
              className={` mt-[-20px] text-[14px] font-[500] leading-[20px] ${
                validatePassword(password) ? " text-[#00A048]" : "text-[#888]"
              }  `}
            >
              <p>8-25个字符</p>
              <p>必须是以下两者中的至少两种组合：字母，数字</p>{" "}
              {/* <p>letters, numbers.</p> */}
            </div>
            <button
              disabled={!validatePassword(password)}
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
    </>
  );
};

export default Reset;
