from flask import Flask, jsonify
import json
from ocr import runOCR

app = Flask(__name__)

@app.route("/")
def test():
    return 'Hello World!'

@app.route("/analyzepicture")
def extractInfo():
    data = runOCR()
    print (data)
    return jsonify({'data': data})

if __name__ == '__main__':
    app.run()