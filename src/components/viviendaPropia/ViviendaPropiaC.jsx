import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './ViviendaPropiaC.css';

const ViviendaPropiaC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;
  const TASA_MINIMA = 20 * VPTR; // $19,000
  const SUPERFICIE_LIMITE = 300; // 300m²

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

  // Función para calcular superficie relevante (solo lo que excede 300m²)
  const calcularSuperficieRelevante = (m2) => {
    return Math.max(0, m2 - SUPERFICIE_LIMITE);
  };

  // Función para calcular el valor según los tramos de m2 (solo aplica a partir de 300m²)
  const calcularPorTramos = (m2) => {
    // Si la superficie es menor o igual a 300m², retornar 0 (se aplicará tasa mínima)
    if (m2 <= SUPERFICIE_LIMITE) {
      return 0;
    }
    
    let total = 0;
    let m2Calculables = m2 - SUPERFICIE_LIMITE;
    
    // Primeros 200m² al 100% (a partir de 300m²)
    const tramo1 = Math.min(m2Calculables, 200);
    total += tramo1 * VPTR;
    
    // Siguientes 200m² al 80%
    if (m2Calculables > 200) {
      const tramo2 = Math.min(m2Calculables - 200, 200);
      total += tramo2 * VPTR * 0.8;
    }
    
    // Resto al 100%
    if (m2Calculables > 400) {
      const tramo3 = m2Calculables - 400;
      total += tramo3 * VPTR;
    }
    
    return total;
  };

  // Función para aplicar tasa mínima si es necesario
  const aplicarTasaMinimaSiCorresponde = (tasaCalculada, motivo = "") => {
    // SIEMPRE aplicar tasa mínima si el cálculo es menor
    if (tasaCalculada < TASA_MINIMA) {
      return {
        tasa: TASA_MINIMA,
        aplicada: true,
        motivo: motivo || `El cálculo total (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima establecida (${formatoMoneda(TASA_MINIMA)})`
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
    
    // Mostrar información específica para cada tipo de obra
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      html.push({ label: "Superficie Construida", value: `${construida} m²` });
      html.push({ label: "Superficie Ampliación", value: `${ampliacion} m²` });
      html.push({ label: "Superficie Total", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
      
      // Mostrar superficies relevantes (solo lo que excede 300m²)
      const construidaRelevante = calcularSuperficieRelevante(construida);
      const ampliacionRelevante = calcularSuperficieRelevante(ampliacion);
      html.push({ label: "Superficie Construida Relevante", value: `${construidaRelevante} m² (a partir de ${SUPERFICIE_LIMITE}m²)` });
      html.push({ label: "Superficie Ampliación Relevante", value: `${ampliacionRelevante} m² (a partir de ${SUPERFICIE_LIMITE}m²)` });
      
    } else if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
      html.push({ label: "Superficie Antecedente", value: antecedente > 0 ? `${antecedente} m²` : 'No especificada' });
      
      // Mostrar superficie relevante (solo lo que excede 300m²)
      const superficieRelevante = calcularSuperficieRelevante(m2);
      html.push({ label: "Superficie Relevante", value: `${superficieRelevante} m² (a partir de ${SUPERFICIE_LIMITE}m²)` });
      
    } else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      html.push({ label: "Monto de Obra", value: formatoMoneda(monto) });
    } else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      html.push({ label: "Monto de Refacción", value: formatoMoneda(monto) });
      html.push({ label: "Superficie de Ampliación", value: `${ampliacion} m²` });
      
      // Mostrar superficie relevante de ampliación (solo lo que excede 300m²)
      const ampliacionRelevante = calcularSuperficieRelevante(ampliacion);
      html.push({ label: "Superficie Ampliación Relevante", value: `${ampliacionRelevante} m² (a partir de ${SUPERFICIE_LIMITE}m²)` });
      
    } else {
      html.push({ label: "Metros cuadrados", value: `${m2} m²` });
      
      // Mostrar superficie relevante (solo lo que excede 300m²)
      const superficieRelevante = calcularSuperficieRelevante(m2);
      html.push({ label: "Superficie Relevante", value: `${superficieRelevante} m² (a partir de ${SUPERFICIE_LIMITE}m²)` });
    }
    
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });
    html.push({ label: "Superficie Límite", value: `${SUPERFICIE_LIMITE} m²` });
    
    if (tipoObra === 'nueva' || tipoObra === 'ampliacion' || tipoObra === 'refaccionAmpliacion') {
      html.push({ label: "% Avance de Obra", value: `${avance}% (solo aplica a Dirección Técnica)` });
    }
    
    let tasaRetributiva = 0;
    let descripcionServicio = "";

    // Para obra construida - solo calcular a partir de 300m²
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      
      // Calcular superficie relevante (solo lo que excede 300m²)
      const superficieRelevante = calcularSuperficieRelevante(m2);
      
      // Si hay antecedente, calcular la diferencia sobre la superficie relevante
      let m2Relevamiento = superficieRelevante;
      if (antecedente > 0) {
        const antecedenteRelevante = calcularSuperficieRelevante(antecedente);
        m2Relevamiento = Math.max(0, superficieRelevante - antecedenteRelevante);
        
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Superficie Relevante: ${m2} m² - ${SUPERFICIE_LIMITE} m² = ${superficieRelevante} m²`
        });
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Antecedente Relevante: ${antecedente} m² - ${SUPERFICIE_LIMITE} m² = ${antecedenteRelevante} m²`
        });
        
        // Si no hay superficie relevante después del antecedente, aplicar tasa mínima
        if (m2Relevamiento <= 0) {
          detallesCalculo.push({
            tipo: "info",
            contenido: `No hay superficie relevante para calcular después de considerar antecedente. Se aplica tasa mínima.`
          });
          tasaRetributiva = TASA_MINIMA;
          descripcionServicio = "Relevamiento (tasa mínima aplicada)";
        } else {
          // Calcular Relevamiento sobre la diferencia relevante
          tasaRetributiva = m2Relevamiento * VPTR * 0.6;
          descripcionServicio = "Relevamiento";
          
          html.push({ label: "Superficie para Relevamiento", value: `${superficieRelevante} m² - ${antecedenteRelevante} m² = ${m2Relevamiento} m²` });
          detallesCalculo.push({
            tipo: "formula",
            contenido: "Superficie Relevante × VPTR × 60%"
          });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${m2Relevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      } else {
        // Sin antecedente, cálculo normal sobre superficie relevante
        if (superficieRelevante <= 0) {
          detallesCalculo.push({
            tipo: "info",
            contenido: `Superficie menor o igual a ${SUPERFICIE_LIMITE} m²: Se aplica tasa mínima.`
          });
          tasaRetributiva = TASA_MINIMA;
          descripcionServicio = "Relevamiento (tasa mínima aplicada)";
        } else {
          tasaRetributiva = superficieRelevante * VPTR * 0.6;
          descripcionServicio = "Relevamiento";
          
          detallesCalculo.push({
            tipo: "formula",
            contenido: "Superficie Relevante × VPTR × 60%"
          });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${superficieRelevante} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaRetributiva)}`
          });
        }
      }
      
      // ✅ CORREGIDO: Aplicar tasa mínima solo al TOTAL
      const resultadoTasa = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
      if (resultadoTasa.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: ${resultadoTasa.motivo}`
        });
        tasaRetributiva = resultadoTasa.tasa;
        if (!descripcionServicio.includes("(tasa mínima aplicada)")) {
          descripcionServicio += " (tasa mínima aplicada)";
        }
      }
    } 
    // Para obra nueva - solo calcular a partir de 300m²
    else if (tipoObra === 'nueva') {
      descripcionServicio = tareaSeleccionada;
      
      // Calcular superficie relevante (solo lo que excede 300m²)
      const superficieRelevante = calcularSuperficieRelevante(m2);
      
      if (superficieRelevante <= 0) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Superficie menor o igual a ${SUPERFICIE_LIMITE} m²: Se aplica tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio += " (tasa mínima aplicada)";
      } else {
        let valorBase = calcularPorTramos(m2);
        html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

        // Cálculo específico para cada tipo de tarea (solo si m2 > 300)
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

        // ✅ CORREGIDO: Aplicar tasa mínima solo al TOTAL
        const resultadoTasa = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
        if (resultadoTasa.aplicada) {
          detallesCalculo.push({
            tipo: "info",
            contenido: `Aplicación de Tasa Mínima: ${resultadoTasa.motivo}`
          });
          tasaRetributiva = resultadoTasa.tasa;
          descripcionServicio += " (tasa mínima aplicada)";
        }
      }
    }
    // ✅ CORREGIDO: Para obra de ampliación - calcular total y luego aplicar tasa mínima si corresponde
    else if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      // Calcular superficies relevantes (solo lo que excede 300m²)
      const construidaRelevante = calcularSuperficieRelevante(construida);
      const ampliacionRelevante = calcularSuperficieRelevante(ampliacion);
      
      // Calcular la parte de relevamiento (construida relevante)
      let m2Relevamiento = construidaRelevante;
      if (antecedente > 0) {
        const antecedenteRelevante = calcularSuperficieRelevante(antecedente);
        m2Relevamiento = Math.max(0, construidaRelevante - antecedenteRelevante);
        
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Cálculo de Relevamiento: Superficie Construida Relevante - Antecedente Relevante = ${construidaRelevante} m² - ${antecedenteRelevante} m² = ${m2Relevamiento} m²`
        });
      }
      
      let tasaRelevamiento = m2Relevamiento * VPTR * 0.6;
      
      // Calcular la parte de obra nueva (ampliación relevante)
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      // Cálculo específico para cada tipo de tarea (solo si ampliación > 300)
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
      
      // Calcular la tasa total SIN aplicar tasa mínima por separado
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

      // ✅ CORREGIDO: Aplicar tasa mínima solo al TOTAL (no por separado)
      const resultadoTotal = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
      if (resultadoTotal.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: ${resultadoTotal.motivo}`
        });
        tasaRetributiva = resultadoTotal.tasa;
        descripcionServicio += " (tasa mínima aplicada)";
      }
    }
    // Para obra de refacción - aplicar siempre tasa mínima si corresponde
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
      
      // ✅ CORREGIDO: Aplicar tasa mínima solo al TOTAL
      const resultadoTasa = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
      if (resultadoTasa.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: ${resultadoTasa.motivo}`
        });
        tasaRetributiva = resultadoTasa.tasa;
        descripcionServicio += " (tasa mínima aplicada)";
      }
    }
    // ✅ CORREGIDO: Para obra de refacción y ampliación - calcular total y luego aplicar tasa mínima si corresponde
    else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      // Calcular la parte de refacción (1% del monto)
      const tasaRefaccion = monto * 0.01;
      
      // Calcular superficie relevante de ampliación (solo lo que excede 300m²)
      const ampliacionRelevante = calcularSuperficieRelevante(ampliacion);
      
      // Calcular la parte de ampliación (como obra nueva)
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      
      // Cálculo específico para cada tipo de tarea (solo si ampliación > 300)
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
      
      // Calcular la tasa total SIN aplicar tasa mínima por separado
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
      
      // ✅ CORREGIDO: Aplicar tasa mínima solo al TOTAL (no por separado)
      const resultadoTotal = aplicarTasaMinimaSiCorresponde(tasaRetributiva);
      if (resultadoTotal.aplicada) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `Aplicación de Tasa Mínima: ${resultadoTotal.motivo}`
        });
        tasaRetributiva = resultadoTotal.tasa;
        descripcionServicio += " (tasa mínima aplicada)";
      }
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  // [El resto del componente permanece igual...]
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
          <h2 className="mb-0">Vivienda Propia</h2>
          <p className="mb-0 text-muted">
            Complete el tipo de obra y cargue la/s superficie/s. Luego seleccione la tarea a realizar y presione calcular.
          </p>
          <p className="mb-0 text-info fw-bold">
            Nota: El cálculo se realiza a partir de los {SUPERFICIE_LIMITE}m². Superficies menores o iguales a {SUPERFICIE_LIMITE}m² aplican tasa mínima.
          </p>
          <p className="mb-0 text-warning fw-bold">
            ⚠️ En NINGÚN caso el resultado puede ser menor a la Tasa Mínima ({formatoMoneda(TASA_MINIMA)})
          </p>
        </div>
      </div>

      {/* [El resto del JSX permanece igual...] */}
      <div className="row" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="col-lg-6">
          <div className="card" style={{ position: 'relative', zIndex: 1002 }}>
            <div className="card-header" style={{ position: 'relative', zIndex: 1003 }}>
              <h5 className="mb-0">Datos de Entrada</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
                <label htmlFor="tipoObraVivienda" className="form-label">Tipo de Obra</label>
                <select 
                  className="form-select" 
                  id="tipoObraVivienda" 
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
                  <label htmlFor="m2Vivienda" className="form-label">Metros cuadrados (m²)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="m2Vivienda" 
                    placeholder="Ingrese los m² de construcción" 
                    min="0"
                    value={m2Vivienda}
                    onChange={(e) => setM2Vivienda(e.target.value)}
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
                <div className="mb-3 dynamic-field" id="tareasViviendaField" style={{ position: 'relative', zIndex: 1004 }}>
                  <label className="form-label">Seleccione las tareas:</label>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaVivienda" 
                      id="vAnteproyecto" 
                      value="Anteproyecto" 
                      checked={tareaSeleccionada === "Anteproyecto"}
                      onChange={() => setTareaSeleccionada("Anteproyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="vAnteproyecto">Anteproyecto</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaVivienda" 
                      id="vProyecto" 
                      value="Proyecto" 
                      checked={tareaSeleccionada === "Proyecto"}
                      onChange={() => setTareaSeleccionada("Proyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="vProyecto">Proyecto</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaVivienda" 
                      id="vDireccion" 
                      value="Dirección Técnica" 
                      checked={tareaSeleccionada === "Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="vDireccion">Dirección Técnica</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaVivienda" 
                      id="vAnteproyectoProyecto" 
                      value="Anteproyecto y Proyecto" 
                      checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                      onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="vAnteproyectoProyecto">Anteproyecto y Proyecto</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaVivienda" 
                      id="vProyectoDireccion" 
                      value="Proyecto y Dirección Técnica" 
                      checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="vProyectoDireccion">Proyecto y Dirección Técnica</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaVivienda" 
                      id="vCompleto" 
                      value="Anteproyecto, Proyecto y Dirección Técnica" 
                      checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="vCompleto">Anteproyecto, Proyecto y Dirección Técnica</label>
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
                    style={{ position: 'relative', zIndex: 1005 }}
                  />
                  <div className="form-text">Ingrese 0 si no hay avance de obra. Este valor solo afecta al cálculo de Dirección Técnica.</div>
                </div>
              )}
              
              <div className="d-grid" style={{ position: 'relative', zIndex: 1005 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={calcularVivienda}
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
              <h5 className="mb-0">Resultados - Vivienda Propia</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              {resultados ? (
                resultados.error ? (
                  <div className="alert alert-warning text-center" style={{ position: 'relative', zIndex: 1004 }}>
                    {resultados.error}
                  </div>
                ) : (
                  <div id="resultadosVivienda" style={{ position: 'relative', zIndex: 1004 }}>
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

export default ViviendaPropiaC;