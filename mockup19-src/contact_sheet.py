import sys
from PIL import Image
out, names = sys.argv[1], sys.argv[2:]
ims = [Image.open(n).resize((720, 450)) for n in names]
rows = (len(ims) + 1) // 2
sh = Image.new('RGB', (1440, 450 * rows), 'white')
for i, im in enumerate(ims): sh.paste(im, ((i % 2) * 720, (i // 2) * 450))
sh.save(out)
