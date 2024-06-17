import React from 'react';

const CurvaValidacion = ({titulo, setTitulo, labelEjeX, setLabelEjeX, labelEjeY, setLabelEjeY, estilo, setEstilo, tema, setTema}) => {

    const handleTituloChange = (event) => {
        setTitulo(event.target.value);
    };

    const handleLabelEjeXChange = (event) => {
        setLabelEjeX(event.target.value);
    };

    const handleLabelEjeYChange = (event) => {
        setLabelEjeY(event.target.value);
    };

    const handleEstiloChange = (event) => {
        setEstilo(event.target.value);
    };

    const handleTemaChange = (event) => {
        setTema(event.target.value);
    };

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="tituloCurvaValidacion">Título de la gráfica (si no establece uno se asignará por defecto)</label>
                <input type="text" placeholder="Ingrese título de la gráfica" className="form-control mb-2" id='tituloCurvaValidacion' name='titulo' value={titulo} onChange={handleTituloChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="estiloCurvaValidacion">Estilo de gráfica</label>
                <select className="form-select mb-2" id='estiloCurvaValidacion' name='estiloCurvaValidacion' value={estilo} onChange={handleEstiloChange}>
                    <option value='darkgrid'>darkgrid</option>
                    <option value='whitegrid'>whitegrid</option>
                    <option value='dark'>dark</option>
                    <option value='white'>white</option>
                    <option value='ticks'>ticks</option>
                </select>
                <label htmlFor="temaCurvaValidacion">Tema de color</label>
                <select className="form-select mb-2" id='temaCurvaValidacion' name='temaCurvaValidacion' value={tema} onChange={handleTemaChange}>
                    <optgroup label='Cualitativo'>
                        <option value='tab10'>tab10</option>
                        <option value='tab20'>tab20</option>
                        <option value='tab20b'>tab20b</option>
                        <option value='tab20c'>tab20c</option>
                    </optgroup>
                    <optgroup label='Secuencial'>
                        <option value='viridis'>viridis</option>
                        <option value='plasma'>plasma</option>
                        <option value='inferno'>inferno</option>
                        <option value='magma'>magma</option>
                        <option value='cividis'>cividis</option>
                    </optgroup>
                    <optgroup label='Categórico'>
                        <option value='Pastel1'>Pastel1</option>
                        <option value='Pastel2'>Pastel2</option>
                        <option value='Paired'>Paired</option>
                        <option value='Accent'>Accent</option>
                        <option value='Dark2'>Dark2</option>
                        <option value='Set1'>Set1</option>
                        <option value='Set2'>Set2</option>
                        <option value='Set3'>Set3</option>
                    </optgroup>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeXCurvaValidacion">Etiqueta del eje X (si no establece una se asignará por defecto)</label>
                <input type="text" placeholder="Ingrese etiqueta del eje X" className="form-control mb-2" id="labelEjeXCurvaValidacion" name='labelEjeX' value={labelEjeX} onChange={handleLabelEjeXChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="EjeYCurvaValidacion">Etiqueta del eje Y (si no establece una se asignará por defecto)</label>
                <input type="text" placeholder="Ingrese etiqueta del eje Y" className="form-control mb-2" id="labelEjeYCurvaValidacion" name='labelEjeY' value={labelEjeY} onChange={handleLabelEjeYChange}/>
            </div>
            <button type='submit' className="btn btn-primary">Generar Gráfica</button>
        </div>
    );
};

export default CurvaValidacion;