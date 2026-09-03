import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './ViviendaPropiaC.css';

const ViviendaPropiaC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000
  const SUPERFICIE_LIMITE = 300; // 300m²

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

  // ===== EFECTO PARA SCROLL AL INICIO =====
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Efecto para limpiar resultados cuando cambian los campos
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

  // Handlers para montos en pesos
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

  // Función para calcular superficie relevante (exceso sobre 300m²) de una superficie bruta
  const calcularSuperficieRelevante = (m2) => {
    return Math.max(0, m2 - SUPERFICIE_LIMITE);
  };

  // Función para calcular superficie neta restando antecedente y luego aplicando límite
  const calcularSuperficieNetaRelevante = (total, antecedente) => {
    const neta = total - antecedente;
    return Math.max(0, neta - SUPERFICIE_LIMITE);
  };

  // Función para calcular el valor según los tramos (aplicado sobre superficie relevante)
  const calcularPorTramos = (m2) => {
    if (m2 <= 0) return 0;
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

  // Función para aplicar tasa mínima si es necesario
  const aplicarTasaMinimaSiCorresponde = (tasaCalculada, motivo = "") => {
    if (tasaCalculada < TASA_MINIMA && tasaCalculada > 0) {
      return {
        tasa: TASA_MINIMA,
        aplicada: true,
        motivo: motivo || `El cálculo total (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)})`
      };
    }
    return {
      tasa: tasaCalculada,
      aplicada: false,
      motivo: ""
    };
  };

  // Función para calcular resultados
  const calcularVivienda = () => {
    let m2 = 0;
    let avance = parseFloat(avanceVivienda) || 0;
    
    // Validaciones según el tipo de obra
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2ConstruidaRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRaw) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacionRaw) || 0;
      
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
      
      const construidaRelevante = calcularSuperficieRelevante(construida);
      const ampliacionRelevante = calcularSuperficieRelevante(ampliacion);
      html.push({ label: "Superficie Construida Relevante (sobre 300m²)", value: `${construidaRelevante} m²` });
      html.push({ label: "Superficie Ampliación Relevante (sobre 300m²)", value: `${ampliacionRelevante} m²` });
      
    } else if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruidaRaw) || 0;
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
      
      const superficieNeta = Math.max(0, m2 - antecedente);
      html.push({ label: "Superficie Neta (total - antecedente)", value: `${superficieNeta} m²` });
      
      const superficieRelevante = calcularSuperficieRelevante(superficieNeta);
      html.push({ label: "Superficie a Relevar (excedente sobre 300m²)", value: `${superficieRelevante} m²` });
      
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccionRaw) || 0;
      html.push({ label: "Monto de Obra", value: formatoMoneda(monto) });
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacionRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccionRaw) || 0;
      
      html.push({ label: "Monto de Refacción", value: formatoMoneda(monto) });
      html.push({ label: "Superficie de Ampliación", value: `${ampliacion} m²` });
      
      const ampliacionRelevante = calcularSuperficieRelevante(ampliacion);
      html.push({ label: "Superficie Ampliación Relevante (sobre 300m²)", value: `${ampliacionRelevante} m²` });
      
    } else {
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
      
      const superficieRelevante = calcularSuperficieRelevante(m2);
      html.push({ label: "Superficie Relevante (sobre 300m²)", value: `${superficieRelevante} m²` });
    }
    
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    html.push({ label: "Superficie Límite", value: `${SUPERFICIE_LIMITE} m²` });
    
    if (tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion') {
      html.push({ label: "% Avance de Obra", value: `${avance}% (solo aplica a Dirección Técnica)` });
    }
    
    let tasaRetributiva = 0;
    let descripcionServicio = "";

    // ===== BLOQUE DE CÁLCULO =====

    // Para obra construida
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruidaRaw) || 0;
      const superficieNeta = Math.max(0, m2 - antecedente);
      const m2Relevamiento = calcularSuperficieRelevante(superficieNeta);
      
      let tasaCalculada = 0;
      if (m2Relevamiento <= 0) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `La superficie neta (${superficieNeta} m²) es menor o igual a ${SUPERFICIE_LIMITE} m². No hay superficie a relevar. Se aplica tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio = "Relevamiento (tasa mínima aplicada)";
      } else {
        tasaCalculada = m2Relevamiento * VPTR * 0.6;
        detallesCalculo.push({
          tipo: "formula",
          contenido: `Superficie a relevar: ${m2Relevamiento} m² (neta ${superficieNeta} m² - ${SUPERFICIE_LIMITE} m²)`
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaCalculada)}`
        });
        const resultadoTasa = aplicarTasaMinimaSiCorresponde(tasaCalculada);
        if (resultadoTasa.aplicada) {
          detallesCalculo.push({
            tipo: "info",
            contenido: resultadoTasa.motivo
          });
          tasaRetributiva = resultadoTasa.tasa;
          descripcionServicio = "Relevamiento (tasa mínima aplicada)";
        } else {
          tasaRetributiva = tasaCalculada;
          descripcionServicio = "Relevamiento";
        }
      }
    } 
    // Para obra nueva
    else if (tipoObra === 'nueva') {
      descripcionServicio = tareaSeleccionada;
      const superficieRelevante = calcularSuperficieRelevante(m2);
      
      if (superficieRelevante <= 0) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Superficie (${m2} m²) menor o igual a ${SUPERFICIE_LIMITE} m². Se aplica tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio += " (tasa mínima aplicada)";
      } else {
        let valorBase = calcularPorTramos(superficieRelevante);
        html.push({ label: "Valor Base (sobre superficie relevante)", value: formatoMoneda(valorBase) });

        if (tareaSeleccionada === "Anteproyecto") {
          tasaRetributiva = valorBase * 0.4;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
        else if (tareaSeleccionada === "Proyecto") {
          tasaRetributiva = valorBase * 0.6;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "60%" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
        else if (tareaSeleccionada === "Dirección Técnica") {
          const porcentajeRestante = (100 - avance) / 100;
          tasaRetributiva = valorBase * 0.4 * porcentajeRestante;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
          if (avance > 0) {
            detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante: ${(100 - avance).toFixed(0)}%` });
            detallesCalculo.push({
              tipo: "calculo",
              contenido: `${formatoMoneda(valorBase)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaRetributiva)}`
            });
          } else {
            detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra: 100% de la dirección técnica" });
            detallesCalculo.push({
              tipo: "calculo",
              contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaRetributiva)}`
            });
          }
        }
        else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
          tasaRetributiva = valorBase * 1.0;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
        else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
          tasaRetributiva = valorBase * 1.0;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "100% (60% Proyecto + 40% Dirección)" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
        else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
          tasaRetributiva = valorBase * 1.0;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaRetributiva)}`
          });
        }

        const resultadoTasa = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
        if (resultadoTasa.aplicada) {
          detallesCalculo.push({
            tipo: "info",
            contenido: resultadoTasa.motivo
          });
          tasaRetributiva = resultadoTasa.tasa;
          descripcionServicio += " (tasa mínima aplicada)";
        }
      }
    }
    // Para obra de ampliación
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2ConstruidaRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRaw) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacionRaw) || 0;
      
      const construidaNeta = Math.max(0, construida - antecedente);
      const m2Relevamiento = calcularSuperficieRelevante(construidaNeta);
      
      let tasaRelevamiento = 0;
      if (m2Relevamiento <= 0) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Superficie construida neta (${construidaNeta} m²) menor o igual a ${SUPERFICIE_LIMITE} m². No se calcula relevamiento.`
        });
        tasaRelevamiento = 0;
      } else {
        tasaRelevamiento = m2Relevamiento * VPTR * 0.6;
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Relevamiento: ${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaRelevamiento)}`
        });
      }
      
      const superficieAmpliacionRelevante = calcularSuperficieRelevante(ampliacion);
      let valorBaseAmpliacion = calcularPorTramos(superficieAmpliacionRelevante);
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
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }
      
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Ampliación (${tareaSeleccionada}): ${formatoMoneda(valorBaseAmpliacion)} × % correspondiente = ${formatoMoneda(tasaAmpliacion)}`
      });
      
      let tasaTotal = tasaRelevamiento + tasaAmpliacion;
      descripcionServicio = "Relevamiento + " + tareaSeleccionada;
      
      const resultadoTotal = aplicarTasaMinimaSiCorresponde(tasaTotal);
      if (resultadoTotal.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: resultadoTotal.motivo
        });
        tasaRetributiva = resultadoTotal.tasa;
        descripcionServicio += " (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaTotal;
      }
      
      html.push({ label: "Tasa Relevamiento", value: formatoMoneda(tasaRelevamiento) });
      html.push({ label: "Tasa Ampliación", value: formatoMoneda(tasaAmpliacion) });
    }
    // Para obra de refacción
    else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccionRaw) || 0;
      tasaRetributiva = monto * 0.01;
      descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra";
      
      detallesCalculo.push({
        tipo: "formula",
        contenido: "1% del monto de obra"
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `${formatoMoneda(monto)} × 1% = ${formatoMoneda(tasaRetributiva)}`
      });
      
      const resultadoTasa = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
      if (resultadoTasa.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: resultadoTasa.motivo
        });
        tasaRetributiva = resultadoTasa.tasa;
        descripcionServicio += " (tasa mínima aplicada)";
      }
    }
    // Para obra de refacción y ampliación
    else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacionRaw) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccionRaw) || 0;
      
      const tasaRefaccion = monto * 0.01;
      const superficieAmpliacionRelevante = calcularSuperficieRelevante(ampliacion);
      let valorBaseAmpliacion = calcularPorTramos(superficieAmpliacionRelevante);
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
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaAmpliacion = valorBaseAmpliacion * 1.0;
      }
      
      html.push({ label: "Valor Base Ampliación", value: formatoMoneda(valorBaseAmpliacion) });
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Refacción: ${formatoMoneda(monto)} × 1% = ${formatoMoneda(tasaRefaccion)}`
      });
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Ampliación (${tareaSeleccionada}): ${formatoMoneda(valorBaseAmpliacion)} × % correspondiente = ${formatoMoneda(tasaAmpliacion)}`
      });
      
      let tasaTotal = tasaRefaccion + tasaAmpliacion;
      descripcionServicio = "Refacción + Ampliación (" + tareaSeleccionada + ")";
      
      const resultadoTotal = aplicarTasaMinimaSiCorresponde(tasaTotal);
      if (resultadoTotal.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: resultadoTotal.motivo
        });
        tasaRetributiva = resultadoTotal.tasa;
        descripcionServicio += " (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaTotal;
      }
      
      html.push({ label: "Tasa Refacción", value: formatoMoneda(tasaRefaccion) });
      html.push({ label: "Tasa Ampliación", value: formatoMoneda(tasaAmpliacion) });
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
    <Container fluid className="vivienda-propia-container">
      {/* Imagen superior */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/viviendaPropia.jpg" 
          alt="Vivienda Propia"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/viviendaPropia.jpg';
          }}
        />
      </div>

      {/* Título y subtítulo */}
      <div className="text-center mb-4">
        <h2 className="main-title">Vivienda Propia</h2>
        <p className="subtitle">
          Complete el tipo de obra y cargue la/s superficie/s. Luego seleccione la tarea a realizar y presione calcular.
        </p>
        <p className="alert alert-info">
          Nota: El cálculo se realiza a partir de los {SUPERFICIE_LIMITE}m². Superficies menores o iguales a {SUPERFICIE_LIMITE}m² aplican tasa mínima.
        </p>
      </div>

      {/* Formulario */}
      <div className="form-card">
        <div className="row">
          <div className="col-lg-12">
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
            
            {mostrarCamposBasicos && (
              <div className="mb-3" id="m2BasicoField">
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
              <div id="ampliacionFields" className="ampliacion-fields">
                <div className="mb-3">
                  <label htmlFor="m2Construida" className="form-label">Superficie Construida (m²)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="m2Construida" 
                    placeholder="Superficie ya construida" 
                    value={m2ConstruidaDisplay}
                    onChange={handleM2ConstruidaChange}
                    onBlur={handleM2ConstruidaBlur}
                  />
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
                  <div className="form-text">El antecedente no puede ser mayor a la superficie construida.</div>
                </div>
              </div>
            )}
            
            {mostrarAntecedenteFields && (
              <div id="antecedenteFields" className="antecedente-fields">
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
                  <div className="form-text">Si el antecedente es mayor o igual a la superficie total, se aplica tasa mínima.</div>
                </div>
              </div>
            )}
            
            {mostrarRefaccionFields && (
              <div id="refaccionFields" className="refaccion-fields">
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
              <div id="refaccionAmpliacionFields" className="refaccion-ampliacion-fields">
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
              <div className="mb-3 dynamic-field" id="tareasViviendaField">
                <label className="form-label">Seleccione las tareas:</label>
                <div className="form-check task-item">
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
                <div className="form-check task-item">
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
                <div className="form-check task-item">
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
                <div className="form-check task-item">
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
                <div className="form-check task-item">
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
                <div className="form-check task-item">
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
            
            {mostrarInfoRefaccion && (
              <div id="infoRefaccion" className="alert alert-info">
                Para Refacción, la tasa retributiva se calcula como el 1% del monto de obra, aplicándose a la tarea completa de Anteproyecto, Proyecto y Dirección Técnica.
              </div>
            )}
            
            {mostrarInfoRefaccionAmpliacion && (
              <div id="infoRefaccionAmpliacion" className="alert alert-info">
                Para Refacción y Ampliación, se calcula una tasa parcial por la refacción (1% del monto) y otra por la ampliación (como obra nueva). La tasa total es la suma de ambos.
              </div>
            )}
            
            {mostrarAvanceField && (
              <div className="mb-3" id="avanceField">
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
        </div>
      </div>

      {/* Resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Vivienda Propia</h4>
        {resultados ? (
          resultados.error ? (
            <div className="alert alert-warning text-center">
              {resultados.error}
            </div>
          ) : (
            <div id="resultadosVivienda">
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

export default ViviendaPropiaC;