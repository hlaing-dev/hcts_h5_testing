// import { useState, useEffect } from "react";

// const SettingFirst = ({ darkmode }: any) => {
//   // Retrieve initial settings from localStorage or set defaults
//   const initialSettings = JSON.parse(
//     localStorage.getItem("movieAppSettings") || "{}"
//   );

//   const [filterToggle, setFilterToggle] = useState(
//     initialSettings.filterToggle || false
//   ); // Teen Mode
//   const [pipMode, setPipMode] = useState(initialSettings.pipMode || false); // Picture-in-Picture Mode
//   const [vibrantMode, setVibrantMode] = useState(
//     initialSettings.vibrantMode || false
//   ); // Vibrant Mode

//   // Save the settings to localStorage whenever they change
//   useEffect(() => {
//     const settings = {
//       filterToggle,
//       pipMode,
//       vibrantMode,
//     };
//     localStorage.setItem("movieAppSettings", JSON.stringify(settings));
//   }, [filterToggle, pipMode, vibrantMode]);

//   const handleFilter = () => {
//     setFilterToggle((prev: any) => !prev);
//     localStorage.removeItem("headerTopics");
//   };

//   return (
//     <div className="profile-div">
// <div
//   className={` w-full ${
//     darkmode ? "profile-div-main_dark" : "profile-div-main"
//   }`}
// >
// {/* Teen Mode */}
// <div className="p-first">
//   <div className="flex gap-1 max-w-[230px] flex-col ">
//     <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
//       青少年模式
//     </h1>
//     <p className={`settings-text ${darkmode ? "text-white" : "text-black"}`}>开启后不再展示R18内容 </p>
//   </div>
//   <div>
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input
//         type="checkbox"
//         checked={filterToggle}
//         onChange={handleFilter}
//         className="sr-only peer"
//       />
//       <div
//         className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
//           filterToggle
//             ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
//             : "peer-checked:bg-[#606060]"
//         }`}
//       ></div>
//     </label>
//   </div>
// </div>

//         {/* Picture-in-Picture Mode */}
//         <div className="p-first">
//           <div className="flex gap-1 max-w-[230px] flex-col ">
//             <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
//               自动画中画
//             </h1>
//             <p className={`settings-text ${darkmode ? "text-white" : "text-black"}`}>开启后打开自动画中画模式</p>
//           </div>
//           <div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={pipMode}
//                 onChange={() => setPipMode((prev: any) => !prev)}
//                 className="sr-only peer"
//               />
//               <div
//                 className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
//                   pipMode
//                     ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
//                     : "peer-checked:bg-[#606060]"
//                 }`}
//               ></div>
//             </label>
//           </div>
//         </div>

//         {/* Vibrant Mode */}
//         <div className="p-first">
//           <div className="flex gap-1 max-w-[230px] flex-col ">
//             <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
//               无痕模式
//             </h1>
//             <p className={`settings-text ${darkmode ? "text-white" : "text-black"}`}>开启后您的浏览不会被记录</p>
//           </div>
//           <div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={vibrantMode}
//                 onChange={() => setVibrantMode((prev: any) => !prev)}
//                 className="sr-only peer"
//               />
//               <div
//                 className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
//                   vibrantMode
//                     ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
//                     : "peer-checked:bg-[#606060]"
//                 }`}
//               ></div>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingFirst;

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "../../../../pages/search/slice/ThemeSlice";

const SettingFirst = ({ darkmode }: any) => {
  // Retrieve initial settings from localStorage or set defaults
  const initialSettings = JSON.parse(
    localStorage.getItem("movieAppSettings") || "{}"
  );

  const [filterToggle, setFilterToggle] = useState(
    initialSettings.filterToggle || false
  ); // Teen Mode
  const [pipMode, setPipMode] = useState(initialSettings.pipMode || false); // Picture-in-Picture Mode
  const [autoMode, setAutoMode] = useState(initialSettings.autoMode || false); // Picture-in-Picture Mode
  const [hideMode, setHideMode] = useState(initialSettings.hideMode || false); // Picture-in-Picture Mode
  const [themeMode, setThemeMode] = useState(
    initialSettings.themeMode || false
  ); // Picture-in-Picture Mode
  // const [vibrantMode, setVibrantMode] = useState(
  //   initialSettings.vibrantMode || false
  // ); // Vibrant Mode
  const dispatch = useDispatch();
  // Save the settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      filterToggle,
      pipMode,
      hideMode,
      autoMode,
      themeMode,
      // vibrantMode,
    };
    localStorage.setItem("movieAppSettings", JSON.stringify(settings));
  }, [filterToggle, pipMode, autoMode, hideMode, themeMode]);

  const handleFilter = () => {
    setFilterToggle((prev: any) => !prev);
    localStorage.removeItem("headerTopics");
  };

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      sendEventToNative('dark');
    } else {
      root.classList.remove('dark');
      sendEventToNative('light');
    }
  };

  useEffect(()=>{
    applyTheme(themeMode);
  },[themeMode]);

  const sendEventToNative = async (theme: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      // Send the initial playUrl event
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "themeMode",
        value: theme,
      });
    }
  }
  
  return (
    <div className="profile-div">
      <div
        className={` w-full ${
          darkmode ? "profile-div-main_dark" : "profile-div-main"
        }`}
      >
        {/* Teen Mode */}
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
              青少年模式
            </h1>
            <p
              className={`settings-text ${
                darkmode ? "text-white" : "text-black"
              }`}
            >
              开启后不再展示R18内容{" "}
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filterToggle}
                onChange={handleFilter}
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
          </div>
        </div>

        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
              隐藏广场功能
            </h1>
            <p
              className={`settings-text ${
                darkmode ? "text-white" : "text-black"
              }`}
            >
              开启后不再展示广场内容{" "}
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hideMode}
                onChange={() => setHideMode((prev: any) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  hideMode
                    ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>

        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
              广场自动播放
            </h1>
            <p
              className={`settings-text ${
                darkmode ? "text-white" : "text-black"
              }`}
            >
              开启后广场视频将会自动播放{" "}
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoMode}
                onChange={() => setAutoMode((prev: any) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  autoMode
                    ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>

        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
              自动画中画
            </h1>
            <p
              className={`settings-text ${
                darkmode ? "text-white" : "text-black"
              }`}
            >
              开启后打开自动画中画模式{" "}
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pipMode}
                onChange={() => setPipMode((prev: any) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  pipMode
                    ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1 className={`${darkmode ? " text-white" : "text-black"}`}>
            深色主题 
            </h1>
            <p
              className={`settings-text ${
                darkmode ? "text-white" : "text-black"
              }`}
            >
              深色调色板提供舒适的观看体验{" "}
            </p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={themeMode}
                onChange={() => {
                  setThemeMode((prev: boolean) => {
                    const newMode = !prev;
                    dispatch(setTheme(newMode));
                    return newMode;
                  });
                }}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  themeMode
                    ? "peer-checked:bg-[#fe58b5] hover:peer-checked:bg-[#fe58b5]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div>

        {/* Vibrant Mode
        <div className="p-first">
          <div className="flex gap-1 max-w-[230px] flex-col ">
            <h1>无痕模式</h1>
            <p className="settings-text">开启后您的浏览不会被记录</p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibrantMode}
                onChange={() => setVibrantMode((prev: any) => !prev)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 bg-[#606060] hover:bg-[#606060] peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  vibrantMode
                    ? "peer-checked:bg-[#F54100] hover:peer-checked:bg-[#F54100]"
                    : "peer-checked:bg-[#606060]"
                }`}
              ></div>
            </label>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SettingFirst;
