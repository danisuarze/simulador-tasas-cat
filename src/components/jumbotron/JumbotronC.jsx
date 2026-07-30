import React, { useState, useEffect } from 'react';
import './JumbotronC.css';

const JumbotronC = () => {
  const [isGlowing, setIsGlowing] = useState(true);

  const handleInteraction = () => {
    setIsGlowing(false);
  };

  useEffect(() => {
    let timer;
    if (!isGlowing) {
      timer = setTimeout(() => {
        setIsGlowing(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isGlowing]);

  return (
    <div 
      className="jumbotron-final"
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
      onKeyDown={handleInteraction}
    >
      <div className="content-wrapper">
        <div className="logo-wrapper">
          <div className={`glow-ring ${isGlowing ? 'active' : ''}`}>
            <img 
              src="/images/LOGOCAT.png" 
              alt="Colegio de Arquitectos de Tucumán" 
              className="logo-image"
            />
          </div>
        </div>
        <div className="text-wrapper">
          <h1 className="title-main">Colegio de Arquitectos de Tucumán</h1>
          <div className="divider-line"></div>
          <p className="subtitle-main">Bienvenidos</p>
        </div>
      </div>
    </div>
  );
};

export default JumbotronC;