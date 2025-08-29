import React from 'react';
import './FooterC.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const FooterC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="social-row">
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <div className="social-divider"></div>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <div className="social-divider"></div>
            <a href="https://www.dosdisenoweb.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FontAwesomeIcon icon={faGlobe} />
            </a>
          </div>
        </div>
        <div className="footer-content">
          <p className="footer-text">
            © 2025 Desarrollado por: DOS Diseño Web – danisuarze@gmail.com - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterC;