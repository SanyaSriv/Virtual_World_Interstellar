import os, sys
from PIL import Image

for infile in sys.argv[1:]:
    im = Image.open(infile)
    print(f"Original size : {im.size}")
    sunset_resized = im.resize((1024, 1024))
    sunset_resized.save('bh_reduced.jpeg')
