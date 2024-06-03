import React from 'react';

const CurvaRoc = ({titulo, setTitulo, labelEjeX, setLabelEjeX, labelEjeY, setLabelEjeY}) => {

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
                <label htmlFor="tituloCurvaRoc">Título de la gráfica</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloCurvaRoc' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeXCurvaRoc">Etiqueta del eje X</label>
                <input type="text" placeholder="Ingrese etiqueta del eje X" className="form-control mb-2" id="labelEjeXCurvaRoc" name='labelEjeX' value={labelEjeX} onChange={handleLabelEjeXChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeYCurvaRoc">Etiqueta del eje Y</label>
                <input type="text" placeholder="Ingrese etiqueta del eje Y" className="form-control mb-2" id="labelEjeYCurvaRoc" name='labelEjeY' value={labelEjeY} onChange={handleLabelEjeYChange}/>
            </div>
            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default CurvaRoc;