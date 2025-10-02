import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './EdificiosEspecialesC.css';

const EdificiosEspecialesC = ({ onBack }) => {
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
  const [montoRefaccion, setMontoRefaccion] = useState('');
  const [montoRefaccionAmpliacion, setMontoRefaccionAmpliacion] = useState('');
  const [m2AmpliacionRefaccion, setM2AmpliacionRefaccion] = useState('');
  const [tareaSeleccionada, setTareaSeleccionada] = useState('Anteproyecto');
  const [avanceEdificio, setAvanceEdificio] = useState('');
  const [resultados, setResultados] = useState(null);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular el valor según los tramos de m2 específicos para edificios especiales
  const calcularPorTramos = (m2) => {
    let total = 0;
    
    // Primeros 1000m² al 100%
    const tramo1 = Math.min(m2, 1000);
    total += tramo1 * VPTR * 1.0;
    
    // Segundos 1000m² al 80%
    if (m2 > 1000) {
      const tramo2 = Math.min(m2 - 1000, 1000);
      total += tramo2 * VPTR * 0.8;
    }
    
    // Resto al 60%
    if (m2 > 2000) {
      const tramo3 = m2 - 2000;
      total += tramo3 * VPTR * 0.6;
    }
    
    return total;
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
    } else if (tipoObra === 'refaccion') {
      // Para refacción, validamos el monto
      const monto = parseFloat(montoRefaccion) || 0;
      
      if (monto <= 0) {
        setResultados({
          error: "Por favor, ingrese un monto válido para la refacción."
        });
        return;
      }
    } else if (tipoObra === 'refaccionAmpliacion') {
      // Para refacción y ampliación, validamos ambos campos
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      if (monto <= 0 || ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese valores válidos para el monto de refacción y la superficie de ampliación."
        });
        return;
      }
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
          // Calcular Relevamiento sobre la diferencia
          tasaRetributiva = m2Relevamiento * VPTR * 0.6;
          descripcionServicio = "Relevamiento";
          
          html.push({ label: "Superficie para Relevamiento", value: `${m2} m² - ${antecedente} m² = ${m2Relevamiento} m²` });
          detallesCalculo.push({
            tipo: "formula",
            contenido: "Superficie × VPTR × 60%"
          });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      } else {
        // Sin antecedente, cálculo normal
        tasaRetributiva = m2 * VPTR * 0.6;
        descripcionServicio = "Relevamiento";
        
        detallesCalculo.push({
          tipo: "formula",
          contenido: "Superficie × VPTR × 60%"
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${m2} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaRetributiva)}`
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
      
      let valorBase = calcularPorTramos(m2);
      html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

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
      
      // Calcular la parte de relevamiento (construida)
      let m2Relevamiento = construida;
      if (antecedente > 0) {
        m2Relevamiento = construida - antecedente;
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Cálculo de Relevamiento: Superficie Construida - Antecedente = ${construida} m² - ${antecedente} m² = ${m2Relevamiento} m²`
        });
      }
      
      let tasaRelevamiento = m2Relevamiento * VPTR * 0.6;
      
      // Aplicar tasa mínima al relevamiento si corresponde
      if (tasaRelevamiento > 0 && tasaRelevamiento < TASA_MINIMA) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima en Relevamiento: El cálculo inicial (${formatoMoneda(tasaRelevamiento)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRelevamiento = TASA_MINIMA;
      }
      
      // Calcular la parte de obra nueva (ampliación)
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.4; // 40%
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6; // 60%
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        // Para Dirección Técnica: 40% del valor base, ajustado por el % restante
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        // 60% para Proyecto + 40% para Dirección Técnica (sin ajuste de avance)
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
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
        contenido: `Cálculo de Relevamiento: ${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaRelevamiento)}`
      });
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Cálculo de Ampliación (${tareaSeleccionada}): ${formatoMoneda(valorBaseAmpliacion)} × porcentaje correspondiente = ${formatoMoneda(tasaAmpliacion)}`
      });
      
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
      detallesCalculo.push({
        tipo: "total",
        contenido: `${formatoMoneda(tasaRelevamiento)} + ${formatoMoneda(tasaAmpliacion)} = ${formatoMoneda(tasaRetributiva)}`
      });
    }
    // Para obra de refacción
    else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      
      // Calcular el 1% del monto de obra
      tasaRetributiva = monto * 0.01;
      descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra";
      
      // Mostrar detalles del cálculo
      detallesCalculo.push({
        tipo: "formula",
        contenido: "1% del monto de obra"
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `${formatoMoneda(monto)} × 1% = ${formatoMoneda(tasaRetributiva)}`
      });
      
      // Aplicar tasa mínima si corresponde
      if (tasaRetributiva < TASA_MINIMA) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: El cálculo inicial (${formatoMoneda(tasaRetributiva)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
      }
    }
    // Para obra de refacción y ampliación
    else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      // Calcular la parte de refacción (1% del monto)
      const tasaRefaccion = monto * 0.01;
      
      // Calcular la parte de ampliación (como obra nueva)
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.4; // 40%
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 0.6; // 60%
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        // Para Dirección Técnica: 40% del valor base, ajustado por el % restante
        const porcentajeRestante = (100 - avance) / 100;
        tasaAmpliacion = valorBaseAmpliacion * 0.4 * porcentajeRestante;
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        // 60% para Proyecto + 40% para Dirección Técnica (sin ajuste de avance)
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0; // 100%
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
      tasaRetributiva = tasaRefaccion + tasaAmpliacion;
      descripcionServicio = "Refacción + Ampliación (" + tareaSeleccionada + ")";
      
      // Mostrar detalles de los cálculos
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Cálculo de Refacción: ${formatoMoneda(monto)} × 1% = ${formatoMoneda(tasaRefaccion)}`
      });
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Cálculo de Ampliación (${tareaSeleccionada}): ${formatoMoneda(valorBaseAmpliacion)} × porcentaje correspondiente = ${formatoMoneda(tasaAmpliacion)}`
      });
      
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
      detallesCalculo.push({
        tipo: "total",
        contenido: `${formatoMoneda(tasaRefaccion)} + ${formatoMoneda(tasaAmpliacion)} = ${formatoMoneda(tasaRetributiva)}`
      });
      
      // Aplicar tasa mínima si el total es menor
      if (tasaRetributiva < TASA_MINIMA) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: El cálculo total (${formatoMoneda(tasaRetributiva)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)}), por lo que se aplica la tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
      }
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
  const mostrarRefaccionFields = tipoObra === 'refaccion';
  const mostrarRefaccionAmpliacionFields = tipoObra === 'refaccionAmpliacion';
  const mostrarTareasField = tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion';
  const mostrarAvanceField = tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion';
  const mostrarInfoRefaccion = tipoObra === 'refaccion';
  const mostrarInfoRefaccionAmpliacion = tipoObra === 'refaccionAmpliacion';

  return (
    <div className="container my-4" style={{ 
      position: 'relative',
      zIndex: 1000,
      minHeight: '100vh'
    }}>
      {/* Header sin botón de volver */}
      <div className="text-center mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <div style={{ position: 'relative', zIndex: 1001 }}>
          <h2 className="mb-0">Edificios Especiales</h2>
          <p className="mb-0 text-muted">
            Complete el tipo de obra y cargue la/s superficie/s. Luego seleccione la tarea a realizar y presione calcular.
          </p>
        </div>
      </div>

      <div className="row" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="col-lg-6">
          <div className="card" style={{ position: 'relative', zIndex: 1002 }}>
            <div className="card-header" style={{ position: 'relative', zIndex: 1003 }}>
              <h5 className="mb-0">Datos de Entrada</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
                <label htmlFor="tipoObraEdificio" className="form-label">Tipo de Obra</label>
                <select 
                  className="form-select" 
                  id="tipoObraEdificio" 
                  value={tipoObra}
                  onChange={(e) => setTipoObra(e.target.value)}
                  style={{ position: 'relative', zIndex: 1005 }}
                >
                  <option value="nueva">Obra Nueva</option>
                  <option value="construida">Obra Construida</option>
                  <option value="ampliacion">Construida y Ampliación</option>
                  <option value="refaccion">Refacción</option>
                  <option value="refaccionAmpliacion">Refacción y Ampliación</option>
                </select>
              </div>
              
              {/* Campos para Obra Nueva y Obra Construida */}
              {mostrarCamposBasicos && (
                <div className="mb-3" id="m2BasicoField" style={{ position: 'relative', zIndex: 1004 }}>
                  <label htmlFor="m2Edificio" className="form-label">Metros cuadrados (m²)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="m2Edificio" 
                    placeholder="Ingrese los m² de construcción" 
                    min="0"
                    value={m2Edificio}
                    onChange={(e) => setM2Edificio(e.target.value)}
                    style={{ position: 'relative', zIndex: 1005 }}
                  />
                </div>
              )}
              
              {/* Campos específicos para Construida y Ampliación */}
              {mostrarAmpliacionFields && (
                <div id="ampliacionFields" className="ampliacion-fields" style={{ position: 'relative', zIndex: 1004 }}>
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
                      style={{ position: 'relative', zIndex: 1005 }}
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
                      style={{ position: 'relative', zIndex: 1005 }}
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
                      style={{ position: 'relative', zIndex: 1005 }}
                    />
                    <div className="form-text">Si no hay antecedente, dejar en blanco. El antecedente no puede ser mayor a la superficie construida.</div>
                  </div>
                </div>
              )}
              
              {/* Campos específicos para Obra Construida con Antecedente */}
              {mostrarAntecedenteFields && (
                <div id="antecedenteFields" className="antecedente-fields" style={{ position: 'relative', zIndex: 1004 }}>
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
                      style={{ position: 'relative', zIndex: 1005 }}
                    />
                    <div className="form-text">Si no hay antecedente, dejar en blanco. Si la superficie de antecedente es mayor a la superficie general se computará Tasa Mínima.</div>
                  </div>
                </div>
              )}
              
              {/* Campos específicos para Refacción */}
              {mostrarRefaccionFields && (
                <div id="refaccionFields" className="refaccion-fields" style={{ position: 'relative', zIndex: 1004 }}>
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
                      style={{ position: 'relative', zIndex: 1005 }}
                    />
                  </div>
                </div>
              )}
              
              {/* Campos específicos para Refacción y Ampliación */}
              {mostrarRefaccionAmpliacionFields && (
                <div id="refaccionAmpliacionFields" className="refaccion-ampliacion-fields" style={{ position: 'relative', zIndex: 1004 }}>
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
                      style={{ position: 'relative', zIndex: 1005 }}
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
                      style={{ position: 'relative', zIndex: 1005 }}
                    />
                  </div>
                </div>
              )}
              
              {/* Selección de tareas para Obra Nueva y Ampliación */}
              {mostrarTareasField && (
                <div className="mb-3 dynamic-field" id="tareasEdificioField" style={{ position: 'relative', zIndex: 1004 }}>
                  <label className="form-label">Seleccione las tareas:</label>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioEspecial" 
                      id="eAnteproyecto" 
                      value="Anteproyecto" 
                      checked={tareaSeleccionada === "Anteproyecto"}
                      onChange={() => setTareaSeleccionada("Anteproyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="eAnteproyecto">Anteproyecto</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioEspecial" 
                      id="eProyecto" 
                      value="Proyecto" 
                      checked={tareaSeleccionada === "Proyecto"}
                      onChange={() => setTareaSeleccionada("Proyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="eProyecto">Proyecto</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioEspecial" 
                      id="eDireccion" 
                      value="Dirección Técnica" 
                      checked={tareaSeleccionada === "Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="eDireccion">Dirección Técnica</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioEspecial" 
                      id="eAnteproyectoProyecto" 
                      value="Anteproyecto y Proyecto" 
                      checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                      onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="eAnteproyectoProyecto">Anteproyecto y Proyecto</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioEspecial" 
                      id="eProyectoDireccion" 
                      value="Proyecto y Dirección Técnica" 
                      checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="eProyectoDireccion">Proyecto y Dirección Técnica</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioEspecial" 
                      id="eCompleto" 
                      value="Anteproyecto, Proyecto y Dirección Técnica" 
                      checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="eCompleto">Anteproyecto, Proyecto y Dirección Técnica</label>
                  </div>
                </div>
              )}
              
              {/* Información específica para Refacción */}
              {mostrarInfoRefaccion && (
                <div id="infoRefaccion" className="alert alert-info" style={{ position: 'relative', zIndex: 1005 }}>
                  Para Refacción, la tasa retributiva se calcula como el 1% del monto de obra, aplicándose a la tarea completa de Anteproyecto, Proyecto y Dirección Técnica.
                </div>
              )}
              
              {/* Información específica para Refacción y Ampliación */}
              {mostrarInfoRefaccionAmpliacion && (
                <div id="infoRefaccionAmpliacion" className="alert alert-info" style={{ position: 'relative', zIndex: 1005 }}>
                  Para Refacción y Ampliación, se calcula una tasa parcial por la refacción (1% del monto) y otra por la ampliación (como obra nueva). La tasa total es la suma de ambos.
                </div>
              )}
              
              {mostrarAvanceField && (
                <div className="mb-3" id="avanceField" style={{ position: 'relative', zIndex: 1004 }}>
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
                    style={{ position: 'relative', zIndex: 1005 }}
                  />
                  <div className="form-text">Ingrese 0 si no hay avance de obra. Este valor solo afecta al cálculo de Dirección Técnica.</div>
                </div>
              )}
              
              <div className="d-grid" style={{ position: 'relative', zIndex: 1005 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={calcularEdificio}
                  style={{ position: 'relative', zIndex: 1006 }}
                >
                  Calcular
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card result-card" style={{ position: 'relative', zIndex: 1002 }}>
            <div className="card-header" style={{ position: 'relative', zIndex: 1003 }}>
              <h5 className="mb-0">Resultados - Edificios Especiales</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              {resultados ? (
                resultados.error ? (
                  <div className="alert alert-warning text-center" style={{ position: 'relative', zIndex: 1004 }}>
                    {resultados.error}
                  </div>
                ) : (
                  <div id="resultadosEdificio" style={{ position: 'relative', zIndex: 1004 }}>
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
                    
                    {/* Botón Volver fijo al final de los resultados */}
                    <div className="mt-4 pt-3 border-top" style={{ position: 'relative', zIndex: 1005 }}>
                      <Button 
                        onClick={onBack}
                        className="back-button-custom d-inline-flex align-items-center justify-content-center w-100"
                        style={{
                          backgroundColor: '#7B9C6B',
                          borderColor: '#7B9C6B',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        <FaArrowLeft className="me-2" />
                        Volver al Menú Principal
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ position: 'relative', zIndex: 1004 }}>
                  <p className="text-center text-muted">
                    Ingrese los datos y haga clic en calcular para ver los resultados
                  </p>
                  
                  {/* Botón Volver visible incluso sin resultados */}
                  <div className="mt-4 pt-3 border-top" style={{ position: 'relative', zIndex: 1005 }}>
                    <Button 
                      onClick={onBack}
                      className="back-button-custom d-inline-flex align-items-center justify-content-center w-100"
                      style={{
                        backgroundColor: '#7B9C6B',
                        borderColor: '#7B9C6B',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}
                    >
                      <FaArrowLeft className="me-2" />
                      Volver al Menú Principal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdificiosEspecialesC;