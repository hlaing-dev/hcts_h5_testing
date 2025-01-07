import React from "react";
import { Link } from "react-router-dom";
import { RiSettingsFill } from "react-icons/ri";
import { BiSolidBell } from "react-icons/bi";

const Navbar = ({ darkmode }: any) => {
  return (
    <div className="flex justify-between p- items-center relative py-[50px]">
      <div></div>
      <div className="flex gap-2 items-center absolute z-[99] right-[10px]">
        <Link to={"/notifications"} className="p-2">
          {/* <BiSolidBell className="text-black w-[22px]" /> */}
          <svg
            width="27"
            style={{ zIndex: 99 }}
            height="27"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.178 20H2.17798V18H3.17798V11.031C3.17798 6.043 7.20798 2 12.178 2C17.148 2 21.178 6.043 21.178 11.031V18H22.178V20ZM9.67798 21H14.678C14.678 21.663 14.4146 22.2989 13.9457 22.7678C13.4769 23.2366 12.841 23.5 12.178 23.5C11.5149 23.5 10.8791 23.2366 10.4102 22.7678C9.94137 22.2989 9.67798 21.663 9.67798 21Z"
              fill="white"
            />
          </svg>
        </Link>
        <Link to={"/settings"} className="p-2">
          {/* <RiSettingsFill className="text-black w-[22px]" /> */}

          <svg
            width="22"
            style={{ zIndex: 99 }}
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.0274 0.519615L20.0615 4.58058C21.2617 5.2734 21.9999 6.55307 21.9999 7.93887V16.0611C21.9999 17.4468 21.2617 18.7264 20.0615 19.4194L13.0274 23.4804C11.8285 24.1732 10.3494 24.1732 9.15055 23.4804L2.11639 19.4194C0.916254 18.7266 0.177979 17.4469 0.177979 16.0611V7.93887C0.177979 6.5532 0.916254 5.27356 2.11639 4.58058L9.15055 0.519615C10.3494 -0.173205 11.8285 -0.173205 13.0274 0.519615ZM11.089 7.79995C8.76943 7.79995 6.88907 9.68031 6.88907 11.9998C6.88907 14.3194 8.76943 16.1997 11.089 16.1997C13.4085 16.1997 15.2888 14.3194 15.2888 11.9998C15.2888 9.68031 13.4085 7.79995 11.089 7.79995Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
