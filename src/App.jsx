import { useState, useEffect } from "react";
import FooterC from "./components/footer/FooterC";
import JumbotronC from "./components/jumbotron/JumbotronC";
import MenuArrastrableC from "./components/menuInicio/MenuArrastrableC";
import CardsC from "./components/cards/CardsC";
import HonorariosC from "./components/honorarios/HonorariosC";
import LoginC from "./components/login/LoginC";

const App = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem('userSession');
      if (session) {
        const userData = JSON.parse(session);
        setUser(userData);
        console.log('👤 Usuario logueado:', userData);
      }
    } catch (error) {
      console.error('Error al cargar sesión:', error);
      localStorage.removeItem('userSession');
    }
  }, []);

  const handleSelectOption = (option) => {
    setActiveComponent(option);
  };

  const handleBack = () => {
    setActiveComponent(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData) {
      console.log('✅ Login exitoso:', userData);
    } else {
      console.log('👋 Sesión cerrada');
    }
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "tasa":
        return <CardsC onBack={handleBack} />;
      case "honorarios":
        return <HonorariosC onBack={handleBack} />;
      default:
        return null;
    }
  };

  const showMenu = activeComponent === null;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: '#111B4D',
      position: 'relative'
    }}>
      {/* 1. Jumbotron siempre visible y libre */}
      <JumbotronC />
      
      {/* 2. Contenedor RELATIVE: Aquí viven el menú y el Login flotante */}
      <div style={{ position: 'relative', width: '100%' }}>
        
        {/* El menú principal */}
        {showMenu && <MenuArrastrableC onSelectOption={handleSelectOption} />}
        
        {/* El Login flotante (position: absolute) anclado a este contenedor */}
        <LoginC 
          onLoginSuccess={handleLoginSuccess}
          user={user}
          position="top-right"
        />
      </div>

      {/* 3. Contenido dinámico (Cards, Honorarios, etc.) */}
      {!showMenu && (
        <div style={{ flex: 1, padding: '20px' }}>
          {renderContent()}
        </div>
      )}
      
      {/* 4. Footer al final */}
      <FooterC />
    </div>
  );
};

export default App;