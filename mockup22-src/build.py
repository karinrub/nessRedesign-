"""Build 22NESS-Offers-Point-of-View.html from mockup 19 (left untouched) and the two source files here.

Everything outside the Offers extension (hero, About, Bridge G, film engine, fonts, three.js import map) is kept
byte for byte from 19. Replaced: the title, the scroll length (one more stop: BRIDGE_CFG and the scroll-space CSS),
  CSS: from '/* 19 — the tower */' to the end of that <style> block  -> pov.css
  JS:  from '/* 19 — THE TOWER' up to '/* G — IN REGISTER'          -> pov.ext.js
Usage: python3 mockup22-src/build.py  (run from the repo root)
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent
src = root.parent / '19NESS-Offers-Elevation-Tower.html'
out = root.parent / '22NESS-Offers-Point-of-View.html'
s = src.read_text(encoding='utf8')
css, js = (root / 'pov.css').read_text(encoding='utf8'), (root / 'pov.ext.js').read_text(encoding='utf8')
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
s = swap(s, '<title>NESS — Offers 19, Elevation: The Tower</title>', '<title>NESS — Offers 22, Point of View</title>')
s = swap(s, 'window.BRIDGE_CFG={length:8.8,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3]};',
            'window.BRIDGE_CFG={length:9.7,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3,14.2]};')
s = swap(s, '(4.8 + 8.8 + 1)', '(4.8 + 9.7 + 1)')
i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + js + s[j:]
out.write_text(s, encoding='utf8')
print('built', out.name, round(len(s) / 1e6, 2), 'MB')
