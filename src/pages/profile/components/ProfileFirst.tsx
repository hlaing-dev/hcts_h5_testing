import { startTransition, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../../search/components/ImgPlaceholder";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { useDispatch, useSelector } from "react-redux";
import RightDark from "../../../assets/svg/RightDark";
import {
  useGetListQuery,
  useGetRecordQuery,
  useGetUserQuery,
} from "../services/profileApi";
import { showToast } from "../error/ErrorSlice";
import History from "../../../assets/svg/History";
import Collection from "../../../assets/svg/Collection";
import Right from "../../../assets/svg/Right";

interface Movie {
  id: any;
  name: string;
  duration: any;
  playedTime: any;
  episode_name: any;
  last_episodeid: any;
  progress_time: any;
  cover: any;
}

const ProfileFirst = ({ darkmode }: any) => {
  // Check for token in localStorage
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const {
    data: userData,
    error,
    refetch,
  } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const user = userData?.data;

  const {
    data: favoriteMovies,
    // isLoading: isFavoritesLoading,
    refetch: refetchList,
    isFetching: isFavoritesFetching,
    error: favoriteError,
  } = useGetListQuery({ page: 1, type_id: 0 }, { skip: !token });
  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchRecord,
    error: recordError,
  } = useGetRecordQuery(undefined, {
    skip: !token,
  }); // Fetch favorite movies list from API

  // const [movies, setMovies] = useState<Movie[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const prevTokenRef = useRef(token);

  useEffect(() => {
    // Only trigger refetch if the token has changed
    if (prevTokenRef.current !== token) {
      prevTokenRef.current = token;
      refetch();
      refetchRecord();
      refetchList();
    }
  }, [token, refetch]);

  const favorites = favoriteMovies?.data?.list?.slice(0, 10);
  const movies = data?.data;
  const moviesData = data?.data; // Assuming `data` is the fetched data containing your movie information

  // Extract all movies from the 'list' array in each 'data' object and flatten into a single array
  const allMovies = moviesData
    ?.map((section: any) => section.list) // Get the 'list' array from each section
    ?.flat(); // Flatten the arrays into a single array

  // Sort the movies by 'update_time' in descending order and take the latest 10 movies
  const latestMovies = allMovies
    ?.sort((a: any, b: any) => b.update_time - a.update_time) // Sort by update_time (newest first)
    ?.slice(0, 10); // Take the latest 10 movies

  function formatDuration(durationInSeconds: any) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    // Add leading zeros if hours, minutes, or seconds are less than 10
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    const formattedDuration = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return formattedDuration;
  }

  const handleFavoritesClick = () => {
    if (!token) {
      // If not logged in, open the login modal
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      // If logged in, redirect to the favorites page
      navigate("/favorites");
    }
  };

  const handleInviteClick = () => {
    if (!token) {
      // If not logged in, open the login modal
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      if (user?.inviter_id !== 0) {
        dispatch(
          showToast({
            message: "已邀请",
            type: "success",
          })
        );
      } else {
        navigate("/invite");
      }
      // If logged in, redirect to the favorites page
    }
  };

  const handleHistoryClick = () => {
    if (!token) {
      // If not logged in, open the login modal
      startTransition(() => {
        dispatch(setAuthModel(true));
      });
    } else {
      // If logged in, redirect to the favorites page
      navigate("/history");
    }
  };

  // console.log(latestMovies);

  return (
    <div className="profile-div">
      <div
        className={` w-full ${
          darkmode ? "profile-div-main_dark" : "profile-div-main"
        }`}
      >
        <a className="p-first cursor-pointer" onClick={handleHistoryClick}>
          <div className="flex gap-3 items-center">
            <div>
              {/* SVG Icon */}
              {darkmode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M11.138 5.45994V9.57148L14.5543 11.6211C14.7264 11.7244 14.8504 11.8919 14.899 12.0867C14.9476 12.2814 14.9169 12.4875 14.8135 12.6596C14.7102 12.8317 14.5427 12.9557 14.3479 13.0043C14.1532 13.0529 13.9471 13.0221 13.775 12.9188L9.99165 10.6488C9.87967 10.5815 9.78702 10.4864 9.72271 10.3727C9.6584 10.259 9.62463 10.1306 9.62467 9.99994V5.45994C9.62467 5.25926 9.70439 5.0668 9.84629 4.9249C9.98819 4.783 10.1807 4.70328 10.3813 4.70328C10.582 4.70328 10.7745 4.783 10.9164 4.9249C11.0583 5.0668 11.138 5.25926 11.138 5.45994ZM10.3813 0.91995C9.18769 0.916977 8.00531 1.15076 6.90261 1.60778C5.79992 2.0648 4.79882 2.73598 3.95724 3.58247C3.26962 4.2786 2.65861 4.94825 2.05801 5.64911V3.94661C2.05801 3.74593 1.97829 3.55347 1.83639 3.41157C1.69448 3.26967 1.50202 3.18995 1.30134 3.18995C1.10066 3.18995 0.908202 3.26967 0.7663 3.41157C0.624398 3.55347 0.544678 3.74593 0.544678 3.94661V7.72994C0.544678 7.93062 0.624398 8.12308 0.7663 8.26498C0.908202 8.40689 1.10066 8.48661 1.30134 8.48661H5.08467C5.28535 8.48661 5.47781 8.40689 5.61972 8.26498C5.76162 8.12308 5.84134 7.93062 5.84134 7.72994C5.84134 7.52926 5.76162 7.3368 5.61972 7.1949C5.47781 7.05299 5.28535 6.97327 5.08467 6.97327H2.90926C3.58553 6.17688 4.25896 5.42684 5.02698 4.64937C6.0786 3.59774 7.41682 2.87934 8.8744 2.58393C10.332 2.28852 11.8443 2.42919 13.2224 2.98838C14.6005 3.54756 15.7832 4.50046 16.6229 5.728C17.4625 6.95554 17.9218 8.4033 17.9433 9.89036C17.9648 11.3774 17.5476 12.8379 16.7438 14.0892C15.9401 15.3405 14.7854 16.3272 13.424 16.926C12.0627 17.5248 10.5551 17.7092 9.08955 17.4561C7.62402 17.2029 6.26559 16.5235 5.18398 15.5028C5.1117 15.4345 5.02666 15.3811 4.93373 15.3456C4.8408 15.3102 4.7418 15.2934 4.64237 15.2962C4.54295 15.299 4.44506 15.3214 4.35428 15.362C4.2635 15.4026 4.18162 15.4608 4.1133 15.5331C4.04499 15.6053 3.99158 15.6904 3.95613 15.7833C3.92068 15.8762 3.90388 15.9752 3.90669 16.0747C3.9095 16.1741 3.93187 16.272 3.97251 16.3628C4.01315 16.4535 4.07128 16.5354 4.14357 16.6037C5.2213 17.6208 6.53156 18.3586 7.96 18.7528C9.38845 19.1469 10.8917 19.1855 12.3385 18.8652C13.7852 18.5448 15.1316 17.8752 16.2602 16.9149C17.3887 15.9545 18.265 14.7325 18.8126 13.3556C19.3602 11.9786 19.5625 10.4886 19.4019 9.0155C19.2412 7.5424 18.7225 6.131 17.8909 4.90449C17.0593 3.67797 15.9402 2.67362 14.6312 1.97908C13.3223 1.28453 11.8632 0.920914 10.3813 0.91995Z"
                    fill="white"
                    fill-opacity="0.6"
                  />
                </svg>
              ) : (
                <History />
              )}
            </div>
            <div
              className={`${darkmode ? "profile-text_dark" : "profile-text"}`}
            >
              观看历史
            </div>
          </div>
          <div>{darkmode ? <RightDark /> : <Right />}</div>
        </a>

        {/* Horizontal Scrolling Movie List */}
        {token && movies?.length !== 0 && !isFetching && !recordError && (
          <div className="flex overflow-x-scroll whitespace-nowrap watch_ten scrollbar-hide gap-4 ">
            {latestMovies?.map((movie: any) => (
              <Link
                to={`/player/${movie?.movie_id}`}
                key={movie?.movie_id}
                className="w-[136px]"
              >
                <div className="relative">
                  <ImageWithPlaceholder
                    src={movie?.cover}
                    alt={`Picture of ${movie?.movie_name}`}
                    width={136}
                    height={83}
                    className="w-[136px] rounded-t-md h-[86px] object-cover object-center"
                  />
                  <div className="absolute watchedDuration bottom-[2px] right-[3px] ">
                    {formatDuration(movie?.current_time)}
                  </div>
                  <div className="absolute watchedDuration bottom-[2px] left-[3px] ">
                    {movie?.episode_name}
                  </div>
                  <div className="absolute watchedDuration top-[2px] right-[3px] ">
                    {movie?.dynamic}
                  </div>
                </div>

                <div className="watchlist-item-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        movie?.duration
                          ? (movie?.current_time / movie?.duration) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="his-text mt-1">{movie?.movie_name}</div>
              </Link>
            ))}
          </div>
        )}

        <a className="p-first cursor-pointer" onClick={handleFavoritesClick}>
          <div className="flex gap-3 items-center">
            {darkmode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="22"
                viewBox="0 0 16 22"
                fill="none"
              >
                <path
                  d="M1.12109 1.26069V1.25329L1.12094 1.24589C1.1184 1.11716 1.16698 0.992665 1.25605 0.899681C1.34355 0.808323 1.46313 0.754697 1.58937 0.75H14.4105C14.5368 0.75462 14.6564 0.80823 14.744 0.899621C14.8331 0.992611 14.8817 1.11713 14.8792 1.24589L14.879 1.25329V1.26069V20.7377H14.879L14.8791 20.7469C14.8803 20.8464 14.8523 20.944 14.7986 21.0277C14.7454 21.1107 14.6692 21.1764 14.5793 21.2169C14.5053 21.2486 14.4236 21.2578 14.3444 21.2434L14.2099 21.9812L14.3444 21.2434C14.2644 21.2288 14.1905 21.1907 14.1322 21.134L14.1323 21.1339L14.1251 21.1271L8.79649 16.0801C8.79605 16.0797 8.79562 16.0793 8.79518 16.0789C8.58076 15.8749 8.29611 15.7611 8.00011 15.7611C7.70407 15.7611 7.41939 15.8749 7.20496 16.0789C7.20455 16.0793 7.20414 16.0797 7.20372 16.0801L1.87508 21.1271L1.87504 21.1271L1.8685 21.1334C1.80997 21.1902 1.73588 21.2283 1.65564 21.243C1.57634 21.2574 1.49456 21.2483 1.42044 21.2167C1.33073 21.1762 1.25467 21.1106 1.20151 21.0277C1.14779 20.944 1.11981 20.8464 1.12103 20.7469H1.12109V20.7377V1.26069Z"
                  stroke="white"
                  stroke-opacity="0.6"
                  stroke-width="1.5"
                />
              </svg>
            ) : (
              <Collection />
            )}
            <div
              className={`${darkmode ? "profile-text_dark" : "profile-text"}`}
            >
              我的收藏
            </div>
          </div>
          <div>{darkmode ? <RightDark /> : <Right />}</div>
        </a>

        {/* Horizontal Scrolling Movie List */}
        {token &&
          favorites?.length !== 0 &&
          !isFavoritesFetching &&
          !favoriteError && (
            <div className="flex overflow-x-scroll whitespace-nowrap watch_ten scrollbar-hide gap-4 ">
              {favorites?.map((movie: any) => (
                <Link
                  to={`/player/${movie?.movie_id}`}
                  key={movie?.movie_id}
                  className="w-[114px]"
                >
                  <div className="flex flex-col w-[114px] gap-2 transition-all duration-300 ease-in-out">
                    <div className="relative w-[114px] transition-transform duration-500 ease-in-out transform">
                      <ImageWithPlaceholder
                        src={movie?.cover}
                        alt={`Picture of ${movie?.movie_name}`}
                        width={114}
                        height={153}
                        className="rounded-md w-full h-[153px] object-cover object-center"
                      />
                      <div className="absolute w-full bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent rounded-sm"></div>

                      <div className="absolute bottom-[3px] right-[3px] text-[10px]">
                        {movie?.dynamic}
                      </div>
                    </div>

                    <div>
                      <h1 className=" truncate text-[#888] text-[14px]">
                        {movie?.movie_name}
                      </h1>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        <a className="p-firs hidden cursor-pointer" onClick={handleInviteClick}>
          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M17.6919 6.34701L9.38423 0.80855C9.27046 0.732646 9.13676 0.692139 9 0.692139C8.86324 0.692139 8.72954 0.732646 8.61577 0.80855L0.308077 6.34701C0.21324 6.41028 0.135497 6.496 0.0817527 6.59655C0.0280083 6.69709 -7.39029e-05 6.80935 1.46063e-07 6.92336V15.9234C1.46063e-07 16.2906 0.145879 16.6428 0.405545 16.9024C0.66521 17.1621 1.01739 17.308 1.38462 17.308H16.6154C16.9826 17.308 17.3348 17.1621 17.5945 16.9024C17.8541 16.6428 18 16.2906 18 15.9234V6.92336C18.0001 6.80935 17.972 6.69709 17.9182 6.59655C17.8645 6.496 17.7868 6.41028 17.6919 6.34701ZM6.29308 11.7695L1.38462 15.2311V8.2673L6.29308 11.7695ZM7.70971 12.4618H10.2903L15.191 15.9234H2.80904L7.70971 12.4618ZM11.7069 11.7695L16.6154 8.2673V15.2311L11.7069 11.7695ZM9 2.21653L16.0884 6.9424L10.2903 11.0772H7.71144L1.91337 6.9424L9 2.21653Z"
                fill="#A3A3A4"
              />
            </svg>
            <div className="profile-text">我的推广达人</div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="text-[12px] text-[#d0bc94]">
              {token && user?.inviter_id !== 0
                ? user?.inviter_id
                : "输入邀请码得积分"}
            </div>
            {darkmode ? <RightDark /> : <Right />}
          </div>
        </a>
      </div>
    </div>
  );
};

export default ProfileFirst;
