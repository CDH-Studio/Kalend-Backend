from flask import Flask, jsonify
import json
from ocr import runOCR

app = Flask(__name__)

@app.route("/")
def hello():
    return 'Hello World!'

@app.route("/test")
def hello2():
    data = runOCR()
    print data
    return jsonify({'data': data})

if __name__ == '__main__':
    app.run()