import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './ViviendaPrueba.css';

const ViviendaPrueba = ({ onBack }) => {
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

  // Función para calcular resultados
  const calcularVivienda = () => {
    console.log('Calculando...'); // Para debug
    
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
    let detallesCalculo = [];
    let tasaRetributiva = 0;
    let descripcionServicio = "";

    // Cálculos según tipo de obra
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
      
    } else if (tipoObra === 'nueva') {
      descripcionServicio = tareaSeleccionada;
      let valorBase = calcularPorTramos(m2);
      
      if (tareaSeleccionada === "Anteproyecto") {
        tasaRetributiva = valorBase * 0.4;
      } else if (tareaSeleccionada === "Proyecto") {
        tasaRetributiva = valorBase * 0.6;
      } else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaRetributiva = valorBase * 0.4 * porcentajeRestante;
      } else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaRetributiva = valorBase * 1.0;
      } else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaRetributiva = valorBase * 1.0;
      } else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaRetributiva = valorBase * 1.0;
      }

      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaRetributiva < TASA_MINIMA && !esDireccionSinAvance) {
        tasaRetributiva = TASA_MINIMA;
      }
      
    } else if (tipoObra === 'ampliacion') {
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
      } else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6;
      } else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      } else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      } else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      } else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }

      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaAmpliacion < TASA_MINIMA && !esDireccionSinAvance) {
        tasaAmpliacion = TASA_MINIMA;
      }
      
      tasaRetributiva = tasaRelevamiento + tasaAmpliacion;
      descripcionServicio = "Relevamiento + " + tareaSeleccionada;
      
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      tasaRetributiva = monto * 0.01;
      descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra";
      
      if (tasaRetributiva < TASA_MINIMA) {
        tasaRetributiva = TASA_MINIMA;
      }
      
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      const tasaRefaccion = monto * 0.01;
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.4;
      } else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6;
      } else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      } else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      } else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      } else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }

      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaAmpliacion < TASA_MINIMA && !esDireccionSinAvance) {
        tasaAmpliacion = TASA_MINIMA;
      }
      
      tasaRetributiva = tasaRefaccion + tasaAmpliacion;
      descripcionServicio = "Refacción + Ampliación (" + tareaSeleccionada + ")";
      
      if (tasaRetributiva < TASA_MINIMA) {
        tasaRetributiva = TASA_MINIMA;
      }
    }

    // Construir HTML de resultados
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  // Handlers simplificados
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Determinar qué campos mostrar
  const mostrarCamposBasicos = tipoObra === 'nueva' || tipoObra === 'construida';
  const mostrarAmpliacionFields = tipoObra === 'ampliacion';
  const mostrarAntecedenteFields = tipoObra === 'construida';
  const mostrarRefaccionFields = tipoObra === 'refaccion';
  const mostrarRefaccionAmpliacionFields = tipoObra === 'refaccionAmpliacion';
  const mostrarTareasField = tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion';
  const mostrarAvanceField = tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion';

  return (
    <div>
      <div className="container mt-3 mb-4">
        <button 
          className="btn back-home-btn"
          onClick={onBack}
          style={{ backgroundColor: '#6b8a5c', borderColor: '#6b8a5c', color: 'white' }}
        >
          <FaArrowLeft className="me-2" />
          Volver al Home
        </button>
      </div>

      <div className="header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <h1 className="h3 mb-1">Simulador de Tasa Retributiva</h1>
              <p className="mb-0">Luego seleccione la tarea a realizar y presione calcular</p>
            </div>
          </div>  
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Vivienda Unifamiliar</h5>
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
                
                {/* Campos básicos */}
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
                
                {/* Ampliación */}
                {mostrarAmpliacionFields && (
                  <>
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
                  </>
                )}
                
                {/* Antecedente */}
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
                
                {/* Refacción */}
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
                
                {/* Refacción y Ampliación */}
                {mostrarRefaccionAmpliacionFields && (
                  <>
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
                  </>
                )}
                
                {/* Tareas */}
                {mostrarTareasField && (
                  <div className="mb-3">
                    <label className="form-label">Seleccione las tareas:</label>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id="vAnteproyecto" 
                        value="Anteproyecto" 
                        checked={tareaSeleccionada === "Anteproyecto"}
                        onChange={() => setTareaSeleccionada("Anteproyecto")}
                      />
                      <label className="form-check-label" htmlFor="vAnteproyecto">Anteproyecto</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id="vProyecto" 
                        value="Proyecto" 
                        checked={tareaSeleccionada === "Proyecto"}
                        onChange={() => setTareaSeleccionada("Proyecto")}
                      />
                      <label className="form-check-label" htmlFor="vProyecto">Proyecto</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id="vDireccion" 
                        value="Dirección Técnica" 
                        checked={tareaSeleccionada === "Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="vDireccion">Dirección Técnica</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id="vAnteproyectoProyecto" 
                        value="Anteproyecto y Proyecto" 
                        checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                        onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                      />
                      <label className="form-check-label" htmlFor="vAnteproyectoProyecto">Anteproyecto y Proyecto</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id="vProyectoDireccion" 
                        value="Proyecto y Dirección Técnica" 
                        checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="vProyectoDireccion">Proyecto y Dirección Técnica</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaVivienda" 
                        id="vCompleto" 
                        value="Anteproyecto, Proyecto y Dirección Técnica" 
                        checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="vCompleto">Anteproyecto, Proyecto y Dirección Técnica</label>
                    </div>
                  </div>
                )}
                
                {/* Avance */}
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
                    onClick={calcularVivienda}
                  >
                    Calcular
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
                      {resultados.html && resultados.html.map((item, index) => (
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
    </div>
  );
};

export default ViviendaPrueba;