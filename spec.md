# Palindrome Tip Calculator PWA
## Technical Specification Document

**Version:** 1.0  
**Date:** January 17, 2026  
**Target Platform:** Google Pixel 10 Pro / Mobile Web  
**Hosting:** GitHub Pages

---

## 1. Executive Summary

This document specifies a Progressive Web App (PWA) that calculates tips using a unique palindrome-based algorithm. The app takes a subtotal and tax-inclusive total as inputs, calculates a standard 20% tip, then adjusts the final total to create a palindrome pattern between dollars and cents. This serves as a personal fraud-detection mechanism for the user.

---

## 2. Technical Architecture

### 2.1 File Structure

```
/
├── index.html          # Main app interface with embedded JavaScript
├── styles.css          # Visual styling (dark mode, mobile-optimized)
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline functionality and caching
└── icons/
    ├── icon-192.png    # Required PWA icon
    └── icon-512.png    # Required PWA icon (maskable)
```

### 2.2 Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Markup | HTML5 | Native, no build step |
| Styling | CSS3 | Custom properties for theming |
| Logic | Vanilla JavaScript (ES6+) | No framework overhead |
| Offline | Service Worker API | Native PWA support |
| Hosting | GitHub Pages | Free, HTTPS included |

### 2.3 Browser Support Requirements

| Browser | Minimum Version |
|---------|-----------------|
| Chrome (Android) | 80+ |
| Safari (iOS) | 14+ |
| Firefox (Android) | 85+ |

---

## 3. Functional Specification

### 3.1 Core Algorithm

The calculation follows a specific 6-step process:

**Inputs:**
- `subtotal`: Pre-tax amount (e.g., 35.23)
- `oTotal`: Original total including tax (e.g., 41.12)

**Algorithm Steps:**

| Step | Operation | Example |
|------|-----------|---------|
| 0 | Simplify subtotal by truncating cents | 35.23 → 35 |
| 1 | Calculate 20% tip: `simplifiedSubtotal / 5` | 35 ÷ 5 = 7 |
| 2 | Calculate tentative total: `oTotal + tip` | 41.12 + 7 = 48.12 |
| 3 | Generate palindrome total (PTotal) | 48.12 → 48.84 |
| 4 | Calculate palindrome tip: `pTotal - oTotal` | 48.84 - 41.12 = 7.72 |
| 5 | Display formatted results | See Output Format |

**Output Format (exact):**
```
20% tip = [tip]
Palindrome tip = [pTip]
PTotal = [pTotal] = [oTotal] + [pTip]
```

### 3.2 Palindrome Generation Algorithm

The palindrome is created by mirroring the dollar digits into the cents position.

**Pseudocode:**
```
function generatePalindrome(tTotal):
    dollars = floor(tTotal)
    dollarString = toString(dollars)
    
    // Reverse dollar digits for cents
    reversedDollars = reverse(dollarString)
    
    // Handle cents: take first 2 digits of reversed string
    if length(reversedDollars) == 1:
        cents = reversedDollars + "0"  // e.g., 7 → "70"
    else:
        cents = substring(reversedDollars, 0, 2)  // e.g., 48 → "84"
    
    return parseFloat(dollarString + "." + cents)
```

**Edge Case Handling:**

| Dollar Amount | Reversed | Cents | PTotal | Notes |
|--------------|----------|-------|--------|-------|
| 7 | "7" | "70" | 7.70 | Single digit: pad with trailing zero |
| 48 | "84" | "84" | 48.84 | Standard two-digit case |
| 100 | "001" | "00" | 100.00 | Three digits: use first two of reversed |
| 123 | "321" | "32" | 123.32 | Three digits: truncate to two |
| 9 | "9" | "90" | 9.90 | Single digit boundary |
| 10 | "01" | "01" | 10.01 | Two digits with leading zero in reverse |
| 99 | "99" | "99" | 99.99 | Maximum two-digit |

### 3.3 Function Specifications

#### `simplifySubtotal(subtotal: number): number`
- **Purpose:** Truncate cents from subtotal
- **Input:** Decimal number (e.g., 35.23)
- **Output:** Integer (e.g., 35)
- **Implementation:** `Math.floor(subtotal)`

#### `calculateBaseTip(simplifiedSubtotal: number): number`
- **Purpose:** Calculate 20% tip using division by 5
- **Input:** Integer subtotal
- **Output:** Decimal tip amount
- **Implementation:** `simplifiedSubtotal / 5`

#### `calculateTentativeTotal(oTotal: number, tip: number): number`
- **Purpose:** Sum original total and base tip
- **Input:** Original total, calculated tip
- **Output:** Tentative total before palindrome adjustment
- **Implementation:** `oTotal + tip`

#### `generatePalindromeTotal(tTotal: number): number`
- **Purpose:** Create palindrome from tentative total
- **Input:** Tentative total (e.g., 48.12)
- **Output:** Palindrome total (e.g., 48.84)
- **Implementation:** See Section 3.2

#### `calculatePalindromeTip(pTotal: number, oTotal: number): number`
- **Purpose:** Derive actual tip from palindrome total
- **Input:** Palindrome total, original total
- **Output:** Palindrome tip amount
- **Implementation:** `pTotal - oTotal`

#### `formatCurrency(value: number): string`
- **Purpose:** Format number as currency string
- **Input:** Decimal number
- **Output:** String with exactly 2 decimal places
- **Implementation:** `value.toFixed(2)`

#### `formatResults(tip: number, pTip: number, pTotal: number, oTotal: number): string`
- **Purpose:** Generate formatted output string
- **Output:** Multi-line result string per specification

---

## 4. User Interface Specification

### 4.1 Screen Layout

```
┌─────────────────────────────────────┐
│         Tip Calculator              │  ← Header
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Subtotal                    │    │  ← Input field 1
│  │ [                         ] │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Total w/ tax               │    │  ← Input field 2
│  │ [                         ] │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌──────────┐    ┌─────────────┐    │
│  │  Clear   │    │  Calculate  │    │  ← Action buttons
│  └──────────┘    └─────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │  ← Results area
│  │  20% tip = 7.00             │    │    (hidden until
│  │  Palindrome tip = 7.72      │    │     calculation)
│  │  PTotal = 48.84 = 41.12 +   │    │
│  │          7.72               │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### 4.2 Component Specifications

#### Input Fields

| Property | Value |
|----------|-------|
| Type | `<input type="number">` |
| Step | `0.01` |
| Min | `0` |
| Inputmode | `decimal` |
| Autocomplete | `off` |
| Pattern | `[0-9]*\.?[0-9]*` |

#### Subtotal Field
- **ID:** `subtotal-input`
- **Label:** "Subtotal"
- **Placeholder:** "0.00"
- **Autofocus:** `true` (keyboard opens on app launch)

#### Total w/ Tax Field
- **ID:** `ototal-input`
- **Label:** "Total w/ tax"
- **Placeholder:** "0.00"

#### Clear Button
- **ID:** `clear-btn`
- **Text:** "Clear"
- **Action:** Reset all inputs to empty, hide results area

#### Calculate Button
- **ID:** `calculate-btn`
- **Text:** "Calculate"
- **Action:** Validate inputs, run calculation, display results

#### Results Area
- **ID:** `results-area`
- **Initial State:** Hidden (`display: none`)
- **Shown:** After successful calculation
- **Hidden:** After Clear button pressed

### 4.3 Interaction Behaviors

| Action | Behavior |
|--------|----------|
| App Launch | Subtotal field focused, keyboard open |
| Tap Input Field | Field editable, existing value selectable |
| Press Calculate | Validate → Calculate → Show Results |
| Press Clear | Clear inputs → Hide results → Focus subtotal |
| Invalid Input | Show inline error, keep results hidden |

---

## 5. Visual Design Specification

### 5.1 Color Palette (Dark Mode)

```css
:root {
  --bg-primary: #121212;      /* Main background */
  --bg-secondary: #1E1E1E;    /* Card/container background */
  --bg-input: #2D2D2D;        /* Input field background */
  --text-primary: #FFFFFF;    /* Primary text */
  --text-secondary: #B3B3B3;  /* Labels, secondary text */
  --accent-primary: #6366F1;  /* Primary action (Calculate) */
  --accent-secondary: #4F46E5;/* Hover state */
  --border-color: #3D3D3D;    /* Input borders */
  --error-color: #EF4444;     /* Error states */
  --success-color: #22C55E;   /* Success states */
}
```

### 5.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Header | System UI | 24px | 600 |
| Labels | System UI | 14px | 400 |
| Inputs | System UI | 18px | 400 |
| Buttons | System UI | 16px | 600 |
| Results | Monospace | 16px | 400 |

### 5.3 Spacing and Sizing

| Element | Value |
|---------|-------|
| Container padding | 16px |
| Input height | 56px |
| Button height | 48px |
| Border radius (inputs) | 12px |
| Border radius (buttons) | 12px |
| Gap between elements | 16px |

### 5.4 Responsive Breakpoints

| Breakpoint | Max Width | Behavior |
|------------|-----------|----------|
| Mobile (default) | 100% | Full width, optimized for touch |
| Tablet | 480px | Centered container |
| Desktop | 480px | Centered container |

---

## 6. PWA Configuration

### 6.1 manifest.json

```json
{
  "name": "Palindrome Tip Calculator",
  "short_name": "Tip Calc",
  "description": "Calculate tips with palindrome totals",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#121212",
  "theme_color": "#6366F1",
  "orientation": "portrait",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### 6.2 Service Worker Caching Strategy

**Cache Name:** `tip-calc-v1`

**Cached Resources:**
- `/index.html`
- `/styles.css`
- `/manifest.json`
- `/icons/icon-192.png`
- `/icons/icon-512.png`

**Strategy:** Cache-first with network fallback

```javascript
// Install: Pre-cache all static assets
// Fetch: Serve from cache, fallback to network
// Activate: Clean up old cache versions
```

### 6.3 Service Worker Lifecycle

| Event | Action |
|-------|--------|
| Install | Cache all static assets, skip waiting |
| Activate | Delete old caches, claim clients |
| Fetch | Return cached response or fetch from network |

---

## 7. Error Handling

### 7.1 Error Matrix

| Error Condition | Detection | User Message | Behavior |
|-----------------|-----------|--------------|----------|
| Empty subtotal | `value === ""` | "Please enter subtotal" | Focus subtotal field |
| Empty total | `value === ""` | "Please enter total" | Focus total field |
| Non-numeric subtotal | `isNaN(parseFloat())` | "Subtotal must be a number" | Focus subtotal field |
| Non-numeric total | `isNaN(parseFloat())` | "Total must be a number" | Focus total field |
| Negative subtotal | `value < 0` | "Subtotal cannot be negative" | Focus subtotal field |
| Negative total | `value < 0` | "Total cannot be negative" | Focus total field |
| Zero subtotal | `value === 0` | "Subtotal cannot be zero" | Focus subtotal field |
| Total less than subtotal | `oTotal < subtotal` | "Total should be greater than subtotal" | Focus total field |
| Service worker fail | Registration rejected | Silent (app still works) | Log to console |

### 7.2 Input Validation Flow

```
1. On Calculate click:
   a. Get subtotal value
   b. Get oTotal value
   c. Validate subtotal (not empty, numeric, positive)
   d. Validate oTotal (not empty, numeric, positive)
   e. Validate relationship (oTotal >= subtotal)
   f. If any validation fails → show error, stop
   g. If all pass → proceed to calculation
```

### 7.3 Palindrome Edge Cases

| Scenario | Handling |
|----------|----------|
| Dollar amount = 0 | Display "0.00" (valid edge case) |
| Dollar amount > 999 | Process normally, use first 2 reversed digits |
| Dollar amount is single digit | Pad cents with trailing zero |
| Resulting cents > 99 | Impossible due to 2-digit truncation |

---

## 8. Testing Specification

### 8.1 Unit Test Cases - Calculation Logic

#### Simplify Subtotal Tests

| Input | Expected Output | Description |
|-------|-----------------|-------------|
| 35.23 | 35 | Standard case |
| 35.00 | 35 | Whole number |
| 35.99 | 35 | Near boundary |
| 0.99 | 0 | Less than 1 |
| 100.50 | 100 | Three digits |

#### Base Tip (20%) Tests

| Input | Expected Output | Description |
|-------|-----------------|-------------|
| 35 | 7.00 | Standard case |
| 50 | 10.00 | Round number |
| 17 | 3.40 | Decimal result |
| 0 | 0.00 | Zero case |
| 1 | 0.20 | Minimum |

#### Palindrome Generation Tests

| TTotal | Expected PTotal | Description |
|--------|-----------------|-------------|
| 48.12 | 48.84 | Standard 2-digit |
| 7.00 | 7.70 | Single digit |
| 10.00 | 10.01 | Boundary 10 |
| 99.00 | 99.99 | Max 2-digit |
| 100.00 | 100.00 | Three digit (001→00) |
| 123.45 | 123.32 | Three digit (321→32) |
| 9.50 | 9.90 | Single digit boundary |

#### End-to-End Calculation Tests

| Subtotal | OTotal | 20% Tip | PTotal | PTip |
|----------|--------|---------|--------|------|
| 35.23 | 41.12 | 7.00 | 48.84 | 7.72 |
| 50.00 | 55.00 | 10.00 | 65.56 | 10.56 |
| 25.75 | 28.50 | 5.00 | 33.33 | 4.83 |
| 10.00 | 11.00 | 2.00 | 13.31 | 2.31 |
| 5.50 | 6.00 | 1.00 | 7.70 | 1.70 |

### 8.2 UI State Tests

| Action | Expected State |
|--------|----------------|
| Initial load | Subtotal focused, results hidden |
| Enter valid inputs + Calculate | Results visible with correct values |
| Press Clear | Inputs empty, results hidden, subtotal focused |
| Enter invalid input + Calculate | Error shown, results hidden |
| Fix invalid input + Calculate | Error cleared, results shown |

### 8.3 PWA Functionality Tests

| Test | Procedure | Expected Result |
|------|-----------|-----------------|
| Install prompt | Visit site in Chrome | "Add to Home Screen" available |
| Offline calculation | Enable airplane mode, calculate | App functions normally |
| Service worker | Check DevTools | SW registered, assets cached |
| App launch | Open from home screen | Full screen, no browser UI |
| Icon display | View home screen | Correct icon displayed |

### 8.4 Mobile Responsiveness Tests

**Target Device:** Google Pixel 10 Pro
**Screen Dimensions:** 1344 x 2992 pixels (logical: 412 x 915 dp)

| Test | Expected Result |
|------|-----------------|
| Viewport fit | Content fits without horizontal scroll |
| Touch targets | All buttons ≥ 48px height |
| Keyboard overlap | Inputs visible when keyboard open |
| Input zoom | No zoom on input focus (font ≥ 16px) |

### 8.5 Input Validation Tests

| Input | Field | Expected Behavior |
|-------|-------|-------------------|
| "" | Subtotal | Error: "Please enter subtotal" |
| "abc" | Subtotal | Prevented by input type="number" |
| "-5" | Subtotal | Error: "Subtotal cannot be negative" |
| "0" | Subtotal | Error: "Subtotal cannot be zero" |
| "35.23" | Subtotal | Valid |
| "35.23" / "30.00" | Both | Error: "Total should be greater than subtotal" |

---

## 9. Deployment Instructions

### 9.1 GitHub Repository Setup

1. Create new repository: `palindrome-tip-calculator`
2. Initialize with README
3. Clone locally:
   ```bash
   git clone https://github.com/[username]/palindrome-tip-calculator.git
   cd palindrome-tip-calculator
   ```

### 9.2 File Deployment

1. Create all files in repository root:
   - `index.html`
   - `styles.css`
   - `manifest.json`
   - `service-worker.js`

2. Create icons directory:
   ```bash
   mkdir icons
   ```

3. Add icon files:
   - `icons/icon-192.png` (192x192 pixels)
   - `icons/icon-512.png` (512x512 pixels, maskable safe zone)

### 9.3 GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` (or `master`)
4. Folder: `/ (root)`
5. Click Save

### 9.4 Verification Checklist

| Item | Verification |
|------|--------------|
| Site accessible | Visit `https://[username].github.io/palindrome-tip-calculator` |
| HTTPS enabled | URL shows padlock icon |
| PWA installable | Chrome shows install prompt |
| Offline works | Disable network, reload page |
| Calculations correct | Run test cases from Section 8.1 |

### 9.5 Icon Generation (Optional)

If icons need to be created:

```bash
# Using ImageMagick
convert -size 192x192 xc:#6366F1 \
  -gravity center -fill white -pointsize 72 \
  -annotate 0 "TC" icons/icon-192.png

convert -size 512x512 xc:#6366F1 \
  -gravity center -fill white -pointsize 192 \
  -annotate 0 "TC" icons/icon-512.png
```

---

## 10. Assumptions and Constraints

### 10.1 Assumptions

1. **User Device:** Primary use on Google Pixel 10 Pro running Android with Chrome
2. **Input Format:** Users will enter decimal values (e.g., 35.23, not $35.23)
3. **Currency:** US Dollars (no currency conversion needed)
4. **Network:** First load requires network; subsequent use can be offline
5. **Tip Range:** 20% base calculation is fixed (not user-configurable)
6. **Single User:** Personal use only, no multi-user features needed

### 10.2 Constraints

1. **No Backend:** All processing client-side
2. **No Data Persistence:** Values cleared on app close
3. **No Framework:** Vanilla HTML/CSS/JS only
4. **GitHub Pages Limitations:** Static hosting only
5. **Browser Support:** Must work in Chrome for Android as primary target

### 10.3 Out of Scope

- Multiple tip percentage options
- Bill splitting functionality
- Receipt scanning/OCR
- History/favorites
- Cloud sync
- Multi-currency support
- Accessibility beyond basic support (future enhancement)

---

## Appendix A: Sample Implementation Snippets

### A.1 Core Calculation Function

```javascript
function calculate(subtotal, oTotal) {
  // Step 0: Simplify subtotal
  const simplified = Math.floor(subtotal);
  
  // Step 1: Calculate 20% tip
  const baseTip = simplified / 5;
  
  // Step 2: Tentative total
  const tTotal = oTotal + baseTip;
  
  // Step 3: Generate palindrome
  const dollars = Math.floor(tTotal);
  const dollarStr = dollars.toString();
  const reversed = dollarStr.split('').reverse().join('');
  const cents = reversed.length === 1 
    ? reversed + '0' 
    : reversed.substring(0, 2);
  const pTotal = parseFloat(dollarStr + '.' + cents);
  
  // Step 4: Palindrome tip
  const pTip = pTotal - oTotal;
  
  return {
    baseTip: baseTip,
    pTip: pTip,
    pTotal: pTotal,
    oTotal: oTotal
  };
}
```

### A.2 Result Formatter

```javascript
function formatResults(result) {
  const { baseTip, pTip, pTotal, oTotal } = result;
  return [
    `20% tip = ${baseTip.toFixed(2)}`,
    `Palindrome tip = ${pTip.toFixed(2)}`,
    `PTotal = ${pTotal.toFixed(2)} = ${oTotal.toFixed(2)} + ${pTip.toFixed(2)}`
  ].join('\n');
}
```

---

## Appendix B: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-17 | Claude | Initial specification |

---

*End of Specification Document*
