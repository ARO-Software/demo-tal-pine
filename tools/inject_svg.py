"""Inject potrace-traced logo paths into index.html between the SVG markers.

Usage: python3 tools/inject_svg.py <ar.svg> <full.svg>
ar.svg   -> #mark-ar-g   (Arabic letterforms, 2340x2010 space, used by the hero stencil)
full.svg -> #logo-ar-g + #logo-pine-g (2340x2100 space, nav/footer logo)
"""
import re, sys, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
ar_svg, full_svg = (pathlib.Path(p).read_text() for p in sys.argv[1:3])

def paths(svg):
    return re.findall(r'<path d="([^"]+)"', svg)

def flat(d):
    return re.sub(r'\s+', ' ', d).strip()

ar = paths(ar_svg)
full = paths(full_svg)
start_y = lambda d: float(re.match(r'M\S+ (\S+)', d).group(1))
pine = [d for d in full if start_y(d) < 400]
arabic = [d for d in full if start_y(d) >= 400]

g = lambda id_, h, ds, extra='': (
    f'<g id="{id_}" transform="translate(0,{h}) scale(1,-1)"{extra}>'
    + ''.join(f'<path pathLength="1" d="{flat(d)}"/>' for d in ds) + '</g>')

block = '\n'.join([
    g('mark-ar-g', 2010, ar),
    g('logo-ar-g', 2100, arabic),
    g('logo-pine-g', 2100, pine),
])
html = (root / 'index.html').read_text()
html = re.sub(r'<!--SVG:START-->.*?<!--SVG:END-->', lambda m: f'<!--SVG:START-->\n{block}\n<!--SVG:END-->', html, flags=re.S)
(root / 'index.html').write_text(html)
print(f'mark-ar: {len(ar)} paths, logo: {len(arabic)} arabic + {len(pine)} pine, html {len(html)//1024} KB')
