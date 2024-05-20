import React from 'react';

const Scatterplot = ({titulo, setTitulo, labelEjeX, setLabelEjeX, labelEjeY, setLabelEjeY}) => {

    const handleTituloChange = (event) => {
        setTitulo(event.target.value);
    };

    const handleLabelEjeXChange = (event) => {
        setLabelEjeX(event.target.value);
    };

    const handleValueEjeXChange = (event) => {
        setValueEjeX(event.target.value);
    };

    const handleLabelEjeYChange = (event) => {
        setLabelEjeY(event.target.value);
    };

    const handleValueEjeYChange = (event) => {
        setValueEjeY(event.target.value);
    };

    const handleValueHueChange = (event) => {
        setValueHue(event.target.value);
    };

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="tituloScatterPlot">Título de la gráfica</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloScatterPlot' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeXScatterPlot">Etiqueta del eje X</label>
                <input type="text" placeholder="Ingrese etiqueta del eje X" className="form-control mb-2" id="labelEjeXScatterPlot" name='labelEjeX' value={labelEjeX} onChange={handleLabelEjeXChange}/>
                <label htmlFor='valueEjeXScatterPlot' className='form-label'>Columna del eje X</label>
                <input type='text' placeholder="Ingrese campo de datos eje X" className='form-control mb-2' id='valueEjeXScatterPlot' name='valueEjeX' value={valueEjeX} onChange={handleValueEjeXChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeYScatterPlot">Etiqueta del eje Y</label>
                <input type="text" placeholder="Ingrese etiqueta del eje Y" className="form-control mb-2" id="labelEjeYScatterPlot" name='labelEjeY' value={labelEjeY} onChange={handleLabelEjeYChange}/>
                <label htmlFor='valueEjeYScatterPlot' className='form-label'>Columna del eje Y</label>
                <input type='text' placeholder="Ingrese campo de datos eje Y" className='form-control mb-2' id='valueEjeYScatterPlot' name='valueEjeY' value={valueEjeY} onChange={handleValueEjeYChange} required/>
            </div>

            <div className="mb-3">
                <label htmlFor="AgrupScatterPlot">Variable de agrupamiento</label>
                <input type="text" placeholder="Ingrese una variable de agrupamiento" className="form-control mb-2" id="AgrupScatterPlot" name='AgrupScatterPlot' value={valueHue} onChange={handleValueHueChange}/>
            </div>
            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default Scatterplot;