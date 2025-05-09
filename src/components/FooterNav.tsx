import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import SVG files directly
import homeIcon from "../assets/home1.png";
import homeSelectedIcon from "../assets/homeSelected1.png";
import explorerIcon from "../assets/explorer1.png";
import explorerSelectedIcon from "../assets/explorerSelected1.png";
import socialIcon from "../assets/SocialFooter.svg";
import socialSelectedIcon from "../assets/socialSelected1.png";
import profileIcon from "../assets/ProfileFooter.svg";
import profileSelectedIcon from "../assets/profileSelected1.png";
import beforePostIcon from "../assets/beforepost.png";
import afterPostIcon from "../assets/afterpost.png";
import beforeShortIcon from "../assets/beforeshort.png";
import afterShortIcon from "../assets/aftershort.png";

const Footer: FC = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Hook to get the current URL
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State to track header visibility
  useEffect(() => {
    // Update the selected menu based on the current location path
    if (location.pathname === "/" || location.pathname === "/home") {
      setSelectedMenu("home");
    } else if (location.pathname === "/explorer") {
      setSelectedMenu("explorer");
    } else if (location.pathname === "/profile") {
      setSelectedMenu("profile");
    } else if (location.pathname === "/social") {
      setSelectedMenu("social");
    } else if (location.pathname === "/short") {
      setSelectedMenu("short");
    }
  }, [location.pathname]);
  // Scroll event listener to detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/social") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down, hide the header
          setIsHeaderVisible(false);
        } else if (window.scrollY < lastScrollY) {
          // Scrolling up, show the header
          setIsHeaderVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  const { hideMode } = JSON.parse(
    localStorage.getItem("movieAppSettings") || "{}"
  );
  const isWebClip = (): boolean => {
    return (
      "standalone" in window.navigator && window.navigator.standalone === true
    );
  };
  return (
    <footer
      // className={`bg-[#1f1f21] fixed  transition-all duration-300 w-full shadow-lg z-50 ${
      //   isHeaderVisible ? "bottom-0" : "-bottom-[135px]"
      // }`}
      className={`bg-[#fff] dark:bg-[#1D1D1D] fixed  transition-all duration-300 w-full shadow-lg z-[200] bottom-0`}
    >
      <div className={`flex pt-4 justify-around items-center py-2  ${isWebClip() && 'mb-5'}`}>
        {/* Home Icon */}
        <Link
          to="/"
          className="flex flex-col items-center"
          onClick={() => setSelectedMenu("home")}
        >
          <div className="rounded-full">
            <img
              src={selectedMenu === "home" ? homeSelectedIcon : homeIcon}
              alt="Home"
              className="h-8 w-8" // Adjust size as needed
            />
          </div>
          <span
            className={`${
              selectedMenu === "home"
                ? "text-black dark:text-white"
                : "text-[#000000CC] dark:text-[#FFFFFFCC]"
            } text-[10px]`}
          >
            {t("footer.home")}
          </span>
        </Link>

        {/* Explorer Icon */}
        <Link
          to="/explorer"
          className="flex flex-col items-center"
          onClick={() => setSelectedMenu("explorer")}
        >
          <div className="rounded-full">
            <img
              src={
                selectedMenu === "explorer"
                  ? explorerSelectedIcon
                  : explorerIcon
              }
              alt="Explorer"
              className="h-8 w-8"
            />
          </div>
          <span
            className={`${
              selectedMenu === "explorer"
                ? "text-black dark:text-white"
                : "text-[#000000CC] dark:text-[#FFFFFFCC]"
            } text-[10px]`}
          >
            {t("footer.explorer")}
          </span>
        </Link>
        {!hideMode && (
          <Link
            to="/social"
            className="flex flex-col items-center"
            onClick={() => setSelectedMenu("social")}
          >
            <div className="rounded-full">
              <img
                src={
                  selectedMenu === "social" ? socialSelectedIcon : socialIcon
                }
                alt="social"
                className="h-8 w-8"
              />
            </div>
            <span
              className={`${
                selectedMenu === "social"
                  ? "text-black dark:text-white"
                  : "text-[#000000CC] dark:text-[#FFFFFFCC]"
              } text-[10px]`}
            >
              {t("广场")}
            </span>
          </Link>
        )}

        {/* Explorer Icon */}
        {/* <Link
          to="/social"
          className="flex flex-col items-center"
          onClick={() => setSelectedMenu("social")}
        >
          <div className="rounded-full">
            <img
              src={selectedMenu === "social" ? afterPostIcon : beforePostIcon}
              alt="Social"
              className="h-8 w-[48px] mb-2 -mt-[10px] "
            />
          </div>
          <span
            className={`${
              selectedMenu === "social" ? "text-black dark:text-white" : "text-[#000000CC] dark:text-[#FFFFFFCC]"
            } text-[10px]`}
          >
            广场
          </span>
        </Link> */}

        {/* Explorer Icon */}
        {/* <Link
          to="/short"
          className="flex flex-col items-center"
          onClick={() => setSelectedMenu("short")}
        >
          <div className="rounded-full">
            <img
              src={selectedMenu === "short" ? afterShortIcon : beforeShortIcon}
              alt="Short"
              className="h-6"
            />
          </div>
          <span
            className={`${
              selectedMenu === "short" ? "text-black dark:text-white" : "text-[#000000CC] dark:text-[#FFFFFFCC]"
            } text-[10px] mt-[6px]`}
          >
            短剧
          </span>
        </Link> */}

        {/* Profile Icon */}
        <Link
          to="/profile"
          className="flex flex-col items-center"
          onClick={() => setSelectedMenu("profile")}
        >
          <div className="rounded-full">
            <img
              src={
                selectedMenu === "profile" ? profileSelectedIcon : profileIcon
              }
              alt="Profile"
              className="h-8 w-8"
            />
          </div>
          <span
            className={`${
              selectedMenu === "profile"
                ? "text-black dark:text-white"
                : "text-[#000000CC] dark:text-[#FFFFFFCC]"
            } text-[10px]`}
          >
            {t("footer.profile")}
          </span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
