import React from "react";
import "../styles/animations.css"; // Ensure this path is correct

const Loader = () => {
  return (
    <div className="loader">
      <div className="ai-circle"></div>
      <p>Generating slides...</p>
    </div>
  );
};

export default Loader;