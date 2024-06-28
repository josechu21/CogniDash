import React, { useState, useEffect } from "react";

import Loader from "./Loader";

import Countplot from './Graficas/Countplot';
import Histplot from './Graficas/Histplot';
import Boxplot from './Graficas/Boxplot';
import Scatterplot from './Graficas/Scatterplot';
import Heatmap from './Graficas/Heatmap';
import grafica1 from '../images/grafica1.png';
import grafica2 from '../images/grafica2.png';
import grafica3 from '../images/grafica3.png';
import grafica5 from '../images/grafica5.png';
import grafica6 from '../images/grafica6.png';

function VisualizacionDatos({msg, setMsg, alert, setAlert}) {

    const [options, setOptions] = useState({});
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedCheck, setSelectedCheck] = useState('');
    const [disabled1, setDisabled1] = useState('');
    const [disabled2, setDisabled2] = useState('');
    const [showSecondStep, setShowSecondStep] = useState(false);
    const [showThirdStep, setShowThirdStep] = useState(false);

    const [loading, setLoading] = useState(false); // Estado para controlar la carga

    const [titulo, setTitulo] = useState('');
    const [labelEjeX, setLabelEjeX] = useState('');
    const [valueEjeX, setValueEjeX] = useState('');
    const [valueHue, setValueHue] = useState('');
    const [labelEjeY, setLabelEjeY] = useState('');
    const [valueEjeY, setValueEjeY] = useState('');
    const [estilo, setEstilo] = useState('ticks');
    const [tema, setTema] = useState('Pastel1');

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
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setDisabled1(false);
    };

    const handleContinue1 = () => {
        setDisabled1(true);
        setShowSecondStep(true);
    }

    const handleContinue2 = () => {
        setDisabled2(true);
        setShowThirdStep(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true); // Activar el loader al enviar el formulario

        const formData = new FormData();
        formData.append('fileId', selectedOption);
        formData.append('tipoGrafica', selectedCheck);
        formData.append('titulo', titulo);
        formData.append('labelEjeX', labelEjeX);
        formData.append('valueEjeX', valueEjeX);
        formData.append('labelEjeY', labelEjeY);
        formData.append('valueEjeY', valueEjeY);
        formData.append('valueHue', valueHue);
        formData.append('estilo', estilo);
        formData.append('tema', tema);

        fetch('/cognidash/api/generaGraficaVisualizacion', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                console.log('¡Gráfica generada con éxito!');
                window.location.href = '/cognidash/dashboard';
            } else {
                response.text().then(data => {
                    setAlert('alert alert-danger mt-3');
                    setMsg('Error al generar gráfico. ' + data);
                    setLoading(false);
                });
            }
        }
        ).catch(error => console.error('Error de red:', error));

    }

    return (
        <div>
            <hr className="separator" />
            <h2>Visualización de datos del conjunto</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div className='container mt-5'>
                    <div id="primerPaso">
                        <h2>Paso 1: Origen de datos</h2>
                        <br />
                        <select value={selectedOption} onChange={handleSelectChange} id='selectDatos'>
                            {Object.entries(options).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                        <br /><br />
                        <button className="btn btn-primary" disabled={disabled1} onClick={handleContinue1}>Continuar</button>
                    </div>
                    <br />
                    {showSecondStep && (
                        <div id="segundoPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 2: Selecciona una gráfica</h2>
                            <br />
                            <div className="row">
                                <div className="col-sm-4">
                                    <h4>Countplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="countplot"><img src={grafica1} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="countplot" checked={selectedCheck === 'countplot'} onChange={() => handleOptionChange('countplot')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Barplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="histplot"><img src={grafica2} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="histplot" checked={selectedCheck === 'histplot'} onChange={() => handleOptionChange('histplot')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Boxplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="boxplot"><img src={grafica3} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="boxplot" checked={selectedCheck === 'boxplot'} onChange={() => handleOptionChange('boxplot')} />
                                    </div>
                                </div>
                            </div>
                            <br /><br />
                            <div className="row">
                                <div className="col-sm-4">
                                    <h4>Scatterplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="scatterplot"><img src={grafica5} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="scatterplot" checked={selectedCheck === 'scatterplot'} onChange={() => handleOptionChange('scatterplot')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Heatmap</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="heatmap"><img src={grafica6} alt='img' style={{ width: '50%' }} /></label>
                                        <input className="form-check-input" type="radio" id="heatmap" checked={selectedCheck === 'heatmap'} onChange={() => handleOptionChange('heatmap')} />
                                    </div>
                                </div>
                            </div>
                            <br /><br />
                            <button className="btn btn-primary" disabled={disabled2} onClick={handleContinue2}>Continuar</button>
                        </div>
                    )}
                    <br />
                    {showThirdStep && selectedCheck === 'countplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 3: Parámetros</h2>
                            <Countplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} valueEjeX={valueEjeX} setValueEjeX={setValueEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} valueEjeY={valueEjeY} setValueEjeY={setValueEjeY} valueHue={valueHue} setValueHue={setValueHue} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'histplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 3: Parámetros</h2>
                            <Histplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} valueEjeX={valueEjeX} setValueEjeX={setValueEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} valueEjeY={valueEjeY} setValueEjeY={setValueEjeY} valueHue={valueHue} setValueHue={setValueHue} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'boxplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 3: Parámetros</h2>
                            <Boxplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} valueEjeX={valueEjeX} setValueEjeX={setValueEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} valueEjeY={valueEjeY} setValueEjeY={setValueEjeY} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'scatterplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 3: Parámetros</h2>
                            <Scatterplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} valueEjeX={valueEjeX} setValueEjeX={setValueEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY} valueEjeY={valueEjeY} setValueEjeY={setValueEjeY} valueHue={valueHue} setValueHue={setValueHue} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}

                    {showThirdStep && selectedCheck === 'heatmap' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Paso 3:Parámetros</h2>
                            <Heatmap titulo={titulo} setTitulo={setTitulo} estilo={estilo} setEstilo={setEstilo} tema={tema} setTema={setTema} />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default VisualizacionDatos;