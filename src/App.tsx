import React, { startTransition, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import FooterNav from "./components/FooterNav";
import { useDispatch, useSelector } from "react-redux";
import LoginEmail from "./components/login/LoginEmail";

import {
  setAuthModel,
  setLoginOpen,
  setPanding,
  setSignupOpen,
} from "./features/login/ModelSlice";
import Login from "./pages/login";
import SignUp from "./components/login/SignUp";
import Favorite from "./pages/profile/Favorite";
import Loader from "./pages/search/components/Loader";
import ErrorToast from "./pages/profile/error/ErrorToast";
import Landing from "./components/Landing";
import BannerAds from "./components/BannerAds";
import {
  useGetAdsQuery,
  useGetHeaderTopicsQuery,
} from "./services/helperService";
import { setIsScrolling } from "./pages/home/slice/HomeSlice";
import Social from "./pages/social";
import Short from "./pages/short";
// import { initializeThemeListener } from "./pages/search/slice/ThemeSlice";
import { useGetRecommendedMoviesQuery } from "./pages/home/services/homeApi";
import land2 from "./assets/login/land2.png";
import Announce from "./components/Announce";
import UpdateNotification from "./components/UpdateNotification";

// import Menber from "./pages/share/member";
// import Share from "./pages/share";

// Lazy load the pages
const Home = React.lazy(() => import("./pages/home"));
const Search = React.lazy(() => import("./pages/search"));
const Main = React.lazy(() => import("./pages/search/Main"));
const Explorer = React.lazy(() => import("./pages/explorer"));
const Profile = React.lazy(() => import("./pages/profile"));
const Player = React.lazy(() => import("./pages/player"));
const Detail = React.lazy(() => import("./pages/explorer/Detail"));
const History = React.lazy(() => import("./pages/profile/History"));
const Settings = React.lazy(() => import("./pages/profile/Settings"));
const Callback = React.lazy(() => import("./pages/callback"));
const Notifications = React.lazy(() => import("./pages/profile/Notifications"));
const Info = React.lazy(() => import("./pages/profile/Info"));
const Nickname = React.lazy(() => import("./pages/profile/Nickname"));
const Username = React.lazy(() => import("./pages/profile/Username"));
const Email = React.lazy(() => import("./pages/profile/Email"));
const Phnumber = React.lazy(() => import("./pages/profile/Phnumber"));
const Password = React.lazy(() => import("./pages/profile/Password"));
const Bind = React.lazy(() => import("./pages/profile/Bind"));
const Contact = React.lazy(() => import("./pages/profile/Contact"));
const Invite = React.lazy(() => import("./pages/profile/Invite"));
const Share = React.lazy(() => import("./pages/share"));
const Member = React.lazy(() => import("./pages/share/member"));

// ProtectedRoute component to handle route guarding
// const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const isLoggedIn = localStorage.getItem("authToken"); // Check if the user is authenticated
//   return isLoggedIn ? children : <Navigate to="/login" replace />;
// };

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {
    openAuthModel,
    openLoginModel,
    openSignupModel,
    panding,
    isShowingDetails,
  } = useSelector((state: any) => state.model);
  const { data, refetchAds } = useGetAdsQuery();
  const { refetch } = useGetRecommendedMoviesQuery();
  const [showNotice, setShowNotice] = useState(false);
  const { data: headerData } = useGetHeaderTopicsQuery();

  const [preloadedImage, setPreloadedImage] = useState<string | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Preload landing image
  useEffect(() => {
    if (data?.data) {
      const startAds = data?.data["start"];
      if (startAds && startAds.length > 0 && startAds[0]?.data?.image) {
        // Immediately start fetching the image as a blob
        fetch(startAds[0]?.data?.image)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.blob();
          })
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setPreloadedImage(url);

            // Also preload the image in browser cache
            const img = new Image();
            img.src = url;
          })
          .catch((err) => {
            console.error("Failed to preload image:", err);
            // Continue without preloaded image
          });
      }
    }

    // Clean up any blob URLs when component unmounts
    return () => {
      if (preloadedImage) {
        URL.revokeObjectURL(preloadedImage);
      }
    };
  }, [data]);
  // console.log(isShowingDetails)

  const sendNativeEvent = (message: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
    }
  };

  useEffect(() => {
    sendNativeEvent("hctsh5");
  }, []);

  useEffect(() => {
    if (!panding) {
      const hasSeenUpdateNotification = sessionStorage.getItem("hasSeenUpdateNotification");
      if (!hasSeenUpdateNotification) {
        setShowUpdateNotification(true);
      }
    }
  }, [panding]);

  useEffect(() => {
    if (panding) {
      sendNativeEvent("hctsh5_ads_started");
    } else {
      sendNativeEvent("hctsh5_home_started");
    }
  }, [panding]);

  // useEffect(() => {
  //   // Initialize the theme listener
  //   const cleanup = initializeThemeListener(dispatch);

  //   // Cleanup on component unmount
  //   return cleanup;
  // }, [dispatch]);

  const location = useLocation();
  // const isLoggedIn = localStorage.getItem("authToken"); // Check if the user is authenticated

  // Hide header and footer when the current path is "/player/:id" or "/login"
  const hideHeaderFooter =
    location.pathname.startsWith("/player") ||
    location.pathname.startsWith("/history") ||
    location.pathname.startsWith("/favorites") ||
    location.pathname.startsWith("/notifications") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/search_overlay") ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/social") ||
    location.pathname.startsWith("/short") ||
    location.pathname.startsWith("/social_callback") ||
    location.pathname.startsWith("/info") ||
    location.pathname.startsWith("/nickname") ||
    location.pathname.startsWith("/username") ||
    location.pathname.startsWith("/update_email") ||
    location.pathname.startsWith("/update_phone") ||
    location.pathname.startsWith("/update_password") ||
    location.pathname.startsWith("/bind") ||
    location.pathname.startsWith("/contact") ||
    location.pathname.startsWith("/share") ||
    location.pathname.startsWith("/invite") ||
    location.pathname.startsWith("/share/member");

  const hideHeader = location.pathname.startsWith("/explorer");

  const sendMessageToNative = (message: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
    }
  };

  useEffect(() => {
    if (data?.data) {
      if (
        (location.pathname === "/" ||
          location.pathname.startsWith("/search") ||
          location.pathname.startsWith("/search_overlay")) &&
        !panding
      ) {
        sendMessageToNative("showHomeScreen");
      } else if (location.pathname.startsWith("/profile") && !panding) {
        sendMessageToNative("showProfileScreen");
      } else if (
        location.pathname !== "/" &&
        !location.pathname.startsWith("/profile") &&
        !panding
      ) {
        sendMessageToNative("hideGradient");
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      const lastFetchTime = sessionStorage.getItem('lastRefetchTime');
      const now = Date.now();
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      // If no previous fetch time or 2 hours have passed, refetch
      if (!lastFetchTime || (now - parseInt(lastFetchTime)) > twoHours) {
        refetchAds();
        refetch();
        sessionStorage.setItem('lastRefetchTime', now.toString());
      }
    }
  }, [location.pathname, refetchAds, refetch]);

  const { hideMode } = JSON.parse(
    localStorage.getItem("movieAppSettings") || "{}"
  );

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");
    if (!hasSeenLanding) {
      sessionStorage.setItem("hasSeenLanding", "true"); // Mark as shown
      dispatch(setPanding(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (openAuthModel || openLoginModel || openSignupModel) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Restore scrolling
    }
  }, [openAuthModel, openLoginModel, openSignupModel]);
  // console.log(panding);

  // useEffect(() => {
  //   // Redirect to login if not logged in and trying to access any route other than login
  //   if (!isLoggedIn && location.pathname !== "/login") {
  //     window.location.href = "/login";
  //   }
  // }, [isLoggedIn, location.pathname]);

  const handleBack = () => {
    startTransition(() => {
      dispatch(setAuthModel(true));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  const closeAllModals = () => {
    startTransition(() => {
      dispatch(setAuthModel(false));
      dispatch(setLoginOpen(false));
      dispatch(setSignupOpen(false));
    });
  };

  useEffect(() => {
    const hasSeenNotice = sessionStorage.getItem("hasSeenNotice");
    if (!hasSeenNotice) {
      setShowNotice(true);
      sessionStorage.setItem("hasSeenNotice", "true");
    }
  }, []);

  if (!data?.data) {
    return (
      <img className="h-screen w-screen object-cover" src={land2} alt="" />
    );
  }

  const handleUpdateClick = () => {
    const link = headerData?.data?.app_store_link;
    // Handle update action here
    window.open(link, '_blank');
    // Or any other update logic
    setShowUpdateNotification(false);
    sessionStorage.setItem("hasSeenUpdateNotification", "true");
  };

  const handleCloseUpdateNotification = () => {
    setShowUpdateNotification(false);
    sessionStorage.setItem("hasSeenUpdateNotification", "true");
  };

  function isWebView() {
    return (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    );
  }

  return (
    <>
      {data?.data && (
        <>
          {panding ? (
            <Landing data={data} preloadedImage={preloadedImage} />
          ) : (
            <></>
          )}
          <div
            className={`flex  flex-col min-h-screen ${
              panding ? "invisible" : "visible"
            }`}
          >
            {/* <BannerAds /> */}
            {/* Conditionally render Header */}
            {!hideHeaderFooter && !hideHeader && <Header />}
            <div className="flex-grow">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen bg-[#fff] dark:bg-black">
                    <Loader />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/search" element={<Main />} />
                  <Route path="/search_overlay" element={<Search />} />

                  <Route path="/explorer" element={<Explorer />} />
                  {/* Conditional rendering of the Social component */}
                  {!hideMode && location.pathname === "/social" ? (
                    <Route path="/social" element={<Social />} />
                  ) : (
                    <Route path="/social" element={<div />} />
                  )}
                  <Route path="/short" element={<Short />} />
                  <Route path="/explorer/:id" element={<Detail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/player/:id" element={<Player />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/favorites" element={<Favorite />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/nickname" element={<Nickname />} />
                  <Route path="/username" element={<Username />} />
                  <Route path="/social_callback" element={<Callback />} />
                  <Route path="/update_email" element={<Email />} />
                  <Route path="/update_phone" element={<Phnumber />} />
                  <Route path="/update_password" element={<Password />} />
                  <Route path="/bind" element={<Bind />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/share" element={<Share />} />
                  <Route path="/invite" element={<Invite />} />
                  <Route path="/share/member" element={<Member />} />
                </Routes>
              </Suspense>
              <ErrorToast />
            </div>

            {/* Conditionally render FooterNav */}
            {!hideHeaderFooter && <FooterNav />}
            {showNotice && (
              <Announce
                setShowNotice={setShowNotice}
                config={headerData}
                showNotice={showNotice}
              />
            )}
            {showUpdateNotification && !showNotice && !isWebView() && headerData?.data?.app_store_link && (
                <div className="fixed bottom-20 left-0 right-0 z-[9999] flex justify-center">
                  <UpdateNotification 
                    onUpdate={handleUpdateClick} 
                    onClose={handleCloseUpdateNotification}
                  />
                </div>
              )}
            {location.pathname.startsWith("/profile") && <FooterNav />}
            {/* {location.pathname.startsWith("/social") && <FooterNav />} */}
            {location.pathname.startsWith("/social") && !isShowingDetails && (
              <FooterNav />
            )}
            {location.pathname.startsWith("/short") && <FooterNav />}

            {(openAuthModel || openLoginModel || openSignupModel) && (
              <div
                className="fixed inset-0 bg-black/40 opacity-50 z-[99899] h-screen" // Overlay with 50% opacity
                onClick={closeAllModals} // Close all modals on click
              ></div>
            )}
            {/* <div className=" fixed h-screen flex flex-col justify-center items-center"> */}
            {openAuthModel && <LoginEmail handleBack={handleBack} />}
            {/* {openLoginModel && <LoginEmail handleBack={handleBack} />} */}
            {openSignupModel && <SignUp handleBack={handleBack} />}
            {/* </div> */}
          </div>
        </>
      )}
    </>
  );
};

// Wrap the App component with Router for useLocation to work
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
