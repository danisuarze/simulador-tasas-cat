import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
    <div className="container my-4" style={{ 
      position: 'relative',
      zIndex: 1000,
      minHeight: '100vh'
    }}>
      {/* Header sin botón de volver */}
      <div className="text-center mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <div style={{ position: 'relative', zIndex: 1001 }}>
          <h2 className="mb-0">Estudio de Propuesta</h2>
          <p className="mb-0 text-muted">
            Ingrese el monto de la licitación y presione calcular.
          </p>
        </div>
      </div>

      <div className="row" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="col-lg-6">
          <div className="card" style={{ position: 'relative', zIndex: 1002 }}>
            <div className="card-header" style={{ position: 'relative', zIndex: 1003 }}>
              <h5 className="mb-0">Datos de Entrada</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
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
                  style={{ position: 'relative', zIndex: 1005 }}
                />
              </div>
              
              <div className="d-grid" style={{ position: 'relative', zIndex: 1005 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={calcularEstudioPropuesta}
                  style={{ position: 'relative', zIndex: 1006 }}
                >
                  Calcular
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card result-card" style={{ position: 'relative', zIndex: 1002 }}>
            <div className="card-header" style={{ position: 'relative', zIndex: 1003 }}>
              <h5 className="mb-0">Resultados - Estudio de Propuesta</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              {resultados ? (
                resultados.error ? (
                  <div className="alert alert-warning text-center" style={{ position: 'relative', zIndex: 1004 }}>
                    {resultados.error}
                  </div>
                ) : (
                  <div id="resultadosEstudioPropuesta" style={{ position: 'relative', zIndex: 1004 }}>
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
                    
                    {/* Botón Volver fijo al final de los resultados */}
                    <div className="mt-4 pt-3 border-top" style={{ position: 'relative', zIndex: 1005 }}>
                      <Button 
                        onClick={onBack}
                        className="back-button-custom d-inline-flex align-items-center justify-content-center w-100"
                        style={{
                          backgroundColor: '#7B9C6B',
                          borderColor: '#7B9C6B',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        <FaArrowLeft className="me-2" />
                        Volver al Menú Principal
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ position: 'relative', zIndex: 1004 }}>
                  <p className="text-center text-muted">
                    Ingrese el monto de la licitación y haga clic en calcular para ver los resultados
                  </p>
                  
                  {/* Botón Volver visible incluso sin resultados */}
                  <div className="mt-4 pt-3 border-top" style={{ position: 'relative', zIndex: 1005 }}>
                    <Button 
                      onClick={onBack}
                      className="back-button-custom d-inline-flex align-items-center justify-content-center w-100"
                      style={{
                        backgroundColor: '#7B9C6B',
                        borderColor: '#7B9C6B',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      <FaArrowLeft className="me-2" />
                      Volver al Menú Principal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudioPropuestaC;