import React, { useState, useEffect } from 'react';
import Navbar from "./NavBar";
import Footer from "./Footer";
import '../style/footer.css';
import '../style/dashboard.css';
import agregarLogo from '../images/agregar.png';

function Dashboard() {
    const [graficasVisualizar, setGraficasVisualizar] = useState([]);
    const [graficasResultados, setGraficasResultados] = useState([]);
    const [msg, setMsg] = useState(false);

    const [hayGraficasVisualizar, setHayGraficasVisualizar] = useState(false);
    const [hayGraficasResultados, setHayGraficasResultados] = useState(false);

    useEffect(() => {
        fetch('/graficasVisualizar')
            .then(response => response.json())
            .then(data => {
                setGraficasVisualizar(data);
                setHayGraficasVisualizar(true);
                if (Object.keys(data).length === 0) {
                    setMsg(true);
                    setHayGraficasVisualizar(false);
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));

        fetch('/graficasResultados')
            .then(response => response.json())
            .then(data => {
                setGraficasResultados(data);
                setHayGraficasResultados(true);
                if (Object.keys(data).length === 0) {
                    setMsg(true);
                    setHayGraficasResultados(false);
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleBtnGrafica = () => {
        window.location.href = '/nueva-grafica';
    }

    const handleBtnEliminarVisualizar = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/eliminaGraficaVisualizacion', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('¡Eliminacion correcta!');
                window.location.reload();
            } else {
                console.error('Error al eliminar.');
            }
        })
            .catch(error => console.error('Error de red:', error));
    };

    const handleBtnDescargarVisualizar = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/descargaGraficaVisualizacion', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('¡Descarga correcta!');
                response.blob().then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = event.target.value;
                    a.click();
                });
            } else {
                console.error('Error al descargar.');
            }
        })
            .catch(error => console.error('Error de red:', error));
    };

    const handleBtnEliminarResultados = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/eliminaGraficaResultados', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('¡Eliminacion correcta!');
                window.location.reload();
            } else {
                console.error('Error al eliminar.');
            }
        })
            .catch(error => console.error('Error de red:', error));
    };

    const handleBtnDescargarResultados = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/descargaGraficaResultados', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                console.log('¡Descarga correcta!');
                response.blob().then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = event.target.value;
                    a.click();
                });
            } else {
                console.error('Error al descargar.');
            }
        })
            .catch(error => console.error('Error de red:', error));
    };

    return (
        <div>
            <div className="footer-container">
                <Navbar />
                <h1>Dashboard</h1>
                {(Object.entries(graficasVisualizar).length > 0 || Object.entries(graficasResultados).length > 0) && (
                    <div className='boton btn-container mb-3'>
                        <button className="btn btn-warning btn-lg px-5" onClick={handleBtnGrafica} style={{ width: '35%' }}><span><img src={agregarLogo} alt='logo' style={{ width: '10%' }} /> Añadir gráfica</span></button>
                    </div>
                )}
                <div className="graficas-container row">
                    {msg && !hayGraficasVisualizar && !hayGraficasResultados && (
                        <div className="msg">
                            <hr className="separator" />
                            <h2>No hay gráficas disponibles, puede generar nuevas desde el menú</h2>
                            <hr className="separator" />
                            <div className="btn-container mb-3">
                                <button className="btn btn-warning btn-lg px-5" onClick={handleBtnGrafica} style={{ width: '15%' }}><span><img src={agregarLogo} alt='logo' style={{ width: '10%' }} /> Añadir gráfica</span></button>
                            </div>
                        </div>
                    )}
                    {hayGraficasVisualizar && (
                        <div>
                            <hr className="separator" />
                            <h3>Gráficas de visualización de los datos</h3>
                            {Object.entries(graficasVisualizar).map(([key, value]) => (
                                <div id={key} key={key} className="grafica col-6">
                                    <img src={value} alt="grafica" />
                                    <button className="btn btn-danger btn-lg px-3 boton-pad" value={key} onClick={handleBtnEliminarVisualizar}>Eliminar</button>
                                    <button className="btn btn-success btn-lg px-3 boton-pad" value={key} onClick={handleBtnDescargarVisualizar}>Descargar</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {hayGraficasResultados && (
                        <div>
                            <hr className="separator" />
                            <h3>Gráficas de visualización de resultados</h3>
                            {Object.entries(graficasResultados).map(([key, value]) => (
                                <div id={key} key={key} className="grafica col-6">
                                    <img src={value} alt="grafica" />
                                    <button className="btn btn-danger btn-lg px-3 boton-pad" value={key} onClick={handleBtnEliminarResultados}>Eliminar</button>
                                    <button className="btn btn-success btn-lg px-3 boton-pad" value={key} onClick={handleBtnDescargarResultados}>Descargar</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
