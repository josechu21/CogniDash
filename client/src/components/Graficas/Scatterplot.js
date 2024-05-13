import React from 'react';

const Scatterplot = ({titulo, setTitulo, labelEjeX, setLabelEjeX, labelEjeY, setLabelEjeY}) => {

    const handleTituloChange = (event) => {
        setTitulo(event.target.value);
    };

    const handleLabelEjeXChange = (event) => {
        setLabelEjeX(event.target.value);
    };

    const handleLabelEjeYChange = (event) => {
        setLabelEjeY(event.target.value);
    };

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="tituloCountplot">Título de la gráfica</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloCountplot' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeXCountplot">Etiqueta del eje X</label>
                <input type="text" placeholder="Ingrese etiqueta del eje X" className="form-control mb-2" id="labelEjeXCountplot" name='labelEjeX' value={labelEjeX} onChange={handleLabelEjeXChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeYCoutplot">Etiqueta del eje Y</label>
                <input type="text" placeholder="Ingrese etiqueta del eje Y" className="form-control mb-2" id="labelEjeYCoutplot" name='labelEjeY' value={labelEjeY} onChange={handleLabelEjeYChange}/>
            </div>
            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default Scatterplot;