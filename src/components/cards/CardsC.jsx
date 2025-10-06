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
import ViviendaPropiaC from '../viviendaPropia/ViviendaPropiaC'; // ✅ Importación agregada
import EdificiosAlturaC from '../edificiosAltura/EdificiosAlturaC';
import EdificiosEspecialesC from '../edificiosEspeciales/EdificiosEspecialesC';
import EdificiosIndustrialesC from '../edificiosIndustriales/EdificiosIndustrialesC';
import ExterioresNoCubiertosC from '../exterioresNoCubiertos/ExterioresNoCubiertosC';
import InstalacionesEstructurasC from '../instalacionesEstructuras/InstalacionesEstructurasC';
import EstudioPropuestaC from '../estudioPropuesta/EstudioPropuestaC';
import RepresentacionTecnicaC from '../representacionTecnica/RepresentacionTecnicaC';
import CartelPublicitarioC from '../cartelPublicitario/CartelPublicitarioC';
import TareasTasaFijaC from '../tareasTasaFija/TareasTasaFijaC';
import "./CardsC.css"

const CardsC = ({ onBack }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleCalculateClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleBackToCards = () => {
    setActiveComponent(null);
  };

  // Renderizar componente activo
  const renderActiveComponent = () => {
    const components = {
      'ViviendaUnifamiliarC': <ViviendaUnifamiliarC onBack={handleBackToCards} />,
      'ViviendaPropiaC': <ViviendaPropiaC onBack={handleBackToCards} />, // ✅ Reemplazado el placeholder
      'EdificiosAlturaC': <EdificiosAlturaC onBack={handleBackToCards} />,
      'EdificiosEspecialesC': <EdificiosEspecialesC onBack={handleBackToCards} />,
      'EdificiosIndustrialesC': <EdificiosIndustrialesC onBack={handleBackToCards} />,
      'ExterioresNoCubiertosC': <ExterioresNoCubiertosC onBack={handleBackToCards} />,
      'InstalacionesEstructurasC': <InstalacionesEstructurasC onBack={handleBackToCards} />,
      'EstudioPropuestaC': <EstudioPropuestaC onBack={handleBackToCards} />,
      'RepresentacionTecnicaC': <RepresentacionTecnicaC onBack={handleBackToCards} />,
      'CartelPublicitarioC': <CartelPublicitarioC onBack={handleBackToCards} />,
      'TareasTasaFijaC': <TareasTasaFijaC onBack={handleBackToCards} />,
      'IPVC': (
        <Container style={{ 
          minHeight: '100vh',
          padding: '20px',
          position: 'relative',
          zIndex: 1000
        }}>
          <div className="text-center mb-4">
            <Button 
              onClick={handleBackToCards}
              className="mb-3"
              style={{ position: 'relative', zIndex: 1001 }}
            >
              <FaArrowLeft className="me-2" />
              Volver a Cards
            </Button>
            <div>
              <h1 style={{ color: '#343a40' }}>IPV</h1>
              <p className="text-muted">Componente en desarrollo</p>
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '15px'
          }}>
            <h3>🚧 Componente IPV en construcción</h3>
            <p>Este componente estará disponible próximamente</p>
            <Button onClick={handleBackToCards} variant="primary">
              Volver al Menú Principal
            </Button>
          </div>
        </Container>
      ),
      'ServiciosPremiumC': (
        <Container style={{ 
          minHeight: '100vh',
          padding: '20px',
          position: 'relative',
          zIndex: 1000
        }}>
          <div className="text-center mb-4">
            <Button 
              onClick={handleBackToCards}
              className="mb-3"
              style={{ position: 'relative', zIndex: 1001 }}
            >
              <FaArrowLeft className="me-2" />
              Volver a Cards
            </Button>
            <div>
              <h1 style={{ color: '#ff6b6b' }}>Servicios Premium</h1>
              <p className="text-muted">Componente en desarrollo</p>
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            backgroundColor: '#fff5f5',
            borderRadius: '15px'
          }}>
            <h3>🚧 Componente Servicios Premium en construcción</h3>
            <p>Este componente estará disponible próximamente</p>
            <Button onClick={handleBackToCards} variant="primary">
              Volver al Menú Principal
            </Button>
          </div>
        </Container>
      )
    };

    return components[activeComponent] || (
      <Container style={{ 
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
        zIndex: 1000
      }}>
        <div className="text-center mb-4">
          <Button 
            onClick={handleBackToCards}
            className="mb-3"
            style={{ position: 'relative', zIndex: 1001 }}
          >
            <FaArrowLeft className="me-2" />
            Volver a Cards
          </Button>
          <div>
            <h1 style={{ color: '#dc3545' }}>Componente no encontrado</h1>
            <p className="text-muted">Error: {activeComponent}</p>
          </div>
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          backgroundColor: '#f8d7da',
          borderRadius: '15px'
        }}>
          <h3>❌ Error al cargar el componente</h3>
          <p>El componente <strong>{activeComponent}</strong> no pudo ser cargado.</p>
          <Button onClick={handleBackToCards} variant="danger">
            Volver al Menú Principal
          </Button>
        </div>
      </Container>
    );
  };

  // Si hay componente activo, renderizarlo
  if (activeComponent) {
    return renderActiveComponent();
  }

  // Datos de las cards
  const cardData = [
    {
      id: 1,
      title: "Vivienda Unifamiliar",
      text: "Viviendas individuales por contratación de terceros o para destino comercial",
      icon: <FaHome size={30} />,
      component: "ViviendaUnifamiliarC"
    },
    {
      id: 2,
      title: "Vivienda Propia",
      text: "Vivienda única del profesional para uso de residencia personal",
      icon: (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <FaHome size={24} style={{ position: 'relative', zIndex: 2 }} />
          <FaHouseUser 
            size={16} 
            style={{ 
              position: 'absolute', 
              bottom: -5, 
              right: -5, 
              zIndex: 3,
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '2px'
            }} 
          />
        </div>
      ),
      component: "ViviendaPropiaC"
    },
    {
      id: 3,
      title: "Edificios en Altura",
      text: "Que supere planta baja y 2 niveles | No se considera uso | No se considera como nivel al subsuelo",
      icon: <FaBuilding size={30} />,
      component: "EdificiosAlturaC"
    },
    {
      id: 4,
      title: "Edificios Especiales",
      text: "Locales comerciales | Viviendas colectivas | Oficinas y/o cualquier uso excepto viv. unifamiliar | Que no supere Pb. y 2 niveles sin considerar subsuelo",
      icon: <FaHospital size={30} />,
      component: "EdificiosEspecialesC"
    },
    {
      id: 5,
      title: "Edificios Industriales",
      text: "Espacios industriales funcionales y seguros adaptados a procesos productivos específicos.",
      icon: <FaIndustry size={30} />,
      component: "EdificiosIndustrialesC"
    },
    {
      id: 6,
      title: "Exteriores no cubiertos",
      text: "Diseño de áreas exteriores, plazas, parques y espacios abiertos con enfoque estético y funcional.",
      icon: <FaTree size={30} />,
      component: "ExterioresNoCubiertosC"
    },
    {
      id: 7,
      title: "Instalaciones | Estructuras",
      text: "Sistemas estructurales e instalaciones especializadas para todo tipo de construcciones.",
      icon: <FaCogs size={30} />,
      component: "InstalacionesEstructurasC"
    },
    {
      id: 8,
      title: "Estudio de la propuesta",
      text: "Análisis detallado de viabilidad y desarrollo conceptual de proyectos arquitectónicos.",
      icon: <FaClipboardCheck size={30} />,
      component: "EstudioPropuestaC"
    },
    {
      id: 9,
      title: "Representación Técnica",
      text: "Elaboración de planos, maquetas y visualizaciones para presentación de proyectos.",
      icon: <FaDraftingCompass size={30} />,
      component: "RepresentacionTecnicaC"
    },
    {
      id: 10,
      title: "IPV",
      text: "Soluciones de vivienda social y planes de vivienda popular con enfoque comunitario.",
      icon: <FaHouseUser size={30} />,
      component: "IPVC"
    },
    {
      id: 11,
      title: "Carteles Publicitarios",
      text: "Diseño, cálculo y ejecución de estructuras para publicidad exterior y señalética.",
      icon: <FaAd size={30} />,
      component: "CartelPublicitarioC"
    },
    {
      id: 12,
      title: "Tareas con tasa fija",
      text: "Servicios específicos con precios establecidos para mayor transparencia y previsibilidad.",
      icon: <FaMoneyBillAlt size={30} />,
      component: "TareasTasaFijaC"
    },
    {
      id: 13,
      title: "Servicios Premium",
      text: "Soluciones exclusivas y personalizadas para clients que buscan el máximo nivel de calidad.",
      icon: <FaStar size={30} />,
      component: "ServiciosPremiumC"
    }
  ];

  return (
    <Container className="my-5" style={{ 
      position: 'relative',
      zIndex: 1000
    }}>
      {/* Header */}
      <div className="text-center mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <Button 
          onClick={onBack}
          className="mb-3"
          style={{ position: 'relative', zIndex: 1002 }}
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
            <Card className="h-100 shadow-sm card-hover" style={{ 
              position: 'relative',
              zIndex: 1001
            }}>
              <Card.Body className="d-flex flex-column p-4" style={{ position: 'relative', zIndex: 1002 }}>
                <div className="text-center mb-3">
                  <div className="icon-wrapper mx-auto">
                    {card.icon}
                  </div>
                  <Card.Title className="text-center card-title">
                    {card.title}
                  </Card.Title>
                </div>
                
                <Card.Text className="text-center mb-3 card-text">
                  {card.text}
                </Card.Text>
                
                <div className="mt-auto text-center">
                  <Button 
                    className="card-button"
                    onClick={() => handleCalculateClick(card.component)}
                    style={{ 
                      position: 'relative',
                      zIndex: 1003
                    }}
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