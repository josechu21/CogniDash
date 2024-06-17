from flask import Flask, request, send_file
from werkzeug.utils import secure_filename
import matplotlib

matplotlib.use('Agg')

import os, shutil, atexit, json, io, warnings, pandas as pd, numpy as np, seaborn as sns, matplotlib.pyplot as plt, mysql.connector

from sklearn.metrics import confusion_matrix, accuracy_score, roc_curve, roc_auc_score, auc, precision_recall_curve
from sklearn.preprocessing import LabelEncoder, StandardScaler, label_binarize
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV, learning_curve, validation_curve
from imblearn.over_sampling import SMOTE
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.multiclass import OneVsRestClassifier
from itertools import cycle
from joblib import dump, load

from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas


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

UPLOADED_VALIDAR = {}

# Diccionario para almacenar las gráficas generadas
GENERATED_VIEW_GRAPHICS = {}
GENERATED_RESULT_GRAPHICS = {}

# Diccionario para almacenar el usuario logueado
USUARIO_LOGIN = {}

# Almacena los mapeos de las variables categóricas
category_mappings = {}

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

################################################################################################################################################
# URL de inicio de sesión
@app.route('/login', methods=['POST'])
def login():
    # Obtener las credenciales del cuerpo de la solicitud POST
    email = request.form['email']
    password = request.form['password']

    # Realizar una consulta en la base de datos para verificar las credenciales
    db.execute(f"SELECT * FROM users WHERE email like '%{email}%' AND password like '%{password}%' AND fec_baja is null")
    user = db.fetchone()  # Obtener el primer usuario que coincida con las credenciales

    USUARIO_LOGIN['id'] = user[0]
    USUARIO_LOGIN['usuario'] = user[1]
    USUARIO_LOGIN['email'] = user[2]
    USUARIO_LOGIN['fec_alta'] = user[4]

    if user:
        return 'Login exitoso', 200  # Si las credenciales son válidas, devuelve un mensaje de éxito
    else:
        return 'Credenciales incorrectas', 400  # Si las credenciales no son válidas, devuelve un mensaje de error

################################################################################################################################################
# URL de obtención de usuario
@app.route('/usuario', methods=['GET'])
def get_usuario():
    return USUARIO_LOGIN, 200

################################################################################################################################################
# URL de cierre de sesión
@app.route('/logout', methods=['GET'])
def logout():
    USUARIO_LOGIN.clear()
    GENERATED_VIEW_GRAPHICS.clear()
    return 'Logout exitoso', 200

################################################################################################################################################
# URL para validar los datos de archivos cargados
@app.route('/validar', methods=['POST'])
def preview_file():
    # Obtener el nombre del archivo seleccionado
    file = request.files['file']

    # Guardar el archivo en el sistema de archivos
    file.save(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

    UPLOADED_VALIDAR[file.filename] = os.path.join(CSV_FOLDER, secure_filename(file.filename))

    # Leer el archivo CSV seleccionado
    df = pd.read_csv(UPLOADED_VALIDAR[file.filename])

    # Obtener los registros con al menos un campo nulo
    null_records = df[df.isnull().any(axis=1)]

    # Convertir los registros a formato JSON
    json_data = null_records.to_json(orient='records')

    UPLOADED_VALIDAR.clear()

    # Eliminar el archivo del sistema de archivos
    os.remove(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

    # Devolver el JSON como respuesta HTTP
    return json_data, 200

################################################################################################################################################
# URL de visualización de datos de archivo cargado
@app.route('/verDataset', methods=['POST'])
def view_dataset():
    #Recibe el nombre del archivo seleccionado
    fileId = request.form['fileId']

    # Seleccionar el archivo de bbdd
    db.execute(f"SELECT * FROM datafiles WHERE id = {fileId}")
    file = db.fetchone()

    # Leer el contenido del archivo de la columna blob de bbdd
    df = pd.read_csv(io.BytesIO(file[4]))

    #Convertir el DataFrame a JSON
    json_data = df.to_json(orient='records')

    #Devolver el JSON como respuesta HTTP
    return json_data, 200

################################################################################################################################################
# URL de eliminación de archivo cargado
@app.route('/eliminaArchivo', methods=['POST'])
def eliminaArchivo():
    fileId  = request.form['fileId']

    # Eliminar el archivo de la base de datos
    db.execute(f"DELETE FROM datafiles WHERE id = {fileId}")
    mydb.commit()

    # Devuelve un mensaje de éxito
    return 'Archivo eliminado correctamente', 200

# URL de eliminación de informe cargado
@app.route('/eliminaInforme', methods=['POST'])
def eliminaInforme():
    fileId  = request.form['fileId']

    # Eliminar el archivo de la base de datos
    db.execute(f"DELETE FROM informes WHERE id = {fileId}")
    mydb.commit()

    # Devuelve un mensaje de éxito
    return 'Archivo eliminado correctamente', 200

################################################################################################################################################
# URL de visualizacion en la carga de archivo
@app.route('/visualizar', methods=['POST'])
def visualizar():
    # Comprobar si se recibió un archivo en la solicitud
    if 'file' not in request.files:
        return 'No se recibió ningún archivo', 400
    
    file = request.files['file']
    
    # Comprobar si el archivo tiene el formato permitido
    if file and allowed_file(file.filename):

        # Por ejemplo, guardar el archivo en el sistema de archivos
        file.save(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

        # Convert the DataFrame to JSON
        json_data = df.to_json(orient='records')

        # Eliminar el archivo del sistema de archivos
        os.remove(os.path.join(CSV_FOLDER, secure_filename(file.filename)))
        
        return json_data, 200
    else:
        return '¡Formato de archivo no permitido!', 400


################################################################################################################################################
# URL de carga de archivos
@app.route('/upload', methods=['POST'])
def upload_file():
    # Comprobar si se recibió un archivo en la solicitud
    if 'file' not in request.files:
        return 'No se recibió ningún archivo', 400
    
    file = request.files['file']
    
    # Comprobar si el archivo tiene el formato permitido
    if file and allowed_file(file.filename):

        # Se comprueba si el nombre del archivo ya existe en la base de datos
        db.execute(f"SELECT * FROM datafiles WHERE filename like '%{file.filename}%' AND id_usr = {USUARIO_LOGIN['id']} AND mime = 'text/csv'")
        file_exists = db.fetchone()

        if file_exists:
            return 'Ya existe un archivo subido en su cuenta con ese nombre, por favor cámbielo y vuelva a intentarlo, así evitará futuras confusiones.', 400
        
        # Por ejemplo, guardar el archivo en el sistema de archivos
        file.save(os.path.join(CSV_FOLDER, secure_filename(file.filename)))

        # Obtención del tamaño del archivo en bytes
        tamano = os.path.getsize(os.path.join(CSV_FOLDER, secure_filename(file.filename)))
        
        # Lectura del contenido del archivo CSV
        with open(os.path.join(CSV_FOLDER, secure_filename(file.filename)), 'rb') as f:
            file_data = f.read()
        
        # Obtención del tipo MIME del archivo CSV
        mime = 'text/csv'  # Por ejemplo, el tipo MIME para archivos CSV

        # Inserción de los datos del archivo en la base de datos
        query = "INSERT INTO datafiles (filename, tamano, contenido, mime, id_usr) VALUES (%s, %s, %s, %s, %s)"
        db.execute(query, (secure_filename(file.filename), tamano, file_data, mime, USUARIO_LOGIN['id']))
        mydb.commit()

        # Se comprueba si el nombre del archivo ya existe en la base de datos
        db.execute(f"SELECT * FROM datafiles WHERE filename like '%{file.filename}%' AND id_usr = {USUARIO_LOGIN['id']} AND mime = 'text/csv'")
        file_uploaded = db.fetchone()

        UPLOADED_FILES[file_uploaded[0]] = file.filename

        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(os.path.join(CSV_FOLDER, UPLOADED_FILES[file_uploaded[0]]))

        # Convert the DataFrame to JSON
        json_data = df.to_json(orient='records')

        # Vaciado del diccionario de archivos cargados
        UPLOADED_FILES.clear()

        # Borrar el archivo del sistema de archivos
        os.remove(os.path.join(CSV_FOLDER, secure_filename(file.filename)))
        
        return json_data, 200
    else:
        return '¡Formato de archivo no permitido!', 400

################################################################################################################################################
# URL de listado de archivos cargados
@app.route('/files', methods=['GET'])
def get_files():

    # Obtener la lista de archivos en BBDD
    db.execute(f"SELECT * FROM datafiles WHERE id_usr = {USUARIO_LOGIN['id']} and mime = 'text/csv'")
    files = db.fetchall()

    # crear json con los nombres y los ids de los archivos
    upload_files = {}
    fechas = {}
    for file in files:
        upload_files[file[0]] = file[1]
        fechas[file[0]] = file[6]

    # Combinar los diccionarios en uno solo
    response_data = {
        'fechas': fechas,
        'upload_files': upload_files
    }

    # Devolver el JSON combinado como respuesta HTTP
    return response_data, 200

# URL de listado de informes cargados
@app.route('/informes', methods=['GET'])
def get_informes():

    # Obtener la lista de archivos en BBDD
    db.execute(f"SELECT * FROM informes WHERE id_usr = {USUARIO_LOGIN['id']} and mime = 'application/pdf'")
    files = db.fetchall()

    # crear json con los nombres y los ids de los archivos
    upload_files = {}
    fechas = {}
    for file in files:
        upload_files[file[0]] = file[1]
        fechas[file[0]] = file[6]

    # Combinar los diccionarios en uno solo
    response_data = {
        'fechas': fechas,
        'upload_files': upload_files
    }

    # Devolver el JSON combinado como respuesta HTTP
    return response_data, 200

################################################################################################################################################
# URL de obtención de gráficas generadas
@app.route('/graficasVisualizar', methods=['GET'])
def get_view_graphics():
    # Devuelve el JSON como respuesta HTTP
    return GENERATED_VIEW_GRAPHICS, 200

# URL de obtención de gráficas generadas
@app.route('/graficasResultados', methods=['GET'])
def get_result_graphics():
    # Devuelve el JSON como respuesta HTTP
    return GENERATED_RESULT_GRAPHICS, 200

################################################################################################################################################
# URL de eliminación de gráfica generada
@app.route('/eliminaGraficaVisualizacion', methods=['POST'])
def eliminaGrafica():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Eliminar la gráfica del diccionario
    del GENERATED_VIEW_GRAPHICS[filename]

    # Eliminar el archivo del sistema de archivos
    os.remove(os.path.join(GRAPHICS_FOLDER, filename))

    # Devuelve un mensaje de éxito
    return 'Gráfica eliminada correctamente', 200

# URL de eliminación de gráfica generada
@app.route('/eliminaGraficaResultados', methods=['POST'])
def eliminaGraficaResultados():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Eliminar la gráfica del diccionario
    del GENERATED_RESULT_GRAPHICS[filename]

    # Eliminar el archivo del sistema de archivos
    os.remove(os.path.join(GRAPHICS_FOLDER, filename))

    # Devuelve un mensaje de éxito
    return 'Gráfica eliminada correctamente', 200

################################################################################################################################################
# URL de descarga de grafica generada
@app.route('/descargaGraficaVisualizacion', methods=['POST'])
def download_graphic():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Devolver el archivo como respuesta HTTP
    return send_file(os.path.join(GRAPHICS_FOLDER, filename), as_attachment=True)

# URL de descarga de grafica generada
@app.route('/descargaGraficaResultados', methods=['POST'])
def download_result_graphic():
    # Obtener el nombre del archivo seleccionado
    filename = request.form['fileName']

    # Devolver el archivo como respuesta HTTP
    return send_file(os.path.join(GRAPHICS_FOLDER, filename), as_attachment=True)

# URL de descarga de grafica generada
@app.route('/descargarInforme', methods=['POST'])
def download_informe():
    # Obtener el nombre del archivo seleccionado
    fileid = request.form['fileId']

    # Seleccionar el archivo de bbdd
    db.execute(f"SELECT * FROM informes WHERE id = {fileid} and id_usr = {USUARIO_LOGIN['id']}")
    file = db.fetchone()

    # Guardar el archivo en el sistema de archivos
    with open(os.path.join(UPLOAD_FOLDER, file[1]), 'wb') as f:
        f.write(file[4])

    # Devolver el archivo como respuesta HTTP
    return send_file(os.path.join(UPLOAD_FOLDER, file[1]), as_attachment=True)

# URL de descarga de grafica generada
@app.route('/descargarCsv', methods=['POST'])
def download_csv():
    # Obtener el nombre del archivo seleccionado
    fileid = request.form['fileId']

    # Seleccionar el archivo de bbdd
    db.execute(f"SELECT * FROM datafiles WHERE id = {fileid} and id_usr = {USUARIO_LOGIN['id']}")
    file = db.fetchone()

    # Guardar el archivo en el sistema de archivos
    with open(os.path.join(CSV_FOLDER, file[1]), 'wb') as f:
        f.write(file[4])

    # Devolver el archivo como respuesta HTTP
    return send_file(os.path.join(CSV_FOLDER, file[1]), as_attachment=True)

################################################################################################################################################
#URL de generación de informe pdf
@app.route('/generaInforme', methods=['GET'])
def generaInforme():
    print('Generando informe...')
    
    pdf_path = 'informe.pdf'
    c = canvas.Canvas(pdf_path, pagesize=A4)
    
    c.drawString(100, 800, 'Informe de resultados')
    c.drawString(100, 780, 'Usuario: ' + USUARIO_LOGIN['usuario'])
    c.drawString(100, 740, 'Gráficas generadas:')
    
    y_position = 720
    
    # Agregar gráficas de visualización
    c.drawString(100, y_position, 'Gráficas de visualización:')
    y_position -= 20
    
    for i, (filename, filepath) in enumerate(GENERATED_VIEW_GRAPHICS.items()):
        if y_position < 200:  # Nueva página si el espacio es insuficiente
            c.showPage()
            y_position = 800
        img_path = os.path.join(GRAPHICS_FOLDER, filename)
        if os.path.exists(img_path):
            c.drawImage(img_path, 100, y_position - 200, width=400, height=200)
            y_position -= 220
        else:
            c.drawString(100, y_position, f'Imagen no encontrada: {filename}')
            y_position -= 20
    
    # Agregar gráficas de resultados
    if y_position < 200:
        c.showPage()
        y_position = 800
    c.drawString(100, y_position, 'Gráficas de resultados:')
    y_position -= 20
    
    for i, (filename, filepath) in enumerate(GENERATED_RESULT_GRAPHICS.items()):
        if y_position < 200:  # Nueva página si el espacio es insuficiente
            c.showPage()
            y_position = 800
        img_path = os.path.join(GRAPHICS_FOLDER, filename)
        if os.path.exists(img_path):
            c.drawImage(img_path, 100, y_position - 200, width=400, height=200)
            y_position -= 220
        else:
            c.drawString(100, y_position, f'Imagen no encontrada: {filename}')
            y_position -= 20
    
    c.save()

    #Subir el archivo a bbdd
    with open(pdf_path, 'rb') as f:
        file_data = f.read()
        mime = 'application/pdf'
        query = "INSERT INTO informes (filename, tamano, contenido, mime, id_usr) VALUES (%s, %s, %s, %s, %s)"
        db.execute(query, (pdf_path, os.path.getsize(pdf_path), file_data, mime, USUARIO_LOGIN['id']))
        mydb.commit()
    
    return 'Informe generado correctamente', 200

################################################################################################################################################
# URL de generación de gráfica
@app.route('/generaGraficaVisualizacion', methods=['POST'])
def generaGrafica():
    # Obtener el nombre del archivo seleccionado
    fileId = request.form['fileId']
    # Obtener el tipo de gráfica seleccionado
    tipoGrafica = request.form['tipoGrafica']
    # Obtener el título de la gráfica
    titulo = request.form['titulo'].upper()
    # Obtener la etiqueta del eje X
    labelX = request.form['labelEjeX'].upper()
    # Obtener campo de X
    valueEjeX = request.form['valueEjeX']
    # Obtener la etiqueta del eje Y
    labelY = request.form['labelEjeY'].upper()
    # Obtener campo de Y
    valueEjeY = request.form['valueEjeY']
    # Obtener HUE (variable categórica de agrupación)
    valueHue = request.form['valueHue']
    # Obtener el estilo de la gráfica
    estilo = request.form['estilo']
    # Obtener el tema de la gráfica
    tema = request.form['tema']

    # Seleccionar el archivo de bbdd
    db.execute(f"SELECT * FROM datafiles WHERE id = {fileId}")
    file = db.fetchone()

    # Leer el contenido del archivo de la columna blob de bbdd
    df = pd.read_csv(io.BytesIO(file[4]))

    custom_params = {"axes.spines.right": False, "axes.spines.top": False}
    sns.set_theme(style=estilo, rc=custom_params, palette=tema)
    plt.figure(figsize=(9, 7))

    if tipoGrafica == 'countplot':
        if valueEjeX and not valueEjeY:
            if valueEjeX not in df.columns:
                return 'El campo seleccionado para X no existe en el archivo.', 400
            if valueHue:
                sns.countplot(data=df, x=valueEjeX, hue=valueHue)
            else:
                sns.countplot(data=df, x=valueEjeX)

        elif valueEjeY and not valueEjeX:
            if valueEjeY not in df.columns:
                return 'El campo seleccionado para Y no existe en el archivo.', 400
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
            if valueEjeX not in df.columns:
                return 'El campo seleccionado para X no existe en el archivo.', 400
            if valueHue:
                sns.histplot(data=df, x=valueEjeX, binwidth=5, kde=True, hue=valueHue)
            else:
                sns.histplot(data=df, x=valueEjeX, binwidth=5, kde=True)
        elif valueEjeY and not valueEjeX:
            if valueEjeY not in df.columns:
                return 'El campo seleccionado para Y no existe en el archivo.', 400
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
            if valueEjeX not in df.columns or valueEjeY not in df.columns:
                return 'Los campos seleccionados para X o Y no existen en el archivo.', 400
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
        # Seleccionar todas las columnas de tipo object (string)
        string_columns = df.select_dtypes(include=['object']).columns
        # Eliminar las columnas seleccionadas del DataFrame
        df.drop(columns=string_columns, inplace=True)
        
        sns.heatmap(df.corr(), annot=True, fmt=".2f", linewidths=0.7, cbar=True, cmap=tema)
        plt.title(titulo, size = 20, weight='bold')

    elif tipoGrafica == 'boxplot':
        if valueEjeX and valueEjeY:
            if valueEjeX not in df.columns or valueEjeY not in df.columns:
                return 'Los campos seleccionados para X o Y no existen en el archivo.', 400
            sns.boxplot(data=df, x=valueEjeX, y=valueEjeY, showfliers=False)
        elif valueEjeX and not valueEjeY:
            if valueEjeX not in df.columns:
                return 'El campo seleccionado para X no existe en el archivo.', 400
            sns.boxplot(data=df, x=valueEjeX, showfliers=False)
        elif valueEjeY and not valueEjeX:
            if valueEjeY not in df.columns:
                return 'El campo seleccionado para Y no existe en el archivo.', 400
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
        num = len(GENERATED_VIEW_GRAPHICS)

        #Guardar la gráfica en un archivo
        filename = f'{tipoGrafica}_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_VIEW_GRAPHICS[filename] = os.path.join('graphics', filename)

        return 'Gráfica generada exitosamente', 200
    

def generaModelo(fileId, modelName, varEliminar, target, test):

    variables_modelo = {}

    # Seleccionar el archivo de bbdd
    db.execute(f"SELECT * FROM datafiles WHERE id = {fileId}")
    file = db.fetchone()

    # Leer el contenido del archivo de la columna blob de bbdd
    df = pd.read_csv(io.BytesIO(file[4]))

    if(varEliminar != ''):
        for i in varEliminar.split(','):
            df.drop(i.strip(), axis=1, inplace=True)
    else:
        # Eliminar las columnas que no se utilizarán en el modelo
        df.drop(['Subject ID', 'MRI ID', 'Hand'], axis=1, inplace=True)



    # Identificación de las columnas categóricas
    cat_columns = df.select_dtypes(include=['object']).columns

    le = LabelEncoder()

    for col in cat_columns:
        df[col] = le.fit_transform(df[col].values)
        category_mappings[col] = dict(enumerate(le.classes_))
        print(f'{col}:\n' + '\n'.join(f'{i} : {val}' for i, val in enumerate(le.classes_)))
        df[col] = df[col].astype('category')

    #df['M/F'] = le.fit_transform ( df['M/F'].values )
    #print ( 'Sex:\n0 : %s \n1 : %s\n\n' %(le.classes_[0], le.classes_[1]) )

    #df.Group = le.fit_transform ( df.Group.values )
    #print ( 'Dementia:\n0 : %s \n1 : %s \n2 : %s' %(le.classes_[0], le.classes_[1], le.classes_[2]) )
    #df.Group = df.Group.astype('category')
    #df['M/F'] = df['M/F'].astype('category')

    X, y = df.drop(target, axis=1).values , df[target].values
    X_train, X_test, y_train, y_test = train_test_split ( X, y, test_size = test, random_state = 1, stratify = y)
    print ('Number of observations in the target variable before oversampling of the minority class:', np.bincount (y_train) )
    smt = SMOTE()
    X_train, y_train = smt.fit_resample (X_train, y_train)
    print ('\nNumber of observations in the target variable after oversampling of the minority class:', np.bincount (y_train) )
    std_scaler = StandardScaler()
    X_train_std = std_scaler.fit_transform ( X_train )
    X_test_std = std_scaler.transform ( X_test )

    if modelName == 'logisticregression':
        lr = LogisticRegression(random_state=42)
        param_grid = {
            'C': [0.1, 1, 10],
            'solver': ['liblinear', 'lbfgs']
        }
        gs = GridSearchCV(estimator=lr,
                      param_grid=param_grid,
                      scoring='accuracy',
                      cv=5,
                      refit=True,
                      n_jobs=-1)
        gs = gs.fit(X_train_std, y_train)

        variables_modelo = {
            'df': df,
            'X_train_std': X_train_std,
            'y_train': y_train,
            'X_test_std': X_test_std,
            'y_test': y_test,
            'gs.best_params_': gs.best_params_,
            'gs.best_score_': gs.best_score_,
            'gs.best_estimator_': gs.best_estimator_,
            'gs': gs
        }

    elif modelName == 'svm':
        svc = SVC(random_state=42, probability=True)  # `probability=True` is needed for `predict_proba`
        param_grid = { 
            'C': [0.1, 1, 10],
            'kernel': ['linear', 'rbf']
        }
        gs = GridSearchCV(estimator=svc,
                      param_grid=param_grid,
                      scoring='accuracy',
                      cv=5,
                      refit=True,
                      n_jobs=-1)

        gs = gs.fit(X_train_std, y_train)

        variables_modelo = {
            'df': df,
            'X_train_std': X_train_std,
            'y_train': y_train,
            'X_test_std': X_test_std,
            'y_test': y_test,
            'gs.best_params_': gs.best_params_,
            'gs.best_score_': gs.best_score_,
            'gs.best_estimator_': gs.best_estimator_,
            'gs': gs
        }

    elif modelName == 'randomforest':
        rfc = RandomForestClassifier(n_jobs=-1, random_state=42) 

        param_grid = { 
            'n_estimators': [500, 700, 900],
            'min_samples_split': [2,4,6,8,10]
        }

        gs = GridSearchCV ( estimator = rfc,
                       param_grid = param_grid,
                       scoring = 'accuracy',
                       cv = 5,
                       refit = True,
                       n_jobs = -1
                       )

        gs = gs.fit ( X_train_std, y_train )

        variables_modelo = {
            'df': df,
            'X_train_std': X_train_std,
            'y_train': y_train,
            'X_test_std': X_test_std,
            'y_test': y_test,
            'gs.best_params_': gs.best_params_,
            'gs.best_score_': gs.best_score_,
            'gs.best_estimator_': gs.best_estimator_,
            'gs': gs
        }

        

        #dump(gs, os.path.join(CSV_FOLDER, modelName + '.joblib'))

    return variables_modelo

def loadModelo(fileId, fileName, varEliminar, target, test):
    variables_modelo = {}

    # Seleccionar el archivo de bbdd
    db.execute(f"SELECT * FROM datafiles WHERE id = {fileId}")
    file = db.fetchone()

    # Leer el contenido del archivo de la columna blob de bbdd
    df = pd.read_csv(io.BytesIO(file[4]))

    if(varEliminar != ''):
        varEliminar = varEliminar.split(',')
        df.drop(varEliminar, axis=1, inplace=True)
    else:
        # Eliminar las columnas que no se utilizarán en el modelo
        df.drop(['Subject ID', 'MRI ID', 'Hand'], axis=1, inplace=True)

    # Identificación de las columnas categóricas
    cat_columns = df.select_dtypes(include=['object']).columns

    le = LabelEncoder()

    for col in cat_columns:
        df[col] = le.fit_transform(df[col].values)
        category_mappings[col] = dict(enumerate(le.classes_))
        print(f'{col}:\n' + '\n'.join(f'{i} : {val}' for i, val in enumerate(le.classes_)))
        df[col] = df[col].astype('category')

    #df['M/F'] = le.fit_transform ( df['M/F'].values )
    #print ( 'Sex:\n0 : %s \n1 : %s\n\n' %(le.classes_[0], le.classes_[1]) )

    #df.Group = le.fit_transform ( df.Group.values )
    #print ( 'Dementia:\n0 : %s \n1 : %s \n2 : %s' %(le.classes_[0], le.classes_[1], le.classes_[2]) )
    #df.Group = df.Group.astype('category')
    #df['M/F'] = df['M/F'].astype('category')

    X, y = df.drop(target, axis=1).values , df[target].values
    X_train, X_test, y_train, y_test = train_test_split ( X, y, test_size = test, random_state = 1, stratify = y)
    print ('Number of observations in the target variable before oversampling of the minority class:', np.bincount (y_train) )
    smt = SMOTE()
    X_train, y_train = smt.fit_resample (X_train, y_train)
    print ('\nNumber of observations in the target variable after oversampling of the minority class:', np.bincount (y_train) )
    std_scaler = StandardScaler()
    X_train_std = std_scaler.fit_transform ( X_train )
    X_test_std = std_scaler.transform ( X_test )

    gs = load(os.path.join(CSV_FOLDER, fileName))

    gs = gs.fit ( X_train_std, y_train )

    variables_modelo = {
        'df': df,
        'X_train_std': X_train_std,
        'y_train': y_train,
        'X_test_std': X_test_std,
        'y_test': y_test,
        'gs.best_params_': gs.best_params_,
        'gs.best_score_': gs.best_score_,
        'gs.best_estimator_': gs.best_estimator_,
        'gs': gs
    }


    return variables_modelo


# URL de generación de gráfica
@app.route('/generaGraficaResultados', methods=['POST'])
def generaGraficaResultados():
    # Obtener el nombre del archivo seleccionado
    fileId = request.form['fileId']
    # Obtener el tipo de gráfica seleccionado
    tipoGrafica = request.form['tipoGrafica']
    # Obtener el título de la gráfica
    titulo = request.form['titulo'].upper()
    # Obtener la etiqueta del eje X
    labelX = request.form['labelEjeX'].upper()
    # Obtener la etiqueta del eje Y
    labelY = request.form['labelEjeY'].upper()
    # Obtener el estilo de la gráfica
    estilo = request.form['estilo']
    # Obtener el tema de la gráfica
    tema = request.form['tema']
    # Obtener el nombre del modelo
    modelName = request.form['modelName']
    #Obtener variables que se eliminaran
    varEliminar = request.form['varEliminar']
    # Obtener variable objetivo
    target = request.form['varObjetivo']
    #Obtener %test
    test = request.form['test']

    if (test == '20'):
        test = 0.2
    elif (test == '10'):
        test = 0.1
    elif (test == '30'):
        test = 0.3

    # Comprobar si se recibió un archivo en la solicitud
    hayArchivo = request.form['hayArchivo']

    if(hayArchivo == 'true'):
        file = request.files['file']
        if file:
            file.save(os.path.join(CSV_FOLDER, secure_filename(file.filename)))
            model=loadModelo(fileId, file.filename, varEliminar, target, test)
    else:
        model = generaModelo(fileId, modelName, varEliminar, target, test)

    custom_params = {"axes.spines.right": False, "axes.spines.top": False}
    sns.set_theme(style=estilo, rc=custom_params, palette=tema)

    print('Parameter setting that gave the best results on the hold out data:', model.get('gs.best_params_'))
    print('Mean cross-validated score of the best_estimator: %.3f' % model.get('gs.best_score_'))

    gs = model.get('gs').best_estimator_

    gs.fit(model.get('X_train_std'), model.get('y_train'))
    y_pred = gs.predict(model.get('X_test_std'))
    print(f'Accuracy train score: %.4f' % gs.score(model.get('X_train_std'), model.get('y_train')))
    print(f'Accuracy test score: %.4f' % accuracy_score(model.get('y_test'), y_pred))

    if(tipoGrafica == 'curvaroc'):
        # Convertir las etiquetas en formato binarizado para la estrategia One-vs-Rest
        y_test_bin = label_binarize(model.get('y_test'), classes=np.unique(model.get('y_test')))
        y_prob_bin = gs.predict_proba(model.get('X_test_std'))

        # Graficar las curvas ROC para cada clase
        fpr = dict()
        tpr = dict()
        roc_auc = dict()
        for i in range(len(np.unique(model.get('y_test')))):
            fpr[i], tpr[i], _ = roc_curve(y_test_bin[:, i], y_prob_bin[:, i])
            roc_auc[i] = auc(fpr[i], tpr[i])

        # Obtener las etiquetas originales de las clases
        class_labels = category_mappings[target]

        # Graficar todas las curvas ROC
        plt.figure(figsize=(9, 6))
        colors = cycle(['aqua', 'darkorange', 'cornflowerblue'])
        for class_index, color in zip(range(len(class_labels)), colors):
            # Obtener el nombre de la clase a partir de las etiquetas originales
            class_name = class_labels[class_index]
            plt.plot(fpr[class_index], tpr[class_index], color=color, lw=2,
                label=f'ROC curve of class {class_name} (area = {roc_auc[class_index]:.2f})')

        plt.plot([0, 1], [0, 1], 'k--', lw=2)
        if labelX:
            plt.xlabel(labelX)
        else:
            plt.xlabel('False Positive Rate')
        if labelY:
            plt.ylabel(labelY)
        else:
            plt.ylabel('True Positive Rate')
        
        if titulo:
            plt.title(titulo, size = 20, weight='bold')
        else:
            plt.title('Receiver Operating Characteristic (ROC) Curve - One-vs-Rest', size = 20, weight='bold')
            
        plt.legend(loc="lower right")

        # Guardar la gráfica en un archivo
        num = len(GENERATED_RESULT_GRAPHICS)
        filename = f'result_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_RESULT_GRAPHICS[filename] = os.path.join('graphics', filename)

    elif (tipoGrafica == 'matrizconfusion'):
        # Calcular la matriz de confusión
        cm = confusion_matrix(model.get('y_test'), y_pred)

        # Graficar la matriz de confusión
        #modificar tamaño de la grafica
        plt.figure(figsize=(9, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap=tema)
        if titulo:
            plt.title(titulo, size = 20, weight='bold')
        else:
            plt.title('Matriz de confusión', size = 20, weight='bold')

        if labelX:
            plt.xlabel(labelX)
        else:
            plt.xlabel('Predicted labels')
            
        if labelY:
            plt.ylabel(labelY)
        else:
            plt.ylabel('True labels')

        # Guardar la gráfica en un archivo
        num = len(GENERATED_RESULT_GRAPHICS)
        filename = f'result_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_RESULT_GRAPHICS[filename] = os.path.join('graphics', filename)

    elif (tipoGrafica == 'curvapr'):
        # Convertir las etiquetas en formato binarizado para la estrategia One-vs-Rest
        y_test_bin = label_binarize(model.get('y_test'), classes=np.unique(model.get('y_test')))
        y_prob_bin = gs.predict_proba(model.get('X_test_std'))

        # Graficar las curvas PR para cada clase
        precision = dict()
        recall = dict()
        pr_auc = dict()
        for i in range(len(np.unique(model.get('y_test')))):
            precision[i], recall[i], _ = precision_recall_curve(y_test_bin[:, i], y_prob_bin[:, i])
            pr_auc[i] = auc(recall[i], precision[i])

        # Obtener las etiquetas originales de las clases
        class_labels = category_mappings[target]

        # Graficar todas las curvas PR
        plt.figure(figsize=(9, 6))
        colors = cycle(['aqua', 'darkorange', 'cornflowerblue'])
        for class_index, color in zip(range(len(class_labels)), colors):
            # Obtener el nombre de la clase a partir de las etiquetas originales
            class_name = class_labels[class_index]
            plt.plot(recall[class_index], precision[class_index], color=color, lw=2,
                     label=f'PR curve of class {class_name} (area = {pr_auc[class_index]:.2f})')

        if labelX:
            plt.xlabel(labelX)
        else:
            plt.xlabel('Recall')

        if labelY:
            plt.ylabel(labelY)
        else:
            plt.ylabel('Precisión')
            
        if titulo:
            plt.title(titulo, size = 20, weight='bold')
        else:
            plt.title('Precision-Recall Curve - One-vs-Rest', size = 20, weight='bold')
        plt.legend(loc="lower right")

        # Guardar la gráfica en un archivo
        num = len(GENERATED_RESULT_GRAPHICS)
        filename = f'result_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_RESULT_GRAPHICS[filename] = os.path.join('graphics', filename)

    elif (tipoGrafica == 'curvaaprendizaje'):
        # Graficar la curva de aprendizaje
        train_sizes, train_scores, test_scores = learning_curve(gs, model.get('X_train_std'), model.get('y_train'), cv=5, n_jobs=-1)

        train_scores_mean = np.mean(train_scores, axis=1)
        train_scores_std = np.std(train_scores, axis=1)
        test_scores_mean = np.mean(test_scores, axis=1)
        test_scores_std = np.std(test_scores, axis=1)

        plt.figure(figsize=(9, 6))
        plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1, color="r")
        plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1, color="g")
        plt.plot(train_sizes, train_scores_mean, 'o-', color="r", label="Training score")
        plt.plot(train_sizes, test_scores_mean, 'o-', color="g", label="Cross-validation score")

        if labelX:
            plt.xlabel(labelX)
        else:
            plt.xlabel("Training examples")
        
        if labelY:
            plt.ylabel(labelY)
        else:
            plt.ylabel("Score")
        if titulo:
            plt.title(titulo, size = 20, weight='bold')
        else:
            plt.title("Learning Curve", size = 20, weight='bold')
        plt.legend(loc="best")

        # Guardar la gráfica en un archivo
        num = len(GENERATED_RESULT_GRAPHICS)
        filename = f'result_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_RESULT_GRAPHICS[filename] = os.path.join('graphics', filename)

    elif (tipoGrafica == 'curvavalidacion'):
        # Graficar la curva de validación
        param_range = [0.1, 1, 10]
        train_scores, test_scores = validation_curve(gs, model.get('X_train_std'), model.get('y_train'), param_name='C', param_range=param_range, cv=5)

        train_scores_mean = np.mean(train_scores, axis=1)
        train_scores_std = np.std(train_scores, axis=1)
        test_scores_mean = np.mean(test_scores, axis=1)
        test_scores_std = np.std(test_scores, axis=1)

        plt.figure(figsize=(9, 6))
        plt.fill_between(param_range, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1, color="r")
        plt.fill_between(param_range, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1, color="g")
        plt.plot(param_range, train_scores_mean, 'o-', color="r", label="Training score")
        plt.plot(param_range, test_scores_mean, 'o-', color="g", label="Cross-validation score")

        if labelX:
            plt.xlabel(labelX)
        else:
            plt.xlabel("Parameter C")

        if labelY:
            plt.ylabel(labelY)
        else:
            plt.ylabel("Score")

        if titulo:
            plt.title(titulo, size = 20, weight='bold')
        else:
            plt.title("Validation Curve", size = 20, weight='bold')
        plt.legend(loc="best")

        # Guardar la gráfica en un archivo
        num = len(GENERATED_RESULT_GRAPHICS)
        filename = f'result_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        plt.savefig(filepath)
        plt.close()
        GENERATED_RESULT_GRAPHICS[filename] = os.path.join('graphics', filename)

    return 'Gráfica generada exitosamente', 200

################################################################################################################################################
# Añadimos al registro la función de eliminación de carpetas temporales
atexit.register(cleanup_temp_folder)

if __name__ == '__main__':
    app.run(debug=True)