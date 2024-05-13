from flask import Flask, request, send_file
from werkzeug.utils import secure_filename

import os, shutil, atexit, json, io, warnings, pandas as pd, numpy as np, seaborn as sns, matplotlib.pyplot as plt, mysql.connector

warnings.filterwarnings('ignore')


mydb = mysql.connector.connect(
    host="localhost",
    port="3306",
    user="admin1",
    password="admin1",
    database="cognidash"
)

db = mydb.cursor()

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'csv'}

UPLOADED_FILES = {}

GENERATED_GRAPHICS = {}

parent_directory = os.path.dirname(os.getcwd())
UPLOAD_FOLDER = os.path.join(parent_directory, 'uploads')
CSV_FOLDER = os.path.join(parent_directory, 'uploads', 'csv')
GRAPHICS_FOLDER = os.path.join('C:\\Users\\joser\\Desktop\\TFG\\CogniDash\\client\\public\\', 'graphics')

upload_temp_dir = os.path.join(app.instance_path, UPLOAD_FOLDER)
csv_temp_dir = os.path.join(app.instance_path, CSV_FOLDER)
graphics_temp_dir = os.path.join(app.instance_path, GRAPHICS_FOLDER)

def init():
    createTempDirs()

def createTempDirs():
    os.makedirs(upload_temp_dir, exist_ok=True)
    os.makedirs(csv_temp_dir, exist_ok=True)
    os.makedirs(graphics_temp_dir, exist_ok=True)

init()

@app.route('/login', methods=['POST'])
def login():
    # Obtener las credenciales del cuerpo de la solicitud POST
    email = request.form['email']
    password = request.form['password']

    # Realizar una consulta en la base de datos para verificar las credenciales
    db.execute(f"SELECT * FROM users WHERE email like '%{email}%' AND password like '%{password}%' AND fec_baja is null")
    user = db.fetchone()  # Obtener el primer usuario que coincida con las credenciales

    print(user)
    if user:
        print(email)
        print(password)
        return 'Login exitoso', 200  # Si las credenciales son válidas, devuelve un mensaje de éxito
    else:
        return 'Credenciales incorrectas', 400  # Si las credenciales no son válidas, devuelve un mensaje de error
    

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

@app.route('/upload', methods=['POST'])
def upload_file():
    # Comprobar si se recibió un archivo en la solicitud
    if 'file' not in request.files:
        return 'No se recibió ningún archivo', 400
    
    file = request.files['file']

    # Comprobar si no se seleccionó ningún archivo
    if file.filename == '':
        return 'No se seleccionó ningún archivo', 400
    
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

        # Do something with the JSON data, such as saving it to a file or sending it as a response

        # Example: Save the JSON data to a file
        json_filename = os.path.splitext(file.filename)[0] + '.json'
        json_filepath = os.path.join(CSV_FOLDER, json_filename)
        with open(json_filepath, 'w') as json_file:
            json_file.write(json_data)

        # Example: Print the JSON data
        #print(json_data)
        
        
        return 'Archivo cargado exitosamente', 200
    else:
        return 'Formato de archivo no permitido', 400

UPLOADED_FILES = {}

@app.route('/files', methods=['GET'])
def get_files():
    options = list(UPLOADED_FILES.keys())

    print(options)

    
    # Devuelve el JSON como respuesta HTTP
    return {'options': options}, 200

@app.route('/graficas', methods=['GET'])
def get_graphics():
    print(GENERATED_GRAPHICS)

    # Devuelve el JSON como respuesta HTTP
    return GENERATED_GRAPHICS, 200

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
    # Obtener la etiqueta del eje Y
    labelY = request.form['labelEjeY']


    # leer el archivo CSV seleccionado
    df = pd.read_csv(UPLOADED_FILES[filename])

    #
    df.rename(columns={'Group': 'DEMENTIA'}, inplace=True)
    df.rename(columns={'M/F': 'Sex'}, inplace=True)
    df.drop(columns=['MRI ID', 'Subject ID'], inplace=True)

    print(df.head(10).style.set_properties(**{'background-color': 'black', 'color': 'orchid'}))

    df.drop(columns=['Hand'], inplace=True)

    print(df.describe().T.style.background_gradient(cmap='tab10'))

    print(df.info())

    print('/n VALORES NULOS... /n')


    print(df.isna().sum())

    print('/n ACTUALIZANDO VALORES NULOS... /n')

    df.SES.fillna(0, inplace=True)
    df.MMSE.fillna(df.MMSE.mean(), inplace=True)
    print(df.isna().sum())

    custom_params = {"axes.spines.right": False, "axes.spines.top": False}
    sns.set_theme(style="ticks", rc=custom_params, palette="pastel")
    plt.figure(figsize=(8, 6))

    if tipoGrafica == 'countplot':
        ax = sns.countplot(data=df, x='DEMENTIA')
        for i in ax.patches:
            ax.text(i.get_x() + i.get_width() / 2, y = i.get_height() / 7, s=f"{np.round(i.get_height()/len(df)*100,0)}%", ha='center', size=20, weight='bold', rotation=360, color='white')
        plt.title(titulo)
        plt.xlabel(labelX)
        plt.ylabel(labelY)
    
    elif tipoGrafica == 'histplot':
        sns.histplot(data=df, x='SES', binwidth=5, kde=True, hue='DEMENTIA')
        plt.title(titulo)
        plt.xlabel(labelX)
        plt.ylabel(labelY)

    elif tipoGrafica == 'scatterplot':
        sns.scatterplot(data=df, x='SES', y='MMSE', hue='DEMENTIA', alpha=0.7)
        plt.title(titulo)
        plt.xlabel(labelX)
        plt.ylabel(labelY)

    elif tipoGrafica == 'heatmap':
        dementia_col = df.drop(columns=['DEMENTIA'], inplace=True)
        sex_col = df.drop(columns=['Sex'], inplace=True)
        sns.heatmap(df.corr(), annot=True, fmt=".2f", linewidths=0.7, cbar=True, cmap='RdBu')
        plt.title(titulo)
        df['DEMENTIA'] = dementia_col
        df['Sex'] = sex_col

    elif tipoGrafica == 'boxplot':
        sns.boxplot(data=df, x='DEMENTIA', y='MMSE', showfliers=False)
        plt.title(titulo)
        plt.xlabel(labelX)
        plt.ylabel(labelY)

    if tipoGrafica not in ['countplot', 'histplot', 'scatterplot', 'heatmap', 'boxplot']:
        return 'Tipo de gráfica no válido', 400
    else:
        # numero de elementos del array generated_graphics
        num = len(GENERATED_GRAPHICS)

        #Guardar la gráfica en un archivo
        filename = f'{tipoGrafica}_{num+1}.png'
        filepath = os.path.join(GRAPHICS_FOLDER, filename)
        print(filepath)
        plt.savefig(filepath)
        plt.close()
        GENERATED_GRAPHICS[filename] = os.path.join('graphics', filename)

        return 'Gráfica generada exitosamente', 200

atexit.register(cleanup_temp_folder)

if __name__ == '__main__':
    app.run(debug=True)