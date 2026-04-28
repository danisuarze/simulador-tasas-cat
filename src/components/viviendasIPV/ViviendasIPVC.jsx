import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
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

  // Efecto para hacer scroll al inicio de la página cuando se monta el componente
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Efecto para limpiar resultados cuando cambia la cantidad de unidades o el tipo de obra
  useEffect(() => {
    setResultados(null);
    // Resetear tarea seleccionada cuando cambia el tipo de obra
    if (tipoObra === 'construida') {
      setTareaSeleccionada('Relevamiento');
    } else {
      setTareaSeleccionada('Anteproyecto');
    }
  }, [cantidadUnidades, tipoObra]);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Función para calcular el valor base según la cantidad de unidades
  const calcularValorBase = (unidades) => {
    let total = 0;
    
    if (unidades <= LIMITE_UNIDADES) {
      // Hasta 50 unidades: cada unidad * VPTR * 20
      total = unidades * VPTR * TARIFA_PRIMER_TRAMO;
    } else {
      // Primeras 50 unidades al 20 * VPTR
      total = LIMITE_UNIDADES * VPTR * TARIFA_PRIMER_TRAMO;
      // Unidades restantes al 10 * VPTR
      const unidadesRestantes = unidades - LIMITE_UNIDADES;
      total += unidadesRestantes * VPTR * TARIFA_SEGUNDO_TRAMO;
    }
    
    return total;
  };

  // Función para calcular resultados
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
    
    // Calcular valor base
    const valorBase = calcularValorBase(unidades);
    html.push({ label: "Valor Base", value: formatoMoneda(valorBase) });
    
    // Mostrar detalles del cálculo del valor base
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

    // Para Obra Construida - Solo Relevamiento
    if (tipoObra === 'construida') {
      tasaCalculada = valorBase * 0.6; // 60% para Relevamiento
      detallesCalculo.push({ 
        tipo: "porcentaje", 
        contenido: "60% para Relevamiento (Obra Construida)" 
      });
      detallesCalculo.push({
        tipo: "calculo",
        contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
      });
      descripcionServicio = "Relevamiento";
    }
    // Para Obra Nueva - Cálculo según tarea
    else {
      // Cálculo específico para cada tipo de tarea
      if (tareaSeleccionada === "Anteproyecto") {
        tasaCalculada = valorBase * 0.4; // 40%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para Anteproyecto" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaCalculada)}`
        });
        descripcionServicio = "Anteproyecto";
      }
      else if (tareaSeleccionada === "Proyecto") {
        tasaCalculada = valorBase * 0.6; // 60%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "60% para Proyecto" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 60% = ${formatoMoneda(tasaCalculada)}`
        });
        descripcionServicio = "Proyecto";
      }
      else if (tareaSeleccionada === "Dirección Técnica") {
        tasaCalculada = valorBase * 0.4; // 40%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "40% para Dirección Técnica" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 40% = ${formatoMoneda(tasaCalculada)}`
        });
        descripcionServicio = "Dirección Técnica";
      }
      else if (tareaSeleccionada === "Proyecto y Dirección Técnica") {
        tasaCalculada = valorBase * 0.6; // 60% (solo proyecto, dirección incluida)
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
        descripcionServicio = "Proyecto y Dirección Técnica";
      }
      else if (tareaSeleccionada === "Anteproyecto y Proyecto") {
        tasaCalculada = valorBase * 1.0; // 100%
        detallesCalculo.push({ tipo: "porcentaje", contenido: "100% para Anteproyecto y Proyecto" });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaCalculada)}`
        });
        descripcionServicio = "Anteproyecto y Proyecto";
      }
      else if (tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica") {
        tasaCalculada = valorBase * 1.0; // 100%
        detallesCalculo.push({ 
          tipo: "porcentaje", 
          contenido: "100% (Anteproyecto + Proyecto + Dirección Técnica)" 
        });
        detallesCalculo.push({
          tipo: "calculo",
          contenido: `${formatoMoneda(valorBase)} × 100% = ${formatoMoneda(tasaCalculada)}`
        });
        descripcionServicio = "Anteproyecto, Proyecto y Dirección Técnica";
      }
    }

    // Aplicar tasa mínima si el cálculo es menor
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
    <div className="container my-4" style={{ 
      position: 'relative',
      zIndex: 1000,
      minHeight: '100vh'
    }}>
      {/* Imagen en la parte superior */}
      <div className="card-media-container image-container mb-4">
        <img 
          src="/images/viviendas_ipv.jpg" 
          alt="Viviendas IPV"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      <div className="text-center mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <div style={{ position: 'relative', zIndex: 1001 }}>
          <h2 className="mb-0">Viviendas IPV</h2>
          <p className="mb-0 text-muted">
            Ingrese la cantidad de módulos de vivienda y seleccione la tarea a realizar.
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
                <label htmlFor="tipoObra" className="form-label">Tipo de Obra</label>
                <select 
                  className="form-select" 
                  id="tipoObra" 
                  value={tipoObra}
                  onChange={(e) => setTipoObra(e.target.value)}
                  style={{ position: 'relative', zIndex: 1005 }}
                >
                  <option value="nueva">Obra Nueva</option>
                  <option value="construida">Obra Construida</option>
                </select>
              </div>

              <div className="mb-3" style={{ position: 'relative', zIndex: 1004 }}>
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
                  style={{ position: 'relative', zIndex: 1005 }}
                />
                <div className="form-text">
                  Hasta 50 unidades: cada unidad × VPTR × 20 | Excedente: cada unidad × VPTR × 10
                </div>
              </div>
              
              {/* Selección de tareas - Solo para Obra Nueva */}
              {tipoObra === 'nueva' && (
                <div className="mb-3 dynamic-field" style={{ position: 'relative', zIndex: 1004 }}>
                  <label className="form-label">Seleccione las tareas:</label>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaViviendasIPV" 
                      id="ipvAnteproyecto" 
                      value="Anteproyecto" 
                      checked={tareaSeleccionada === "Anteproyecto"}
                      onChange={() => setTareaSeleccionada("Anteproyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="ipvAnteproyecto">Anteproyecto (40%)</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaViviendasIPV" 
                      id="ipvProyecto" 
                      value="Proyecto" 
                      checked={tareaSeleccionada === "Proyecto"}
                      onChange={() => setTareaSeleccionada("Proyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="ipvProyecto">Proyecto (60%)</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaViviendasIPV" 
                      id="ipvDireccion" 
                      value="Dirección Técnica" 
                      checked={tareaSeleccionada === "Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="ipvDireccion">Dirección Técnica (40%)</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaViviendasIPV" 
                      id="ipvProyectoDireccion" 
                      value="Proyecto y Dirección Técnica" 
                      checked={tareaSeleccionada === "Proyecto y Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Proyecto y Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="ipvProyectoDireccion">Proyecto y Dirección Técnica (60% - Dirección incluida)</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaViviendasIPV" 
                      id="ipvAnteproyectoProyecto" 
                      value="Anteproyecto y Proyecto" 
                      checked={tareaSeleccionada === "Anteproyecto y Proyecto"}
                      onChange={() => setTareaSeleccionada("Anteproyecto y Proyecto")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="ipvAnteproyectoProyecto">Anteproyecto y Proyecto (100%)</label>
                  </div>
                  <div className="form-check task-item" style={{ position: 'relative', zIndex: 1005 }}>
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="tareaViviendasIPV" 
                      id="ipvCompleto" 
                      value="Anteproyecto, Proyecto y Dirección Técnica" 
                      checked={tareaSeleccionada === "Anteproyecto, Proyecto y Dirección Técnica"}
                      onChange={() => setTareaSeleccionada("Anteproyecto, Proyecto y Dirección Técnica")}
                      style={{ position: 'relative', zIndex: 1006 }}
                    />
                    <label className="form-check-label" htmlFor="ipvCompleto">Anteproyecto, Proyecto y Dirección Técnica (100%)</label>
                  </div>
                </div>
              )}

              {/* Mensaje para Obra Construida */}
              {tipoObra === 'construida' && (
                <div className="alert alert-info" style={{ position: 'relative', zIndex: 1004 }}>
                  Para Obra Construida, la única tarea disponible es Relevamiento (60% del valor base).
                </div>
              )}
              
              <div className="d-grid" style={{ position: 'relative', zIndex: 1005 }}>
                <button 
                  className="calculate-button" 
                  onClick={calcularViviendasIPV}
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
              <h5 className="mb-0">Resultados - Viviendas IPV</h5>
            </div>
            <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
              {resultados ? (
                resultados.error ? (
                  <div className="alert alert-warning text-center" style={{ position: 'relative', zIndex: 1004 }}>
                    {resultados.error}
                  </div>
                ) : (
                  <div id="resultadosViviendasIPV" style={{ position: 'relative', zIndex: 1004 }}>
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
                      <div className="mt-3">
                        <h6>Detalles del cálculo:</h6>
                        {resultados.detallesCalculo.map((detalle, index) => (
                          <div 
                            key={index} 
                            className={`viviendas-ipv-calculo-detalle ${
                              detalle.tipo === 'info' ? 'text-warning' : 
                              detalle.tipo === 'calculo' ? 'text-dark' : ''
                            }`}
                            style={{
                              padding: '8px',
                              marginBottom: '5px',
                              fontSize: '0.85rem'
                            }}
                          >
                            {detalle.contenido}
                          </div>
                        ))}
                      </div>
                    )}
                    
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
                    Ingrese la cantidad de módulos y haga clic en calcular para ver los resultados
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

export default ViviendasIPVC;