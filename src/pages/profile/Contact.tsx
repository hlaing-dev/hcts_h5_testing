import React, { useState } from "react";
import Navbar from "./components/contact/Navbar";
// import logo from "../../assets/ContactLogo.png";
import logo from "../../assets/share/logo.png";
import { Link } from "react-router-dom";
import { useGetTagsQuery } from "../search/services/searchApi";
import Loader from "../search/components/Loader";
import { useGetHeaderTopicsQuery } from "../../services/helperService";
import { useSelector } from "react-redux";
import { selectTheme } from "../search/slice/ThemeSlice";

const Contact = () => {
  const [show, setshow] = useState(false);
  const darkmode = useSelector(selectTheme);

  const handleClick = () => {
    setshow((prev) => !prev);
  };
  // const {
  //   data,
  //   isLoading: isLoader,
  //   isFetching: isFetch,
  // } = useGetTagsQuery(undefined, {
  //   skip: !show,
  // });
  const {
    data,
    isLoading: isLoader,
    isFetching: isFetch,
  } = useGetHeaderTopicsQuery();

  const about = data?.data?.about;

  return (
    <div>
      <div className={`${darkmode ? "fixed-bg_dark" : "fixed-bg"}`}></div>
      <div className="text-white h-screen">
        <Navbar darkmode={darkmode} />

        <div className="flex justify-center -mt-[100px] text-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <img src={logo} alt="" className="w-[90px]" />
            <p className={`contact-text ${darkmode ? "text-white": "text-black"} mt-3`}>版本号 1.1.3</p>
          </div>
        </div>

        <div className="">
          {show ? (
            <div
              className={` ${
                darkmode ? " bg-white/10" : "bg-black/10"
              } bottom-0 rounded-t-[30px] absolute w-full p-4`}
            >
              <div>
                <div className="flex justify-center relative text-center items-center">
                  {/* <div></div> */}
                  <div className={`${darkmode ? "text-white" : "text-black"}`}>
                    联系我们
                  </div>
                  <button onClick={handleClick} className="absolute right-2">
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z"
                          fill="black"
                          fill-opacity="0.8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {about && (
                  <div className="flex flex-col mt-5">
                    {about?.map((data: any, index: number) => (
                      <Link
                        key={index}
                        target="_blank"
                        to={`${
                          data?.link?.includes("@gmail")
                            ? `mailto:${data?.link}`
                            : data?.link
                        }`}
                        className="flex justify-between mt-2 items-center bg-[#fff p-3 rounded-sm"
                      >
                        <div className={`contact-link-text ${darkmode ? "text-white" : "text-black"}`}>{data?.text}</div>
                        <div className="flex items-center">
                          <span className={`content-link ${darkmode ? "text-white" : "text-black"}`}>{data?.link}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <g opacity="0.2">
                              <path
                                d="M13.172 12.0002L8.22198 7.05023L9.63598 5.63623L16 12.0002L9.63598 18.3642L8.22198 16.9502L13.172 12.0002Z"
                                fill="white"
                              />
                            </g>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {isLoader && (
                  <div className="text-white text-center bg-white flex justify-center items-center h-[100px] mt-5">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className=" absolute px-4 py-3 bottom-0 w-full">
              <button
                className={`w-full  bg-[#FE58B5] rounded-lg text-white text-center p-3`}
                onClick={handleClick}
              >
                联系我们
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
