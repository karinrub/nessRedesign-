"""Build 20NESS-Offers-The-Line.html from mockup 19 (left untouched) and the two source files here.

Everything outside the Offers extension (hero, About, Bridge G, film engine, fonts, three.js import map) is kept
byte for byte from 19. Only these are replaced:
  title, the scroll length (BRIDGE_CFG and the scroll-space CSS),
  CSS: from '/* 19 — the tower */' to the end of that <style> block  -> line.css
  JS:  from '/* 19 — THE TOWER' up to '/* G — IN REGISTER'          -> line.ext.js
Usage: python3 mockup20-src/build.py  (run from the repo root)
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent
src = root.parent / '19NESS-Offers-Elevation-Tower.html'
out = root.parent / '20NESS-Offers-The-Line.html'
s = src.read_text(encoding='utf8')
css, js = (root / 'line.css').read_text(encoding='utf8'), (root / 'line.ext.js').read_text(encoding='utf8')
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
s = swap(s, '<title>NESS — Offers 19, Elevation: The Tower</title>', '<title>NESS — Offers 20, The Line</title>')
i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + js + s[j:]
out.write_text(s, encoding='utf8')
print('built', out.name, round(len(s) / 1e6, 2), 'MB')
