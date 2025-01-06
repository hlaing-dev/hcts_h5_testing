import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-2">
      <Link to="/profile" className="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7.828 11.0002H20V13.0002H7.828L13.192 18.3642L11.778 19.7782L4 12.0002L11.778 4.22217L13.192 5.63617L7.828 11.0002Z"
            fill="#080808"
          />
        </svg>
      </Link>
      <div className="history-title pr-10">设置</div>
      <div></div>
    </div>
  );
};

export default Navbar;
