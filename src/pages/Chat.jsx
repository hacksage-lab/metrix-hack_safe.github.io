
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import MatrixRain from "@/components/MatrixRain";
import GlitchText from "@/components/GlitchText";
import { MessageSquare, Send, LogOut, Plus, ArrowLeft } from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [showRoomList, setShowRoomList] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  
  const { user, logout } = useAuth();
  const { chatRooms, activeRoom, messages, createRoom, joinRoom, leaveRoom, sendMessage } = useChat();
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeRoom) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      const room = createRoom(newRoomName, newRoomDesc);
      setNewRoomName("");
      setNewRoomDesc("");
      setShowNewRoomForm(false);
      joinRoom(room.id);
      setShowRoomList(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
    setShowRoomList(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Mobile view handlers
  const showRooms = () => {
    leaveRoom();
    setShowRoomList(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col matrix-bg">
      <MatrixRain />
      
      {/* Header */}
      <header className="p-4 border-b border-green-500/30 backdrop-blur-sm flex justify-between items-center z-10">
        <div className="flex items-center">
          {!showRoomList && activeRoom && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={showRooms}
              className="mr-2 md:hidden text-primary"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <GlitchText 
            text="MATRIX CHAT" 
            className="text-xl font-bold tracking-wider text-primary matrix-glow"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-sm hidden sm:inline-block">
            {user.username}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Room list - hidden on mobile when in a chat */}
        <motion.div 
          className={`w-full md:w-80 border-r border-green-500/30 backdrop-blur-sm ${!showRoomList && activeRoom ? 'hidden md:block' : 'block'}`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-green-500/30 flex justify-between items-center">
            <h2 className="text-primary font-semibold">Chat Rooms</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowNewRoomForm(!showNewRoomForm)}
              className="text-primary hover:bg-green-900/20"
            >
              <Plus size={20} />
            </Button>
          </div>
          
          {/* New room form */}
          {showNewRoomForm && (
            <motion.div 
              className="p-4 border-b border-green-500/30"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleCreateRoom} className="space-y-3">
                <Input
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="matrix-input"
                  required
                />
                <Input
                  placeholder="Description (optional)"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="matrix-input"
                />
                <Button 
                  type="submit" 
                  className="w-full matrix-button"
                >
                  Create Room
                </Button>
              </form>
            </motion.div>
          )}
          
          {/* Room list */}
          <div className="overflow-y-auto h-[calc(100vh-12rem)]">
            {chatRooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ backgroundColor: "rgba(0, 255, 0, 0.1)" }}
                className={`p-4 cursor-pointer border-b border-green-500/20 ${
                  activeRoom?.id === room.id ? "bg-green-900/20" : ""
                }`}
                onClick={() => handleJoinRoom(room.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center border border-green-500/50">
                    <MessageSquare size={18} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-green-400 font-medium">{room.name}</h3>
                    <p className="text-green-400/60 text-xs">{room.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Chat area */}
        <motion.div 
          className={`flex-1 flex flex-col ${!showRoomList && activeRoom ? 'block' : 'hidden md:block'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeRoom ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-green-500/30 backdrop-blur-sm">
                <h2 className="text-primary font-semibold">{activeRoom.name}</h2>
                <p className="text-green-400/60 text-xs">{activeRoom.description}</p>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-green-400/60">
                    <MessageSquare size={40} className="mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        msg.senderId === user.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`flex ${
                        msg.senderId === user.id ? "flex-row-reverse" : "flex-row"
                      } items-start gap-2 max-w-[80%]`}>
                        <Avatar className={`w-8 h-8 ${
                          msg.senderId === user.id ? "bg-green-700/50" : "bg-blue-700/50"
                        } border border-green-500/50`}>
                          <AvatarFallback className="text-xs">
                            {getInitials(msg.senderName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`${
                          msg.senderId === user.id 
                            ? "bg-green-900/30 border-green-500/50" 
                            : "bg-blue-900/30 border-blue-500/50"
                        } rounded-lg p-3 matrix-border`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-medium ${
                              msg.senderId === user.id ? "text-green-400" : "text-blue-400"
                            }`}>
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-green-400/60 ml-2">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm break-words">{msg.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-green-500/30 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="matrix-input flex-1"
                  />
                  <Button 
                    type="submit" 
                    className="matrix-button"
                    disabled={!message.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-green-400/60 p-4">
              <Card className="matrix-card border-green-500/50 max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-primary matrix-glow text-center">Welcome to Matrix Chat</CardTitle>
                  <CardDescription className="text-center">
                    Select a room to start chatting anonymously
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <img  alt="Matrix digital rain" className="w-full h-40 object-cover rounded-md mb-4" src="https://images.unsplash.com/photo-1669054626218-f0b57b8ec632" />
                  <p className="text-green-400/80">
                    All communications are anonymous. Your identity is protected.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
