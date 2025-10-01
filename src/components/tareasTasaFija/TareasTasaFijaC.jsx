import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './TareasTasaFijaC.css'; // Importamos el CSS

const TareasTasaFijaC = ({ onBack }) => {
  // Constantes
  const VPTR = 950;
  
  // Lista de tareas con sus multiplicadores
  const tareas = [
    { id: 1, nombre: "CAMBIO DIRECCION TECNICA ENTRE ARQUITECTOS", multiplicador: 50 },
    { id: 2, nombre: "CAMBIO REPRES. TECNICO ENTRE ARQUITECTOS", multiplicador: 50 },
    { id: 3, nombre: "CERTIFICACION DE FIRMA", multiplicador: 20 },
    { id: 4, nombre: "DEMOLICIONES", multiplicador: 50 },
    { id: 5, nombre: "DESVINCULACION / RENUNCIA", multiplicador: 20 },
    { id: 6, nombre: "FACTIBILIDAD DE USO", multiplicador: 20 },
    { id: 7, nombre: "PLENARIO", multiplicador: 20 },
    { id: 8, nombre: "PROPUESTA URBANA", multiplicador: 50 },
    { id: 9, nombre: "PROTECCION DE VIA PUBLICA Y EDIFICIOS LINDEROS", multiplicador: 50 },
    { id: 10, nombre: "RESELLADOS", multiplicador: 20 },
    { id: 11, nombre: "SEGURIDAD E HIGIENE", multiplicador: 50 },
    { id: 12, nombre: "SERVICIO CONTRA INCENDIOS - DEFENSA CIVIL", multiplicador: 50 },
    { id: 13, nombre: "TASA REGISTRO", multiplicador: 20 },
    { id: 14, nombre: "TRABAJOS PRELIMINARES", multiplicador: 200 },
    { id: 15, nombre: "VISADO DOCUMENTACION COMPLEMENTARIA", multiplicador: 20 }
  ];

  // Estados
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [acordeonAbierto, setAcordeonAbierto] = useState(false);

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Calcular el valor cuando se selecciona una tarea
  useEffect(() => {
    if (tareaSeleccionada) {
      const valor = tareaSeleccionada.multiplicador * VPTR;
      setResultado({
        tarea: tareaSeleccionada,
        valor,
        vptrEquivalente: tareaSeleccionada.multiplicador
      });
      // Cerrar el acordeón después de seleccionar
      setAcordeonAbierto(false);
    } else {
      setResultado(null);
    }
  }, [tareaSeleccionada]);

  // Función para seleccionar otra tarea
  const seleccionarOtraTarea = () => {
    setTareaSeleccionada(null);
    setResultado(null);
    setAcordeonAbierto(true);
  };

  return (
    <div className="tareas-tasa-fija-container" style={{ position: 'relative', zIndex: 1000, minHeight: '100vh' }}>
      {/* Botón Volver al Home */}
      <div className="container mt-3 mb-4" style={{ position: 'relative', zIndex: 1001 }}>
        <button 
          className="btn instalaciones-estructuras-back-button"
          onClick={onBack}
          style={{ 
            backgroundColor: '#7B9C6B', 
            borderColor: '#7B9C6B', 
            color: 'white',
            position: 'relative',
            zIndex: 1002
          }}
        >
          <FaArrowLeft className="me-2" />
          Volver al Home
        </button>
      </div>

      <div className="tareas-tasa-fija-header" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="container">
          <h1 className="text-center mb-1">Tareas con Tasa Fija</h1>
          <p className="text-center mb-0">Seleccione una tarea para ver su valor</p>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1001 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 fixed-width-container">
            {/* Acordeón de selección de tareas */}
            <div className="tareas-tasa-fija-card card mb-4" style={{ position: 'relative', zIndex: 1002 }}>
              <div 
                className="tareas-tasa-fija-card-header card-header d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer', position: 'relative', zIndex: 1003 }}
                onClick={() => setAcordeonAbierto(!acordeonAbierto)}
              >
                <h5 className="mb-0 fixed-title-container">
                  {tareaSeleccionada ? tareaSeleccionada.nombre : "Selecciona la tarea"}
                </h5>
                {acordeonAbierto ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              
              {acordeonAbierto && (
                <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
                  <div className="tareas-list">
                    {tareas.map(tarea => (
                      <div key={tarea.id} className="tareas-tasa-fija-task-item form-check" style={{ position: 'relative', zIndex: 1004 }}>
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="tareaSeleccionada"
                          id={`tarea-${tarea.id}`}
                          checked={tareaSeleccionada && tareaSeleccionada.id === tarea.id}
                          onChange={() => setTareaSeleccionada(tarea)}
                          style={{ position: 'relative', zIndex: 1005 }}
                        />
                        <label className="form-check-label fixed-label-container" htmlFor={`tarea-${tarea.id}`}>
                          {tarea.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resultados */}
            {resultado && (
              <div className="tareas-tasa-fija-card card" style={{ position: 'relative', zIndex: 1002 }}>
                <div className="tareas-tasa-fija-card-header card-header" style={{ position: 'relative', zIndex: 1003 }}>
                  <h5 className="mb-0">Resultado</h5>
                </div>
                <div className="card-body" style={{ position: 'relative', zIndex: 1003 }}>
                  <div className="result-content">
                    <div className="tareas-tasa-fija-result-item">
                      <strong>Tarea seleccionada:</strong>
                      <div className="mt-2 tarea-nombre-resultado fixed-result-container">
                        {resultado.tarea.nombre}
                      </div>
                    </div>
                    
                    <div className="tareas-tasa-fija-info-adicional mt-3">
                      <div className="info-row d-flex justify-content-between">
                        <span className="info-label">Equivalente en VPTR:</span>
                        <strong className="info-value">{resultado.vptrEquivalente} VPTR</strong>
                      </div>
                      <div className="info-row d-flex justify-content-between mt-2">
                        <span className="info-label">Valor de cada VPTR:</span>
                        <strong className="info-value">{formatoMoneda(VPTR)}</strong>
                      </div>
                    </div>
                    
                    <div className="tareas-tasa-fija-resultado-final mt-4">
                      <div className="tareas-tasa-fija-resultado-final-titulo">Valor de la Tarea</div>
                      <div className="tareas-tasa-fija-resultado-final-valor">
                        {formatoMoneda(resultado.valor)}
                      </div>
                    </div>

                    {/* Botón para seleccionar otra tarea */}
                    <div className="text-center mt-4" style={{ position: 'relative', zIndex: 1004 }}>
                      <button 
                        className="btn tareas-tasa-fija-btn-primary btn-primary"
                        onClick={seleccionarOtraTarea}
                        style={{ position: 'relative', zIndex: 1005 }}
                      >
                        Seleccionar otra tarea
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder cuando no hay selección */}
            {!resultado && !acordeonAbierto && (
              <div className="text-center text-muted mt-4 fixed-placeholder">
                <p>Haga clic en "Selecciona la tarea" para elegir una tarea y ver su valor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TareasTasaFijaC;