import { useState, useRef, useEffect } from "react";
import "./LoginC.css";

const LoginC = ({ user, onLoginSuccess, position = "top-right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef(null);

  // Cerrar el modal si haces clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowEmailForm(false); // Resetea el formulario al cerrar
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowEmailForm(false); // Resetea al abrir/cerrar
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setShowEmailForm(false);
  };

  const handleLogin = (provider) => {
    console.log(`Iniciando sesión con ${provider}`);
    onLoginSuccess({ name: "Usuario Demo", email: "demo@correo.com" });
    handleClose();
  };

  // Lógica para login con email y contraseña
  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    console.log(`Iniciando sesión con correo: ${email}`);
    onLoginSuccess({ name: email.split('@')[0], email: email });
    handleClose();
  };

  const handleLogout = () => {
    onLoginSuccess(null);
    handleClose();
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <div className={`login-container ${position}`}>
        <button className="login-toggle-btn" onClick={handleToggle}>
          {user ? (
            <>
              <img 
                src="https://cdn-icons-png.flaticon.com/128/660/660350.png" 
                alt="Cerrar sesión" 
                className="toggle-icon"
              />
              <span className="toggle-text">Cerrar sesión</span>
            </>
          ) : (
            <>
              <img 
                src="https://cdn-icons-png.flaticon.com/128/3596/3596092.png" 
                alt="Ingresar" 
                className="toggle-icon"
              />
              <span className="toggle-text">Ingresar</span>
            </>
          )}
        </button>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="login-modal-overlay" onClick={handleClose}>
          <div className="login-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close-btn" onClick={handleClose}>✕</button>

            {!user ? (
              <>
                {/* 1. Si NO está en el formulario de correo, muestra las opciones de redes */}
                {!showEmailForm ? (
                  <>
                    <div className="modal-header">
                      <h3>Iniciar sesión con</h3>
                    </div>
                    
                    <div className="social-buttons">
                      <button className="social-btn google-btn" onClick={() => handleLogin('Google')}>
                        <img src="https://cdn-icons-png.flaticon.com/128/300/300221.png" alt="Google" className="social-icon" />
                        Continuar con Google
                      </button>
                      <button className="social-btn facebook-btn" onClick={() => handleLogin('Facebook')}>
                        <img src="https://cdn-icons-png.flaticon.com/128/733/733547.png" alt="Facebook" className="social-icon" />
                        Continuar con Facebook
                      </button>
                      <button className="social-btn instagram-btn" onClick={() => handleLogin('Instagram')}>
                        <img src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png" alt="Instagram" className="social-icon" />
                        Continuar con Instagram
                      </button>
                      
                      {/* Botón para abrir el formulario */}
                      <button className="social-btn email-btn" onClick={() => setShowEmailForm(true)}>
                        <img src="https://cdn-icons-png.flaticon.com/128/1041/1041914.png" alt="Otra cuenta" className="social-icon" />
                        Ingresar con otra cuenta
                      </button>
                    </div>
                  </>
                ) : (
                  /* 2. Si está en el formulario, muestra los inputs */
                  <>
                    <div className="modal-header">
                      <h3>Ingresar con otra cuenta</h3>
                    </div>
                    
                    <form className="email-login-form" onSubmit={handleEmailLogin}>
                      <div className="input-group">
                        <label>Usuario o Email</label>
                        <input 
                          type="email" 
                          placeholder="tucorreo@ejemplo.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <button type="submit" className="submit-login-btn">Ingresar</button>
                      
                      <button type="button" className="back-btn" onClick={() => setShowEmailForm(false)}>
                        ← Volver a las opciones
                      </button>
                    </form>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="modal-header">
                  <h3>¡Hola, {user.name}!</h3>
                  <p>{user.email}</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <img src="https://cdn-icons-png.flaticon.com/128/660/660350.png" alt="Salir" className="logout-icon" />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LoginC;