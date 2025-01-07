import { useSelector } from "react-redux";
import Main from "./components/info/Main";
import Navbar from "./components/info/Navbar";
import "./profile.css";
import { selectTheme } from "../search/slice/ThemeSlice";

const Info = () => {
  const darkmode = useSelector(selectTheme);

  return (
    <div>
      <div className={`${darkmode ? "fixed-bg_dark" : "fixed-bg"}`}></div>
      <div className="text-white">
        <Navbar darkmode={darkmode} />
      </div>
      <div>
        <Main darkmode={darkmode} />
      </div>
    </div>
  );
};

export default Info;
