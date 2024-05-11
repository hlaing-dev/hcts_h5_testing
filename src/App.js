import React, { useRef, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { MoonIcon, SunIcon, LogoutIcon } from '@heroicons/react/solid';

firebase.initializeApp({
  apiKey: "AIzaSyBf3cKKUcAwaEsvSv_FFf1GhypyaCNVkd0",
  authDomain: "dddchat-49907.firebaseapp.com",
  projectId: "dddchat-49907",
  storageBucket: "dddchat-49907.appspot.com",
  messagingSenderId: "951404294775",
  appId: "1:951404294775:web:c46236a06ed1bbdd2e0c72",
  measurementId: "G-PPW34ZF7V6"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
};

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

const ChatRoom = ({ theme }) => {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 max-w-screen-lg mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-lg shadow-lg`}>
      <div className="overflow-y-auto px-4 py-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} isSent={msg.uid === auth.currentUser.uid} />)}
        <span ref={dummy}></span>
      </div>
      <form onSubmit={sendMessage} className="flex items-center justify-between px-4 py-2">
        <input
          className={`flex-grow border-2 border-${theme === 'dark' ? 'gray-600' : 'gray-400'} rounded-l py-2 px-4 mr-2 bg-${theme === 'dark' ? 'gray-700 text-white' : 'white'} placeholder-gray-500`}
          placeholder="Type your message here"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r`}
          type="submit"
          disabled={!formValue}
        >
          Send
        </button>
      </form>
    </div>
  );
};

const SignOut = () => {
  return (
    auth.currentUser && (
      <button className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => auth.signOut(auth)}>
        <LogoutIcon className="h-5 w-5 mr-2" />
        {/* Sign Out */}
      </button>
    )
  );
};

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      className={`flex items-center bg-${theme === 'dark' ? 'gray-700' : 'gray-200'} text-${theme === 'dark' ? 'white' : 'gray-800'} hover:bg-${theme === 'dark' ? 'gray-600' : 'gray-300'} hover:text-${theme === 'dark' ? 'white' : 'gray-900'} font-bold py-2 px-4 rounded`}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <MoonIcon className="h-5 w-5 mr-2" /> : <SunIcon className="h-5 w-5 mr-2" />}
      {/* {theme === 'light' ? 'Dark Mode' : 'Light Mode'} */}
    </button>
  );
};

const ChatPage = () => {
  const [user] = useAuthState(auth);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <nav className={`bg-${theme === 'dark' ? 'gray-800' : 'blue-500'} text-white px-4 py-2 flex justify-between items-center`}>
        <h1 className="text-3xl font-bold">dddChat 💬</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          {user && <SignOut />}
        </div>
      </nav>
      <section className="flex-grow flex justify-center items-center">
        {user ? <ChatRoom theme={theme} /> : <SignIn />}
      </section>
    </div>
  );
};
export default ChatPage;
