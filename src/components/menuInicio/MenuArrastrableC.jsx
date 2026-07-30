import React, { useState, useEffect, useRef } from 'react';
import './MenuArrastrableC.css';

const MenuArrastrableC = ({ onSelectOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = (option) => {
    if (onSelectOption) {
      onSelectOption(option);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Texto del primer botón - Tasa Retributiva
  const tasaDescription = (
    <>
      Aplicación de tabla<br />
      para el cálculo de TR 2026
    </>
  );

  // Texto del segundo botón - Honorarios
  const honorariosFormatted = (
    <>
      Método aplicado:<br />
      Libro Honorarios Profesionales en Arquitectura.<br />
      Guía práctica para la determinación y gestión<br />
      del valor profesional.
    </>
  );

  return (
    <div 
      className={`menu-arrastrable-container ${isOpen ? 'has-open' : ''}`} 
      ref={menuRef}
    >
      {/* Flecha indicadora - SIEMPRE VISIBLE */}
      <div 
        className={`arrow-indicator ${isOpen ? 'open' : 'closed'}`}
        onClick={toggleMenu}
      >
        {!isOpen && (
          <div className="arrow-wrapper">
            <div className="double-arrow">
              {/* Flecha hacia ARRIBA cuando está cerrado - AZUL OSCURO */}
              <svg 
                className="arrow-icon arrow-1"
                width="30" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon 
                  points="12,4 4,18 20,18" 
                  fill="#111B4D"
                  opacity="0.8"
                />
              </svg>
              <svg 
                className="arrow-icon arrow-2"
                width="30" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon 
                  points="12,8 6,18 18,18" 
                  fill="#111B4D"
                  opacity="0.4"
                />
              </svg>
            </div>
            {/* Nuevo contenedor con dos líneas de texto */}
            <div className="arrow-text-container">
              <span className="arrow-text text-blue arrow-text-line1">
                Desplegar
              </span>
              <span className="text-blue arrow-text-line2">
                Simulador de Cálculos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menú desplegable - SOLO SE MUESTRA CUANDO ESTÁ ABIERTO */}
      {isOpen && (
        <div className="menu-content open">
          <div className="menu-options">
            <div className="menu-option-wrapper">
              <button 
                className="menu-option"
                onClick={() => handleOptionClick('tasa')}
              >
                <span className="option-text">Tasa Retributiva</span>
              </button>
              <p className="option-description">
                {tasaDescription}
              </p>
            </div>
            
            <div className="menu-option-wrapper">
              <button 
                className="menu-option"
                onClick={() => handleOptionClick('honorarios')}
              >
                <span className="option-text">Honorarios</span>
              </button>
              <p className="option-description honorarios-text">
                {honorariosFormatted}
              </p>
            </div>
          </div>

          {/* Flecha y "Cerrar" debajo de los botones */}
          <div className="menu-footer-arrow" onClick={toggleMenu}>
            <div className="double-arrow down-arrow">
              <svg 
                className="arrow-icon arrow-1 down"
                width="30" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon 
                  points="12,20 4,6 20,6" 
                  fill="white"
                  opacity="0.9"
                />
              </svg>
              <svg 
                className="arrow-icon arrow-2 down"
                width="30" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon 
                  points="12,16 6,6 18,6" 
                  fill="white"
                  opacity="0.5"
                />
              </svg>
            </div>
            <span className="arrow-text text-white">Cerrar</span>
          </div>

          <div className="menu-footer">
            <span className="menu-footer-text">Colegio de Arquitectos de Tucumán</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuArrastrableC;