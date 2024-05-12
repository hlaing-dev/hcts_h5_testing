import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
    //   className={`flex items-center bg-${theme === 'dark' ? 'gray-700' : 'gray-200'} text-${theme === 'dark' ? 'white' : 'gray-800'} hover:bg-${theme === 'dark' ? 'gray-600' : 'gray-300'} hover:text-${theme === 'dark' ? 'white' : 'gray-900'} font-bold py-2 px-4 rounded`}
      onClick={toggleTheme}
    >
      {theme === 'light' ? <MoonIcon className="h-5 w-5 mr-2" /> : <SunIcon className="h-5 w-5 mr-2" />}
      {/* {theme === 'light' ? 'Dark Mode' : 'Light Mode'} */}
    </button>
  );
};

export default ThemeToggle;
