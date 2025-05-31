import { useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import "./social.css";
import { setShowingDetail } from "../../features/login/ModelSlice";
import { useEffect } from "react";

const Social = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setShowingDetail(false))
  },[])
  return (
    <div className="bg-white dark:bg-[#161619] min-h-screen">
      <Navbar />
    </div>
  );
};

export default Social;
