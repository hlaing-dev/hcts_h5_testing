/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "./firebase/firebaseConfig";
import CreateServer from "./components/CreateServer";
import JoinServer from "./components/JoinServer";
import { firestore } from "./firebase/firebaseConfig";
import ChatRoom from "./components/ChatRoom";
import { MdWorkspacesOutline } from "react-icons/md"; // Import the paper plane icon
import { TbArrowsJoin } from "react-icons/tb"; // Import the paper plane icon
import { FcVideoCall } from "react-icons/fc"; // Import the paper plane icon
import ServerComponent from "./components/ServerComponent";
import VideoCall from './VideoCall';
const App = () => {
  const [user] = useAuthState(auth);
  const [createServer, setCreateServer] = useState(false);
  const [joinServer, setJoinServer] = useState(false);
  const [recentServers, setRecentServers] = useState([]);
  const [joinedServer, setJoinedServer] = useState(null);
  const [serverData, setServerData] = useState(null);
  const [cancelVideoCall, setCancelVideocall] = useState(true);

  useEffect(() => {
    if (user) {
      fetchServers();
    }
  }, [user]);

  const fetchServers = async () => {
    try {
      // Fetch all servers
      const serversRef = await firestore.collection("servers").get();
      // Array to store servers where the user has sent a message
      const userServers = [];
      // Iterate over each server
      serversRef.docs.forEach(async (serverDoc) => {
        const serverRef = firestore.collection("servers").doc(serverDoc.id);
        // Fetch messages sent by the current user in the server
        const userMessagesRef = await serverRef
          .collection("messages")
          .where("sender", "==", user.displayName)
          .limit(1) // Limit to 1 message to check if the user has sent any message in the server
          .get();

        // If the user has sent a message in the server, add it to the userServers array
        if (serverDoc.data().createdBy === user.uid || !userMessagesRef.empty) {
          userServers.push({
            id: serverDoc.id,
            isOwnerServer: serverDoc.data().createdBy === user.uid,
            ...serverDoc.data(),
          });
        }
        setRecentServers(userServers);
      });
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

  const handleVideoCall = () => {
    console.log('video call is=>', cancelVideoCall);
    setCancelVideocall(false);
  }

  const handleEnterChat = async (serverId, server = null) => {
    if (!serverId?.trim()) return;
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
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this server?"
      );

      if (isConfirmed) {
        // Delete the server from the database
        await firestore.collection("servers").doc(serverId).delete();

        // Remove the deleted server from the recentServers state
        setRecentServers((prevServers) =>
          prevServers.filter((server) => server.id !== serverId)
        );

        console.log(`Server ${serverId} deleted successfully.`);
      } else {
        console.log(`Deletion of server ${serverId} cancelled.`);
      }
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  const handleCancelVideoCall = (event) => {
    setCancelVideocall(true);
  }
  return (
    <>
      {!joinedServer && (
        <div
          className="flex flex-col justify-center items-center overflow-y-scroll p-5 custom-main"
          style={{ height: "100vh" }}
        >
          {!user && (
            <div className="text-center">
              <h1 className="text-3xl text-white font-bold mb-4">Let's start your space...</h1>
              <button
                onClick={() => auth.signInWithPopup(provider)} style={{border: "1px solid white"}}
                className="text-white font-bold py-2 px-6 rounded-full shadow-md w-full mt-5 flex items-center justify-center"
              >
                Sign In with Google
              </button>
              <button
                onClick={() => auth.signInAnonymously()} style={{border: "1px solid white"}}
                className="text-white font-bold py-2 px-6 rounded-full shadow-md w-full mt-5 flex items-center justify-center"
              >
                Sign In As Guest
              </button>
            </div>
          )}
          {user && recentServers.length > 0 && (
            <div className="gap-4 w-full overflow-y-scroll pb-5">
              {recentServers.map((server, index) => (
                <ServerComponent
                  key={server.id}
                  server={server}
                  index={index}
                  handleEnterChat={handleEnterChat}
                  handleDeleteServer={handleDeleteServer}
                />
              ))}
            </div>
          )}
          {user && !createServer && !joinServer && (
            <div className="mt-5 gap-4 w-full">
              <button style={{border: "1px solid white"}}
                onClick={handleCreateServer}
                className="text-white backdrop-blur-md font-bold py-2 px-6 rounded-full shadow-md w-full flex items-center justify-center create-space"
              >
                Create Space <MdWorkspacesOutline className="ml-2" />
              </button>
              <button
                onClick={handleJoinServer} style={{border: "1px solid white"}}
                className="text-white font-bold py-2 px-6 rounded-full shadow-md w-full mt-5 flex items-center justify-center"
              >
                Join Space <TbArrowsJoin className="ml-2" />
              </button>
              <button
                onClick={handleVideoCall} style={{border: "1px solid white"}}
                className="text-white font-bold py-2 px-6 rounded-full shadow-md w-full mt-5 flex items-center justify-center"
              >
                Video Call <FcVideoCall className="ml-2" />
              </button>
            </div>
          )}

          {user && createServer && (
            <CreateServer
              user={user}
              onCancel={handleCancel}
              enterServer={setJoinedServer}
            />
          )}
          {user && joinServer && (
            <JoinServer
              user={user}
              onCancel={handleCancel}
              enterServer={setJoinedServer}
            />
          )}
        </div>
      )}
      {joinedServer && (
        <ChatRoom
          server={joinedServer}
          serverData={serverData}
          user={user}
          onCancel={handleCancel}
        />
      )}
      {!cancelVideoCall && <VideoCall handleCancelVideoCall={(e)=> handleCancelVideoCall(e)} recentServers={recentServers} 
      user={user}/>}
    </>
  );
};

export default App;
