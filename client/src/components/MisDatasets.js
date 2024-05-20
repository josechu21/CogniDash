import React, {useState, useEffect} from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";



function MisDatasets() {

    const [options, setOptions] = useState([]);
    const [hayDatos, setHayDatos] = useState(false);
    const [data, setData] = useState([{}]);

    const [mostrarDatos, setMostrarDatos] = useState(false);

    useEffect(() => {
        fetch('/files')
            .then(response => response.json())
            .then(data => {
                setOptions(data);
                if (data.options.length !== 0) {
                    setHayDatos(true);
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const currentDate = new Date().toLocaleDateString();

    const handleVer = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/verDataset', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                console.log('¡Datos obtenidos con éxito!');
                response.json().then(data => {
                    setMostrarDatos(true);
                    setData(data);
                });
            } else {
                console.error('Error al obtener los datos.');
            }
        })
        .catch(error => console.error('Error de red:', error));
    };

    const handleCerrarTabla = () => {
        setMostrarDatos(false);
    };

    const handleEliminarDataset = (event) => {
        const formData = new FormData();
        formData.append('fileName', event.target.value);

        fetch('/eliminaArchivo', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                console.log('¡Eliminación correcta!');
                window.location.reload();
            } else {
                console.error('Error al eliminar.');
            }
        })
        .catch(error => console.error('Error de red:', error));
    }

    
    return (
        <div>
            <Navbar/>
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
                        <td>{currentDate}</td>
                        <td>
                            <button className="btn btn-primary" value={value} onClick={handleVer}>Ver</button>
                            <button className="btn btn-danger" value={value} onClick={handleEliminarDataset}>Eliminar</button>
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
                <h2>No hay datasets disponibles</h2>
            )}
            <Footer/>
        </div>
    )
}

export default MisDatasets;