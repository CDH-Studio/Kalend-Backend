from flask import Flask, jsonify, request
import json
from ocr import runOCR
from PIL import Image
import cv2
import base64

import os
#os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '../../GCP.json'

app = Flask(__name__)

@app.route("/")
def test():
    return 'Hello World!'

@app.route("/analyzepicture", methods=["POST"])
def extractInfo():
    dict_ = request.form.to_dict()
    _encoded_string = dict_.keys()[0]
    data = runOCR(_encoded_string)

    return jsonify({'data': data})

if __name__ == '__main__':
    app.run()
