import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageWithPlaceholder from "../../../search/components/ImgPlaceholder";
import { useDeleteRecordMutation } from "../../services/profileApi";
//import { useGetAdsQuery } from "../../../search/services/searchApi";

const Main: React.FC<any> = ({
  isEditMode,
  setIsEditMode,
  movies,
  refetch,
  darkmode,
}) => {
  const [selectedMovies, setSelectedMovies] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteRecord] = useDeleteRecordMutation(); // Use the delete mutation
  const [filterToggle, setFilterToggle] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleMovieSelect = (movieId: string) => {
    setSelectedMovies((prevSelected) =>
      prevSelected.includes(movieId)
        ? prevSelected.filter((id) => id !== movieId)
        : [...prevSelected, movieId]
    );
  };

  const confirmDelete = async () => {
    await deleteRecord({ ids: selectedMovies.join(",") }).unwrap(); // Call the delete mutation
    refetch();

    setIsEditMode(false);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  // Calculate view percentage
  const calculateViewPercentage = (progress_time: number, duration: number) => {
    if (duration && progress_time) {
      return ((progress_time / duration) * 100).toFixed(2); // Display up to 2 decimal points
    }
    return "0";
  };

  const handleSelectAllAndCancel = () => {
    const allMovies =
      movies && movies.length > 0
        ? movies.reduce((a: any, c: any) => {
            c.list.map((x: any) => a.push(x.id));
            return a;
          }, [])
        : [];
    if (selectedMovies && selectedMovies?.length === allMovies?.length) {
      setSelectedMovies([]);
    } else {
      setSelectedMovies(allMovies);
    }
  };

  const handleToggle = () => {
    setFilterToggle(!filterToggle);
  };

  return (
    <div
      className={`  mt-[25px] pb-[50px] ${
        darkmode ? "bg-[#161619]" : "bg-white"
      }`}
    >
      {/* {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[126px]">
          <Loader />
        </div>
      ) : (
        <div className="py-2">
          <NewAds section="play_record_up" />
        </div>
      )} */}
      {movies?.map((movie: any, index: number) => {
        // Filter the movies based on the filterToggle state
        const filteredList = filterToggle
          ? movie?.list?.filter(
              (mov: any) =>
                calculateViewPercentage(mov.current_time, mov.duration) !==
                "100.00"
            )
          : movie?.list;

        // If the filtered list is empty, skip rendering the section
        if (!filteredList || filteredList.length === 0) return null;

        return (
          <div className="mt-5" key={index}>
            <div
              className={`flex items-center relative justify-between bg-black/10 ${
                darkmode ? "my-5" : ""
              } px-4 py-1`}
            >
              <div
                className={`history-text w-full my-[4px py-[4px] pl-[20px] h-[30px] ${
                  darkmode
                    ? "text-white bg-white/5 absolute"
                    : "text-black bg-black/1"
                }  left-0`}
              >
                h{movie?.title}
              </div>
              {/* <div className="flex gap-2 items-center">
                <p className="filter-text">过滤已观看完视频</p>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterToggle}
                    onChange={handleToggle}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                      filterToggle
                        ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
                        : "peer-checked:bg-[#606060]"
                    }`}
                  ></div>
                </label>
              </div> */}
            </div>

            <div className="py-3">
              {/* Render filtered movie list */}
              {filteredList.map((mov: any, index: any) => (
                <div
                  key={index}
                  className="history-card transition-all duration-300 ease-in-out"
                  onClick={(e) => {
                    if (isEditMode) {
                      // In edit mode, allow selection
                      if (!(e.target as HTMLElement).closest("input")) {
                        handleMovieSelect(mov.id);
                      }
                    } else {
                      // Not in edit mode, redirect to player
                      navigate(`/player/${mov.movie_id}`);
                    }
                  }}
                >
                  {/* Checkbox for Edit Mode */}
                  <div
                    className={`${
                      darkmode ? "custom-checkbox_dark" : "custom-checkbox"
                    } transition-transform duration-300 ease-in-out transform ${
                      isEditMode ? "translate-x-3" : "-translate-x-[50px]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMovies.includes(mov.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleMovieSelect(mov.id);
                      }}
                      className="h-5 w-5 text-[#fe58b5] border-2 border-gray-600 rounded-full focus:ring-0 focus:outline-none"
                    />
                  </div>

                  <div
                    className={`transition-transform flex items-center justify-between duration-300 ease-in-out transform ${
                      isEditMode ? "translate-x-[25px]" : "translate-x-0"
                    } `}
                  >
                    <div className="relative">
                      <ImageWithPlaceholder
                        src={mov?.cover}
                        alt={`Picture of ${movie?.mov_name}`}
                        width={116}
                        height={80}
                        className="rounded-md w-[116px] h-[80px] object-cover object-center"
                      />

                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent rounded-sm"></div>

                      <div className="absolute text-[#080808] bottom-1 text-[10px] left-1 z-10">
                        {mov?.episode_name}
                      </div>
                    </div>

                    <div className="flex justify-between w-full ml-5">
                      <div>
                        <h1
                          className={`text-[16px] font-semibold ${
                            darkmode ? "text-white" : "text-black"
                          }`}
                        >
                          {mov.movie_name}
                        </h1>
                        <p
                          className={`text-sm  mt-1 ${
                            darkmode ? "text-white/40" : "text-black/60"
                          }`}
                        >
                          {mov.episode_name} 已观看
                          <span>
                            {" "}
                            {calculateViewPercentage(
                              mov.current_time,
                              mov.duration
                            )}
                            %
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`fixed z-10 bottom-0 gap-3 w-full ${
                darkmode ? "bg-[#161619]" : "bg-[#fff]"
              } border-t border-white/10 p-6 flex justify-between items-center transition-transform duration-300 ease-in-out ${
                isEditMode ? "translate-y-0" : "transform translate-y-full"
              }`}
            >
              <button
                className={`w-[50%]  ${
                  darkmode ? "cancel-all_dark" : "cancel-all"
                }`}
                onClick={() => handleSelectAllAndCancel()}
              >
                {selectedMovies && selectedMovies.length === movie?.list?.length
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
          </div>
        );
      })}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-80 flex justify-center items-center">
          <div
            className={` ${
              darkmode ? "bg-[#242428]" : "bg-[#fff]"
            } confirm rounded-2xl mx-10 text-center shadow-lg`}
          >
            <h2
              className={`p-5 text-white ${
                darkmode ? "text-white" : "text-[#080808]"
              }`}
            >
              确定要删除所有观看历史吗？
            </h2>
            <div className="flex justify-between">
              <button
                className={` ${
                  darkmode ? "text-white" : "text-[#080808]"
                } w-[50%] p-3 border-t-[1px] border-r-[1px] border-white/20`}
                onClick={cancelDelete}
              >
                取消
              </button>
              <button
                className="text-[#fe58b5] w-[50%] p-3 border-t-[1px] border-white/20"
                onClick={confirmDelete}
              >
                删除全部
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
