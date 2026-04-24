import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './EdificiosAlturaC.css';

const EdificiosAlturaC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000

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

  // Efecto para limpiar resultados cuando cambian los campos de entrada
  useEffect(() => {
    setResultados(null);
  }, [
    tipoObra,
    m2Vivienda,
    m2Construida,
    m2Ampliacion,
    m2AntecedenteAmpliacion,
    m2AntecedenteConstruida,
    montoRefaccion,
    montoRefaccionAmpliacion,
    m2AmpliacionRefaccion,
    tareaSeleccionada,
    avanceVivienda
  ]);

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

  // Función para calcular resultados
  const calcularVivienda = () => {
    let m2 = 0;
    let avance = parseFloat(avanceVivienda) || 0;
    
    // Validaciones según el tipo de obra
    if (tipoObra === 'ampliacion') {
      const construida = parseFloat(m2Construida) || 0;
      const ampliacion = parseFloat(m2Ampliacion) || 0;
      const antecedente = parseFloat(m2AntecedenteAmpliacion) || 0;
      
      // Validar que la ampliación sea mayor a 0
      if (ampliacion <= 0) {
        setResultados({
          error: "Por favor, ingrese un valor válido para la superficie de ampliación (debe ser mayor a 0)."
        });
        return;
      }
      
      // Validar que el antecedente no sea mayor a la superficie construida (solo si construida > 0)
      if (construida > 0 && antecedente > construida) {
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

    // Para obra construida
    if (tipoObra === 'construida') {
      const antecedente = parseFloat(m2AntecedenteConstruida) || 0;
      let superficieRelevamiento = m2 - antecedente;
      
      html.push({ label: "Superficie a Relevar", value: `${m2} m² - ${antecedente} m² = ${superficieRelevamiento} m²` });
      
      detallesCalculo.push({
        tipo: "info",
        contenido: `Cálculo de Relevamiento:`
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Superficie a relevar = ${m2} m² - ${antecedente} m² = ${superficieRelevamiento} m²`
      });
      
      let tasaCalculada = 0;
      let aplicaTasaMinima = false;
      
      if (superficieRelevamiento <= 0) {
        tasaCalculada = 0;
        aplicaTasaMinima = true;
        detallesCalculo.push({
          tipo: "info",
          contenido: `La superficie a relevar es ${superficieRelevamiento} m² (≤ 0), se aplica tasa mínima.`
        });
      } else {
        tasaCalculada = calcularTasaRelevamiento(superficieRelevamiento);
        
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `Relevamiento: ${superficieRelevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(tasaCalculada)}`
        });
        
        if (tasaCalculada < TASA_MINIMA) {
          aplicaTasaMinima = true;
          detallesCalculo.push({
            tipo: "info",
            contenido: `La tasa calculada (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
          });
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

      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Valor Base calculado por tramos para ${m2} m² = ${formatoMoneda(valorBase)}`
      });

      let tasaCalculada = 0;

      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaCalculada = valorBase * 0.4;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaCalculada)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaCalculada = valorBase * 0.6;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        tasaCalculada = valorBase * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40%" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(tasaCalculada)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaCalculada)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaCalculada = valorBase * 1.0;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaCalculada)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaCalculada = valorBase * 0.6;
        detallesCalculo.push({ 
          tipo: "porcentaje", 
          contenido: "60% (Solo Proyecto - Dirección Técnica sin costo adicional)" 
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
        });
        detallesCalculo.push({
          tipo: "info",
          contenido: "Nota: Cuando la Dirección Técnica acompaña al Proyecto, no tiene costo adicional."
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaCalculada = valorBase * 1.0;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100%" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaCalculada)}`
        });
      }

      // Aplicar tasa mínima cuando el cálculo es menor a TASA_MINIMA
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (tasaCalculada < TASA_MINIMA && tasaCalculada > 0 && !esDireccionSinAvance) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa calculada (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
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
      
      // Solo calcular relevamiento si hay superficie construida
      if (construida > 0) {
        let superficieRelevamiento = construida - antecedente;
        
        html.push({ label: "Superficie a Relevar", value: `${construida} m² - ${antecedente} m² = ${superficieRelevamiento} m²` });
        
        detallesCalculo.push({
          tipo: "subcalculo",
          contenido: `Cálculo de Relevamiento:`
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `Superficie a relevar = ${construida} m² - ${antecedente} m² = ${superficieRelevamiento} m²`
        });
        
        if (superficieRelevamiento <= 0) {
          relevamientoOriginal = 0;
          relevamientoAplicaMinima = true;
          detallesCalculo.push({
            tipo: "info",
            contenido: `La superficie a relevar es ${superficieRelevamiento} m² (≤ 0), se aplica tasa mínima.`
          });
        } else {
          relevamientoOriginal = calcularTasaRelevamiento(superficieRelevamiento);
          
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `Relevamiento: ${superficieRelevamiento} m² × ${formatoMoneda(VPTR)} × 60% = ${formatoMoneda(relevamientoOriginal)}`
          });
          
          if (relevamientoOriginal < TASA_MINIMA) {
            relevamientoAplicaMinima = true;
            detallesCalculo.push({
              tipo: "info",
              contenido: `La tasa de relevamiento calculada (${formatoMoneda(relevamientoOriginal)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
            });
          }
        }
        
        tasaRelevamiento = relevamientoAplicaMinima ? TASA_MINIMA : relevamientoOriginal;
      } else {
        html.push({ label: "Superficie a Relevar", value: "0 m² (sin construcción existente)" });
        detallesCalculo.push({
          tipo: "info",
          contenido: "No hay superficie construida, no se calcula relevamiento."
        });
        tasaRelevamiento = 0;
      }
      
      // Calcular la parte de obra nueva (ampliación)
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      let ampliacionAplicaMinima = false;
      let ampliacionOriginal = 0;
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Cálculo de Ampliación:`
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Valor Base Ampliación para ${ampliacion} m² = ${formatoMoneda(valorBaseAmpliacion)}`
      });

      if (tareaSeleccionada === "Anteproyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 0.4;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 0.6;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 60% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        ampliacionOriginal = valorBaseAmpliacion * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(ampliacionOriginal)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% = ${formatoMoneda(ampliacionOriginal)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 1.0;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        ampliacionOriginal = valorBaseAmpliacion * 0.6;
        detallesCalculo.push({ 
          tipo: "porcentaje", 
          contenido: "60% (Solo Proyecto) para ampliación" 
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 60% = ${formatoMoneda(ampliacionOriginal)}`
        });
        detallesCalculo.push({
          tipo: "info",
          contenido: "Nota: Cuando la Dirección Técnica acompaña al Proyecto, no tiene costo adicional."
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        ampliacionOriginal = valorBaseAmpliacion * 1.0;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }

      // Verificar si la ampliación debe aplicar tasa mínima
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (ampliacionOriginal < TASA_MINIMA && ampliacionOriginal > 0 && !esDireccionSinAvance) {
        ampliacionAplicaMinima = true;
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa de ampliación calculada (${formatoMoneda(ampliacionOriginal)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
      }
      
      tasaAmpliacion = ampliacionAplicaMinima ? TASA_MINIMA : ampliacionOriginal;
      
      // Calcular tasa total
      let tasaTotal = tasaRelevamiento + tasaAmpliacion;
      let totalAplicaMinima = false;
      
      if (tasaTotal > 0 && tasaTotal < TASA_MINIMA) {
        totalAplicaMinima = true;
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa total calculada (${formatoMoneda(tasaTotal)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
      } else {
        tasaRetributiva = tasaTotal;
      }
      
      // Construir mensaje de servicio
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
      
      detallesCalculo.push({
        tipo: "total",
        contenido: `${formatoMoneda(tasaRelevamiento)} + ${formatoMoneda(tasaAmpliacion)} = ${formatoMoneda(tasaRetributiva)}`
      });
    }
    // Para obra de refacción
    else if (tipoObra === 'refaccion') {
      const monto = parseFloat(montoRefaccion) || 0;
      
      // Calcular el 1% del monto de obra
      let tasaCalculada = monto * 0.01;
      descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra";
      
      detallesCalculo.push({
        tipo: "formula",
        contenido: "1% del monto de obra"
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `${formatoMoneda(monto)} × 1% = ${formatoMoneda(tasaCalculada)}`
      });
      
      // Aplicar tasa mínima si corresponde
      if (tasaCalculada < TASA_MINIMA) {
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa calculada (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
        tasaRetributiva = TASA_MINIMA;
        descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica por monto de obra (tasa mínima aplicada)";
      } else {
        tasaRetributiva = tasaCalculada;
      }
    }
    // Para obra de refacción y ampliación
    else if (tipoObra === 'refaccionAmpliacion') {
      const monto = parseFloat(montoRefaccionAmpliacion) || 0;
      const ampliacion = parseFloat(m2AmpliacionRefaccion) || 0;
      
      // Calcular la parte de refacción (1% del monto)
      const tasaRefaccionOriginal = monto * 0.01;
      let tasaRefaccion = tasaRefaccionOriginal;
      let refaccionAplicaMinima = false;
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Cálculo de Refacción:`
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `${formatoMoneda(monto)} × 1% = ${formatoMoneda(tasaRefaccionOriginal)}`
      });
      
      if (tasaRefaccionOriginal < TASA_MINIMA) {
        refaccionAplicaMinima = true;
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa de refacción calculada (${formatoMoneda(tasaRefaccionOriginal)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
        tasaRefaccion = TASA_MINIMA;
      }
      
      // Calcular la parte de ampliación (como obra nueva)
      let valorBaseAmpliacion = calcularPorTramos(ampliacion);
      let tasaAmpliacion = 0;
      let ampliacionAplicaMinima = false;
      let ampliacionOriginal = 0;
      
      detallesCalculo.push({
        tipo: "subcalculo",
        contenido: `Cálculo de Ampliación:`
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Valor Base Ampliación para ${ampliacion} m² = ${formatoMoneda(valorBaseAmpliacion)}`
      });

      if (tareaSeleccionada === "Anteproyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 0.4;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 0.6;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 60% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        const porcentajeRestante = (100 - avance) / 100;
        ampliacionOriginal = valorBaseAmpliacion * 0.4 * porcentajeRestante;
        
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para ampliación" });
        if (avance > 0) {
          detallesCalculo.push({ tipo: "porcentaje-restante", contenido: `% Restante: ${(100 - avance).toFixed(0)}%` });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% × ${(100 - avance).toFixed(0)}% = ${formatoMoneda(ampliacionOriginal)}`
          });
        } else {
          detallesCalculo.push({ tipo: "info", contenido: "Sin avance de obra" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBaseAmpliacion)} × 40% = ${formatoMoneda(ampliacionOriginal)}`
          });
        }
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        ampliacionOriginal = valorBaseAmpliacion * 1.0;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        ampliacionOriginal = valorBaseAmpliacion * 0.6;
        detallesCalculo.push({ 
          tipo: "porcentaje", 
          contenido: "60% (Solo Proyecto) para ampliación" 
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 60% = ${formatoMoneda(ampliacionOriginal)}`
        });
        detallesCalculo.push({
          tipo: "info",
          contenido: "Nota: Cuando la Dirección Técnica acompaña al Proyecto, no tiene costo adicional."
        });
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        ampliacionOriginal = valorBaseAmpliacion * 1.0;
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para ampliación" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBaseAmpliacion)} × 100% = ${formatoMoneda(ampliacionOriginal)}`
        });
      }

      // Verificar si la ampliación debe aplicar tasa mínima
      const esDireccionSinAvance = (tareaSeleccionada === "Dirección Técnica" && avance === 0);
      
      if (ampliacionOriginal < TASA_MINIMA && ampliacionOriginal > 0 && !esDireccionSinAvance) {
        ampliacionAplicaMinima = true;
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa de ampliación calculada (${formatoMoneda(ampliacionOriginal)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
      }
      
      tasaAmpliacion = ampliacionAplicaMinima ? TASA_MINIMA : ampliacionOriginal;
      
      // Calcular tasa total
      let tasaTotal = tasaRefaccion + tasaAmpliacion;
      let totalAplicaMinima = false;
      
      if (tasaTotal < TASA_MINIMA) {
        totalAplicaMinima = true;
        detallesCalculo.push({
          tipo: "info",
          contenido: `La tasa total calculada (${formatoMoneda(tasaTotal)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
        });
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
      
      detallesCalculo.push({
        tipo: "total",
        contenido: `${formatoMoneda(tasaRefaccion)} + ${formatoMoneda(tasaAmpliacion)} = ${formatoMoneda(tasaRetributiva)}`
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
      <div className="text-center mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <div style={{ position: 'relative', zIndex: 1001 }}>
          <h2 className="mb-0">Edificios en Altura</h2>
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
                {tipoObra === 'ampliacion' && (
                  <div className="form-text text-muted mt-2">
                    <small>La superficie construida puede ser 0 si no hay construcción existente. En ese caso, solo se calculará la ampliación (sin relevamiento).</small>
                  </div>
                )}
              </div>
              
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
              
              {mostrarAmpliacionFields && (
                <div id="ampliacionFields" className="ampliacion-fields" style={{ position: 'relative', zIndex: 1004 }}>
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
                      style={{ position: 'relative', zIndex: 1005 }}
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
                    <div className="form-text">Si no hay antecedente, dejar en blanco o 0.</div>
                  </div>
                </div>
              )}
              
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
                    <div className="form-text">Si no hay antecedente, dejar en blanco o 0.</div>
                  </div>
                </div>
              )}
              
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
              
              {mostrarTareasField && (
                <div className="mb-3 dynamic-field" id="tareasViviendaField" style={{ position: 'relative', zIndex: 1004 }}>
                  <label className="form-label">Seleccione las tareas:</label>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaEdificioAltura" 
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
                      name="tareaEdificioAltura" 
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
                      name="tareaEdificioAltura" 
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
                      name="tareaEdificioAltura" 
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
                      name="tareaEdificioAltura" 
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
                      name="tareaEdificioAltura" 
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
              
              {mostrarInfoRefaccion && (
                <div id="infoRefaccion" className="alert alert-info" style={{ position: 'relative', zIndex: 1005 }}>
                  Para Refacción, la tasa retributiva se calcula como el 1% del monto de obra, aplicándose a la tarea completa de Anteproyecto, Proyecto y Dirección Técnica.
                </div>
              )}
              
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
                  <div className="form-text">Ingrese 0 si no hay avance de obra.</div>
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
              <h5 className="mb-0">Resultados - Edificios en Altura</h5>
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

export default EdificiosAlturaC;