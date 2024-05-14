import React, { useState, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa"; // Import the paper plane icon
import { FaAngleLeft } from "react-icons/fa"; // Import the paper plane icon
import CryptoJS from "crypto-js"; // Import CryptoJS library
import { CiLock } from "react-icons/ci";

const ChatRoom = ({ server, user, onCancel, serverData = null }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [enteredKey, setEnteredKey] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");

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

  const sendMessage = async (e, secure = false) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    let message = messageText;
    try {
      if (secure) {
        const key = prompt("Please enter encryption key:");
        if (key) {
          message = "ENCRYPTED:" + encryptMessage(messageText, key);
        } else {
          alert("Encryption key is required.");
        }
      }
      setMessageText("");
      await server.collection("messages").add({
        sender: user.displayName,
        text: message,
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

  // Function to encrypt the message
  const encryptMessage = (message, key) => {
    return CryptoJS.AES.encrypt(message, key).toString();
  };

  // Function to decrypt the message (recipient's end)
  const decryptMessage = (encryptedMessage, key) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleDecrypt = (e, message) => {
    e.preventDefault();
    const decrypted = decryptMessage(message, enteredKey);
    if (decrypted) {
      setDecryptedMessage(decrypted);
      //   setShowModal(false);
    } else {
      alert("Invalid encryption key");
    }
  };

  const handleIconClick = (e, eMessage) => {
    setEncryptedMessage(eMessage.replace("ENCRYPTED:", ""));
    e.preventDefault();
    setShowModal(true);
  };

  const clearDecryptedData = () => {
    setDecryptedMessage("");
    setEncryptedMessage("");
    setEnteredKey("");
    setShowModal(false);
  }
  return (
    <div className="flex flex-col items-center bg-neutral-50" style={{height: '100vh'}}>
        <div className="flex items-center justify-between mb-4 custom-chatroom-header mt-5">
          <h2 className="cursor-pointer" onClick={onCancel}>
            <FaAngleLeft className="inline-block size-5" />
                {serverData?.name}
         </h2>
          <button
            className="hover:underline focus:outline-none"
            onClick={handleCopyServerId}
          >
            <FiCopy className="inline-block mr-1" />
          </button>
        </div>
        <div
          className="flex flex-col-reverse overflow-x-hidden overflow-y-scroll custom-chatroom-body"
        >
          {[...messages].reverse().map((message) => (
            <div
              key={message.id}
              className={`flex column-reverse ${
                message.sender === user.displayName
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-4 mt-1 rounded-lg ${
                  message.sender === user.displayName
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">
                  {message.sender !== user.displayName && (
                    <span className="font-semibold">{message.sender}:</span>
                  )}{" "}
                  <div>
                    {!message.text.startsWith("ENCRYPTED:") && (
                      <span>{message.text}</span>
                    )}
                  </div>
                </p>
                <div>
                  {message.text.startsWith("ENCRYPTED:") && (
                    <CiLock
                      style={{
                        cursor: 'pointer', fontZize: 16, color: '#2a282c'
                      }}
                      onClick={(e) => handleIconClick(e, message.text)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg p-8 max-w-sm">
              <h2 className="text-lg font-bold mb-4">{decryptedMessage ? 'Decrypted Message' : 'Enter Encryption Key'}</h2>
              {!decryptedMessage && <>
              <input
                type="password"
                placeholder="Enter encryption key"
                value={enteredKey}
                onChange={(e) => setEnteredKey(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => handleDecrypt(e, encryptedMessage)}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600"
                >
                  Decrypt
                </button>
              </div>
              </>}
              {decryptedMessage && 
              <div className="text-center">
                <div className="mt-4">{decryptedMessage}</div>
              
              <button
                  onClick={() => clearDecryptedData()}
                  className="bg-gray-200 mt-5 text-gray-700 font-bold py-2 px-4 rounded-md transition duration-300 hover:bg-gray-400"
                >
                  Close
                </button>
            </div>}
          </div>
          </div>
        )}
        <form className="flex absolute custom-chatroom-form p-5">
          <input
            type="text"
            placeholder="Type your message here"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            type="button"
            onClick={(e) => sendMessage(e)}
            className="w-28 ml-2 bg-blue-500 text-white font-bold py-2 rounded-md transition duration-300 hover:bg-blue-600 flex items-center justify-center"
          >
            <FaPaperPlane /> 
          </button>
          <button
            type="button"
            onClick={(e) => sendMessage(e, true)}
            className="w-28 ml-2 bg-black text-white font-bold py-2 rounded-md transition duration-300 hover:bg-red-600 flex items-center justify-center"
          >
            <CiLock /> 
          </button>
        </form>
    </div>
  );
};

export default ChatRoom;
