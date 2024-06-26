import React from "react";
import { useState } from "react";
import '../style/footer.css';
import Footer from "./Footer";

function NuevaCuenta() {
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMsg('Las contraseñas no coinciden');
            return;
        }
        if (!acceptTerms) {
            setMsg('Debe aceptar la política de privacidad');
            return;
        }
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('username', username);

        if(password !== confirmPassword){
            setMsg("Las contraseñas no coinciden")
        } else if (!acceptTerms){
            setMsg("Debe aceptar la política de privacidad")
        } else {
            setMsg("")
            fetch('/cognidash/api/nueva-cuenta', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    response.text().then(data => {
                        if (data === 'success') {
                            window.location.href = '/cognidash/inicioSesion';
                        } else {
                            setMsg(data);
                        }
                    });
                }
            });
        }
    }

    return (
        <div>
            <div className="footer-container2">
                <section className="vh-100 login-custom">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col col-xl-10">
                                <div className="card" style={{ borderRadius: '1rem' }}>
                                    <div className="row g-0">
                                        <div className="col-md-6 col-lg-12 d-flex align-items-center">
                                            <div className="card-body p-4 p-lg-6 text-white bg-dark" style={{ borderRadius: '1rem' }}>
                                                <div className="text-center">
                                                    <h1>CogniDash</h1>
                                                    <p className="text-white my-4">Complete los campos del formulario para recibir su usuario.</p>
                                                    <hr className="my-4" />
                                                </div>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="username">Nombre de usuario</label>
                                                        <input type="text" id="username" className="form-control form-control-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="email">Correo electrónico</label>
                                                        <input type="email" id="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="password">Contraseña</label>
                                                        <input type="password" id="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                    </div>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="confirmPassword">Confirmar contraseña</label>
                                                        <input type="password" id="confirmPassword" className="form-control form-control-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                                    </div>
                                                    <div className="form-check mb-4">
                                                        <input className="form-check-input " type="checkbox" value={acceptTerms} id="acceptTerms" onChange={(e) => setAcceptTerms(e.target.checked)} required />
                                                        <label className="form-check-label text-white" htmlFor="acceptTerms">
                                                            Acepto la <a href="/politica-privacidad" className="text-warning">política de privacidad</a>
                                                        </label>
                                                    </div>
                                                    <div className="pt-1 mb-4">
                                                        <button className="btn btn-warning btn-lg btn-block" type="submit">Crear cuenta</button>
                                                    </div>
                                                    <hr className="my-4" />
                                                    <p className="mb-5 pb-lg-2 text-white" style={{ color: '#393f81' }}>¿Ya tiene una cuenta? <a href="/cognidash/inicioSesion" style={{ color: '#393f81' }}>Inicie sesión aquí</a></p>
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
        </div>
    );
}

export default NuevaCuenta;