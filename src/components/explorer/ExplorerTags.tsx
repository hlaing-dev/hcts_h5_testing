import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../../src/pages/search/slice/ThemeSlice";

const ExplorerTags = ({
  configData,
  dispatch,
  setSort,
  setSortName,
  sort,
  filteredTags,
  classData,
  selectedClassRef,
  setActiveClass,
  setClass,
  activeClass,
  area,
  selectedAreaRef,
  setActiveArea,
  setArea,
  activeArea,
  year,
  selectedYearRef,
  setActiveYear,
  setYear,
  activeYear,
}: any) => {
  const darkmode = useSelector(selectTheme);

  return (
    <>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {configData?.data?.movie_search_screen?.sort?.map(
          (item: any, index: any) => (
            <div className="relative" key={index}>
              <p
                onClick={() => {
                  dispatch(setSort(item?.value));
                  dispatch(setSortName(item?.name));
                }}
                              className={`${
                  sort === item?.value
                    ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                    : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                } whitespace-nowrap py-1 rounded-full transition-colors`}
              >
                {item?.name}
              </p>
            </div>
          )
        )}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.class &&
            data?.class?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={classData === item ? selectedClassRef : null}
              >
                <p
                  onClick={() => {
                    setActiveClass(index);
                    dispatch(setClass(item));
                  }}
                                   className={`${
                    classData
                      ? classData === item
                        ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                        : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                      : activeClass === index
                      ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                      : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                  } whitespace-nowrap py-1 rounded-full transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.area &&
            data?.area?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={area === item ? selectedAreaRef : null}
              >
                <p
                  onClick={() => {
                    setActiveArea(index);
                    dispatch(setArea(item));
                  }}
                                    className={`${
                    area
                      ? area === item
                        ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                        : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                      : activeArea === index
                      ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                      : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                  } whitespace-nowrap py-1 rounded-full transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
      <div className="flex overflow-x-scroll px-3 gap-5 remove-scrollbar items-center">
        {filteredTags?.map(
          (data: any) =>
            data?.year &&
            data?.year?.map((item: any, index: any) => (
              <div
                className="relative"
                key={item}
                ref={year === item ? selectedYearRef : null}
              >
                <p
                  onClick={() => {
                    setActiveYear(index);
                    dispatch(setYear(item));
                  }}
 className={`${
                    year
                      ? year === item
                        ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                        : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                      : activeYear === index
                      ? `${darkmode ? 'tab-bg' : 'tab-bg-light'} text-white px-4 py-1 text-[14px]`
                      : "bg-[#00000014] px-4 dark:px-0 py-1 text-[14px] text-[#000] dark:text-white"
                  } whitespace-nowrap py-1 rounded-full transition-colors`}
                >
                  {item}
                </p>
              </div>
            ))
        )}
      </div>
    </>
  );
};

export default ExplorerTags;
