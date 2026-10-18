import sys
from PIL import Image
out, *fs = sys.argv[1:]
ims = [Image.open(f).convert('RGB') for f in fs]
cols = 2 if len(ims) > 1 else 1
if len(ims) >= 6: cols = 3
w, h = 720, 450
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (w * cols, h * rows), (40, 40, 40))
for i, im in enumerate(ims):
    S.paste(im.resize((w, h), Image.LANCZOS), ((i % cols) * w, (i // cols) * h))
S.save(out, quality=88)
