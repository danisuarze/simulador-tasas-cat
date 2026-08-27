import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './RepresentacionTecnicaC.css';

const RepresentacionTecnicaC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000

  // Estados
  const [montoObra, setMontoObra] = useState('');
  const [avanceObra, setAvanceObra] = useState('');
  const [resultados, setResultados] = useState(null);

  // Efecto para scroll al inicio
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Efecto para limpiar resultados
  useEffect(() => {
    setResultados(null);
  }, [montoObra, avanceObra]);

  // Formateador
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Cálculo
  const calcularRepresentacionTecnica = () => {
    const monto = parseFloat(montoObra) || 0;
    const avance = parseFloat(avanceObra) || 0;
    
    if (monto <= 0) {
      setResultados({ error: "Por favor, ingrese un monto válido para la licitación." });
      return;
    }

    if (avance < 0 || avance > 100) {
      setResultados({ error: "Por favor, ingrese un porcentaje de avance válido (0-100%)." });
      return;
    }

    let html = [];
    html.push({ label: "Monto de Licitación", value: formatoMoneda(monto) });
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    if (avance > 0) html.push({ label: "% Avance de Obra", value: `${avance}%` });

    const limite1 = 10000 * VPTR;
    const limite2 = 100000 * VPTR;
    const limite3 = 1000000 * VPTR;

    let tasaBase = 0;
    let rangoAplicado = "";

    if (monto <= limite1) {
      tasaBase = monto * 0.004;
      rangoAplicado = `Monto ≤ ${formatoMoneda(limite1)}`;
    } else if (monto > limite1 && monto <= limite2) {
      tasaBase = monto * 0.002;
      rangoAplicado = `${formatoMoneda(limite1)} < Monto ≤ ${formatoMoneda(limite2)}`;
    } else if (monto > limite2 && monto <= limite3) {
      tasaBase = monto * 0.001;
      rangoAplicado = `${formatoMoneda(limite2)} < Monto ≤ ${formatoMoneda(limite3)}`;
    } else {
      tasaBase = monto * 0.0005;
      rangoAplicado = `Monto > ${formatoMoneda(limite3)}`;
    }

    html.push({ label: "Rango aplicado", value: rangoAplicado });

    // Ajuste por avance de obra
    let tasaCalculada = tasaBase;
    if (avance > 0) {
      const porcentajeRestante = (100 - avance) / 100;
      tasaCalculada = tasaBase * porcentajeRestante;
    }

    // Aplicar tasa mínima
    let tasaRetributiva = tasaCalculada;
    if (tasaCalculada < TASA_MINIMA && tasaCalculada > 0) {
      tasaRetributiva = TASA_MINIMA;
    }

    const descripcionServicio = (tasaRetributiva === TASA_MINIMA && tasaCalculada < TASA_MINIMA)
      ? "Representación Técnica (tasa mínima aplicada)"
      : "Representación Técnica";

    setResultados({
      html,
      tasaRetributiva,
      descripcionServicio
    });
  };

  return (
    <Container fluid className="representacion-container">
      {/* Imagen */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/representacion_tecnica.jpg" 
          alt="Representación Técnica"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/representacion_tecnica.jpg';
          }}
        />
      </div>

      {/* Títulos */}
      <div className="text-center mb-4">
        <h2 className="main-title">Representación Técnica</h2>
        <p className="subtitle">
          Ingrese el monto de la licitación y presione calcular.
        </p>
      </div>

      {/* Formulario - una sola columna */}
      <div className="form-card">
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="montoObraRepresentacion" className="form-label">
                Monto de Licitación ($)
              </label>
              <input 
                type="number" 
                className="form-control" 
                id="montoObraRepresentacion" 
                placeholder="Ingrese el monto de la licitación" 
                min="0"
                step="0.01"
                value={montoObra}
                onChange={(e) => setMontoObra(e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="avanceObraRepresentacion" className="form-label">
                % Avance de Obra (opcional)
              </label>
              <input 
                type="number" 
                className="form-control" 
                id="avanceObraRepresentacion" 
                placeholder="Ingrese el % de avance (0-100)" 
                min="0"
                max="100"
                value={avanceObra}
                onChange={(e) => setAvanceObra(e.target.value)}
              />
              <div className="form-text">
                Si no hay avance de obra, dejar en blanco. Este valor ajusta el cálculo al porcentaje restante de obra.
              </div>
            </div>

            {/* Botón Calcular (verde, ancho completo) */}
            <div className="d-grid">
              <button 
                className="calculate-button" 
                onClick={calcularRepresentacionTecnica}
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Representación Técnica</h4>
        {resultados ? (
          resultados.error ? (
            <div className="alert alert-warning text-center">
              {resultados.error}
            </div>
          ) : (
            <div id="resultadosRepresentacion">
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

export default RepresentacionTecnicaC;