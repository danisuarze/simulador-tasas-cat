import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './ExterioresNoCubiertosC.css';

const ExterioresNoCubiertosC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000

  // Estados
  const [tipoObra, setTipoObra] = useState('nueva');
  const [m2Edificio, setM2Edificio] = useState('');
  const [m2Construida, setM2Construida] = useState('');
  const [m2Ampliacion, setM2Ampliacion] = useState('');
  const [m2AntecedenteAmpliacion, setM2AntecedenteAmpliacion] = useState('');
  const [m2AntecedenteConstruida, setM2AntecedenteConstruida] = useState('');
  const [tareaSeleccionada, setTareaSeleccionada] = useState('Anteproyecto');
  const [avanceEdificio, setAvanceEdificio] = useState('');
  const [resultados, setResultados] = useState(null);

  // Efecto para hacer scroll al inicio
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Efecto para limpiar resultados
  useEffect(() => {
    setResultados(null);
  }, [
    tipoObra,
    m2Edificio,
    m2Construida,
    m2Ampliacion,
    m2AntecedenteAmpliacion,
    m2AntecedenteConstruida,
    tareaSeleccionada,
    avanceEdificio
  ]);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular la tasa de relevamiento (60% base) con porcentaje por tramos
  const calcularTasaRelevamiento = (m2) => {
    if (m2 <= 0) return 0;
    const relevamientoComun = m2 * VPTR * 0.6;
    const porcentajeTramos = obtenerPorcentajePorTramos(m2);
    return relevamientoComun * porcentajeTramos;
  };

  // Función para obtener el porcentaje según los tramos de m2 específicos para exteriores no cubiertos
  const obtenerPorcentajePorTramos = (m2) => {
    let porcentaje = 0;
    if (m2 <= 100) porcentaje = 0.5;
    else if (m2 <= 500) porcentaje = 0.3;
    else if (m2 <= 1000) porcentaje = 0.2;
    else if (m2 <= 5000) porcentaje = 0.1;
    else if (m2 <= 10000) porcentaje = 0.05;
    else porcentaje = 0.03;
    return porcentaje;
  };

  // Función para calcular el valor base por tramos
  const calcularPorTramos = (m2) => {
    const porcentaje = obtenerPorcentajePorTramos(m2);
    return m2 * VPTR * porcentaje;
  };

  // Función para calcular resultados (manteniendo toda la lógica original)
  const calcularEdificio = () => {
    let m2 = 0;
    let avance = parseFloat(avanceEdificio) || 0;
    
    // Validaciones
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      if (ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese un valor válido para la superficie de ampliación (debe ser mayor a 0)."
        });
        return;
      }
      m2 = construida + ampliacion;
    } else {
      m2 = parseFloat(m2Edificio) || 0;
      if (m2 <= 0) {
        setResultados({
          error: "Por favor, ingrese un valor válido para los metros cuadrados."
        });
        return;
      }
    }

    let html = [];
    let detallesCalculo = [];
    
    // Resumen de datos
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
    } else {
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
    }
    
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    
    if (tipoObra === 'nueva' || tipoObra === 'ampliacion') {
      html.push({ label: "% Avance de Obra", value: `${avance}% (solo aplica a Dirección Técnica)` });
    }
    
    let tasaRetributiva = 0;
    let descripcionServicio = "";

    // ===== LÓGICA DE CÁLCULO COMPLETA (idéntica al original) =====
    // Para obra construida
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      let superficieRelevamiento = m2 - antecedente;
      html.push({ label: "Superficie a Relevar", value: `${m2} m² - ${antecedente} m² = ${superficieRelevamiento} m²` });
      
      let tasaCalculada = 0;
      let aplicaTasaMinima = false;
      
      if (superficieRelevamiento <= 0) {
        tasaCalculada = 0;
        aplicaTasaMinima = true;
      } else {
        tasaCalculada = calcularTasaRelevamiento(superficieRelevamiento);
        if (tasaCalculada < TASA_MINIMA) aplicaTasaMinima = true;
      }
      
      if (aplicaTasaMinima) {
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio = "Relevamiento (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaCalculada;
        descripcionServicio = "Relevamiento";
      }
    } 
    // Para obra nueva
    else if (tipoObra === 'nueva') {
      const valorBase = calcularPorTramos(m2);
      html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

      let tasaCalculada = 0;

      if (tareaSeleccionada === "Anteproyecto") {
        tasaCalculada = valorBase * 0.4;
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaCalculada = valorBase * 0.6;
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaCalculada = valorBase * 0.4 * porcentajeRestante;
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaCalculada = valorBase * 1.0;
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaCalculada = valorBase * 0.6;
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaCalculada = valorBase * 1.0;
      }

      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      const esProyectoYDireccion = tareaSeleccionada === "Proyecto y Dirección Técnica";
      
      if (tasaCalculada < TASA_MINIMA && tasaCalculada > 0 && !esDireccionSinAvance && !esProyectoYDireccion) {
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio = tareaSeleccionada + " (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaCalculada;
        descripcionServicio = tareaSeleccionada;
      }
    }
    // Para obra de ampliación
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      let tasaRelevamiento = 0;
      let relevamientoAplicaMinima = false;
      let relevamientoOriginal = 0;
      
      if (construida > 0) {
        let superficieRelevamiento = construida - antecedente;
        html.push({ label: "Superficie a Relevar", value: `${construida} m² - ${antecedente} m² = ${superficieRelevamiento} m²` });
        
        if (superficieRelevamiento <= 0) {
          relevamientoOriginal = 0;
          relevamientoAplicaMinima = true;
        } else {
          relevamientoOriginal = calcularTasaRelevamiento(superficieRelevamiento);
          if (relevamientoOriginal < TASA_MINIMA) relevamientoAplicaMinima = true;
        }
        tasaRelevamiento = relevamientoAplicaMinima ? TASA_MINIMA : relevamientoOriginal;
      } else {
        html.push({ label: "Superficie a Relevar", value: "0 m² (sin construcción existente)" });
        tasaRelevamiento = 0;
      }
      
      const valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      let ampliacionAplicaMinima = false;
      let ampliacionOriginal = 0;

      if (tareaSeleccionada === "Anteproyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 0.4;
      }
      else if (tareaSeleccionada === "Proyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 0.6;
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        ampliacionOriginal = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 1.0;
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        ampliacionOriginal = valorBaseAmpliacion * 0.6;
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        ampliacionOriginal = valorBaseAmpliacion * 1.0;
      }

      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      const esProyectoYDireccion = tareaSeleccionada === "Proyecto y Dirección Técnica";
      
      if (ampliacionOriginal < TASA_MINIMA && ampliacionOriginal > 0 && !esDireccionSinAvance && !esProyectoYDireccion) {
        ampliacionAplicaMinima = true;
      }
      
      tasaAmpliacion = ampliacionAplicaMinima ? TASA_MINIMA : ampliacionOriginal;
      
      let tasaTotal = tasaRelevamiento + tasaAmpliacion;
      let totalAplicaMinima = false;
      
      if (tasaTotal > 0 && tasaTotal < TASA_MINIMA) {
        totalAplicaMinima = true;
        tasaRetributiva = TASA_MINIMA;
      } else {
        tasaRetributiva = tasaTotal;
      }
      
      const partes = [];
      if (construida > 0) partes.push(`Relevamiento${relevamientoAplicaMinima ? " (tasa mínima)" : ""}`);
      partes.push(tareaSeleccionada + (ampliacionAplicaMinima ? " (tasa mínima)" : ""));
      descripcionServicio = partes.join(" + ");
      if (totalAplicaMinima) descripcionServicio += " → Total con tasa mínima";
      if (construida === 0) {
        descripcionServicio = tareaSeleccionada + (ampliacionAplicaMinima ? " (tasa mínima)" : "") + " (sin relevamiento)";
        if (totalAplicaMinima) descripcionServicio += " → Total con tasa mínima";
      }
      
      html.push({ label: "Tasa Relevamiento", value: formatoMoneda(tasaRelevamiento) + (relevamientoAplicaMinima ? " (mínima)" : "") });
      html.push({ label: "Tasa Ampliación", value: formatoMoneda(tasaAmpliacion) + (ampliacionAplicaMinima ? " (mínima)" : "") });
      if (relevamientoAplicaMinima && relevamientoOriginal > 0) {
        html.push({ label: "Tasa Relevamiento (original)", value: formatoMoneda(relevamientoOriginal) });
      }
      if (ampliacionAplicaMinima && ampliacionOriginal > 0) {
        html.push({ label: "Tasa Ampliación (original)", value: formatoMoneda(ampliacionOriginal) });
      }
      if (totalAplicaMinima && tasaTotal > 0) {
        html.push({ label: "Tasa Total (original)", value: formatoMoneda(tasaTotal) });
      }
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  // Determinar qué campos mostrar
  const mostrarCamposBasicos = tipoObra === 'nueva' || tipoObra === 'construida';
  const mostrarAmpliacionFields = tipoObra === 'ampliacion';
  const mostrarAntecedenteFields = tipoObra === 'construida';
  const mostrarTareasField = tipoObra === 'nueva' || tipoObra === 'ampliacion';
  const mostrarAvanceField = tipoObra === 'nueva' || tipoObra === 'ampliacion';

  return (
    <Container fluid className="exteriores-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/exteriores.jpg" 
          alt="Exteriores No Cubiertos"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/exteriores.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Exteriores No Cubiertos</h2>
        <p className="subtitle">
          Complete el tipo de obra y cargue la/s superficie/s. Luego seleccione la tarea a realizar y presione calcular.
        </p>
      </div>

      {/* Formulario - UNA SOLA COLUMNA */}
      <div className="form-card">
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="tipoObraExteriores" className="form-label">Tipo de Obra</label>
              <select 
                className="form-select" 
                id="tipoObraExteriores" 
                value={tipoObra}
                onChange={(e) => setTipoObra(e.target.value)}
              >
                <option value="nueva">Obra Nueva</option>
                <option value="construida">Obra Construida</option>
                <option value="ampliacion">Construida y Ampliación</option>
              </select>
              {tipoObra === 'ampliacion' && (
                <div className="form-text text-muted mt-2">
                  <small>La superficie construida puede ser 0 si no hay construcción existente. En ese caso, solo se calculará la ampliación (sin relevamiento).</small>
                </div>
              )}
            </div>
            
            {mostrarCamposBasicos && (
              <div className="mb-3" id="m2BasicoField">
                <label htmlFor="m2Edificio" className="form-label">Metros cuadrados (m²)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="m2Edificio" 
                  placeholder="Ingrese los m² de construcción" 
                  min="0"
                  value={m2Edificio}
                  onChange={(e) => setM2Edificio(e.target.value)}
                />
              </div>
            )}
            
            {mostrarAmpliacionFields && (
              <div id="ampliacionFields" className="ampliacion-fields">
                <div className="mb-3">
                  <label htmlFor="m2Construida" className="form-label">Superficie Construida (m²)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="m2Construida" 
                    placeholder="Superficie ya construida (puede ser 0)" 
                    min="0"
                    value={m2Construida}
                    onChange={(e) => setM2Construida(e.target.value)}
                  />
                  <div className="form-text">Puede ser 0 si no hay construcción existente.</div>
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
                  <div className="form-text">Si no hay antecedente, dejar en blanco o 0.</div>
                </div>
              </div>
            )}
            
            {mostrarAntecedenteFields && (
              <div id="antecedenteFields" className="antecedente-fields">
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
                  <div className="form-text">Si no hay antecedente, dejar en blanco o 0.</div>
                </div>
              </div>
            )}
            
            {mostrarTareasField && (
              <div className="mb-3 dynamic-field" id="tareasExterioresField">
                <label className="form-label">Seleccione las tareas:</label>
                <div className="form-check task-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaExteriores" 
                    id="exAnteproyecto" 
                    value="Anteproyecto" 
                    checked={tareaSeleccionada === "Anteproyecto"}
                    onChange={() => setTareaSeleccionada("Anteproyecto")}
                  />
                  <label className="form-check-label" htmlFor="exAnteproyecto">Anteproyecto</label>
                </div>
                <div className="form-check task-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaExteriores" 
                    id="exProyecto" 
                    value="Proyecto" 
                    checked={tareaSeleccionada === "Proyecto"}
                    onChange={() => setTareaSeleccionada("Proyecto")}
                  />
                  <label className="form-check-label" htmlFor="exProyecto">Proyecto</label>
                </div>
                <div className="form-check task-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaExteriores" 
                    id="exDireccion" 
                    value="Dirección Técnica" 
                    checked={tareaSeleccionada === "Dirección Técnica"}
                    onChange={() => setTareaSeleccionada("Dirección Técnica")}
                  />
                  <label className="form-check-label" htmlFor="exDireccion">Dirección Técnica</label>
                </div>
                <div className="form-check task-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaExteriores" 
                    id="exAnteproyectoProyecto" 
                    value="Anteproyecto y Proyecto" 
                    checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                    onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                  />
                  <label className="form-check-label" htmlFor="exAnteproyectoProyecto">Anteproyecto y Proyecto</label>
                </div>
                <div className="form-check task-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaExteriores" 
                    id="exProyectoDireccion" 
                    value="Proyecto y Dirección Técnica" 
                    checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                    onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                  />
                  <label className="form-check-label" htmlFor="exProyectoDireccion">Proyecto y Dirección Técnica</label>
                </div>
                <div className="form-check task-item">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="tareaExteriores" 
                    id="exCompleto" 
                    value="Anteproyecto, Proyecto y Dirección Técnica" 
                    checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                    onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                  />
                  <label className="form-check-label" htmlFor="exCompleto">Anteproyecto, Proyecto y Dirección Técnica</label>
                </div>
              </div>
            )}
            
            {mostrarAvanceField && (
              <div className="mb-3" id="avanceField">
                <label htmlFor="avanceEdificio" className="form-label">% Avance de Obra (solo para Dirección Técnica)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="avanceEdificio" 
                  placeholder="Sin avance de obra (0%)" 
                  min="0" 
                  max="100"
                  value={avanceEdificio}
                  onChange={(e) => setAvanceEdificio(e.target.value)}
                />
                <div className="form-text">Ingrese 0 si no hay avance de obra.</div>
              </div>
            )}
            
            {/* Botón Calcular (verde, ancho completo) */}
            <div className="d-grid">
              <button 
                className="calculate-button" 
                onClick={calcularEdificio}
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Exteriores No Cubiertos</h4>
        {resultados ? (
          resultados.error ? (
            <div className="alert alert-warning text-center">
              {resultados.error}
            </div>
          ) : (
            <div id="resultadosExteriores">
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

export default ExterioresNoCubiertosC;