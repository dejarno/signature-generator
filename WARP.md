# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

## Commands

All commands assume the working directory is the repo root.

### Setup
- Install dependencies:
  - `npm install`

### Development server
- Run the server in dev mode (TypeScript via ts-node) on the default port:
  - `npm run dev`
- Change the port (default defined in `src/config.ts`):
  - `PORT=4000 npm run dev`

### Build & run
- Build the TypeScript entrypoint to `dist/index.js` and run it with Node:
  - `npm run build`
  - `npm start`
- One-shot build and run (useful for quick smoke tests of the compiled output):
  - `npm run build && npm start`

### Tests & benchmarks (Vitest)
- Run the Vitest test/bench suite (currently benchmarks only):
  - `npm test`
- Run only benchmarks:
  - `npm run bench`
- Run a single benchmark case by name (example using the existing benchmark):
  - `npx vitest bench test/bench/signature.bench.ts -t "generateSignatureHtml - typical input"`

### Linting / formatting
- There is no dedicated lint or format script configured in `package.json`. Prefer making small, focused changes and run the test/bench commands above after edits.

---

## Architecture overview

### Top-level entrypoint
- `index.ts`
  - CLI-style entrypoint that starts the HTTP server when executed directly via Node/ts-node.
  - Imports `startServer` from `src/server.ts` and `DEFAULT_PORT` from `src/config.ts`, then calls `startServer(DEFAULT_PORT)` when `require.main === module`.

### HTTP server layer
- `src/server.ts`
  - Implements a minimal Node HTTP server using the built-in `http`, `url`, and `querystring` modules (no Express/fastify dependency).
  - Key responsibilities:
    - Request routing based on method and path:
      - `GET /` → renders the HTML form page from `renderFormPage()`.
      - `POST /generate` → parses `application/x-www-form-urlencoded` body into form data, validates required fields, then calls `generateSignatureHtml()` and returns the HTML as a downloadable attachment (`signature.html`).
      - `POST /preview` → same payload shape as `/generate`, but returns the HTML directly for live preview embedding.
      - Any other route → 404 text response.
    - Manual body parsing via `parseBody(req)` to avoid extra dependencies.
    - Logging of basic request information and validation errors to stdout.
  - Uses CommonJS `require` for local modules (`./signature`, `./form`) to keep runtime interop simple even though the codebase is TypeScript.

### Configuration & defaults
- `src/config.ts`
  - `DEFAULT_PORT`: parsed from `process.env.PORT` with a fallback of `3000`.
  - `DEFAULTS`: central place for the default signature form values and color settings (name, title, email, phone, website, logo URL, LinkedIn URL, `accentColor`, `accentHue`).
  - Shared between the server-side form renderer (`src/form.ts`) and, indirectly, the signature generator through the form’s submitted values.
- `config.ts` (repo root)
  - Legacy/duplicate version of the defaults without accent color fields. Prefer `src/config.ts` when adding new behavior; treat the root-level file as historical/cleanup candidate.

### HTML form & front-end behavior
- `src/form.ts`
  - Exposes a single function `renderFormPage(): string` that returns the complete HTML document for the signature generator UI.
  - Structure:
    - Static HTML + inline `<style>` defining layout, responsive behavior, and accent-color-driven theming.
    - A form (`#sig-form`) posting to `/generate` for the downloadable signature file.
    - A live preview section with an `<iframe id="preview">` that is populated via calls to `/preview`.
  - Front-end logic (inline `<script>`):
    - Reads and updates accent color controls (`accentHue` slider, hidden `accentColor` input) using HSL→HEX conversion and color mixing utilities.
    - Keeps CSS custom properties (`--accent-color`, `--accent-gradient-from`, `--accent-gradient-to`, etc.) in sync to drive the visual theme.
    - On form `input` events and on `DOMContentLoaded`, serializes form data to `application/x-www-form-urlencoded`, POSTs to `/preview`, and writes the returned HTML into the preview iframe.

### Signature HTML renderer
- `src/signature.ts`
  - Core rendering engine that converts a `SignatureData`-shaped object (loosely typed as `any` today) into a fully inlined HTML email signature.
  - Responsibilities:
    - Sanitization:
      - `escapeHtml` escapes `&`, `<`, `>`, `"`, and `'` to avoid injecting raw HTML.
    - Color utilities:
      - `normalizeHexColor`, `hexToRgb`, `rgbToHex`, `mixHexColors`, `shadeHexColor` for handling accent color, computing lighter/darker shades, and generating a gradient.
    - HTML generation:
      - Produces a `<table>`-based layout for email client compatibility with inline styles only (no external CSS).
      - Embeds the logo image, name, title, and contact info.
      - Conditionally includes sections for phone, website, and LinkedIn depending on whether the corresponding fields are present.
      - Normalizes certain values for links (e.g., `mailto:`, `tel:` with digit-only phone, `https://` prefix for websites missing a scheme).

### Types & data contracts
- `src/types.ts`
  - Defines the `SignatureData` interface (name/title/email/phone/website/logoUrl/linkedinUrl/accent fields) to describe the expected payload for signature generation.
  - The runtime server currently uses `any` when assembling data objects for `generateSignatureHtml`; when refactoring, prefer wiring everything through this interface for better type safety.

### Testing & benchmarking
- `vitest.config.ts`
  - Configures Vitest to run in Node environment with globals enabled.
  - Includes test and bench files under `test/**/*.test.{ts,tsx,js,jsx}` and `test/**/*.bench.{ts,js}`.
- `test/bench/signature.bench.ts`
  - Uses Vitest’s `bench` API to benchmark `generateSignatureHtml`.
  - Measures both a typical synchronous call and a defensive async scenario (treating the return value as possibly promise-like).

---

## Things to keep in mind when editing

- Server/runtime style:
  - The server uses Node’s built-in `http` module and manual routing/parsing by design; introducing a framework (Express, etc.) would be a larger architectural change.
  - Local imports in `src/server.ts` and `src/form.ts` intentionally use `require` to avoid ESM/TS interop issues at runtime.
- Shared defaults:
  - Any new fields added to the signature (e.g., social links, address lines) should be wired through `src/config.ts` → `src/form.ts` (form inputs + front-end scripting) → `src/server.ts` (parsing/validation) → `src/signature.ts` (rendering).
- Tests/benches:
  - New behavior around signature rendering is a good fit for additional Vitest tests/benches colocated under `test/` following the existing naming and config patterns.
