import React, { useState } from 'react';
import { FaCalculator, FaChartLine } from 'react-icons/fa';
import CardsC from '../cards/CardsC'; // Ruta corregida
import './PresentacionSimuladoresC.css';

const PresentacionSimuladoresC = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [currentComponent, setCurrentComponent] = useState(null);

  const cards = [
    {
      id: 1,
      title: "Simulador de Honorarios",
      icon: <FaCalculator />,
      bgColor: "rgba(255, 255, 255, 0.85)",
      hoverColor: "rgba(255, 255, 255, 0.95)",
      component: 'Honorarios'
    },
    {
      id: 2,
      title: "Simulador de Tasas Retributivas",
      icon: <FaChartLine />,
      bgColor: "rgba(255, 255, 255, 0.85)",
      hoverColor: "rgba(255, 255, 255, 0.95)",
      component: 'CardsC'
    }
  ];

  const handleCardClick = (cardId) => {
    setActiveCard(cardId);
    const selectedCard = cards.find(card => card.id === cardId);
    if (selectedCard) {
      setCurrentComponent(selectedCard.component);
    }
  };

  const handleBackClick = () => {
    setCurrentComponent(null);
    setActiveCard(null);
  };

  // Renderizar el componente correspondiente
  const renderComponent = () => {
    switch (currentComponent) {
      case 'CardsC':
        return <CardsC onBack={handleBackClick} />;
      case 'Honorarios':
        return (
          <div className="componente-en-desarrollo">
            <button onClick={handleBackClick} className="back-button">
              ← Volver
            </button>
            <div className="development-content">
              <h2>Simulador de Honorarios - En desarrollo</h2>
              <p>Esta funcionalidad estará disponible próximamente.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentComponent) {
    return renderComponent();
  }

  return (
    <div className="presentacion-container">
      <div className="background-overlay"></div>
      
      <div className="cards-wrapper">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${activeCard === card.id ? 'active' : ''}`}
            onClick={() => handleCardClick(card.id)}
            onMouseEnter={() => setActiveCard(card.id)}
            onMouseLeave={() => setActiveCard(null)}
            style={{
              backgroundColor: activeCard === card.id ? card.hoverColor : card.bgColor
            }}
          >
            <div className="card-content">
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentacionSimuladoresC;