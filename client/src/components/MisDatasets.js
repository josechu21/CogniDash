import React, {useState, useEffect} from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";



function MisDatasets() {

    const [options, setOptions] = useState([]);
    const [hayDatos, setHayDatos] = useState(false);

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
                            <button className="btn btn-primary">Ver</button>
                            <button className="btn btn-danger">Eliminar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            )}
            <Footer/>
        </div>
    )
}

export default MisDatasets;