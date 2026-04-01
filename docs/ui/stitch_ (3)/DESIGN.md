# Design System Strategy: The Digital Harvest

## 1. Overview & Creative North Star
**The Creative North Star: "The Modern Estate"**
This design system rejects the "industrial" coldness of typical SaaS platforms. Instead, it adopts the persona of a high-end, digital estate—where the reliability of modern technology meets the tactile, grounded soul of the land. We achieve an "Editorial Marketplace" feel by prioritizing generous whitespace, intentional asymmetry, and a rejection of traditional UI "boxes."

To break the template look, we use **Organic Layering**. Instead of placing items in a rigid grid, elements should feel like they are laid out on a clean workbench. Use the `display-lg` typography to anchor pages, allowing imagery to bleed into margins, creating a sense of abundance and breathability.

---

## 2. Colors & Surface Architecture
Our palette is rooted in the earth. The greens represent growth and authority, while the beige tones provide a warm, human backdrop that is easier on the eyes than pure white.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning. We define boundaries through **Tonal Shifts** only. 
- A sidebar or a "Featured Producer" section should not have a border; it should transition from `surface` (#fbf9f4) to `surface-container-low` (#f5f3ee).
- Use `surface-variant` (#e4e2dd) for very subtle separation in high-density data areas.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine papers.
- **Level 0 (Base):** `surface` (#fbf9f4).
- **Level 1 (Sectioning):** `surface-container` (#f0eee9).
- **Level 2 (Active Cards):** `surface-container-lowest` (#ffffff).
- **The Signature Gradient:** Use a subtle linear gradient for Hero sections or primary CTAs: `primary` (#154212) to `primary-container` (#2d5a27). This adds "soul" and depth that a flat fill cannot achieve.

### Glass & Transparency
For floating navigation bars or mobile overlays, use **Glassmorphism**. 
- **Fill:** `surface` (#fbf9f4) at 80% opacity.
- **Effect:** `backdrop-filter: blur(12px)`.
- This ensures the rich colors of the marketplace (produce photos, farm landscapes) bleed through the UI, making the app feel integrated with the environment.

---

## 3. Typography
The type system balances the authority of a Serif with the functional clarity of a Sans-Serif.

*   **Display & Headlines (The Voice):** Use `notoSerif`. It brings an elegant, heritage feel to the "Voice of the Farmer." Use `display-lg` for impactful hero statements and `headline-md` for section titles.
*   **Body & UI (The Tool):** Use `beVietnamPro` (or *IBM Plex Sans Arabic* for the RTL implementation). This is our workhorse. It is highly legible at small scales for crop prices, weights, and logistics data.
*   **The Hierarchy Role:** Always pair a `headline-sm` (Serif) with a `body-md` (Sans) to create an editorial contrast that feels curated rather than automated.

---

## 4. Elevation & Depth
In this system, depth is "felt," not "seen."

*   **The Layering Principle:** Place `surface-container-lowest` cards on a `surface-container-low` background. This creates a natural "lift" via contrast rather than artificial shadows.
*   **Ambient Shadows:** If an element must float (e.g., a bottom sheet or a FAB), use a "Sunlight Shadow."
    *   **Value:** `0px 12px 32px`.
    *   **Color:** `on-surface` (#1b1c19) at **4% opacity**.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., in a high-contrast state), use `outline-variant` (#c2c9bb) at **20% opacity**. Never use 100% opaque lines.

---

## 5. Components & Primitive Styles

### Buttons: The Tactile Touch
- **Primary:** Gradient fill (`primary` to `primary-container`), `xl` (1.5rem) rounded corners. Text is `on-primary` (#ffffff).
- **Secondary:** `secondary-fixed` (#c8f17a) with `on-secondary-fixed` (#131f00). This olive-toned button is used for "Add to Cart" or "Contact Farmer."
- **States:** On hover, do not change color; instead, apply a subtle `surface-container-highest` inner glow.

### Cards: The Product Showcase
- **Constraint:** No borders. No dividers.
- **Spacing:** Use `spacing-6` (2rem) for internal padding to give products room to "breathe."
- **Separation:** Use vertical whitespace from our scale (`spacing-8` or `spacing-10`) to separate content blocks.

### Input Fields: Clean & Earthy
- **Default State:** `surface-container-high` (#eae8e3) background with a `none` border.
- **Focus State:** A 2px "Ghost Border" using `primary` (#154212) at 40% opacity and a subtle `primary-fixed` glow.
- **Labels:** Always use `label-md` in `on-surface-variant` (#42493e).

### Signature Component: The "Harvest Chip"
For filtering produce (e.g., "Organic," "Local," "Wholesale"), use Chips with `lg` (1rem) rounding.
- **Selected:** `tertiary-container` (#843b00) with `on-tertiary-container` (#ffb184). The clay/terracotta accent signals a "human selection."

---

## 6. Do’s and Don’ts

### Do
- **Use RTL Intent:** Ensure that the generous whitespace is mirrored correctly. The "breathing room" should be on the right side of text blocks.
- **Use the Surface Scale:** Always nest a lighter surface inside a darker surface to create importance.
- **Embrace Asymmetry:** In the marketplace landing page, stagger product images slightly off-grid to mimic a natural market stall.

### Don’t
- **Don't use black:** For text, always use `on-surface` (#1b1c19). Pure black is too harsh for the "Modern Estate" aesthetic.
- **Don't use hard corners:** The minimum radius is `DEFAULT` (0.5rem), but the preferred "signature" radius is `xl` (1.5rem).
- **Don't use dividers:** If you feel the need for a line, increase the `spacing` value by one level instead. If that fails, use a background color shift.

---

## 7. Spacing & Rhythm
We use a **Soft Grid** based on the 0.7rem increment.
- **Page Margins:** `spacing-12` (4rem) on desktop, `spacing-5` (1.7rem) on mobile.
- **Component Gap:** `spacing-4` (1.4rem).
- **Section Gap:** `spacing-16` (5.5rem). High-end design requires "wasted" space to feel premium.