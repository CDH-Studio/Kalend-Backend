import cv2
import json

# Saves an array as a JSON in a file
def save_json(data, filename):
    with open(filename + '.json', 'w') as outfile:
        json.dump(data, outfile)

# Returns an image read by cv2
def read_image(filename):
    return cv2.imread(filename)
