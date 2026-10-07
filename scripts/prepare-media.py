"""Reproducible, non-destructive derivatives of supplied stock media."""
from pathlib import Path
from PIL import Image, ImageOps
import subprocess, json

root = Path(__file__).resolve().parents[1]
assets = root / 'public/assets'
out = assets / 'optimized'
out.mkdir(exist_ok=True)
manifest = []

def responsive(image, stem, source):
    image = ImageOps.exif_transpose(image).convert('RGB')
    for width in (640, 1100, 1800):
        target = image.copy()
        target.thumbnail((width, 3000), Image.Resampling.LANCZOS)
        path = out / f'{stem}-{width}.webp'
        target.save(path, quality=84, method=6)
        manifest.append({'file':path.name, 'source':source, 'width':target.width, 'height':target.height, 'bytes':path.stat().st_size})

for path in (assets/'rooms').glob('*.jpg'):
    responsive(Image.open(path), path.stem, f'rooms/{path.name}')

frames = [('hero-villa', 5.5, 'hero-poster'), ('hero-villa', 7.4, 'pool'),
          ('hero-villa', 1.5, 'terrace'), ('ocean-balcony', .2, 'balcony-poster'),
          ('ocean-balcony', 12, 'arrival'), ('aerial-resort', 3.5, 'aerial-poster'),
          ('aerial-resort', 6, 'last-light')]
for film, time, stem in frames:
    data = subprocess.check_output(['ffmpeg','-v','error','-ss',str(time),'-i',str(assets/f'video/{film}.mp4'),'-frames:v','1','-f','image2pipe','-vcodec','png','-'])
    from io import BytesIO
    responsive(Image.open(BytesIO(data)), stem, f'video/{film}.mp4 @ {time}s')

for film in ('hero-villa','ocean-balcony','aerial-resort'):
    for variant, width in [('desktop',1080 if film=='hero-villa' else 1600), ('mobile',640 if film=='hero-villa' else 960)]:
        target = out / f'{film}-{variant}.mp4'
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(assets/f'video/{film}.mp4'),'-an','-vf',f'scale={width}:-2,fps=25','-c:v','libx264','-preset','medium','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(target)],check=True)
        manifest.append({'file':target.name,'source':f'video/{film}.mp4','bytes':target.stat().st_size})
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(f'Prepared {len(manifest)} derivatives; originals untouched.')
