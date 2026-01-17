# Palindrome Tip Calculator

A Progressive Web App (PWA) that calculates palindromic tips for memorable totals.

## Features

- Calculate 20% base tips with palindrome-adjusted amounts
- Dark mode UI optimized for mobile
- Works offline with Service Worker caching
- Installable as a PWA

## Running Locally

### View Tests

```bash
# Start a local web server (required for ES6 modules)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/tests.html
```

All tests should pass (34 tests total).

### View App

```bash
# Start a local web server (required for ES6 modules)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/index.html
```

Or use any other local web server:
- Node: `npx serve`
- PHP: `php -S localhost:8000`

## Deploying to GitHub Pages

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "main" branch as source
   - Save

3. Your app will be available at:
   ```
   https://[username].github.io/[repository-name]/
   ```

4. Update the service worker and manifest if deploying to a subdirectory:
   - In `service-worker.js`: Update cache paths to include subdirectory
   - In `manifest.json`: Update `start_url` to include subdirectory

## Testing Checklist

- [ ] All unit tests pass (tests.html)
- [ ] Calculate button works with valid inputs
- [ ] Validation errors display correctly
- [ ] Clear button resets the form
- [ ] Enter key triggers calculation
- [ ] Service Worker installs (check DevTools > Application)
- [ ] App works offline after first load
- [ ] PWA is installable (check for install prompt)
- [ ] Mobile responsive layout works
- [ ] Focus behavior works correctly

## Test Cases

### Example Calculations

| Subtotal | Total w/ Tax | 20% Tip | Palindrome Tip | Palindrome Total |
|----------|-------------|---------|----------------|------------------|
| 35.23    | 41.12       | 7.00    | 7.72          | 48.84           |
| 50.00    | 55.00       | 10.00   | 10.56         | 65.56           |
| 25.75    | 28.50       | 5.00    | 4.83          | 33.33           |

## Architecture

- **calc.js** - Pure calculation functions (fully tested)
- **app.js** - UI logic and DOM manipulation
- **tests.js** - Browser-based test harness
- **service-worker.js** - Offline caching strategy
- **manifest.json** - PWA configuration

## License

MIT
