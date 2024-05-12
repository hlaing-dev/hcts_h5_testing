import React from 'react';
import { auth } from '../firebase/firebaseConfig';
import { LogoutIcon } from '@heroicons/react/solid';

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

export default SignOut;
