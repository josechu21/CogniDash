import React, { useState, useEffect } from 'react';
import Navbar from "./NavBar";
import Footer from "./Footer";
import '../style/footer.css';

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
                    console.log('No hay gráficas disponibles');
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleBtnCargar = () => {
        window.location.href = '/subir-archivo';
    }

    const handleBtnGrafica = () => {
        window.location.href = '/nueva-grafica';
    }

    return (
        <div>
            <div className="footer-container">
                <Navbar/>
                <h1>Dashboard</h1>
                <div className="graficas-container row">
                {msg && (
                    <div className="msg">
                        <hr className="separator" />
                        <h2>No hay gráficas disponibles, carga un archivo de datos o genera nuevas gráficas desde el menú</h2>
                        <hr className="separator" />
                        <div className="btn-container mb-3">
                            <button className="btn btn-primary btn-lg px-5" onClick={handleBtnCargar}>Cargar archivo</button>
                            <button className="btn btn-warning btn-lg px-5" onClick={handleBtnGrafica}>Añadir gráfica</button>
                        </div>
                    </div>
                )}
                {Object.entries(graficas).map(([key, value]) => (
                    <div id={key} key={key} className="grafica col-6">
                        <img src={value} alt="grafica"/>
                    </div>
                ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Dashboard;
