import React from 'react';
import logo from "../images/logo.png";


const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 fixed-bottom">
            <div className="container">
                <p className="mb-0"><img src={logo} alt="logo" style={{ width: '2%' }}/> © 2024 CogniDash</p>
            </div>
        </footer>
    );
};

export default Footer;