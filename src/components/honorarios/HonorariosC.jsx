import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaArrowLeft } from 'react-icons/fa';
import GenericHonorarioC from './GenericHonorarioC';
import TasacionesC from './tasaciones/TasacionesC';
import EncargosProfesionalesC from './encargosProfesionales/EncargosProfesionalesC';
import './HonorariosC.css';

const HonorariosC = ({ onBack }) => {
  const [activeSubComponent, setActiveSubComponent] = useState(null);
  const [activeTitle, setActiveTitle] = useState('');

  const handleSubClick = (title) => {
    setActiveTitle(title);
    setActiveSubComponent(title);
  };

  const handleBackToSubCards = () => {
    setActiveSubComponent(null);
    setActiveTitle('');
  };

  const renderSubComponent = () => {
    if (activeTitle === "Tasaciones") {
      return <TasacionesC onBack={handleBackToSubCards} />;
    }
    if (activeTitle === "Encargos Profesionales") {
      return <EncargosProfesionalesC onBack={handleBackToSubCards} />;
    }
    return <GenericHonorarioC onBack={handleBackToSubCards} title={activeTitle} />;
  };

  if (activeSubComponent) {
    return renderSubComponent();
  }

  const subCards = [
    { 
      id: 1, 
      title: "Tasaciones", 
      text: "Los honorarios por tasaciones se determinan sobre el valor del bien", 
      image: "/images/tasaciones.jpg" 
    },
    { 
      id: 2, 
      title: "Encargos Profesionales", 
      text: "Honorarios por encargos y/o servicios profesionales de arquitectura", 
      image: "/images/Encargo_prof.jpg"
    },
    { 
      id: 3, 
      title: "Honorarios Especialidad 3", 
      text: "Descripción genérica para la especialidad 3", 
      image: "/images/honorarios3.jpg" 
    },
    { 
      id: 4, 
      title: "Honorarios Especialidad 4", 
      text: "Descripción genérica para la especialidad 4", 
      image: "/images/honorarios4.jpg" 
    },
    { 
      id: 5, 
      title: "Honorarios Especialidad 5", 
      text: "Descripción genérica para la especialidad 5", 
      image: "/images/honorarios5.jpg" 
    },
    { 
      id: 6, 
      title: "Honorarios Especialidad 6", 
      text: "Descripción genérica para la especialidad 6", 
      image: "/images/honorarios6.jpg" 
    }
  ];

  return (
    <Container className="honorarios-container">
      <div className="text-center mb-3">
        <Button onClick={onBack} variant="secondary" className="btn-volver-honorarios">
          <FaArrowLeft className="me-2" /> Volver al inicio
        </Button>
      </div>

      <div className="text-center mb-4">
        <h2 className="main-title-honorarios">Simulador de Honorarios</h2>
        <p className="subtitle-honorarios">Seleccione la especialidad para calcular honorarios</p>
      </div>

      <Row>
        {subCards.map(card => (
          <Col key={card.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm card-hover">
              <div className="card-media-container image-container">
                <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-body-content">
                <h3 className="text-center card-title">{card.title}</h3>
                <p className="text-center card-text">{card.text}</p>
                <div className="text-center">
                  <Button className="card-button" onClick={() => handleSubClick(card.title)}>
                    Calcular
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HonorariosC;