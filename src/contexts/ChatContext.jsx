
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chat rooms from localStorage
  useEffect(() => {
    const storedRooms = localStorage.getItem("matrixChatRooms");
    if (storedRooms) {
      try {
        const parsedRooms = JSON.parse(storedRooms);
        setChatRooms(parsedRooms);
        
        // If there are no rooms, create default ones
        if (parsedRooms.length === 0) {
          createDefaultRooms();
        }
      } catch (error) {
        console.error("Error parsing stored chat rooms:", error);
        createDefaultRooms();
      }
    } else {
      createDefaultRooms();
    }
  }, []);

  // Load messages for active room
  useEffect(() => {
    if (activeRoom) {
      const storedMessages = localStorage.getItem(`matrixMessages_${activeRoom.id}`);
      if (storedMessages) {
        try {
          setMessages(JSON.parse(storedMessages));
        } catch (error) {
          console.error("Error parsing stored messages:", error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  }, [activeRoom]);

  const createDefaultRooms = () => {
    const defaultRooms = [
      {
        id: "matrix-main",
        name: "The Matrix",
        description: "Main discussion channel",
        createdAt: new Date().toISOString(),
      },
      {
        id: "red-pill",
        name: "Red Pill",
        description: "For those who seek the truth",
        createdAt: new Date().toISOString(),
      },
      {
        id: "blue-pill",
        name: "Blue Pill",
        description: "Blissful ignorance",
        createdAt: new Date().toISOString(),
      },
    ];
    
    setChatRooms(defaultRooms);
    localStorage.setItem("matrixChatRooms", JSON.stringify(defaultRooms));
  };

  const createRoom = (name, description) => {
    if (!user) return null;
    
    const newRoom = {
      id: `room-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };
    
    const updatedRooms = [...chatRooms, newRoom];
    setChatRooms(updatedRooms);
    localStorage.setItem("matrixChatRooms", JSON.stringify(updatedRooms));
    
    toast({
      title: "Room Created",
      description: `${name} has been created.`,
      duration: 3000,
    });
    
    return newRoom;
  };

  const joinRoom = (roomId) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (room) {
      setActiveRoom(room);
      return room;
    }
    return null;
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setMessages([]);
  };

  const sendMessage = (content) => {
    if (!user || !activeRoom) return null;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      roomId: activeRoom.id,
      senderId: user.id,
      senderName: user.username,
      content,
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`matrixMessages_${activeRoom.id}`, JSON.stringify(updatedMessages));
    
    return newMessage;
  };

  const value = {
    chatRooms,
    activeRoom,
    messages,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
