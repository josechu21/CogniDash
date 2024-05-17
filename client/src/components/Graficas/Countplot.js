import React from 'react';

const Countplot = ({titulo, setTitulo, labelEjeX, setLabelEjeX, valueEjeX, setValueEjeX, labelEjeY, setLabelEjeY, valueEjeY, setValueEjeY, valueHue, setValueHue}) => {

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
                <label htmlFor="tituloCountplot">Título de la gráfica</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloCountplot' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeXCountplot">Etiqueta del eje X</label>
                <input type="text" placeholder="Ingrese etiqueta del eje X" className="form-control mb-2" id="labelEjeXCountplot" name='labelEjeX' value={labelEjeX} onChange={handleLabelEjeXChange}/>
                <label htmlFor='valueEjeXCountplot' className='form-label'>Columna del eje X</label>
                <input type='text' placeholder="Ingrese campo de datos eje X" className='form-control mb-2' id='valueEjeXCountplot' name='valueEjeX' value={valueEjeX} onChange={handleValueEjeXChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeYCountplot">Etiqueta del eje Y</label>
                <input type="text" placeholder="Ingrese etiqueta del eje Y" className="form-control mb-2" id="labelEjeYCountplot" name='labelEjeY' value={labelEjeY} onChange={handleLabelEjeYChange}/>
                <label htmlFor='valueEjeYCountplot' className='form-label'>Columna del eje Y</label>
                <input type='text' placeholder="Ingrese campo de datos eje Y" className='form-control mb-2' id='valueEjeYCountplot' name='valueEjeY' value={valueEjeY} onChange={handleValueEjeYChange}/>
            </div>

            <div className="mb-3">
                <label htmlFor="AgrupCountplot">Variable de agrupamiento</label>
                <input type="text" placeholder="Ingrese una variable de agrupamiento" className="form-control mb-2" id="AgrupCountplot" name='AgrupCountplot' value={valueHue} onChange={handleValueHueChange}/>
            </div>

            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default Countplot;