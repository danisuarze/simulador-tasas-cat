import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaArrowLeft } from 'react-icons/fa';
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

  const handleAccesoAutogestion = () => {
    window.open('https://autogestion.catonline.org.ar/catautogestion.html', '_blank', 'noopener noreferrer');
  };

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
      'ViviendasIPVC': <ViviendasIPVC onBack={handleBackToCards} />
    };

    return components[activeComponent] || (
      <Container style={{ minHeight: '100vh', padding: '20px', position: 'relative', zIndex: 1000 }}>
        <div className="text-center mb-4">
          <Button onClick={handleBackToCards} className="mb-3">
            <FaArrowLeft className="me-2" /> Volver
          </Button>
          <div>
            <h1 style={{ color: '#dc3545' }}>Componente no encontrado</h1>
          </div>
        </div>
      </Container>
    );
  };

  if (activeComponent && activeComponent !== 'AccesoAutogestionExterno') {
    return renderActiveComponent();
  }

  // Componentes de imagen (exactamente como antes)
  const ViviendaImage = () => <img src="/images/vivienda.jpg" alt="Vivienda" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const EdificiosAlturaImage = () => <img src="/images/edificios_altura.jpg" alt="Altura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const EdificiosEspecialesImage = () => <img src="/images/edificios_especiales.jpg" alt="Especiales" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const EdificiosIndustrialesImage = () => <img src="/images/edificios_industriales.jpg" alt="Industriales" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const ExterioresImage = () => <img src="/images/exteriores.jpg" alt="Exteriores" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const InstalacionesImage = () => <img src="/images/instalaciones.jpg" alt="Instalaciones" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const EstudioPropuestaImage = () => <img src="/images/estudio_propuesta.jpg" alt="Estudio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const RepresentacionTecnicaImage = () => <img src="/images/representacion_tecnica.jpg" alt="Representación" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const ViviendasIPVImage = () => <img src="/images/viviendas_ipv.jpg" alt="IPV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const CartelPublicitarioImage = () => <img src="/images/carteles_publicitarios.png" alt="Cartel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const TareasTasaFijaImage = () => <img src="/images/tasas_fijas.jpg" alt="Tasa fija" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const AccesoAutogestionImage = () => <img src="/images/acceso_autogestion.png" alt="Autogestión" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;

  const cardData = [
    { id:1, title:"Vivienda Unifamiliar", text:"Viviendas individuales", icon:<ViviendaImage />, component:"ViviendaUnifamiliarC", buttonText:"Calcular" },
    { id:2, title:"Edificios en Altura", text:"Que supere planta baja y 2 niveles...", icon:<EdificiosAlturaImage />, component:"EdificiosAlturaC", buttonText:"Calcular" },
    { id:3, title:"Edificios Especiales", text:"Locales comerciales, oficinas...", icon:<EdificiosEspecialesImage />, component:"EdificiosEspecialesC", buttonText:"Calcular" },
    { id:4, title:"Edificios Industriales", text:"Espacios industriales...", icon:<EdificiosIndustrialesImage />, component:"EdificiosIndustrialesC", buttonText:"Calcular" },
    { id:5, title:"Exteriores no cubiertos", text:"Diseño de áreas exteriores...", icon:<ExterioresImage />, component:"ExterioresNoCubiertosC", buttonText:"Calcular" },
    { id:6, title:"Instalaciones | Estructuras", text:"Sistemas estructurales...", icon:<InstalacionesImage />, component:"InstalacionesEstructurasC", buttonText:"Calcular" },
    { id:7, title:"Estudio de la propuesta", text:"Análisis de viabilidad...", icon:<EstudioPropuestaImage />, component:"EstudioPropuestaC", buttonText:"Calcular" },
    { id:8, title:"Representación Técnica", text:"Elaboración de planos...", icon:<RepresentacionTecnicaImage />, component:"RepresentacionTecnicaC", buttonText:"Calcular" },
    { id:9, title:"Viviendas IPV", text:"Soluciones de vivienda social...", icon:<ViviendasIPVImage />, component:"ViviendasIPVC", buttonText:"Calcular" },
    { id:10, title:"Carteles Publicitarios", text:"Diseño, cálculo y ejecución...", icon:<CartelPublicitarioImage />, component:"CartelPublicitarioC", buttonText:"Calcular" },
    { id:11, title:"Tareas con tasa fija", text:"Servicios con precios establecidos...", icon:<TareasTasaFijaImage />, component:"TareasTasaFijaC", buttonText:"Calcular" },
    { id:12, title:"Acceso a Autogestión", text:"Acceso al sistema digital de autogestión del CAT", icon:<AccesoAutogestionImage />, component:"AccesoAutogestionExterno", buttonText:"Acceder", externalLink:true }
  ];

  return (
    <Container className="my-5" style={{ position: 'relative', zIndex: 1000 }}>
      <div className="text-center mb-4">
        <Button onClick={onBack} className="mb-3"><FaArrowLeft className="me-2" /> Volver</Button>
        <h2 className="mb-0 main-title">Simulador de Tasas Retributivas</h2>
        <p className="mb-0 subtitle">Modalidad de calculo aprobada por Asamblea Ordinaria</p>
      </div>
      <Row>
        {cardData.map(card => (
          <Col key={card.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm card-hover">
              <div className="card-media-container image-container">
                {card.icon}
              </div>
              <div className="card-body-content">
                <h3 className="text-center card-title">{card.title}</h3>
                <p className="text-center card-text">{card.text}</p>
                <div className="text-center">
                  <Button className="card-button" onClick={() => card.externalLink ? handleAccesoAutogestion() : handleCalculateClick(card.component)}>
                    {card.buttonText}
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

export default CardsC;