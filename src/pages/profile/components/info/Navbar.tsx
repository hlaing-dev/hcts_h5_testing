import React from "react";
import { Link } from "react-router-dom";

interface props {
  darkmode: boolean;
}

const Navbar: React.FC<props> = ({ darkmode }) => {
  return (
    <div className="flex fixed top-0 w-full z-10 bg-transparent justify-between items-center p-2">
      <Link to="/profile" className="back-button">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7.828 10.9999H20V12.9999H7.828L13.192 18.3639L11.778 19.7779L4 11.9999L11.778 4.22192L13.192 5.63592L7.828 10.9999Z"
              fill="#080808"
            />
          </svg>
        )}
      </Link>
      <div
        className={`${darkmode ? "history-title_dark" : "history-title"} pr-10`}
      >
        个人资料
      </div>
      <div className="edit-title"></div>
    </div>
  );
};

export default Navbar;
