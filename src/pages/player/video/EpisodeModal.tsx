import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Episode, ModalComponentProps } from "../../../model/videoModel";
import Loader from "../../search/components/Loader";

const ModalComponent: React.FC<ModalComponentProps> = ({
  onClose,
  source,
  episodes,
  onEpisodeSelect,
  changeSource,
  playFrom,
  defaultEpisodeId,
  selectedSource,
  setSelectedSource,
}) => {
  const [activeTab, setActiveTab] = useState<"episodes" | "sources">(
    source || "episodes"
  );
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    defaultEpisodeId
  );
  const [episodeRange, setEpisodeRange] = useState<[number, number]>([0, 50]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [lowerDivHeight, setLowerDivHeight] = useState(0);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  const sourceScrollRef = useRef<HTMLDivElement>(null);
  const episodeGridRef = useRef<HTMLDivElement>(null);
  const selectedSourceRef = useRef<HTMLDivElement>(null);
  const selectedEpisodeRef = useRef<HTMLButtonElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Combine all episodes from the playFrom list
    // const allEpisodes = playFrom.flatMap((source) => source.list);
    setFilteredEpisodes(episodes);
    
    // Set loading to false when episodes are loaded
    if (episodes && episodes.length > 0) {
      setIsLoadingEpisodes(false);
    }
    
    // Initialize the episode range based on the default episode if available
    if (defaultEpisodeId && episodes.length > 0) {
      const episodeIndex = episodes.findIndex(
        (episode) => episode.episode_id === defaultEpisodeId
      );
      
      if (episodeIndex !== -1) {
        const tabIndex = Math.floor(episodeIndex / 50);
        const start = tabIndex * 50;
        const end = Math.min(start + 50, episodes.length);
        setEpisodeRange([start, end]);
      }
    }
  }, [episodes, defaultEpisodeId]);

  // Auto-select the correct tab based on the selected episode
  useEffect(() => {
    if (selectedEpisodeId && filteredEpisodes.length > 0) {
      // Find the index of the selected episode
      const episodeIndex = filteredEpisodes.findIndex(
        (episode) => episode.episode_id === selectedEpisodeId
      );
      
      if (episodeIndex !== -1) {
        // Calculate which tab this episode should be in
        const tabIndex = Math.floor(episodeIndex / 50);
        const start = tabIndex * 50;
        const end = Math.min(start + 50, filteredEpisodes.length);
        
        // Only update if we're not already in the correct range
        if (episodeRange[0] !== start || episodeRange[1] !== end) {
          setEpisodeRange([start, end]);
        }
      }
    }
  }, [selectedEpisodeId, filteredEpisodes]);

  // Handle episode selection and update the state
  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisodeId(episode.episode_id);
    onEpisodeSelect(episode);
  };

  // Handle tab switch
  const handleTabClick = (start: number, end: number) => {
    setEpisodeRange([start, end]);
  };

  // Sync default episode selection when the component mounts or when defaultEpisodeId changes
  useEffect(() => {
    setSelectedEpisodeId(defaultEpisodeId);
  }, [defaultEpisodeId]);

  // Auto-scroll to selected source (with delay to ensure proper rendering)
  useEffect(() => {
    const scrollToSource = () => {
      console.log('scrollToSource called, selectedSource:', selectedSource);
      console.log('selectedSourceRef.current:', selectedSourceRef.current);
      console.log('sourceScrollRef.current:', sourceScrollRef.current);
      
      if (selectedSourceRef.current && sourceScrollRef.current) {
        const sourceElement = selectedSourceRef.current;
        const containerElement = sourceScrollRef.current;
        
        // Check if element is actually rendered and visible
        if (sourceElement.offsetParent !== null) {
          
          // Try scrollIntoView as an alternative
          sourceElement.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'center'
          });
          
          // Original scroll calculation for comparison
          const sourceLeft = sourceElement.offsetLeft;
          const sourceWidth = sourceElement.offsetWidth;
          const containerScrollLeft = containerElement.scrollLeft;
          const containerWidth = containerElement.offsetWidth;
          if (sourceLeft < containerScrollLeft) {
            containerElement.scrollTo({
              left: sourceLeft - 20,
              behavior: 'auto'
            });
          } else if (sourceLeft + sourceWidth > containerScrollLeft + containerWidth) {
            containerElement.scrollTo({
              left: sourceLeft + sourceWidth - containerWidth + 20,
              behavior: 'auto'
            });
          }
        }
      }
    };

    // Add a small delay to ensure elements are properly rendered
    const timeoutId = setTimeout(scrollToSource, 50);
    
    return () => clearTimeout(timeoutId);
  }, [selectedSource]);

  // Auto-scroll to selected episode (with delay to avoid conflict)
  useEffect(() => {
    const scrollToEpisode = () => {
      if (selectedEpisodeRef.current && episodeGridRef.current) {
        const episodeElement = selectedEpisodeRef.current;
        const containerElement = episodeGridRef.current;
        
        // Check if element is actually rendered and visible
        if (episodeElement.offsetParent !== null) {
          episodeElement.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }
    };

    // Add a small delay to prevent conflict with source scroll
    const timeoutId = setTimeout(scrollToEpisode, 100);
    
    return () => clearTimeout(timeoutId);
  }, [selectedEpisodeId, episodeRange]);

  // Auto-scroll to active episode tab
  useEffect(() => {
    const scrollToActiveTab = () => {
      if (activeTabRef.current) {
        const tabElement = activeTabRef.current;
        const containerElement = tabElement.parentElement;
        
        if (containerElement && tabElement.offsetParent !== null) {
          tabElement.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    };

    // Add a small delay to ensure elements are rendered
    const timeoutId = setTimeout(scrollToActiveTab, 150);
    
    return () => clearTimeout(timeoutId);
  }, [episodeRange]);

  const customHeight = () => {
    const upperDiv = document.getElementById("upper-div");
    const upperDivHeight = upperDiv?.offsetHeight || 0;
    const remainingHeight = window.innerHeight - upperDivHeight;
    return remainingHeight;
  };

  useEffect(() => {
    const updateHeight = () => {
      setLowerDivHeight(customHeight());
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight); // Update height on window resize

    return () => {
      window.removeEventListener("resize", updateHeight); // Cleanup event listener
    };
  }, []);

  const modalRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  // Handle source selection with loading state
  const handleSourceChange = (source: any, index: number) => {
    setIsLoadingEpisodes(true);
    setSelectedSource(index);
    changeSource(source);
    const timeoutId = setTimeout(() => {
      setIsLoadingEpisodes(false);
    }, 1500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="bg-sourceBack dark:bg-[#161619] backdrop-blur-xl w-full max-w-md rounded-t-xl p-4"
        ref={modalRef}
        style={{ height: `${lowerDivHeight}px` }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide m-auto">
            <span className="text-black dark:text-white">播放与选集</span>
          </div>
          <button onClick={onClose} className="text-black dark:text-white">
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto scrollbar-hide">
          <div className="h-full flex flex-col">
            <div className="flex space-x-3 pb-2 overflow-x-auto scrollbar-hide" ref={sourceScrollRef}>
              {playFrom &&
                playFrom.map((source, index) => (
                  <div
                    key={index}
                    ref={index === selectedSource ? selectedSourceRef : null}
                    className={`relative flex flex-col justify-between p-3 rounded-lg cursor-pointer min-w-[200px] flex-shrink-0
                      ${index === selectedSource ? 'bg-episodeSelected dark:bg-[#FFFFFF0A]' : 'bg-source dark:bg-[#FFFFFF1A]'}`}
                    onClick={() => handleSourceChange(source, index)}
                  >
                    {index === selectedSource && (
                      <div className="absolute top-3 right-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" fill="#fe58b5"/>
                          <path d="M10.5 13.6032L16.0152 8.0874L16.8642 8.9358L10.5 15.3L6.68158 11.4816L7.52998 10.6332L10.5 13.6032Z" fill="white"/>
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="flex flex-col">
                        <h4 className="text-black dark:text-white mb-2 pr-6">{source.name}</h4>
                      </div>
                      {/* Display total videos if available */}
                      <div className="flex flex-row">
                        {source.total && (
                          <p className="bg-source dark:bg-[#FFFFFF1A] text-black dark:text-white text-[12px] px-3 py-1.5 rounded-md mr-2">{source.total} 个视频</p>
                        )}
                        {/* Display tips if available */}
                        <p className="bg-source dark:bg-[#FFFFFF1A] text-black dark:text-white text-[12px] px-3 py-1.5 rounded-md">
                          {source.tips || "No description available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide mb-4">
              {/* Episode Range Tabs */}
              {!isLoadingEpisodes && Array.from({ length: Math.ceil(filteredEpisodes.length / 50) }, (_, index) => {
                const start = index * 50;
                const end = Math.min(start + 50, filteredEpisodes.length);
                const isActive = episodeRange[0] === start;
                return (
                  <button
                    key={index}
                    ref={isActive ? activeTabRef : null}
                    className={`px-1 whitespace-nowrap py-2 text-sm`}
                    onClick={() => handleTabClick(start, end)}
                  >
                    <div className="mb-2 text-black dark:text-white">{start + 1}-{end}集</div>
                    {episodeRange[0] === start && <div className="w-full h-1 bg-mainColor rounded-md"></div>}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {isLoadingEpisodes ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] space-y-4">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2" ref={episodeGridRef}>
                  {filteredEpisodes
                    .slice(episodeRange[0], episodeRange[1])
                    .map((episode) => (
                      <button
                        key={episode.episode_id}
                        ref={episode.episode_id === selectedEpisodeId ? selectedEpisodeRef : null}
                        onClick={() => {handleEpisodeClick(episode);}}
                        className={`py-2 text-center rounded-lg ${
                          episode.episode_id !== selectedEpisodeId
                            ? "bg-source dark:bg-[#FFFFFF1A] text-black dark:text-white"
                            : "bg-episodeSelected dark:bg-[#FFFFFF0A] text-black dark:text-white"
                        }`}
                      >
                        <span className="px-6">{episode.episode_name.length > 5 ? `${episode.episode_name.substring(0, 8)}...` : episode.episode_name}</span>
                        {episode?.episode_id === selectedEpisodeId && (
                          <span className="transform -translate-x-1/2 loader ml-5 -mt-1.5">
                            <div></div>
                            <div></div>
                            <div></div>
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
