import React, { useState, useEffect } from 'react';
import Navbar from "./NavBar";
import Footer from "./Footer";
import '../style/footer.css';
import agregarLogo from '../images/agregar.png';

function Dashboard() {
    const [graficas, setGraficas] = useState([]);
    const [msg, setMsg] = useState(false);

    useEffect(() => {
        fetch('/graficas')
            .then(response => response.json())
            .then(data => {
                setGraficas(data);
                if (Object.keys(data).length === 0) {
                    setMsg(true);
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleBtnGrafica = () => {
        window.location.href = '/nueva-grafica';
    }

    const handleBtnEliminar = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/eliminaGrafica', {
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

    const handleBtnDescargar = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/descargaGrafica', {
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
                <Navbar/>
                <h1>Dashboard</h1>
                <div className="graficas-container row">
                {msg && (
                    <div className="msg">
                        <hr className="separator" />
                        <h2>No hay gráficas disponibles, puede generar nuevas desde el menú</h2>
                        <hr className="separator" />
                        <div className="btn-container mb-3">
                            <button className="btn btn-warning btn-lg px-5" onClick={handleBtnGrafica} style={{width: '15%'}}><span><img src={agregarLogo} alt='logo' style={{width: '10%'}}/> Añadir gráfica</span></button>
                        </div>
                    </div>
                )}
                {Object.entries(graficas).map(([key, value]) => (
                    <div id={key} key={key} className="grafica col-6">
                        <img src={value} alt="grafica"/>
                        <button className="btn btn-danger btn-lg px-5" value={key} onClick={handleBtnEliminar}>Eliminar</button>
                        <button className="btn btn-success btn-lg px-5" value={key} onClick={handleBtnDescargar}>Descargar</button>
                    </div>
                ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Dashboard;
