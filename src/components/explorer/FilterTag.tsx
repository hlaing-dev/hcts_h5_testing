import { useEffect, useRef, useState } from "react";
import {
  setActiveTab,
  setArea,
  setClass,
  setSort,
  setSortName,
  setYear,
} from "../../pages/explorer/slice/ExploreSlice";
import { useGetHeaderTopicsQuery } from "../../services/helperService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import downh from "../../assets/downh.svg";
import downd from "../../assets/downd.svg";
import ExplorerTags from "./ExplorerTags";
import { setShowMenu } from "../../features/counter/counterSlice";

const FilterTag = () => {
  const location = useLocation();
  const selectedClassRef = useRef<any>(null);
  const selectedYearRef = useRef<any>(null);
  const selectedAreaRef = useRef<any>(null);
  const [activeClass, setActiveClass] = useState(0);
  const [activeArea, setActiveArea] = useState(0);
  const [activeYear, setActiveYear] = useState(0);
  const [isReady, setIsReady] = useState(false); // New state to control rendering

  const activeTab = useSelector((state: any) => state?.explore?.activeTab);
  const showMenu = useSelector((state: any) => state?.counter?.showMenu);
  const sort = useSelector((state: any) => state?.explore?.sort);
  const sortName = useSelector((state: any) => state?.explore?.sortName);
  const classData = useSelector((state: any) => state?.explore?.class);
  const area = useSelector((state: any) => state?.explore?.area);
  const year = useSelector((state: any) => state?.explore?.year);

  const { data: configData } = useGetHeaderTopicsQuery();
  const dispatch = useDispatch();
  const filterTagRef = useRef<any>(null);
  const [show, setShow] = useState(false);

  // Wait for initial data to load before rendering
  useEffect(() => {
    if (configData) {
      setIsReady(true);
    }
  }, [configData]);

  const filterTagHandler = () => {
    dispatch(setShowMenu(true));
    setShow(true);
  };

  useEffect(() => {
    setShow(false);
    // window.scrollTo(0, 0);
  }, [classData, area, year, activeTab, sort, sortName]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Only run this when activeTab changes after initial load
    dispatch(setSort("by_default"));
    dispatch(setSortName("综合"));
    dispatch(setClass("类型"));
    dispatch(setArea("地区"));
    dispatch(setYear("年份"));
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (filterTagRef.current) {
        const rect = filterTagRef.current.getBoundingClientRect();
        // console.log(rect);

        if (rect.top < 100) {
          // dispatch(setShowExploreFilterTag(true));
          setShow(true);
          dispatch(setShowMenu(false));
        } else {
          // dispatch(setShowExploreFilterTag(false));
          setShow(false);
          // setShowMenu();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);

  useEffect(() => {
    if (selectedYearRef.current) {
      selectedYearRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Ensure horizontal centering
        block: "nearest", // Keep vertical positioning intact
      });
    }
  }, [year]);
  useEffect(() => {
    if (selectedClassRef.current) {
      selectedClassRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Ensure horizontal centering
        block: "nearest", // Keep vertical positioning intact
      });
    }
  }, [classData]);

  useEffect(() => {
    if (selectedAreaRef.current) {
      selectedAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Ensure horizontal centering
        block: "nearest", // Keep vertical positioning intact
      });
    }
  }, [area]);

  if (!isReady) {
    return (
      <div className="flex flex-col gap-3 py-5">
        {/* Render a placeholder with the exact same dimensions */}
        <div className="fixed w-full z-50 bg-white dark:bg-[#161619] top-[53px] h-[50px]"></div>
        <div className="mt-5 flex flex-col gap-3 pb-5 pt-2 h-[180px] bg-white dark:bg-[#161619]"></div>
      </div>
    );
  }

  const filteredTags = configData?.data?.movie_screen?.filter?.filter(
    (data: any) => data?.id == activeTab
  );

  return (
    <>
      <div className="flex flex-col gap-3 py-5">
        <div
          // className={`fixed w-full z-50 bg-background transition-all duration-300 ${
          //   isHeaderVisible ? "top-[53px]" : "-top-[135px]"
          // }`}
          className={`fixed w-full z-50 bg-white dark:bg-[#161619] transition-all duration-300 top-[53px]`}
        >
          <div className="flex  overflow-x-scroll px-3 gap-6 remove-scrollbar bg-white dark:bg-[#161619] items-center  w-full">
            {configData?.data?.movie_search_screen?.type
              ?.filter((data: any) => data?.id !== 0)
              ?.map((item: any, index: any) => (
                <div className="relative" key={index}>
                  <p
                    onClick={() => dispatch(setActiveTab(item?.id))}
                    className={`${
                      activeTab === item?.id
                        ? "text-[16px] text-[#080808CC] dark:text-white"
                        : "text-[16px] text-[#0808087A] dark:text-[#FFFFFFCC]"
                    } whitespace-nowrap hover:text-[080808CC] transition-colors`}
                  >
                    {item?.name}
                  </p>
                  <div
                    className={`py-[1px] rounded-full ${
                      activeTab === item?.id && "bg-orange-600"
                    } w-full`}
                  ></div>
                </div>
              ))}
          </div>
          {show ? (
            <>
              {/* <div className="bg-[#00000080] z-20 fixed top-0 left-0 w-full h-screen"></div> */}
              <div
                onClick={filterTagHandler}
                className={`mt-3 pb-3 text-[#080808CC] dark:text-white text-[14px] ${
                  showMenu ? "hidden" : "flex"
                } items-center justify-center gap-1 transition`}
              >
                <span>
                  {sortName} . {classData} . {area} . {year}
                </span>
                <img src={downh} className="block dark:hidden" alt="" />
                <img src={downd} className="hidden dark:block" alt="" />
              </div>
            </>
          ) : (
            <></>
          )}
          {showMenu ? (
            <div className="flex flex-col gap-3 py-3">
              <ExplorerTags
                configData={configData}
                dispatch={dispatch}
                setSort={setSort}
                setSortName={setSortName}
                sort={sort}
                filteredTags={filteredTags}
                classData={classData}
                selectedClassRef={selectedClassRef}
                setActiveClass={setActiveClass}
                setClass={setClass}
                activeClass={activeClass}
                area={area}
                selectedAreaRef={selectedAreaRef}
                setActiveArea={setActiveArea}
                setArea={setArea}
                activeArea={activeArea}
                year={year}
                selectedYearRef={selectedYearRef}
                setActiveYear={setActiveYear}
                setYear={setYear}
                activeYear={activeYear}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* {!showMenu && ( */}

        <div className="mt-5 flex flex-col gap-3 pb-5 pt-2">
          <ExplorerTags
            configData={configData}
            dispatch={dispatch}
            setSort={setSort}
            setSortName={setSortName}
            sort={sort}
            filteredTags={filteredTags}
            classData={classData}
            selectedClassRef={selectedClassRef}
            setActiveClass={setActiveClass}
            setClass={setClass}
            activeClass={activeClass}
            area={area}
            selectedAreaRef={selectedAreaRef}
            setActiveArea={setActiveArea}
            setArea={setArea}
            activeArea={activeArea}
            year={year}
            selectedYearRef={selectedYearRef}
            setActiveYear={setActiveYear}
            setYear={setYear}
            activeYear={activeYear}
          />
        </div>
        {/* )} */}
      </div>
      <div ref={filterTagRef} className="sticky top-0"></div>
    </>
  );
};

export default FilterTag;
