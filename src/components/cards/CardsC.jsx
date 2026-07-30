import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import ViviendaUnifamiliarC from '../viviendaUnifamiliar/ViviendaUnifamiliarC';
import EdificiosAlturaC from '../edificiosAltura/EdificiosAlturaC';
import EdificiosEspecialesC from '../edificiosEspeciales/EdificiosEspecialesC';
import EdificiosIndustrialesC from '../edificiosIndustriales/EdificiosIndustrialesC';
import ExterioresNoCubiertosC from '../exterioresNoCubiertos/ExterioresNoCubiertosC';
import InstalacionesEstructurasC from '../instalacionesEstructuras/InstalacionesEstructurasC';
import EstudioPropuestaC from '../estudioPropuesta/EstudioPropuestaC';
import RepresentacionTecnicaC from '../representacionTecnica/RepresentacionTecnicaC';
import CartelPublicitarioC from '../cartelPublicitario/CartelPublicItarioC';
import TareasTasaFijaC from '../tareasTasaFija/TareasTasaFijaC';
import ViviendasIPVC from '../viviendasIPV/ViviendasIPVC';
import "./CardsC.css";

const CardsC = ({ onBack }) => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSubSelect, setShowSubSelect] = useState(false);

  const handleCalculateClick = (componentName, subOption = null) => {
    setSelectedSubOption(subOption);
    setActiveComponent(componentName);
  };

  const handleBackToCards = () => {
    setActiveComponent(null);
    setSelectedSubOption(null);
    setSearchValue('');
    setShowSubSelect(false);
  };

  const handleAccesoAutogestion = () => {
    window.open('https://autogestion.catonline.org.ar/catautogestion.html', '_blank', 'noopener noreferrer');
  };

  const componentMap = {
    'Vivienda Unifamiliar': 'ViviendaUnifamiliarC',
    'Edificios en Altura': 'EdificiosAlturaC',
    'Edificios Especiales': 'EdificiosEspecialesC',
    'Edificios Industriales': 'EdificiosIndustrialesC',
    'Exteriores no cubiertos': 'ExterioresNoCubiertosC',
    'Instalaciones | Estructuras': 'InstalacionesEstructurasC',
    'Estudio de la propuesta': 'EstudioPropuestaC',
    'Representación Técnica': 'RepresentacionTecnicaC',
    'Viviendas IPV': 'ViviendasIPVC',
    'Carteles Publicitarios': 'CartelPublicitarioC',
    'Tareas con tasa fija': 'TareasTasaFijaC'
  };

  const subOptions = [
    'CAMBIO DIRECCION TECNICA ENTRE ARQUITECTOS',
    'CAMBIO REPRES. TECNICO ENTRE ARQUITECTOS',
    'CERTIFICACION DE FIRMA',
    'DEMOLICIONES',
    'DESVINCULACION / RENUNCIA',
    'FACTIBILIDAD DE USO',
    'PLENARIO',
    'PROPUESTA URBANA',
    'PROTECCION DE VIA PUBLICA Y EDIFICIOS LINDEROS',
    'RESELLADOS',
    'SEGURIDAD E HIGIENE',
    'SERVICIO CONTRA INCENDIOS - DEFENSA CIVIL',
    'TASA REGISTRO',
    'TRABAJOS PRELIMINARES',
    'VISADO DOCUMENTACION COMPLEMENTARIA'
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value === 'Tareas con tasa fija') {
      setShowSubSelect(true);
      setActiveComponent(null);
      setSelectedSubOption(null);
    } else if (value === '') {
      setShowSubSelect(false);
      setActiveComponent(null);
    } else {
      setShowSubSelect(false);
      const comp = componentMap[value];
      if (comp) {
        handleCalculateClick(comp);
      }
    }
  };

  const handleSubSearchChange = (e) => {
    const subValue = e.target.value;
    if (subValue) {
      handleCalculateClick('TareasTasaFijaC', subValue);
    }
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
      'TareasTasaFijaC': <TareasTasaFijaC onBack={handleBackToCards} subTarea={selectedSubOption} />,
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

  if (activeComponent) {
    return renderActiveComponent();
  }

  // ===== COMPONENTES DE IMAGEN =====
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

  // ===== CARD DATA (DEFINIDA AQUÍ) =====
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
    <Container className="mt-2 mb-4 cards-container" style={{ position: 'relative', zIndex: 1000, backgroundColor: '#111B4D', paddingTop: '0.5rem', paddingBottom: '2rem', borderRadius: '8px' }}>
      
      <div className="text-center mb-2">
        <Button onClick={onBack} variant="secondary" className="mb-1">
          <FaArrowLeft className="me-2" /> Volver al inicio
        </Button>
      </div>

      {/* Buscador */}
      <div className="buscador-container" style={{ backgroundColor: '#1e2a5e', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <FaSearch size={24} color="#ffffff" />
          <span style={{ color: '#ffffff', fontWeight: '500', marginRight: '0.5rem' }}>
            ¿Qué tasa retributiva buscas calcular?
          </span>
          <Form.Select
            value={searchValue}
            onChange={handleSearchChange}
            style={{ flex: '1 1 250px', minWidth: '200px', backgroundColor: '#f0f4ff', borderRadius: '30px' }}
          >
            <option value="">Selecciona una opción...</option>
            {Object.keys(componentMap).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
          {showSubSelect && (
            <Form.Select
              value=""
              onChange={handleSubSearchChange}
              style={{ flex: '1 1 300px', minWidth: '200px', backgroundColor: '#f0f4ff', borderRadius: '30px', marginTop: '0.5rem' }}
            >
              <option value="">Selecciona una tarea con tasa fija...</option>
              {subOptions.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </Form.Select>
          )}
        </div>
        {showSubSelect && (
          <div style={{ color: '#aac9ff', fontSize: '0.8rem', marginTop: '0.3rem', paddingLeft: '2.2rem' }}>
            * Selecciona una tarea para calcular su honorario
          </div>
        )}
      </div>

      <div className="text-center mb-3">
        <h2 className="main-title-cards">Simulador de Tasas Retributivas</h2>
        <p className="subtitle-cards">Modalidad de calculo aprobada por Asamblea Ordinaria</p>
      </div>

      <Row className="justify-content-center">
        {cardData.map(card => (
          <Col key={card.id} xs={12} sm={6} md={6} lg={4} className="d-flex justify-content-center mb-4">
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