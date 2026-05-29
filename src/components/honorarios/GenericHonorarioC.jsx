import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const GenericHonorarioC = ({ onBack, title }) => {
  return (
    <Container className="my-5" style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="text-center mb-4">
        <Button onClick={onBack} variant="secondary" className="mb-3">
          <FaArrowLeft className="me-2" /> Volver a especialidades
        </Button>
        <h2 style={{ color: '#040D3B' }}>{title}</h2>
        <p className="text-muted">Módulo en desarrollo</p>
      </div>
      <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8f9fa', borderRadius: '15px' }}>
        <h3>🚧 Componente en construcción</h3>
        <p>Próximamente estará disponible el cálculo de honorarios para <strong>{title}</strong>.</p>
        <Button onClick={onBack} variant="primary">Volver al menú</Button>
      </div>
    </Container>
  );
};

export default GenericHonorarioC;