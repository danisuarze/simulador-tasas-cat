import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './InstalacionesEstructurasC.css';

const InstalacionesEstructurasC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;
  const TASA_MINIMA = 20 * VPTR; // $19,000
  const PORCENTAJE_INSTALACIONES = 0.3; // 30% para instalaciones

  // Estados
  const [tipoObra, setTipoObra] = useState('nueva');
  const [m2Instalaciones, setM2Instalaciones] = useState('');
  const [m2Construida, setM2Construida] = useState('');
  const [m2Ampliacion, setM2Ampliacion] = useState('');
  const [m2AntecedenteAmpliacion, setM2AntecedenteAmpliacion] = useState('');
  const [m2AntecedenteConstruida, setM2AntecedenteConstruida] = useState('');
  const [tareaSeleccionada, setTareaSeleccionada] = useState('Anteproyecto');
  const [avanceInstalaciones, setAvanceInstalaciones] = useState('');
  const [resultados, setResultados] = useState(null);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular resultados
  const calcularInstalaciones = () => {
    let m2 = 0;
    let avance = parseFloat(avanceInstalaciones) || 0;
    
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
      
      // Validar que el antecedente no sea mayor a la superficie construida
      if (antecedente > construida) {
        setResultados({
          error: `Error: La superficie de antecedente (${antecedente} m²) no puede ser mayor que la superficie construida (${construida} m²).`
        });
        return;
      }
      
      m2 = construida + ampliacion;
    } else {
      m2 = parseFloat(m2Instalaciones) || 0;
      
      if (m2 <= 0) {
        setResultados({
          error: "Por favor, ingrese un valor válido para los metros cuadrados."
        });
        return;
      }
    }

    let html = [];
    let detallesCalculo = [];
    
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
    } else {
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
    }
    
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    html.push({ label: "% Instalaciones", value: "30%" });
    
    if (tipoObra === 'nueva' || tipoObra === 'ampliacion') {
      html.push({ label: "% Avance de Obra", value: `${avance}% (solo aplica a Dirección Técnica)` });
    }
    
    let tasaRetributiva = 0;
    let descripcionServicio = "";

    // Calcular valor base: Superficie total * VPTR
    const valorBase = m2 * VPTR;
    html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

    // Mostrar detalles del cálculo del valor base
    detallesCalculo.push({
      tipo: "calculo",
      contenido: `Valor Base: ${m2} m² × ${formatoMoneda(VPTR)} = ${formatoMoneda(valorBase)}`
    });

    // Aplicar 30% por ser instalaciones
    const valorConPorcentaje = valorBase * PORCENTAJE_INSTALACIONES;
    detallesCalculo.push({
      tipo: "calculo",
      contenido: `Aplicación 30% instalaciones: ${formatoMoneda(valorBase)} × 30% = ${formatoMoneda(valorConPorcentaje)}`
    });

    // Para obra construida, solo mostrar Relevamiento
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      
      // Si hay antecedente, calcular la diferencia
      let m2Relevamiento = m2;
      if (antecedente > 0) {
        m2Relevamiento = m2 - antecedente;
        
        // Si el antecedente es mayor a la superficie total, aplicar tasa mínima
        if (m2Relevamiento < 0) {
          detallesCalculo.push({
            tipo: "info",
            contenido: `Aplicación de Tasa Mínima: La superficie de antecedente (${antecedente} m²) es mayor que la superficie total (${m2} m²), por lo que se aplica la tasa mínima.`
          });
          tasaRetributiva = TASA_MINIMA;
          descripcionServicio = "Relevamiento (tasa mínima aplicada)";
        } else {
          // Calcular Relevamiento (60% del valor base con porcentaje de instalaciones)
          tasaRetributiva = valorConPorcentaje * 0.6;
          descripcionServicio = "Relevamiento";
          
          html.push({ label: "Superficie para Relevamiento", value: `${m2} m² - ${antecedente} m² = ${m2Relevamiento} m²` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `Relevamiento (60%): ${formatoMoneda(valorConPorcentaje)} × 60% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      } else {
        // Sin antecedente, cálculo normal de relevamiento
        tasaRetributiva = valorConPorcentaje * 0.6;
        descripcionServicio = "Relevamiento";
        
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `Relevamiento (60%): ${formatoMoneda(valorConPorcentaje)} × 60% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
    } 
    // Para obra nueva
    else if (tipoObra === 'nueva') {
      descripcionServicio = tareaSeleccionada;
      
      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaRetributiva = valorConPorcentaje * 0.4; // 40%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentaje)} × 40% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaRetributiva = valorConPorcentaje * 0.6; // 60%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentaje)} × 60% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        // Para Dirección Técnica: 40% del valor base, ajustado por el % restante
        const porcentajeRestante = (100 - avance) / 100;
        tasaRetributiva = valorConPorcentaje * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante por ejecutar: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorConPorcentaje)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaRetributiva)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra: Se aplica el 100% de la dirección técnica" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorConPorcentaje)} × 40% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaRetributiva = valorConPorcentaje * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentaje)} × 100% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        // CORRECCIÓN: Solo calcular el 60% para Proyecto (no incluir Dirección Técnica)
        tasaRetributiva = valorConPorcentaje * 0.6; // 60% solo para proyecto
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% (solo Proyecto)" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentaje)} × 60% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaRetributiva = valorConPorcentaje * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentaje)} × 100% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
    }
    // Para obra de ampliación
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      // Calcular la parte de relevamiento (construida)
      let m2Relevamiento = construida;
      if (antecedente > 0) {
        m2Relevamiento = construida - antecedente;
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Cálculo de Relevamiento: Superficie Construida - Antecedente = ${construida} m² - ${antecedente} m² = ${m2Relevamiento} m²`
        });
      }
      
      // Calcular valor base para relevamiento
      const valorBaseRelevamiento = m2Relevamiento * VPTR;
      const valorConPorcentajeRelevamiento = valorBaseRelevamiento * PORCENTAJE_INSTALACIONES;
      let tasaRelevamiento = valorConPorcentajeRelevamiento * 0.6;
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Valor Base Relevamiento: ${m2Relevamiento} m² × ${formatoMoneda(VPTR)} = ${formatoMoneda(valorBaseRelevamiento)}`
      });
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Aplicación 30% instalaciones: ${formatoMoneda(valorBaseRelevamiento)} × 30% = ${formatoMoneda(valorConPorcentajeRelevamiento)}`
      });
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Relevamiento (60%): ${formatoMoneda(valorConPorcentajeRelevamiento)} × 60% = ${formatoMoneda(tasaRelevamiento)}`
      });
      
      // Aplicar tasa mínima al relevamiento si corresponde
      if (tasaRelevamiento > 0 && tasaRelevamiento < TASA_MINIMA) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima en Relevamiento: El cálculo inicial (${formatoMoneda(tasaRelevamiento)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRelevamiento = TASA_MINIMA;
      }
      
      // Calcular la parte de obra nueva (ampliación)
      const valorBaseAmpliacion = ampliacion * VPTR;
      const valorConPorcentajeAmpliacion = valorBaseAmpliacion * PORCENTAJE_INSTALACIONES;
      let tasaAmpliacion = 0;
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Valor Base Ampliación: ${ampliacion} m² × ${formatoMoneda(VPTR)} = ${formatoMoneda(valorBaseAmpliacion)}`
      });
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Aplicación 30% instalaciones: ${formatoMoneda(valorBaseAmpliacion)} × 30% = ${formatoMoneda(valorConPorcentajeAmpliacion)}`
      });

      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorConPorcentajeAmpliacion * 0.4; // 40%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 40% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorConPorcentajeAmpliacion * 0.6; // 60%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 60% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        // Para Dirección Técnica: 40% del valor base, ajustado por el % restante
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorConPorcentajeAmpliacion * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante por ejecutar: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaAmpliacion)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra: Se aplica el 100% de la dirección técnica" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 40% = ${formatoMoneda(tasaAmpliacion)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorConPorcentajeAmpliacion * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 100% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        // CORRECCIÓN: Solo calcular el 60% para Proyecto (no incluir Dirección Técnica)
        tasaAmpliacion = valorConPorcentajeAmpliacion * 0.6; // 60% solo para proyecto
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% (solo Proyecto) para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 60% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorConPorcentajeAmpliacion * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorConPorcentajeAmpliacion)} × 100% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }

      // Aplicar tasa mínima a la ampliación si corresponde (solo para tareas individuales)
      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaAmpliacion < TASA_MINIMA && !esDireccionSinAvance) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima en Ampliación: El cálculo inicial (${formatoMoneda(tasaAmpliacion)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaAmpliacion = TASA_MINIMA;
      }
      
      // Calcular la tasa total
      tasaRetributiva = tasaRelevamiento + tasaAmpliacion;
      descripcionServicio = "Relevamiento + " + tareaSeleccionada;
      
      // Mostrar detalles de los cálculos
      detallesCalculo.push({
        tipo: "total",
        contenido: `${formatoMoneda(tasaRelevamiento)} + ${formatoMoneda(tasaAmpliacion)} = ${formatoMoneda(tasaRetributiva)}`
      });
    }

    // Aplicar tasa mínima si corresponde
    if (tasaRetributiva < TASA_MINIMA) {
      detallesCalculo.push({
        tipo: "info",
        contenido: `Aplicación de Tasa Mínima: El cálculo inicial (${formatoMoneda(tasaRetributiva)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
      });
      tasaRetributiva = TASA_MINIMA;
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  // Determinar qué campos mostrar según el tipo de obra
  const mostrarCamposBasicos = tipoObra === 'nueva' || tipoObra === 'construida';
  const mostrarAmpliacionFields = tipoObra === 'ampliacion';
  const mostrarAntecedenteFields = tipoObra === 'construida';
  const mostrarTareasField = tipoObra === 'nueva' || tipoObra === 'ampliacion';
  const mostrarAvanceField = tipoObra === 'nueva' || tipoObra === 'ampliacion';

  return (
    <div className="instalaciones-estructuras-container">
      {/* Botón Volver al Home - Modificado para ser verde */}
      <div className="container mt-3 mb-4">
        <button 
          className="btn instalaciones-estructuras-back-button"
          onClick={onBack}
          style={{ backgroundColor: '#7B9C6B', borderColor: '#7B9C6B', color: 'white' }}
        >
          <FaArrowLeft className="me-2" />
          Volver al Home
        </button>
      </div>

      <div className="instalaciones-estructuras-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <h1 className="h3 mb-1">Simulador de Tasa Retributiva</h1>
              <p className="mb-0">Instalaciones y Estructuras - Luego seleccione la tarea a realizar y presione calcular</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="card instalaciones-estructuras-card">
              <div className="card-header instalaciones-estructuras-card-header">
                <h5 className="mb-0">Instalaciones y Estructuras</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="tipoObraInstalaciones" className="form-label instalaciones-estructuras-form-label">Tipo de Obra</label>
                  <select 
                    className="form-select instalaciones-estructuras-form-select" 
                    id="tipoObraInstalaciones" 
                    value={tipoObra}
                    onChange={(e) => setTipoObra(e.target.value)}
                  >
                    <option value="nueva">Obra Nueva</option>
                    <option value="construida">Obra Construida</option>
                    <option value="ampliacion">Construida y Ampliación</option>
                  </select>
                </div>
                
                {/* Campos para Obra Nueva y Obra Construida */}
                {mostrarCamposBasicos && (
                  <div className="mb-3" id="m2BasicoField">
                    <label htmlFor="m2Instalaciones" className="form-label instalaciones-estructuras-form-label">Metros cuadrados (m²)</label>
                    <input 
                      type="number" 
                      className="form-control instalaciones-estructuras-form-control" 
                      id="m2Instalaciones" 
                      placeholder="Ingrese los m² de construcción" 
                      min="0"
                      value={m2Instalaciones}
                      onChange={(e) => setM2Instalaciones(e.target.value)}
                    />
                  </div>
                )}
                
                {/* Campos específicos para Construida y Ampliación */}
                {mostrarAmpliacionFields && (
                  <div id="ampliacionFields" className="instalaciones-estructuras-ampliacion-fields">
                    <div className="mb-3">
                      <label htmlFor="m2Construida" className="form-label instalaciones-estructuras-form-label">Superficie Construida (m²)</label>
                      <input 
                        type="number" 
                        className="form-control instalaciones-estructuras-form-control" 
                        id="m2Construida" 
                        placeholder="Superficie ya construida" 
                        min="0"
                        value={m2Construida}
                        onChange={(e) => setM2Construida(e.target.value)}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="m2Ampliacion" className="form-label instalaciones-estructuras-form-label">Superficie de Ampliación (m²)</label>
                      <input 
                        type="number" 
                        className="form-control instalaciones-estructuras-form-control" 
                        id="m2Ampliacion" 
                        placeholder="Superficie a ampliar" 
                        min="0"
                        value={m2Ampliacion}
                        onChange={(e) => setM2Ampliacion(e.target.value)}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="m2AntecedenteAmpliacion" className="form-label instalaciones-estructuras-form-label">Superficie de Antecedente (m²)</label>
                      <input 
                        type="number" 
                        className="form-control instalaciones-estructuras-form-control" 
                        id="m2AntecedenteAmpliacion" 
                        placeholder="Superficie de antecedente (opcional)" 
                        min="0"
                        value={m2AntecedenteAmpliacion}
                        onChange={(e) => setM2AntecedenteAmpliacion(e.target.value)}
                      />
                      <div className="form-text instalaciones-estructuras-form-text">Si no hay antecedente, dejar en blanco. El antecedente no puede ser mayor a la superficie construida.</div>
                    </div>
                  </div>
                )}
                
                {/* Campos específicos para Obra Construida con Antecedente */}
                {mostrarAntecedenteFields && (
                  <div id="antecedenteFields" className="instalaciones-estructuras-antecedente-fields">
                    <div className="mb-3">
                      <label htmlFor="m2AntecedenteConstruida" className="form-label instalaciones-estructuras-form-label">Superficie de Antecedente (m²)</label>
                      <input 
                        type="number" 
                        className="form-control instalaciones-estructuras-form-control" 
                        id="m2AntecedenteConstruida" 
                        placeholder="Superficie de antecedente (opcional)" 
                        min="0"
                        value={m2AntecedenteConstruida}
                        onChange={(e) => setM2AntecedenteConstruida(e.target.value)}
                      />
                      <div className="form-text instalaciones-estructuras-form-text">Si no hay antecedente, dejar en blanco. Si la superficie de antecedente es mayor a la superficie general se computará Tasa Mínima.</div>
                    </div>
                  </div>
                )}
                
                {/* Selección de tareas para Obra Nueva y Ampliación */}
                {mostrarTareasField && (
                  <div className="mb-3 instalaciones-estructuras-dynamic-field" id="tareasInstalacionesField">
                    <label className="form-label instalaciones-estructuras-form-label">Seleccione las tareas:</label>
                    <div className="form-check instalaciones-estructuras-task-item">
                      <input 
                        className="form-check-input instalaciones-estructuras-form-check-input" 
                        type="radio" 
                        name="tareaInstalaciones" 
                        id="instAnteproyecto" 
                        value="Anteproyecto" 
                        checked={tareaSeleccionada === "Anteproyecto"}
                        onChange={() => setTareaSeleccionada("Anteproyecto")}
                      />
                      <label className="form-check-label" htmlFor="instAnteproyecto">Anteproyecto</label>
                    </div>
                    <div className="form-check instalaciones-estructuras-task-item">
                      <input 
                        className="form-check-input instalaciones-estructuras-form-check-input" 
                        type="radio" 
                        name="tareaInstalaciones" 
                        id="instProyecto" 
                        value="Proyecto" 
                        checked={tareaSeleccionada === "Proyecto"}
                        onChange={() => setTareaSeleccionada("Proyecto")}
                      />
                      <label className="form-check-label" htmlFor="instProyecto">Proyecto</label>
                    </div>
                    <div className="form-check instalaciones-estructuras-task-item">
                      <input 
                        className="form-check-input instalaciones-estructuras-form-check-input" 
                        type="radio" 
                        name="tareaInstalaciones" 
                        id="instDireccion" 
                        value="Dirección Técnica" 
                        checked={tareaSeleccionada === "Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="instDireccion">Dirección Técnica</label>
                    </div>
                    <div className="form-check instalaciones-estructuras-task-item">
                      <input 
                        className="form-check-input instalaciones-estructuras-form-check-input" 
                        type="radio" 
                        name="tareaInstalaciones" 
                        id="instAnteproyectoProyecto" 
                        value="Anteproyecto y Proyecto" 
                        checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                        onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                      />
                      <label className="form-check-label" htmlFor="instAnteproyectoProyecto">Anteproyecto y Proyecto</label>
                    </div>
                    <div className="form-check instalaciones-estructuras-task-item">
                      <input 
                        className="form-check-input instalaciones-estructuras-form-check-input" 
                        type="radio" 
                        name="tareaInstalaciones" 
                        id="instProyectoDireccion" 
                        value="Proyecto y Dirección Técnica" 
                        checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="instProyectoDireccion">Proyecto y Dirección Técnica</label>
                    </div>
                    <div className="form-check instalaciones-estructuras-task-item">
                      <input 
                        className="form-check-input instalaciones-estructuras-form-check-input" 
                        type="radio" 
                        name="tareaInstalaciones" 
                        id="instCompleto" 
                        value="Anteproyecto, Proyecto y Dirección Técnica" 
                        checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="instCompleto">Anteproyecto, Proyecto y Dirección Técnica</label>
                    </div>
                  </div>
                )}
                
                {mostrarAvanceField && (
                  <div className="mb-3" id="avanceField">
                    <label htmlFor="avanceInstalaciones" className="form-label instalaciones-estructuras-form-label">% Avance de Obra (solo para Dirección Técnica)</label>
                    <input 
                      type="number" 
                      className="form-control instalaciones-estructuras-form-control" 
                      id="avanceInstalaciones" 
                      placeholder="Sin avance de obra (0%)" 
                      min="0" 
                      max="100"
                      value={avanceInstalaciones}
                      onChange={(e) => setAvanceInstalaciones(e.target.value)}
                    />
                    <div className="form-text instalaciones-estructuras-form-text">Ingrese 0 si no hay avance de obra. Este valor solo afecta al cálculo de Dirección Técnica.</div>
                  </div>
                )}
                
                <div className="d-grid">
                  <button className="btn instalaciones-estructuras-btn-primary btn-primary" onClick={calcularInstalaciones}>
                    Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card instalaciones-estructuras-card instalaciones-estructuras-result-card">
              <div className="card-header instalaciones-estructuras-card-header">
                <h5 className="mb-0">Resultados - Instalaciones y Estructuras</h5>
              </div>
              <div className="card-body">
                {resultados ? (
                  resultados.error ? (
                    <div className="alert instalaciones-estructuras-alert instalaciones-estructuras-alert-warning text-center">
                      {resultados.error}
                    </div>
                  ) : (
                    <div id="resultadosInstalaciones">
                      {resultados.html.map((item, index) => (
                        <div key={index} className="instalaciones-estructuras-result-item">
                          <strong>{item.label}:</strong> {item.value}
                        </div>
                      ))}
                      
                      <hr />
                      
                      <div className="instalaciones-estructuras-resultado-final">
                        <div className="instalaciones-estructuras-resultado-final-titulo">Tasa Retributiva Final</div>
                        <div className="instalaciones-estructuras-resultado-final-valor">{formatoMoneda(resultados.tasaRetributiva)}</div>
                        <div className="instalaciones-estructuras-resultado-final-descripcion">{resultados.descripcionServicio}</div>
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

export default InstalacionesEstructurasC;