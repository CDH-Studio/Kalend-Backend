# -*- coding: utf-8 -*-

import numpy as np
import cv2, math

# Reads the file and get the resolution of that image
img = cv2.imread('calendar.png', cv2.IMREAD_GRAYSCALE)
height, width = img.shape

# Create a mask and inverts ot
ret,mask = cv2.threshold(img, 220, 225, cv2.THRESH_BINARY_INV)
mask_inv = cv2.bitwise_not(mask)

# Add the Canny Edge algorithm on it
mask_inv = cv2.Canny(mask_inv, 400, 200, 500)

# Parameter of the Hough Lines algorithm
rho = 1  # distance resolution in pixels of the Hough grid
theta = np.pi / 180  # angular resolution in radians of the Hough grid
threshold = 100  # minimum number of votes (intersections in Hough grid cell)
min_line_length = 40  # minimum number of pixels making up a line
max_line_gap = 10000  # maximum gap in pixels between connectable line segments
line_image = np.copy(img) * 0  # creating a blank to draw lines on
point_image = np.copy(img) * 0  
rect_image = np.copy(img) * 0  

# Run Hough on edge detected image
# Output "lines" is an array containing endpoints of detected line segments
lines = cv2.HoughLinesP(mask_inv, rho, theta, threshold, np.array([]), min_line_length, max_line_gap)

# Makes lines slithly longer
offset = 5
for i in range(len(lines)):
	x1,y1,x2,y2 = lines[i][0]
	if (x1 == x2):
		lines[i] = x1, y1+offset, x2, y2-offset
	elif (y1 == y2):
		lines[i] = x1-offset, y1, x2+offset, y2

# Gets all the intersecting points of the lines
points = []
y_axes = []
x_axes = []
for i in range(len(lines)):
	x1,y1,x2,y2 = lines[i][0]
	for j in range(len(lines)):
		x3,y3,x4,y4 = lines[j][0]
		
		# Skips if its the same line
		if (i == j):
			continue
		
		# Checks if the fist line is vertical and the second one is horizontal
		if (x1 == y2 and x3 == x4):
			if (x1 < x3 and x3 < x2):
				points.append([x3,y1])
				cv2.circle(point_image,(x3,y1),2,(255,255,0))

				if (x3 not in x_axes):
					x_axes.append(x3)
				
				if (y1 not in y_axes):
					y_axes.append(y1)

		# Checks if the fist line is horizontal and the second one is vertical
		if (y3 == y4 and x1 == x2):
			if (x3 < x1 and x1 < x4):
				points.append([x1,y3])
				cv2.circle(point_image,(x1,y3),2,(255,255,0))

				if (x1 not in x_axes):
					x_axes.append(x1)
				
				if (y3 not in y_axes):
					y_axes.append(y3)

# Sort arrays for better manipulation below
x_axes = np.sort(x_axes)
y_axes = np.sort(y_axes)

def find_key(arr, value):
	index = -1

	for i in range(len(arr)):
		if (arr[i] == value):
			index = i
			break
	
	return index

rectangles = []
# Iterates through all the points to computer the rectangles
for point in points:

	x_index = find_key(x_axes, point[0])
	y_index = find_key(y_axes, point[1])

	if (x_index >= len(x_axes)-1 or y_index >= len(y_axes)-1):
		continue
	
	point2 = [x_axes[x_index+1], y_axes[y_index+1]]

	height = abs(point[1]-point2[1])
	width = abs(point[0]-point2[0])

	ratio = height / width

	if (ratio < 1):
		ratio = width / height
	
	if ratio < 20 and height > 5 and width > 5:
		rectangles.append([point, point2])

# Draws the rectangles
for index, rectangle in enumerate(rectangles):
	point1, point2 = rectangle

	rect_img = img[point1[1]:point2[1], point1[0]:point2[0]]

	can = cv2.Canny(rect_img, 400, 200)

	equivalent = False

	for i in can:
		for j in i:
			if (j != can[0][0]):
				equivalent = True
				break

	if(equivalent):
		cv2.imwrite('crop/crop'+str(index)+".png", rect_img)

	cv2.rectangle(rect_image, tuple(point1), tuple(point2), (255,255,0), 1)

# Draws the lines
print("Number of points > " + str(len(lines)))
for line in lines:
	for x1,y1,x2,y2 in line:
		cv2.line(line_image,(x1,y1),(x2,y2),(255,255,0),1)

# Draw the lines on the  image
lines_edges = cv2.addWeighted(img, 0.8, line_image, 1, 0)
points_edges = cv2.addWeighted(img, 0.8, point_image, 1, 0)

# Saves all of the images for better visualization of the process
cv2.imwrite('test/rect.png', rect_image)
cv2.imwrite('test/point.png', point_image)
cv2.imwrite('test/test.png', line_image)
cv2.imwrite('test/edges.png', mask_inv)
cv2.imwrite('test/mask.png', mask)