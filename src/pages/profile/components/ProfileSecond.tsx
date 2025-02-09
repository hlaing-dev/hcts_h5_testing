import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuthModel } from "../../../features/login/ModelSlice";
import {
  Share,
  Headphone,
  Contact,
  HeadphoneDark,
  ContactDark,
  ShareDark,
} from "../../../assets/svg";
import Right from "../../../assets/svg/Right";
import RightDark from "../../../assets/svg/RightDark";

const ProfileSecond = ({ darkmode }: any) => {
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLoginClick = () => {
    if (!token) {
      dispatch(setAuthModel(true)); // Open the login modal if not logged in
    } else {
      navigate("/share");
    }
  };
  return (
    <div className="profile-div">
      <div
        className={` w-full ${
          darkmode ? "profile-div-main_dark" : "profile-div-main"
        }`}
      >
        <div onClick={()=>navigate("/share")} className="p-first">
          <div className="flex gap-3 items-center">
            <div>
            {darkmode ? <ShareDark /> : <Share />}
            </div>
            <div
              className={`${darkmode ? "profile-text_dark" : "profile-text"}`}
            >
              我要分享
            </div>
          </div>
          <div>
            {darkmode ? <RightDark /> : <Right />}
          </div>
        </div>
        <Link
          to={"https://euphonious-trifle-352add.netlify.app/"}
          target="_blank"
          className="p-firs hidden"
        >
          <div className="flex gap-3 items-center">
            {darkmode ? <HeadphoneDark /> : <Headphone />}
            <div
              className={`${darkmode ? "profile-text_dark" : "profile-text"}`}
            >
              帮助中心
            </div>
          </div>
          <div>
            {darkmode ? <RightDark /> : <Right />}
          </div>
        </Link>
        <Link to={"/contact"} className="p-first">
          <div className="flex gap-3 items-center">
            {darkmode ? <ContactDark /> : <Contact />}
            <div
              className={`${darkmode ? "profile-text_dark" : "profile-text"}`}
            >
              联系我们
            </div>
          </div>
          <div>
            {darkmode ? <RightDark /> : <Right />}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileSecond;
