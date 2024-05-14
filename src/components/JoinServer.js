import React, { useState } from 'react';
import { firestore } from '../firebase/firebaseConfig';
import ChatRoom from './ChatRoom'; // Import the ChatRoom component

const JoinServer = ({ user, onCancel, enterServer }) => {
  const [serverId, setServerId] = useState('');
  const [joinedServer, setJoinedServer] = useState(null);

  const joinServer = async () => {
    if (!serverId.trim()) return;
    try {
      const serverRef = firestore.collection('servers').doc(serverId);
      const serverDoc = await serverRef.get();
      if (!serverDoc.exists) {
        alert('Server does not exist!');
        return;
      }
      setJoinedServer(serverRef); // Set the joined server reference
      enterServer(serverRef);
    } catch (error) {
      console.error('Error joining server:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      {!joinedServer ? ( // Render input form if server hasn't been joined yet
        <>
          <input
            type="text"
            placeholder="Enter Space Address"
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            className="border border-gray-300 px-4 py-2 mb-4 w-full rounded-full"
          />
          <div className="flex justify-center">
            <button onClick={onCancel}  className="bg-white hover:bg-blue-200 font-bold py-2 px-4 rounded-full mr-5">
              Cancel
            </button>
            <button onClick={joinServer} className="bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full">
              Join Space
            </button>
          </div>
        </>
      ) : ( // Render ChatRoom component if server has been joined
        <ChatRoom server={joinedServer} user={user} serverData={joinedServer}/>
      )}
    </div>
  );
};

export default JoinServer;
