import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Ads from "../../../search/components/Ads";
import Loader from "../../../search/components/Loader";
import ImageWithPlaceholder from "../../../search/components/ImgPlaceholder";
import { useDeleteCollectMutation } from "../../services/profileApi"; // Import delete mutation

interface MainProps {
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  movies: any[];

  isLoading: boolean;
  isFetching: boolean;
  setMovies: any;
  types: any;
  currentType: any;
  setcurrentType: any;
  onTypeClick: any;
  currentPage: any;

  darkmode: boolean;
}

const Main: React.FC<MainProps> = ({
  currentType,

  currentPage,
  types,
  isEditMode,
  setIsEditMode,
  movies,

  isFetching,
  setMovies,
  onTypeClick,
  darkmode,
}) => {
  const navigate = useNavigate();
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [deleteMovies, setDeleteMovies] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteCollect] = useDeleteCollectMutation(); // Use the delete mutation

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleMovieSelect = (movie: string) => {
    setSelectedMovies((prevSelected) =>
      prevSelected.includes(movie)
        ? prevSelected.filter((m) => m !== movie)
        : [...prevSelected, movie]
    );
  };

  const handleDeleteSelect = (movie: string) => {
    setDeleteMovies((prevSelected) =>
      prevSelected.includes(movie)
        ? prevSelected.filter((m) => m !== movie)
        : [...prevSelected, movie]
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteCollect({ ids: deleteMovies.join(",") }).unwrap(); // Call the delete mutation
      // dispatch(deleteFavData(selectedMovies));
      setMovies((prevMovies: any[]) =>
        prevMovies.filter((movie) => !selectedMovies.includes(movie.movie_id))
      );
      setSelectedMovies([]);
      setIsEditMode(false);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete favorites:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleMovieClick = (movieId: string, id: string) => {
    if (isEditMode) {
      handleDeleteSelect(id);
      handleMovieSelect(movieId); // Select the movie when in edit mode
    } else {
      navigate(`/player/${movieId}`);
    }
  };

  const selectAllMovies = () => {
    setSelectedMovies(movies?.map((x) => x.movie_id) || []);
  };

  return (
    <div
      className={` ${
        darkmode ? "bg-[#161619]" : "bg-white"
      }   pb-[50px] mt-[20px] `}
    >
      <div className="mt-3">
        {/* {isAdsLoading || isAdsFetching ? (
          <div
            className={`flex ${
              darkmode ? "bg-[#161619]" : "bg-white"
            }    justify-center items-center h-[126px]`}
          >
            <Loader />
          </div>
        ) : (
          <>

            <NewAds section="collect_up" />
          </>
        )} */}

        <div className="flex items-center gap-2 mt-0 pt-4 px-3 overflow-x-scroll max-w-full whitespace-nowrap scrollbar-hide">
          {types?.map((type: any, index: number) => (
            <button
              key={index}
              onClick={() => onTypeClick(type.id)} // Set type on click
              className={`${
                currentType === type.id ? "collect_active" : "bg-transparent"
              } collect-btn`} // Active styling
            >
              {type.name}
            </button>
          ))}
        </div>
        {isFetching && currentPage === 1 ? (
          <div
            className={`flex justify-center items-center h-[60vh] ${
              darkmode ? "bg-[#161619]" : "bg-white"
            }`}
          >
            <Loader />
          </div>
        ) : movies.length > 0 ? (
          <div className="py-3 mt-5 mb-5 fav grid grid-cols-5 max-sm:grid-cols-3 gap-3 gap-y-5 px-3 max-md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
            {/* Movie Cards */}
            {movies.map((movie, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 transition-all duration-300 ease-in-out"
                onClick={() => handleMovieClick(movie?.movie_id, movie?.id)} // Handle click for redirection or selection
              >
                <div className="relative transition-transform duration-500 ease-in-out transform">
                  <div
                    className={`${
                      darkmode ? "custom-checkbox_dark" : "custom-checkbox"
                    } absolute top-[2px] right-[2px] z-10 ${
                      isEditMode ? "block" : "hidden"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMovies.includes(movie.movie_id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleMovieSelect(movie.movie_id);
                      }}
                      className="h-5 w-5 text-[#fe58b5] border-2 border-gray-600 rounded-full focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <ImageWithPlaceholder
                    src={movie?.cover}
                    alt={`Picture of ${movie?.movie_name}`}
                    width="100%"
                    height={153}
                    className="rounded-md w-full h-[153px] object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent rounded-sm"></div>

                  <div className="absolute bottom-[3px] right-[3px] text-[10px]">
                    {movie?.dynamic}
                  </div>
                </div>

                <div>
                  <h1
                    className={`fav_text truncate ${
                      darkmode ? "text-white" : "text-black"
                    }`}
                  >
                    {movie?.movie_name}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-center h-[60vh]">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="118"
                height="115"
                viewBox="0 0 118 115"
                fill="none"
              >
                <path
                  d="M56.0217 114.506C86.9616 114.506 112.043 106.054 112.043 95.6292C112.043 85.204 86.9616 76.7527 56.0217 76.7527C25.0818 76.7527 0 85.204 0 95.6292C0 106.054 25.0818 114.506 56.0217 114.506Z"
                  fill="#3E3E3E"
                />
                <path
                  d="M88.8417 82.2082L57.7301 100.172L22.6958 79.8968L53.8074 61.9368L88.8417 82.2082Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.5"
                  d="M88.8417 82.2082L57.7301 100.172L22.6958 79.8968L53.8074 61.9368L88.8417 82.2082Z"
                  fill="black"
                />
                <path
                  d="M53.8074 37.5864V61.9367L22.6958 79.8967V55.5507L53.8074 37.5864Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.23"
                  d="M53.8074 37.5864V61.9367L22.6958 79.8967V55.5507L53.8074 37.5864Z"
                  fill="black"
                />
                <path
                  d="M57.7301 75.8223V100.172L22.6958 79.8968V55.5508L57.7301 75.8223Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.38"
                  d="M57.7301 75.8223V100.172L22.6958 79.8968V55.5508L57.7301 75.8223Z"
                  fill="black"
                />
                <path
                  d="M88.8419 57.8579V82.2081L53.8076 61.9367V37.5864L88.8419 57.8579Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.4"
                  d="M88.8419 57.8579V82.2081L53.8076 61.9367V37.5864L88.8419 57.8579Z"
                  fill="black"
                />
                <path
                  d="M88.8418 82.2081V57.8579L57.7302 75.8222V100.172L88.8418 82.2081Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.23"
                  d="M88.8418 82.2081V57.8579L57.7302 75.8222V100.172L88.8418 82.2081Z"
                  fill="black"
                />
                <path
                  d="M53.8076 37.5865L53.8498 24.106L88.7997 44.4027L88.8419 57.858L53.8076 37.5865Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.2"
                  d="M53.8076 37.5865L53.8498 24.106L88.7997 44.4027L88.8419 57.858L53.8076 37.5865Z"
                  fill="black"
                />
                <path
                  d="M57.7302 75.8221L60.649 64.0287L91.478 46.229L88.8418 57.8579L57.7302 75.8221Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.3"
                  d="M57.7302 75.8221L60.649 64.0287L91.478 46.229L88.8418 57.8579L57.7302 75.8221Z"
                  fill="black"
                />
                <path
                  d="M22.6959 55.5507L18.9841 43.3187L50.0957 25.3586L53.8075 37.5865L22.6959 55.5507Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.1"
                  d="M22.6959 55.5507L18.9841 43.3187L50.0957 25.3586L53.8075 37.5865L22.6959 55.5507Z"
                  fill="black"
                />
                <path
                  d="M22.6959 55.5509L15.3735 45.4404L50.412 65.7119L57.7302 75.8223L22.6959 55.5509Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.45"
                  d="M22.6959 55.5509L15.3735 45.4404L50.412 65.7119L57.7302 75.8223L22.6959 55.5509Z"
                  fill="black"
                />
                <g opacity="0.7">
                  <path
                    d="M66.8915 92.9302C66.8408 92.9303 66.7921 92.9104 66.7558 92.8749C66.7195 92.8394 66.6986 92.7912 66.6975 92.7404V88.455C66.6986 88.4039 66.7194 88.3552 66.7555 88.319C66.7917 88.2828 66.8404 88.2621 66.8915 88.261C66.9423 88.2621 66.9905 88.283 67.026 88.3193C67.0615 88.3556 67.0814 88.4043 67.0813 88.455V92.7404C67.0813 92.7908 67.0613 92.8391 67.0257 92.8747C66.9902 92.9103 66.9419 92.9302 66.8915 92.9302Z"
                    fill="#BEBABA"
                  />
                  <path
                    d="M66.3305 89.9396C66.3054 89.9436 66.2797 89.9436 66.2546 89.9396C66.2086 89.9184 66.1724 89.8803 66.1536 89.8333C66.1348 89.7862 66.1347 89.7337 66.1534 89.6866L66.8367 88.1133L67.5959 88.9906C67.6231 89.0299 67.6348 89.0778 67.6288 89.1252C67.6229 89.1726 67.5997 89.2161 67.5637 89.2474C67.5276 89.2787 67.4813 89.2957 67.4335 89.295C67.3858 89.2943 67.34 89.276 67.3049 89.2437L66.9463 88.8219L66.5245 89.8342C66.5063 89.869 66.4781 89.8977 66.4436 89.9164C66.409 89.9352 66.3697 89.9433 66.3305 89.9396Z"
                    fill="#BEBABA"
                  />
                  <path
                    d="M68.6588 91.9221C68.6081 91.921 68.5598 91.9001 68.5243 91.8638C68.4888 91.8276 68.469 91.7788 68.469 91.7281V87.4469C68.469 87.3965 68.489 87.3483 68.5246 87.3127C68.5602 87.2771 68.6085 87.2571 68.6588 87.2571C68.7091 87.2571 68.7574 87.2771 68.793 87.3127C68.8286 87.3483 68.8486 87.3965 68.8486 87.4469V91.7239C68.8492 91.7494 68.8447 91.7747 68.8355 91.7985C68.8262 91.8222 68.8124 91.8439 68.7948 91.8623C68.7771 91.8807 68.7561 91.8955 68.7327 91.9058C68.7094 91.916 68.6843 91.9216 68.6588 91.9221Z"
                    fill="#BEBABA"
                  />
                  <path
                    d="M68.0979 88.9317C68.0727 88.9356 68.0471 88.9356 68.0219 88.9317C67.9988 88.9216 67.9779 88.9071 67.9604 88.8888C67.943 88.8706 67.9293 88.8491 67.9203 88.8255C67.9113 88.802 67.907 88.7768 67.9078 88.7516C67.9086 88.7264 67.9144 88.7016 67.9249 88.6786L68.604 87.0842L69.3632 87.9573C69.3983 87.9935 69.4179 88.0419 69.4179 88.0923C69.4179 88.1427 69.3983 88.1911 69.3632 88.2273C69.3456 88.2451 69.3246 88.2593 69.3014 88.269C69.2782 88.2787 69.2534 88.2837 69.2283 88.2837C69.2032 88.2837 69.1783 88.2787 69.1551 88.269C69.132 88.2593 69.1109 88.2451 69.0933 88.2273L68.7348 87.8055L68.313 88.8178C68.2955 88.8585 68.2646 88.892 68.2255 88.9127C68.1864 88.9334 68.1413 88.9401 68.0979 88.9317Z"
                    fill="#BEBABA"
                  />
                </g>
                <g opacity="0.7">
                  <path
                    d="M61.7921 95.8363C61.72 95.8374 61.6488 95.8199 61.5854 95.7857C61.5091 95.7368 61.4474 95.6684 61.4066 95.5875C61.3658 95.5066 61.3474 95.4163 61.3534 95.3259V94.7987C61.3545 94.748 61.3754 94.6997 61.4117 94.6642C61.448 94.6287 61.4967 94.6089 61.5474 94.6089C61.5978 94.6089 61.6461 94.6289 61.6816 94.6645C61.7172 94.7001 61.7372 94.7483 61.7372 94.7987V95.3259C61.7372 95.4019 61.7372 95.444 61.7752 95.4525C61.8132 95.4609 61.8343 95.4525 61.8975 95.4187C62.0162 95.3091 62.1098 95.175 62.1717 95.0257C62.2336 94.8764 62.2623 94.7155 62.2561 94.554V92.3607C62.2561 92.3104 62.276 92.2621 62.3116 92.2265C62.3472 92.1909 62.3955 92.1709 62.4459 92.1709C62.4962 92.1709 62.5445 92.1909 62.5801 92.2265C62.6157 92.2621 62.6357 92.3104 62.6357 92.3607V94.554C62.6451 94.7818 62.6007 95.0085 62.5062 95.2159C62.4117 95.4233 62.2696 95.6055 62.0916 95.7477C62.0014 95.8034 61.898 95.834 61.7921 95.8363Z"
                    fill="#BEBABA"
                  />
                  <path
                    d="M59.78 94.069V93.74C59.8302 92.8953 60.0771 92.0739 60.5011 91.3416C60.9252 90.6092 61.5145 89.9861 62.2222 89.5221C62.914 89.1256 63.572 89.0665 64.0781 89.3618C64.3481 89.5469 64.5633 89.8012 64.7014 90.098C64.8394 90.3948 64.8951 90.7233 64.8627 91.049V91.1586L59.78 94.069ZM63.3695 89.539C63.0318 89.5545 62.7036 89.6561 62.4162 89.8342C61.8098 90.2332 61.2963 90.7581 60.9106 91.373C60.5249 91.988 60.276 92.6787 60.1807 93.3984L64.4704 90.9182C64.4887 90.6739 64.4436 90.4291 64.3394 90.2074C64.2352 89.9857 64.0754 89.7946 63.8757 89.6528C63.7198 89.5712 63.5453 89.5319 63.3695 89.539Z"
                    fill="#BEBABA"
                  />
                </g>
                <path
                  opacity="0.7"
                  d="M15.3735 45.4404L50.412 65.7119L57.7302 75.8223L50.024 66.0704L15.3735 45.4404Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.7"
                  d="M88.8418 57.8579L57.7302 75.8222V100.172L58.3123 76.3114L88.8418 57.8579Z"
                  fill="#BEBABA"
                />
                <path
                  d="M43.1868 48.1187C46.3966 47.6548 49.3281 45.588 51.2009 42.9897C52.0742 41.7757 52.7175 40.4119 53.0989 38.9658C53.504 37.6135 53.5706 36.1825 53.293 34.7985C52.7151 32.4828 50.5724 31.112 48.3073 30.8251C47.158 30.6739 45.9893 30.7879 44.8908 31.1584C43.7518 31.5493 42.7636 32.2867 42.0648 33.2673C41.6266 33.7898 41.3509 34.4291 41.2718 35.1064C41.2651 35.3716 41.3586 35.6297 41.5337 35.8291C41.7088 36.0284 41.9527 36.1544 42.2166 36.182C42.8958 36.2392 43.5745 36.0669 44.1442 35.6927C44.8389 35.3031 45.4507 34.7816 45.9453 34.1573C47.0062 32.848 47.8001 31.3433 48.282 29.7285C48.6202 28.3428 48.6202 26.8962 48.282 25.5105C48.0252 24.061 47.3626 22.7141 46.3713 21.6258C45.2348 20.5923 43.7927 19.9571 42.263 19.8163C40.7406 19.6071 39.1905 19.7515 37.7329 20.2381C37.0927 20.4322 36.4996 20.7568 35.9909 21.1914C35.6282 21.5288 35.2148 22.0856 35.3625 22.6339C35.5101 23.1822 36.3115 23.4269 36.8556 23.3552C37.6609 23.2043 38.3985 22.8044 38.9646 22.2121C39.5954 21.5911 40.1312 20.8804 40.5547 20.1031C40.8694 19.5445 41.0336 18.9137 41.0314 18.2725C40.9765 15.5984 38.0198 13.869 35.7041 13.3797C35.079 13.2491 34.4387 13.2065 33.8018 13.2532C33.5867 13.2532 33.7175 13.6075 33.8904 13.5948C35.1365 13.5382 36.3749 13.8179 37.4756 14.4047C38.5617 14.9038 39.4738 15.7161 40.095 16.7372C40.3718 17.2406 40.5085 17.8091 40.4907 18.3834C40.4729 18.9576 40.3013 19.5166 39.9938 20.0019C39.5808 20.7212 39.0665 21.3775 38.4669 21.9506C37.9649 22.4061 37.2015 22.9334 36.4971 22.8827C36.3808 22.8825 36.2669 22.8495 36.1685 22.7876C36.07 22.7257 35.9909 22.6374 35.9403 22.5327C35.9191 22.3942 35.9305 22.2526 35.9737 22.1193C36.0169 21.986 36.0907 21.8647 36.1892 21.765C36.5616 21.3639 37.0223 21.0549 37.5347 20.8624C38.8001 20.3363 40.1703 20.1111 41.5375 20.2044C42.9465 20.2299 44.3168 20.67 45.4771 21.4697C46.4879 22.309 47.2058 23.4478 47.527 24.7218C47.934 26.0159 48.0605 27.3819 47.8982 28.7288C47.6477 30.0841 47.127 31.3751 46.3671 32.525C45.5868 33.8157 44.6082 35.0558 43.1404 35.5619C42.7776 35.6927 42.0184 35.8825 41.875 35.3552C41.7316 34.828 42.1449 34.1784 42.4106 33.7693C42.9983 32.8445 43.8549 32.1217 44.8655 31.6983C45.8406 31.3074 46.8933 31.1486 47.9404 31.2343C49.927 31.3819 51.9432 32.4195 52.635 34.3935C52.982 35.5733 53.0197 36.8224 52.7446 38.021C52.4965 39.3347 52.0242 40.596 51.3485 41.7496C49.895 44.2008 47.6937 46.1212 45.068 47.2288C44.4437 47.4987 43.8026 47.7265 43.1488 47.9374C43.0813 47.9627 43.1108 48.1314 43.1868 48.1187Z"
                  fill="#BEBABA"
                />
                <path
                  d="M29.7779 11.4986C28.0907 11.3763 25.7666 12.7049 26.5933 13.675C27.4201 14.6452 29.6134 13.0761 29.6134 13.0761C29.6134 13.0761 29.4067 15.0374 30.1238 15.261C30.8408 15.4845 31.811 13.6118 31.0939 12.4139C31.4397 12.5502 31.8144 12.5969 32.1831 12.5497C32.5518 12.5025 32.9026 12.363 33.2029 12.1439C34.2236 11.3931 33.1438 10.6845 31.7055 10.811C31.7055 10.811 32.7347 7.43668 30.6552 8.08203C29.6134 8.39838 29.2464 9.61737 29.7779 11.4986Z"
                  fill="#BEBABA"
                />
                <path
                  opacity="0.65"
                  d="M29.7779 11.4986C28.0907 11.3763 25.7666 12.7049 26.5933 13.675C27.4201 14.6452 29.6134 13.0761 29.6134 13.0761C29.6134 13.0761 29.4067 15.0374 30.1238 15.261C30.8408 15.4845 31.811 13.6118 31.0939 12.4139C31.4397 12.5502 31.8144 12.5969 32.1831 12.5497C32.5518 12.5025 32.9026 12.363 33.2029 12.1439C34.2236 11.3931 33.1438 10.6845 31.7055 10.811C31.7055 10.811 32.7347 7.43668 30.6552 8.08203C29.6134 8.39838 29.2464 9.61737 29.7779 11.4986Z"
                  fill="#BEBABA"
                />
                <path
                  d="M31.3469 12.2156C31.2536 12.1242 31.155 12.0382 31.0517 11.9583C30.904 11.8444 30.748 11.7347 30.6003 11.6251C30.4566 11.5205 30.3058 11.4261 30.149 11.3424C30.0588 11.2924 29.9658 11.2473 29.8706 11.2075C29.7392 11.1457 29.593 11.1224 29.4488 11.14C29.4111 11.1411 29.3743 11.1522 29.3423 11.1724C29.3103 11.1926 29.2844 11.2209 29.2671 11.2546C29.2499 11.2882 29.242 11.3258 29.2443 11.3636C29.2466 11.4013 29.2589 11.4377 29.2801 11.469C29.3961 11.5946 29.5408 11.6901 29.7019 11.7474L29.9297 11.8697C30.0858 11.9625 30.2249 12.0679 30.3515 12.1734C30.478 12.2788 30.6467 12.3801 30.7733 12.4855C30.9909 12.662 31.2341 12.8042 31.4945 12.9073C31.5062 12.9136 31.5193 12.9169 31.5325 12.9169C31.5458 12.9169 31.5588 12.9136 31.5705 12.9073C31.7856 12.7386 31.4692 12.3379 31.3469 12.2156Z"
                  fill="#455A64"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="4.5"
                  transform="matrix(1 0 0 -1 99.5469 45)"
                  stroke="#C4C4C4"
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="2.5"
                  transform="matrix(1 0 0 -1 94.3594 21)"
                  fill="#C4C4C4"
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="2.5"
                  transform="matrix(1 0 0 -1 65.3594 5)"
                  fill="#C4C4C4"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="4.5"
                  transform="matrix(1 0 0 -1 107.734 19)"
                  stroke="#565454"
                />
                <path
                  d="M73.2165 21.8571C73.2165 22.4883 73.7282 23 74.3594 23C74.9906 23 75.5022 22.4883 75.5022 21.8571V16.1429C75.5022 15.5117 74.9906 15 74.3594 15C73.7282 15 73.2165 15.5117 73.2165 16.1429V21.8571Z"
                  fill="#D9D9D9"
                />
                <path
                  d="M71.5022 17.8571C70.871 17.8571 70.3594 18.3688 70.3594 19C70.3594 19.6312 70.871 20.1429 71.5022 20.1429L77.2165 20.1429C77.8477 20.1429 78.3594 19.6312 78.3594 19C78.3594 18.3688 77.8477 17.8571 77.2165 17.8571L71.5022 17.8571Z"
                  fill="#D9D9D9"
                />
                <path
                  d="M85.2165 8.85714C85.2165 9.48833 85.7282 10 86.3594 10C86.9906 10 87.5022 9.48833 87.5022 8.85714V3.14286C87.5022 2.51167 86.9906 2 86.3594 2C85.7282 2 85.2165 2.51167 85.2165 3.14286V8.85714Z"
                  fill="#565454"
                />
                <path
                  d="M83.5022 4.85714C82.871 4.85714 82.3594 5.36882 82.3594 6C82.3594 6.63118 82.871 7.14286 83.5022 7.14286L89.2165 7.14286C89.8477 7.14286 90.3594 6.63118 90.3594 6C90.3594 5.36882 89.8477 4.85714 89.2165 4.85714L83.5022 4.85714Z"
                  fill="#565454"
                />
              </svg>
              <p className="no_history">空空如也</p>
            </div>
          </div>
        )}

        {isFetching && currentPage !== 1 && (
          <div
            className={`flex ${
              darkmode ? "bg-[#161619]" : "bg-white"
            } justify-center mt-8 items-center pb-8`}
          >
            <Loader />
          </div>
        )}

        <div
          className={`fixed z-10 bottom-0 gap-3 w-full ${
            darkmode ? "bg-[#161619]" : " bg-white"
          } p-6 flex justify-between items-center  transition-transform duration-300 ease-in-out ${
            isEditMode ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button
            className={`w-[50%]  ${
              darkmode ? "cancel-all_dark" : "cancel-all"
            }`}
            onClick={() =>
              selectedMovies && selectedMovies.length === movies?.length
                ? setSelectedMovies([])
                : selectAllMovies()
            }
          >
            {selectedMovies && selectedMovies.length === movies?.length
              ? "全部取消"
              : "选择全部"}
          </button>
          <button
            className="delete-all w-[50%]"
            onClick={handleDelete}
            disabled={selectedMovies.length === 0}
          >
            删除 {selectedMovies.length > 0 && `${selectedMovies.length}`}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-80 flex justify-center items-center">
            <div
              className={` ${
                darkmode ? "bg-[#161619]" : "bg-white"
              } confirm rounded-2xl mx-10 text-center shadow-lg`}
            >
              <h2 className={`${darkmode ? "text-white" : "text-black"} p-5`}>
                确定要删除所有历史记录吗?
              </h2>
              <div className="flex justify-between">
                <button
                  className={`${
                    darkmode ? " text-white" : "text-[#080808]"
                  } w-[50%] p-3 border-t-[1px] border-r-[1px] border-white/30`}
                  onClick={cancelDelete}
                >
                  取消
                </button>
                <button
                  className="text-[#fe58b5] w-[50%] p-3 border-t-[1px] border-white/30"
                  onClick={confirmDelete}
                >
                  删除全部
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
