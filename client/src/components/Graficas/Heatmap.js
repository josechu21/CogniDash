import React from 'react';

const HeatMap = ({titulo, setTitulo}) => {

    const handleTituloChange = (event) => {
        setTitulo(event.target.value);
    };

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="tituloCountplot">Título de la gráfica</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloCountplot' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default HeatMap;