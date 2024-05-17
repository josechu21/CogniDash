import React, { useState, useRef } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function FileUploadForm() {
  const [file, setFile] = useState(null);

  const [msg, setMsg] = useState(null);

  const [alert, setAlert] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // Aquí puedes enviar formData al servidor usando fetch o alguna biblioteca de HTTP
      fetch('/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (response.ok) {
            setAlert('alert alert-success mt-3');
            setMsg('¡Archivo enviado con éxito!');
            console.log('¡Archivo enviado con éxito!');
            formRef.current.reset();
            formRef.current.querySelector('input[type="file"]').value = "";
        } else {
          console.error('Error al enviar el archivo.');
          setAlert('alert alert-danger mt-3');
          setMsg('Error al enviar el archivo.');
        }
      })
      .catch(error => {
        console.error('Error de red:', error)
        setAlert('alert alert-danger mt-3');
        setMsg('Error de red. ' + error);
      });
    } else {
      setAlert('alert alert-danger mt-3');
      setMsg('Debes seleccionar un archivo antes de enviarlo.');
      console.error('Debes seleccionar un archivo antes de enviarlo.');
    }

  };

  return (
    <div>
      <NavBar />
      <div className='container mt-5'>
        <h2 className="mb-4">Carga de Archivos de datos</h2>
        <form onSubmit={handleSubmit} ref={formRef} encType='multipart/form-data'>
            <div className="mb-3">
                <input className="form-control" type="file" onChange={handleFileChange} required/>
            </div>
            <button className="btn btn-primary" type="submit">Enviar Archivo</button>
        </form>
        {(msg !== null) && (
            <div className={alert} role="alert">{msg}</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FileUploadForm;