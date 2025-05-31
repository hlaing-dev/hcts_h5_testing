import { useEffect, useState } from "react";
import Navbar from "./components/favorites/Navbar";
import Main from "./components/favorites/Main";
import "./profile.css";
import { useGetTagsQuery } from "../search/services/searchApi"; // Assuming the API service is here
import { useGetListQuery } from "../profile/services/profileApi";
import {
  useGetHeaderTopicsQuery,
  useGetAdsQuery,
} from "../../services/helperService";
import { useSelector } from "react-redux";
import { selectTheme } from "../search/slice/ThemeSlice";
import NewAds from "../../components/NewAds";

const Favorite = () => {
  const darkmode = useSelector(selectTheme);

  const [currentPage, setcurrentPage] = useState(1);
  const [currentType, setcurrentType] = useState<number>(0);
  // const {
  //   data: tabs,
  //   isLoading: tabLoading,
  //   isFetching: tabFetching,
  // } = useGetTagsQuery();
  const {
    data: tabs,
    isLoading: tabLoading,
    isFetching: tabFetching,
  } = useGetHeaderTopicsQuery();

  const types = tabs?.data?.movie_search_screen?.type;

  const {
    data: favoriteMovies,
    isLoading: isFavoritesLoading,
    isFetching: isFavoritesFetching,
  } = useGetListQuery({ page: currentPage, type_id: currentType }); // Fetch favorite movies list from API

  const [isEditMode, setIsEditMode] = useState(false);
  const [movies, setMovies] = useState<any[]>([]); // State to store all loaded movies

  useEffect(() => {
    if (favoriteMovies?.data?.list) {
      setMovies((prevMovies) => [...prevMovies, ...favoriteMovies.data.list]);
    }
  }, [favoriteMovies]);

  const handleEditClick = () => {
    setIsEditMode((prev) => !prev);
  };

  useEffect(() => {
    if (types && types.length > 0) {
      setcurrentType(types[0].id); // Default to first type_id
    }
  }, [types]);

  const handleTypeClick = (typeId: number) => {
    setcurrentType(typeId);
    setcurrentPage(1); // Reset to the first page when type changes
    setMovies([]); // Clear the previous movies
  };

  // Handle infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.offsetHeight;

      if (
        windowHeight + scrollTop >= docHeight - 50 &&
        favoriteMovies?.data?.total > movies.length &&
        !isFavoritesFetching
      ) {
        setcurrentPage((prevPage) => prevPage + 1); // Increment page to load next set of data
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <div className={`${darkmode ? "fixed-bg_dark" : "fixed-bg"}`}></div>
      <div className=" text-white">
        <Navbar
          isEditMode={isEditMode}
          darkmode={darkmode}
          onEditClick={handleEditClick}
        />

        <div className="mt-20">
          <NewAds section="collect_up" />
        </div>

        <>
          <Main
            darkmode={darkmode}
            currentPage={currentPage}
            setcurrentType={setcurrentType}
            currentType={currentType}
            types={types}
            isLoading={isFavoritesLoading}
            isFetching={isFavoritesFetching}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            movies={movies}
            setMovies={setMovies}
            onTypeClick={handleTypeClick}
          />
        </>
      </div>
    </>
  );
};

export default Favorite;
