"""Build Offers 27A, 27B, 27C (three directions) from mockup 19 (left untouched), each into its own NEW file.

kit27.js and base27.css are the shared kit (frozen); a.js/a.css, b.js/b.css, c.js/c.css are the three films.
Hero, About and Bridge stay byte for byte: only the Offers extension, its CSS, the title, the film length and the stops change.
Usage: python3 mockup27abc-src/build.py [a b c]   (from the repo root)
"""
import pathlib, sys
root = pathlib.Path(__file__).resolve().parent
src = (root.parent / '19NESS-Offers-Elevation-Tower.html').read_text(encoding='utf8')
kit, base = (root / 'kit27.js').read_text(encoding='utf8'), (root / 'base27.css').read_text(encoding='utf8')
NAMES = {'a': ('27A', 'The Hanging Model'), 'b': ('27B', 'The Orb'), 'c': ('27C', 'The Keepers Light')}
TITLE = {'c': 'The Keeper’s Light'}
# section stops in q (heading, Websites, Photography, Rebuilds, Care: hook and reveal; whole, end, hand-off), then as p = q + 4.8
QS = [3.9, 4.7, 5.5, 6.3, 7.1, 7.9, 8.7, 9.5, 10.3, 11.2, 12.0, 12.8]
LENGTH = round(QS[-1] + .2, 2)
STOPS = [5.8, 6.13, 6.46, 6.8, 7.3] + [round(q + 4.8, 2) for q in QS]
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
for d in (sys.argv[1:] or ['a', 'b', 'c']):
    num, name = NAMES[d]
    js = (root / f'{d}.js').read_text(encoding='utf8').replace('/*KIT*/', kit)
    css = '/* 19 — the tower */\n' + base + (root / f'{d}.css').read_text(encoding='utf8')
    s = swap(src, '<title>NESS — Offers 19, Elevation: The Tower</title>', f'<title>NESS — Offers {num}, {TITLE.get(d, name)}</title>')
    s = swap(s, 'window.BRIDGE_CFG={length:8.8,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3]};',
                'window.BRIDGE_CFG={length:%s,stops:[%s]};' % (LENGTH, ','.join(f'{v:g}' for v in STOPS)))
    s = swap(s, '(4.8 + 8.8 + 1)', f'(4.8 + {LENGTH} + 1)')
    i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
    i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + '/* 19 — THE TOWER (replaced) */\n' + js + s[j:]
    out = root.parent / f'{num}-NESS-Offers-{name.replace(" ", "-")}.html'
    out.write_text(s, encoding='utf8'); print('built', out.name, round(len(s) / 1e6, 2), 'MB')
