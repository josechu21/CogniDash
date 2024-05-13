import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar'; // Importa el componente SideMenu

function Navbar() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú lateral

  // Función para alternar la visibilidad del menú lateral
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} to="/dashboard" onClick={() => setActiveTab('dashboard')}>Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link ${activeTab === 'misDatasets' ? 'active' : ''}`} to="/misDatasets" onClick={() => setActiveTab('misDatasets')}>Mis Datasets</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link ${activeTab === 'informesGenerados' ? 'active' : ''}`} to="/informesGenerados" onClick={() => setActiveTab('informesGenerados')}>Informes Generados</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={isMenuOpen} /> {/* Renderiza el menú lateral y pasa el estado de visibilidad como prop */}
    </>
  );
}

export default Navbar;
