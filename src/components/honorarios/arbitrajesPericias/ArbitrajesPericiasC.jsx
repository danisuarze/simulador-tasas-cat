// src/components/honorarios/arbitrajesPericias/ArbitrajesPericiasC.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import './ArbitrajesPericiasC.css';

const ArbitrajesPericiasC = ({ onBack }) => {
  // Estados
  const [vrRaw, setVrRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [porcentajeRaw, setPorcentajeRaw] = useState('');
  const [porcentajeDisplay, setPorcentajeDisplay] = useState('');
  const [montoObraRaw, setMontoObraRaw] = useState('');
  const [montoObraDisplay, setMontoObraDisplay] = useState('');
  const [distancia, setDistancia] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  // Formateadores
  const formatNumber = (numStr) => {
    if (!numStr) return '';
    const clean = numStr.toString().replace(/[^0-9]/g, '');
    if (clean === '') return '';
    return parseInt(clean, 10).toLocaleString('es-AR');
  };

  const formatPorcentaje = (numStr) => {
    if (!numStr) return '';
    const clean = numStr.toString().replace(/[^0-9]/g, '');
    if (clean === '') return '';
    return parseInt(clean, 10);
  };

  const handleVrChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setVrRaw(raw);
    setVrDisplay(formatNumber(raw));
  };

  const handleVrBlur = () => {
    setVrDisplay(formatNumber(vrRaw));
  };

  const handlePorcentajeChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPorcentajeRaw(raw);
    setPorcentajeDisplay(formatPorcentaje(raw));
  };

  const handlePorcentajeBlur = () => {
    setPorcentajeDisplay(formatPorcentaje(porcentajeRaw));
  };

  const handleMontoChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMontoObraRaw(raw);
    setMontoObraDisplay(formatNumber(raw));
  };

  const handleMontoBlur = () => {
    setMontoObraDisplay(formatNumber(montoObraRaw));
  };

  // Función para calcular B (base por tramos)
  const calcularB = (vr, monto) => {
    if (vr <= 0 || monto <= 0) return 0;

    const limites = [
      { multiplo: 100, porcentaje: 0.008 },   // 0.80%
      { multiplo: 1000, porcentaje: 0.006 },  // 0.60%
      { multiplo: 10000, porcentaje: 0.004 }, // 0.40%
      { multiplo: Infinity, porcentaje: 0.0025 } // 0.25%
    ];

    let resto = monto;
    let total = 0;
    let limiteAnterior = 0;

    for (let i = 0; i < limites.length; i++) {
      const limiteActual = limites[i].multiplo * vr;
      const anchoTramo = Math.min(resto, limiteActual - limiteAnterior);
      if (anchoTramo <= 0) break;
      total += anchoTramo * limites[i].porcentaje;
      resto -= anchoTramo;
      limiteAnterior = limiteActual;
      if (resto <= 0) break;
    }

    return total;
  };

  const handleCalcular = () => {
    const vrNum = parseFloat(vrRaw);
    const porcentajeNum = parseFloat(porcentajeRaw);
    const montoNum = parseFloat(montoObraRaw);

    // Validaciones
    if (distancia === '') {
      setError('Debe seleccionar la distancia de la prestación.');
      setResultado(null);
      return;
    }

    if (vrRaw === '' || porcentajeRaw === '' || montoObraRaw === '') {
      setError('Debe completar todos los campos.');
      setResultado(null);
      return;
    }

    if (vrNum < 1000000) {
      setError('El Valor de Referencia (VR) no puede ser menor a $1.000.000.');
      setResultado(null);
      return;
    }

    if (isNaN(vrNum) || vrNum <= 0) {
      setError('Debe ingresar un VR válido (mayor a 0).');
      setResultado(null);
      return;
    }

    if (isNaN(porcentajeNum) || porcentajeNum < 20) {
      setError('El porcentaje de aplicación no puede ser menor al 20%.');
      setResultado(null);
      return;
    }

    if (porcentajeNum > 100) {
      setError('El porcentaje de aplicación no puede superar el 100%.');
      setResultado(null);
      return;
    }

    if (isNaN(montoNum) || montoNum <= 0) {
      setError('Debe ingresar un monto de obra válido (mayor a 0).');
      setResultado(null);
      return;
    }

    setError('');

    // Cálculos
    const B = calcularB(vrNum, montoNum);
    const A = (porcentajeNum / 100) * B;
    const C = distancia === '20' ? vrNum * 0.15 : vrNum * 0.25;
    const total = A + B + C;
    const montoMinimo = vrNum * 0.5;
    const distanciaTexto = distancia === '20' ? 'Hasta 20 km' : 'Mayor a 20 km';

    setResultado({
      vr: vrNum,
      porcentaje: porcentajeNum,
      monto: montoNum,
      distancia: distanciaTexto,
      A,
      B,
      C,
      total,
      montoMinimo,
    });
  };

  const formatearPesos = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
      .format(numero)
      .replace('ARS', '$');
  };

  return (
    <Container fluid className="arbitrajes-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/Arbitrajes_pericias.JPG"    /* ← IMAGEN CORREGIDA */
          alt="Arbitrajes y Pericias"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/pericias.jpg';  /* ← FALLBACK (opcional) */
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Arbitrajes y Pericias</h2>
        <p className="subtitle">Complete los datos para calcular honorarios</p>
      </div>

      {/* Formulario */}
      <div className="form-card">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Valor de Referencia (VR) *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 1.500.000"
                  value={vrDisplay}
                  onChange={handleVrChange}
                  onBlur={handleVrBlur}
                />
                <Form.Text className="text-muted">
                  Costo de m2 de construcción ($). Mínimo $1.000.000.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Porcentaje de aplicación (%) *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 30 (mínimo 20%)"
                  value={porcentajeDisplay}
                  onChange={handlePorcentajeChange}
                  onBlur={handlePorcentajeBlur}
                />
                <Form.Text className="text-muted">
                  Importancia y extensión del caso (mínimo 20%).
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Monto de obra involucrado *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 75.000.000"
                  value={montoObraDisplay}
                  onChange={handleMontoChange}
                  onBlur={handleMontoBlur}
                />
                <Form.Text className="text-muted">
                  Valor total de la obra o proyecto involucrado.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Distancia de la prestación *</Form.Label>
                <Form.Select
                  value={distancia}
                  onChange={(e) => setDistancia(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione la distancia
                  </option>
                  <option value="20">Hasta un radio de 20 km</option>
                  <option value="mayor">Mayor a un radio de 20 km</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="text-center">
            <Button variant="primary" onClick={handleCalcular} className="calcular-btn">
              <FaCalculator className="me-2" /> Calcular honorarios
            </Button>
          </div>
        </Form>

        {resultado && (
          <div className="resultado-card">
            <h4 className="text-center">Resultado del cálculo</h4>

            {/* Resumen de datos cargados */}
            <div className="resumen-datos">
              <p><strong>VR:</strong> {formatearPesos(resultado.vr)}</p>
              <p><strong>Porcentaje de aplicación:</strong> {resultado.porcentaje}%</p>
              <p><strong>Monto de obra:</strong> {formatearPesos(resultado.monto)}</p>
              <p><strong>Distancia:</strong> {resultado.distancia}</p>
            </div>

            <hr />

            {/* Desglose alineado a la izquierda */}
            <div className="desglose-honorarios">
              <div className="fila-desglose">
                <span className="concepto">A) Según la importancia y extensión del caso:</span>
                <span className="monto">{formatearPesos(resultado.A)}</span>
              </div>
              <div className="fila-desglose">
                <span className="concepto">B) Según monto de obra involucrado:</span>
                <span className="monto">{formatearPesos(resultado.B)}</span>
              </div>
              <div className="fila-desglose">
                <span className="concepto">C) Tiempo empleado, días de trabajo y traslados:</span>
                <span className="monto">{formatearPesos(resultado.C)}</span>
              </div>

              <div className="fila-desglose total">
                <span className="concepto"><strong>Total de honorarios sugeridos:</strong></span>
                <span className="monto total-valor">{formatearPesos(resultado.total)}</span>
              </div>
            </div>

            {/* Monto mínimo sugerido */}
            <div className="monto-minimo-container">
              <p className="monto-minimo-text">
                <strong>Monto mínimo sugerido:</strong> {formatearPesos(resultado.montoMinimo)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón Volver */}
      <div className="text-center mt-4">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onBack}
          style={{ color: '#495057', borderColor: '#ced4da' }}
        >
          <FaArrowLeft className="me-2" /> Volver a especialidades
        </Button>
      </div>
    </Container>
  );
};

export default ArbitrajesPericiasC;