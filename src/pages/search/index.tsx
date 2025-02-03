import React, { useEffect, useState } from "react";
import "./search.css";
import Navbar from "./components/overlay/Navbar";
import History from "./components/History";
import Everyone from "./components/Everyone";
import {
  useGetSearchLateQuery,
  useGetSearchRankingQuery,
} from "./services/searchApi";
import Rankings from "./components/Rankings";
import Loader from "./components/Loader";
import Ads from "../../components/NewAds";
import { useLocation } from "react-router-dom";
import { useGetAdsQuery } from "../../services/helperService";
import { useSelector } from "react-redux";
import { selectTheme } from "./slice/ThemeSlice";

const Search: React.FC = () => {
  const {
    data: search_late,
    isLoading: lateLoading,
    isFetching: lateFetching,
    refetch,
  } = useGetSearchLateQuery();
  const darkmode = useSelector(selectTheme);
  const { data, isLoading, isFetching } = useGetSearchRankingQuery();
  const ranks = data?.data;

  const [randomWord, setRandomWord] = useState<string | null>(null);

  const location = useLocation();

  // Get a random item

  useEffect(() => {
    // Ensure layout adjusts properly
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    // Randomly select a word from the ranks data
    if (ranks && ranks.length > 0) {
      const rankList = ranks[0]?.list;
      if (rankList && rankList.length > 0) {
        // Randomly pick a word from the rank list
        const randomIndex = Math.floor(Math.random() * rankList.length);
        const randomItem = rankList[randomIndex];
        setRandomWord(randomItem.word);
      }
    }
  }, [ranks, location]);

  return (
    <>
      <div className={`${darkmode ? "dark-search-bg" : "search-bg"}`}></div>
      <Navbar randomWord={randomWord} />
      <div className="lg:container lg:mx-auto lg:px-[100px]">
        <div className="mt-[76px]">
          <Ads section={"search_input_under"} />
        </div>
        <History />
        <Everyone
          lists={search_late?.data}
          Loading={lateLoading}
          Fetching={lateFetching}
          refetch={refetch}
        />
        <Rankings />
      </div>
    </>
  );
};

export default Search;
