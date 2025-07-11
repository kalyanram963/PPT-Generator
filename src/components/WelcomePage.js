import React from 'react';
import '../styles/WelcomePage.css'; // Import the new CSS file

const WelcomePage = ({ onGetStarted }) => {
  return (
    <div className="welcome-page">
      {/* The video background and its overlay have been removed from here */}

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
