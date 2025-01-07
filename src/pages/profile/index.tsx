import "./profile.css";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ProfileFirst from "./components/ProfileFirst";
import ProfileSecond from "./components/ProfileSecond";
import bg from "../home/images/pbg.png";
import { selectTheme } from "../search/slice/ThemeSlice";
import { useSelector } from "react-redux";

const Index = () => {
  const darkmode = useSelector(selectTheme);

  return (
    <>
      {/* <div className="profile-bg"></div> */}
      <div
        className={`text-black ${
          darkmode ? "bg-[#161619]" : "bg-[#dfdfdfc0]"
        }   h-screen`}
      >
        <img src={bg} alt="" className="fixed top-0 left-0" />
        <div className="">
          <div className="">
            <Navbar darkmode={darkmode} />
          </div>
          <div>
            <Header darkmode={darkmode} />
          </div>
          <div
            className={`pb-[100px] ${
              darkmode ? "bg-[#161619]" : "bg-[#dfdfdfc0]"
            }`}
          >
            <ProfileFirst darkmode={darkmode} />
            <ProfileSecond darkmode={darkmode} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
