import { Comment } from "../../../model/commentModel";

const DetailSection: React.FC<DetailSectionProps> = ({
  movieDetail,
  adsData,
  id,
  activeTab,
  setActiveTab,
  setCommentCount,
  commentCount,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(false);
  
  useEffect(() => {
    if (activeTab === "tab-1") {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 200);
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col w-full bg-background">
      <div className={`bg-background rounded-b-lg p-1 ${
        activeTab === "tab-1" && "p-4"
      }`}>
        {activeTab === "tab-1" && (
          // ... existing tab-1 content ...
        )}

        {activeTab === "tab-2" ? (
          <div id="tab-2" className="block">
            <CommentComponent
              movieId={id}
              lowerDivHeight={lowerDivHeight}
              setCommentCount={setCommentCount}
              commentCount={commentCount}
              comments={comments}
              setComments={setComments}
              hasMore={hasMore}
              setHasMore={setHasMore}
            />
          </div>
        ) : (
          <div className="mt-4">
            <NewAds section={"player_episode_up"} fromMovie={true} />
          </div>
        )}
      </div>
    </div>
  );
}; 