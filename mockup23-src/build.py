"""Build the three directions of Offers 23 from mockup 19 (left untouched) and the two source files here.

23A: The Line · 23B: Three Lines · 23C: The Full Stop. One source; the direction is set per file (__DIR__).
Everything outside the Offers extension (hero, About, Bridge G, film engine, fonts, three.js) is kept byte for byte.
Replaced: title, scroll length (one more stop), the 19 CSS region -> line23.css, the 19 JS region -> line23.ext.js.
Usage: python3 mockup23-src/build.py  (run from the repo root)
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent
src = (root.parent / '19NESS-Offers-Elevation-Tower.html').read_text(encoding='utf8')
css, js = (root / 'line23.css').read_text(encoding='utf8'), (root / 'line23.ext.js').read_text(encoding='utf8')
def swap(s, a, b):
    assert s.count(a) == 1, a
    return s.replace(a, b)
for d, name in [('A', 'The Line'), ('B', 'Three Lines'), ('C', 'The Full Stop')]:
    s = swap(src, '<title>NESS — Offers 19, Elevation: The Tower</title>', f'<title>NESS — Offers 23{d}, {name}</title>')
    s = swap(s, 'window.BRIDGE_CFG={length:8.8,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3]};',
                'window.BRIDGE_CFG={length:9.7,stops:[5.8,6.13,6.46,6.8,7.3,8.7,9.6,10.5,11.4,12.3,13.3,14.2]};')
    s = swap(s, '(4.8 + 8.8 + 1)', '(4.8 + 9.7 + 1)')
    i = s.index('/* 19 — the tower */'); j = s.index('</style>', i); s = s[:i] + css + s[j:]
    i = s.index('/* 19 — THE TOWER'); j = s.index('/* G — IN REGISTER'); s = s[:i] + js.replace("'__DIR__'", f"'{d}'") + s[j:]
    out = root.parent / f'23{d}NESS-Offers-{name.replace(" ", "-")}.html'
    out.write_text(s, encoding='utf8')
    print('built', out.name, round(len(s) / 1e6, 2), 'MB')
