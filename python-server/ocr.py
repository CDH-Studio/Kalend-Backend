import numpy as np
import base64
import cv2
import matplotlib.pyplot as plt
from PIL import Image
from pytesseract import image_to_string
from helper import save_json, read_image, extract_contours, prepare_image, drawContoursOnImage, extractText

def cropContours(contours):
    images = []

    for i, cnt in enumerate(contours):
        x, y, w, h = cv2.boundingRect(cnt)
        #approx = cv2.approxPolyDP(cnt,0.01*cv2.arcLength(cnt,True),True)
        if  w > 40 and w < 400 and x > 15:
            # Extract image blog from the real image using x and y 
            new_img = img[y:y+h, x:x+w]
            new_img = prepare_image(new_img)
            # Extract text from new_img using tesseract
            #output = image_to_string(new_img)
            # Extract text using Google Vision
            output = extractText(new_img)

            if output:
                # Splits the string on a new line ane filters out empty slots in the array
                output = filter(None, output[0].description.split('\n'))
            else: 
                continue

            position = {"x": x, "y": y, "width": w, "height": h}
            temp_img = {
                "position": position,
                "courseInfo": output
            }
            images.append(temp_img)
    return images

img = None
def runOCR(_encoded_string):
    global img
    # For some reason, when sending base64 from nodeJs to Python, the + are replaces with ' '. This causes issues while
    # decoding back to image( Padding Error)
    encoded_string = _encoded_string.replace("PLUS", "+")
    encoded_string = encoded_string.replace("EQUALS", "=")
    nparr = np.fromstring(encoded_string.decode('base64'), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  
    # Get image contours
    contours, h = extract_contours(np.array(img))
    #newImg = drawContoursOnImage(contours, img)
    # Cropped Images
    cropped_images = cropContours(contours)
    # cv2.imshow('newImg', img)
    # cv2.waitKey(0)
    # Export to Array as a JSON file
    #save_json(cropped_images, 'data')
    return cropped_images
