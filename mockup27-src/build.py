"""Build Offers 27, The Crest Study, from mockup 19 (left untouched).

Each direction is its own script (a.js, b.js, c.js) and stylesheet (a.css, b.css, c.css); kit.js and base.css are only
plumbing (the wire, the camera, the film hooks), spliced into each file. Hero, About, Bridge stay byte for byte.
Usage: python3 mockup24-src/build.py [a b c]   (run from the repo root)
"""
import pathlib, sys
root = pathlib.Path(__file__).resolve().parent
src = (root.parent / '19NESS-Offers-Elevation-Tower.html').read_text(encoding='utf8')
kit, base = (root / 'kit.js').read_text(encoding='utf8'), (root / 'base.css').read_text(encoding='utf8')
NAMES = {'c': ('', 'The Crest Study')}
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
for d in (sys.argv[1:] or ['a', 'b', 'c']):
    L, name = NAMES[d]
    js = (root / f'{d}.js').read_text(encoding='utf8').replace('/*KIT*/', kit)
    css = '/* 19 — the tower */\n' + base + (root / f'{d}.css').read_text(encoding='utf8')
    s = swap(src, '<title>NESS — Offers 19, Elevation: The Tower</title>', f'<title>NESS — Offers 27{L}, {name}</title>')
    s = swap(s, 'window.BRIDGE_CFG={length:8.8,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3]};',
                'window.BRIDGE_CFG={length:9.7,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3,14.2]};')
    s = swap(s, '(4.8 + 8.8 + 1)', '(4.8 + 9.7 + 1)')
    i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
    i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + '/* 19 — THE TOWER (replaced) */\n' + js + s[j:]
    out = root.parent / f'27{L}-NESS-Offers-{name.replace(" ", "-")}.html'
    out.write_text(s, encoding='utf8'); print('built', out.name, round(len(s) / 1e6, 2), 'MB')
