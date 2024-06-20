import React, { useState, useEffect } from 'react';
import Navbar from "./NavBar";
import Footer from "./Footer";
import '../style/footer.css';
import '../style/dashboard.css';
import agregarLogo from '../images/agregar.png';
import informeLogo from '../images/informe.png';
import Loader from './Loader';

function Dashboard() {
    const [graficasVisualizar, setGraficasVisualizar] = useState([]);
    const [graficasResultados, setGraficasResultados] = useState([]);
    const [msg, setMsg] = useState(false);

    const [loading, setLoading] = useState(false); // Estado para controlar la carga de la página

    const [hayGraficasVisualizar, setHayGraficasVisualizar] = useState(false);
    const [hayGraficasResultados, setHayGraficasResultados] = useState(false);

    useEffect(() => {
        fetch('/cognidash/api/graficasVisualizar')
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

        fetch('/cognidash/api/graficasResultados')
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
        window.location.href = '/cognidash/nueva-grafica';
    }

    const handleBtnInforme = () => {
        setLoading(true);
        fetch('/cognidash/api/generaInforme')
            .then(response => {
                if (response.ok) {
                    console.log('¡Informe generado correctamente!');
                    setLoading(false);
                    window.location.href = '/cognidash/informesGenerados';
                } else {
                    console.error('Error al generar el informe.');
                    setLoading(false);
                }
            })
            .catch(error => console.error('Error de red:', error));
            setLoading(false);
    }

    const handleBtnEliminarVisualizar = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/cognidash/api/eliminaGraficaVisualizacion', {
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

        fetch('/cognidash/api/descargaGraficaVisualizacion', {
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

        fetch('/cognidash/api/eliminaGraficaResultados', {
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

        fetch('/cognidash/api/descargaGraficaResultados', {
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
            {loading && <Loader />}
            <div className="footer-container">
                <Navbar />
                <h1>Dashboard</h1>
                {(Object.entries(graficasVisualizar).length > 0 || Object.entries(graficasResultados).length > 0) && (
                    <div className='boton btn-container mb-3'>
                        <button className="btn btn-warning btn-lg px-2" onClick={handleBtnGrafica} style={{ width: '30%' }}><span><img src={agregarLogo} alt='logo' style={{ width: '10%' }} /> Añadir gráfica</span></button>
                        <button className="btn btn-primary btn-lg px-2" onClick={handleBtnInforme} style={{ width: '10%', margin: '5px' }}><img src={informeLogo} alt='logo' style={{ width: '35%' }} /></button>
                    </div>
                )}
                <div className="graficas-container row">
                    {msg && !hayGraficasVisualizar && !hayGraficasResultados && (
                        <div className="msg">
                            <hr className="separator" />
                            <h2>No hay gráficas disponibles, puedes generar nuevas desde el menú</h2>
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
                            <div className="graficas-container row">
                                {Object.entries(graficasVisualizar).map(([key, value]) => (
                                    <div id={key} key={key} className="grafica col-6">
                                        <img src={value} alt="grafica" />
                                        <button className="btn btn-danger btn-lg px-3 boton-pad" value={key} onClick={handleBtnEliminarVisualizar}>Eliminar</button>
                                        <button className="btn btn-success btn-lg px-3 boton-pad" value={key} onClick={handleBtnDescargarVisualizar}>Descargar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {hayGraficasResultados && (
                        <div>
                            <hr className="separator" />
                            <h3>Gráficas de visualización de resultados</h3>
                            <div className="graficas-container row">
                                {Object.entries(graficasResultados).map(([key, value]) => (
                                    <div id={key} key={key} className="grafica col-6">
                                        <img src={value} alt="grafica" className='img-fluid' />
                                        <button className="btn btn-danger btn-lg px-3 boton-pad" value={key} onClick={handleBtnEliminarResultados}>Eliminar</button>
                                        <button className="btn btn-success btn-lg px-3 boton-pad" value={key} onClick={handleBtnDescargarResultados}>Descargar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
