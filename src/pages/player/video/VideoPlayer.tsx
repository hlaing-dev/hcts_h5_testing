import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js"; // Import Hls.js
import floatingScreen from "../../../assets/floatingScreen.png";
import axios from "axios";
import { VideoPlayerProps } from "../../../model/videoModel";
import { useGetRecordQuery } from "../../profile/services/profileApi";
import { convertToSecurePayload } from "../../../services/newEncryption";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onBack,
  movieDetail,
  selectedEpisode,
  resumeTime,
  handleVideoError,
  autoPlayNextEpisode,
}) => {
  const playerRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLDivElement>(null);
  const [videoRatio, setVideoRatio] = useState(9 / 16); // Default to 16:9 ratio
  const { refetch } = useGetRecordQuery(); // Fetch favorite movies list from API
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const inactivityTimeout = useRef<number | null>(null);
  const [reHeight, setReHeight] = useState(false);
  // Function to get token from localStorage
  const getToken = () => {
    const isLoggedIn = localStorage.getItem("authToken");
    const parsedLoggedIn = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    return parsedLoggedIn?.data?.access_token;
  };

  // Function to report playback progress on specific events (back or episode change)
  const reportProgress = async (currentTime: number, duration: number) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/movie_play/report`,
        convertToSecurePayload({
          movie_id: movieDetail.id, // Assuming movie_id is movie name
          episode_id: selectedEpisode?.episode_id,
          movie_from: selectedEpisode?.from_code,
          duration: Math.floor(duration), // Report in seconds
          current_time: Math.floor(currentTime), // Report in seconds
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error reporting playback progress:", error);
    }
  };

  
  useEffect(() => {
    let hls: Hls | null = null;

    const initializePlayer = async () => {
      if (videoElementRef.current && videoUrl) {
        const art = new Artplayer({
          container: videoElementRef.current,
          url: videoUrl,
          autoplay: true,
          playbackRate: true,
          setting: true,
          // fullscreen: true,
          airplay: true,
          controls: [
            {
              position: "right",
              html: `<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 3H22V9H20V5H16V3H20ZM4 3H8V5H4V9H2V3H4ZM20 19V15H22V21H16V19H20ZM4 19H8V21H2V15H4V19Z" fill="white" fill-opacity="0.9"/>
</svg><div>`,
              tooltip: "Fullscreen",
              click: function (...args) {
                // playerRef.current.fullscreen = true;
                if (
                  (window as any).webkit &&
                  (window as any).webkit.messageHandlers &&
                  (window as any).webkit.messageHandlers.jsBridge
                ) {
                  (window as any).webkit.messageHandlers.jsBridge.postMessage({
                    eventName: "fullscreen",
                  });
                  playerRef.current.pause();
                } else {
                  playerRef.current.fullscreen = true;
                }
              },
            },
          ],
          // miniProgressBar: true,
          // moreVideoAttr: {
          //   playsInline: true,
          // },
        });

        // Use Hls.js for HLS streams
        // if (Hls.isSupported() && videoUrl.includes(".m3u8")) {
        //   hls = new Hls();
        //   hls.loadSource(videoUrl);
        //   hls.attachMedia(art.video);

        //   // Handle HLS errors
        //   hls.on(Hls.Events.ERROR, (_, data) => {
        //     if (data.fatal) {
        //       console.error("HLS error:", data);
        //       // handleVideoError(videoUrl);
        //     }
        //   });
        // } else {
        //   art.video.src = videoUrl; // For Safari and iOS
        // }

        art.video.src = videoUrl; // For Safari and iOS

        // Adjust video ratio based on the video's actual dimensions
        art.once("video:loadedmetadata", () => {
          const videoWidth = art.video.videoWidth;
          const videoHeight = art.video.videoHeight;
          if (videoWidth > videoHeight) {
            sendNativeEvent("landscape_view");
          } else if (videoHeight > videoWidth) {
            sendNativeEvent("potrait_view");
          } else {
            sendNativeEvent("square_view");
          }
          setVideoRatio(videoHeight / videoWidth); // Set the dynamic aspect ratio
          setReHeight(videoWidth < videoHeight);
        });
        art.on("error", (error, reconnectTime) => {
          handleVideoError(videoUrl);
        });
        const controls: any = document.querySelector(".art-controls-right");
        if (controls) {
          controls.style.display = "flex"; // Ensure display is flex
          controls.style.flexDirection = "row-reverse"; // Dynamically set direction
        }
        // Set resume time if available
        art.once("ready", () => {
          if (resumeTime > 0) {
            art.currentTime = resumeTime;
          }
          setTimeout(() => {
            if (playerRef.current) {
              const token = getToken();
              if (token) {
                reportProgress(
                  playerRef.current.currentTime,
                  playerRef.current.duration
                );
              }
            }
          }, 1000);
          setTimeout(() => {
            if (playerRef.current) {
              const token = getToken();
              if (token) {
                refetch();
              }
            }
          }, 3000);
        });
        art.on("control", (state) => {
          setIsControlsVisible(state);
        });
        art.on("video:ended", () => {
          autoPlayNextEpisode();
        });
        playerRef.current = art;
      }
    };

    initializePlayer();

    // Orientation change listener
    const handleOrientationChange = () => {
      if (playerRef && playerRef.current) {
        playerRef.current.fullscreen =
          window.innerWidth > window.innerHeight ? true : false;
      }
    };

    // Add the event listener for orientation change
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      // Clean up HLS and ArtPlayer
      if (hls) {
        hls.destroy(); // Stop HLS requests
        hls = null;
      }
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.video.src = ""; // Clear video source
        playerRef.current.destroy(); // Destroy ArtPlayer
        playerRef.current = null;
      }
    };
  }, [videoUrl, resumeTime]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && playerRef.current) {
        playerRef.current.pause();
      }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  // Define the event handler
  const sendNativeEvent = (message: string) => {
      if (
        (window as any).webkit &&
        (window as any).webkit.messageHandlers &&
        (window as any).webkit.messageHandlers.jsBridge
      ) {
        (window as any).webkit.messageHandlers.jsBridge.postMessage(
          message
        );
    }
  };

  const handleBack = async () => {
    if (playerRef.current) {
      // Report progress before navigating back
      reportProgress(playerRef.current.currentTime, playerRef.current.duration);
      playerRef.current.pause();
      playerRef.current.video.src = ""; // Stop video requests
      playerRef.current.destroy();
      playerRef.current = null;
      const token = getToken();
      if (token) {
        refetch();
      }
    }
    onBack();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (playerRef.current) {
        const token = getToken();
        if (token) {
          reportProgress(
            playerRef.current.currentTime,
            playerRef.current.duration
          );
          refetch();
        }
      }
    }, 15000); // 15 seconds interval

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handlePiP = () => {
    if (document.pictureInPictureEnabled && playerRef.current) {
      if (playerRef.current.video !== document.pictureInPictureElement) {
        playerRef.current.video.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    }
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const playerElement = videoElementRef.current;
  //     if (!playerElement) return;

  //     const rect = playerElement.getBoundingClientRect();
  //     console.log('rect top is=>', rect);
  //     // const isOutOfView = rect.top < 0;

  //     // Minimize player when scrolled out of view
  //     // setIsMinimized(isOutOfView);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div
      id="my-player"
      className={`relative w-full bg-white ${reHeight ? "h-[40vh]" : ""}`}
    >
      {/* Back button */}
      {isControlsVisible && (
        <>
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
            {/* Left Section - Back Button & Movie Name */}
            <button
              onClick={handleBack}
              className="text-white flex items-center flex-1 overflow-hidden gap-2 pr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.22198L13.192 5.63598L7.828 11Z"
                  fill="white"
                />
              </svg>
              <p className="cus-elips">
                {movieDetail?.name} {selectedEpisode?.episode_name}
              </p>
            </button>

            {/* Right Section - PiP Button */}
            <button className="text-white flex-shrink-0" onClick={handlePiP}>
              <img src={floatingScreen} alt="PiP" className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      {/* Video element wrapper */}
      <div
        className={`relative w-full ${reHeight ? "h-[40vh]" : ""}`}
        style={{ paddingTop: `${videoRatio * 100}%` }}
      >
        {/* Video element */}
        <div
          ref={videoElementRef}
          className={`absolute top-0 left-0 w-full ${
            reHeight ? "h-[40vh]" : "h-full"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
