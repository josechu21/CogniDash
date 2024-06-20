import React, { useState, useEffect, useRef } from 'react';
import '../style/menuLateral.css';
import logo from '../images/logo.png';
import btnabrir from '../images/btnabrir.png';
import btncerrar from '../images/btncerrar.png';
import { NavLink } from 'react-router-dom';
import usuario from '../images/usuario.png';
import uploadLogo from '../images/upload.png';
import agregarLogo from '../images/agregar.png';

const SideMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sideMenuRef = useRef(null);
    const [nombreUsuario, setNombreUsuario] = useState(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        fetch('/cognidash/api/usuario')
            .then(response => response.json())
            .then(data => {
                setNombreUsuario(data.usuario);
            })
            .catch(error => console.error('Error al obtener el nombre del usuario:', error));
    }, []);

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

    const handleLogout = () => {
        fetch('/cognidash/api/logout')
            .then(response => {
                if (response.ok) {
                    window.location.href = '/cognidash';
                } else {
                    console.error('Error al cerrar sesión.');
                }
            })
            .catch(error => console.error('Error de red:', error));
    };

    return (
        <div className={`side-menu ${isOpen ? 'open' : ''}`} ref={sideMenuRef}>
            <button className="toggle-btn" onClick={toggleMenu}>
                {isOpen ? <img src={btncerrar} alt='cerrarmenu'/> : <img src={btnabrir} alt='abrirmenu'/>}
            </button>
            <ul className="menu-items">
                <li>
                    <p className="bg-white text-black text-center mb-0"><img src={logo} alt="logo" style={{ width: '25%' }}/> CogniDash</p>
                </li>
                <br/>
                <li>
                    <img src={usuario} alt="imgUsuario" style={{ width: '35%' }}/>
                </li>
                <li>
                    <h4 className="text-white text-center">{nombreUsuario}</h4>
                </li>
                <br/>
                <li><hr className="text-white"/></li>
                <li>
                    <h3 className="text-white text-center">Menú</h3>
                </li>
                <li><hr className="text-white"/></li>
                <br/>
                <li>
                    <NavLink to="/cognidash/subir-archivo"><button className='btn btn-primary btn-rounded' style={{width: '60%'}}><span><img src={uploadLogo} alt='logo' style={{width: '15%'}}/> Subir archivo</span></button></NavLink>
                </li>
                <br/>
                <li>
                    <NavLink to="/cognidash/nueva-grafica"><button className='btn btn-primary btn-rounded' style={{width: '60%'}}><span><img src={agregarLogo} alt='logo' style={{width: '15%'}}/> Añadir gráfica</span></button></NavLink>
                </li>
                <li style={{position: 'relative', top: '365px'}}>
                    <button className='btn btn-danger btn-rounded' onClick={handleLogout}>Cerrar sesión</button>
                </li>
            </ul>
        </div>
    );
};

export default SideMenu;
