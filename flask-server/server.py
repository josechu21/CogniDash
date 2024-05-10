from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def api():
    print('Hola Mundo')
    return jsonify('Hola Mundo')

if __name__ == '__main__':
    app.run(debug=True)