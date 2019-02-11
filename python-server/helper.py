import cv2
import json

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
    ret, mask = cv2.threshold(gray, 220, 225, cv2.THRESH_BINARY_INV)

    # Extract image countours 
    contours, h = cv2.findContours(mask, 1, 2)

    return contours, h