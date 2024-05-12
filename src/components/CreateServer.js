import React, { useState } from 'react';
import { firestore } from '../firebase/firebaseConfig';
import ChatRoom from './ChatRoom'; // Import the ChatRoom component

const CreateServer = ({ user, onCancel, enterServer }) => {
  const [serverName, setServerName] = useState('');
  const [createdServer, setCreatedServer] = useState(null);

  const createServer = async () => {
    if (!serverName.trim()) return;
    try {
      const serverRef = await firestore.collection('servers').add({
        name: serverName,
        createdBy: user.uid,
        messages: [] // Initialize messages array for the new server
      });
      onCancel();
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      {!createdServer ? ( // Render input form if server hasn't been created yet
        <>
          <input
            type="text"
            placeholder="Enter Server Name"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
          />
          <div className="flex justify-center">
          <button onClick={onCancel}  className="bg-white hover:bg-blue-200 font-bold py-2 px-4 rounded-full mr-5">
              Cancel
            </button>
            <button onClick={createServer} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Create Server
            </button>
          </div>
        </>
      ) : ( // Render ChatRoom component if server has been created
        <ChatRoom server={createdServer} user={user} serverData={createdServer}/>
      )}
    </div>
  );
};

export default CreateServer;
