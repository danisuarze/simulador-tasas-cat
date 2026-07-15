import { useState } from "react";
import FooterC from "./components/footer/FooterC";
import JumbotronC from "./components/jumbotron/JumbotronC";
import MenuArrastrableC from "./components/menuInicio/MenuArrastrableC";
import CardsC from "./components/cards/CardsC";
import HonorariosC from "./components/honorarios/HonorariosC";

const App = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleSelectOption = (option) => {
    setActiveComponent(option);
  };

  const handleBack = () => {
    setActiveComponent(null);
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
      background: '#111B4D'
    }}>
      <JumbotronC />
      {showMenu && <MenuArrastrableC onSelectOption={handleSelectOption} />}
      {!showMenu && (
        <div style={{ flex: 1, padding: '20px' }}>
          {renderContent()}
        </div>
      )}
      <FooterC />
    </div>
  );
};

export default App;