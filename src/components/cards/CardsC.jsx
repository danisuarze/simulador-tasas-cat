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
import CartelPublicitarioC from '../CartelPublicitario/CartelPublicitarioC';
import TareasTasaFijaC from '../tareasTasaFija/TareasTasaFijaC';
import ViviendasIPVC from '../viviendasIPV/ViviendasIPVC';
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
      'EdificiosAlturaC': <EdificiosAlturaC onBack={handleBackToCards} />,
      'EdificiosEspecialesC': <EdificiosEspecialesC onBack={handleBackToCards} />,
      'EdificiosIndustrialesC': <EdificiosIndustrialesC onBack={handleBackToCards} />,
      'ExterioresNoCubiertosC': <ExterioresNoCubiertosC onBack={handleBackToCards} />,
      'InstalacionesEstructurasC': <InstalacionesEstructurasC onBack={handleBackToCards} />,
      'EstudioPropuestaC': <EstudioPropuestaC onBack={handleBackToCards} />,
      'RepresentacionTecnicaC': <RepresentacionTecnicaC onBack={handleBackToCards} />,
      'CartelPublicitarioC': <CartelPublicitarioC onBack={handleBackToCards} />,
      'TareasTasaFijaC': <TareasTasaFijaC onBack={handleBackToCards} />,
      'ViviendasIPVC': <ViviendasIPVC onBack={handleBackToCards} />,
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

  // Componente de imagen para cards
  const ViviendaImage = () => (
    <img 
      src="/images/vivienda.jpg" 
      alt="Vivienda Unifamiliar"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const EdificiosAlturaImage = () => (
    <img 
      src="/images/edificios_altura.jpg" 
      alt="Edificios en Altura"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const EdificiosEspecialesImage = () => (
    <img 
      src="/images/edificios_especiales.jpg" 
      alt="Edificios Especiales"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const EdificiosIndustrialesImage = () => (
    <img 
      src="/images/edificios_industriales.jpg" 
      alt="Edificios Industriales"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const ExterioresImage = () => (
    <img 
      src="/images/exteriores.jpg" 
      alt="Exteriores No Cubiertos"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const InstalacionesImage = () => (
    <img 
      src="/images/instalaciones.jpg" 
      alt="Instalaciones y Estructuras"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const EstudioPropuestaImage = () => (
    <img 
      src="/images/estudio_propuesta.jpg" 
      alt="Estudio de la Propuesta"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const RepresentacionTecnicaImage = () => (
    <img 
      src="/images/representacion_tecnica.jpg" 
      alt="Representación Técnica"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const ViviendasIPVImage = () => (
    <img 
      src="/images/viviendas_ipv.jpg" 
      alt="Viviendas IPV"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const CartelPublicitarioImage = () => (
    <img 
      src="/images/carteles_publicitarios.png" 
      alt="Carteles Publicitarios"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  const TareasTasaFijaImage = () => (
    <img 
      src="/images/tasas_fijas.jpg" 
      alt="Tareas con tasa fija"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );

  // Datos de las cards
  const cardData = [
    {
      id: 1,
      title: "Vivienda Unifamiliar",
      text: "Viviendas individuales",
      icon: <ViviendaImage />,
      component: "ViviendaUnifamiliarC",
      isImage: true
    },
    {
      id: 2,
      title: "Edificios en Altura",
      text: "Que supere planta baja y 2 niveles | No se considera uso | No se considera como nivel al subsuelo",
      icon: <EdificiosAlturaImage />,
      component: "EdificiosAlturaC",
      isImage: true
    },
    {
      id: 3,
      title: "Edificios Especiales",
      text: "Locales comerciales | Viviendas colectivas | Oficinas y/o cualquier uso excepto viv. unifamiliar | Que no supere Pb. y 2 niveles sin considerar subsuelo",
      icon: <EdificiosEspecialesImage />,
      component: "EdificiosEspecialesC",
      isImage: true
    },
    {
      id: 4,
      title: "Edificios Industriales",
      text: "Espacios industriales funcionales y seguros adaptados a procesos productivos específicos.",
      icon: <EdificiosIndustrialesImage />,
      component: "EdificiosIndustrialesC",
      isImage: true
    },
    {
      id: 5,
      title: "Exteriores no cubiertos",
      text: "Diseño de áreas exteriores, plazas, parques y espacios abiertos con enfoque estético y funcional.",
      icon: <ExterioresImage />,
      component: "ExterioresNoCubiertosC",
      isImage: true
    },
    {
      id: 6,
      title: "Instalaciones | Estructuras",
      text: "Sistemas estructurales e instalaciones especializadas para todo tipo de construcciones.",
      icon: <InstalacionesImage />,
      component: "InstalacionesEstructurasC",
      isImage: true
    },
    {
      id: 7,
      title: "Estudio de la propuesta",
      text: "Análisis detallado de viabilidad y desarrollo conceptual de proyectos arquitectónicos.",
      icon: <EstudioPropuestaImage />,
      component: "EstudioPropuestaC",
      isImage: true
    },
    {
      id: 8,
      title: "Representación Técnica",
      text: "Elaboración de planos, maquetas y visualizaciones para presentación de proyectos.",
      icon: <RepresentacionTecnicaImage />,
      component: "RepresentacionTecnicaC",
      isImage: true
    },
    {
      id: 9,
      title: "Viviendas IPV",
      text: "Soluciones de vivienda social y planes de vivienda popular con enfoque comunitario.",
      icon: <ViviendasIPVImage />,
      component: "ViviendasIPVC",
      isImage: true
    },
    {
      id: 10,
      title: "Carteles Publicitarios",
      text: "Diseño, cálculo y ejecución de estructuras para publicidad exterior y señalética.",
      icon: <CartelPublicitarioImage />,
      component: "CartelPublicitarioC",
      isImage: true
    },
    {
      id: 11,
      title: "Tareas con tasa fija",
      text: "Servicios específicos con precios establecidos para mayor transparencia y previsibilidad.",
      icon: <TareasTasaFijaImage />,
      component: "TareasTasaFijaC",
      isImage: true
    },
    {
      id: 12,
      title: "Servicios Premium",
      text: "Soluciones exclusivas y personalizadas para clients que buscan el máximo nivel de calidad.",
      icon: <FaStar size={30} />,
      component: "ServiciosPremiumC",
      isImage: false
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
              zIndex: 1001,
              overflow: 'hidden'
            }}>
              {/* Imagen/Icono - ARRIBA (dentro del Card, fuera del Card.Body) */}
              <div className={`card-media-container ${card.isImage ? 'image-container' : 'icon-container'}`}>
                {card.icon}
              </div>
              
              {/* Contenido textual - ABAJO */}
              <div className="card-body-content">
                <h3 className="text-center card-title">
                  {card.title}
                </h3>
                
                <p className="text-center card-text">
                  {card.text}
                </p>
                
                <div className="text-center">
                  <Button 
                    className="card-button"
                    onClick={() => handleCalculateClick(card.component)}
                  >
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
}

export default CardsC;