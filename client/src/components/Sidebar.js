import React, { useState, useEffect, useRef } from 'react';
import '../style/menuLateral.css';
import logo from '../images/logo.png';
import { NavLink } from 'react-router-dom';

const SideMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sideMenuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`side-menu ${isOpen ? 'open' : ''}`} ref={sideMenuRef}>
            <button className="toggle-btn" onClick={toggleMenu}>
                {isOpen ? 'Cerrar' : 'Abrir'}
            </button>
            <ul className="menu-items">
                <li>
                    <p className="bg-white text-black text-center mb-0"><img src={logo} alt="logo" style={{ width: '25%' }}/> CogniDash</p>
                </li>
                <br/>
                <li>
                    <NavLink to="/subir-archivo"><button className='btn btn-primary btn-rounded'>Subir archivo</button></NavLink>
                </li>
                <br/>
                <li>
                    <NavLink to="/nueva-grafica"><button className='btn btn-primary btn-rounded'>Añadir gráfica</button></NavLink>
                </li>
            </ul>
        </div>
    );
};

export default SideMenu;
