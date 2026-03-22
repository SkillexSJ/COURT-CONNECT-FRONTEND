# Design System: High-End Athletic Editorial

## 1. Overview & Creative North Star

The Creative North Star for this system is **"The Elite Arena."** This is a design language that bridges the gap between high-performance athletic utility and the sophisticated spatial layouts of a luxury fashion editorial. We are moving away from the "generic SaaS" look of rounded cards and heavy borders, leaning instead into a world of deep tonal contrast, cinematic imagery, and expansive breathing room.

This system rejects the rigid 12-column grid in favor of **Intentional Asymmetry**. We use large-scale typography to anchor layouts, allowing imagery to break boundaries and components to overlap in a way that feels curated, not accidental. It is "Nike meets Vogue"—aggressive where it needs to be, but always impeccably tailored.

---

## 2. Colors

Our palette is rooted in the "Field" (Deep Green) and the "Flash" (Vibrant Lime). The interaction between these two creates a high-energy, premium tension.

- **Primary (`#012D1D`):** Our foundation. Use `primary_container` for deep, immersive sections and hero backgrounds. It represents the prestigious, exclusive nature of the venues.
- **Secondary/Action (`#C1F100`):** The "Energy" color. Use `secondary` and `secondary_container` for high-priority CTAs, focus states, and the "Verified" badge. This color should be used sparingly to maintain its impact.
- **Background (`#FAFAF1`):** A warm, off-white "Antique Paper" finish. This avoids the sterile look of pure white and enhances the "expensive" editorial feel.

### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined by background color shifts. For instance, a `surface_container_low` section should sit directly against a `surface` background to create a clean, modern break.

### The "Glass & Gradient" Rule

To add visual "soul," avoid flat execution. Use subtle radial gradients (e.g., `primary` transitioning to `primary_container`) in large hero areas. For floating navigation or over-image labels, utilize **Glassmorphism**: use a semi-transparent surface color with a `20px` backdrop-blur to allow the venue's textures to bleed through.

---

## 3. Typography

The typography is the backbone of the editorial feel. It should feel like a magazine spread.

- **Display & Headlines (Lexend):** Bold, modern, and unapologetic. Use `display-lg` (3.5rem) for hero sections with tight letter-spacing (-0.02em). This conveys the "Nike" influence—strength and confidence.
- **Body & Titles (Manrope):** A clean, geometric sans-serif that balances the aggression of Lexend. Manrope provides the "Vogue" sophistication—highly legible yet stylish.
- **Hierarchy Note:** Always maintain a significant scale jump between headlines and body text to create the "Editorial" contrast. Avoid middle-ground sizes that look like standard templates.

---

## 5. Components

### Buttons

- **Primary:** `secondary_fixed` (Lime) background with `on_secondary_fixed` (Deep Green) text. Use `DEFAULT` (0.25rem) or `none` (0px) roundedness for a sharp, architectural feel.
- **Secondary/Ghost:** `outline_variant` text with no background. On hover, transition to a `surface_container_high` background.

### Cards (The Venue Card)

- **No Dividers:** Forbid the use of lines within cards. Separate the venue title, price, and "Verified" status using vertical whitespace (`spacing.4`).
- **Imagery:** Venue images must use a `lg` (0.5rem) corner radius. Imagery should take up 60% of the card's visual weight.

### The "Verified" Badge

- **Style:** A small, high-contrast element using `secondary` (Lime) and a small `label-sm` font. This is our primary trust signal. It should be positioned as an "overlap" element on the top-right of venue images.

### Booking Inputs

- **Structure:** Minimalist. Use a `surface_variant` background with a `3px` bottom-only border in `primary` when focused. This feels like a high-end registration form rather than a generic app input.
