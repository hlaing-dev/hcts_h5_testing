import React, { useCallback, useEffect, useRef, useState } from "react";
import share from "../../../assets/share.svg";
import share1 from "../../../assets/share1.svg";
import star from "../../../assets/star1.png";
import info from "../../../assets/info1.png";
import star1 from "../../../assets/star.png";
import info1 from "../../../assets/info.png";
import shareLink from "../../../assets/shareLink1.png";
import selectedStar from "../../../assets/selectedStar1.png";
import rate from "../../../assets/rate2.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icon from "../../../assets/logo2.svg";
import {
  faChevronRight,
  faTimes,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import CommentComponent from "./CommentSection";
import { useDispatch } from "react-redux";
import { setAuthModel } from "../../../features/login/ModelSlice";
import FeedbackComponent from "./Feedback";
import AdsSection from "./AdsSection";
import { DetailSectionProps } from "../../../model/videoModel";
import { useGetListQuery } from "../../../pages/profile/services/profileApi";
import NewAds from "../../../components/NewAds";
import Fire from "../../../assets/Fire.png";
import PlayerText from "../../../assets/playerText.svg";
import copy from "copy-to-clipboard";
import {
  convertToSecurePayload,
  convertToSecureUrl,
  decryptWithAes,
} from "../../../services/newEncryption";
import axios from "axios";
import { useGetAdsQuery } from "../../../services/helperService";
import episode from "../../../assets/episode.png";

const DetailSection: React.FC<DetailSectionProps> = ({
  movieDetail,
  adsData,
  id,
  activeTab,
  setActiveTab,
  setCommentCount,
  commentCount,
  setIsModalOpen,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [showModal, setShowModal] = useState(false); // For triggering modal
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(
    movieDetail && movieDetail.is_collect ? true : false
  );
  const { refetch } = useGetListQuery({ page: 1, type_id: 0 });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // For triggering modal
  const [visible, setVisible] = useState(false);

  const modalRef = useRef<any>(null);
  const { data } = useGetAdsQuery();

  const handleCopy = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 2000); // Hide after 2 seconds
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFeedbackModel = () => {
    setShowFeedbackModal(!showFeedbackModal);
  };
  const handleTabClick = async (tab: string) => {
    const loginResponse = await localStorage.getItem("authToken");
    const loginInfo = loginResponse ? JSON.parse(loginResponse || "") : null;

    if (loginInfo && loginInfo.data && loginInfo.data.access_token) {
      const authorization = `${loginInfo.data.token_type} ${loginInfo.data.access_token}`;
      if (tab === "star") {
        handleStarToggle(authorization);
      } else {
        handleFeedbackModel();
      }
    } else {
      dispatch(setAuthModel(true));
    }
  };

  const handleStarToggle = async (authorization: string) => {
    setIsLoading(true);
    try {
      // Toggle collection API call
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/movie/collect/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify(
            convertToSecurePayload({
              movie_id: id,
              state: isStarred ? 0 : 1,
            })
          ),
        }
      );
      if (response.ok) {
        refetch();
        setIsStarred(!isStarred);
      } else {
        alert("收藏操作失败，请稍后重试");
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      alert("收藏操作失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  function isWebView() {
    return (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (isWebView()) {
        sendEventToNative(text);
      }
      handleCopy();
      copy(text);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const sendEventToNative = (text: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "movieDetailShare",
        value: text,
      });
    }
  };

  const handleShare = async () => {
    setIsLoading(true);
    const cookieKey = "shareContent";

    try {
      // Check if the cookie exists
      const cachedContent = Cookies.get(cookieKey);
      if (cachedContent) {
        copyToClipboard(JSON.parse(cachedContent).data.content);
        sendShareEventToNative(JSON.parse(cachedContent).data.content);
        return;
      }

      // Call the API if no cached content is found
      const response = await axios.get(
        convertToSecureUrl(`${process.env.REACT_APP_API_URL}/user/get_share`),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.data;
      const result: any = await decryptWithAes(data);

      if (data && result) {
        // Save to cookie with a 2-hour expiry
        Cookies.set(cookieKey, JSON.stringify(result), { expires: 1 / 12 }); // 1/12 day = 2 hours
        sendShareEventToNative(result?.data.content);
        copyToClipboard(result?.data.content);
      }
    } catch (error) {
      console.error("Error fetching share content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendShareEventToNative = (value: any) => {
    // copyToClipboard("https://d1svxjht0opoc5.cloudfront.net/kkoor4.pdf");
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "socialMediaShare",
        value: value,
      });
    }
  };

  const sendShareDetailEventToNative = (value: any) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: "movieDetailShare",
        value: value,
      });
    }
  };

  const customHeight = () => {
    const upperDiv = document.getElementById("upper-div");
    const upperDivHeight = upperDiv?.offsetHeight || 0;
    const remainingHeight = window.innerHeight - upperDivHeight;
    return remainingHeight;
  };

  const lowerDivHeightRef = useRef(customHeight());

  // This won't trigger re-renders
  const updateHeight = useCallback(() => {
    const newHeight = customHeight();
    lowerDivHeightRef.current = newHeight;

    // Directly apply to modal if it's open
    if (modalRef.current && showModal) {
      modalRef.current.style.height = `${newHeight}px`;
    }
  }, [showModal]);

  useEffect(() => {
    // Initial height calculation
    updateHeight();

    // Throttled resize handler
    let ticking = false;
    const handleResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeight();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [updateHeight]);

  const handleDetailClick = () => {
    setShowModal(true);
    // Apply current height directly
    if (modalRef.current) {
      modalRef.current.style.height = `${lowerDivHeightRef.current}px`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div className="flex flex-col w-full dark:bg-[#161619] bg-white">
      {/* Tabs */}

      {/* Tab content */}
      <div
        className={`dark:bg-[#161619] bg-white rounded-b-lg p-1 ${
          activeTab === "tab-1" && "pt-2 px-4"
        }`}
      >
        {activeTab === "tab-1" && (
          <div id="tab-1" className="block">
            {/* Movie Title and Info */}
            <div className="movie-info mb-4 flex-auto overflow-x-scroll">
              <h2 className="text-[18px] font-semibold text-black dark:text-white">
                {movieDetail.name || "暂无标题"}
              </h2>
              <div className="info text-black/40 dark:text-[#FFFFFF66] text-sm flex justify-between items-start overflow-x-auto space-x-2 mt-2">
                {/* Left Section: Flames, year, area, and tags */}
                <div className="left-section flex items-center flex-wrap space-x-2 w-[80%] overflow-x-auto text-[14px]">
                  {/* <span className="rating flex items-center"> */}
                  <span className="flames">
                    {movieDetail?.popularity_score > 0 ? (
                      <>
                        {Array.of(movieDetail?.popularity_score)?.map(
                          (item) => (
                            <img src={rate} key={item} alt="" />
                          )
                        )}
                      </>
                    ) : (
                      <>
                        <img src={rate} key="0" alt="" />
                        {movieDetail?.hot}
                      </>
                    )}
                  </span>
                  {/* </span> */}
                  <span>{movieDetail.year}</span>
                  <span>/</span>
                  <span>{movieDetail.area}</span>
                  <span>/</span>
                  <span>{movieDetail.type_name}</span>
                  {movieDetail.tags && movieDetail.tags.length > 0 && (
                    <>
                      {movieDetail.tags.map((tag, index) => (
                        <React.Fragment key={index}>
                          <span>/</span>
                          <span>{tag.name || "暂无标签"}</span>
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>

                {/* Right Section: 简介 and Chevron Icon */}
                <div
                  className="right-section flex items-center"
                  onClick={handleDetailClick}
                >
                  <span className="font-semibold text-[14px]">简介</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-md ml-1"
                  />
                </div>
              </div>
            </div>

            {/* Warning Message */}
            {data?.data?.["player_episode_up"]?.length <= 0 && (
              <div
                className="warning rounded-md text-white text-center"
                onClick={() => handleShare()}
              >
                <div className="warning-content rounded-md mx-auto text-[17px] flex items-center">
                  <span className="warning-text text-white flex items-center">
                    <img src={PlayerText} alt="" className="mt-2" />
                    好事不独享，点击分享给好友一起体验！
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {visible && (
          <div
            className={`text-[12px] fixed w-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-3 px-5 flex items-center justify-center gap-1 rounded-full toast text-white text-center z-[9999999999999999999]`}
          >
            <img src={icon} className="w-6 h-6" alt="" />
            <span className=" text-[13px]">链接已复制 </span>
          </div>
        )}

        {activeTab === "tab-2" ? (
          <div id="tab-2" className="block">
            {/* Comment section or other content */}
            <CommentComponent
              movieId={id}
              lowerDivHeight={lowerDivHeightRef.current}
              setCommentCount={setCommentCount}
              commentCount={commentCount}
              // comments={comments}
              // setComments={setComments}
              hasMore={hasMore}
              setHasMore={setHasMore}
            />
          </div>
        ) : (
          <div className="mt-4">
            {/* {adsData && <AdsSection adsDataList={adsData?.player_episode_up} />} */}
            <NewAds section={"player_episode_up"} fromMovie={true} />
          </div>
        )}
      </div>

      {/* Modal for sharing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            ref={modalRef}
            className="dark:bg-[#161619] bg-white backdrop-blur-md w-full max-w-md bottom-0 rounded-lg p-6 text-black dark:text-white overflow-y-auto"
            style={{ height: `${lowerDivHeightRef.current}px` }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">简介</h2>
              <button onClick={handleCloseModal} className="text-gray-300">
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              {/* Movie Title and Information */}
              <h2 className="text-2xl font-bold mb-2">
                {movieDetail.name || ""}
              </h2>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="text-pink-300 flex items-center">
                  <img src={rate} alt="" />
                  {movieDetail.popularity_score || 0}
                </span>
                <span className="mx-2">|</span>
                <span>{movieDetail.type_name || "Unknown Type"}</span>
                <span className="mx-2">/</span>
                <span>{movieDetail.year || "Unknown Year"}</span>
                <span className="mx-2">/</span>
                <span>{movieDetail.area || "Unknown Area"}</span>
              </div>

              {/* Cast Section */}
              <h3 className="text-lg font-semibold mt-4">演员表</h3>
              <div className="text-gray-500 text-sm mt-2">
                <div className="flex space-x-4">
                  {/* Director */}
                  <span>
                    导演{" "}
                    <span className="text-black dark:text-white">
                      {movieDetail?.members?.find((member) => member.type === 3)
                        ?.name || "Unknown"}
                    </span>
                  </span>
                  {/* Screenwriter */}
                  <span>
                    编剧{" "}
                    <span className="text-black dark:text-white">
                      {movieDetail?.members?.find((member) => member.type === 2)
                        ?.name || "Unknown"}
                    </span>
                  </span>
                </div>
                {/* Actors */}
                <div className="mt-2">
                  <span>演员 </span>
                  {movieDetail?.members
                    ?.filter((member) => member.type === 1)
                    .map((actor, index) => (
                      <span key={index} className="text-black dark:text-white">
                        {actor.name || "Unknown"}
                        {index <
                        movieDetail.members.filter(
                          (member) => member.type === 1
                        ).length -
                          1
                          ? ", "
                          : ""}
                      </span>
                    )) || <span className="text-black dark:text-white">Unknown</span>}
                </div>
              </div>

              {/* Introduction Section */}
              <h3 className="text-lg font-semibold mt-6">简介</h3>
              <p className="text-gray-500 mt-2 leading-relaxed">
                {movieDetail.content || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}
      {showFeedbackModal && (
        <FeedbackComponent
          movieId={id}
          onActionComplete={handleTabClick}
          onClose={handleFeedbackModel}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          height={`${lowerDivHeightRef.current}px`}
        />
      )}

      {/* Sticky Bottom Action Bar */}
      {activeTab === "tab-1" && (
        <div
          className="fixed bottom-0 left-0 w-full z-50 bg-[#fff] dark:bg-[#1F1F21] flex justify-between items-center px-2 py-2 border-t border-gray-200 dark:border-gray-700"
          style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.2)" }}
        >
          <div className="flex flex-1 justify-evenly">
            {/* 选集 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex flex-col items-center px-2 py-1 rounded-md"
            >
                <img src={episode} alt="" className="h-5 mb-[5px] mt-0.5" />
              <span className="text-black/40 dark:text-white/40 text-[14px]">选集</span>
            </button>
            {/* 收藏 */}
            <button
              onClick={() => handleTabClick("star")}
              className="flex flex-col items-center px-2 py-1 rounded-md"
            >
              <img
                src={isStarred ? selectedStar : star}
                alt=""
                className="h-6 mb-1 block dark:hidden"
              />
              <img
                src={isStarred ? selectedStar : star1}
                alt=""
                className="h-6 mb-1 hidden dark:block"
              />
              <span className="text-black/40 dark:text-white/40 text-[13px]">收藏</span>
            </button>
            {/* 反馈/求片 */}
            <button
              onClick={() => handleTabClick("feedback")}
              className="flex flex-col items-center px-2 py-1 rounded-md"
            >
              <img src={info} alt="" className="h-6 mb-1 block dark:hidden" />
              <img
                src={info1}
                alt=""
                className="h-6 mb-1 hidden dark:block"
              />
              <span className="text-black/40 dark:text-white/40 text-[13px]">反馈/求片</span>
            </button>
          </div>
          {/* 分享好友得积分按钮 */}
          <button
          onClick={() => handleShare()}
          disabled={isLoading}
          className={`ml-2 flex items-center rounded-full px-5 py-2 relative min-w-[170px] justify-center ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          style={{
            background:
              "linear-gradient(271deg, rgba(254,228,179,0.06) 0%, rgba(255,217,147,0.06) 100%)",
            backgroundBlendMode: "normal",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="flex justify-start items-start flex-row gap-2.5 px-1.5 bg-[#FF6A33] rounded-tl-[10px] rounded-tr-sm rounded-br-[10px] rounded-bl-sm absolute right-[0px] top-[-7.5px]">
            <span className="text-[#FFFFFF] text-[10px] font-['PingFang_SC'] text-center font-medium">
              可兑换
            </span>
          </div>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#E6D3A7] border-t-transparent mr-2"></div>
              <span className="text-[#E6D3A7] text-[15px] font-normal">
              </span>
            </>
          ) : (
            <>
              <img src={share1} className="h-6 mr-1" alt="" />
              <span className="text-[#E6D3A7] text-[15px] font-normal">
                分享好友得积分
              </span>
            </>
          )}
        </button>
        </div>
      )}
    </div>
  );
};

export default DetailSection;
