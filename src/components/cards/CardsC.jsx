import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { 
  FaHome, 
  FaBuilding, 
  FaHospital, 
  FaIndustry,
  FaTree,
  FaCogs,
  FaHouseUser,
  FaAd,
  FaClipboardCheck,
  FaDraftingCompass,
  FaMoneyBillAlt,
  FaStar,
  FaArrowLeft
} from 'react-icons/fa';
import ViviendaUnifamiliarC from '../viviendaUnifamiliar/ViviendaUnifamiliarC';
import EdificiosAlturaC from '../edificiosAltura/EdificiosAlturaC';
import EdificiosEspecialesC from '../edificiosEspeciales/EdificiosEspecialesC';
import EdificiosIndustrialesC from '../edificiosIndustriales/EdificiosIndustrialesC';
import ExterioresNoCubiertosC from '../exterioresNoCubiertos/ExterioresNoCubiertosC';
import InstalacionesEstructurasC from '../instalacionesEstructuras/InstalacionesEstructurasC';
import EstudioPropuestaC from '../estudioPropuesta/EstudioPropuestaC';
import RepresentacionTecnicaC from '../representacionTecnica/RepresentacionTecnicaC';
import CartelPublicitarioC from '../cartelPublicitario/CartelPublicitarioC';
import TareasTasaFijaC from '../tareasTasaFija/TareasTasaFijaC';
import './CardsC.css';

const CardsC = ({ onBack }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  // Función para manejar el clic en el botón Calcular
  const handleCalculateClick = (title) => {
    const componentMap = {
      "Vivienda Unifamiliar": "ViviendaUnifamiliar",
      "Edificios en Altura": "EdificiosAltura",
      "Edificios Especiales": "EdificiosEspeciales",
      "Edificios Industriales": "EdificiosIndustriales",
      "Exteriores no cubiertos": "ExterioresNoCubiertos",
      "Instalaciones | Estructuras": "InstalacionesEstructuras",
      "Estudio de la propuesta": "EstudioPropuesta",
      "Representación Técnica": "RepresentacionTecnica",
      "Carteles Publicitarios": "CartelPublicitario",
      "Tareas con tasa fija": "TareasTasaFija",
      "IPV": "IPV",
      "Servicios Premium": "ServiciosPremium"
    };
    
    setActiveComponent(componentMap[title] || null);
  };

  // Función para volver al menú principal de CardsC
  const handleBackToCards = () => {
    setActiveComponent(null);
  };

  // Renderizar el componente activo si corresponde
  const renderActiveComponent = () => {
    const components = {
      "ViviendaUnifamiliar": <ViviendaUnifamiliarC onBack={handleBackToCards} />,
      "EdificiosAltura": <EdificiosAlturaC onBack={handleBackToCards} />,
      "EdificiosEspeciales": <EdificiosEspecialesC onBack={handleBackToCards} />,
      "EdificiosIndustriales": <EdificiosIndustrialesC onBack={handleBackToCards} />,
      "ExterioresNoCubiertos": <ExterioresNoCubiertosC onBack={handleBackToCards} />,
      "InstalacionesEstructuras": <InstalacionesEstructurasC onBack={handleBackToCards} />,
      "EstudioPropuesta": <EstudioPropuestaC onBack={handleBackToCards} />,
      "RepresentacionTecnica": <RepresentacionTecnicaC onBack={handleBackToCards} />,
      "CartelPublicitario": <CartelPublicitarioC onBack={handleBackToCards} />,
      "TareasTasaFija": <TareasTasaFijaC onBack={handleBackToCards} />
    };

    return components[activeComponent] || null;
  };

  // Si hay un componente activo, renderizarlo
  if (activeComponent) {
    return renderActiveComponent();
  }

  // Datos de ejemplo para las cards con iconos correspondientes
  const cardData = [
    {
      id: 1,
      title: "Vivienda Unifamiliar",
      text: "Viviendas individuales",
      icon: <FaHome size={30} />,
      component: "ViviendaUnifamiliarC"
    },
    {
      id: 2,
      title: "Edificios en Altura",
      text: "Que supere planta baja y 2 niveles | No se considera uso | No se considera como nivel al subsuelo",
      icon: <FaBuilding size={30} />,
      component: "EdificiosAlturaC"
    },
    {
      id: 3,
      title: "Edificios Especiales",
      text: "Locales comerciales | Viviendas colectivas | Oficinas y/o cualquier uso excepto viv. unifamiliar | Que no supere Pb. y 2 niveles sin considerar subsuelo",
      icon: <FaHospital size={30} />,
      component: "EdificiosEspecialesC"
    },
    {
      id: 4,
      title: "Edificios Industriales",
      text: "Espacios industriales funcionales y seguros adaptados a procesos productivos específicos.",
      icon: <FaIndustry size={30} />,
      component: "EdificiosIndustrialesC"
    },
    {
      id: 5,
      title: "Exteriores no cubiertos",
      text: "Diseño de áreas exteriores, plazas, parques y espacios abiertos con enfoque estético y funcional.",
      icon: <FaTree size={30} />,
      component: "ExterioresNoCubiertosC"
    },
    {
      id: 6,
      title: "Instalaciones | Estructuras",
      text: "Sistemas estructurales e instalaciones especializadas para todo tipo de construcciones.",
      icon: <FaCogs size={30} />,
      component: "InstalacionesEstructurasC"
    },
    {
      id: 7,
      title: "Estudio de la propuesta",
      text: "Análisis detallado de viabilidad y desarrollo conceptual de proyectos arquitectónicos.",
      icon: <FaClipboardCheck size={30} />,
      component: "EstudioPropuestaC"
    },
    {
      id: 8,
      title: "Representación Técnica",
      text: "Elaboración de planos, maquetas y visualizaciones para presentación de proyectos.",
      icon: <FaDraftingCompass size={30} />,
      component: "RepresentacionTecnicaC"
    },
    {
      id: 9,
      title: "IPV",
      text: "Soluciones de vivienda social y planes de vivienda popular con enfoque comunitario.",
      icon: <FaHouseUser size={30} />,
      component: "IPVC"
    },
    {
      id: 10,
      title: "Carteles Publicitarios",
      text: "Diseño, cálculo y ejecución de estructuras para publicidad exterior y señalética.",
      icon: <FaAd size={30} />,
      component: "CartelPublicitarioC"
    },
    {
      id: 11,
      title: "Tareas con tasa fija",
      text: "Servicios específicos con precios establecidos para mayor transparencia y previsibilidad.",
      icon: <FaMoneyBillAlt size={30} />,
      component: "TareasTasaFijaC"
    },
    {
      id: 12,
      title: "Servicios Premium",
      text: "Soluciones exclusivas y personalizadas para clients que buscan el máximo nivel de calidad.",
      icon: <FaStar size={30} />,
      component: "ServiciosPremiumC"
    }
  ];

  return (
    <Container className="my-5 cards-container">
      {/* Header con botón de volver */}
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="outline-primary" 
          onClick={onBack}
          className="d-flex align-items-center me-3"
        >
          <FaArrowLeft className="me-2" />
          Volver
        </Button>
        <div>
          <h2 className="mb-0 main-title">Simulador de Tasas Retributivas</h2>
          <p className="mb-0 subtitle">
            Modalidad de calculo aprobada por Asamblea Ordinaria
          </p>
        </div>
      </div>
      
      <Row>
        {cardData.map((card) => (
          <Col key={card.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm card-hover">
              <Card.Body className="d-flex flex-column p-4">
                {/* Cabecera con icono y título */}
                <div className="text-center mb-3">
                  <div className="icon-wrapper mx-auto">
                    {card.icon}
                  </div>
                  <Card.Title className="text-center card-title">
                    {card.title}
                  </Card.Title>
                </div>
                
                {/* Texto de la card */}
                <Card.Text className="text-center mb-3 card-text">
                  {card.text}
                </Card.Text>
                
                {/* Botón */}
                <div className="mt-auto text-center">
                  <Button 
                    className="card-button"
                    onClick={() => handleCalculateClick(card.title)}
                  >
                    Calcular
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CardsC;