import { useDispatch, useSelector } from "react-redux";
import "./profile.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useChangeNicknameMutation,
  useGetUserQuery,
} from "../profile/services/profileApi"; // import the hook
import { setUser } from "./components/slice/UserSlice";
import { showToast } from "./error/ErrorSlice";
import { selectTheme } from "../search/slice/ThemeSlice";

const Nickname = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkmode = useSelector(selectTheme);

  const { data: userData, refetch } = useGetUserQuery(undefined);
  const user = userData?.data;
  // const user = useSelector((state: any) => state.user.user);
  const [text, setText] = useState(user?.nickname);
  const [active, setActive] = useState(false);

  const [changeNickname, { isLoading, isError, isSuccess }] =
    useChangeNicknameMutation(); // use the mutation hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await changeNickname({ new_nickname: text }).unwrap();
      refetch();
      dispatch(
        showToast({
          message: "昵称修改成功！",
          type: "success",
        })
      );
      navigate("/info");
    } catch (error) {
      dispatch(
        showToast({
          message: (error as any)?.data?.msg || "修改昵称失败",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (text) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [text]);

  const handleRemove = () => {
    setText("");
  };

  return (
    <div>
      <div className={`${darkmode ? "fixed-bg_dark" : "fixed-bg"}`}></div>
      <div>
        <div className="flex fixed top-0 w-full z-10 bg-transparent justify-between items-center p-2">
          <Link to="/info" className="back-button">
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
            className={`${
              darkmode ? "history-title_dark" : "history-title"
            } pr-10`}
          >
            修改昵称
          </div>
          <div className="edit-title cursor-pointer"></div>{" "}
          {/* Trigger form submit */}
        </div>
        <div className="mt-[80px] p-4 relative">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              className={`${darkmode ? "new-input" : "new-input"}`}
              placeholder="输入你的昵称"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading} // Disable input during submission
            />
            <button
              className={`submit_btn`}
              disabled={!active}
              style={{
                background: active ? "#FE58B5" : "#FE58B5",
                opacity: active ? "1" : "0.5",
                color: active ? "white" : "white",
              }}
            >
              保存
            </button>
          </form>
          <button className="close-btn-input" onClick={handleRemove}>
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nickname;
