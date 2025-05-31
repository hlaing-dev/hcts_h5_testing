import { FC, useEffect, useState } from "react";
import downh from "../assets/downh.svg";
import downd from "../assets/downd.svg";
import { useNavigate } from "react-router-dom";
import { useGetHeaderTopicsQuery } from "../../src/services/helperService";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../src/pages/home/slice/HomeSlice";
import {
  setIsShowMenu,
  setShowFilterTag,
} from "../../src/features/counter/counterSlice";
import FilterByTag from "./home/FilterByTag";
import { selectTheme } from "../../src/pages/search/slice/ThemeSlice";
import { useGetSearchRankingQuery } from "../pages/search/services/searchApi";

const Header: FC = () => {
  const { data } = useGetHeaderTopicsQuery();
  // const [isShowMenu, setIsShowMenu] = useState(false);

  const darkmode = useSelector(selectTheme);
  const { data: rankList } = useGetSearchRankingQuery();
  const [randomWord, setRandomWord] = useState<string | null>(null);

  const configData = data?.data?.index_top_nav;
  const activeTab = useSelector((state: any) => state.home.activeTab);
  const sortData = useSelector((state: any) => state.home.sort);
  const sortName = useSelector((state: any) => state.home.sortName);
  const classData = useSelector((state: any) => state.home.class);
  const area = useSelector((state: any) => state.home.area);
  const year = useSelector((state: any) => state.home.year);
  const isShowMenu = useSelector((state: any) => state.counter.isShowMenu);
  const showFilterTag = useSelector(
    (state: any) => state.counter.showFilterTag
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filterTagHandler = () => {
    dispatch(setIsShowMenu(true));
  };

  useEffect(() => {
    if (!showFilterTag) {
      dispatch(setIsShowMenu(false));
    }
  }, [showFilterTag]);

  useEffect(() => {
    dispatch(setShowFilterTag(false));
    // window.scrollTo(0, 0);
  }, [classData, area, year, activeTab, sortData, sortName]);

  const ranks = rankList?.data;

  useEffect(() => {
    // Ensure layout adjusts properly
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
  }, [ranks]);

  return (
    <header
      // className={`w-full z-[99999] fixed  gradient-bg-home pt-4 pb-2 transition-all duration-300 ${
      //   isHeaderVisible ? "top-0" : "-top-[135px]"
      // }`}
      className={`w-full z-[99999] fixed  ${
        // darkmode ? showFilterTag ? "gradient-bg-home2" : "gradient-bg-home-light"
        darkmode
          ? "gradient-bg-home"
          : showFilterTag
          ? "gradient-bg-home2-light"
          : "gradient-bg-home-light"
      } pt-4 pb-2 transition-all duration-300 top-0`}
    >
      <div className="flex items-center px-3 gap-3">
        <div className="flex-1 relative">
          <input
            onFocus={() => navigate("/search_overlay")}
            placeholder={randomWord || ""}
            type="text"
            className={`rounded-[18.138px] home-input ${
              showFilterTag
                ? "bg-[#4e4e4e1a] dark:bg-[#FFFFFF33]"
                : "bg-[#ffffff1a] dark:bg-[#FFFFFF33]"
            } py-[8.062px] px-[16.123px] w-full ${
              showFilterTag
                ? "text-black placeholder:text-[#0000007A] dark:text-white dark:placeholder:text-white"
                : "text-white placeholder:text-white"
            } outline-none `}
          />
          <div className="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none"
            >
              <path
                d="M14.0482 14.0737L17 17.0248L16.0248 18L13.0737 15.0482C11.9757 15.9285 10.6099 16.4072 9.20262 16.4052C5.77877 16.4052 3 13.6265 3 10.2026C3 6.77877 5.77877 4 9.20262 4C12.6265 4 15.4052 6.77877 15.4052 10.2026C15.4072 11.6099 14.9285 12.9757 14.0482 14.0737ZM12.6657 13.5624C13.5404 12.6629 14.0289 11.4572 14.0269 10.2026C14.0269 7.53687 11.8677 5.37836 9.20262 5.37836C6.53687 5.37836 4.37836 7.53687 4.37836 10.2026C4.37836 12.8677 6.53687 15.0269 9.20262 15.0269C10.4572 15.0289 11.6629 14.5404 12.5624 13.6657L12.6657 13.5624Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full">
        <nav className="flex overflow-x-scroll px-3 gap-3 remove-scrollbar items-center md:justify-between">
          {configData?.map((item: any, index: any) => (
            <div
              className="relative"
              onClick={() => dispatch(setActiveTab(item?.id))}
              key={item.id}
            >
              <p
                className={`${
                  activeTab === item?.id
                    ? showFilterTag
                      ? "text-black dark:text-white font-bold text-[24px]"
                      : "text-white dark:text-[#FFFFFFCC] font-bold text-[24px]"
                    : showFilterTag
                    ? "text-[#0000007A] dark:text-[#FFFFFFCC] text-[16px]"
                    : "text-white/80 dark:text-[#FFFFFFCC] text-[16px]"
                } whitespace-nowrap py-2 rounded-lg transition-colors`}
              >
                {item?.name}
              </p>
            </div>
          ))}
        </nav>
      </div>

      <div className="w-full flex items-center justify-center text-white">
        {activeTab !== 0 ? (
          <>
            {showFilterTag && (
              <div
                className={` ${
                  showFilterTag ? "text-black dark:text-white" : "text-white"
                } text-[14px] ${
                  isShowMenu ? "hidden" : "flex"
                } items-center gap-1 transition`}
                onClick={filterTagHandler}
              >
                <span>
                  {sortName} . {classData} . {area} . {year}
                </span>
                <img src={downh} className="block dark:hidden" alt="" />
                <img src={downd} className="hidden dark:block" alt="" />
              </div>
            )}
            {isShowMenu ? <FilterByTag /> : <></>}
          </>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default Header;
