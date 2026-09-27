# Daybreak fonts

Self-hosted for DESIGN.md v2, 2026-09-26; homepage subsets added 2026-09-27. All are SIL Open Font License 1.1. The full corresponding license is retained beside each font in `daybreak/`; redistribution must retain it. Atkinson files are unchanged. Display and script derivatives have distinct internal `DaybreakSubset-*` family names.

| Family / files | Source | License |
|---|---|---|
| Atkinson Hyperlegible, 400 and700 | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegible) | [OFL](daybreak/LICENSE-atkinson.txt) |
| Nunito Sans, variable400–700 (shared original file) | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/nunitosans) | [OFL](daybreak/LICENSE-nunito.txt) |
| Noto Sans Devanagari, variable400–700 | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/notosansdevanagari) | [OFL](daybreak/LICENSE-devanagari.txt) |
| Noto Sans Gurmukhi, variable400–700 | [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/notosansgurmukhi) | [OFL](daybreak/LICENSE-gurmukhi.txt) |
| Noto Nastaliq Urdu, 400 | Existing @fontsource/noto-nastaliq-urdu5.2.8 package, Arabic subset | [OFL](daybreak/LICENSE-nastaliq.txt) |

The approved D3-R2 specimens downloaded the Google Fonts CSS/font files and their repository licenses on 2026-09-26. The original licensed bytes are retained in the slice-1 commit; current derivatives are documented below. Exact-URL provenance is retained in `work-diary/d3-impl-1-evidence/font-sources.json`. CSS aliases `Daybreak ...` isolate usage from legacy global faces; `font-display:swap` prevents invisible text. Script fallback selection does not claim complete platform translation or native-speaker review.

## D3-IMPL-1.1 derivatives

Reproduce with `work-diary/subset-daybreak-fonts.py` using fonttools 4.66.0 and brotli 1.2.0. It reads originals from commit 9800476, keeps Latin-1 and script characters present in the homepage/check copy, retains OpenType shaping features and verifies cmap coverage. Display weight is 400–700; unused variable axes are pinned to their defaults. Exact before/after sizes and hashes: `work-diary/d3-impl-1-1-evidence/font-subsets.json`.

`*-welcome.woff2` contains only the permanent welcome-band words, at regular weight. The larger `*-subset.woff2` script faces load when the visitor selects that language. They are not suitable for arbitrary user-authored script text. Regenerate after translated copy changes. Unmigrated app surfaces retain the complete @fontsource Urdu family; the duplicate original Daybreak Urdu binary is removed. The two derivatives serve different copy scopes, not duplicate full font files. Only the Nunito hero face is preloaded; legacy root face definitions remain available without eager preload.
