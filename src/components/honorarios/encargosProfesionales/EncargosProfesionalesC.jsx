import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import './EncargosProfesionalesC.css';

const EncargosProfesionalesC = ({ onBack }) => {
  // Estados
  const [vrRaw, setVrRaw] = useState('');
  const [montoObraRaw, setMontoObraRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [montoObraDisplay, setMontoObraDisplay] = useState('');
  const [tipoObra, setTipoObra] = useState('');
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
    setMontoObraRaw(raw);
    setMontoObraDisplay(formatNumber(raw));
  };

  const handleMontoBlur = () => {
    setMontoObraDisplay(formatNumber(montoObraRaw));
  };

  const handleTipoChange = (e) => {
    setTipoObra(e.target.value);
  };

  // ===== FUNCIONES DE CÁLCULO =====

  // 1. Arquitectura en General
  const calcularBaseArquitectura = (vr, monto) => {
    if (vr <= 0 || monto <= 0) return 0;
    const limites = [
      { multiplo: 100, porcentaje: 0.09 },
      { multiplo: 1000, porcentaje: 0.07 },
      { multiplo: 10000, porcentaje: 0.05 },
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
    if (resto > 0) {
      total += resto * 0.04;
    }
    return total;
  };

  // 2. Medición y cómputo de obras de Arquitectura
  const calcularBaseMedicion = (vr, monto) => {
    if (vr <= 0 || monto <= 0) return 0;
    const limites = [
      { multiplo: 100, porcentaje: 0.006 },  // 0.60%
      { multiplo: 1000, porcentaje: 0.003 }, // 0.30%
      { multiplo: 10000, porcentaje: 0.001 },// 0.10%
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
    if (resto > 0) {
      total += resto * 0.0005; // 0.05%
    }
    return total;
  };

  // 3. Obras especiales
  const calcularBaseEspeciales = (vr, monto) => {
    if (vr <= 0 || monto <= 0) return 0;
    const limites = [
      { multiplo: 100, porcentaje: 0.15 },   // 15%
      { multiplo: 1000, porcentaje: 0.10 },  // 10%
      { multiplo: 10000, porcentaje: 0.06 }, // 6%
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
    if (resto > 0) {
      total += resto * 0.04; // 4%
    }
    return total;
  };

  // Subdivisión de honorarios (para opciones 1 y 3)
  const calcularDetalles = (base) => {
    const total = {
      estudio: base * 0.10,
      anteproyecto: base * 0.30,
      proyecto: base * 0.60,
      direccion: base * 0.40,
      proyectoYDireccion: base * 1.00,
    };
    const parcial = {
      estudio: base * 0.20,
      anteproyecto: base * 0.40,
      proyecto: base * 0.80,
      direccion: base * 0.60,
      proyectoYDireccion: null,
    };
    return { total, parcial };
  };

  const formatearPesos = (numero) => {
    if (numero === null || numero === undefined) return '';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
      .format(numero)
      .replace('ARS', '$');
  };

  const handleCalcular = () => {
    const vrNum = parseFloat(vrRaw);
    const montoNum = parseFloat(montoObraRaw);

    if (tipoObra === '') {
      setError('Debe seleccionar un tipo de encargo.');
      setResultado(null);
      return;
    }

    if (vrRaw === '' || montoObraRaw === '') {
      setError('Ambos campos son obligatorios.');
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
      setError('Debe ingresar un monto de obra válido (mayor a 0).');
      setResultado(null);
      return;
    }

    setError('');

    let base = 0;
    let tipoTexto = '';
    let detalles = null;
    let parciales = null;

    if (tipoObra === '1') {
      base = calcularBaseArquitectura(vrNum, montoNum);
      tipoTexto = 'Obras de Arquitectura en General';
      detalles = calcularDetalles(base);
    } else if (tipoObra === '2') {
      base = calcularBaseMedicion(vrNum, montoNum);
      tipoTexto = 'Medición y cómputo de obras de Arquitectura';
      // Calcular parciales b) al f)
      parciales = {
        b: base * 0.15,   // 15%
        c: base * 0.75,   // 75%
        d: base * 0.50,   // 50%
        e: base * 0.25,   // 25%
        f: base * 2.00,   // 200%
      };
    } else if (tipoObra === '3') {
      base = calcularBaseEspeciales(vrNum, montoNum);
      tipoTexto = 'Obras especiales (Paisajismo, interiorismo, mobiliario, remodelaciones)';
      detalles = calcularDetalles(base);
    }

    setResultado({
      tipo: tipoObra,
      base,
      detalles,
      parciales,
      vr: vrNum,
      monto: montoNum,
      tipoTexto,
    });
  };

  return (
    <Container fluid className="encargos-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/Encargo_prof.jpg"
          alt="Encargos Profesionales"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/tasaciones.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Encargos o Tareas Profesionales</h2>
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
                <Form.Text className="text-muted">Costo de m2 de construcción ($). Mínimo $1.000.000.</Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Monto de obra *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 75.000.000"
                  value={montoObraDisplay}
                  onChange={handleMontoChange}
                  onBlur={handleMontoBlur}
                />
                <Form.Text className="text-muted">Valor total de la obra o proyecto.</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Tipo de encargo *</Form.Label>
            <Form.Select value={tipoObra} onChange={handleTipoChange}>
              <option value="" disabled>Seleccione tipo de encargo a calcular</option>
              <option value="1">Obras de Arquitectura en General</option>
              <option value="2">Medición y cómputo de obras de Arquitectura</option>
              <option value="3">Obras especiales (Paisajismo, interiorismo, mobiliario, remodelaciones)</option>
            </Form.Select>
          </Form.Group>

          {error && (
            <div style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
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
              <p><strong>VR:</strong> {formatearPesos(resultado.vr)}</p>
              <p><strong>Monto de obra:</strong> {formatearPesos(resultado.monto)}</p>
              <p><strong>Tipo:</strong> {resultado.tipoTexto}</p>
              <p><strong>Base de honorarios:</strong> {formatearPesos(resultado.base)}</p>
            </div>
            <hr />

            {/* Para opción 2: Mostrar parciales */}
            {resultado.tipo === '2' && resultado.parciales && (
              <>
                <h5 className="text-center mt-3" style={{ fontWeight: '700', color: '#15225a' }}>
                  Total de Honorarios (a)
                </h5>
                <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', color: '#15225a', marginBottom: '1.5rem' }}>
                  {formatearPesos(resultado.base)}
                </div>

                <h6 style={{ fontWeight: '600', color: '#15225a', marginBottom: '0.8rem' }}>
                  Parciales:
                </h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #e9ecef' }}>
                    <span>b) Realización de cómputos métricos, sobre la base de mediciones en el lugar y confección de planos (15%)</span>
                    <strong>{formatearPesos(resultado.parciales.b)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #e9ecef' }}>
                    <span>c) Realización de cómputos métricos, sobre la base de planos existentes y adecuados (75%)</span>
                    <strong>{formatearPesos(resultado.parciales.c)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #e9ecef' }}>
                    <span>d) Determinación de superficie cubierta de edificios, sobre la base de mediciones en el lugar (50%)</span>
                    <strong>{formatearPesos(resultado.parciales.d)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #e9ecef' }}>
                    <span>e) Determinación de superficies cubiertas de edificios, sobre la base de planos existentes y adecuados (25%)</span>
                    <strong>{formatearPesos(resultado.parciales.e)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                    <span>f) Medición y liquidación de obras o instalaciones (200%)</span>
                    <strong>{formatearPesos(resultado.parciales.f)}</strong>
                  </div>
                </div>
              </>
            )}

            {/* Para opciones 1 y 3: Mostrar tabla de subdivisión */}
            {resultado.tipo !== '2' && resultado.detalles && (
              <>
                <h5 className="text-center mt-3" style={{ fontWeight: '700', color: '#15225a' }}>
                  Subdivisión de honorarios
                </h5>

                <div className="tabla-tres-columnas">
                  <div className="encabezados">
                    <div className="col-concepto">Concepto</div>
                    <div className="col-total">Encargo Total</div>
                    <div className="col-parcial">Encargo Parcial</div>
                  </div>

                  {[
                    { concepto: 'Estudio y/o croquis preliminares', totalValor: resultado.detalles.total.estudio, parcialValor: resultado.detalles.parcial.estudio },
                    { concepto: 'Anteproyecto', totalValor: resultado.detalles.total.anteproyecto, parcialValor: resultado.detalles.parcial.anteproyecto },
                    { concepto: 'Proyecto', totalValor: resultado.detalles.total.proyecto, parcialValor: resultado.detalles.parcial.proyecto },
                    { concepto: 'Dirección de Obra', totalValor: resultado.detalles.total.direccion, parcialValor: resultado.detalles.parcial.direccion },
                    { concepto: 'Proyecto y Dirección de Obra', totalValor: resultado.detalles.total.proyectoYDireccion, parcialValor: null },
                  ].map((item, index) => (
                    <div className={`fila ${item.parcialValor === null ? 'total-item' : ''}`} key={index}>
                      <div className="col-concepto">{item.concepto}</div>
                      <div className="col-total">{formatearPesos(item.totalValor)}</div>
                      <div className="col-parcial">
                        {item.parcialValor !== null ? formatearPesos(item.parcialValor) : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== BOTÓN VOLVER AL FINAL (discreto) ===== */}
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

export default EncargosProfesionalesC;