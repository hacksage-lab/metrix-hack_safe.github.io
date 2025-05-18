
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import MatrixRain from "@/components/MatrixRain";
import GlitchText from "@/components/GlitchText";
import TypingEffect from "@/components/TypingEffect";

const Login = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
      login(username);
      navigate("/chat");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center matrix-bg p-4">
      <MatrixRain />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="matrix-card border-green-500/50 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlitchText 
                text="THE MATRIX" 
                className="text-3xl font-bold tracking-wider text-primary matrix-glow mb-2"
              />
            </motion.div>
            
            <CardTitle className="text-xl text-primary matrix-glow">
              <TypingEffect text="Anonymous Access Terminal" speed={70} />
            </CardTitle>
            
            <CardDescription className="text-green-400/80">
              Enter a username to connect. No personal information required.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-green-400 matrix-glow">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Enter anonymous identifier"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="matrix-input"
                  required
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  type="submit" 
                  className="w-full matrix-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="mr-2">Connecting</span>
                      <span className="animate-pulse">...</span>
                    </span>
                  ) : (
                    "Enter The Matrix"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <span className="text-xs text-green-400/60">
              By entering, you agree to remain anonymous and follow the rules of the system.
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
