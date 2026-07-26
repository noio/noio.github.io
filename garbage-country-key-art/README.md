# Garbage Country — Key Art Viewer

One-page viewer for showing key art proposals to the team, with a Steam-store-style
grid preview. Live at `https://noio.nl/garbage-country-key-art/`.

## Adding key art

1. Drop images into `art/<BranchName>/`, one subfolder per design branch:

   ```
   art/Red/2026-07-25_1430 first-draft.png
   art/Red/2026-07-26_0915 more-contrast.png
   art/Turquoise/2026-07-25_1600 initial.png
   ```

   Files sort by filename, so a date+time prefix orders them into v01, v02, …
   Any of png / jpg / jpeg / webp / gif works, at any resolution.

2. Run `python3 generate-catalog.py` (regenerates `catalog-data.js`).
3. Commit + push. GitHub Pages picks it up.

## Sharing a link

The URL always reflects what you're looking at, e.g.

```
https://noio.nl/garbage-country-key-art/?b=Red&v=3          → Red v03, full view
https://noio.nl/garbage-country-key-art/?b=Red&v=3&view=store → same, in the store grid
```

## Store preview

Neighbor games are configured at the top of `viewer.js` (`NEIGHBORS`), pulled live
from the Steam CDN. The grid shows **main capsules** (616×353, as in "your personal
calendar"), scaled to 375×215 with `object-fit: cover`, so arbitrary-sized key art
clips/scales the way Steam would show it.

## List preview (small capsule)

The LIST view mimics the homepage "New Releases" tab: 184×69 capsules with title,
tags, release date and price. Rows come from a snapshot of Steam's actual New
Releases — refresh it with `python3 update-store-list.py` (regenerates
`store-list-data.js`), then commit. Our row's tags/date/price live in `OUR_ROW`
at the top of `viewer.js`; the capsule is whatever branch/version is selected,
so make a dedicated small-capsule branch (e.g. `Red-SmallCapsule`) for honest
comparisons.

Keyboard: ←/→ versions, `f`/`s`/`l` views.
