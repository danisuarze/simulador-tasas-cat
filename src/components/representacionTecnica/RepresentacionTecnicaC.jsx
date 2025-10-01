import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './RepresentacionTecnicaC.css';

const RepresentacionTecnicaC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;

  // Estados
  const [montoObra, setMontoObra] = useState('');
  const [avanceObra, setAvanceObra] = useState('');
  const [resultados, setResultados] = useState(null);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular resultados
  const calcularRepresentacionTecnica = () => {
    const monto = parseFloat(montoObra) || 0;
    const avance = parseFloat(avanceObra) || 0;
    
    if (monto <= 0) {
      setResultados({
        error: "Por favor, ingrese un monto válido para la licitación."
      });
      return;
    }

    if (avance < 0 || avance > 100) {
      setResultados({
        error: "Por favor, ingrese un porcentaje de avance válido (0-100%)."
      });
      return;
    }

    let html = [];
    let detallesCalculo = [];
    
    html.push({ label: "Monto de Licitación", value: formatoMoneda(monto) });
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    
    if (avance > 0) {
      html.push({ label: "% Avance de Obra", value: `${avance}%` });
    }
    
    let tasaBase = 0;
    let descripcionServicio = "Representación Técnica";
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
      // Monto menor a 10,000*VPTR -> 0.4%
      tasaBase = monto * 0.004; // 0.4%
      rangoAplicado = `Monto ≤ ${formatoMoneda(limite1)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo base: ${formatoMoneda(monto)} × 0.4% = ${formatoMoneda(tasaBase)}`
      });
    } else if (monto > limite1 && monto <= limite2) {
      // Monto entre 10,000*VPTR y 100,000*VPTR -> 0.2%
      tasaBase = monto * 0.002; // 0.2%
      rangoAplicado = `${formatoMoneda(limite1)} < Monto ≤ ${formatoMoneda(limite2)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo base: ${formatoMoneda(monto)} × 0.2% = ${formatoMoneda(tasaBase)}`
      });
    } else if (monto > limite2 && monto <= limite3) {
      // Monto entre 100,000*VPTR y 1,000,000*VPTR -> 0.1%
      tasaBase = monto * 0.001; // 0.1%
      rangoAplicado = `${formatoMoneda(limite2)} < Monto ≤ ${formatoMoneda(limite3)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo base: ${formatoMoneda(monto)} × 0.1% = ${formatoMoneda(tasaBase)}`
      });
    } else {
      // Monto mayor a 1,000,000*VPTR -> 0.05%
      tasaBase = monto * 0.0005; // 0.05%
      rangoAplicado = `Monto > ${formatoMoneda(limite3)}`;
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo base: ${formatoMoneda(monto)} × 0.05% = ${formatoMoneda(tasaBase)}`
      });
    }

    html.push({ label: "Rango aplicado", value: rangoAplicado });

    // Aplicar ajuste por avance de obra
    let tasaRetributiva = tasaBase;
    
    if (avance > 0) {
      const porcentajeRestante = (100 - avance) / 100;
      tasaRetributiva = tasaBase * porcentajeRestante;
      
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Ajuste por avance de obra: ${formatoMoneda(tasaBase)} × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaRetributiva)}`
      });
    } else {
      detallesCalculo.push({
        tipo: "info",
        contenido: "Sin avance de obra especificado: Se aplica el 100% de la representación técnica"
      });
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  return (
    <div className="representacion-tecnica-container" style={{ position: 'relative', zIndex: 1000, minHeight: '100vh' }}>
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

      <div className="representacion-tecnica-header" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <h1 className="h3 mb-1">Simulador de Tasa Retributiva</h1>
              <p className="mb-0">Representación Técnica - Ingrese el monto de la licitación y presione calcular</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="row">
          <div className="col-lg-6">
            <div className="card representacion-tecnica-card" style={{ position: 'relative', zIndex: 1002 }}>
              <div className="card-header representacion-tecnica-card-header" style={{ position: 'relative', zIndex: 1003 }}>
                <h5 className="mb-0">Representación Técnica</h5>
              </div>
              <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
                <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
                  <label htmlFor="montoObraRepresentacionTecnica" className="form-label representacion-tecnica-form-label">
                    Monto de Licitación ($)
                  </label>
                  <input 
                    type="number" 
                    className="form-control representacion-tecnica-form-control" 
                    id="montoObraRepresentacionTecnica" 
                    placeholder="Ingrese el monto de la licitación" 
                    min="0"
                    step="0.01"
                    value={montoObra}
                    onChange={(e) => setMontoObra(e.target.value)}
                    style={{ position: 'relative', zIndex: 1005 }}
                  />
                </div>
                
                <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
                  <label htmlFor="avanceObraRepresentacionTecnica" className="form-label representacion-tecnica-form-label">
                    % Avance de Obra (opcional)
                  </label>
                  <input 
                    type="number" 
                    className="form-control representacion-tecnica-form-control" 
                    id="avanceObraRepresentacionTecnica" 
                    placeholder="Ingrese el % de avance (0-100)" 
                    min="0"
                    max="100"
                    value={avanceObra}
                    onChange={(e) => setAvanceObra(e.target.value)}
                    style={{ position: 'relative', zIndex: 1005 }}
                  />
                  <div className="form-text representacion-tecnica-form-text">
                    Si no hay avance de obra, dejar en blanco. Este valor ajusta el cálculo al porcentaje restante de obra.
                  </div>
                </div>
                
                <div className="d-grid" style={{ position: 'relative', zIndex: 1004 }}>
                  <button 
                    className="btn btn-primary representacion-tecnica-btn-primary" 
                    onClick={calcularRepresentacionTecnica}
                    style={{ position: 'relative', zIndex: 1005 }}
                  >
                    Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card representacion-tecnica-card representacion-tecnica-result-card" style={{ position: 'relative', zIndex: 1002 }}>
              <div className="card-header representacion-tecnica-card-header" style={{ position: 'relative', zIndex: 1003 }}>
                <h5 className="mb-0">Resultados - Representación Técnica</h5>
              </div>
              <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
                {resultados ? (
                  resultados.error ? (
                    <div className="alert alert-warning representacion-tecnica-alert representacion-tecnica-alert-warning text-center">
                      {resultados.error}
                    </div>
                  ) : (
                    <div id="resultadosRepresentacionTecnica">
                      {resultados.html.map((item, index) => (
                        <div key={index} className="representacion-tecnica-result-item">
                          <strong>{item.label}:</strong> {item.value}
                        </div>
                      ))}
                      
                      <hr />
                      
                      <div className="representacion-tecnica-resultado-final">
                        <div className="representacion-tecnica-resultado-final-titulo">Tasa Retributiva Final</div>
                        <div className="representacion-tecnica-resultado-final-valor">{formatoMoneda(resultados.tasaRetributiva)}</div>
                        <div className="representacion-tecnica-resultado-final-descripcion">{resultados.descripcionServicio}</div>
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

export default RepresentacionTecnicaC;