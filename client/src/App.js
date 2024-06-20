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
        <Route path="/" element={<Navigate to="/cognidash/inicioSesion" />} />
        <Route path="/cognidash" element={<Navigate to="/cognidash/inicioSesion" />} />
        <Route path="/cognidash/inicioSesion" element={<InicioSesion />} />
        <Route path="/cognidash/subir-archivo" element={<SubirArchivo />} />
        <Route path="/cognidash/dashboard" element={<Dashboard/>} />
        <Route path="/cognidash/misDatasets" element={<MisDatasets/>} />
        <Route path="/cognidash/informesGenerados" element={<InformesGenerados/>} />
        <Route path="/cognidash/nueva-grafica" element={<Grafica/>} />
        <Route path="/cognidash/nueva-cuenta" element={<NuevaCuenta/>} />
      </Routes>
    </div>
  );
}

export default App;
