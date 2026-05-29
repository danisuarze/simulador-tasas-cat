// src/components/accesoAutogestion/AccesoAutogestionC.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import './AccesoAutogestionC.css'; // Importación del CSS normal

const AccesoAutogestionC = ({ onBack }) => {
  const handleAccess = () => {
    window.open('https://autogestion.catonline.org.ar/catautogestion.html', '_blank', 'noopener noreferrer');
  };

  return (
    <div className="acceso-autogestion-container">
      <div className="acceso-autogestion-wrapper">
        <Button 
          onClick={onBack} 
          variant="secondary" 
          className="acceso-autogestion-back-button"
        >
          <FaArrowLeft className="me-2" />
          Volver a categorías
        </Button>
        
        <div className="acceso-autogestion-card">
          <div className="acceso-autogestion-image-wrapper">
            <img 
              src="/images/autogestion.png" 
              alt="Acceso a Autogestión CAT" 
              className="acceso-autogestion-image"
            />
          </div>
          <div className="acceso-autogestion-content">
            <h3 className="acceso-autogestion-title">Autogestión CAT</h3>
            <p className="acceso-autogestion-description">
              Acceda al sistema de autogestión del Colegio de Arquitectos de Tucumán 
              para realizar trámites, consultas y gestiones administrativas.
            </p>
            <button onClick={handleAccess} className="acceso-autogestion-button">
              Ir a Autogestión
              <FaExternalLinkAlt className="acceso-autogestion-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccesoAutogestionC;