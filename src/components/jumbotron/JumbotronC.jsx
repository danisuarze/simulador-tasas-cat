import React from 'react';
import './JumbotronC.css';

const JumbotronC = () => {
  return (
    <div className="jumbotron-final">
      <img 
        src="public/images/logocat.png" 
        alt="Logo CAT" 
        className="final-logo"
      />
      <div className="final-text">
        <span className="final-title">Colegio de Arquitectos de Tucumán</span>
        <span className="final-paragraph">Ley 5.994 |  Modif. Ley 8.863</span>
      </div>
    </div>
  );
}

export default JumbotronC;
