import { startTransition, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../../search/components/ImgPlaceholder";
import { setAuthModel } from "../../../features/login/ModelSlice";
import { useDispatch, useSelector } from "react-redux";
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

const ProfileFirst = () => {
  // Check for token in localStorage
  const isLoggedIn = localStorage.getItem("authToken");
  const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
  const token = parsedLoggedIn?.data?.access_token;

  const { data: userData, error } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const user = userData?.data;

  const {
    data: favoriteMovies,
    // isLoading: isFavoritesLoading,
    // isFetching: isFavoritesFetching,
  } = useGetListQuery({ page: 1, type_id: 0 }, { skip: !token });
  const { data, isLoading, isFetching, refetch } = useGetRecordQuery(
    undefined,
    {
      skip: !token,
    }
  ); // Fetch favorite movies list from API

  // const [movies, setMovies] = useState<Movie[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <div className="profile-div-main w-full">
        <a className="p-first cursor-pointer" onClick={handleHistoryClick}>
          <div className="flex gap-3 items-center">
            <div>
              {/* SVG Icon */}
              <History />
            </div>
            <div className="profile-text">观看历史</div>
          </div>
          <div>
            <Right />
          </div>
        </a>

        {/* Horizontal Scrolling Movie List */}
        {token && movies?.length !== 0 && (
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
            <Collection />
            <div className="profile-text">我的收藏</div>
          </div>
          <div>
            <Right />
          </div>
        </a>

        {/* Horizontal Scrolling Movie List */}
        {token && favorites?.length !== 0 && (
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
            <Right />
          </div>
        </a>
      </div>
    </div>
  );
};

export default ProfileFirst;
