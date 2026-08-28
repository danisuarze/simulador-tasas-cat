import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import './PlaneamientoUrbanoTerritorialC.css';

const PlaneamientoUrbanoTerritorialC = ({ onBack }) => {
  // Estados
  const [vrRaw, setVrRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [opcionCalculo, setOpcionCalculo] = useState('');
  const [habitantesRaw, setHabitantesRaw] = useState('');
  const [habitantesDisplay, setHabitantesDisplay] = useState('');
  const [presupuestoRaw, setPresupuestoRaw] = useState('');
  const [presupuestoDisplay, setPresupuestoDisplay] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  // Efectos
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setResultado(null);
    setError('');
  }, [vrRaw, opcionCalculo, habitantesRaw, presupuestoRaw]);

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

  const handleHabitantesChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setHabitantesRaw(raw);
    setHabitantesDisplay(formatNumber(raw));
  };

  const handleHabitantesBlur = () => {
    setHabitantesDisplay(formatNumber(habitantesRaw));
  };

  const handlePresupuestoChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPresupuestoRaw(raw);
    setPresupuestoDisplay(formatNumber(raw));
  };

  const handlePresupuestoBlur = () => {
    setPresupuestoDisplay(formatNumber(presupuestoRaw));
  };

  // Cálculo por población (acumulativo)
  const calcularPorPoblacion = (vr, habitantes) => {
    if (vr <= 0 || habitantes <= 0) return 0;

    const tramos = [
      { limite: 10000, porcentaje: 0.0075 },
      { limite: 20000, porcentaje: 0.0060 },
      { limite: 30000, porcentaje: 0.0045 },
      { limite: 40000, porcentaje: 0.0030 },
      { limite: 50000, porcentaje: 0.0030 },
      { limite: 100000, porcentaje: 0.0018 },
      { limite: 200000, porcentaje: 0.0015 },
      { limite: 500000, porcentaje: 0.0014 },
      { limite: Infinity, porcentaje: 0.0008 },
    ];

    let total = 0;
    let restantes = habitantes;
    let anterior = 0;

    for (let i = 0; i < tramos.length; i++) {
      const actual = tramos[i].limite;
      const ancho = Math.min(restantes, actual - anterior);
      if (ancho <= 0) break;
      total += ancho * vr * tramos[i].porcentaje;
      restantes -= ancho;
      anterior = actual;
      if (restantes <= 0) break;
    }

    return total;
  };

  // Cálculo por presupuesto (15%)
  const calcularPorPresupuesto = (presupuesto) => {
    if (presupuesto <= 0) return 0;
    return presupuesto * 0.15;
  };

  // Cálculo de etapas
  const calcularEtapas = (base, etapas) => {
    return etapas.map(etapa => ({
      nombre: etapa.nombre,
      porcentaje: etapa.porcentaje,
      valor: base * (etapa.porcentaje / 100)
    }));
  };

  const handleCalcular = () => {
    const vrNum = parseFloat(vrRaw);
    const habitantesNum = parseFloat(habitantesRaw) || 0;
    const presupuestoNum = parseFloat(presupuestoRaw) || 0;

    if (opcionCalculo === '') {
      setError('Debe seleccionar una opción de cálculo.');
      setResultado(null);
      return;
    }

    if (vrRaw === '') {
      setError('Debe ingresar el Valor de Referencia (VR).');
      setResultado(null);
      return;
    }

    if (vrNum < 1000000) {
      setError('El VR no puede ser menor a $1.000.000.');
      setResultado(null);
      return;
    }

    if (isNaN(vrNum) || vrNum <= 0) {
      setError('Debe ingresar un VR válido (mayor a 0).');
      setResultado(null);
      return;
    }

    if (opcionCalculo === 'poblacion') {
      if (habitantesRaw === '' || habitantesNum <= 0) {
        setError('Debe ingresar una cantidad de habitantes válida (mayor a 0).');
        setResultado(null);
        return;
      }
    } else if (opcionCalculo === 'presupuesto') {
      if (presupuestoRaw === '' || presupuestoNum <= 0) {
        setError('Debe ingresar un monto de presupuesto válido (mayor a 0).');
        setResultado(null);
        return;
      }
    }

    setError('');

    let base = 0;
    let descripcionBase = '';

    if (opcionCalculo === 'poblacion') {
      base = calcularPorPoblacion(vrNum, habitantesNum);
      descripcionBase = `Cálculo por población (${habitantesNum} habitantes)`;
    } else {
      base = calcularPorPresupuesto(presupuestoNum);
      descripcionBase = `Cálculo por presupuesto (15% del monto)`;
    }

    const tipologias = [
      {
        id: 'A',
        nombre: 'Planes de Desarrollo Urbano y Regional',
        etapas: [
          { nombre: 'a) Diagnóstico Territorial estratégico', porcentaje: 10 },
          { nombre: 'b) Análisis Urbano-territorial integrado', porcentaje: 30 },
          { nombre: 'c) Formulación del plan', porcentaje: 30 },
          { nombre: 'd) Lineamiento operativos', porcentaje: 30 },
        ]
      },
      {
        id: 'B',
        nombre: 'Planes de urbanización',
        etapas: [
          { nombre: 'a) Anteproyecto', porcentaje: 35 },
          { nombre: 'b) Proyecto', porcentaje: 65 },
        ]
      },
      {
        id: 'C',
        nombre: 'Regeneración y remodelación urbana',
        etapas: [
          { nombre: 'a) Diagnósticos', porcentaje: 35 },
          { nombre: 'b) Proyecto', porcentaje: 65 },
        ]
      },
      {
        id: 'D',
        nombre: 'Nuevos desarrollos urbanos',
        etapas: [
          { nombre: 'a) Anteproyecto', porcentaje: 30 },
          { nombre: 'b) Proyecto', porcentaje: 70 },
        ]
      },
      {
        id: 'E',
        nombre: 'Estudios e investigaciones especiales',
        etapas: [{ nombre: 'Honorarios según complejidad', porcentaje: 0 }],
        esEspecial: true
      },
      {
        id: 'F',
        nombre: 'Asistencia técnica',
        etapas: [{ nombre: 'Honorarios convencionales', porcentaje: 0 }],
        esEspecial: true
      }
    ];

    const tipologiasConEtapas = tipologias.map(tip => {
      if (tip.esEspecial) {
        return {
          ...tip,
          etapas: tip.etapas.map(e => ({ ...e, valor: null }))
        };
      }
      return {
        ...tip,
        etapas: calcularEtapas(base, tip.etapas)
      };
    });

    setResultado({
      vr: vrNum,
      opcion: opcionCalculo,
      habitantes: opcionCalculo === 'poblacion' ? habitantesNum : null,
      presupuesto: opcionCalculo === 'presupuesto' ? presupuestoNum : null,
      base,
      descripcionBase,
      tipologias: tipologiasConEtapas,
    });
  };

  const formatearPesos = (numero) => {
    if (numero === null || numero === undefined) return '';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
      .format(numero)
      .replace('ARS', '$');
  };

  return (
    <Container fluid className="planeamiento-container">
      {/* Imagen */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/propuesta_urbana.jpg"
          alt="Planeamiento Urbano Territorial"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/propuesta_urbana.jpg';
          }}
        />
      </div>

      {/* Títulos */}
      <div className="text-center mb-4">
        <h2 className="main-title">Planeamiento y Programación Urbano Territorial</h2>
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
                <Form.Label>Opción de cálculo *</Form.Label>
                <Form.Select
                  value={opcionCalculo}
                  onChange={(e) => setOpcionCalculo(e.target.value)}
                >
                  <option value="" disabled>Seleccione una opción</option>
                  <option value="poblacion">1) Honorarios en función de la población involucrada</option>
                  <option value="presupuesto">2) Honorarios sobre presupuesto estimado de obra</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {opcionCalculo === 'poblacion' && (
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad de habitantes involucrados *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 25.000"
                    value={habitantesDisplay}
                    onChange={handleHabitantesChange}
                    onBlur={handleHabitantesBlur}
                  />
                  <Form.Text className="text-muted">
                    Tasa básica mínima por habitante, aplicada en forma acumulativa según tabla de tramos.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          )}

          {opcionCalculo === 'presupuesto' && (
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Monto estimado de obra *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 50.000.000"
                    value={presupuestoDisplay}
                    onChange={handlePresupuestoChange}
                    onBlur={handlePresupuestoBlur}
                  />
                  <Form.Text className="text-muted">
                    El honorario se calcula como el 15% del monto estimado.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="d-grid">
            <Button onClick={handleCalcular} className="calcular-btn">
              <FaCalculator className="me-2" /> Calcular honorarios
            </Button>
          </div>
        </Form>

        {resultado && (
          <div className="resultado-card mt-4">
            <h4 className="text-center">Resultado del cálculo</h4>

            <div className="resumen-datos">
              <p><strong>VR:</strong> {formatearPesos(resultado.vr)}</p>
              {resultado.opcion === 'poblacion' && (
                <p><strong>Habitantes:</strong> {resultado.habitantes.toLocaleString('es-AR')}</p>
              )}
              {resultado.opcion === 'presupuesto' && (
                <p><strong>Presupuesto estimado:</strong> {formatearPesos(resultado.presupuesto)}</p>
              )}
              <p><strong>Base de honorarios:</strong> {formatearPesos(resultado.base)}</p>
              <p style={{ fontStyle: 'italic', color: '#6c757d', fontSize: '0.9rem' }}>
                {resultado.descripcionBase}
              </p>
            </div>

            <hr />

            <h5 className="text-center mt-3" style={{ fontWeight: '700', color: '#15225a' }}>
              Tipologías de Servicios Profesionales
            </h5>

            {resultado.tipologias.map((tipologia, index) => (
              <div key={index} className="tipologia-container">
                <h6 style={{ fontWeight: '600', color: '#040D3B', marginTop: '1.2rem', marginBottom: '0.5rem' }}>
                  {tipologia.id}) {tipologia.nombre}
                </h6>

                {tipologia.esEspecial ? (
                  <div style={{ padding: '0.5rem 0.8rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontStyle: 'italic', color: '#6c757d' }}>
                    {tipologia.etapas[0].nombre}
                  </div>
                ) : (
                  <div className="etapas-container">
                    {tipologia.etapas.map((etapa, idx) => (
                      <div key={idx} className="etapa-item">
                        <span className="etapa-concepto">{etapa.nombre} ({etapa.porcentaje}%)</span>
                        <span className="etapa-valor">{formatearPesos(etapa.valor)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="aclaracion-container">
              <p className="aclaracion-texto">
                Los gastos extraordinarios necesarios para la ejecución del servicio profesional no se consideran incluidos en los honorarios y deberán ser abonados por el comitente, previa justificación.
              </p>
            </div>

            {/* Botón Volver dentro de resultados - ahora transparente como en Tasaciones */}
            <div className="text-center mt-4">
              <Button
                variant="outline-secondary"
                onClick={onBack}
                className="btn-volver-planeamiento"
              >
                <FaArrowLeft className="me-2" /> Volver a especialidades
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Botón Volver fuera de resultados - transparente como en Tasaciones */}
      {!resultado && (
        <div className="text-center mt-4">
          <Button
            variant="outline-secondary"
            onClick={onBack}
            className="btn-volver-planeamiento"
          >
            <FaArrowLeft className="me-2" /> Volver a especialidades
          </Button>
        </div>
      )}
    </Container>
  );
};

export default PlaneamientoUrbanoTerritorialC;