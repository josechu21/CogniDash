import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";



function MisDatasets() {

    const [options, setOptions] = useState({});
    const [hayDatos, setHayDatos] = useState(false);
    const [data, setData] = useState([{}]);
    const [msg, setMsg] = useState(null);
    const [alert, setAlert] = useState(null);
    const [fechas, setFechas] = useState({});

    const [mostrarDatos, setMostrarDatos] = useState(false);

    useEffect(() => {
        fetch('/files')
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (Object.keys(data.upload_files).length !== 0) {
                            setFechas(data.fechas);
                            setOptions(data.upload_files);
                            setHayDatos(true);
                        }
                    })
                } else {
                    response.text().then(data => {
                        setAlert('alert alert-danger mt-3');
                        setMsg(data);
                    });
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleVer = (event) => {
        const formData = new FormData();
        formData.append('fileId', event.target.value);

        fetch('/verDataset', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    console.log('¡Datos obtenidos con éxito!');
                    response.json().then(data => {
                        setAlert(null);
                        setMsg(null);
                        setMostrarDatos(true);
                        setData(data);
                    });
                } else {
                    setAlert('alert alert-danger mt-3');
                    setMsg('Error al obtener los datos.');
                    setMostrarDatos(false);
                    setData([{}]);
                }
            })
            .catch(error => console.error('Error de red:', error));
    };

    const handleCerrarTabla = () => {
        setMostrarDatos(false);
    };

    const handleEliminarDataset = (event) => {
        const formData = new FormData();
        formData.append('fileId', event.target.value);

        fetch('/eliminaArchivo', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    console.log('¡Eliminación correcta!');
                    window.location.reload();
                } else {
                    setAlert('alert alert-danger mt-3');
                    setMsg('Error al eliminar el archivo.');
                }
            })
            .catch(error => console.error('Error de red:', error));
    }

    const handleDescargar = (event) => {
        const formData = new FormData();
        formData.append('fileId', event.target.value);

        fetch('/descargarCsv', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
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
                    setAlert('alert alert-danger mt-3');
                    setMsg('Error al obtener los datos.');
                    setMostrarDatos(false);
                    setData([{}]);
                }
            })
            .catch(error => console.error('Error de red:', error));
    };

    const handleBtnCargar = () => {
        window.location.href = '/subir-archivo';
    }

    return (
        <div className="footer-container">
            <Navbar />
            <h1>Mis Datasets</h1>
            {hayDatos && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha de creación</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(options).map(([key, value]) => (
                            <tr key={key}>
                                <td>{value}</td>
                                <td>{new Date(fechas[key]).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: 'UTC'
                                })}</td>
                                <td>
                                    <button className="btn btn-primary" value={key} onClick={handleVer}>Ver</button>
                                    <button className="btn btn-success" value={key} onClick={handleDescargar}>Descargar</button>
                                    <button className="btn btn-danger" value={key} onClick={handleEliminarDataset}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {mostrarDatos && (
                <div>
                    <h2>Dataset seleccionado</h2>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(0, 10).map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, index) => (
                                        <td key={index}>{value !== null ? value : <span style={{ color: 'blue' }}>NULL</span>}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-danger" onClick={handleCerrarTabla}>Cerrar</button>
                </div>
            )}
            {!hayDatos && (
                <div>
                    <hr className="separator" />
                    <h2>No existen archivos de datos cargados para este usuario</h2>
                    <hr className="separator" />
                </div>
            )}
            <div className="btn-container mb-3">
                <br />
                <button className="btn btn-primary btn-lg px-5" onClick={handleBtnCargar}>Cargar archivo</button>
            </div>
            {(msg !== null) && (
                <div className={alert} role="alert">{msg}</div>
            )}
            <Footer />
        </div>
    )
}

export default MisDatasets;