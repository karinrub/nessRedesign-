"""Contact sheet: python3 mockup27abc-src/sheet.py out.jpg a.png b.png ...  [COLS=3 env; LABEL=1 prints the file's q]"""
import os, re, sys
from PIL import Image, ImageDraw
out, *fs = sys.argv[1:]
ims = [Image.open(f).convert('RGB') for f in fs]
cols = int(os.environ.get('COLS', 3 if len(ims) >= 5 else 2 if len(ims) > 1 else 1))
w, h = 720, 450
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (w * cols, h * rows), (40, 40, 40))
d = ImageDraw.Draw(S)
for i, (im, f) in enumerate(zip(ims, fs)):
    x, y = (i % cols) * w, (i // cols) * h
    S.paste(im.resize((w, h), Image.LANCZOS), (x, y))
    if os.environ.get('LABEL', '1') == '1':
        m = re.findall(r'(\d+\.\d+)', os.path.basename(f)); d.text((x + 6, y + h - 16), m[-1] if m else '', fill=(120, 200, 120))
S.save(out, quality=86)
