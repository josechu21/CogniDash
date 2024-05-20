import React from 'react';

const Histplot = ({titulo, setTitulo, labelEjeX, setLabelEjeX, valueEjeX, setValueEjeX, labelEjeY, setLabelEjeY, valueEjeY, setValueEjeY, valueHue, setValueHue}) => {

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
                <label htmlFor="tituloHistPlot">Título de la gráfica</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloHistPlot' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeXHistPlot">Etiqueta del eje X</label>
                <input type="text" placeholder="Ingrese etiqueta del eje X" className="form-control mb-2" id="labelEjeXHistPlot" name='labelEjeX' value={labelEjeX} onChange={handleLabelEjeXChange}/>
                <label htmlFor='valueEjeXHistPlot' className='form-label'>Columna del eje X</label>
                <input type='text' placeholder="Ingrese campo de datos eje X" className='form-control mb-2' id='valueEjeXHistPlot' name='valueEjeX' value={valueEjeX} onChange={handleValueEjeXChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeYHistPlot">Etiqueta del eje Y</label>
                <input type="text" placeholder="Ingrese etiqueta del eje Y" className="form-control mb-2" id="labelEjeYHistPlot" name='labelEjeY' value={labelEjeY} onChange={handleLabelEjeYChange}/>
                <label htmlFor='valueEjeYHistPlot' className='form-label'>Columna del eje Y</label>
                <input type='text' placeholder="Ingrese campo de datos eje Y" className='form-control mb-2' id='valueEjeYHistPlot' name='valueEjeY' value={valueEjeY} onChange={handleValueEjeYChange}/>
            </div>

            <div className="mb-3">
                <label htmlFor="AgrupHistPlot">Variable de agrupamiento</label>
                <input type="text" placeholder="Ingrese una variable de agrupamiento" className="form-control mb-2" id="AgrupHistPlot" name='AgrupHistPlot' value={valueHue} onChange={handleValueHueChange}/>
            </div>

            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default Histplot;