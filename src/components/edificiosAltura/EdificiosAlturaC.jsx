import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './EdificiosAlturaC.css';

const EdificiosAlturaC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000

  // Estados raw (sin formato)
  const [tipoObra, setTipoObra] = useState('nueva');
  const [m2ViviendaRaw, setM2ViviendaRaw] = useState('');
  const [m2ConstruidaRaw, setM2ConstruidaRaw] = useState('');
  const [m2AmpliacionRaw, setM2AmpliacionRaw] = useState('');
  const [m2AntecedenteAmpliacionRaw, setM2AntecedenteAmpliacionRaw] = useState('');
  const [m2AntecedenteConstruidaRaw, setM2AntecedenteConstruidaRaw] = useState('');
  const [montoRefaccionRaw, setMontoRefaccionRaw] = useState('');
  const [montoRefaccionAmpliacionRaw, setMontoRefaccionAmpliacionRaw] = useState('');
  const [m2AmpliacionRefaccionRaw, setM2AmpliacionRefaccionRaw] = useState('');
  
  // Estados display (con formato)
  const [m2ViviendaDisplay, setM2ViviendaDisplay] = useState('');
  const [m2ConstruidaDisplay, setM2ConstruidaDisplay] = useState('');
  const [m2AmpliacionDisplay, setM2AmpliacionDisplay] = useState('');
  const [m2AntecedenteAmpliacionDisplay, setM2AntecedenteAmpliacionDisplay] = useState('');
  const [m2AntecedenteConstruidaDisplay, setM2AntecedenteConstruidaDisplay] = useState('');
  const [montoRefaccionDisplay, setMontoRefaccionDisplay] = useState('');
  const [montoRefaccionAmpliacionDisplay, setMontoRefaccionAmpliacionDisplay] = useState('');
  const [m2AmpliacionRefaccionDisplay, setM2AmpliacionRefaccionDisplay] = useState('');

  const [tareaSeleccionada, setTareaSeleccionada] = useState('Anteproyecto');
  const [avanceVivienda, setAvanceVivienda] = useState('');
  const [resultados, setResultados] = useState(null);

  // Efecto para limpiar resultados cuando cambian los campos de entrada
  useEffect(() => {
    setResultados(null);
  }, [
    tipoObra,
    m2ViviendaRaw,
    m2ConstruidaRaw,
    m2AmpliacionRaw,
    m2AntecedenteAmpliacionRaw,
    m2AntecedenteConstruidaRaw,
    montoRefaccionRaw,
    montoRefaccionAmpliacionRaw,
    m2AmpliacionRefaccionRaw,
    tareaSeleccionada,
    avanceVivienda
  ]);

  // Formateador de números con separador de miles (punto)
  const formatNumber = (numStr) => {
    if (!numStr) return '';
    const clean = numStr.toString().replace(/[^0-9]/g, '');
    if (clean === '') return '';
    return parseInt(clean, 10).toLocaleString('es-AR');
  };

  // Handlers para cada campo de superficie
  const handleM2ViviendaChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setM2ViviendaRaw(raw);
    setM2ViviendaDisplay(formatNumber(raw));
  };
  const handleM2ViviendaBlur = () => setM2ViviendaDisplay(formatNumber(m2ViviendaRaw));

  const handleM2ConstruidaChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setM2ConstruidaRaw(raw);
    setM2ConstruidaDisplay(formatNumber(raw));
  };
  const handleM2ConstruidaBlur = () => setM2ConstruidaDisplay(formatNumber(m2ConstruidaRaw));

  const handleM2AmpliacionChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setM2AmpliacionRaw(raw);
    setM2AmpliacionDisplay(formatNumber(raw));
  };
  const handleM2AmpliacionBlur = () => setM2AmpliacionDisplay(formatNumber(m2AmpliacionRaw));

  const handleM2AntecedenteAmpliacionChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setM2AntecedenteAmpliacionRaw(raw);
    setM2AntecedenteAmpliacionDisplay(formatNumber(raw));
  };
  const handleM2AntecedenteAmpliacionBlur = () => setM2AntecedenteAmpliacionDisplay(formatNumber(m2AntecedenteAmpliacionRaw));

  const handleM2AntecedenteConstruidaChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setM2AntecedenteConstruidaRaw(raw);
    setM2AntecedenteConstruidaDisplay(formatNumber(raw));
  };
  const handleM2AntecedenteConstruidaBlur = () => setM2AntecedenteConstruidaDisplay(formatNumber(m2AntecedenteConstruidaRaw));

  const handleM2AmpliacionRefaccionChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setM2AmpliacionRefaccionRaw(raw);
    setM2AmpliacionRefaccionDisplay(formatNumber(raw));
  };
  const handleM2AmpliacionRefaccionBlur = () => setM2AmpliacionRefaccionDisplay(formatNumber(m2AmpliacionRefaccionRaw));

  // Handlers para montos en pesos (también con formato)
  const handleMontoRefaccionChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMontoRefaccionRaw(raw);
    setMontoRefaccionDisplay(formatNumber(raw));
  };
  const handleMontoRefaccionBlur = () => setMontoRefaccionDisplay(formatNumber(montoRefaccionRaw));

  const handleMontoRefaccionAmpliacionChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setMontoRefaccionAmpliacionRaw(raw);
    setMontoRefaccionAmpliacionDisplay(formatNumber(raw));
  };
  const handleMontoRefaccionAmpliacionBlur = () => setMontoRefaccionAmpliacionDisplay(formatNumber(montoRefaccionAmpliacionRaw));

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular la tasa de relevamiento (60% base)
  const calcularTasaRelevamiento = (m2) => {
    if (m2 <= 0) return 0;
    return m2 * VPTR * 0.6;
  };

  // Función para calcular el valor según los tramos de m2 específicos para edificios en altura
  const calcularPorTramos = (m2) => {
    let total = 0;
    
    // Primeros 2000m² al 80%
    const tramo1 = Math.min(m2, 2000);
    total += tramo1 * VPTR * 0.8;
    
    // Segundos 2000m² al 60%
    if (m2 > 2000) {
      const tramo2 = Math.min(m2 - 2000, 2000);
      total += tramo2 * VPTR * 0.6;
    }
    
    // Resto al 45%
    if (m2 > 4000) {
      const tramo3 = m2 - 4000;
      total += tramo3 * VPTR * 0.45;
    }
    
    return total;
  };

  // Función para calcular resultados (la misma lógica, usando los raw)
  const calcularVivienda = () => {
    let m2 = 0;
    let avance = parseFloat(avanceVivienda) || 0;
    
    // Validaciones según el tipo de obra
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2ConstruidaRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRaw) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacionRaw) || 0;
      
      if (ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese un valor válido para la superficie de ampliación (debe ser mayor a 0)."
        });
        return;
      }
      
      if (construida > 0 && antecedente > construida) {
        setResultados({
          error: `Error: La superficie de antecedente (${antecedente} m²) no puede ser mayor que la superficie construida (${construida} m²).`
        });
        return;
      }
      
      m2 = construida + ampliacion;
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccionRaw) || 0;
      
      if (monto <= 0) {
        setResultados({
          error: "Por favor, ingrese un monto válido para la refacción."
        });
        return;
      }
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacionRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccionRaw) || 0;
      
      if (monto <= 0 || ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese valores válidos para el monto de refacción y la superficie de ampliación."
        });
        return;
      }
    } else {
      m2 = parseFloat(m2ViviendaRaw) || 0;
      
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
      const construida = parseFloat(m2ConstruidaRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRaw) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacionRaw) || 0;
      
      html.push({ label: "Superficie Construida", value: `${construida} m²` });
      html.push({ label: "Superficie Ampliación", value: `${ampliacion} m²` });
      html.push({ label: "Superficie Total", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
    } else if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruidaRaw) || 0;
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccionRaw) || 0;
      html.push({ label: "Monto de Obra", value: formatoMoneda(monto) });
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacionRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccionRaw) || 0;
      
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

    // ===== CÁLCULOS (exactamente igual que el original) =====
    // Para obra construida
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruidaRaw) || 0;
      let superficieRelevamiento = m2 - antecedente;
      
      html.push({ label: "Superficie a Relevar", value: `${m2} m² - ${antecedente} m² = ${superficieRelevamiento} m²` });
      
      let tasaCalculada = 0;
      let aplicaTasaMinima = false;
      
      if (superficieRelevamiento <= 0) {
        tasaCalculada = 0;
        aplicaTasaMinima = true;
      } else {
        tasaCalculada = calcularTasaRelevamiento(superficieRelevamiento);
        if (tasaCalculada < TASA_MINIMA) {
          aplicaTasaMinima = true;
        }
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
      let valorBase = calcularPorTramos(m2);
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
      
      if (tasaCalculada < TASA_MINIMA && tasaCalculada > 0 && !esDireccionSinAvance) {
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio = tareaSeleccionada + " (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaCalculada;
        descripcionServicio = tareaSeleccionada;
      }
    }
    // Para obra de ampliación
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2ConstruidaRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRaw) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacionRaw) || 0;
      
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
          if (relevamientoOriginal < TASA_MINIMA) {
            relevamientoAplicaMinima = true;
          }
        }
        
        tasaRelevamiento = relevamientoAplicaMinima ? TASA_MINIMA : relevamientoOriginal;
      } else {
        html.push({ label: "Superficie a Relevar", value: "0 m² (sin construcción existente)" });
        tasaRelevamiento = 0;
      }
      
      // Calcular ampliación
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
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
      
      if (ampliacionOriginal < TASA_MINIMA && ampliacionOriginal > 0 && !esDireccionSinAvance) {
        ampliacionAplicaMinima = true;
        ampliacionOriginal = TASA_MINIMA;
      }
      
      tasaAmpliacion = ampliacionOriginal;
      
      let tasaTotal = tasaRelevamiento + tasaAmpliacion;
      let totalAplicaMinima = false;
      
      if (tasaTotal > 0 && tasaTotal < TASA_MINIMA) {
        totalAplicaMinima = true;
        tasaRetributiva = TASA_MINIMA;
      } else {
        tasaRetributiva = tasaTotal;
      }
      
      const partes = [];
      if (construida > 0) {
        partes.push(`Relevamiento${relevamientoAplicaMinima ? " (tasa mínima)" : ""}`);
      }
      partes.push(tareaSeleccionada + (ampliacionAplicaMinima ? " (tasa mínima)" : ""));
      descripcionServicio = partes.join(" + ");
      if (totalAplicaMinima) {
        descripcionServicio += " → Total con tasa mínima";
      }
      if (construida === 0) {
        descripcionServicio = tareaSeleccionada + (ampliacionAplicaMinima ? " (tasa mínima)" : "") + " (sin relevamiento)";
        if (totalAplicaMinima) {
          descripcionServicio += " → Total con tasa mínima";
        }
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
    // Para obra de refacción
    else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccionRaw) || 0;
      let tasaCalculada = monto * 0.01;
      descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra";
      
      if (tasaCalculada < TASA_MINIMA) {
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaCalculada;
      }
    }
    // Para obra de refacción y ampliación
    else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacionRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccionRaw) || 0;
      
      const tasaRefaccionOriginal = monto * 0.01;
      let tasaRefaccion = tasaRefaccionOriginal;
      let refaccionAplicaMinima = false;
      
      if (tasaRefaccionOriginal < TASA_MINIMA) {
        refaccionAplicaMinima = true;
        tasaRefaccion = TASA_MINIMA;
      }
      
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
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
      
      if (ampliacionOriginal < TASA_MINIMA && ampliacionOriginal > 0 && !esDireccionSinAvance) {
        ampliacionAplicaMinima = true;
        ampliacionOriginal = TASA_MINIMA;
      }
      
      tasaAmpliacion = ampliacionOriginal;
      
      let tasaTotal = tasaRefaccion + tasaAmpliacion;
      let totalAplicaMinima = false;
      
      if (tasaTotal < TASA_MINIMA) {
        totalAplicaMinima = true;
        tasaRetributiva = TASA_MINIMA;
      } else {
        tasaRetributiva = tasaTotal;
      }
      
      descripcionServicio = "Refacción" + (refaccionAplicaMinima ? " (tasa mínima)" : "") + " + Ampliación (" + tareaSeleccionada + ")" + (ampliacionAplicaMinima ? " (tasa mínima)" : "");
      if (totalAplicaMinima) {
        descripcionServicio += " → Total con tasa mínima";
      }
      
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
      html.push({ label: "Tasa Refacción", value: formatoMoneda(tasaRefaccion) + (refaccionAplicaMinima ? " (mínima)" : "") });
      html.push({ label: "Tasa Ampliación", value: formatoMoneda(tasaAmpliacion) + (ampliacionAplicaMinima ? " (mínima)" : "") });
      if (refaccionAplicaMinima && tasaRefaccionOriginal > 0) {
        html.push({ label: "Tasa Refacción (original)", value: formatoMoneda(tasaRefaccionOriginal) });
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
    <Container fluid className="edificios-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/edificios_altura.jpg" 
          alt="Edificios en Altura"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/edificios_altura.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo (ahora oscuros) */}
      <div className="text-center mb-4">
        <h2 className="main-title">Edificios en Altura</h2>
        <p className="subtitle">
          Complete el tipo de obra y cargue la/s superficie/s. Luego seleccione la tarea a realizar y presione calcular.
        </p>
      </div>

      {/* Formulario */}
      <div className="form-card">
        <div className="mb-3">
          <label htmlFor="tipoObraEdificios" className="form-label">Tipo de Obra</label>
          <select 
            className="form-select" 
            id="tipoObraEdificios" 
            value={tipoObra}
            onChange={(e) => setTipoObra(e.target.value)}
          >
            <option value="nueva">Obra Nueva</option>
            <option value="construida">Obra Construida</option>
            <option value="ampliacion">Construida y Ampliación</option>
            <option value="refaccion">Refacción</option>
            <option value="refaccionAmpliacion">Refacción y Ampliación</option>
          </select>
          {tipoObra === 'ampliacion' && (
            <div className="form-text text-muted mt-2">
              <small>La superficie construida puede ser 0 si no hay construcción existente. En ese caso, solo se calculará la ampliación (sin relevamiento).</small>
            </div>
          )}
        </div>
        
        {mostrarCamposBasicos && (
          <div className="mb-3">
            <label htmlFor="m2Vivienda" className="form-label">Metros cuadrados (m²)</label>
            <input 
              type="text" 
              className="form-control" 
              id="m2Vivienda" 
              placeholder="Ingrese los m² de construcción" 
              value={m2ViviendaDisplay}
              onChange={handleM2ViviendaChange}
              onBlur={handleM2ViviendaBlur}
            />
          </div>
        )}
        
        {mostrarAmpliacionFields && (
          <div className="ampliacion-fields">
            <div className="mb-3">
              <label htmlFor="m2Construida" className="form-label">Superficie Construida (m²)</label>
              <input 
                type="text" 
                className="form-control" 
                id="m2Construida" 
                placeholder="Superficie ya construida (puede ser 0)" 
                value={m2ConstruidaDisplay}
                onChange={handleM2ConstruidaChange}
                onBlur={handleM2ConstruidaBlur}
              />
              <div className="form-text">Puede ser 0 si no hay construcción existente.</div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="m2Ampliacion" className="form-label">Superficie de Ampliación (m²)</label>
              <input 
                type="text" 
                className="form-control" 
                id="m2Ampliacion" 
                placeholder="Superficie a ampliar" 
                value={m2AmpliacionDisplay}
                onChange={handleM2AmpliacionChange}
                onBlur={handleM2AmpliacionBlur}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="m2AntecedenteAmpliacion" className="form-label">Superficie de Antecedente (m²)</label>
              <input 
                type="text" 
                className="form-control" 
                id="m2AntecedenteAmpliacion" 
                placeholder="Superficie de antecedente (opcional)" 
                value={m2AntecedenteAmpliacionDisplay}
                onChange={handleM2AntecedenteAmpliacionChange}
                onBlur={handleM2AntecedenteAmpliacionBlur}
              />
              <div className="form-text">Si no hay antecedente, dejar en blanco o 0.</div>
            </div>
          </div>
        )}
        
        {mostrarAntecedenteFields && (
          <div className="antecedente-fields">
            <div className="mb-3">
              <label htmlFor="m2AntecedenteConstruida" className="form-label">Superficie de Antecedente (m²)</label>
              <input 
                type="text" 
                className="form-control" 
                id="m2AntecedenteConstruida" 
                placeholder="Superficie de antecedente (opcional)" 
                value={m2AntecedenteConstruidaDisplay}
                onChange={handleM2AntecedenteConstruidaChange}
                onBlur={handleM2AntecedenteConstruidaBlur}
              />
              <div className="form-text">Si no hay antecedente, dejar en blanco o 0.</div>
            </div>
          </div>
        )}
        
        {mostrarRefaccionFields && (
          <div className="refaccion-fields">
            <div className="mb-3">
              <label htmlFor="montoRefaccion" className="form-label">Monto de Obra en $</label>
              <input 
                type="text" 
                className="form-control" 
                id="montoRefaccion" 
                placeholder="Ingrese el monto total de la refacción" 
                value={montoRefaccionDisplay}
                onChange={handleMontoRefaccionChange}
                onBlur={handleMontoRefaccionBlur}
              />
            </div>
          </div>
        )}
        
        {mostrarRefaccionAmpliacionFields && (
          <div className="refaccion-ampliacion-fields">
            <div className="mb-3">
              <label htmlFor="montoRefaccionAmpliacion" className="form-label">Monto de Refacción en $</label>
              <input 
                type="text" 
                className="form-control" 
                id="montoRefaccionAmpliacion" 
                placeholder="Ingrese el monto total de la refacción" 
                value={montoRefaccionAmpliacionDisplay}
                onChange={handleMontoRefaccionAmpliacionChange}
                onBlur={handleMontoRefaccionAmpliacionBlur}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="m2AmpliacionRefaccion" className="form-label">Superficie de Ampliación (m²)</label>
              <input 
                type="text" 
                className="form-control" 
                id="m2AmpliacionRefaccion" 
                placeholder="Superficie a ampliar" 
                value={m2AmpliacionRefaccionDisplay}
                onChange={handleM2AmpliacionRefaccionChange}
                onBlur={handleM2AmpliacionRefaccionBlur}
              />
            </div>
          </div>
        )}
        
        {mostrarTareasField && (
          <div className="mb-3 dynamic-field">
            <label className="form-label">Seleccione las tareas:</label>
            <div className="form-check task-item">
              <input 
                className="form-check-input" 
                type="radio" 
                name="tareaEdificioAltura" 
                id="eAnteproyecto" 
                value="Anteproyecto" 
                checked={tareaSeleccionada === "Anteproyecto"}
                onChange={() => setTareaSeleccionada("Anteproyecto")}
              />
              <label className="form-check-label" htmlFor="eAnteproyecto">Anteproyecto</label>
            </div>
            <div className="form-check task-item">
              <input 
                className="form-check-input" 
                type="radio" 
                name="tareaEdificioAltura" 
                id="eProyecto" 
                value="Proyecto" 
                checked={tareaSeleccionada === "Proyecto"}
                onChange={() => setTareaSeleccionada("Proyecto")}
              />
              <label className="form-check-label" htmlFor="eProyecto">Proyecto</label>
            </div>
            <div className="form-check task-item">
              <input 
                className="form-check-input" 
                type="radio" 
                name="tareaEdificioAltura" 
                id="eDireccion" 
                value="Dirección Técnica" 
                checked={tareaSeleccionada === "Dirección Técnica"}
                onChange={() => setTareaSeleccionada("Dirección Técnica")}
              />
              <label className="form-check-label" htmlFor="eDireccion">Dirección Técnica</label>
            </div>
            <div className="form-check task-item">
              <input 
                className="form-check-input" 
                type="radio" 
                name="tareaEdificioAltura" 
                id="eAnteproyectoProyecto" 
                value="Anteproyecto y Proyecto" 
                checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
              />
              <label className="form-check-label" htmlFor="eAnteproyectoProyecto">Anteproyecto y Proyecto</label>
            </div>
            <div className="form-check task-item">
              <input 
                className="form-check-input" 
                type="radio" 
                name="tareaEdificioAltura" 
                id="eProyectoDireccion" 
                value="Proyecto y Dirección Técnica" 
                checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
              />
              <label className="form-check-label" htmlFor="eProyectoDireccion">Proyecto y Dirección Técnica</label>
            </div>
            <div className="form-check task-item">
              <input 
                className="form-check-input" 
                type="radio" 
                name="tareaEdificioAltura" 
                id="eCompleto" 
                value="Anteproyecto, Proyecto y Dirección Técnica" 
                checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
              />
              <label className="form-check-label" htmlFor="eCompleto">Anteproyecto, Proyecto y Dirección Técnica</label>
            </div>
          </div>
        )}
        
        {mostrarInfoRefaccion && (
          <div className="alert alert-info">
            Para Refacción, la tasa retributiva se calcula como el 1% del monto de obra, aplicándose a la tarea completa de Anteproyecto, Proyecto y Dirección Técnica.
          </div>
        )}
        
        {mostrarInfoRefaccionAmpliacion && (
          <div className="alert alert-info">
            Para Refacción y Ampliación, se calcula una tasa parcial por la refacción (1% del monto) y otra por la ampliación (como obra nueva). La tasa total es la suma de ambos.
          </div>
        )}
        
        {mostrarAvanceField && (
          <div className="mb-3">
            <label htmlFor="avanceEdificios" className="form-label">% Avance de Obra (solo para Dirección Técnica)</label>
            <input 
              type="number" 
              className="form-control" 
              id="avanceEdificios" 
              placeholder="Sin avance de obra (0%)" 
              min="0" 
              max="100"
              value={avanceVivienda}
              onChange={(e) => setAvanceVivienda(e.target.value)}
            />
            <div className="form-text">Ingrese 0 si no hay avance de obra.</div>
          </div>
        )}
        
        <div className="d-grid">
          <button 
            className="calculate-button" 
            onClick={calcularVivienda}
          >
            Calcular
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Edificios en Altura</h4>
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

export default EdificiosAlturaC;