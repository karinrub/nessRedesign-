"""Rebuild 19NESS-Offers-Elevation-Tower.html in place from tower.ext.js and tower.css.

The built HTML is the base: everything outside the Offers extension (hero, About, Bridge G, film engine,
fonts, three.js import map) is kept byte for byte. Only two regions are replaced:
  CSS: from '/* 19 — the tower */' to the end of that <style> block
  JS:  from '/* 19 — THE TOWER' up to '/* G — IN REGISTER'
Usage: python3 mockup19-src/rebuild.py  (run from the repo root)
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent
html_path = root.parent / '19NESS-Offers-Elevation-Tower.html'
s = html_path.read_text(encoding='utf8')
css, js = (root / 'tower.css').read_text(encoding='utf8'), (root / 'tower.ext.js').read_text(encoding='utf8')
i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + js + s[j:]
html_path.write_text(s, encoding='utf8')
print('rebuilt', html_path.name, round(len(s) / 1e6, 2), 'MB')
