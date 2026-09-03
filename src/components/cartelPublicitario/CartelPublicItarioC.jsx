import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './CartelPublicitarioC.css';

const CartelPublicitarioC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000

  // Estados
  const [tipoCartel, setTipoCartel] = useState('nuevo');
  const [superficieTotal, setSuperficieTotal] = useState('');
  const [resultados, setResultados] = useState(null);

  // Efectos
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setResultados(null);
  }, [tipoCartel, superficieTotal]);

  // Formateador
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Cálculo
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

    const valorBase = superficie * VPTR;
    html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

    detallesCalculo.push({
      tipo: "calculo",
      contenido: `Cálculo: ${superficie} m² × ${formatoMoneda(VPTR)} = ${formatoMoneda(valorBase)}`
    });

    let tasaCalculada = valorBase;
    let descripcionServicio = tipoCartel === 'nuevo'
      ? "Anteproyecto, Proyecto y Dirección Técnica"
      : "Relevamiento";

    let aplicaTasaMinima = false;
    let tasaRetributiva = tasaCalculada;

    if (tasaCalculada < TASA_MINIMA) {
      aplicaTasaMinima = true;
      detallesCalculo.push({
        tipo: "info",
        contenido: `La tasa calculada (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
      });
      tasaRetributiva = TASA_MINIMA;
    }

    if (aplicaTasaMinima) {
      descripcionServicio = descripcionServicio + " (tasa mínima aplicada)";
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  return (
    <Container fluid className="cartel-container">
      {/* Imagen */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/carteles_publicitarios.png"
          alt="Carteles Publicitarios"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/carteles_publicitarios.png';
          }}
        />
      </div>

      {/* Títulos */}
      <div className="text-center mb-4">
        <h2 className="main-title">Carteles Publicitarios</h2>
        <p className="subtitle">
          Ingrese la superficie total y presione calcular.
        </p>
      </div>

      {/* Formulario - una sola columna */}
      <div className="form-card">
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="tipoCartel" className="form-label">Tipo de Cartel</label>
              <select
                className="form-select"
                id="tipoCartel"
                value={tipoCartel}
                onChange={(e) => setTipoCartel(e.target.value)}
              >
                <option value="nuevo">Cartel Nuevo</option>
                <option value="construido">Cartel Construido</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="superficieTotal" className="form-label">Superficie Total (m²)</label>
              <input
                type="number"
                className="form-control"
                id="superficieTotal"
                placeholder="Ingrese la superficie total del cartel"
                min="0"
                value={superficieTotal}
                onChange={(e) => setSuperficieTotal(e.target.value)}
              />
            </div>

            {/* Botón Calcular (azul, ancho completo) */}
            <div className="d-grid">
              <button
                className="calculate-button"
                onClick={calcularTasa}
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Cartel Publicitario</h4>
        {resultados ? (
          resultados.error ? (
            <div className="alert alert-warning text-center">
              {resultados.error}
            </div>
          ) : (
            <div id="resultadosCartel">
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
                <div className="mt-3 detalles-calculo">
                  <h6>Detalles del cálculo:</h6>
                  {resultados.detallesCalculo.map((detalle, index) => (
                    <div
                      key={index}
                      className={`detalle-item ${detalle.tipo === 'info' ? 'text-warning' :
                        detalle.tipo === 'calculo' ? 'text-dark' : ''}`}
                    >
                      {detalle.contenido}
                    </div>
                  ))}
                </div>
              )}

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
              Ingrese los datos y haga clic en calcular para ver los resultados
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

export default CartelPublictarioC;