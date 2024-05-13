import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
import Countplot from './Graficas/Countplot';
import Histplot from './Graficas/Histplot';
import Boxplot from './Graficas/Boxplot';
import Scatterplot from './Graficas/Scatterplot';
import Heatmap from './Graficas/Heatmap';
import '../style/footer.css';
import grafica1 from '../images/grafica1.png';
import grafica2 from '../images/grafica2.png';
import grafica3 from '../images/grafica3.png';
import grafica5 from '../images/grafica5.png';
import grafica6 from '../images/grafica6.png';

const Grafica = () => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedCheck, setSelectedCheck] = useState('');
    const [disabled1, setDisabled1] = useState('');
    const [disabled2, setDisabled2] = useState('');
    const [showSecondStep, setShowSecondStep] = useState(false);
    const [showThirdStep, setShowThirdStep] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [labelEjeX, setLabelEjeX] = useState('');
    const [labelEjeY, setLabelEjeY] = useState('');

    useEffect(() => {
        fetch('/files')
            .then(response => response.json())
            .then(data => {
                setOptions(data);
                setSelectedOption(data.options[0]); // Establecer la primera opción como seleccionada por defecto
            })
            .catch(error => console.error('Error al obtener las opciones:', error));
    }, []);

    const handleOptionChange = (option) => {
        setSelectedCheck(option);
    };

    const handleSelectChange = (option) => {
        setSelectedOption(option);
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

        const formData = new FormData();
        formData.append('fileName', selectedOption);
        formData.append('tipoGrafica', selectedCheck);
        formData.append('titulo', titulo);
        formData.append('labelEjeX', labelEjeX);
        formData.append('labelEjeY', labelEjeY);

        fetch('/generaGrafica', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                console.log('¡Gráfica generada con éxito!');
                window.location.href = '/dashboard';
            } else {
                console.error('Error al generar la gráfica.');
            }
        }
        ).catch(error => console.error('Error de red:', error));
        
    }

    return (
        <div>
            <div className="footer-container">
            <Navbar/>
            <form className='form' onSubmit={handleSubmit}>
                <div className='container mt-5'>
                    <div id="primerPaso">
                        <h2>Origen de datos</h2>
                        <br/>
                        <select value={selectedOption} onChange={handleSelectChange} id='selectDatos'>
                            {Object.entries(options).map(([key, value]) => (
                                <option key={key} value={value}>{value}</option>
                            ))}
                        </select>
                        <br/><br/>
                        <button className="btn btn-primary" disabled={disabled1} onClick={handleContinue1}>Continuar</button>
                    </div>
                    <br/>
                    {showSecondStep && (
                        <div id="segundoPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Gráfica</h2>
                            <br/>
                            <div className="row">
                                <div className="col-sm-4">
                                    <h4>Countplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="countplot"><img src={grafica1} alt='img' style={{ width: '50%' }}/></label>
                                        <input className="form-check-input" type="radio" id="countplot" checked={selectedCheck === 'countplot'} onChange={() => handleOptionChange('countplot')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Barplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="histplot"><img src={grafica2} alt='img' style={{ width: '50%' }}/></label>
                                        <input className="form-check-input" type="radio" id="histplot" checked={selectedCheck === 'histplot'} onChange={() => handleOptionChange('histplot')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Boxplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="boxplot"><img src={grafica3} alt='img' style={{ width: '50%' }}/></label>
                                        <input className="form-check-input" type="radio" id="boxplot" checked={selectedCheck === 'boxplot'} onChange={() => handleOptionChange('boxplot')} />
                                    </div>
                                </div>
                            </div>
                            <br/><br/>
                            <div className="row">
                                <div className="col-sm-4">
                                    <h4>Scatterplot</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="scatterplot"><img src={grafica5} alt='img' style={{ width: '50%' }}/></label>
                                        <input className="form-check-input" type="radio" id="scatterplot" checked={selectedCheck === 'scatterplot'} onChange={() => handleOptionChange('scatterplot')} />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <h4>Heatmap</h4>
                                    <div className="mb-3">
                                        <label className="form-check-label" htmlFor="heatmap"><img src={grafica6} alt='img' style={{ width: '50%' }}/></label>
                                        <input className="form-check-input" type="radio" id="heatmap" checked={selectedCheck === 'heatmap'} onChange={() => handleOptionChange('heatmap')} />
                                    </div>
                                </div>
                            </div>
                            <br/><br/>
                            <button className="btn btn-primary" disabled={disabled2} onClick={handleContinue2}>Continuar</button>
                        </div>
                    )}
                    <br/>
                    {showThirdStep && selectedCheck === 'countplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Parámetros</h2>
                            <Countplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY}/>
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'histplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Parámetros</h2>
                            <Histplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY}/>
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'boxplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Parámetros</h2>
                            <Boxplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY}/>
                        </div>
                    )}
                    {showThirdStep && selectedCheck === 'scatterplot' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Parámetros</h2>
                            <Scatterplot titulo={titulo} setTitulo={setTitulo} labelEjeX={labelEjeX} setLabelEjeX={setLabelEjeX} labelEjeY={labelEjeY} setLabelEjeY={setLabelEjeY}/>
                        </div>
                    )}

                    {showThirdStep && selectedCheck === 'heatmap' && (
                        <div id="tercerPaso" className='form-check'>
                            <hr className="separator" />
                            <h2>Parámetros</h2>
                            <Heatmap titulo={titulo} setTitulo={setTitulo}/>
                        </div>
                    )}
                </div>
            </form>
            </div>
            <Footer/>
        </div>
    );
};

export default Grafica;
