import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import './ViviendasIPVC.css';

const ViviendasIPVC = ({ onBack }) => {
  // Constantes
  const VPTR = 1250;
  const TASA_MINIMA = 20 * VPTR; // $25,000
  const LIMITE_UNIDADES = 50;
  const TARIFA_PRIMER_TRAMO = 20; // 20 * VPTR por unidad
  const TARIFA_SEGUNDO_TRAMO = 10; // 10 * VPTR por unidad

  // Estados
  const [tipoObra, setTipoObra] = useState('nueva');
  const [cantidadUnidades, setCantidadUnidades] = useState('');
  const [tareaSeleccionada, setTareaSeleccionada] = useState('Anteproyecto');
  const [resultados, setResultados] = useState(null);

  // Efectos
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setResultados(null);
    if (tipoObra === 'construida') {
      setTareaSeleccionada('Relevamiento');
    } else {
      setTareaSeleccionada('Anteproyecto');
    }
  }, [cantidadUnidades, tipoObra]);

  // Formateador
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Cálculo del valor base por tramos
  const calcularValorBase = (unidades) => {
    let total = 0;
    if (unidades <= LIMITE_UNIDADES) {
      total = unidades * VPTR * TARIFA_PRIMER_TRAMO;
    } else {
      total = LIMITE_UNIDADES * VPTR * TARIFA_PRIMER_TRAMO;
      const unidadesRestantes = unidades - LIMITE_UNIDADES;
      total += unidadesRestantes * VPTR * TARIFA_SEGUNDO_TRAMO;
    }
    return total;
  };

  // Cálculo principal
  const calcularViviendasIPV = () => {
    const unidades = parseFloat(cantidadUnidades) || 0;

    if (unidades <= 0) {
      setResultados({
        error: "Por favor, ingrese una cantidad válida de módulos de vivienda (debe ser mayor a 0)."
      });
      return;
    }

    if (!Number.isInteger(unidades)) {
      setResultados({
        error: "Por favor, ingrese una cantidad entera de módulos de vivienda."
      });
      return;
    }

    let html = [];
    let detallesCalculo = [];

    html.push({ label: "Tipo de Obra", value: tipoObra === 'nueva' ? "Obra Nueva" : "Obra Construida" });
    html.push({ label: "Cantidad de Módulos", value: `${unidades} unidades` });
    html.push({ label: "VPTR", value: formatoMoneda(VPTR) });
    html.push({ label: "Tasa Mínima", value: formatoMoneda(TASA_MINIMA) });

    const valorBase = calcularValorBase(unidades);
    html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });

    if (unidades <= LIMITE_UNIDADES) {
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Cálculo Valor Base: ${unidades} unidades × ${formatoMoneda(VPTR)} × ${TARIFA_PRIMER_TRAMO} = ${formatoMoneda(valorBase)}`
      });
    } else {
      const unidadesPrimerTramo = LIMITE_UNIDADES;
      const valorPrimerTramo = unidadesPrimerTramo * VPTR * TARIFA_PRIMER_TRAMO;
      const unidadesSegundoTramo = unidades - LIMITE_UNIDADES;
      const valorSegundoTramo = unidadesSegundoTramo * VPTR * TARIFA_SEGUNDO_TRAMO;

      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Primer tramo (hasta ${LIMITE_UNIDADES} unidades): ${unidadesPrimerTramo} × ${formatoMoneda(VPTR)} × ${TARIFA_PRIMER_TRAMO} = ${formatoMoneda(valorPrimerTramo)}`
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Segundo tramo (excedente): ${unidadesSegundoTramo} × ${formatoMoneda(VPTR)} × ${TARIFA_SEGUNDO_TRAMO} = ${formatoMoneda(valorSegundoTramo)}`
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `Valor Base total: ${formatoMoneda(valorPrimerTramo)} + ${formatoMoneda(valorSegundoTramo)} = ${formatoMoneda(valorBase)}`
      });
    }

    let tasaCalculada = 0;
    let descripcionServicio = "";

    if (tipoObra === 'construida') {
      tasaCalculada = valorBase * 0.6;
      detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para Relevamiento (Obra Construida)" });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
      });
      descripcionServicio = "Relevamiento";
    } else {
      switch (tareaSeleccionada) {
        case "Anteproyecto":
          tasaCalculada = valorBase * 0.4;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para Anteproyecto" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaCalculada)}`
          });
          descripcionServicio = "Anteproyecto";
          break;
        case "Proyecto":
          tasaCalculada = valorBase * 0.6;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para Proyecto" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
          });
          descripcionServicio = "Proyecto";
          break;
        case "Dirección Técnica":
          tasaCalculada = valorBase * 0.4;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para Dirección Técnica" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaCalculada)}`
          });
          descripcionServicio = "Dirección Técnica";
          break;
        case "Proyecto y Dirección Técnica":
          tasaCalculada = valorBase * 0.6;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "60% (Proyecto - Dirección incluida)" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
          });
          detallesCalculo.push({
            tipo: "info",
            contenido: "Nota: Cuando la Dirección Técnica acompaña al Proyecto, no tiene costo adicional."
          });
          descripcionServicio = "Proyecto y Dirección Técnica";
          break;
        case "Anteproyecto y Proyecto":
          tasaCalculada = valorBase * 1.0;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para Anteproyecto y Proyecto" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaCalculada)}`
          });
          descripcionServicio = "Anteproyecto y Proyecto";
          break;
        case "Anteproyecto, Proyecto y Dirección Técnica":
          tasaCalculada = valorBase * 1.0;
          detallesCalculo.push({ tipo: "porcentaje", contenido: "100% (Anteproyecto + Proyecto + Dirección)" });
          detallesCalculo.push({
            tipo: "calculo",
            contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaCalculada)}`
          });
          descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica";
          break;
        default:
          break;
      }
    }

    let tasaRetributiva = tasaCalculada;
    let aplicaTasaMinima = false;

    if (tasaCalculada < TASA_MINIMA && tasaCalculada > 0) {
      aplicaTasaMinima = true;
      detallesCalculo.push({
        tipo: "info",
        contenido: `La tasa calculada (${formatoMoneda(tasaCalculada)}) es menor que la tasa mínima (${formatoMoneda(TASA_MINIMA)}), se aplica tasa mínima.`
      });
      tasaRetributiva = TASA_MINIMA;
    }

    if (aplicaTasaMinima) {
      descripcionServicio = descripcionServicio + " (tasa mínima aplicada)";
    }

    setResultados({
      html,
      detallesCalculo,
      tasaRetributiva,
      descripcionServicio
    });
  };

  return (
    <Container fluid className="viviendas-ipv-container">
      {/* Imagen */}
      <div className="card-media-container image-container mb-4">
        <img
          src="/images/viviendas_ipv.jpg"
          alt="Viviendas IPV"
          className="img-fluid"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/viviendas_ipv.jpg';
          }}
        />
      </div>

      {/* Títulos */}
      <div className="text-center mb-4">
        <h2 className="main-title">Viviendas IPV</h2>
        <p className="subtitle">
          Ingrese la cantidad de módulos de vivienda y seleccione la tarea a realizar.
        </p>
      </div>

      {/* Formulario - una sola columna */}
      <div className="form-card">
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="tipoObraIPV" className="form-label">Tipo de Obra</label>
              <select
                className="form-select"
                id="tipoObraIPV"
                value={tipoObra}
                onChange={(e) => setTipoObra(e.target.value)}
              >
                <option value="nueva">Obra Nueva</option>
                <option value="construida">Obra Construida</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="cantidadUnidades" className="form-label">
                Cantidad de Módulos de Vivienda
              </label>
              <input
                type="number"
                className="form-control"
                id="cantidadUnidades"
                placeholder="Ingrese la cantidad de módulos"
                min="0"
                step="1"
                value={cantidadUnidades}
                onChange={(e) => setCantidadUnidades(e.target.value)}
              />
              <div className="form-text">
                Hasta 50 unidades: cada unidad × VPTR × 20 | Excedente: cada unidad × VPTR × 10
              </div>
            </div>

            {/* Selección de tareas - Solo para Obra Nueva */}
            {tipoObra === 'nueva' && (
              <div className="mb-3 dynamic-field">
                <label className="form-label">Seleccione las tareas:</label>
                <div className="form-check task-item">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tareaIPV"
                    id="ipvAnteproyecto"
                    value="Anteproyecto"
                    checked={tareaSeleccionada === "Anteproyecto"}
                    onChange={() => setTareaSeleccionada("Anteproyecto")}
                  />
                  <label className="form-check-label" htmlFor="ipvAnteproyecto">Anteproyecto (40%)</label>
                </div>
                <div className="form-check task-item">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tareaIPV"
                    id="ipvProyecto"
                    value="Proyecto"
                    checked={tareaSeleccionada === "Proyecto"}
                    onChange={() => setTareaSeleccionada("Proyecto")}
                  />
                  <label className="form-check-label" htmlFor="ipvProyecto">Proyecto (60%)</label>
                </div>
                <div className="form-check task-item">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tareaIPV"
                    id="ipvDireccion"
                    value="Dirección Técnica"
                    checked={tareaSeleccionada === "Dirección Técnica"}
                    onChange={() => setTareaSeleccionada("Dirección Técnica")}
                  />
                  <label className="form-check-label" htmlFor="ipvDireccion">Dirección Técnica (40%)</label>
                </div>
                <div className="form-check task-item">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tareaIPV"
                    id="ipvProyectoDireccion"
                    value="Proyecto y Dirección Técnica"
                    checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                    onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                  />
                  <label className="form-check-label" htmlFor="ipvProyectoDireccion">Proyecto y Dirección Técnica (60% - Dirección incluida)</label>
                </div>
                <div className="form-check task-item">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tareaIPV"
                    id="ipvAnteproyectoProyecto"
                    value="Anteproyecto y Proyecto"
                    checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                    onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                  />
                  <label className="form-check-label" htmlFor="ipvAnteproyectoProyecto">Anteproyecto y Proyecto (100%)</label>
                </div>
                <div className="form-check task-item">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tareaIPV"
                    id="ipvCompleto"
                    value="Anteproyecto, Proyecto y Dirección Técnica"
                    checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                    onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                  />
                  <label className="form-check-label" htmlFor="ipvCompleto">Anteproyecto, Proyecto y Dirección Técnica (100%)</label>
                </div>
              </div>
            )}

            {/* Mensaje para Obra Construida */}
            {tipoObra === 'construida' && (
              <div className="alert alert-info">
                Para Obra Construida, la única tarea disponible es Relevamiento (60% del valor base).
              </div>
            )}

            {/* Botón Calcular (verde, ancho completo) */}
            <div className="d-grid">
              <button
                className="calculate-button"
                onClick={calcularViviendasIPV}
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de resultados */}
      <div className="resultado-card mt-4">
        <h4 className="text-center">Resultados - Viviendas IPV</h4>
        {resultados ? (
          resultados.error ? (
            <div className="alert alert-warning text-center">
              {resultados.error}
            </div>
          ) : (
            <div id="resultadosIPV">
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

              {resultados.detallesCalculo && resultados.detallesCalculo.length > 0 && (
                <div className="mt-3 detalles-calculo">
                  <h6>Detalles del cálculo:</h6>
                  {resultados.detallesCalculo.map((detalle, index) => (
                    <div
                      key={index}
                      className={`detalle-item ${detalle.tipo === 'info' ? 'text-warning' :
                        detalle.tipo === 'calculo' ? 'text-dark' : ''}`}
                    >
                      {detalle.contenido}
                    </div>
                  ))}
                </div>
              )}

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
              Ingrese la cantidad de módulos y haga clic en calcular para ver los resultados
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

export default ViviendasIPVC;