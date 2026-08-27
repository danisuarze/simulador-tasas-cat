// src/components/honorarios/representacionesTecnicas/RepresentacionesTecnicasC.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import './RepresentacionesTecnicasC.css';

const RepresentacionesTecnicasC = ({ onBack }) => {
  // Estados
  const [vrRaw, setVrRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [montoRaw, setMontoRaw] = useState('');
  const [montoDisplay, setMontoDisplay] = useState('');
  const [tipo, setTipo] = useState(''); // '1' o '2'
  const [tareasParciales, setTareasParciales] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  // Formateadores
  const formatNumber = (numStr) => {
    if (!numStr) return '';
    const clean = numStr.toString().replace(/[^0-9]/g, '');
    if (clean === '') return '';
    return parseInt(clean, 10).toLocaleString('es-AR');
  };

  const handleVrChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setVrRaw(raw);
    setVrDisplay(formatNumber(raw));
  };

  const handleVrBlur = () => {
    setVrDisplay(formatNumber(vrRaw));
  };

  const handleMontoChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMontoRaw(raw);
    setMontoDisplay(formatNumber(raw));
  };

  const handleMontoBlur = () => {
    setMontoDisplay(formatNumber(montoRaw));
  };

  // Función de cálculo por tramos según tipo
  const calcularBase = (vr, monto, tipo) => {
    if (vr <= 0 || monto <= 0) return 0;

    let limites;
    if (tipo === '1') {
      // Contratistas en Contratos de Obra
      limites = [
        { multiplo: 10, porcentaje: 0.035 },    // 3.50%
        { multiplo: 100, porcentaje: 0.030 },   // 3.00%
        { multiplo: 1000, porcentaje: 0.020 },  // 2.00%
        { multiplo: 10000, porcentaje: 0.015 }, // 1.50%
        { multiplo: Infinity, porcentaje: 0.010 } // 1.00%
      ];
    } else {
      // Empresas proveedoras
      limites = [
        { multiplo: 10, porcentaje: 0.015 },    // 1.50%
        { multiplo: 100, porcentaje: 0.010 },   // 1.00%
        { multiplo: 1000, porcentaje: 0.0075 }, // 0.75%
        { multiplo: 10000, porcentaje: 0.0050 },// 0.50%
        { multiplo: Infinity, porcentaje: 0.0050 } // 0.50% para >10000
      ];
    }

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
    const montoNum = parseFloat(montoRaw);

    if (tipo === '') {
      setError('Debe seleccionar un tipo de representación.');
      setResultado(null);
      return;
    }

    if (vrRaw === '' || montoRaw === '') {
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

    if (isNaN(montoNum) || montoNum <= 0) {
      setError('Debe ingresar un monto certificado/facturado válido (mayor a 0).');
      setResultado(null);
      return;
    }

    setError('');

    // Cálculo base
    const base = calcularBase(vrNum, montoNum, tipo);
    const tipoTexto = tipo === '1'
      ? 'Representación Técnica de Contratistas en Contratos de Obra'
      : 'Representación Técnica de empresas proveedoras';

    // Calculamos los adicionales
    const adicionalA = base * 0.10; // 10%
    const adicionalB = base * 0.05; // 5%
    const adicionalC = base * 0.05; // 5%

    // Opciones de honorarios
    const opciones = {
      base: base,
      conA: base + adicionalA,
      conB: base + adicionalB,
      conC: base + adicionalC,
    };

    setResultado({
      vr: vrNum,
      monto: montoNum,
      tipo: tipoTexto,
      base,
      adicionalA,
      adicionalB,
      adicionalC,
      opciones,
      tareasParciales,
    });
  };

  const formatearPesos = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
      .format(numero)
      .replace('ARS', '$');
  };

  return (
    <Container fluid className="representaciones-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/repres_tecnica.jpg"
          alt="Representaciones Técnicas"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/repres_tecnica.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Representaciones Técnicas</h2>
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
                <Form.Label>Monto certificado o facturado *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 75.000.000"
                  value={montoDisplay}
                  onChange={handleMontoChange}
                  onBlur={handleMontoBlur}
                />
                <Form.Text className="text-muted">
                  Valor certificado o facturado del proyecto.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de representación *</Form.Label>
            <Form.Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="" disabled>
                Seleccione el tipo de representación
              </option>
              <option value="1">
                1) Representación Técnica de Contratistas en Contratos de Obra
              </option>
              <option value="2">
                2) Representación Técnica de empresas proveedoras
              </option>
            </Form.Select>
          </Form.Group>

          {/* Checkbox para tareas parciales */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="¿Existen tareas parciales?"
              checked={tareasParciales}
              onChange={(e) => setTareasParciales(e.target.checked)}
              className="checkbox-tareas"
            />
            {tareasParciales && (
              <div className="tareas-detalle">
                <p className="text-muted small mb-1">
                  <strong>Items adicionales (cada uno es una opción independiente):</strong>
                </p>
                <ul className="text-muted small">
                  <li>a) Estudio de pliego y documentación de la obra e informe al comitente (10% adicional)</li>
                  <li>b) Presentación de la propuesta con su firma (5% adicional)</li>
                  <li>c) Estudio de las propuestas presentadas, observaciones y/o impugnaciones y trámite hasta la adjudicación (5% adicional)</li>
                </ul>
              </div>
            )}
          </Form.Group>

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

            {/* Resumen */}
            <div className="resumen-datos">
              <p><strong>VR:</strong> {formatearPesos(resultado.vr)}</p>
              <p><strong>Monto certificado/facturado:</strong> {formatearPesos(resultado.monto)}</p>
              <p><strong>Tipo:</strong> {resultado.tipo}</p>
            </div>

            <hr />

            {/* Desglose */}
            <div className="desglose-honorarios">
              {/* Siempre mostramos el honorario base */}
              <div className="fila-desglose">
                <span className="concepto">Honorario base (sin tareas parciales):</span>
                <span className="monto">{formatearPesos(resultado.base)}</span>
              </div>

              {/* Si hay tareas parciales, mostramos las opciones adicionales */}
              {resultado.tareasParciales && (
                <>
                  <div className="fila-desglose">
                    <span className="concepto">a) Estudio de pliego y documentación (10%):</span>
                    <span className="monto">{formatearPesos(resultado.opciones.conA)}</span>
                  </div>
                  <div className="fila-desglose">
                    <span className="concepto">b) Presentación de la propuesta con firma (5%):</span>
                    <span className="monto">{formatearPesos(resultado.opciones.conB)}</span>
                  </div>
                  <div className="fila-desglose">
                    <span className="concepto">c) Estudio de propuestas y trámite hasta adjudicación (5%):</span>
                    <span className="monto">{formatearPesos(resultado.opciones.conC)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Honorario mínimo sugerido */}
            <div className="monto-minimo-container">
              <p className="monto-minimo-text">
                <strong>Honorario mínimo sugerido:</strong> {formatearPesos(resultado.vr * 0.5)}
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

export default RepresentacionesTecnicasC;