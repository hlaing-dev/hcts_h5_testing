import { useSpring, animated } from 'react-spring';
import { GiConversation } from "react-icons/gi"; // Import the paper plane icon

const ServerComponent = ({ server, index, handleEnterChat, handleDeleteServer }) => {
  const springProps = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
    delay: index * 100 // Add delay for staggered animation
  });

  return (
    <animated.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 w-full mt-3 relative"
      onClick={() => handleEnterChat(server.id, server)}
      style={springProps}
    >
      {server.isOwnerServer && (
        <button
          className="absolute top-5 right-2 bg-red-400 text-white rounded-full w-4 h-4 flex justify-center items-center"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the card
            handleDeleteServer(server.id);
          }}
        >
          <span className="text-xs">-</span>
        </button>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-sm font-semibold`}>
            <GiConversation className={`inline-block mr-3 size-6`} />
            {server.name}
          </h2>
        </div>
        <p className="text-sm text-gray-600">{server.description}</p>
      </div>
    </animated.div>
  );
};

export default ServerComponent;
