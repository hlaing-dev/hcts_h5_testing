import React from 'react';

const ChatMessage = ({ message, isSent, isDarkTheme }) => {
  const { text, photoURL } = message;
  const bgColorClass = isDarkTheme ? 'bg-slate-700' : 'bg-gray-200';
  const textColorClass = isDarkTheme ? 'text-white' : 'text-gray-800';

  return (
    <div className={`flex mb-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
      {!isSent && (
        <img
          className="w-10 h-10 rounded-full mr-2"
          src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
          alt="Profile"
        />
      )}
      <div className={`${bgColorClass} rounded-lg p-3 ${textColorClass}`}>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
