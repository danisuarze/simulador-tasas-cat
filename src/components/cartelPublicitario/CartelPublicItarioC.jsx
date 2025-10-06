import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
    <div className="container my-4" style={{ 
      position: 'relative',
      zIndex: 1000,
      minHeight: '100vh'
    }}>
      {/* Header sin botón de volver */}
      <div className="text-center mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <div style={{ position: 'relative', zIndex: 1001 }}>
          <h2 className="mb-0">Carteles Publicitarios</h2>
          <p className="mb-0 text-muted">
            Ingrese la superficie total y presione calcular.
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
                <label htmlFor="tipoCartel" className="form-label">Tipo de Cartel</label>
                <select 
                  className="form-select" 
                  id="tipoCartel" 
                  value={tipoCartel}
                  onChange={(e) => setTipoCartel(e.target.value)}
                  style={{ position: 'relative', zIndex: 1005 }}
                >
                  <option value="nuevo">Cartel Nuevo</option>
                  <option value="construido">Cartel Construido</option>
                </select>
              </div>
              
              <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
                <label htmlFor="superficieTotal" className="form-label">Superficie Total (m²)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="superficieTotal" 
                  placeholder="Ingrese la superficie total del cartel" 
                  min="0"
                  value={superficieTotal}
                  onChange={(e) => setSuperficieTotal(e.target.value)}
                  style={{ position: 'relative', zIndex: 1005 }}
                />
              </div>
              
              <div className="d-grid" style={{ position: 'relative', zIndex: 1005 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={calcularTasa}
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
              <h5 className="mb-0">Resultados - Cartel Publicitario</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              {resultados ? (
                resultados.error ? (
                  <div className="alert alert-warning text-center" style={{ position: 'relative', zIndex: 1004 }}>
                    {resultados.error}
                  </div>
                ) : (
                  <div id="resultadosCartel" style={{ position: 'relative', zIndex: 1004 }}>
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
                    Ingrese los datos y haga clic en calcular para ver los resultados
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

export default CartelPublicitarioC;