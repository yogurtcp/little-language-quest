from PIL import Image, ImageDraw
import math
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'icons'
root.mkdir(exist_ok=True)
for size in (192, 512):
    scale = size / 512
    image = Image.new('RGB', (size, size), '#fff9ef')
    draw = ImageDraw.Draw(image)
    def p(value): return round(value * scale)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=p(116), fill='#fff9ef')
    draw.ellipse((p(57), p(57), p(455), p(455)), fill='#a7e1d5', outline='#28324b', width=p(22))
    points = []
    for i in range(10):
        angle = -math.pi / 2 + i * math.pi / 5
        radius = 166 if i % 2 == 0 else 78
        points.append((p(256 + radius * math.cos(angle)), p(260 + radius * math.sin(angle))))
    draw.polygon(points, fill='#ffd35d')
    draw.line(points + [points[0]], fill='#28324b', width=p(16), joint='curve')
    for x in (220, 291):
        draw.ellipse((p(x-9), p(256), p(x+9), p(274)), fill='#28324b')
    draw.arc((p(220), p(284), p(292), p(335)), 10, 170, fill='#28324b', width=p(13))
    image.save(root / f'icon-{size}.png', optimize=True)
