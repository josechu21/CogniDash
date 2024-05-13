import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "./Footer";

function InicioSesion() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                }
            })
            .catch(error => console.error('Error de red:', error));
    };

    return (
        <div>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                                <div className="card-body p-5 text-center">
                                    <div className="mb-md-5 mt-md-4 pb-5">
                                        <form onSubmit={handleSubmit}>
                                            <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                            <p className="text-white-50 mb-5">Por favor, introduce tus credenciales para el inicio de sesión</p>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typeEmailX">Email</label>
                                                <input type="email" id="typeEmailX" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <label className="form-label" htmlFor="typePasswordX">Contraseña</label>
                                                <input type="password" id="typePasswordX" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            </div>

                                            <button className="btn btn-outline-light btn-lg px-5" type="submit">Entrar</button>
                                        </form>
                                    </div>
                                    <div>
                                        <p className="mb-0">Aún no tienes una? <a href="#!" className="text-white-50 fw-bold">Solicitar cuenta</a></p>
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