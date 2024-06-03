import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import '../style/footer.css';
import VisualizacionDatos from './VisualizacionDatos';
import VisualizacionResultados from './VisualizacionResultados';

const Grafica = () => {
    const [hayDatos, setHayDatos] = useState(false);
    const [msg, setMsg] = useState(null);
    const [alert, setAlert] = useState(null);
    const [visualizaDatos, setVisualizaDatos] = useState(false);
    const [visualizaResultados, setVisualizaResultados] = useState(false);

    useEffect(() => {
        fetch('/files')
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data.upload_files).length !== 0) {
                    setHayDatos(true);
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleBtnVisualizar = () => {
        setVisualizaDatos(true);
        setVisualizaResultados(false);
    }

    const handleBtnResultados = () => {
        setVisualizaResultados(true);
        setVisualizaDatos(false);
    }

    const handleBtnCargar = () => {
        window.location.href = '/subir-archivo';
    }

    return (
        <div>
            <div className="footer-container">
                <Navbar />
                <h1>Nueva Gráfica</h1>
                <hr className="separator" />
                <h3>¿Quiere realizar una visualización del conjunto de datos o de los resultados?</h3>
                <div className="btn-container mb-3">
                    <button className="btn btn-warning btn-lg px-5" onClick={handleBtnVisualizar} style={{margin: '3px'}}>Visualización de datos</button>
                    <button className="btn btn-warning btn-lg px-5" onClick={handleBtnResultados} style={{margin: '3px'}}>Visualización de resultados</button>
                </div>

                {hayDatos && visualizaDatos && (
                    <VisualizacionDatos msg={msg} setMsg={setMsg} alert={alert} setAlert={setAlert}/>
                )}

                {hayDatos && visualizaResultados && (
                    <VisualizacionResultados msg={msg} setMsg={setMsg} alert={alert} setAlert={setAlert}/>
                )}

                {!hayDatos && (
                    <div>
                        <hr className="separator" />
                        <h2>No existen archivos de datos cargados para este usuario</h2>
                        <hr className="separator" />
                        <div className="btn-container mb-3">
                            <button className="btn btn-primary btn-lg px-5" onClick={handleBtnCargar}>Cargar archivo</button>
                        </div>
                    </div>
                )}
                {(msg !== null) && (
                    <div className={alert} role="alert">{msg}</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Grafica;
