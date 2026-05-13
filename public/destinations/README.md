# Destination photos

Drop city photos in this directory and they'll automatically replace the
gradient placeholders rendered in the Destinations section.

## File convention

Each photo must be named exactly `{id}.jpg`, where `{id}` matches the `id`
field in [`src/components/sections/destinations/data.ts`](../../src/components/sections/destinations/data.ts):

| File                  | Belongs to chapter |
| --------------------- | ------------------ |
| `istanbul.jpg`        | Istanbul           |
| `cappadocia.jpg`      | Cappadocia         |
| `antalya.jpg`         | Antalya            |
| `trabzon.jpg`         | Trabzon            |
| `bursa.jpg`           | Bursa              |
| `sapanca.jpg`         | Sapanca            |

## Image specs

- **Aspect ratio:** ideally portrait `4 / 5` (the chapter slot is
  `aspect-[4/5]`). Any aspect works — it's `object-cover`'d — but landscapes
  will get cropped.
- **Recommended size:** ~1200 × 1500 px, JPEG 80–85 quality. Larger is fine
  but wastes bandwidth; the slot is at most ~480 px wide on desktop.
- **Subject placement:** keep your hero subject in the upper two-thirds of
  the frame — the chapter applies a navy gradient over the bottom third for
  text contrast.
- **Color palette:** photos with naturally cool / blue tones blend best with
  the brand chrome, but warm-toned shots also work since each chapter card
  has its own per-destination accent border.

## Fallback behaviour

If a photo is missing, [`DestChapter.tsx`](../../src/components/sections/destinations/DestChapter.tsx)
catches the 404 and renders a styled gradient placeholder built from the
destination's `color` + `accent` plus the city emoji glyph — designed to
look intentional, not broken, until real photography lands.
