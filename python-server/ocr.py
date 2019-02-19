import numpy as np
import base64
import cv2
import matplotlib.pyplot as plt
from PIL import Image
from pytesseract import image_to_string
from helper import save_json, read_image, extract_contours

def cropContours(contours):
    images = []

    for i, cnt in enumerate(contours):
        x, y, w, h = cv2.boundingRect(cnt)

        if w > 100 and h > 30:
            # Extract image blog from the real image using x and y coordinates
            new_img = img[y:y+h, x:x+w]
            # Extract text from new_img using tesseract
            output = image_to_string(new_img)
            # Splits the string on a new line ane filters out empty slots in the array
            output = filter(None, output.split('\n'))
            # Skip if output is empty
            if output == []:
                continue
            # New filename to represent the object
            filename = str(i) + '.png'
            position = {"x": x, "y": y, "width": w, "height": h}
            temp_img = {
                "position": position,
                "courseInfo": output,
                "name": filename
            }
            images.append(temp_img)
    return images

img = None
def runOCR(_encoded_string):
    global img
    # For some reason, when sending base64 from nodeJs to Python, the + are replaces with ' '. This causes issues while
    # decoding back to image( Padding Error)
    encoded_string = _encoded_string.replace(" ", "+")
    nparr = np.fromstring(encoded_string.decode('base64'), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  
    # Get image contours
    contours, h = extract_contours(np.array(img))
    # Cropped Images
    cropped_images = cropContours(contours)
    # Export to Array as a JSON file
    save_json(cropped_images, 'data')
    return cropped_images
