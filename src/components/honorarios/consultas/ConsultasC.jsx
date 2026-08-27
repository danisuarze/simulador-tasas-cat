// src/components/honorarios/consultas/ConsultasC.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import './ConsultasC.css';

const ConsultasC = ({ onBack }) => {
  // Estados
  const [vrRaw, setVrRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('');
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

  // Función para calcular honorarios según tipo
  const calcularHonorario = (vr, tipo) => {
    if (vr <= 0) return 0;
    switch (tipo) {
      case '1':
        return vr * 0.05; // 5%
      case '2':
        return vr * 0.15; // 15%
      case '3':
        return vr * 0.25; // 25%
      default:
        return 0;
    }
  };

  const handleCalcular = () => {
    const vrNum = parseFloat(vrRaw);

    if (tipoConsulta === '') {
      setError('Debe seleccionar un tipo de consulta.');
      setResultado(null);
      return;
    }

    if (vrRaw === '') {
      setError('Debe ingresar el Valor de Referencia (VR).');
      setResultado(null);
      return;
    }

    if (vrNum < 1000000) {
      setError('El Valor de Referencia (VR) no puede ser menor a $1.000.000.');
      setResultado(null);
      return;
    }

    if (isNaN(vrNum) || vrNum <= 0) {
      setError('Debe ingresar un Valor de Referencia (VR) válido (mayor a 0).');
      setResultado(null);
      return;
    }

    setError('');

    const honorarios = calcularHonorario(vrNum, tipoConsulta);
    let concepto = '';
    let descripcion = '';

    switch (tipoConsulta) {
      case '1':
        concepto = 'Consultas en domicilio del profesional';
        descripcion = 'El profesional atiende en su estudio u oficina. Incluye asesoramiento técnico, análisis de documentación y emisión de dictámenes.';
        break;
      case '2':
        concepto = 'Consultas in situ hasta 20 Km.';
        descripcion = 'El profesional se traslada al lugar de los hechos dentro de un radio de 20 km. Incluye inspección visual, relevamiento de datos y emisión de informe preliminar.';
        break;
      case '3':
        concepto = 'Consultas in situ fuera del radio de 20 Km.';
        descripcion = 'El profesional se traslada a distancias superiores a 20 km. Incluye desplazamiento, inspección detallada, relevamiento completo y emisión de informe técnico.';
        break;
      default:
        concepto = '';
        descripcion = '';
    }

    setResultado({
      honorarios,
      concepto,
      vr: vrNum,
      descripcion,
      tipo: tipoConsulta,
    });
  };

  const formatearPesos = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
      .format(numero)
      .replace('ARS', '$');
  };

  const getTipoTexto = () => {
    if (tipoConsulta === '1') return 'Consultas en domicilio del profesional';
    if (tipoConsulta === '2') return 'Consultas in situ hasta 20 Km.';
    if (tipoConsulta === '3') return 'Consultas in situ fuera del radio de 20 Km.';
    return 'Seleccione tipo de consulta';
  };

  return (
    <Container fluid className="consultas-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/consultas.jpg"
          alt="Consultas"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/pericias.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Consultas</h2>
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
                <Form.Label>Tipo de consulta *</Form.Label>
                <Form.Select
                  value={tipoConsulta}
                  onChange={(e) => setTipoConsulta(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccione el tipo de consulta
                  </option>
                  <option value="1">1.- Consultas en domicilio del profesional</option>
                  <option value="2">2.- Consultas in situ hasta 20 Km.</option>
                  <option value="3">3.- Consultas in situ fuera del radio de 20 Km.</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <div
              style={{
                color: '#dc3545',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
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
            <div className="resumen-datos">
              <p>
                <strong>VR (Valor de Referencia):</strong> {formatearPesos(resultado.vr)}
              </p>
              <p>
                <strong>Tipo de consulta:</strong> {getTipoTexto()}
              </p>
            </div>
            <hr />
            <div className="text-center">
              <p>
                <strong>CONCEPTO</strong>
              </p>
              <p>
                <strong>{resultado.concepto}</strong>
              </p>
              <p className="descripcion-texto">{resultado.descripcion}</p>
            </div>
            <p className="text-center">
              <strong>Total:</strong>{' '}
              <strong className="total-valor">{formatearPesos(resultado.honorarios)}</strong>
            </p>
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

export default ConsultasC;