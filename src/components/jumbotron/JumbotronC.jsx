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
        <span className="final-title">SIMULADOR DE TASAS</span>
        <span className="final-paragraph">Valores referenciales sujetos al control del Dpto. Ejercicio Profesional del CAT</span>
      </div>
    </div>
  );
}

export default JumbotronC;
