import React from 'react';
import '../style/loader.css';
import logo from '../images/logo.png';

function Loader() {
    return (
        <div className="loader-container">
            <img src={logo} alt="Logo" className="loader" />
            <br/>
            <h1>Cargando...</h1>
        </div>
    );
}

export default Loader;