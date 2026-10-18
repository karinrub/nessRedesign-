"""Build Offers 25, The Stroke, from mockup 19 (left untouched) into a NEW file.

d.js (the film) and d.css (its type) are spliced in with kit.js and base.css (plumbing). Hero, About and Bridge stay
byte for byte: only the Offers extension, its CSS, the title, the film length and the stop list are replaced.
The film is one stop longer than 24C: q 10.2 (p 15.0) is the red field the line is pulled taut across, for Packages.
Usage: python3 mockup25-src/build.py   (run from the repo root)
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent
src = (root.parent / '19NESS-Offers-Elevation-Tower.html').read_text(encoding='utf8')
kit, base = (root / 'kit.js').read_text(encoding='utf8'), (root / 'base.css').read_text(encoding='utf8')
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
js = (root / 'd.js').read_text(encoding='utf8').replace('/*KIT*/', kit)
css = '/* 19 — the tower */\n' + base + (root / 'd.css').read_text(encoding='utf8')
s = swap(src, '<title>NESS — Offers 19, Elevation: The Tower</title>', '<title>NESS — Offers 25, The Stroke</title>')
s = swap(s, 'window.BRIDGE_CFG={length:8.8,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3]};',
            'window.BRIDGE_CFG={length:10.4,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3,14.2,15.0]};')
s = swap(s, '(4.8 + 8.8 + 1)', '(4.8 + 10.4 + 1)')
i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + '/* 19 — THE TOWER (replaced) */\n' + js + s[j:]
out = root.parent / '25-NESS-Offers-The-Stroke.html'
out.write_text(s, encoding='utf8'); print('built', out.name, round(len(s) / 1e6, 2), 'MB')
