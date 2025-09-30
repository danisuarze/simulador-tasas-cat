import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaHome, FaCalculator, FaArrowLeft } from 'react-icons/fa';
import "./Viviendas.css";

const Viviendas = ({ onBack = () => {} }) => {  // <-- VALOR POR DEFECTO AGREGADO AQUÍ
  // Constantes
  const VPTR = 950;
  const TASA_MINIMA = 20 * VPTR; // $19,000

  // Estados
  const [tipoObra, setTipoObra] = useState('nueva');
  const [m2Vivienda, setM2Vivienda] = useState('');
  const [m2Construida, setM2Construida] = useState('');
  const [m2Ampliacion, setM2Ampliacion] = useState('');
  const [m2AntecedenteAmpliacion, setM2AntecedenteAmpliacion] = useState('');
  const [m2AntecedenteConstruida, setM2AntecedenteConstruida] = useState('');
  const [montoRefaccion, setMontoRefaccion] = useState('');
  const [montoRefaccionAmpliacion, setMontoRefaccionAmpliacion] = useState('');
  const [m2AmpliacionRefaccion, setM2AmpliacionRefaccion] = useState('');
  const [tareaSeleccionada, setTareaSeleccionada] = useState('Anteproyecto');
  const [avanceVivienda, setAvanceVivienda] = useState('');
  const [resultados, setResultados] = useState(null);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular el valor según los tramos de m2
  const calcularPorTramos = (m2) => {
    let total = 0;
    
    // Primeros 200m² al 100%
    const tramo1 = Math.min(m2, 200);
    total += tramo1 * VPTR;
    
    // Siguientes 200m² al 80%
    if (m2 > 200) {
      const tramo2 = Math.min(m2 - 200, 200);
      total += tramo2 * VPTR * 0.8;
    }
    
    // Resto al 100%
    if (m2 > 400) {
      const tramo3 = m2 - 400;
      total += tramo3 * VPTR;
    }
    
    return total;
  };

  // Función para calcular resultados - ESTA ES LA FUNCIÓN PRINCIPAL
  const calcularVivienda = () => {
    console.log("✅ Ejecutando calcularVivienda..."); // Para debug
    
    let m2 = 0;
    let avance = parseFloat(avanceVivienda) || 0;
    
    // Validaciones según el tipo de obra
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      if (construida <= 0 || ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese valores válidos para superficie construida y ampliación."
        });
        return;
      }
      
      if (antecedente > construida) {
        setResultados({
          error: `Error: La superficie de antecedente (${antecedente} m²) no puede ser mayor que la superficie construida (${construida} m²).`
        });
        return;
      }
      
      m2 = construida + ampliacion;
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      
      if (monto <= 0) {
        setResultados({
          error: "Por favor, ingrese un monto válido para la refacción."
        });
        return;
      }
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      if (monto <= 0 || ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese valores válidos para el monto de refacción y la superficie de ampliación."
        });
        return;
      }
    } else {
      m2 = parseFloat(m2Vivienda) || 0;
      
      if (m2 <= 0) {
        setResultados({
          error: "Por favor, ingrese un valor válido para los metros cuadrados."
        });
        return;
      }
    }

    let html = [];
    
    // Mostrar información específica para cada tipo de obra
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      html.push({ label: "Superficie Construida", value: `${construida} m²` });
      html.push({ label: "Superficie Ampliación", value: `${ampliacion} m²` });
      html.push({ label: "Superficie Total", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
    } else if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      html.push({ label: "Monto de Obra", value: formatoMoneda(monto) });
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      html.push({ label: "Monto de Refacción", value: formatoMoneda(monto) });
      html.push({ label: "Superficie de Ampliación", value: `${ampliacion} m²` });
    } else {
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
    }
    
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    
    if (tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion') {
      html.push({ label: "% Avance de Obra", value: `${avance}% (solo aplica a Dirección Técnica)` });
    }
    
    let tasaRetributiva = 0;
    let descripcionServicio = "";

    // Lógica de cálculo según tipo de obra
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      let m2Relevamiento = m2;
      
      if (antecedente > 0) {
        m2Relevamiento = m2 - antecedente;
        if (m2Relevamiento < 0) {
          tasaRetributiva = TASA_MINIMA;
          descripcionServicio = "Relevamiento (tasa mínima aplicada)";
        } else {
          tasaRetributiva = m2Relevamiento * VPTR * 0.6;
          descripcionServicio = "Relevamiento";
        }
      } else {
        tasaRetributiva = m2 * VPTR * 0.6;
        descripcionServicio = "Relevamiento";
      }
      
      if (tasaRetributiva < TASA_MINIMA && m2Relevamiento >= 0) {
        tasaRetributiva = TASA_MINIMA;
      }
    } 
    else if (tipoObra === 'nueva') {
      descripcionServicio = tareaSeleccionada;
      let valorBase = calcularPorTramos(m2);
      html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

      if (tareaSeleccionada === "Anteproyecto") {
        tasaRetributiva = valorBase * 0.4;
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaRetributiva = valorBase * 0.6;
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaRetributiva = valorBase * 0.4 * porcentajeRestante;
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaRetributiva = valorBase * 1.0;
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaRetributiva = valorBase * 1.0;
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaRetributiva = valorBase * 1.0;
      }

      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaRetributiva < TASA_MINIMA && !esDireccionSinAvance) {
        tasaRetributiva = TASA_MINIMA;
      }
    }
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      let m2Relevamiento = construida;
      if (antecedente > 0) {
        m2Relevamiento = construida - antecedente;
      }
      
      let tasaRelevamiento = m2Relevamiento * VPTR * 0.6;
      if (tasaRelevamiento > 0 && tasaRelevamiento < TASA_MINIMA) {
        tasaRelevamiento = TASA_MINIMA;
      }
      
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.4;
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6;
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      }
      else {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }

      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaAmpliacion < TASA_MINIMA && !esDireccionSinAvance) {
        tasaAmpliacion = TASA_MINIMA;
      }
      
      tasaRetributiva = tasaRelevamiento + tasaAmpliacion;
      descripcionServicio = "Relevamiento + " + tareaSeleccionada;
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
    }
    else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      tasaRetributiva = monto * 0.01;
      descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra";
      
      if (tasaRetributiva < TASA_MINIMA) {
        tasaRetributiva = TASA_MINIMA;
      }
    }
    else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      const tasaRefaccion = monto * 0.01;
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.4;
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6;
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      }
      else {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }

      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaAmpliacion < TASA_MINIMA && !esDireccionSinAvance) {
        tasaAmpliacion = TASA_MINIMA;
      }
      
      tasaRetributiva = tasaRefaccion + tasaAmpliacion;
      descripcionServicio = "Refacción + Ampliación (" + tareaSeleccionada + ")";
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
      
      if (tasaRetributiva < TASA_MINIMA) {
        tasaRetributiva = TASA_MINIMA;
      }
    }

    console.log("✅ Cálculo completado. Tasa:", tasaRetributiva); // Para debug
    
    setResultados({
      html,
      tasaRetributiva,
      descripcionServicio
    });
  };

  // Determinar qué campos mostrar según el tipo de obra
  const mostrarCamposBasicos = tipoObra === 'nueva' || tipoObra === 'construida';
  const mostrarAmpliacionFields = tipoObra === 'ampliacion';
  const mostrarAntecedenteFields = tipoObra === 'construida';
  const mostrarRefaccionFields = tipoObra === 'refaccion';
  const mostrarRefaccionAmpliacionFields = tipoObra === 'refaccionAmpliacion';
  const mostrarTareasField = tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion';
  const mostrarAvanceField = tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion';
  const mostrarInfoRefaccion = tipoObra === 'refaccion';
  const mostrarInfoRefaccionAmpliacion = tipoObra === 'refaccionAmpliacion';

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setM2Vivienda('');
    setM2Construida('');
    setM2Ampliacion('');
    setM2AntecedenteAmpliacion('');
    setM2AntecedenteConstruida('');
    setMontoRefaccion('');
    setMontoRefaccionAmpliacion('');
    setM2AmpliacionRefaccion('');
    setTareaSeleccionada('Anteproyecto');
    setAvanceVivienda('');
    setResultados(null);
  };

  // Si no estamos mostrando la calculadora, mostrar la card inicial
  if (!mostrarCalculadora) {
    return (
      <div className="card-container-parent">
        <Card className="text-center border-0 card-perfect-square">
          <Card.Header className="text-dark py-3 border-0">
            <h5 className="mb-0 fw-bold">Vivienda Unifamiliar</h5>
          </Card.Header>
        
          <Card.Body className="p-4 d-flex flex-column justify-content-center">
            <div className="card-content-wrapper">
              <div className="icon-container mb-4">
                <div className="icon-wrapper rounded-circle p-3 d-inline-flex" style={{ backgroundColor: 'rgba(26, 40, 111, 0.1)' }}>
                  <FaHome size={32} style={{ color: '#1A286F' }} />
                </div>
              </div>
            
              <Card.Text className="text-muted small mb-4">
                Cálculo de tasas retributivas para viviendas individuales
              </Card.Text>
            </div>
          
            <div className="d-grid">
              <Button 
                variant="primary" 
                className="fw-semibold py-2"
                size="lg"
                style={{ backgroundColor: '#1A286F', borderColor: '#1A286F' }}
                onClick={() => {
                  console.log("✅ Botón Calcular Tasa clickeado"); // Para debug
                  setMostrarCalculadora(true);
                }}
              >
                <FaCalculator className="me-2" />
                Calcular Tasa
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Si estamos mostrando la calculadora, mostrar el formulario completo
  return (
    <div className="container my-4">
      {/* Header con botón de volver */}
      <div className="text-center mb-4">
        <Button 
          onClick={() => {
            console.log("✅ Botón Volver clickeado"); // Para debug
            setMostrarCalculadora(false);
            onBack(); // <-- SE ELIMINÓ LA VALIDACIÓN EXTRA
          }}
          className="back-button-custom d-inline-flex align-items-center mb-3"
          variant="outline-primary"
        >
          <FaArrowLeft className="me-2" />
          Volver al Menú Principal
        </Button>
        <div>
          <h2 className="mb-0">Vivienda Unifamiliar</h2>
          <p className="mb-0 text-muted">
            Complete el tipo de obra y cargue la/s superficie/s. Luego seleccione la tarea a realizar y presione calcular.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Datos de Entrada</h5>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={limpiarFormulario}
              >
                Limpiar
              </Button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="tipoObraVivienda" className="form-label">Tipo de Obra</label>
                <select 
                  className="form-select" 
                  id="tipoObraVivienda" 
                  value={tipoObra}
                  onChange={(e) => setTipoObra(e.target.value)}
                >
                  <option value="nueva">Obra Nueva</option>
                  <option value="construida">Obra Construida</option>
                  <option value="ampliacion">Construida y Ampliación</option>
                  <option value="refaccion">Refacción</option>
                  <option value="refaccionAmpliacion">Refacción y Ampliación</option>
                </select>
              </div>
              
              {/* Campos dinámicos según el tipo de obra */}
              {mostrarCamposBasicos && (
                <div className="mb-3">
                  <label htmlFor="m2Vivienda" className="form-label">Metros cuadrados (m²)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="m2Vivienda" 
                    placeholder="Ingrese los m² de construcción" 
                    min="0"
                    value={m2Vivienda}
                    onChange={(e) => setM2Vivienda(e.target.value)}
                  />
                </div>
              )}
              
              {mostrarAmpliacionFields && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="m2Construida" className="form-label">Superficie Construida (m²)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="m2Construida" 
                      placeholder="Superficie ya construida" 
                      min="0"
                      value={m2Construida}
                      onChange={(e) => setM2Construida(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="m2Ampliacion" className="form-label">Superficie de Ampliación (m²)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="m2Ampliacion" 
                      placeholder="Superficie a ampliar" 
                      min="0"
                      value={m2Ampliacion}
                      onChange={(e) => setM2Ampliacion(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="m2AntecedenteAmpliacion" className="form-label">Superficie de Antecedente (m²)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="m2AntecedenteAmpliacion" 
                      placeholder="Superficie de antecedente (opcional)" 
                      min="0"
                      value={m2AntecedenteAmpliacion}
                      onChange={(e) => setM2AntecedenteAmpliacion(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {mostrarAntecedenteFields && (
                <div className="mb-3">
                  <label htmlFor="m2AntecedenteConstruida" className="form-label">Superficie de Antecedente (m²)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="m2AntecedenteConstruida" 
                    placeholder="Superficie de antecedente (opcional)" 
                    min="0"
                    value={m2AntecedenteConstruida}
                    onChange={(e) => setM2AntecedenteConstruida(e.target.value)}
                  />
                </div>
              )}
              
              {mostrarRefaccionFields && (
                <div className="mb-3">
                  <label htmlFor="montoRefaccion" className="form-label">Monto de Obra en $</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="montoRefaccion" 
                    placeholder="Ingrese el monto total de la refacción" 
                    min="0"
                    value={montoRefaccion}
                    onChange={(e) => setMontoRefaccion(e.target.value)}
                  />
                </div>
              )}
              
              {mostrarRefaccionAmpliacionFields && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="montoRefaccionAmpliacion" className="form-label">Monto de Refacción en $</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="montoRefaccionAmpliacion" 
                      placeholder="Ingrese el monto total de la refacción" 
                      min="0"
                      value={montoRefaccionAmpliacion}
                      onChange={(e) => setMontoRefaccionAmpliacion(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="m2AmpliacionRefaccion" className="form-label">Superficie de Ampliación (m²)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="m2AmpliacionRefaccion" 
                      placeholder="Superficie a ampliar" 
                      min="0"
                      value={m2AmpliacionRefaccion}
                      onChange={(e) => setM2AmpliacionRefaccion(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {/* Selección de tareas */}
              {mostrarTareasField && (
                <div className="mb-3">
                  <label className="form-label">Seleccione las tareas:</label>
                  {["Anteproyecto", "Proyecto", "Dirección Técnica", "Anteproyecto y Proyecto", "Proyecto y Dirección Técnica", "Anteproyecto, Proyecto y Dirección Técnica"].map((tarea) => (
                    <div key={tarea} className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id={`v${tarea.replace(/\s+/g, '')}`}
                        value={tarea} 
                        checked={tareaSeleccionada === tarea}
                        onChange={() => setTareaSeleccionada(tarea)}
                      />
                      <label className="form-check-label" htmlFor={`v${tarea.replace(/\s+/g, '')}`}>
                        {tarea}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {mostrarAvanceField && (
                <div className="mb-3">
                  <label htmlFor="avanceVivienda" className="form-label">% Avance de Obra (solo para Dirección Técnica)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="avanceVivienda" 
                    placeholder="Sin avance de obra (0%)" 
                    min="0" 
                    max="100"
                    value={avanceVivienda}
                    onChange={(e) => setAvanceVivienda(e.target.value)}
                  />
                </div>
              )}
              
              <div className="d-grid">
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    console.log("✅ Botón Calcular clickeado en el formulario"); // Para debug
                    calcularVivienda();
                  }}
                >
                  <FaCalculator className="me-2" />
                  Calcular Tasa
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card result-card">
            <div className="card-header">
              <h5 className="mb-0">Resultados - Vivienda Unifamiliar</h5>
            </div>
            <div className="card-body">
              {resultados ? (
                resultados.error ? (
                  <div className="alert alert-warning text-center">
                    {resultados.error}
                  </div>
                ) : (
                  <div>
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
  );
};

export default Viviendas;