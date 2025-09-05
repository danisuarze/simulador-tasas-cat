import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './ExterioresNoCubiertosC.css';

const ExterioresNoCubiertosC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;
  const TASA_MINIMA = 20 * VPTR; // $19,000

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

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para obtener el porcentaje según los tramos de m2 específicos para exteriores no cubiertos
  const obtenerPorcentajePorTramos = (m2) => {
    let porcentaje = 0;
    
    // Hasta 100m²: 50%
    if (m2 <= 100) {
      porcentaje = 0.5;
    }
    // De 101m² a 500m²: 30%
    else if (m2 <= 500) {
      porcentaje = 0.3;
    }
    // De 501m² a 1000m²: 20%
    else if (m2 <= 1000) {
      porcentaje = 0.2;
    }
    // De 1001m² a 5000m²: 10%
    else if (m2 <= 5000) {
      porcentaje = 0.1;
    }
    // De 5001m² a 10000m²: 5%
    else if (m2 <= 10000) {
      porcentaje = 0.05;
    }
    // Desde 10001m² en adelante: 3%
    else {
      porcentaje = 0.03;
    }
    
    return porcentaje;
  };

  // Función para calcular el valor según los tramos de m2 (Superficie total * VPTR * porcentaje)
  const calcularPorTramos = (m2) => {
    const porcentaje = obtenerPorcentajePorTramos(m2);
    return m2 * VPTR * porcentaje;
  };

  // Función para calcular resultados
  const calcularEdificio = () => {
    let m2 = 0;
    let avance = parseFloat(avanceEdificio) || 0;
    
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
    
    if (tipoObra === 'nueva' || tipoObra === 'ampliacion') {
      html.push({ label: "% Avance de Obra", value: `${avance}% (solo aplica a Dirección Técnica)` });
    }
    
    let tasaRetributiva = 0;
    let descripcionServicio = "";

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
          
          detallesCalculo.push({
            tipo: "formula",
            contenido: "Tasa Mínima (Superficie de Antecedente > Superficie Total)"
          });
        } else {
          // Calcular Relevamiento común (60% base)
          const relevamientoComun = m2Relevamiento * VPTR * 0.6;
          
          // Aplicar porcentaje por tramos al relevamiento común
          const porcentajeTramos = obtenerPorcentajePorTramos(m2Relevamiento);
          tasaRetributiva = relevamientoComun * porcentajeTramos;
          descripcionServicio = "Relevamiento";
          
          html.push({ label: "Superficie para Relevamiento", value: `${m2} m² - ${antecedente} m² = ${m2Relevamiento} m²` });
          detallesCalculo.push({
            tipo: "formula",
            contenido: "Relevamiento común × porcentaje por tramos"
          });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `Relevamiento común: ${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(relevamientoComun)}`
          });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `Porcentaje por tramos (${(porcentajeTramos * 100).toFixed(0)}%): ${formatoMoneda(relevamientoComun)} × ${(porcentajeTramos * 100).toFixed(0)}% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      } else {
        // Sin antecedente, cálculo normal
        const relevamientoComun = m2 * VPTR * 0.6;
        const porcentajeTramos = obtenerPorcentajePorTramos(m2);
        tasaRetributiva = relevamientoComun * porcentajeTramos;
        descripcionServicio = "Relevamiento";
        
        detallesCalculo.push({
          tipo: "formula",
          contenido: "Relevamiento común × porcentaje por tramos"
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `Relevamiento común: ${m2} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(relevamientoComun)}`
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `Porcentaje por tramos (${(porcentajeTramos * 100).toFixed(0)}%): ${formatoMoneda(relevamientoComun)} × ${(porcentajeTramos * 100).toFixed(0)}% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      
      // Aplicar tasa mínima si corresponde (excepto cuando ya se aplicó por antecedente mayor)
      if (tasaRetributiva < TASA_MINIMA && m2Relevamiento >= 0) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: El cálculo inicial (${formatoMoneda(tasaRetributiva)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
      }
    } 
    // Para obra nueva
    else if (tipoObra === 'nueva') {
      descripcionServicio = tareaSeleccionada;
      
      // Calcular valor base: Superficie total * VPTR * porcentaje según tramo
      const valorBase = calcularPorTramos(m2);
      html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

      // Mostrar detalles del cálculo del valor base
      const porcentajeTramos = obtenerPorcentajePorTramos(m2);
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Valor Base: ${m2} m² × ${formatoMoneda(VPTR)} × ${(porcentajeTramos * 100).toFixed(0)}% = ${formatoMoneda(valorBase)}`
      });

      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaRetributiva = valorBase * 0.4; // 40%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaRetributiva = valorBase * 0.6; // 60%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        // Para Dirección Técnica: 40% del valor base, ajustado por el % restante
        const porcentajeRestante = (100 - avance) / 100;
        tasaRetributiva = valorBase * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante por ejecutar: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaRetributiva)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra: Se aplica el 100% de la dirección técnica" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaRetributiva = valorBase * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        // 60% para Proyecto + 40% para Dirección Técnica (sin ajuste de avance)
        tasaRetributiva = valorBase * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% (60% Proyecto + 40% Dirección)" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaRetributiva)}`
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaRetributiva = valorBase * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaRetributiva)}`
        });
      }

      // Aplicar tasa mínima solo para tareas individuales (no combinadas) y solo si el resultado es menor
      // EXCEPCIÓN: No aplicar tasa mínima para Dirección Técnica cuando no hay avance
      const esTareaIndividual = !tareaSeleccionada.includes("y") && !tareaSeleccionada.includes(",");
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (esTareaIndividual && tasaRetributiva < TASA_MINIMA && !esDireccionSinAvance) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: El cálculo inicial (${formatoMoneda(tasaRetributiva)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
      }
    }
    // Para obra de ampliación
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      // Calcular la parte de relevamiento (construida): relevamiento común × porcentaje por tramos
      let m2Relevamiento = construida;
      if (antecedente > 0) {
        m2Relevamiento = construida - antecedente;
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Cálculo de Relevamiento: Superficie Construida - Antecedente = ${construida} m² - ${antecedente} m² = ${m2Relevamiento} m²`
        });
      }
      
      const relevamientoComun = m2Relevamiento * VPTR * 0.6;
      const porcentajeTramos = obtenerPorcentajePorTramos(m2Relevamiento);
      let tasaRelevamiento = relevamientoComun * porcentajeTramos;
      
      // Aplicar tasa mínima al relevamiento si corresponde
      if (tasaRelevamiento > 0 && tasaRelevamiento < TASA_MINIMA) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima en Relevamiento: El cálculo inicial (${formatoMoneda(tasaRelevamiento)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRelevamiento = TASA_MINIMA;
      }
      
      // Calcular la parte de obra nueva (ampliación): Superficie ampliación * VPTR * porcentaje según tramo
      const valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      // Mostrar detalles del cálculo de la ampliación
      const porcentajeTramosAmpliacion = obtenerPorcentajePorTramos(ampliacion);
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Valor Base Ampliación: ${ampliacion} m² × ${formatoMoneda(VPTR)} × ${(porcentajeTramosAmpliacion * 100).toFixed(0)}% = ${formatoMoneda(valorBaseAmpliacion)}`
      });

      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.4; // 40%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6; // 60%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 60% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        // Para Dirección Técnica: 40% del valor base, ajustado por el % restante
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante por ejecutar: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaAmpliacion)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra: Se aplica el 100% de la dirección técnica" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% = ${formatoMoneda(tasaAmpliacion)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        // 60% para Proyecto + 40% para Dirección Técnica (sin ajuste de avance)
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% (60% Proyecto + 40% Dirección) para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(tasaAmpliacion)}`
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto and Dirección Técnea") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(tasaAmpliacion)}`
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
        tipo: "subcalculo",
        contenido: `Cálculo de Relevamiento: ${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(relevamientoComun)} × ${(porcentajeTramos * 100).toFixed(0)}% = ${formatoMoneda(tasaRelevamiento)}`
      });
      
      detallesCalculo.push({
        tipo: "total",
        contenido: `${formatoMoneda(tasaRelevamiento)} + ${formatoMoneda(tasaAmpliacion)} = ${formatoMoneda(tasaRetributiva)}`
      });
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
    <div>
      {/* Botón Volver al Home */}
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
                <h5 className="mb-0">Exteriores No Cubiertos</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="tipoObraEdificio" className="form-label">Tipo de Obra</label>
                  <select 
                    className="form-select" 
                    id="tipoObraEdificio" 
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
                
                {/* Campos específicos para Construida y Ampliación */}
                {mostrarAmpliacionFields && (
                  <div id="ampliacionFields" className="ampliacion-fields">
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
                      <div className="form-text">Si no hay antecedente, dejar en blanco. El antecedente no puede be mayor a la superficie construida.</div>
                    </div>
                  </div>
                )}
                
                {/* Campos específicos para Obra Construida con Antecedente */}
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
                      <div className="form-text">Si no hay antecedente, dejar en blanco. Si la superficie de antecedente es mayor a la superficie general se computará Tasa Mínima.</div>
                    </div>
                  </div>
                )}
                
                {/* Selección de tareas para Obra Nueva y Ampliación */}
                {mostrarTareasField && (
                  <div className="mb-3 dynamic-field" id="tareasEdificioField">
                    <label className="form-label">Seleccione las tareas:</label>
                    <div className="form-check task-item">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaExterioresNoCubiertos" 
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
                        name="tareaExterioresNoCubiertos" 
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
                        name="tareaExterioresNoCubiertos" 
                        id="exDireccion" 
                        value="Dirección Técnica" 
                        checked={tareaSeleccionada === "Dirección Técnica"}
                        onChange={() => setTareaSeleccionada("Dirección Técnica")}
                      />
                      <label className="form-check-label" htmlFor="exDireccion">Dirección Técnea</label>
                    </div>
                    <div className="form-check task-item">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="tareaExterioresNoCubiertos" 
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
                        name="tareaExterioresNoCubiertos" 
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
                        name="tareaExterioresNoCubiertos" 
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
                    <div className="form-text">Ingrese 0 si no hay avance de obra. Este valor solo afecta al cálculo de Dirección Técnica.</div>
                  </div>
                )}
                
                <div className="d-grid">
                  <button className="btn btn-primary" onClick={calcularEdificio}>
                    <i className="bi bi-calculator"></i> Calcular
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card result-card">
              <div className="card-header">
                <h5 className="mb-0">Resultados - Exteriores No Cubiertos</h5>
              </div>
              <div className="card-body">
                {resultados ? (
                  resultados.error ? (
                    <div className="alert alert-warning text-center">
                      {resultados.error}
                    </div>
                  ) : (
                    <div id="resultadosEdificio">
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
    </div>
  );
};

export default ExterioresNoCubiertosC;