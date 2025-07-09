import React from 'react';
import '../styles/WelcomePage.css'; // Import the new CSS file

const WelcomePage = ({ onGetStarted }) => {
  return (
    <div className="welcome-page">
      {/* Video Background Element - ONLY for Welcome Page */}
      <div className="welcome-video-background">
        <video autoPlay loop muted playsInline>
          {/* Main MP4 source */}
          <source src="/videos/animation.mp4" type="video/mp4" />
          {/* IMPORTANT: Add a WebM fallback for broader browser compatibility */}
          <source src="/videos/animation.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* This div acts as the semi-transparent overlay */}
      <div className="welcome-page-overlay"></div>

      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to AI PPT Generator!</h1>
        <img src="/logow.png" alt="AI Logo" className="welcome-logo" />
        <button className="get-started-button" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
