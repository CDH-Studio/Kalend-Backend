# -*- coding: utf-8 -*-

import cv2, argparse, pytesseract, sys, json
import numpy as np
from PIL import Image
from os import listdir
from os.path import isfile, join

CROP_DIR = "crop/"
JSON_DATA = {}

# Inspired from https://www.quora.com/How-I-detect-rectangle-using-OpenCV
def crop_rect(file_name):

    # Reads the file and converts it to gray
    img = cv2.imread(file_name)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Gets the width, height and area of the image
    height, width = gray.shape
    area = height * width

    # Creates a mask and finds the contours
    ret,mask = cv2.threshold(gray, 220, 225, cv2.THRESH_BINARY_INV)
    # mask_inv = cv2.bitwise_not(mask)
    contours,h = cv2.findContours(mask,1,2)

    # Iterates each contour to examine them
    for index,contour in enumerate(contours):

        # Checks how many sides the contour has
        approx = cv2.approxPolyDP(contour,0.01*cv2.arcLength(contour,True),True)
        approx = len(approx)
        
        # Checks if the contour has 4 sides and checks if the area is too small or too big
        # TODO: Add a ratio checker (checks if the ratio of the contour is wide or narrow)
        if approx == 4 and cv2.contourArea(contour) > (area * 0.001) and cv2.contourArea(contour) < (area * 0.7):

            # Crops the image to the countour found
            rect_img = gray[contour[0][0][1]:contour[1][0][1], contour[0][0][0]:contour[2][0][0]]

            # Creates a box around the countour
            rect = cv2.boundingRect(contour)
            x,y,w,h = rect

            # Prints the box and the contour on the image
            # cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
            # cv2.drawContours(img,[contour],0,(0,255,0),-1)

            # Saves the contour in a file for the OCR to read (it may be modified to pass the array to the OCR function instead)
            crop_file_name = 'crop' + str(index) + ".png"
            cv2.imwrite(CROP_DIR + crop_file_name, rect_img)

            # Cleans the array, for it to be more readable
            point = []
            for i in contour:
                point.append(i[0].tolist())

            # Appends the information about the current contour to the JSON object
            JSON_DATA[crop_file_name] = {
                "points": point,
                "boundingBox": {
                    "x": x,
                    "y": y,
                    "width": w,
                    "height": h
                }
            }
    
# Saves the JSON object to a file
def save_json():
    with open('data.json', 'w') as outfile:
        json.dump(JSON_DATA, outfile)

# Helper method to perform the OCR on all the cropped file
def perform_ocr():
    file_names = [f for f in listdir(CROP_DIR) if isfile(join(CROP_DIR, f))]

    for file_name in file_names:
        text = pytesseract.image_to_string(Image.open(
            "crop/" + file_name
        ))

        if text == "":
            del JSON_DATA[file_name]
        else:
            JSON_DATA[file_name]["text"] = filter(None, text.split("\n"))

if __name__== "__main__":

    # Sets up the argument parsers, to pass the file name as a argument
    parser = argparse.ArgumentParser("Calendar Data Extraction")
    parser.add_argument("-f", help="The file name of calendar image", type=str, default="calendar.png")
    args = parser.parse_args()

    crop_rect(args.f)
    perform_ocr()
    save_json()