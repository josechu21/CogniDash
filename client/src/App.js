import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import SubirArchivo from './components/SubirArchivo';
import InicioSesion from './components/InicioSesion';
import Dashboard from './components/Dashboard';
import MisDatasets from './components/MisDatasets';
import InformesGenerados from './components/InformesGenerados';
import Grafica from './components/Grafica';
import NuevaCuenta from './components/NuevaCuenta';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/inicioSesion" />} />
        <Route path="/inicioSesion" element={<InicioSesion />} />
        <Route path="/subir-archivo" element={<SubirArchivo />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/misDatasets" element={<MisDatasets/>} />
        <Route path="/informesGenerados" element={<InformesGenerados/>} />
        <Route path="/nueva-grafica" element={<Grafica/>} />
        <Route path="/nueva-cuenta" element={<NuevaCuenta/>} />
      </Routes>
    </div>
  );
}

export default App;
