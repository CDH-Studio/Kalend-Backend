import numpy as np
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
            # Extract image blog from x and y coordinates
            new_img = img[y:y+h, x:x+w]
            # Extract text from new_img using tesseract
            output = image_to_string(new_img)
            # Splits the string on a new line ane filters out empty slots in the array
            output = filter(None, output.split('\n'))
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
# Get image contours
contours, h = extract_contours(img)
# Cropped Images
cropped_images = cropContours(contours)
# Export to Array as a JSON file
save_json(cropped_images, 'data')
