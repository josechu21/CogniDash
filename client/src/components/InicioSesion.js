import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";
import logo from '../images/logo.png';
import '../style/login.css';

function InicioSesion() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes añadir la lógica para enviar los datos del formulario
        console.log('Email:', email);
        console.log('Password:', password);
        
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        fetch('/login', {
            method: 'POST',
            body: formData,
        }).then(response => {
                if (response.ok) {
                    console.log('¡Inicio de sesión exitoso!');
                    // Se redirige al usuario a la pagina de dashboard
                    navigate('/dashboard');
                } else {
                    console.error('Error al iniciar sesión.');
                    setMsg('Usuario o contraseña incorrectos. Vuelva a intentarlo.');
                }
            })
            .catch(error => console.error('Error de red:', error));
    };

    return (
        <div>
            <section className="vh-100 login-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card" style={{ borderRadius: '1rem' }}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                                        <h1>CogniDash</h1>
                                        <p className="text-black my-4">Bienvenido a CogniDash, una plataforma de visualización de datos.</p>
                                        <img src={logo} alt="login form" className="img-fluid" style={{ borderRadius: '1rem 0 0 1rem', width: '75%' }} />
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-white bg-dark" style={{ borderRadius: '0 1rem 1rem 0' }}>
                                            <form onSubmit={handleSubmit}>
                                                <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Inicie sesión en su cuenta</h5>
                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="email">Correo electrónico</label>
                                                    <input type="email" id="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <label className="form-label" htmlFor="password">Contraseña</label>
                                                    <input type="password" id="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                                </div>
                                                <div className="pt-1 mb-4">
                                                    <button className="btn btn-warning btn-lg btn-block" type="submit">Iniciar sesión</button>
                                                </div>
                                                <a className="small text-white" href="#!">¿Has olvidado tu contraseña?</a>
                                                <hr className="my-4" />
                                                <p className="mb-5 pb-lg-2 text-white" style={{ color: '#393f81' }}>¿Aún no tiene una cuenta? <a href="/nueva-cuenta" style={{ color: '#393f81' }}>Solicite una aquí</a></p>
                                            </form>
                                            <div className="alert alert-danger" role="alert" style={{ display: msg ? 'block' : 'none' }}>
                                                <span>{msg}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default InicioSesion;