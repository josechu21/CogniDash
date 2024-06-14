# CogniDash

CogniDash es una plataforma innovadora de tipo DashBoard, diseñada para facilitar el análisis y la visualización de datos relacionados con la salud cognitiva. 
Con un enfoque en la accesibilidad y la facilidad de uso, ofrece a los usuarios la capacidad de explorar y comprender diferentes resultados sobre datos cognitivos a partir de su.

## Manual para su creación y utilización
1. Ir a carpeta C:/Users/_usuario_/Documentos y crear una carpeta con el nombre del proyecto

2. Click derecho sobre la carpeta creada y abrir con VSCODE

3. Abrir nueva terminal en VSCODE y seleccionar una terminal con GitBash.

4. Creando el servidor con FLASK :
	- mkdir flask-server
	- cd flask-server
	- touch server.py
5. Ahora abrimos otro terminal de git para crear el cliente con react
	- npx create-react-app client
6. Abrimos terminal de powershell con permisos de administrador y ejecutamos:
	- Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
7. Vamos a vscode y abrimos terminal de powershell
	- cd flask-server
	- python -m venv <path>   -------  python -m venv venv
	- cd venv
	- .\<env_name>\Scripts\activate ---------  Scripts/activate
	- pip install Flask
	- pip install flask-mysql
	- pip install mysql-connector-python
	- pip install pandas
	- pip install seaborn
	- pip install -U scikit-learn
	- pip install imbalanced-learn
	- $env:FLASK_APP="..\server" ---- o el nombre del archivo donde se encuentra el servidor
	- flask run
8. Ahora ya podemos acceder a la url del servidor desde localhost:5000

9. En package.json introducir la siguiente línea:
	- "proxy": "http://localhost:5000",

10. Definir rutas en el servidor.

11. Entrar a carpeta 'client':
	- npm install bootstrap
	- npm install react-router-dom
	- npm install react-bootstrap

12. Finalmente arrancamos el frontend:
	- npm start
	- al cliente podremos acceder desde http://localhost:3000/
