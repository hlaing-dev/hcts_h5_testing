import React, { useEffect, useState } from "react";
import Tab1 from "../../components/explorer/Tab1";
import Tab2 from "../../components/explorer/Tab2";
import Tab3 from "../../components/explorer/Tab3";
import Tab4 from "../../components/explorer/Tab4";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNav } from "./slice/ExploreSlice";
// import TopNav from "../../components/explorer/TopNav";
// import { useGetExploreListQuery } from "./services/explorerAPi";

const Explorer: React.FC = () => {
  const activeNav = useSelector((state: any) => state.explore.activeNav);
  const [activeTab, setActiveTab] = useState(!activeNav ? 0 : -1);

  const dispatch = useDispatch();

  const tabs = [
    { title: "片库", content: <Tab1 /> },
    { title: "追剧周表", content: <Tab2 /> },
    { title: "专题", content: <Tab3 /> },
    { title: "排行榜", content: <Tab4 /> },
  ];

  return (
    // bg-[#1f1f21]
    <div className="relative">
      <nav
        // className={`flex flex-wrap gap-4 items-center py-2 px-3  bg-background fixed transition-all duration-300 w-full z-50 ${
        //   isHeaderVisible ? "top-0" : "-top-[135px]"
        // }`}
        className={`flex flex-wrap gap-4 items-center py-2 px-3  bg-white dark:bg-[#161619] fixed transition-all duration-300 w-full z-50 top-0`}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            // className={`inline-flex whitespace-nowrap border-b-2 border-transparent font-medium  transition-all duration-200 ease-in-out hover:text-white ${
            //   activeNav === index
            //     ? "text-white text-[18px]"
            //     : "text-gray-600 text-[18px]"
            // } `}
            // transition-all duration-200 ease-in-out
            className={`inline-flex whitespace-nowrap border-b-2 border-transparent font-semibold  ${
              (activeNav && activeNav === index) || activeTab === index
                ? "text-[#080808CC] dark:text-white text-[24px]"
                : // : activeTab === index ? "text-white text-[24px]"
                  "text-[#0808087A] dark:text-[#FFFFFFCC] text-[18px]"
            }`}
            onClick={() => {
              setActiveTab(index);
              dispatch(setActiveNav(index));
            }}
          >
            {tab.title}
          </button>
        ))}
      </nav>
      <div className="bg-white dark:bg-[#161619]">
        <div className="text-black">
          {tabs[activeNav ? activeNav : activeTab]?.content}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
