import React, { useState, useRef } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

function FileUploadForm() {
  const [file, setFile] = useState(null);

  const [msg, setMsg] = useState(null);

  const [alert, setAlert] = useState(null);

  const [parteDos, setParteDos] = useState(false);
  const [btn1Disable, setBtn1Disable] = useState(false);

  const [parteTres, setParteTres] = useState(false);
  const [btn2Disable, setBtn2Disable] = useState(false);
  const [paso3Load, setPaso3Load] = useState(false);

  const handlePaso2 = () => {
    setParteTres(true);
    setBtn2Disable(true);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const [nullData, setNullData] = useState([{}]);

  const handlePaso3 = () => {
    console.log('Validando datos...');
    const formData = new FormData();
    formData.append('file', file);

    fetch('/validar', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        console.log('¡Datos validados con éxito!');
        setAlert('alert alert-success mt-3');
        setMsg('¡Datos validados con éxito!');
        response.json().then(data => {
          setNullData(data);
          setPaso3Load(true);
        });
      } else {
        console.error('Error al validar los datos.');
        setAlert('alert alert-danger mt-3');
        setMsg('Error al validar los datos.');
      }
    })
  };

  const [data, setData] = useState([{}]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleContinuar = () => {
    window.location.reload();
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
            response.json().then(data => {
              setData(data);
              setParteDos(true);
              setBtn1Disable(true);
              window.scrollTo(0, document.body.scrollHeight);
            });
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
      <div className="footer-container">
        <NavBar />
        <div className='container mt-5'>
          <h2 className="mb-4">Carga de Archivos de datos</h2>
          <div id='first'>
            <h4>Paso 1: Sube tu archivo de datos.</h4>
            <form onSubmit={handleSubmit} ref={formRef} encType='multipart/form-data'>
                <div className="mb-3">
                    <input className="form-control" type="file" onChange={handleFileChange} required/>
                </div>
                <button className="btn btn-primary" disabled={btn1Disable} type='submit'>Visualizar muestra</button>
            </form>
          </div>
          {(msg !== null) && (
              <div className={alert} role="alert">{msg}</div>
          )}
          {(parteDos) && (<div id='second'>
            <hr className="mt-5"/>
            <h4>Paso 2: Ahora visualiza si los datos son los deseados</h4>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value !== null ? value : <span style={{ color: 'blue' }}>NULL</span>}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-primary" disabled={btn2Disable} onClick={handlePaso2}>Continuar</button>
          </div>
        )}
        {(parteTres) && (
        <div id='third'>
            <hr className="mt-5"/>
            <h4>Paso 3: Realiza una validación de los datos del archivo</h4>
            <br/>
            <button className='btn btn-primary' disabled={paso3Load} onClick={handlePaso3}>Validar datos</button>
            <br/>
            <br/>
            <p>Puedes visualizar todos los que están en estado erróneo</p>
            {(nullData.length > 0) && (paso3Load) && (
              <div>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key, index) => (
                        <th key={index}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nullData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, index) => (
                          <td key={index}>{value !== null ? value : <span style={{ color: 'red' }}>NULL</span>}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(nullData.length === 0) && (paso3Load) && (
              <div>
                <div className='alert alert-success mt-3' role='alert'>¿El archivo de datos es correcto!</div>
                <button className='btn btn-primary' onClick={handleContinuar}>Continuar</button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FileUploadForm;