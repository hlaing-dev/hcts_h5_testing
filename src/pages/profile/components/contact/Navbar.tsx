import React from "react";
import { Link } from "react-router-dom";

interface props {
  darkmode: boolean;
}

const Navbar: React.FC<props> = ({ darkmode }) => {
  return (
    <div
      className={`flex fixed top-0 w-full z-10 ${
        darkmode ? " bg-transparent" : "bg-white"
      } justify-between items-center p-2`}
    >
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
              d="M7.828 11.0002H20V13.0002H7.828L13.192 18.3642L11.778 19.7782L4 12.0002L11.778 4.22217L13.192 5.63617L7.828 11.0002Z"
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
        className={` pr-10 ${
          darkmode ? "history-title_dark" : "history-title"
        }`}
      >
        关于我们
      </div>
      <div className="edit-title"></div>
    </div>
  );
};

export default Navbar;
