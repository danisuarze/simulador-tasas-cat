import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './EstudioPropuestaC.css';

const EstudioPropuestaC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000

  // Estados
  const [montoObra, setMontoObra] = useState('');
  const [resultados, setResultados] = useState(null);

  // Efecto para hacer scroll al inicio
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Efecto para limpiar resultados cuando cambia el monto
  useEffect(() => {
    setResultados(null);
  }, [montoObra]);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular resultados
  const calcularEstudioPropuesta = () => {
    const monto = parseFloat(montoObra) || 0;
    
    if (monto <= 0) {
      setResultados({
        error: "Por favor, ingrese un monto válido para la licitación."
      });
      return;
    }

    let html = [];
    
    html.push({ label: "Monto de Licitación", value: formatoMoneda(monto) });
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    
    let tasaRetributiva = 0;
    let descripcionServicio = "Estudio de la propuesta";
    let rangoAplicado = "";

    // Definir los límites
    const limite1 = 10000 * VPTR;
    const limite2 = 100000 * VPTR;
    const limite3 = 1000000 * VPTR;

    // Calcular según los rangos especificados
    if (monto <= limite1) {
      // Monto menor a 10,000*VPTR -> Tasa mínima
      tasaRetributiva = TASA_MINIMA;
      rangoAplicado = `Monto ≤ ${formatoMoneda(limite1)}`;
    } else if (monto > limite1 && monto <= limite2) {
      // Monto entre 10,000*VPTR y 100,000*VPTR -> 0.03%
      tasaRetributiva = monto * 0.0003; // 0.03%
      rangoAplicado = `${formatoMoneda(limite1)} < Monto ≤ ${formatoMoneda(limite2)}`;
    } else if (monto > limite2 && monto <= limite3) {
      // Monto entre 100,000*VPTR y 1,000,000*VPTR -> 0.02%
      tasaRetributiva = monto * 0.0002; // 0.02%
      rangoAplicado = `${formatoMoneda(limite2)} < Monto ≤ ${formatoMoneda(limite3)}`;
    } else {
      // Monto mayor a 1,000,000*VPTR -> 0.01%
      tasaRetributiva = monto * 0.0001; // 0.01%
      rangoAplicado = `Monto > ${formatoMoneda(limite3)}`;
    }

    html.push({ label: "Rango aplicado", value: rangoAplicado });

    // Aplicar tasa mínima si el cálculo es menor (solo para los casos de porcentaje)
    if (monto > limite1 && tasaRetributiva < TASA_MINIMA) {
      tasaRetributiva = TASA_MINIMA;
    }

    setResultados({
      html,
      tasaRetributiva,
      descripcionServicio
    });
  };

  return (
    <Container fluid className="estudio-propuesta-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/estudio_propuesta.jpg" 
          alt="Estudio de Propuesta"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/estudio_propuesta.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Estudio de Propuesta</h2>
        <p className="subtitle">
          Ingrese el monto de la licitación y presione calcular.
        </p>
      </div>

      {/* Formulario - UNA SOLA COLUMNA */}
      <div className="form-card">
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="montoObraEstudioPropuesta" className="form-label">
                Monto de Licitación ($)
              </label>
              <input 
                type="number" 
                className="form-control" 
                id="montoObraEstudioPropuesta" 
                placeholder="Ingrese el monto de la licitación" 
                min="0"
                step="0.01"
                value={montoObra}
                onChange={(e) => setMontoObra(e.target.value)}
              />
            </div>
            
            {/* Botón Calcular (verde, ancho completo) */}
            <div className="d-grid">
              <button 
                className="calculate-button" 
                onClick={calcularEstudioPropuesta}
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Estudio de Propuesta</h4>
        {resultados ? (
          resultados.error ? (
            <div className="alert alert-warning text-center">
              {resultados.error}
            </div>
          ) : (
            <div id="resultadosEstudioPropuesta">
              {resultados.html.map((item, index) => (
                <div key={index} className="result-item">
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
              
              <hr />
              
              <div className="resultado-final">
                <div className="resultado-final-titulo">Tasa Retributiva Final</div>
                <div className="resultado-final-valor">{formatoMoneda(resultados.tasaRetributiva)}</div>
                <div className="resultado-final-descripcion">{resultados.descripcionServicio}</div>
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
          )
        ) : (
          <div>
            <p className="text-center text-muted">
              Ingrese el monto de la licitación y haga clic en calcular para ver los resultados
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
      </div>
    </Container>
  );
};

export default EstudioPropuestaC;