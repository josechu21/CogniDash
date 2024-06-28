import React, { useState, useEffect } from "react";

import Loader from "./Loader";

import CurvaRoc from './Graficas/CurvaRoc';
import CurvaPr from './Graficas/CurvaPr';
import CurvaValidacion from "./Graficas/CurvaValidacion";
import CurvaAprendizaje from "./Graficas/CurvaAprendizaje";
import MatrizConfusion from "./Graficas/MatrizConfusion";
import grafica1 from '../images/curvaroc.png';
import grafica2 from '../images/curvapr.png';
import grafica3 from '../images/curvavalidacion.png';
import grafica5 from '../images/grafica5.png';
import grafica6 from '../images/grafica6.png';

function VisualizacionResultados({ msg, setMsg, alert, setAlert }) {
    const [file, setFile] = useState(null);
    const [options, setOptions] = useState({});
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedCheckModelo, setSelectedCheckModelo] = useState('');
    const [selectedCheck, setSelectedCheck] = useState('');
    const [disabled0, setDisabled0] = useState(true);
    const [disabled01, setDisabled01] = useState('');
    const [disabled02, setDisabled02] = useState('');
    const [disabled1, setDisabled1] = useState('');
    const [disabled2, setDisabled2] = useState(true);
    const [showStep0, setShowStep0] = useState(false);
    const [showFirstStep, setShowFirstStep] = useState(false);
    const [showSecondStep, setShowSecondStep] = useState(false);
    const [showThirdStep, setShowThirdStep] = useState(false);
    const [valueTipoModelo, setValueTipoModelo] = useState('randomforest');
    const [loading, setLoading] = useState(false); // Estado para controlar la carga

    const [titulo, setTitulo] = useState('');
    const [labelEjeX, setLabelEjeX] = useState('');
    const [labelEjeY, setLabelEjeY] = useState('');
    const [estilo, setEstilo] = useState('ticks');
    const [tema, setTema] = useState('Pastel1');
    const [varEliminar, setVarEliminar] = useState('');
    const [varObjetivo, setVarObjetivo] = useState('');
    const [varTest, setVarTest] = useState('10');

    useEffect(() => {
        fetch('/cognidash/api/files')
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data.upload_files).length !== 0) {
                    setOptions(data.upload_files);
                    setSelectedOption(Object.keys(data.upload_files)[0]);
                }
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleOptionChange = (option) => {
        setSelectedCheck(option);
        setDisabled2(false);
        setShowThirdStep(false);
    };

    const handleModeloChange = (option) => {
        setSelectedCheckModelo(option);
        setDisabled0(false);
        setShowStep0(false);
        setShowSecondStep(false);
        setShowThirdStep(false);
        setDisabled01(false);
        setDisabled2(false);
        setDisabled02(false);
        setDisabled01(false);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setDisabled1(false);
        setShowFirstStep(false);
    };

    const handleContinue0 = (event) => {
        setDisabled0(true);
        if (selectedCheckModelo === 'cargarmodelo') {
            setShowStep0(true);
        } else if (selectedCheckModelo === 'generarmodelo') {
            setShowStep0(true);
        } else {
            setShowStep0(false);
            //setShowSecondStep(true);
        }
    }

    const handleContinue1 = () => {
        if(varObjetivo !== ''){
            setDisabled1(true);
            setShowFirstStep(true);
        }
    }

    const handleContinue01 = () => {
        if (file) {
            setDisabled01(true);
            setShowSecondStep(true);
        }
    }

    const handleContinue02 = () => {
        setDisabled02(true);
        setShowSecondStep(true);
    }

    const handleContinue2 = () => {
        setDisabled2(true);
        setShowThirdStep(true);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleVarTest = (event) => {
        console.log(event.target.value)
        setVarTest(event.target.value);
    };

    const handleVarEliminar = (event) => {
        setVarEliminar(event.target.value);
    };
    const handleVarObjetivo = (event) => {
        setVarObjetivo(event.target.value);
    };

    const handleSelectTipoModeloChange = (event) => {
        setValueTipoModelo(event.target.value);
        //setShowFirstStep(false);
        setShowSecondStep(false);
        setShowThirdStep(false);
        setDisabled02(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true); // Activar el loader al enviar el formulario

        const formData = new FormData();
        formData.append('fileId', selectedOption);
        formData.append('tipoGrafica', selectedCheck);
        formData.append('titulo', titulo);
        formData.append('labelEjeX', labelEjeX);
        formData.append('labelEjeY', labelEjeY);
        formData.append('estilo', estilo);
        formData.append('tema', tema);
        formData.append('modelName', valueTipoModelo);
        formData.append('hayArchivo', selectedCheckModelo === 'cargarmodelo' ? 'true' : 'false')
        formData.append('varEliminar', varEliminar);
        formData.append('varObjetivo', varObjetivo);
        formData.append('test', varTest);
        if (file) {
            formData.append('file', file);
        }

        fetch('/cognidash/api/generaGraficaResultados', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                setLoading(false);
                console.log('¡Gráfica generada con éxito!');
                window.location.href = '/cognidash/dashboard';
            } else {
                response.text().then(data => {
                    setAlert('alert alert-danger mt-3');
                    setMsg('Error al generar gráfica. ' + data);
                    setLoading(false);
                });
            }
        }
        ).catch(error => console.error('Error de red:', error));

    }

    return (
        <div>
            {loading && <Loader />}
            <hr className="separator" />
            <h2>Visualización de resultados de la predicción</h2>
            <form className='form' onSubmit={handleSubmit} encType="multipart/form-data">
                <div className='container mt-5'>
                    <div id="primerPaso">
                        <h2>Paso 1: Establece el origen de datos</h2>
                        <br />
                        <select value={selectedOption} onChange={handleSelectChange} id='selectDatos'>
                            {Object.entries(options).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                        <br /><br />
                        <h4>Introduce la variable objetivo</h4>
                        <input type="text" placeholder="Introduce la variable objetivo" className="form-control mb-3" id='objetivo' name='objetivo' value={varObjetivo} onChange={handleVarObjetivo} required/>
                        <button className="btn btn-primary" disabled={disabled1} onClick={handleContinue1}>Continuar</button>
                        <br />
                    </div>
                    {showFirstStep && (
                        <div className="form-check" id='paso0'>
                            <h3>¿Tienes ya un modelo o deseas generar uno?</h3>
                            <label htmlFor="cargarmodelo">Ya tengo un modelo</label>
                            <input type="radio" id="cargarmodelo" name="cargarmodelo" value="cargarmodelo" checked={selectedCheckModelo === 'cargarmodelo'} onChange={() => handleModeloChange('cargarmodelo')} /><br />
                            <label htmlFor="generarmodelo">Generar un modelo</label>
                            <input type="radio" id="generarmodelo" name="generarmodelo" value="generarmodelo" checked={selectedCheckModelo === 'generarmodelo'} onChange={() => handleModeloChange('generarmodelo')} />
                            <br /> <br />
                            <button className="btn btn-primary" disabled={disabled0} onClick={handleContinue0}>Continuar</button>
                            <br /> <br />
                        </div>
                    )}
                    {showStep0 && selectedCheckModelo === 'cargarmodelo' && (
                        <div id="paso0">
                            <h3>Paso 2: Sube tu modelo.</h3>
                            <br />
                            <div className="mb-3">
                                <input className="form-control" type="file" onChange={handleFileChange} required />
                                <br/> <br/> <br/>
                                <h4>Introduce las variables que quieres eliminar (separadas por ,)</h4>
                                <input type="text" placeholder="Variables a eliminar" className="form-control mb-3" id='varEliminacion' name='eliminacion' value={varEliminar} onChange={handleVarEliminar}/>
                                <br/>
                                <h4>Selecciona el pocentaje de Entrenamiento y Testing</h4>
                                <select id="testing" value={varTest} onChange={handleVarTest}>
                                    <option value="10">90% Entrenamiento, 10% Testing</option>
                                    <option value="20">80% Entrenamiento, 20% Testing</option>
                                    <option value="30">70% Entrenamiento, 30% Testing</option>
                                </select>
                            </div>
                            <br />
                            <button className="btn btn-primary" disabled={disabled01} onClick={handleContinue01}>Continuar</button>
                            <br /> <br />
                        </div>
                    )}
                    {showStep0 && selectedCheckModelo === 'generarmodelo' && (
                        <div id="paso0">
                            <h3>Paso 2: Elige y configura un modelo.</h3>
                            <br />
                            <div className="mb-3">
                                <select id="tipoModelo" value={valueTipoModelo} onChange={handleSelectTipoModeloChange}>
                                    <option value="randomforest">Random Forest</option>
                                    <option value="svm">Support Vector Machine</option>
                                    <option value="logisticregression">Regresión Logística</option>
                                </select>
                                <br/> <br/> <br/>
                                <h4>Introduce las variables que quieres eliminar (separadas por ,)</h4>
                                <input type="text" placeholder="Variables a eliminar" className="form-control mb-3" id='varEliminacion' name='eliminacion' value={varEliminar} onChange={handleVarEliminar}/>
                                <br/>
                                <h4>Selecciona el pocentaje de Entrenamiento y Testing</h4>
                                <select id="testing" value={varTest} onChange={handleVarTest}>
                                    <option value="10">90% Entrenamiento, 10% Testing</option>
                                    <option value="20">80% Entrenamiento, 20% Testing</option>
                                    <option value="30">70% Entrenamiento, 30% Testing</option>
                                </select>
                            </div>
                            <br />
                            <button className="btn btn-primary" disabled={disabled02} onClick={handleContinue02}>Continuar</button>
                            <br /> <br />
                        </div>
                    )}
                    {showSecondStep && (
                        <div id="segundoPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 3: Selecciona una gráfica</h2>
                            <br />
                            <div className="row">
                                <div className="col-sm-4">
                                    <h4>Matriz de Confusión</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="matrizconfusion"><img src={grafica6} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="matrizconfusion" checked={selectedCheck === 'matrizconfusion'} onChange={() => handleOptionChange('matrizconfusion')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Curva Roc</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="curvaroc"><img src={grafica1} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="curvaroc" checked={selectedCheck === 'curvaroc'} onChange={() => handleOptionChange('curvaroc')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Curva Pr</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="curvapr"><img src={grafica2} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="curvapr" checked={selectedCheck === 'curvapr'} onChange={() => handleOptionChange('curvapr')} />
                                    </div>
                                </div>
                            </div>
                            <br /><br />
                            <div className="row">
                                <div className="col-sm-4">
                                    <h4>Curva de Aprendizaje</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="curvaaprendizaje"><img src={grafica5} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="curvaaprendizaje" checked={selectedCheck === 'curvaaprendizaje'} onChange={() => handleOptionChange('curvaaprendizaje')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Curva de Validación</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="curvavalidacion"><img src={grafica3} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="curvavalidacion" checked={selectedCheck === 'curvavalidacion'} onChange={() => handleOptionChange('curvavalidacion')} />
                                    </div>
                                </div>
                            </div>
                            <br /><br />
                            <button className="btn btn-primary" disabled={disabled2} onClick={handleContinue2}>Continuar</button>
                        </div>
                    )}
                    <br />
                    {showThirdStep && selectedCheck === 'matrizconfusion' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 4: Establece los parámetros</h2>
                            <MatrizConfusion titulo={titulo} setTitulo={setTitulo} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'curvaroc' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 4: Establece los parámetros</h2>
                            <CurvaRoc titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'curvapr' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 4: Establece los parámetros</h2>
                            <CurvaPr titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'curvaaprendizaje' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 4: Establece los parámetros</h2>
                            <CurvaAprendizaje titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'curvavalidacion' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 4: Establece los parámetros</h2>
                            <CurvaValidacion titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default VisualizacionResultados;