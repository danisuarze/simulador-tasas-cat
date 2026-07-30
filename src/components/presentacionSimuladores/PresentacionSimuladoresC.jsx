import React, { useState, useEffect } from 'react';
import CardsC from '../cards/CardsC';
import HonorariosC from '../honorarios/HonorariosC'; // ✅ Importamos el componente real
import './PresentacionSimuladoresC.css';

const PresentacionSimuladoresC = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [currentComponent, setCurrentComponent] = useState(null);

  const cards = [
    {
      id: 1,
      title: "Simulador de Tasas Retributivas",
      image: "/images/visados.png",
      component: 'CardsC'
    },
    {
      id: 2,
      title: "Simulador de Honorarios",
      image: "/images/Honorarios.png",
      component: 'Honorarios'
    }
  ];

  const handleCardClick = (cardId) => {
    setActiveCard(cardId);
    const selectedCard = cards.find(card => card.id === cardId);
    if (selectedCard) {
      setCurrentComponent(selectedCard.component);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackClick = () => {
    setCurrentComponent(null);
    setActiveCard(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentComponent) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentComponent]);

  const renderComponent = () => {
    switch (currentComponent) {
      case 'CardsC':
        return <CardsC onBack={handleBackClick} />;
      case 'Honorarios':
        return <HonorariosC onBack={handleBackClick} />; // ✅ Ya no muestra "en construcción"
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
          >
            <div className="card-image-container">
              <img src={card.image} alt={card.title} className="card-image" />
            </div>
            <div className="card-title-overlay">
              <h3>{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentacionSimuladoresC;