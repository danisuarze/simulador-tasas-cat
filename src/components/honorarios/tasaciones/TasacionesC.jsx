import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';

const TasacionesC = ({ onBack }) => {
  const [vrRaw, setVrRaw] = useState('');
  const [valorJuegoRaw, setValorJuegoRaw] = useState('');
  const [vrDisplay, setVrDisplay] = useState('');
  const [valorJuegoDisplay, setValorJuegoDisplay] = useState('');
  const [tipoHonorario, setTipoHonorario] = useState('1');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

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

  // TABLA OPCIÓN 1: Tasaciones rápidas
  const calcularTasacionesRapidas = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 4, porcentaje: 0.0075 },    // 0.75%
      { multiplo: 6, porcentaje: 0.0065 },    // 0.65%
      { multiplo: 50, porcentaje: 0.0055 },   // 0.55%
      { multiplo: 60, porcentaje: 0.0050 },   // 0.50%
      { multiplo: 280, porcentaje: 0.0045 },  // 0.45%
      { multiplo: 400, porcentaje: 0.0040 },  // 0.40%
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

    // Más de 400 VR = 0.15%
    if (resto > 0) {
      total += resto * 0.0015; // 0.15%
    }
    return total;
  };

  // TABLA OPCIÓN 2: Terrenos sin edificación | Sin confección de planos
  const calcularTerrenosSinEdificacion = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 4, porcentaje: 0.03 },     // 3%
      { multiplo: 6, porcentaje: 0.025 },    // 2.5%
      { multiplo: 50, porcentaje: 0.02 },    // 2%
      { multiplo: 60, porcentaje: 0.015 },   // 1.50%
      { multiplo: 280, porcentaje: 0.01 },   // 1%
      { multiplo: 400, porcentaje: 0.005 },  // 0.50%
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

    // Mayor a 400 VR = 0.25%
    if (resto > 0) {
      total += resto * 0.0025; // 0.25%
    }
    return total;
  };

  // TABLA OPCIÓN 3: Adicional por confección de planos
  const calcularAdicionalPlanos = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 100, porcentaje: 0.0060 },    // 0.60%
      { multiplo: 1000, porcentaje: 0.0030 },   // 0.30%
      { multiplo: 10000, porcentaje: 0.0010 },  // 0.10%
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

    // Mayor a 10000 VR = 0.05%
    if (resto > 0) {
      total += resto * 0.0005; // 0.05%
    }
    return total;
  };

  // TABLA OPCIÓN 4: Terrenos con edificación
  const calcularTerrenosConEdificacion = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 4, porcentaje: 0.04 },     // 4%
      { multiplo: 6, porcentaje: 0.035 },    // 3.50%
      { multiplo: 50, porcentaje: 0.03 },    // 3%
      { multiplo: 60, porcentaje: 0.025 },   // 2.50%
      { multiplo: 280, porcentaje: 0.02 },   // 2%
      { multiplo: 400, porcentaje: 0.015 },  // 1.50%
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

    // Mayor a 400 VR = 1%
    if (resto > 0) {
      total += resto * 0.01; // 1%
    }
    return total;
  };

  // TABLA OPCIÓN 5: Con cómputos sobre plano existente
  const calcularComputosPlanoExistente = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 4, porcentaje: 0.05 },     // 5%
      { multiplo: 6, porcentaje: 0.045 },    // 4.5%
      { multiplo: 50, porcentaje: 0.04 },    // 4%
      { multiplo: 60, porcentaje: 0.035 },   // 3.5%
      { multiplo: 280, porcentaje: 0.03 },   // 3%
      { multiplo: 400, porcentaje: 0.025 },  // 2.5%
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

    // Mayor a 400 VR = 1.50%
    if (resto > 0) {
      total += resto * 0.015; // 1.50%
    }
    return total;
  };

  // TABLA OPCIÓN 6: Sobre planos a ejecutar
  const calcularPlanosEjecutar = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 4, porcentaje: 0.06 },     // 6%
      { multiplo: 6, porcentaje: 0.055 },    // 5.5%
      { multiplo: 50, porcentaje: 0.05 },    // 5%
      { multiplo: 60, porcentaje: 0.045 },   // 4.5%
      { multiplo: 280, porcentaje: 0.04 },   // 4%
      { multiplo: 400, porcentaje: 0.035 },  // 3.50%
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

    // Mayor a 400 VR = 1.75%
    if (resto > 0) {
      total += resto * 0.0175; // 1.75%
    }
    return total;
  };

  // TABLA OPCIÓN 7: Sobre plano relevado en obra (NUEVA)
  const calcularPlanoRelevado = (vr, valorJuego) => {
    if (vr <= 0 || valorJuego <= 0) return 0;

    const limites = [
      { multiplo: 4, porcentaje: 0.065 },    // 6.5%
      { multiplo: 6, porcentaje: 0.06 },     // 6%
      { multiplo: 50, porcentaje: 0.055 },   // 5.5%
      { multiplo: 60, porcentaje: 0.05 },    // 5%
      { multiplo: 280, porcentaje: 0.045 },  // 4.5%
      { multiplo: 400, porcentaje: 0.04 },   // 4%
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

    // Mayor a 400 VR = 2%
    if (resto > 0) {
      total += resto * 0.02; // 2%
    }
    return total;
  };

  const handleCalcular = () => {
    const vrNum = parseFloat(vrRaw);
    const valorJuegoNum = parseFloat(valorJuegoRaw);

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
    let adicionalPlanos = 0;
    let honorarioTotal = 0;
    let soloPlanos = 0;

    switch (tipoHonorario) {
      case '1':
        honorarios = calcularTasacionesRapidas(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Tasaciones rápidas)';
        complejidadTexto = 'Complejidad baja';
        descripcionTexto = 'Comprende tasaciones de carácter expeditivo, de tipo extrajudicial, con o sin informe escrito, en las cuales no se requiere fundamentación detallada.';
        honorarioTotal = honorarios;
        break;
      case '2':
        honorarios = calcularTerrenosSinEdificacion(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Terrenos sin edificación | Sin confección de planos)';
        complejidadTexto = 'Complejidad media';
        descripcionTexto = 'Comprende tasaciones de terrenos sin mejoras, urbanos o rurales, sin confección de planos.';
        honorarioTotal = honorarios;
        break;
      case '3':
        honorarios = calcularTerrenosSinEdificacion(vrNum, valorJuegoNum);
        adicionalPlanos = calcularAdicionalPlanos(vrNum, valorJuegoNum);
        honorarioTotal = honorarios + adicionalPlanos;
        concepto = 'Terrenos sin edificación | Con confección de planos';
        complejidadTexto = 'Complejidad media - alta';
        descripcionTexto = 'Comprende tasaciones de terrenos sin mejoras, urbanos o rurales, con confección de planos.';
        break;
      case '4':
        honorarios = calcularTerrenosConEdificacion(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Terrenos con edificación)';
        complejidadTexto = 'Complejidad alta';
        descripcionTexto = 'Comprende tasaciones de terrenos con mejoras, edificaciones, construcciones o instalaciones existentes.';
        honorarioTotal = honorarios;
        soloPlanos = calcularAdicionalPlanos(vrNum, valorJuegoNum);
        break;
      case '5':
        honorarios = calcularComputosPlanoExistente(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Con cómputos sobre plano existente)';
        complejidadTexto = 'Complejidad alta';
        descripcionTexto = 'Comprende tasaciones que requieren cómputos detallados sobre planos existentes, con mediciones y análisis de superficies.';
        honorarioTotal = honorarios;
        break;
      case '6':
        honorarios = calcularPlanosEjecutar(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Sobre planos a ejecutar)';
        complejidadTexto = 'Complejidad muy alta';
        descripcionTexto = 'Comprende tasaciones sobre planos a ejecutar, que requieren análisis de proyectos, cálculos de materiales y proyecciones de costos.';
        honorarioTotal = honorarios;
        break;
      case '7':
        honorarios = calcularPlanoRelevado(vrNum, valorJuegoNum);
        concepto = 'Total de honorarios calculados (Sobre plano relevado en obra)';
        complejidadTexto = 'Complejidad máxima';
        descripcionTexto = 'Comprende tasaciones con relevamiento en obra, que requieren mediciones in situ, verificación de planos y análisis detallado de la construcción existente.';
        honorarioTotal = honorarios;
        break;
      default:
        honorarios = 0;
        concepto = 'Opción en desarrollo. Próximamente disponible.';
        complejidadTexto = '';
        descripcionTexto = '';
        honorarioTotal = 0;
        soloPlanos = 0;
    }

    setResultado({ 
      honorarios, 
      concepto, 
      vr: vrNum, 
      valorJuego: valorJuegoNum, 
      complejidadTexto, 
      descripcionTexto,
      adicionalPlanos,
      honorarioTotal,
      tipoHonorario,
      soloPlanos
    });
  };

  const formatearPesos = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero).replace('ARS', '$');
  };

  const getTipoTexto = () => {
    if (tipoHonorario === '1') return 'Tasaciones rápidas';
    if (tipoHonorario === '2') return 'Terrenos sin edificación | Sin confección de planos';
    if (tipoHonorario === '3') return 'Terrenos sin edificación | Con confección de planos';
    if (tipoHonorario === '4') return 'Terrenos con edificación';
    if (tipoHonorario === '5') return 'Con cómputos sobre plano existente';
    if (tipoHonorario === '6') return 'Sobre planos a ejecutar';
    if (tipoHonorario === '7') return 'Sobre plano relevado en obra';
    return `Opción ${tipoHonorario}`;
  };

  return (
    <Container className="my-4" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-4">
        <Button onClick={onBack} variant="secondary" className="mb-3">
          <FaArrowLeft className="me-2" /> Volver a especialidades
        </Button>
        <h2 className="main-title">Tasaciones</h2>
        <p className="subtitle">Complete los datos para calcular honorarios</p>
      </div>

      <div className="p-4 bg-white rounded shadow-sm">
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
              <option value="1">1.- Tasaciones rápidas</option>
              <option value="2">2.- Terrenos sin edificación | Sin confección de planos</option>
              <option value="3">3.- Terrenos sin edificación | Con confección de planos</option>
              <option value="4">4.- Terrenos con edificación</option>
              <option value="5">5.- Con cómputos sobre plano existente</option>
              <option value="6">6.- Sobre planos a ejecutar</option>
              <option value="7">7.- Sobre plano relevado en obra</option>
            </Form.Select>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="text-center">
            <Button variant="primary" onClick={handleCalcular} className="card-button" style={{ padding: '0.6rem 2rem' }}>
              <FaCalculator className="me-2" /> Calcular honorarios
            </Button>
          </div>
        </Form>

        {resultado && (
          <div className="mt-4 p-3 bg-light rounded" style={{ borderLeft: '5px solid #7B9C6B' }}>
            <h4 className="text-center">Resultado del cálculo</h4>
            <p className="text-center"><strong>VR (Valor de Referencia):</strong> {formatearPesos(resultado.vr)}</p>
            <p className="text-center"><strong>Valor en juego:</strong> {formatearPesos(resultado.valorJuego)}</p>
            <p className="text-center"><strong>Tipo seleccionado:</strong> {getTipoTexto()}</p>
            <hr />
            <div className="text-center">
              <p><strong>CONCEPTO</strong></p>
              <p><strong>Total de Cálculos de Honorarios</strong></p>
              <p>({getTipoTexto()})</p>
            </div>

            {resultado.tipoHonorario === '3' && (
              <div className="mt-3">
                <div className="p-2 bg-white rounded" style={{ border: '1px solid #dee2e6' }}>
                  <p className="mb-1"><strong>1. Tasación:</strong> {formatearPesos(resultado.honorarios)}</p>
                  <p className="mb-1"><strong>2. Confección de planos:</strong> {formatearPesos(resultado.adicionalPlanos)}</p>
                  <hr className="my-2" />
                  <p className="mb-0" style={{ fontSize: '1.1rem' }}>
                    <strong>TOTAL HONORARIOS:</strong> <span style={{ fontSize: '1.3rem', color: '#15225a' }}>{formatearPesos(resultado.honorarioTotal)}</span>
                  </p>
                </div>
              </div>
            )}

            {(resultado.tipoHonorario === '1' || resultado.tipoHonorario === '2' || resultado.tipoHonorario === '4' || resultado.tipoHonorario === '5' || resultado.tipoHonorario === '6' || resultado.tipoHonorario === '7') && (
              <p className="text-center"><strong>Total:</strong> <strong style={{ fontSize: '1.5rem', color: '#15225a' }}>{formatearPesos(resultado.honorarios)}</strong></p>
            )}

            {(resultado.tipoHonorario === '1' || resultado.tipoHonorario === '2' || resultado.tipoHonorario === '4' || resultado.tipoHonorario === '5' || resultado.tipoHonorario === '6' || resultado.tipoHonorario === '7') && resultado.complejidadTexto && (
              <div className="mt-3 text-center">
                <p><strong>{resultado.complejidadTexto}</strong></p>
                <p style={{ fontSize: '0.85rem', color: '#6c757d', lineHeight: '1.4', marginBottom: '0.25rem' }}>
                  {resultado.descripcionTexto}
                </p>
              </div>
            )}

            {/* Aclaración "Variante con confección de planos" - SOLO PARA OPCIÓN 4 */}
            {resultado.tipoHonorario === '4' && resultado.soloPlanos > 0 && (
              <div className="mt-3 pt-3" style={{ borderTop: '2px dashed #dee2e6' }}>
                <p style={{ fontSize: '0.95rem', color: '#495057', marginBottom: '0.25rem' }}>
                  <strong>Variante con confección de planos:</strong>
                </p>
                <p style={{ fontSize: '0.95rem', color: '#15225a', fontWeight: '500' }}>
                  {formatearPesos(resultado.soloPlanos)}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#6c757d', fontStyle: 'italic' }}>
                  * Honorario correspondiente únicamente a la confección de planos (Opción 3)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default TasacionesC;