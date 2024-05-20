from flask import Flask, request, send_file
from werkzeug.utils import secure_filename

import os, shutil, atexit, json, io, warnings, pandas as pd, numpy as np, seaborn as sns, matplotlib.pyplot as plt, mysql.connector

warnings.filterwarnings('ignore')

################################################
# Conexión a la base de datos MySQL
################################################

mydb = mysql.connector.connect(
    host="localhost",
    port="3306",
    user="admin1",
    password="admin1",
    database="cognidash"
)

db = mydb.cursor()

################################################
# Configuración de la aplicación Flask
################################################

app = Flask(__name__)


# Extensiones de archivo permitidas
ALLOWED_EXTENSIONS = {'csv'}

# Diccionario para almacenar los archivos cargados
UPLOADED_FILES = {}

# Diccionario para almacenar las gráficas generadas
GENERATED_GRAPHICS = {}

# Diccionario para almacenar el usuario logueado
USUARIO_LOGIN = {}

# Directorios temporales para almacenar los archivos cargados y las gráficas generadas
parent_directory = os.path.dirname(os.getcwd())
UPLOAD_FOLDER = os.path.join(parent_directory, 'uploads')
CSV_FOLDER = os.path.join(parent_directory, 'uploads', 'csv')
GRAPHICS_FOLDER = os.path.join('C:\\Users\\joser\\Desktop\\TFG\\CogniDash\\client\\public\\', 'graphics')

upload_temp_dir = os.path.join(app.instance_path, UPLOAD_FOLDER)
csv_temp_dir = os.path.join(app.instance_path, CSV_FOLDER)
graphics_temp_dir = os.path.join(app.instance_path, GRAPHICS_FOLDER)

################################################
# Funciones de inicialización y configuración
################################################

def init():
    createTempDirs()

def createTempDirs():
    os.makedirs(upload_temp_dir, exist_ok=True)
    os.makedirs(csv_temp_dir, exist_ok=True)
    os.makedirs(graphics_temp_dir, exist_ok=True)

init()

################################################
# Funciones de utilidad
################################################

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cleanup_temp_folder(exception=None):
    # Eliminar la carpeta temporal al finalizar el servidor
    if os.path.exists(os.path.join(app.instance_path, UPLOAD_FOLDER)):
        shutil.rmtree(os.path.abspath(os.path.join(app.instance_path, UPLOAD_FOLDER)))

    if os.path.exists(os.path.join(GRAPHICS_FOLDER)):
        shutil.rmtree(GRAPHICS_FOLDER)
        
        print("Carpetas temporales eliminadas")

################################################
# Rutas de la API
################################################


# URL de inicio de sesión
@app.route('/login', methods=['POST'])
def login():
    # Obtener las credenciales del cuerpo de la solicitud POST
    email = request.form['email']
    password = request.form['password']

    # Realizar una consulta en la base de datos para verificar las credenciales
    db.execute(f"SELECT * FROM users WHERE email like '%{email}%' AND password like '%{password}%' AND fec_baja is null")
    user = db.fetchone()  # Obtener el primer usuario que coincida con las credenciales

    USUARIO_LOGIN['usuario'] = user[1]

    if user:
        return 'Login exitoso', 200  # Si las credenciales son válidas, devuelve un mensaje de éxito
    else:
        return 'Credenciales incorrectas', 400  # Si las credenciales no son válidas, devuelve un mensaje de error
    
# URL de obtención de usuario
@app.route('/usuario', methods=['GET'])
def get_usuario():
    return USUARIO_LOGIN, 200

# URL de cierre de sesión
@app.route('/logout', methods=['GET'])
def logout():
    USUARIO_LOGIN.clear()
    GENERATED_GRAPHICS.clear()
    return 'Logout exitoso', 200

# URL para validar los datos de archivos cargados
@app.route('/validar', methods=['POST'])
def preview_file():
    # Obtener el nombre del archivo seleccionado
    file = request.files['file']
    fileName = file.filename

    # Leer el archivo CSV seleccionado
    df = pd.read_csv(UPLOADED_FILES[fileName])

    # Obtener los registros con al menos un campo nulo
    null_records = df[df.isnull().any(axis=1)]

    # Convertir los registros a formato JSON
    json_data = null_records.to_json(orient='records')

    # Devolver el JSON como respuesta HTTP
    return json_data, 200

# URL de visualización de datos de archivo cargado
@app.route('/verDataset', methods=['POST'])
def view_dataset():
    #Recibe el nombre del archivo seleccionado
    fileName = request.form['fileName']
    print(fileName)

    #Leer el archivo CSV seleccionado
    df = pd.read_csv(UPLOADED_FILES[fileName])

    #Convertir el DataFrame a JSON
    json_data = df.to_json(orient='records')

    #Devolver el JSON como respuesta HTTP
    return json_data, 200

# URL de eliminación de archivo cargado
@app.route('/eliminaArchivo', methods=['POST'])
def eliminaArchivo():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Eliminar el archivo del diccionario
    del UPLOADED_FILES[filename]

    # Eliminar el archivo del sistema de archivos
    os.remove(os.path.join(CSV_FOLDER, filename))

    # Devuelve un mensaje de éxito
    return 'Archivo eliminado correctamente', 200

# URL de carga de archivos
@app.route('/upload', methods=['POST'])
def upload_file():
    # Comprobar si se recibió un archivo en la solicitud
    if 'file' not in request.files:
        return 'No se recibió ningún archivo', 400
    
    file = request.files['file']
    
    # Comprobar si el archivo tiene el formato permitido
    if file and allowed_file(file.filename):
        # Aquí puedes guardar el archivo o hacer lo que necesites con él
        
        # Por ejemplo, guardar el archivo en el sistema de archivos
        file.save(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

        UPLOADED_FILES[file.filename] = os.path.join(CSV_FOLDER, secure_filename(file.filename))

        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

        # Convert the DataFrame to JSON
        json_data = df.to_json(orient='records')
        
        return json_data, 200
    else:
        return 'Formato de archivo no permitido', 400

# URL de listado de archivos cargados
@app.route('/files', methods=['GET'])
def get_files():
    options = list(UPLOADED_FILES.keys())

    # Devuelve el JSON como respuesta HTTP
    return {'options': options}, 200

# URL de obtención de gráficas generadas
@app.route('/graficas', methods=['GET'])
def get_graphics():
    # Devuelve el JSON como respuesta HTTP
    return GENERATED_GRAPHICS, 200

# URL de eliminación de gráfica generada
@app.route('/eliminaGrafica', methods=['POST'])
def eliminaGrafica():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Eliminar la gráfica del diccionario
    del GENERATED_GRAPHICS[filename]

    # Eliminar el archivo del sistema de archivos
    os.remove(os.path.join(GRAPHICS_FOLDER, filename))

    # Devuelve un mensaje de éxito
    return 'Gráfica eliminada correctamente', 200

# URL de descarga de grafica generada
@app.route('/descargaGrafica', methods=['POST'])
def download_graphic():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Devolver el archivo como respuesta HTTP
    return send_file(os.path.join(GRAPHICS_FOLDER, filename), as_attachment=True)

# URL de generación de gráfica
@app.route('/generaGrafica', methods=['POST'])
def generaGrafica():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']
    # Obtener el tipo de gráfica seleccionado
    tipoGrafica = request.form['tipoGrafica']
    # Obtener el título de la gráfica
    titulo = request.form['titulo']
    # Obtener la etiqueta del eje X
    labelX = request.form['labelEjeX']
    # Obtener campo de X
    valueEjeX = request.form['valueEjeX']
    # Obtener la etiqueta del eje Y
    labelY = request.form['labelEjeY']
    # Obtener campo de Y
    valueEjeY = request.form['valueEjeY']
    # Obtener HUE (variable categórica de agrupación)
    valueHue = request.form['valueHue']

    # leer el archivo CSV seleccionado
    df = pd.read_csv(UPLOADED_FILES[filename])

    #######Esto es omisible######
    #df.rename(columns={'Group': 'DEMENTIA'}, inplace=True)
    #df.rename(columns={'M/F': 'Sex'}, inplace=True)
    df.drop(columns=['MRI ID', 'Subject ID'], inplace=True)

    df.drop(columns=['Hand'], inplace=True)

    df.SES.fillna(0, inplace=True)
    df.MMSE.fillna(df.MMSE.mean(), inplace=True)

    custom_params = {"axes.spines.right": False, "axes.spines.top": False}
    sns.set_theme(style="ticks", rc=custom_params, palette="bright")
    plt.figure(figsize=(9, 7))

    if tipoGrafica == 'countplot':
        if valueEjeX and not valueEjeY:
            if valueHue:
                sns.countplot(data=df, x=valueEjeX, hue=valueHue)
            else:
                sns.countplot(data=df, x=valueEjeX)

        elif valueEjeY and not valueEjeX:
            if valueHue:
                sns.countplot(data=df, y=valueEjeY, hue=valueHue)
            else:
                sns.countplot(data=df, y=valueEjeY)
        
        plt.title(titulo, size = 20, weight='bold')
        if labelX:
            plt.xlabel(labelX)
        if labelY:
            plt.ylabel(labelY)
    
    elif tipoGrafica == 'histplot':
        if valueEjeX and not valueEjeY:
            if valueHue:
                sns.histplot(data=df, x=valueEjeX, binwidth=5, kde=True, hue=valueHue)
            else:
                sns.histplot(data=df, x=valueEjeX, binwidth=5, kde=True)
        elif valueEjeY and not valueEjeX:
            if valueHue:
                sns.histplot(data=df, y=valueEjeY, binwidth=5, kde=True, hue=valueHue)
            else:
                sns.histplot(data=df, y=valueEjeY, binwidth=5, kde=True)

        plt.title(titulo, size = 20, weight='bold')
        if labelX:
            plt.xlabel(labelX)
        if labelY:
            plt.ylabel(labelY)

    elif tipoGrafica == 'scatterplot':
        if valueEjeX and valueEjeY:
            if valueHue:
                sns.scatterplot(data=df, x=valueEjeX, y=valueEjeY, hue=valueHue, alpha=0.7)
            else:
                sns.scatterplot(data=df, x=valueEjeX, y=valueEjeY, alpha=0.7)
            plt.title(titulo, size = 20, weight='bold')
            if labelX:
                plt.xlabel(labelX)
            if labelY:
                plt.ylabel(labelY)
        else:
            return 'Debe seleccionar un campo para el eje X y otro para el eje Y', 400

    elif tipoGrafica == 'heatmap':
        df.drop(columns=['Group'], inplace=True)
        df.drop(columns=['MRI ID', 'Subject ID'], inplace=True)
        df.drop(columns=['M/F'], inplace=True)
        df.drop(columns=['Hand'], inplace=True)
        sns.heatmap(df.corr(), annot=True, fmt=".2f", linewidths=0.7, cbar=True, cmap='RdBu')
        plt.title(titulo, size = 20, weight='bold')

    elif tipoGrafica == 'boxplot':
        if valueEjeX and valueEjeY:
            sns.boxplot(data=df, x=valueEjeX, y=valueEjeY, showfliers=False)
        elif valueEjeX and not valueEjeY:
            sns.boxplot(data=df, x=valueEjeX, showfliers=False)
        elif valueEjeY and not valueEjeX:
            sns.boxplot(data=df, y=valueEjeY, showfliers=False)

        plt.title(titulo, size = 20, weight='bold')
        if labelX:
            plt.xlabel(labelX)
        if labelY:
            plt.ylabel(labelY)

    if tipoGrafica not in ['countplot', 'histplot', 'scatterplot', 'heatmap', 'boxplot']:
        return 'Tipo de gráfica no válido', 400
    else:
        # numero de elementos del array generated_graphics
        num = len(GENERATED_GRAPHICS)

        #Guardar la gráfica en un archivo
        filename = f'{tipoGrafica}_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_GRAPHICS[filename] = os.path.join('graphics', filename)

        return 'Gráfica generada exitosamente', 200

# Añadimos al registro la función de eliminación de carpetas temporales
atexit.register(cleanup_temp_folder)

if __name__ == '__main__':
    app.run(debug=True)