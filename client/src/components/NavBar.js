import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../style/navbar.css';
import Sidebar from './Sidebar'; // Importa el componente SideMenu

function Navbar() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light fondo">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink className={`nav-link btn-nav ${activeTab === 'dashboard' ? 'activo' : ''}`} to="/dashboard" onClick={() => setActiveTab('dashboard')}>Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link btn-nav ${activeTab === 'misDatasets' ? 'activo' : ''}`} to="/misDatasets" onClick={() => setActiveTab('misDatasets')}>Mis Datasets</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link btn-nav ${activeTab === 'informesGenerados' ? 'activo' : ''}`} to="/informesGenerados" onClick={() => setActiveTab('informesGenerados')}>Informes Generados</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Sidebar/>
    </div>
  );
}

export default Navbar;
