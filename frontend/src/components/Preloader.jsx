import React, { useState, useEffect } from 'react';
import '../styles/Preloader.css';

export default function Preloader({ isLoaded }) {
  const coins = Array.from({ length: 12 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    const duration = 3500; // 3.5 seconds
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(percentage);
      if (percentage >= 100) clearInterval(interval);
    }, 30);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`preloader-container ${isLoaded ? 'fade-out' : ''}`}>
      <div className="cube-wrapper">
        <div className="cube">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>
      </div>
      <div className="preloader-text">STUDENT CHATBOT</div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
      <div className="loading-percentage">{progress}%</div>
    </div>
  );
}
