import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TareasTasaFijaC = ({ onBack }) => {
  // Constantes
  // VPTR: Valor de Punto de Tarea de Referencia = $950
  const VPTR = 950;
  
  // Lista de tareas con sus multiplicadores
  // Cada tarea se calcula como: Multiplicador × VPTR
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

  // Función para formatear números como moneda
  const formatoMoneda = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  // Calcular el valor cuando se selecciona una tarea
  // Fórmula: valor = multiplicador × VPTR
  useEffect(() => {
    if (tareaSeleccionada) {
      const valor = tareaSeleccionada.multiplicador * VPTR;
      setResultado({
        tarea: tareaSeleccionada,
        valor,
        vptrEquivalente: tareaSeleccionada.multiplicador
      });
    } else {
      setResultado(null);
    }
  }, [tareaSeleccionada]);

  return (
    <div className="tareas-tasa-fija-container">
      {/* Botón Volver al Home */}
      <div className="container mt-3 mb-4">
        <button 
          className="btn back-home-btn"
          onClick={onBack} // Usar el prop onBack en lugar de handleBackToHome
        >
          <FaArrowLeft className="me-2" />
          Volver al Home
        </button>
      </div>

      <div className="tareas-tasa-fija-header">
        <div className="container">
          <h1 className="text-center mb-1">Tareas con Tasa Fija</h1>
          <p className="text-center mb-0">Seleccione una tarea para ver su valor</p>
        </div>
      </div>

      <div className="container">
        <div className="row equal-height-columns">
          {/* Columna de selección de tareas - ANCHO FIJO */}
          <div className="col-lg-6 fixed-width-column">
            <div className="tareas-tasa-fija-card card h-100 fixed-card">
              <div className="tareas-tasa-fija-card-header card-header fixed-header">
                <h5 className="mb-0">Listado de Tareas</h5>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <label className="tareas-tasa-fija-form-label">Seleccione una tarea:</label>
                  <div className="tareas-list fixed-list-container">
                    {tareas.map(tarea => (
                      <div key={tarea.id} className="tareas-tasa-fija-task-item form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="tareaSeleccionada"
                          id={`tarea-${tarea.id}`}
                          checked={tareaSeleccionada && tareaSeleccionada.id === tarea.id}
                          onChange={() => setTareaSeleccionada(tarea)}
                        />
                        <label className="form-check-label tarea-label-fixed" htmlFor={`tarea-${tarea.id}`}>
                          {tarea.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna de resultados - ANCHO FIJO */}
          <div className="col-lg-6 fixed-width-column">
            <div className="tareas-tasa-fija-card card h-100 fixed-card">
              <div className="tareas-tasa-fija-card-header card-header fixed-header">
                <h5 className="mb-0">Resultado</h5>
              </div>
              <div className="card-body">
                {resultado ? (
                  <div className="result-content fixed-result-content">
                    <div className="tareas-tasa-fija-result-item">
                      <strong>Tarea seleccionada:</strong>
                      <div className="mt-2 tarea-nombre-resultado fixed-text-container">
                        {resultado.tarea.nombre}
                      </div>
                    </div>
                    
                    <div className="tareas-tasa-fija-resultado-final mt-4">
                      <div className="tareas-tasa-fija-resultado-final-titulo">Valor de la Tarea</div>
                      <div className="tareas-tasa-fija-resultado-final-valor">
                        {formatoMoneda(resultado.valor)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="fixed-placeholder">
                    <p className="text-center text-muted">Seleccione una tarea para ver su valor</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TareasTasaFijaC;