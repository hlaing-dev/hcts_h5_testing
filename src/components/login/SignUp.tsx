// // SignUp.tsx
// import React, { startTransition, useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Button from "../../components/login/Button";
// import back from "../../assets/login/back.svg";
// import close from "../../assets/login/close.svg";
// import SignEmail from "./SignEmail";
// import SignPhone from "./SignPhone";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoginOpen } from "../../features/login/ModelSlice";
// import { setSignupOpen } from "../../features/login/ModelSlice";
// import { setAuthModel } from "../../features/login/ModelSlice";
// import phone from "../../assets/login/phone.svg";
// import email from "../../assets/login/email.svg";
// import "../../pages/login/login.css";
// import { useLocation } from "react-router-dom";
// import { selectTheme } from "../../pages/search/slice/ThemeSlice";
// import CloseBtn from "../../assets/svg/CloseBtn";

// interface SignUpProps {
//   handleBack: () => void; // Accept handleBack as a prop
// }
// const SignUp: React.FC<SignUpProps> = ({ handleBack }) => {
//   const darkmode = useSelector(selectTheme);

//   const dispatch = useDispatch();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isVisible, setIsVisible] = useState(true);
//   const [isEmailVisible, setEmailVisible] = useState(false);
//   const [isPhoneVisible, setPhoneVisible] = useState(false);

//   const currentLocation = useLocation(); // Use the `useLocation` hook from react-router-dom
//   const previousPathname = useRef(currentLocation.pathname);

//   useEffect(() => {
//     if (previousPathname.current !== currentLocation.pathname) {
//       setIsVisible(false);
//       closeAllModals();
//     }
//     previousPathname.current = currentLocation.pathname;
//   }, [currentLocation.pathname]);

//   const closeAllModals = () => {
//     startTransition(() => {
//       dispatch(setAuthModel(false));
//       dispatch(setLoginOpen(false));
//       dispatch(setSignupOpen(false));
//     });
//   };

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // const result = await registerUser(username, password);
//     } catch (err) {
//       setError("Sign-up failed. Please check your details.");
//     }
//   };

//   const handleClose = () => {
//     dispatch(setLoginOpen(false));
//     dispatch(setSignupOpen(false));
//     dispatch(setAuthModel(false));
//     setIsVisible(false);
//   };

//   const handleShowSignUpEmail = () => {
//     setIsVisible(false);
//     setEmailVisible(true);
//   };

//   const handleShowSignUpPhone = () => {
//     setIsVisible(false);
//     setPhoneVisible(true);
//   };

//   const handleBack2 = () => {
//     setIsVisible(true); // Show the login component
//     setEmailVisible(false); // Hide the LoginEmail component
//     setPhoneVisible(false); // Hide the LoginEmail component
//   };

//   const variants = {
//     hidden: { y: 300 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { type: "spring", stiffness: 100, damping: 20 },
//     },
//     exit: {
//       y: "100%",
//       transition: { type: "tween", duration: 0.5 },
//     },
//   };

//   const handleDragEnd = (event: any, info: any) => {
//     if (info.offset.y > 100) {
//       setIsVisible(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center overflow-hidden">
//       {isEmailVisible && <SignEmail handleBack2={handleBack2} />}
//       {isPhoneVisible && <SignPhone handleBack2={handleBack2} />}
//       <AnimatePresence>
//         {isVisible && (
//           <motion.div
//             className="bg-[#fff] login_box dark:bg-[#2B2B2D] fixed h-[480px]  bottom-0 z-[99999] w-screen max-w-m"
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             variants={variants}
//             drag="y"
//             dragConstraints={{ top: 0 }}
//             dragElastic={0.2}
//             onDragEnd={handleDragEnd}
//           >
//             <div className="flex flex-col justify-cente items-center gap-[25px] px-[20px]">
//               <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer"></motion.p>
//               {/* header */}
//               <div className="flex justify-between items-center w-full pb-[px]">
//                 <img
//                   className={`${
//                     darkmode ? "" : "w-[30px] bg-gray-300 rounded-full"
//                   } p-[6px]  cursor-pointer `}
//                   src={back}
//                   alt="Back"
//                   onClick={handleBack}
//                 />
//                 <h2 className="text-[18px] pr- font-[600] leading-[20px] text-black dark:text-white">
//                   注册
//                 </h2>
//                 <div onClick={handleClose} className="p-3">
//                   {darkmode ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="10"
//                       height="10"
//                       viewBox="0 0 10 10"
//                       fill="none"
//                     >
//                       <path
//                         d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z"
//                         fill="white"
//                         fill-opacity="0.8"
//                       />
//                     </svg>
//                   ) : (
//                     <CloseBtn />
//                   )}
//                 </div>
//               </div>
//               {/* decs */}
//               <div className=" w-full pl-2 py-[10px]">
//                 <h1 className="text-black dark:text-white text-[14px] font-[500]">
//                   选择注册方式{" "}
//                 </h1>
//                 <p className=" text-black/60 dark:text-white/60 text-[14px] font-[400]">
//                   海外用户请选择使用邮箱注册
//                 </p>
//               </div>
//               <div className="flex flex-col gap-[13px]">
//                 {/* <Button
//                   onClick={handleShowSignUpEmail}
//                   text={"使用邮箱注册 "}
//                 /> */}
//                 <button
//                   onClick={handleShowSignUpPhone}
//                   className="new_css_button relative text-[14px] font-[600] leading-[22px] w-[320px] px-[16px] py-[10px] flex justify-center items-center gap-[8px] text-white"
//                 >
//                   <img className=" absolute left-[20px]" src={phone} alt="" />
//                   使用手机号注册
//                 </button>
//                 <button
//                   onClick={handleShowSignUpEmail}
//                   className="new_css_button relative text-[14px] font-[600] leading-[22px] w-[320px] px-[16px] py-[10px] flex justify-center items-center gap-[8px] text-white"
//                 >
//                   <img className=" absolute left-[20px]" src={email} alt="" />
//                   使用邮箱注册
//                 </button>
//                 {/* <Button
//                   onClick={handleShowSignUpPhone}
//                   text={"使用电话号码注册"}
//                 /> */}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default SignUp;


// SignUp.tsx
import React, { startTransition, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/login/Button";
import back from "../../assets/login/back.svg";
import close from "../../assets/login/close.svg";
import SignEmail from "./SignEmail";
import SignPhone from "./SignPhone";
import { useDispatch } from "react-redux";
import { setLoginOpen } from "../../features/login/ModelSlice";
import { setSignupOpen } from "../../features/login/ModelSlice";
import { setAuthModel } from "../../features/login/ModelSlice";
import phone from "../../assets/login/phone.svg";
import email from "../../assets/login/email.svg";
import "../../pages/login/login.css";
import { useLocation } from "react-router-dom";
import CloseBtn from "../../assets/svg/CloseBtn";
import BackBtn from "../../assets/svg/BackBtn";

interface SignUpProps {
  handleBack: () => void; // Accept handleBack as a prop
}
const SignUp: React.FC<SignUpProps> = ({ handleBack }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isEmailVisible, setEmailVisible] = useState(false);
  const [isPhoneVisible, setPhoneVisible] = useState(false);

  const currentLocation = useLocation(); // Use the `useLocation` hook from react-router-dom
  const previousPathname = useRef(currentLocation.pathname);

  useEffect(() => {
    handleShowSignUpEmail()
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const result = await registerUser(username, password);
    } catch (err) {
      setError("Sign-up failed. Please check your details.");
    }
  };

  const handleClose = () => {
    dispatch(setLoginOpen(false));
    dispatch(setSignupOpen(false));
    dispatch(setAuthModel(false));
    setIsVisible(false);
  };

  const handleShowSignUpEmail = () => {
    setIsVisible(false);
    setEmailVisible(true);
  };

  const handleShowSignUpPhone = () => {
    setIsVisible(false);
    setPhoneVisible(true);
  };

  const handleBack2 = () => {
    setIsVisible(false); // Show the login component
    setEmailVisible(false); // Hide the LoginEmail component
    setPhoneVisible(false); // Hide the LoginEmail component
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

  return (
    <div className="min-h-screen bg-white dark:bg-white flex items-center justify-center overflow-hidden">
      {isEmailVisible && <SignEmail handleBack2={handleBack} />}
      {/* {isPhoneVisible && <SignPhone handleBack2={handleBack2} />} */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="login_box fixed hidden h-[480px]  bottom-0 z-[99999] w-screen max-w-m"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col justify-cente items-center gap-[25px] px-[20px]">
              <motion.p className="w-[60px] h-[4px] drag_line mt-[12px] cursor-pointer"></motion.p>
              {/* header */}
              <div className="flex justify-between items-center w-full pb-[px]">
                {/* <img
                  className="p-[6px] cursor-pointer"
                  src={back}
                  alt="Back"
                  onClick={handleBack}
                /> */}
                <div className="p-[6px]" onClick={handleBack}>
                  <BackBtn />
                </div>
                <h2 className="text-[18px] font-[600] leading-[20px] text-black">
                  注册
                </h2>
                <div className="p-3 cursor-pointer" onClick={handleClose}>
                  <CloseBtn />
                </div>
                {/* <img
                  className="close_btn p-3 cursor-pointer"
                  src={close}
                  alt="Close"
                  onClick={handleClose}
                /> */}
              </div>
              {/* decs */}
              <div className=" w-full pl-2 py-[10px]">
                <h1 className=" text-black text-[14px] font-[500]">
                  选择注册方式{" "}
                </h1>
                <p className=" text-black/60 text-[14px] font-[400]">
                  海外用户请选择使用邮箱注册
                </p>
              </div>
              <div className="flex flex-col gap-[13px]">
                {/* <Button
                  onClick={handleShowSignUpEmail}
                  text={"使用邮箱注册 "}
                /> */}
                <button
                  onClick={handleShowSignUpPhone}
                  className="new_css_button relative text-[14px] font-[600] leading-[22px] w-[320px] px-[16px] py-[10px] flex justify-center items-center gap-[8px] text-black"
                >
                  <img className=" absolute left-[20px]" src={phone} alt="" />
                  使用手机号注册
                </button>
                <button
                  onClick={handleShowSignUpEmail}
                  className="new_css_button relative text-[14px] font-[600] leading-[22px] w-[320px] px-[16px] py-[10px] flex justify-center items-center gap-[8px] text-black"
                >
                  <img className=" absolute left-[20px]" src={email} alt="" />
                  使用邮箱注册
                </button>
                {/* <Button
                  onClick={handleShowSignUpPhone}
                  text={"使用电话号码注册"}
                /> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignUp;

