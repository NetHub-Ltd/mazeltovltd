import React from "react";
import "./loader.css"; // Import your CSS

const ModernSpinner = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  );
};

const DotLoader = () => {
  return (
    <div className="loader-container">
      <div className="dot-spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

// You can export one or both, or create a versatile Loader component
export { ModernSpinner, DotLoader };
