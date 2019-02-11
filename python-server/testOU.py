import numpy as np
import cv2
import matplotlib.pyplot as plt

from PIL import Image
from pytesseract import image_to_string
from helper import save_json, read_image, extract_contours

check = []
def cropContours(contours):
    images = []

    for i, cnt in enumerate(contours):
        x, y, w, h = cv2.boundingRect(cnt)

        if w > 100 and h > 15:
            # Extract image blog from x and y coordinates
            new_img = img[y:y+h, x:x+w]
            check.append(cnt)
            # Extract text from new_img using tesseract
            output = image_to_string(new_img)
            # Splits the string on a new line ane filters out empty slots in the array
            output = filter(None, output.split('\n'))
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

# Read the calendar image
img = read_image('./images/OttawaU.png')
# Get image contours
contours, _ = extract_contours(img)
images = cropContours(contours)
print images
cv2.drawContours(img, check, -1, (255,0,255), 1)
cv2.imshow('Display', img)
cv2.waitKey()

#print contours