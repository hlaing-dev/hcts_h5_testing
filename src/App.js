import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "./firebase/firebaseConfig";
import CreateServer from "./components/CreateServer";
import JoinServer from "./components/JoinServer";
import { firestore } from "./firebase/firebaseConfig";
import ChatRoom from "./components/ChatRoom";
import { FaRocketchat } from "react-icons/fa"; // Import the paper plane icon
import { IoSearchCircleOutline } from "react-icons/io5"; // Import the paper plane icon

const App = () => {
  const [user] = useAuthState(auth);
  const [createServer, setCreateServer] = useState(false);
  const [joinServer, setJoinServer] = useState(false);
  const [recentServers, setRecentServers] = useState([]);
  const [joinedServer, setJoinedServer] = useState(null);
  const [serverData, setServerData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchServers()
  }}, [user]);

  const fetchServers = async () => {
    try {
      const serversRef = firestore
        .collection("servers")
        .where("createdBy", "==", user.uid);
      const snapshot = await serversRef.get();
      const serverList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentServers(serverList);
    } catch (error) {
      console.error("Error fetching recent servers:", error);
    }
  };

  const handleCreateServer = () => {
    setCreateServer(true);
    setJoinServer(false);
  };

  const handleJoinServer = () => {
    setCreateServer(false);
    setJoinServer(true);
  };

  const handleCancel = () => {
    setJoinedServer(null);
    setCreateServer(false);
    setJoinServer(false);
    fetchServers();
  };

  const handleEnterChat = async (serverId, server = null) => {
    if (!serverId.trim()) return;
    if (server) setServerData(server);
    try {
      const serverRef = firestore.collection("servers").doc(serverId);
      const serverDoc = await serverRef.get();
      if (!serverDoc.exists) {
        alert("Server does not exist!");
        return;
      }
      setJoinedServer(serverRef); // Set the joined server reference
    } catch (error) {
      console.error("Error joining server:", error);
    }
  };

  const handleDeleteServer = async (serverId) => {
    try {
      // Show confirmation dialog before deleting the server
      const isConfirmed = window.confirm('Are you sure you want to delete this server?');
      
      if (isConfirmed) {
        // Delete the server from the database
        await firestore.collection('servers').doc(serverId).delete();
        
        // Remove the deleted server from the recentServers state
        setRecentServers(prevServers => prevServers.filter(server => server.id !== serverId));
        
        console.log(`Server ${serverId} deleted successfully.`);
      } else {
        console.log(`Deletion of server ${serverId} cancelled.`);
      }
    } catch (error) {
      console.error('Error deleting server:', error);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center p-10 bg-neutral-50" style={{height: '100vh'}}>
      {!joinedServer && (
        <>
          {!user && (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to dddChat</h1>
              <button
                onClick={() => auth.signInWithPopup(provider)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
              >
                Sign In with Google
              </button>
            </div>
          )}
          <></>
          {user && recentServers.length > 0 && (
            <div className="m-8 gap-4 w-full">
              {recentServers.map((server) => (
                <div
                  key={server.id}
                  className="bg-neutral-100 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300 w-full mt-5 relative"
                  onClick={() => handleEnterChat(server.id, server)}
                >
                  <button
                    className="absolute top-5 right-2 bg-red-400 text-white rounded-full w-6 h-6 flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from bubbling up to the card
                      handleDeleteServer(server.id);
                    }}
                  >
                    -
                  </button>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 ">
                      {server.name}
                    </h2>
                    <p className="text-sm text-white">{server.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {user && !createServer && !joinServer && (
            <div className="m-8 gap-4 w-full">
            <button
              onClick={handleCreateServer}
              className="bg-white text-green-700 hover:bg-green-200 hover:text-green-900 font-bold py-2 px-6 rounded-lg shadow-md w-full flex items-center justify-center"
            >
              Create Server <FaRocketchat className="ml-2" />
            </button>
            <button
              onClick={handleJoinServer}
              className="bg-white text-blue-700 hover:bg-blue-200 hover:text-blue-900 font-bold py-2 px-6 rounded-lg shadow-md w-full mt-5 flex items-center justify-center"
            >
              Join Server <IoSearchCircleOutline className="ml-2" />
            </button>
          </div>
          
          )}
          {user && createServer && (
            <CreateServer user={user} onCancel={handleCancel} enterServer={setJoinedServer}/>
          )}
          {user && joinServer && (
            <JoinServer user={user} onCancel={handleCancel} enterServer={setJoinedServer}/>
          )}
        </>
      )}
      {joinedServer && <ChatRoom server={joinedServer} serverData={serverData} user={user} onCancel={handleCancel}/>}
    </div>
  );
};

export default App;
