import cv2
import json
from PIL import Image
import numpy as np
# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# Instantiates a client
client = vision.ImageAnnotatorClient()

# Saves an array as a JSON in a file
def save_json(data, filename):
	with open(filename + '.json', 'w') as outfile:
		json.dump(data, outfile)

# Returns an image read by cv2
def read_image(filename):
	return cv2.imread(filename)

# Extract contours and hierarchy from an image
def extract_contours(img):
	# Gray scale the image
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	# Apply threshold to the image
	ret, mask = cv2.threshold(gray, 230, 255, 0)   
	# Extract image countours 
	contours, h = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)

	return contours, h 

def prepare_image(img):
	temp_img = cv2.bilateralFilter(img,12,75 ,75)
	temp_img = cv2.resize(temp_img, None, fx=4, fy=4, interpolation=cv2.INTER_CUBIC)  
	# Apply dilation and erosion to remove some noise
	kernel = np.ones((1, 1), np.uint8)
	temp_img = cv2.dilate(temp_img, kernel, iterations=1)
	temp_img = cv2.erode(temp_img, kernel, iterations=1)

	return temp_img

def drawContoursOnImage(contours, img):
	for cnt in contours: 
		cv2.drawContours(img, [cnt], 0, (0,255,0), 3)
				
	new_img = img
	return new_img

def extractText(image):
	new_image = types.Image(content=cv2.imencode('.jpg', image)[1].tostring())
	response = client.text_detection(image=new_image)
	texts = response.text_annotations
	return texts

	for text in texts:
		#print('\n"{}"'.format(text.description))

		vertices = (['({},{})'.format(vertex.x, vertex.y)
		for vertex in text.bounding_poly.vertices])

		#print('bounds: {}'.format(','.join(vertices)))