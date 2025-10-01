import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './EstudioPropuestaC.css';

const EstudioPropuestaC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;
  const TASA_MINIMA = 20 * VPTR; // $19,000

  // Estados
  const [montoObra, setMontoObra] = useState('');
  const [resultados, setResultados] = useState(null);

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
    let detallesCalculo = [];
    
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

    detallesCalculo.push({
      tipo: "info",
      contenido: `Límite 1: ${formatoMoneda(limite1)} (10,000 × VPTR)`
    });
    detallesCalculo.push({
      tipo: "info",
      contenido: `Límite 2: ${formatoMoneda(limite2)} (100,000 × VPTR)`
    });
    detallesCalculo.push({
      tipo: "info",
      contenido: `Límite 3: ${formatoMoneda(limite3)} (1,000,000 × VPTR)`
    });

    // Calcular según los rangos especificados
    if (monto <= limite1) {
      // Monto menor a 10,000*VPTR -> Tasa mínima
      tasaRetributiva = TASA_MINIMA;
      rangoAplicado = `Monto ≤ ${formatoMoneda(limite1)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Aplicación de Tasa Mínima: ${formatoMoneda(TASA_MINIMA)} (20 × VPTR)`
      });
    } else if (monto > limite1 && monto <= limite2) {
      // Monto entre 10,000*VPTR y 100,000*VPTR -> 0.03%
      tasaRetributiva = monto * 0.0003; // 0.03%
      rangoAplicado = `${formatoMoneda(limite1)} < Monto ≤ ${formatoMoneda(limite2)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo: ${formatoMoneda(monto)} × 0.03% = ${formatoMoneda(tasaRetributiva)}`
      });
    } else if (monto > limite2 && monto <= limite3) {
      // Monto entre 100,000*VPTR y 1,000,000*VPTR -> 0.02%
      tasaRetributiva = monto * 0.0002; // 0.02%
      rangoAplicado = `${formatoMoneda(limite2)} < Monto ≤ ${formatoMoneda(limite3)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo: ${formatoMoneda(monto)} × 0.02% = ${formatoMoneda(tasaRetributiva)}`
      });
    } else {
      // Monto mayor a 1,000,000*VPTR -> 0.01%
      tasaRetributiva = monto * 0.0001; // 0.01%
      rangoAplicado = `Monto > ${formatoMoneda(limite3)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo: ${formatoMoneda(monto)} × 0.01% = ${formatoMoneda(tasaRetributiva)}`
      });
    }

    html.push({ label: "Rango aplicado", value: rangoAplicado });

    // Aplicar tasa mínima si el cálculo es menor (solo para los casos de porcentaje)
    if (monto > limite1 && tasaRetributiva < TASA_MINIMA) {
      detallesCalculo.push({
        tipo: "info",
        contenido: `Aplicación de Tasa Mínima: El cálculo inicial (${formatoMoneda(tasaRetributiva)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
      });
      tasaRetributiva = TASA_MINIMA;
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  return (
    <div className="instalaciones-estructuras-container" style={{ position: 'relative', zIndex: 1000, minHeight: '100vh' }}>
      {/* Botón Volver al Home */}
      <div className="container mt-3 mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <button 
          className="btn back-home-btn"
          onClick={onBack}
          style={{ 
            backgroundColor: '#6b8a5c', 
            borderColor: '#6b8a5c', 
            color: 'white',
            position: 'relative',
            zIndex: 1002
          }}
        >
          <FaArrowLeft className="me-2" />
          Volver al Home
        </button>
      </div>

      <div className="instalaciones-estructuras-header" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <h1 className="h3 mb-1">Simulador de Tasa Retributiva</h1>
              <p className="mb-0">Estudio de Propuesta - Ingrese el monto de la licitación y presione calcular</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="row">
          <div className="col-lg-6">
            <div className="card instalaciones-estructuras-card" style={{ position: 'relative', zIndex: 1002 }}>
              <div className="card-header instalaciones-estructuras-card-header" style={{ position: 'relative', zIndex: 1003 }}>
                <h5 className="mb-0">Estudio de Propuesta</h5>
              </div>
              <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
                <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
                  <label htmlFor="montoObraEstudioPropuesta" className="form-label instalaciones-estructuras-form-label">
                    Monto de Licitación ($)
                  </label>
                  <input 
                    type="number" 
                    className="form-control instalaciones-estructuras-form-control" 
                    id="montoObraEstudioPropuesta" 
                    placeholder="Ingrese el monto de la licitación" 
                    min="0"
                    step="0.01"
                    value={montoObra}
                    onChange={(e) => setMontoObra(e.target.value)}
                    style={{ position: 'relative', zIndex: 1005 }}
                  />
                </div>
                
                <div className="d-grid" style={{ position: 'relative', zIndex: 1004 }}>
                  <button 
                    className="btn btn-primary instalaciones-estructuras-btn-primary" 
                    onClick={calcularEstudioPropuesta}
                    style={{ position: 'relative', zIndex: 1005 }}
                  >
                    Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card instalaciones-estructuras-card instalaciones-estructuras-result-card" style={{ position: 'relative', zIndex: 1002 }}>
              <div className="card-header instalaciones-estructuras-card-header" style={{ position: 'relative', zIndex: 1003 }}>
                <h5 className="mb-0">Resultados - Estudio de Propuesta</h5>
              </div>
              <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
                {resultados ? (
                  resultados.error ? (
                    <div className="alert alert-warning instalaciones-estructuras-alert instalaciones-estructuras-alert-warning text-center">
                      {resultados.error}
                    </div>
                  ) : (
                    <div id="resultadosEstudioPropuesta">
                      {resultados.html.map((item, index) => (
                        <div key={index} className="instalaciones-estructuras-result-item">
                          <strong>{item.label}:</strong> {item.value}
                        </div>
                      ))}
                      
                      <hr />
                      
                      <div className="instalaciones-estructuras-resultado-final">
                        <div className="instalaciones-estructuras-resultado-final-titulo">Tasa Retributiva Final</div>
                        <div className="instalaciones-estructuras-resultado-final-valor">{formatoMoneda(resultados.tasaRetributiva)}</div>
                        <div className="instalaciones-estructuras-resultado-final-descripcion">{resultados.descripcionServicio}</div>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-center text-muted">Ingrese el monto de la licitación y haga clic en calcular para ver los resultados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudioPropuestaC;