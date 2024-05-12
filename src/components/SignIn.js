import React from 'react';
import { auth } from '../firebase/firebaseConfig';

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
};

export default SignIn;
