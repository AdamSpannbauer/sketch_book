import cv2
import numpy as np


im = cv2.imread('assets/dos_logo_raw.png')
im_bgra = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)

gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
_, threshed = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY)

bg_pixels = np.where(threshed == 255)
im_bgra[bg_pixels] = (255, 255, 255, 0)

cv2.imwrite('dos_logo_rm_bg.png', im_bgra)
