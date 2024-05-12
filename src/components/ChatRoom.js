import React, { useState, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { FaPaperPlane } from 'react-icons/fa'; // Import the paper plane icon
import { FaBackward } from 'react-icons/fa'; // Import the paper plane icon

const ChatRoom = ({ server, user, onCancel, serverData = null }) => {
    console.log('serverData is=>', serverData);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const unsubscribe = server
      .collection("messages")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      });
    return () => unsubscribe();
  }, [server]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    try {
      setMessageText("");
      await server.collection("messages").add({
        sender: user.displayName,
        text: messageText,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCopyServerId = () => {
    navigator.clipboard.writeText(server.id).then(() => {
      alert("Server ID copied to clipboard!");
    });
  };

  return (
    <div className="container" style={{height: '100vh'}}>
      <div className="h-full">
      <div className="flex items-center justify-between mb-4 custom-chatroom-header mt-5">
      {/* <button
            onClick={onCancel}
            className="mt-2 w-full bg-gray-100 font-boldrounded-md transition duration-300 hover:bg-blue-100"
          >
            "
          </button> */}
          <FaBackward onClick={onCancel} className="inline-block mr-1" />
          <h2 className="text-blue-500">{serverData?.name}</h2>
          <button
            className="text-blue-500 hover:underline focus:outline-none"
            onClick={handleCopyServerId}
          >
            <FiCopy className="inline-block mr-1"/> Copy Server ID
          </button>
        </div>
        <div className="flex flex-col space-y-4 overflow-x-hidden overflow-y-scroll" style={{height: '55vh'}}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-center ${
                message.sender === user.displayName
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  message.sender === user.displayName
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">
                  {message.sender !== user.displayName && (
                    <span className="font-semibold">{message.sender}:</span>
                  )}{" "}
                  {message.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="mt-6 flex">
  <input
    type="text"
    placeholder="Type your message here"
    value={messageText}
    onChange={(e) => setMessageText(e.target.value)}
    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
  />
  <button
    type="submit"
    className="ml-2 bg-blue-500 w-16 text-white font-bold py-2 rounded-md transition duration-300 hover:bg-blue-600 flex items-center justify-center"
  >
    <FaPaperPlane className="mr-2" /> {/* Icon */}
    {/* You can add a title attribute to the icon for accessibility */}
    <span className="hidden sm:inline">Send</span> {/* Text */}
  </button>
</form>
        {/* <form onSubmit={sendMessage} className="mt-6">
          <input
            type="text"
            placeholder="Type your message here"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white font-bold py-2 rounded-md transition duration-300 hover:bg-blue-600"
          >
            Send
          </button>
          <button
            onClick={onCancel}
            className="mt-2 w-full bg-gray-100 font-bold py-2 rounded-md transition duration-300 hover:bg-blue-100"
          >
            Back
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default ChatRoom;
