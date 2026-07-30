import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ViviendaUnifamiliarC from '../viviendaUnifamiliar/ViviendaUnifamiliarC';
import './AcordeonC.css';
import EdificiosAlturaC from '../edificiosAltura/EdificiosAlturaC';

const AcordeonC = () => {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen className="custom-accordion">
      <Accordion.Item eventKey="0" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-home"></i>
            Vivienda Unifamiliar
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <ViviendaUnifamiliarC />
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="1" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-building"></i>
            Edificios en altura
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <EdificiosAlturaC />
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="2" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-store"></i>
            Edificios Especiales
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Edificios Especiales</h5>
            <p className="mb-3">Comerciales - Oficinas - Viviendas colectivas</p>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="3" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-industry"></i>
            Edificios industriales
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Edificios Industriales</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="4" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-tree"></i>
            Exteriores no cubiertos
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Exteriores no cubiertos</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="5" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-cogs"></i>
            Instalaciones - Estructuras
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Instalaciones - Estructuras</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="6" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-house-user"></i>
            IPV
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>IPV</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="7" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-ad"></i>
            Carteles Publicitarios
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Carteles Publicitarios</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="8" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-file-contract"></i>
            Estudio de la propuesta (Licitaciones)
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Estudio de la propuesta (Licitaciones)</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="9" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-drafting-compass"></i>
            Representaciones técnicas
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Representaciones técnicas</h5>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
      
      <Accordion.Item eventKey="10" className="accordion-item-custom">
        <Accordion.Header className="accordion-header-custom">
          <div className="accordion-title">
            <i className="accordion-icon fas fa-exchange-alt"></i>
            Cambio de representante técnico
          </div>
        </Accordion.Header>
        <Accordion.Body className="accordion-body-custom">
          <div className="text-center p-4">
            <h5>Cambio de representante técnico</h5>
            <p>Entre diferentes profesiones</p>
            <p className="text-muted">Componente en desarrollo</p>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default AcordeonC;