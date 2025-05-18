
import React from "react";
import { motion } from "framer-motion";

const GlitchText = ({ text, className }) => {
  return (
    <motion.div
      className={`glitch ${className || ""}`}
      data-text={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.div>
  );
};

export default GlitchText;
