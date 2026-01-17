Below is a full, step-by-step blueprint for implementing the **Palindrome Tip Calculator PWA** exactly as described in your spec  — in a **test-driven, incremental, no-big-jumps** way.

I’m going to do this in 4 layers:

1. **Blueprint (architecture + rules)**
2. **Chunks (milestones that build on each other)**
3. **Chunks → smaller steps → even smaller steps**
4. **A complete sequence of “codegen LLM prompts”** (each prompt is ready to paste into a coding model, with TDD + wiring-up each time)

---

# 1) Blueprint

## Goals (what “done” means)

* Two inputs: **Subtotal** and **Total w/ tax**
* Button: **Calculate** runs algorithm and shows result block
* Button: **Clear** resets everything and focuses subtotal
* Output format is **exactly**:

```
20% tip = [tip]
Palindrome tip = [pTip]
PTotal = [pTotal] = [oTotal] + [pTip]
```

* Validation + inline errors (results stay hidden on errors)
* Dark-mode, mobile-first layout
* PWA: manifest + service worker cache-first offline support
* Hosted on GitHub Pages

(Everything aligns to spec .)

---

## Key design decisions (to make this safe + testable)

### ✅ Keep “math logic” pure and isolated

Create a single pure module (ex: `calc.js`) that contains:

* `simplifySubtotal`
* `calculateBaseTip`
* `generatePalindromeTotal`
* `calculatePalindromeTip`
* `formatCurrency`
* `formatResults`
* `calculateAll` (the orchestration function returning all outputs)

This makes unit testing easy and keeps UI bugs from corrupting business logic.

---

### ✅ Use “cents-safe” comparisons in tests

JS floats can be annoying, so tests should:

* compare currency values using integer cents
* or use a small epsilon in `assertClose()`

You can still display with `.toFixed(2)` (spec-compliant) .

---

### ✅ Testing with zero build step

Since this is vanilla + GitHub Pages:

* Add a `tests.html` that loads `calc.js` + `tests.js`
* Tests run in-browser with a tiny harness (PASS/FAIL list)

This stays fully static and works anywhere.

---

### ✅ UI wiring comes after logic is proven

We’ll do it in this order:

1. tests + calc engine
2. HTML/CSS skeleton
3. validation + UI behaviors
4. PWA plumbing last (manifest + SW)

That ensures you always have a working app even mid-build.

---

# 2) Project chunks (first pass)

Each chunk ends in a usable, integrated state.

### Chunk A — Core engine + tests

* Implement palindrome/tip functions
* Add full unit test coverage from spec test cases

### Chunk B — UI scaffold

* Create HTML layout + CSS dark theme
* Results hidden until successful calculation

### Chunk C — Validation + interaction behaviors

* Inline error messaging
* Correct focus behavior
* Calculate and Clear fully wired

### Chunk D — PWA + offline

* Add manifest.json
* Add service-worker.js with cache-first strategy
* Confirm offline works

### Chunk E — Polish + deploy checklist

* Mobile ergonomics (spacing, button sizes)
* GitHub Pages verification checklist

---

# 3) Chunk breakdown (second pass → smaller steps)

## Chunk A — Core engine + tests (broken down)

A1. Create minimal test harness (`tests.html`, `tests.js`)
A2. Implement `simplifySubtotal()` + tests
A3. Implement `calculateBaseTip()` + tests
A4. Implement `generatePalindromeTotal()` + edge-case tests
A5. Implement end-to-end `calculateAll()` + full scenario tests
A6. Implement formatting functions + exact output tests

## Chunk B — UI scaffold

B1. Create `index.html` structure with IDs matching spec
B2. Create `styles.css` dark UI + mobile layout
B3. Add results block that can be hidden/shown

## Chunk C — Validation + UI wiring

C1. Add DOM wiring skeleton (`app.js`)
C2. Implement parse + validation functions (unit-test them!)
C3. Wire Calculate → validate → calc → show results
C4. Wire Clear → reset → hide results → focus subtotal
C5. Add “Enter key triggers Calculate” + focus/select behavior

## Chunk D — PWA + offline

D1. Add `manifest.json` + `<link rel="manifest">`
D2. Add `service-worker.js` + register in app
D3. Verify cache list matches spec
D4. Confirm offline load + calculation works

## Chunk E — Polish + deploy

E1. Add icon folder + placeholders
E2. Manual QA pass against spec test tables
E3. GitHub Pages deploy checklist

---

# 4) One more round: “right-sized” micro-steps (third pass)

These are intentionally small enough to implement + test safely:

### A1 — Test harness

* A1.1 Create `tests.html` with a `<pre id="test-output">`
* A1.2 Create `tests.js` with `test()`, `assertEqual()`, `assertClose()`
* A1.3 Add a “smoke test” that always passes

### A2 — simplifySubtotal

* A2.1 Add `calc.js` export skeleton
* A2.2 Implement `simplifySubtotal`
* A2.3 Add 5 tests from spec

### A3 — calculateBaseTip

* A3.1 Implement `calculateBaseTip`
* A3.2 Add 5 tests from spec

### A4 — generatePalindromeTotal

* A4.1 Implement happy path (2-digit dollars)
* A4.2 Implement 1-digit dollars (pad trailing zero)
* A4.3 Implement 3+ digits (take first 2 reversed)
* A4.4 Add 7 edge-case tests from spec

### A5 — calculateAll end-to-end

* A5.1 Implement `calculateAll(subtotal, oTotal)`
* A5.2 Add 5 end-to-end tests from spec table

### A6 — formatting + exact output

* A6.1 Implement `formatCurrency`
* A6.2 Implement `formatResults`
* A6.3 Add tests for exact multi-line output formatting

### B1 — HTML skeleton

* B1.1 Create header + two labeled inputs with correct IDs
* B1.2 Add Clear + Calculate buttons with IDs
* B1.3 Add results area with correct ID + hidden default
* B1.4 Add an error area (small, inline)

### B2 — CSS

* B2.1 Add CSS variables palette
* B2.2 Layout spacing + input/button sizes
* B2.3 Results monospace styling

### C1 — app wiring

* C1.1 Create `app.js` that finds DOM nodes + hooks events
* C1.2 Add no-op handlers (just console.log)
* C1.3 Include `app.js` in index

### C2 — validation

* C2.1 Implement `parseMoneyInput`
* C2.2 Implement `validateInputs` returning `{ ok, message, focusId }`
* C2.3 Unit test validation in `tests.js` (yes—test validation too)

### C3 — calculate flow

* C3.1 On Calculate: validate → run `calculateAll` → formatResults → display
* C3.2 Ensure results hidden on error
* C3.3 Ensure error cleared on success

### C4 — clear flow

* C4.1 Clear inputs + error + hide results
* C4.2 Focus subtotal

### C5 — UX

* C5.1 Enter triggers calculate
* C5.2 On focus, select text
* C5.3 Autofocus subtotal on load

### D1 — manifest

* D1.1 Create manifest.json from spec
* D1.2 Add `<link rel="manifest">` and theme meta tags
* D1.3 Smoke-check installability

### D2 — service worker

* D2.1 Create SW with install+cache
* D2.2 Fetch: cache-first fallback network
* D2.3 Activate: cleanup old caches
* D2.4 Register SW in `app.js` (silent failure allowed)

### E — final polish

* E1 Add icons placeholders
* E2 Manual test matrix run
* E3 GitHub Pages instructions

---

# 5) Prompts for a code-generation LLM (TDD, incremental, fully wired)

**How to use these:**
Run them in order. Each one assumes the previous step is complete.
Each prompt ends with “done means…” so the codegen model can self-check.

---

## Prompt 01 — Create a tiny browser test harness (smoke test) ✅ COMPLETED

```text
You are building a static vanilla JS project (no build tools). Create a minimal in-browser test harness.

Add two new files:
- tests.html
- tests.js

tests.html requirements:
- Loads tests.js with a <script type="module">
- Has a <pre id="test-output"></pre> for output
- Title: "Palindrome Tip Calculator Tests"

tests.js requirements:
- Implement helpers:
  - test(name, fn)
  - assertEqual(actual, expected, message?)
  - assertClose(actual, expected, epsilon=0.0001, message?)
- Print results into #test-output (PASS/FAIL lines)
- Add ONE smoke test that passes (e.g., assertEqual(1, 1))

No other app files yet.

Done means:
- Opening tests.html in a browser shows 1 passing test and 0 failing tests.
```

---

## Prompt 02 — Add calc.js skeleton + simplifySubtotal() with unit tests ✅ COMPLETED

```text
Add a new module calc.js exporting pure functions.

Implement:
- simplifySubtotal(subtotal: number): number
  - Must truncate cents (Math.floor)

Update tests.js:
- Import simplifySubtotal from ./calc.js
- Add the 5 Simplify Subtotal test cases from the spec:
  35.23 -> 35
  35.00 -> 35
  35.99 -> 35
  0.99  -> 0
  100.50 -> 100

Done means:
- tests.html shows all tests passing.
- calc.js contains only pure logic (no DOM access).
```

---

## Prompt 03 — Implement calculateBaseTip() with tests ✅ COMPLETED

```text
In calc.js, implement:
- calculateBaseTip(simplifiedSubtotal: number): number
  - Must compute 20% by dividing by 5

In tests.js:
- Import calculateBaseTip
- Add Base Tip test cases:
  35 -> 7.00
  50 -> 10.00
  17 -> 3.40
  0  -> 0.00
  1  -> 0.20

Use assertClose for decimal comparisons.

Done means:
- All tests pass in tests.html
- calculateBaseTip is pure and has no formatting concerns.
```

---

## Prompt 04 — Implement generatePalindromeTotal() with edge-case tests ✅ COMPLETED

```text
In calc.js, implement:
- generatePalindromeTotal(tTotal: number): number

Algorithm:
- dollars = Math.floor(tTotal)
- cents are derived by reversing the dollar digits:
  - reverse the dollar string
  - if length==1, cents = reversed + "0" (e.g. 7 -> "70")
  - else cents = first 2 digits of reversed (e.g. 48 -> "84", 123 -> "32", 100 -> "00")
- return parseFloat(`${dollars}.${cents}`)

In tests.js:
- Import generatePalindromeTotal
- Add the Palindrome Generation tests:
  48.12 -> 48.84
  7.00  -> 7.70
  10.00 -> 10.01
  99.00 -> 99.99
  100.00 -> 100.00
  123.45 -> 123.32
  9.50 -> 9.90

Done means:
- All tests pass.
- The function works for 1, 2, 3+ digit dollar amounts.
```

---

## Prompt 05 — Implement calculatePalindromeTip() + calculateAll() with end-to-end tests ✅ COMPLETED

```text
In calc.js implement:
- calculatePalindromeTip(pTotal: number, oTotal: number): number
  - return pTotal - oTotal

Also implement:
- calculateAll(subtotal: number, oTotal: number): object
  Steps:
  0) simplified = simplifySubtotal(subtotal)
  1) baseTip = calculateBaseTip(simplified)
  2) tTotal = oTotal + baseTip
  3) pTotal = generatePalindromeTotal(tTotal)
  4) pTip = calculatePalindromeTip(pTotal, oTotal)
  Return { simplified, baseTip, tTotal, pTotal, pTip, oTotal, subtotal }

In tests.js:
- Import calculateAll
- Add End-to-End Calculation tests from the spec table:
  subtotal 35.23, oTotal 41.12 => baseTip 7.00, pTotal 48.84, pTip 7.72
  subtotal 50.00, oTotal 55.00 => baseTip 10.00, pTotal 65.56, pTip 10.56
  subtotal 25.75, oTotal 28.50 => baseTip 5.00, pTotal 33.33, pTip 4.83
  subtotal 10.00, oTotal 11.00 => baseTip 2.00, pTotal 13.31, pTip 2.31
  subtotal 5.50,  oTotal 6.00  => baseTip 1.00, pTotal 7.70,  pTip 1.70

Use assertClose.

Done means:
- All unit + end-to-end tests pass.
- calculateAll composes the smaller functions cleanly.
```

---

## Prompt 06 — Add formatCurrency() and formatResults() with exact output tests ✅ COMPLETED

```text
In calc.js implement:
- formatCurrency(value: number): string
  - return value.toFixed(2)

- formatResults(baseTip: number, pTip: number, pTotal: number, oTotal: number): string
  Must match EXACT format:
  20% tip = [tip]
  Palindrome tip = [pTip]
  PTotal = [pTotal] = [oTotal] + [pTip]

Use formatCurrency for all numeric inserts.

In tests.js:
- Import formatCurrency, formatResults
- Add tests:
  - formatCurrency(7) => "7.00"
  - formatCurrency(7.7) => "7.70"
  - formatResults(7, 7.72, 48.84, 41.12) matches exact multi-line string

Done means:
- All tests pass.
- Output formatting is EXACT per spec.
```

---

## Prompt 07 — Build index.html UI skeleton (no logic yet)

```text
Create index.html and styles.css for a mobile-first dark UI.

index.html requirements:
- Title/header text: "Tip Calculator"
- Two labeled inputs:
  - Subtotal input id="subtotal-input"
  - Total w/ tax input id="ototal-input"
- Each input:
  type="number", step="0.01", min="0", inputmode="decimal", autocomplete="off"
- Two buttons:
  - Clear button id="clear-btn" text "Clear"
  - Calculate button id="calculate-btn" text "Calculate"
- Results area:
  - id="results-area"
  - initially hidden (style or class)
  - contains placeholder text but hidden by default
- Add an error message area:
  - id="error-area"
  - empty by default

styles.css requirements (match spec vibe):
- Dark palette variables
- Mobile-friendly spacing
- Buttons >= 48px height, inputs ~56px height
- Results monospace

No JavaScript yet.

Done means:
- Opening index.html shows the UI, results hidden.
```

---

## Prompt 08 — Add app.js with DOM wiring skeleton (no calculation yet)

```text
Add app.js and wire it into index.html.

app.js requirements:
- Import calculateAll and formatResults from calc.js
- Grab DOM elements by ID:
  subtotal-input, ototal-input, clear-btn, calculate-btn, results-area, error-area
- Add click handlers for calculate and clear, but initially only console.log("calculate") etc.
- Ensure no errors in console on page load.

Done means:
- index.html loads app.js successfully and button clicks log messages.
```

---

## Prompt 09 — Implement parse + validation helpers with tests

```text
Add validation logic in app.js BUT keep it testable by exporting pure helpers.

In app.js implement and export:
- parseMoneyInput(raw: string): number | null
  - returns null for empty or NaN
  - otherwise returns parseFloat

- validateInputs(subtotalRaw: string, oTotalRaw: string): { ok: boolean, message: string, focusId: string }
  Error rules from spec:
  - empty subtotal -> "Please enter subtotal" focus subtotal-input
  - empty total -> "Please enter total" focus ototal-input
  - non-numeric -> "Subtotal must be a number" / "Total must be a number"
  - negative -> "Subtotal cannot be negative" / "Total cannot be negative"
  - zero subtotal -> "Subtotal cannot be zero"
  - oTotal < subtotal -> "Total should be greater than subtotal" focus ototal-input

Add tests in tests.js by importing validateInputs from ./app.js:
- Cover at least:
  - empty subtotal
  - empty total
  - negative subtotal
  - zero subtotal
  - total < subtotal
  - valid inputs

Done means:
- tests.html still passes all calc tests + these new validation tests.
- index.html still loads normally.
```

---

## Prompt 10 — Wire Calculate: validate → calculateAll → formatResults → show results

```text
In app.js, implement the Calculate click handler fully:

Behavior:
- Read raw strings from inputs
- Run validateInputs
- If invalid:
  - show error text in #error-area
  - hide #results-area
  - focus the indicated input
  - return early
- If valid:
  - clear error area
  - run calculateAll(subtotal, oTotal)
  - build output string using formatResults(result.baseTip, result.pTip, result.pTotal, result.oTotal)
  - show #results-area and set its textContent to the output
  - results-area must be hidden until success

Done means:
- Manual test: entering 35.23 and 41.12 shows:
  20% tip = 7.00
  Palindrome tip = 7.72
  PTotal = 48.84 = 41.12 + 7.72
- Invalid input shows error and keeps results hidden.
```

---

## Prompt 11 — Wire Clear: reset inputs, hide results, focus subtotal

```text
In app.js, implement the Clear click handler:

- Set both inputs to ""
- Clear #error-area
- Hide #results-area and clear its text
- Focus #subtotal-input

Also add small UX polish:
- On page load, autofocus subtotal input

Done means:
- Clear always returns the UI to initial state
- Subtotal is focused after Clear.
```

---

## Prompt 12 — Add “Enter triggers Calculate” + focus-select behavior

```text
Improve UX in app.js:

- If user presses Enter inside either input, trigger the same action as Calculate.
- When an input gains focus, select its entire contents (so editing is fast).

Done means:
- Keyboard-only flow works smoothly on mobile/desktop.
```

---

## Prompt 13 — Add manifest.json and connect it in index.html

```text
Add manifest.json exactly as described in the spec.

Update index.html <head>:
- <link rel="manifest" href="manifest.json">
- theme-color meta tag matching spec

Done means:
- Browser sees manifest (DevTools Application tab shows it).
```

---

## Prompt 14 — Add service-worker.js and register it safely

```text
Create service-worker.js with cache-first strategy per spec:

Cache name: tip-calc-v1
Precache:
- /index.html
- /styles.css
- /app.js
- /calc.js
- /manifest.json
- /icons/icon-192.png
- /icons/icon-512.png

Lifecycle:
- install: precache and skipWaiting
- activate: delete old caches, claim clients
- fetch: respond from cache, else network fallback

Register in app.js:
- if ("serviceWorker" in navigator) register on load
- if it fails, log to console but do not show UI error

Done means:
- DevTools shows SW installed.
- Reload works in airplane mode after first load.
```

---

## Prompt 15 — Add icons folder + placeholders and final QA checklist

```text
Add /icons folder with:
- icon-192.png
- icon-512.png

(If real icons are unavailable, create simple placeholder PNGs.)

Add a short README.md checklist:
- how to run tests (open tests.html)
- how to run app (open index.html)
- GitHub Pages deploy steps

Done means:
- Repository is deployable and testable end-to-end.
```

---