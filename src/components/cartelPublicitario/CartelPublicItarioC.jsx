import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './CartelPublicitarioC.css';

const CartelPublicitarioC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;
  const TASA_MINIMA = 20 * VPTR; // $19,000

  // Estados
  const [tipoCartel, setTipoCartel] = useState('nuevo');
  const [superficieTotal, setSuperficieTotal] = useState('');
  const [resultados, setResultados] = useState(null);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular resultados
  const calcularTasa = () => {
    const superficie = parseFloat(superficieTotal) || 0;
    
    if (superficie <= 0) {
      setResultados({
        error: "Por favor, ingrese un valor válido para la superficie total."
      });
      return;
    }

    let html = [];
    let detallesCalculo = [];
    
    html.push({ label: "Tipo de Cartel", value: tipoCartel === 'nuevo' ? "Cartel Nuevo" : "Cartel Construido" });
    html.push({ label: "Superficie Total", value: `${superficie} m²` });
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    
    // Calcular valor base: Superficie total * VPTR
    const valorBase = superficie * VPTR;
    html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

    // Mostrar detalles del cálculo
    detallesCalculo.push({
      tipo: "calculo",
      contenido: `Cálculo: ${superficie} m² × ${formatoMoneda(VPTR)} = ${formatoMoneda(valorBase)}`
    });

    let tasaRetributiva = valorBase;
    let descripcionServicio = tipoCartel === 'nuevo' 
      ? "Anteproyecto, Proyecto y Dirección Técnica" 
      : "Relevamiento";

    // Aplicar tasa mínima si corresponde
    if (tasaRetributiva < TASA_MINIMA) {
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
    <div className="cartel-publicitario-container">
      {/* Botón Volver al Home */}
      <div className="container mt-3 mb-4">
        <button 
          className="btn back-home-btn"
          onClick={onBack}
          style={{ backgroundColor: '#6b8a5c', borderColor: '#6b8a5c', color: 'white' }}
        >
          <FaArrowLeft className="me-2" />
          Volver al Home
        </button>
      </div>

      <div className="cartel-publicitario-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <h1 className="h3 mb-1">Simulador de Tasa Retributiva</h1>
              <p className="mb-0">Carteles Publicitarios - Ingrese la superficie total y presione calcular</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="card cartel-publicitario-card">
              <div className="card-header cartel-publicitario-card-header">
                <h5 className="mb-0">Carteles Publicitarios</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="tipoCartel" className="form-label cartel-publicitario-form-label">Tipo de Cartel</label>
                  <select 
                    className="form-select cartel-publicitario-form-select" 
                    id="tipoCartel" 
                    value={tipoCartel}
                    onChange={(e) => setTipoCartel(e.target.value)}
                  >
                    <option value="nuevo">Cartel Nuevo</option>
                    <option value="construido">Cartel Construido</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="superficieTotal" className="form-label cartel-publicitario-form-label">Superficie Total (m²)</label>
                  <input 
                    type="number" 
                    className="form-control cartel-publicitario-form-control" 
                    id="superficieTotal" 
                    placeholder="Ingrese la superficie total del cartel" 
                    min="0"
                    value={superficieTotal}
                    onChange={(e) => setSuperficieTotal(e.target.value)}
                  />
                </div>
                
                <div className="d-grid">
                  <button className="btn btn-primary cartel-publicitario-btn-primary" onClick={calcularTasa}>
                    <i className="bi bi-calculator"></i> Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card cartel-publicitario-card cartel-publicitario-result-card">
              <div className="card-header cartel-publicitario-card-header">
                <h5 className="mb-0">Resultados - Cartel Publicitario</h5>
              </div>
              <div className="card-body">
                {resultados ? (
                  resultados.error ? (
                    <div className="alert alert-warning cartel-publicitario-alert cartel-publicitario-alert-warning text-center">
                      {resultados.error}
                    </div>
                  ) : (
                    <div id="resultadosCartel">
                      {resultados.html.map((item, index) => (
                        <div key={index} className="cartel-publicitario-result-item">
                          <strong>{item.label}:</strong> {item.value}
                        </div>
                      ))}
                      
                      <hr />
                      
                      <div className="cartel-publicitario-resultado-final">
                        <div className="cartel-publicitario-resultado-final-titulo">Tasa Retributiva Final</div>
                        <div className="cartel-publicitario-resultado-final-valor">{formatoMoneda(resultados.tasaRetributiva)}</div>
                        <div className="cartel-publicitario-resultado-final-descripcion">{resultados.descripcionServicio}</div>
                      </div>
                      
                      {resultados.detallesCalculo && resultados.detallesCalculo.length > 0 && (
                        <div className="mt-3">
                          <h6>Detalles del cálculo:</h6>
                          {resultados.detallesCalculo.map((detalle, index) => (
                            <div 
                              key={index} 
                              className={`cartel-publicitario-calculo-detalle ${
                                detalle.tipo === 'info' ? 'text-warning' : 
                                detalle.tipo === 'calculo' ? 'text-dark' : ''
                              }`}
                            >
                              {detalle.contenido}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <p className="text-center text-muted">Ingrese los datos y haga clic en calcular para ver los resultados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartelPublicitarioC;