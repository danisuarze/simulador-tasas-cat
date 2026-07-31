import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import './TasacionesC.css';

const TasacionesC = ({ onBack }) => {
  // Estados
  const [vrRaw, setVrRaw] = useState('');
  const [valorJuegoRaw, setValorJuegoRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [valorJuegoDisplay, setValorJuegoDisplay] = useState('');
  const [tipoHonorario, setTipoHonorario] = useState('');
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

  const handleValorJuegoChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setValorJuegoRaw(raw);
    setValorJuegoDisplay(formatNumber(raw));
  };

  const handleValorJuegoBlur = () => {
    setValorJuegoDisplay(formatNumber(valorJuegoRaw));
  };

  // ========== FUNCIONES DE CÁLCULO (SOLO UNA VEZ) ==========
  const calcularTasacionesRapidas = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;
    const limites = [
      { multiplo: 4, porcentaje: 0.0075 },
      { multiplo: 6, porcentaje: 0.0065 },
      { multiplo: 50, porcentaje: 0.0055 },
      { multiplo: 60, porcentaje: 0.0050 },
      { multiplo: 280, porcentaje: 0.0045 },
      { multiplo: 400, porcentaje: 0.0040 },
    ];
    let resto = valorJuego;
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
      total += resto * 0.0015;
    }
    return total;
  };

  const calcularTerrenosSinEdificacion = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;
    const limites = [
      { multiplo: 4, porcentaje: 0.03 },
      { multiplo: 6, porcentaje: 0.025 },
      { multiplo: 50, porcentaje: 0.02 },
      { multiplo: 60, porcentaje: 0.015 },
      { multiplo: 280, porcentaje: 0.01 },
      { multiplo: 400, porcentaje: 0.005 },
    ];
    let resto = valorJuego;
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
      total += resto * 0.0025;
    }
    return total;
  };

  const calcularTerrenosConEdificacion = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;
    const limites = [
      { multiplo: 4, porcentaje: 0.04 },
      { multiplo: 6, porcentaje: 0.035 },
      { multiplo: 50, porcentaje: 0.03 },
      { multiplo: 60, porcentaje: 0.025 },
      { multiplo: 280, porcentaje: 0.02 },
      { multiplo: 400, porcentaje: 0.015 },
    ];
    let resto = valorJuego;
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
      total += resto * 0.01;
    }
    return total;
  };

  const calcularComputosPlanoExistente = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;
    const limites = [
      { multiplo: 4, porcentaje: 0.05 },
      { multiplo: 6, porcentaje: 0.045 },
      { multiplo: 50, porcentaje: 0.04 },
      { multiplo: 60, porcentaje: 0.035 },
      { multiplo: 280, porcentaje: 0.03 },
      { multiplo: 400, porcentaje: 0.025 },
    ];
    let resto = valorJuego;
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
      total += resto * 0.015;
    }
    return total;
  };

  const calcularPlanosEjecutar = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;
    const limites = [
      { multiplo: 4, porcentaje: 0.06 },
      { multiplo: 6, porcentaje: 0.055 },
      { multiplo: 50, porcentaje: 0.05 },
      { multiplo: 60, porcentaje: 0.045 },
      { multiplo: 280, porcentaje: 0.04 },
      { multiplo: 400, porcentaje: 0.035 },
    ];
    let resto = valorJuego;
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
      total += resto * 0.0175;
    }
    return total;
  };

  const calcularPlanoRelevado = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;
    const limites = [
      { multiplo: 4, porcentaje: 0.065 },
      { multiplo: 6, porcentaje: 0.06 },
      { multiplo: 50, porcentaje: 0.055 },
      { multiplo: 60, porcentaje: 0.05 },
      { multiplo: 280, porcentaje: 0.045 },
      { multiplo: 400, porcentaje: 0.04 },
    ];
    let resto = valorJuego;
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
      total += resto * 0.02;
    }
    return total;
  };
  // ========== FIN FUNCIONES DE CÁLCULO ==========

  // ========== HANDLE CALCULAR (ÚNICO) ==========
  const handleCalcular = () => {
    const vrNum = parseFloat(vrRaw);
    const valorJuegoNum = parseFloat(valorJuegoRaw);

    if (tipoHonorario === '') {
      setError('Debe seleccionar un tipo de tasación.');
      setResultado(null);
      return;
    }

    if (vrRaw === '' || valorJuegoRaw === '') {
      setError('Debe completar ambos campos.');
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

    if (isNaN(valorJuegoNum) || valorJuegoNum <= 0) {
      setError('Debe ingresar un Valor en juego válido (mayor a 0).');
      setResultado(null);
      return;
    }

    setError('');

    let honorarios = 0;
    let concepto = '';
    let complejidadTexto = '';
    let descripcionTexto = '';

    switch (tipoHonorario) {
      case '1':
        honorarios = calcularTasacionesRapidas(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Tasaciones rápidas)';
        complejidadTexto = 'Complejidad baja';
        descripcionTexto = 'Comprende tasaciones de carácter expeditivo, de tipo extrajudicial, con o sin informe escrito, en las cuales no se requiere fundamentación detallada.';
        break;
      case '2':
        honorarios = calcularTerrenosSinEdificacion(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Terrenos sin edificación | Sin confección de planos)';
        complejidadTexto = 'Complejidad media';
        descripcionTexto = 'Comprende tasaciones de terrenos sin mejoras, urbanos o rurales, sin confección de planos.';
        break;
      case '3':
        honorarios = calcularTerrenosSinEdificacion(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Terrenos sin edificación | Con confección de planos)';
        complejidadTexto = 'Complejidad media - alta';
        descripcionTexto = 'Comprende tasaciones de terrenos sin mejoras, urbanos o rurales, con confección de planos.';
        break;
      case '4':
        honorarios = calcularTerrenosConEdificacion(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Terrenos con edificación)';
        complejidadTexto = 'Complejidad alta';
        descripcionTexto = 'Comprende tasaciones de terrenos con mejoras, edificaciones, construcciones o instalaciones existentes.';
        break;
      case '5':
        honorarios = calcularComputosPlanoExistente(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Con cómputos sobre plano existente)';
        complejidadTexto = 'Complejidad alta';
        descripcionTexto = 'Comprende tasaciones que requieren cómputos detallados sobre planos existentes, con mediciones y análisis de superficies.';
        break;
      case '6':
        honorarios = calcularPlanosEjecutar(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Sobre planos a ejecutar)';
        complejidadTexto = 'Complejidad muy alta';
        descripcionTexto = 'Comprende tasaciones sobre planos a ejecutar, que requieren análisis de proyectos, cálculos de materiales y proyecciones de costos.';
        break;
      case '7':
        honorarios = calcularPlanoRelevado(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Sobre plano relevado en obra)';
        complejidadTexto = 'Complejidad máxima';
        descripcionTexto = 'Comprende tasaciones con relevamiento en obra, que requieren mediciones in situ, verificación de planos y análisis detallado de la construcción existente.';
        break;
      default:
        honorarios = 0;
        concepto = 'Opción en desarrollo. Próximamente disponible.';
        complejidadTexto = '';
        descripcionTexto = '';
    }

    setResultado({
      honorarios,
      concepto,
      vr: vrNum,
      valorJuego: valorJuegoNum,
      complejidadTexto,
      descripcionTexto,
    });
  };
  // ========== FIN HANDLE CALCULAR ==========

  const formatearPesos = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
      .format(numero)
      .replace('ARS', '$');
  };

  const getTipoTexto = () => {
    if (tipoHonorario === '1') return 'Tasaciones rápidas';
    if (tipoHonorario === '2') return 'Terrenos sin edificación | Sin confección de planos';
    if (tipoHonorario === '3') return 'Terrenos sin edificación | Con confección de planos';
    if (tipoHonorario === '4') return 'Terrenos con edificación';
    if (tipoHonorario === '5') return 'Con cómputos sobre plano existente';
    if (tipoHonorario === '6') return 'Sobre planos a ejecutar';
    if (tipoHonorario === '7') return 'Sobre plano relevado en obra';
    return 'Seleccione tipo de tasación';
  };

  return (
    <Container fluid className="tasaciones-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/tasaciones.jpg"
          alt="Tasaciones"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/tasaciones.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Tasaciones</h2>
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
                <Form.Label>Valor en juego *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 75.000.000"
                  value={valorJuegoDisplay}
                  onChange={handleValorJuegoChange}
                  onBlur={handleValorJuegoBlur}
                />
                <Form.Text className="text-muted">Valor económico de los bienes.</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Tipo de honorarios *</Form.Label>
            <Form.Select value={tipoHonorario} onChange={(e) => setTipoHonorario(e.target.value)}>
              <option value="" disabled>
                Seleccione el tipo de tasación a calcular
              </option>
              <option value="1">1.- Tasaciones rápidas</option>
              <option value="2">2.- Terrenos sin edificación | Sin confección de planos</option>
              <option value="3">3.- Terrenos sin edificación | Con confección de planos</option>
              <option value="4">4.- Terrenos con edificación</option>
              <option value="5">5.- Con cómputos sobre plano existente</option>
              <option value="6">6.- Sobre planos a ejecutar</option>
              <option value="7">7.- Sobre plano relevado en obra</option>
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
              <p>
                <strong>VR (Valor de Referencia):</strong> {formatearPesos(resultado.vr)}
              </p>
              <p>
                <strong>Valor en juego:</strong> {formatearPesos(resultado.valorJuego)}
              </p>
              <p>
                <strong>Tipo seleccionado:</strong> {getTipoTexto()}
              </p>
            </div>
            <hr />
            <div className="text-center">
              <p>
                <strong>CONCEPTO</strong>
              </p>
              <p>
                <strong>Total de Cálculos de Honorarios</strong>
              </p>
              <p>({getTipoTexto()})</p>
            </div>
            <p className="text-center">
              <strong>Total:</strong> <strong className="total-valor">{formatearPesos(resultado.honorarios)}</strong>
            </p>

            {(tipoHonorario === '1' || tipoHonorario === '2') && resultado.complejidadTexto && (
              <div className="mt-3 text-center">
                <p>
                  <strong>{resultado.complejidadTexto}</strong>
                </p>
                <p className="descripcion-texto">{resultado.descripcionTexto}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón Volver al final (discreto) */}
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

export default TasacionesC;