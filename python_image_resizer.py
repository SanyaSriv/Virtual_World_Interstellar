import os, sys
from PIL import Image

for infile in sys.argv[1:]:
    im = Image.open(infile)
    print(f"Original size : {im.size}")
    sunset_resized = im.resize((256, 256))
    sunset_resized.save('silver_picture.jpeg')
