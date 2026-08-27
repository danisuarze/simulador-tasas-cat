import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './TareasTasaFijaC.css';

const TareasTasaFijaC = ({ onBack, subTarea }) => {
  // Constantes
  const VPTR = 1250;
  
  const tareas = [
    { id: 1, nombre: "CAMBIO DIRECCION TECNICA ENTRE ARQUITECTOS", multiplicador: 50 },
    { id: 2, nombre: "CAMBIO REPRES. TECNICO ENTRE ARQUITECTOS", multiplicador: 50 },
    { id: 3, nombre: "CERTIFICACION DE FIRMA", multiplicador: 20 },
    { id: 4, nombre: "DEMOLICIONES", multiplicador: 50 },
    { id: 5, nombre: "DESVINCULACION / RENUNCIA", multiplicador: 20 },
    { id: 6, nombre: "FACTIBILIDAD DE USO", multiplicador: 20 },
    { id: 7, nombre: "PLENARIO", multiplicador: 20 },
    { id: 8, nombre: "PROPUESTA URBANA", multiplicador: 50 },
    { id: 9, nombre: "PROTECCION DE VIA PUBLICA Y EDIFICIOS LINDEROS", multiplicador: 50 },
    { id: 10, nombre: "RESELLADOS", multiplicador: 20 },
    { id: 11, nombre: "SEGURIDAD E HIGIENE", multiplicador: 50 },
    { id: 12, nombre: "SERVICIO CONTRA INCENDIOS - DEFENSA CIVIL", multiplicador: 50 },
    { id: 13, nombre: "TASA REGISTRO", multiplicador: 20 },
    { id: 14, nombre: "TRABAJOS PRELIMINARES", multiplicador: 200 },
    { id: 15, nombre: "VISADO DOCUMENTACION COMPLEMENTARIA", multiplicador: 20 }
  ];

  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [acordeonAbierto, setAcordeonAbierto] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (subTarea) {
      const tareaEncontrada = tareas.find(t => t.nombre === subTarea);
      if (tareaEncontrada) {
        setTareaSeleccionada(tareaEncontrada);
      }
    }
  }, [subTarea]);

  useEffect(() => {
    if (tareaSeleccionada) {
      const valor = tareaSeleccionada.multiplicador * VPTR;
      setResultado({
        tarea: tareaSeleccionada,
        valor,
        vptrEquivalente: tareaSeleccionada.multiplicador
      });
      setAcordeonAbierto(false);
    } else {
      setResultado(null);
    }
  }, [tareaSeleccionada]);

  const seleccionarOtraTarea = () => {
    setTareaSeleccionada(null);
    setResultado(null);
    setAcordeonAbierto(true);
  };

  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  return (
    <Container fluid className="tareas-tasa-fija-container">
      {/* Imagen */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/tasas_fijas.jpg" 
          alt="Tareas con Tasa Fija"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/tasas_fijas.jpg';
          }}
        />
      </div>

      {/* Títulos */}
      <div className="text-center mb-4">
        <h2 className="main-title">Tareas con Tasa Fija</h2>
        <p className="subtitle">
          Seleccione una tarea para ver su valor
        </p>
      </div>

      {/* Acordeón */}
      <div className="form-card">
        <div className="acordeon-container">
          <div 
            className="acordeon-header"
            onClick={() => setAcordeonAbierto(!acordeonAbierto)}
          >
            <h5 className="acordeon-titulo">
              {tareaSeleccionada ? tareaSeleccionada.nombre : "Selecciona la tarea"}
            </h5>
            {acordeonAbierto ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          
          {acordeonAbierto && (
            <div className="acordeon-body">
              {tareas.map(tarea => (
                <div key={tarea.id} className="tarea-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaSeleccionada"
                    id={`tarea-${tarea.id}`}
                    checked={tareaSeleccionada && tareaSeleccionada.id === tarea.id}
                    onChange={() => setTareaSeleccionada(tarea)}
                  />
                  <label className="form-check-label" htmlFor={`tarea-${tarea.id}`}>
                    {tarea.nombre}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resultados */}
      {resultado && (
        <div className="resultado-card mt-4">
          <h4 className="text-center">Resultado</h4>
          <div className="result-item">
            <strong>Tarea seleccionada:</strong>
            <div className="tarea-nombre-resultado">{resultado.tarea.nombre}</div>
          </div>

          <div className="info-adicional">
            <div className="info-row">
              <span className="info-label">Equivalente en VPTR:</span>
              <strong className="info-value">{resultado.vptrEquivalente} VPTR</strong>
            </div>
            <div className="info-row">
              <span className="info-label">Valor de cada VPTR:</span>
              <strong className="info-value">{formatoMoneda(VPTR)}</strong>
            </div>
          </div>

          <div className="resultado-final">
            <div className="resultado-final-titulo">Valor de la Tarea</div>
            <div className="resultado-final-valor">{formatoMoneda(resultado.valor)}</div>
          </div>

          <div className="text-center mt-4">
            <button 
              className="calculate-button"
              onClick={seleccionarOtraTarea}
            >
              Seleccionar otra tarea
            </button>
          </div>

          <div className="mt-4 pt-3 border-top">
            <Button 
              onClick={onBack}
              className="back-button-custom d-inline-flex align-items-center justify-content-center w-100"
            >
              <FaArrowLeft className="me-2" />
              Volver al Menú Principal
            </Button>
          </div>
        </div>
      )}

      {!resultado && !acordeonAbierto && (
        <div className="resultado-card mt-4">
          <p className="text-center text-muted">
            Haga clic en "Selecciona la tarea" para elegir una tarea y ver su valor
          </p>
          <div className="mt-4 pt-3 border-top">
            <Button 
              onClick={onBack}
              className="back-button-custom d-inline-flex align-items-center justify-content-center w-100"
            >
              <FaArrowLeft className="me-2" />
              Volver al Menú Principal
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default TareasTasaFijaC;