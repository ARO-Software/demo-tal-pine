# Tal Pine (تل الصنوبر): website concept

A bilingual (English / Arabic, RTL) website concept for **Tal Pine**, a pine-forest restaurant and wedding venue on Airport Road, Amman. Built by ARO Solutions.

**Live:** https://aro-software.github.io/demo-tal-pine/

## What's in it

- **Hero:** the venue reel plays inside the Tal Pine calligraphy (traced from the logo), then the camera flies into the letters as you scroll.
- **One hill, two moods:** day / night switch that defaults to the current time in Amman.
- **Spaces:** the White Terrace, Under the Pines, the Canopies, the Cabins and the Lookout (pinned horizontal rail on desktop).
- **Menu highlights** and a table reservation sheet.
- **Weddings on the hill:** a four-step event request flow (occasion, date with availability, space and package, details) with a calendar (.ics) export.
- **Design your night (AI prototype):** type a brief in English or Arabic and get a concept board: space, palette, live floor plan with tables, run of the night, buffet and décor. It can hand the concept straight to the event request.

## Before going live

These are demo values to confirm with the venue: space capacities, menu lines, packages, wedding availability (simulated), and live music days.

## WhatsApp

Event requests and table bookings open WhatsApp with a filled-in message to **+962 7 7800 6800** (set in `assets/js/data.js`, `WA_DEFAULT`). For a live demo you can route them to another phone by opening the site with `?wa=07XXXXXXXX`; the device remembers it until you open `?wa=reset`.

## Run locally

```bash
python3 -m http.server 5173
```

Plain HTML, CSS and JavaScript. GSAP (cdnjs) drives the scroll effects. `tools/inject_svg.py` re-injects the traced logo paths into `index.html`.
