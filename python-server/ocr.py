import numpy as np
import cv2
import matplotlib.pyplot as plt
from PIL import Image
from pytesseract import image_to_string
from helper import save_json, read_image

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

# Read the calendar image
img = read_image('./images/calendar.png')
# GrayScale the image
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# Apply threshold to the image
ret, mask = cv2.threshold(gray, 220, 225, cv2.THRESH_BINARY_INV)
# Extract image countours 
contours, h = cv2.findContours(mask, 1, 2)
# Cropped Images
cropped_images = cropContours(contours)
# Export to Array as a JSON file
save_json(cropped_images, 'data')
