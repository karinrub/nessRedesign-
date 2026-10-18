"""Contact sheet with labels. usage: python3 sheet.py out.jpg cols width img1 img2 ..."""
import sys, os
from PIL import Image, ImageDraw
out, cols, W, names = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:]
ims = [Image.open(n).convert('RGB') for n in names]
w = W // cols; h = int(w * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (W, rows * (h + 18)), (60, 60, 60)); d = ImageDraw.Draw(sh)
for i, (im, n) in enumerate(zip(ims, names)):
    x, y = (i % cols) * w, (i // cols) * (h + 18)
    sh.paste(im.resize((w, h)), (x, y + 18)); d.text((x + 4, y + 3), os.path.basename(n), fill=(255, 255, 0))
sh.save(out, quality=85)
