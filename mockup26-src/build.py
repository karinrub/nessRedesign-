"""Build Offers 26, The Strand Works, from mockup 19 (left untouched) into a NEW file.

e.js is the film; forms.js the four strand families; kit26.js and base.css the plumbing; e.css the type.
Hero, About and Bridge stay byte for byte: only the Offers extension, its CSS, the title, the film length and the stop list change.
q 10.2 (p 15.0) is the red hand-off to Packages, as in 25.   Usage: python3 mockup26-src/build.py   (from the repo root)
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent
src = (root.parent / '19NESS-Offers-Elevation-Tower.html').read_text(encoding='utf8')
kit, base = (root / 'kit26.js').read_text(encoding='utf8'), (root / 'base.css').read_text(encoding='utf8')
forms = (root / 'forms.js').read_text(encoding='utf8')
assert forms.count('export const FORMS =') == 1
forms = 'const FORMS = (() => {\n' + forms.replace('export const FORMS =', 'return') + '\n})();'
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
js = (root / 'e.js').read_text(encoding='utf8').replace('/*KIT*/', kit).replace('/*FORMS*/', forms)
css = '/* 19 — the tower */\n' + (root / 'base.css').read_text(encoding='utf8') + (root / 'e.css').read_text(encoding='utf8')
s = swap(src, '<title>NESS — Offers 19, Elevation: The Tower</title>', '<title>NESS — Offers 26, The Strand Works</title>')
s = swap(s, 'window.BRIDGE_CFG={length:8.8,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3]};',
            'window.BRIDGE_CFG={length:10.4,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3,14.2,15.0]};')
s = swap(s, '(4.8 + 8.8 + 1)', '(4.8 + 10.4 + 1)')
i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + '/* 19 — THE TOWER (replaced) */\n' + js + s[j:]
out = root.parent / '26-NESS-Offers-The-Strand-Works.html'
out.write_text(s, encoding='utf8'); print('built', out.name, round(len(s) / 1e6, 2), 'MB')
