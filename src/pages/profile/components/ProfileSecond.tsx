import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { Share, Headphone, Contact } from "../../../assets/svg";
import Right from "../../../assets/svg/Right";

const ProfileSecond = () => {
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
      <div className="profile-div-main w-full">
        <div onClick={handleLoginClick} className="p-first">
          <div className="flex gap-3 items-center">
            <div>
              <Share />
            </div>
            <div className="profile-text">我要分享</div>
          </div>
          <div>
            <Right />
          </div>
        </div>
        <Link
          to={"https://euphonious-trifle-352add.netlify.app/"}
          target="_blank"
          className="p-first"
        >
          <div className="flex gap-3 items-center">
            <Headphone />
            <div className="profile-text">帮助中心</div>
          </div>
          <div>
            <Right />
          </div>
        </Link>
        <Link to={"/contact"} className="p-first">
          <div className="flex gap-3 items-center">
            <Contact />
            <div className="profile-text">联系我们</div>
          </div>
          <div>
            <Right />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileSecond;
