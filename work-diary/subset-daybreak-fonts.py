"""Rebuild homepage subsets from committed originals; fonttools 4.66.0 + brotli 1.2.0."""
from pathlib import Path
from io import BytesIO
import hashlib, json, subprocess
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
BASE = '9800476'
files = [ROOT / 'src/lib/daybreak/index.ts', ROOT / 'src/lib/cc/coach-languages.ts']
files += list((ROOT / 'src/components/marketing/daybreak').glob('*.tsx'))
text = ''.join(p.read_text(encoding='utf-8') for p in files)
# Entire Latin-1 repertoire for English/Spanish; actual rendered script glyphs.
chars = set(range(32, 256)) | {ord(c) for c in text} | {0x200c, 0x200d}
names = ['nunito-sans-400', 'noto-sans-devanagari-400', 'noto-sans-gurmukhi-400', 'noto-nastaliq-urdu']
welcomes = {'noto-sans-devanagari-400':'हिन्दी आपका स्वागत है', 'noto-sans-gurmukhi-400':'ਪੰਜਾਬੀ ਜੀ ਆਇਆਂ ਨੂੰ', 'noto-nastaliq-urdu':'اردو خوش آمدید'}
records = []
for name, welcome in [(n,False) for n in names] + [(n,True) for n in welcomes]:
    path = f'public/fonts/daybreak/{name}.woff2'
    original = subprocess.check_output(['git', 'show', f'{BASE}:{path}'], cwd=ROOT)
    font = TTFont(BytesIO(original), recalcTimestamp=False)
    selected = {ord(c) for c in welcomes[name]} if welcome else chars
    required = selected & set(font.getBestCmap())
    if 'fvar' in font:
        axes = {a.axisTag: ((400 if welcome else (400, 700)) if a.axisTag == 'wght' else a.defaultValue) for a in font['fvar'].axes}
        font = instantiateVariableFont(font, axes, inplace=True)
        # Materialize instancer's glyph renames before subset's lazy gvar lookup.
        materialized = BytesIO()
        font.save(materialized)
        materialized.seek(0)
        font = TTFont(materialized, recalcTimestamp=False)
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']  # Keep contextual script shaping closure.
    options.recalc_timestamp = False
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=required)
    sub.subset(font)
    # Distinct derivative family names; CSS names remain stable aliases.
    for entry in font['name'].names:
        if entry.nameID in (1, 4, 6, 16):
            value = 'DaybreakSubset-' + name
            entry.string = value.encode(entry.getEncoding())
    suffix = 'welcome' if welcome else 'subset'
    output = ROOT / f'public/fonts/daybreak/{name}-{suffix}.woff2'
    font.save(output)
    check = TTFont(output)
    assert required <= set(check.getBestCmap()), name
    payload = output.read_bytes()
    records.append(dict(file=str(output.relative_to(ROOT)).replace('\\','/'), before=len(original), after=len(payload), requiredCodepoints=sorted(required), sha256=hashlib.sha256(payload).hexdigest()))
    (ROOT / path).unlink(missing_ok=True)  # Only superseded originals, never shared dependencies.
(ROOT / 'work-diary/d3-impl-1-1-evidence/font-subsets.json').write_text(json.dumps(records, indent=2)+'\n', encoding='utf-8')
print(json.dumps([{k:r[k] for k in ('file','before','after')} for r in records], indent=2))
