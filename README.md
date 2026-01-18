# js_calc — Design Document

Purpose
-------
Create a small, maintainable, and testable scientific calculator using HTML, JavaScript, and CSS. Start with a working baseline (MVP) scientific calculator, then add a separate CSS file to give the UI a futuristic look.

Scope & Goals
-------------
- Deliver a baseline (MVP) scientific calculator that correctly evaluates expressions and supports common scientific functions.
- Keep UI and calculation logic separated for easier testing and styling.
- Add a `styles.css` with a futuristic/neon/glass aesthetic after the MVP works.

Baseline (MVP) Feature Set
--------------------------
- Basic arithmetic: `+`, `-`, `*`, `/` and `%` (mod).
- Decimal numbers and parentheses.
- Scientific functions: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log` (base 10), `ln`, `exp`, `sqrt`, `^` (power).
- Memory: `M+`, `M-`, `MR`, `MC` (optional initial set).
- Clear (`C`) and backspace.
- Keyboard input support (digits, Enter, Backspace) — optional but desirable.

Architecture & File Layout
-------------------------
- `index.html`: UI shell and calculator container.
- `scripts/calculator.js`: core calculator logic, expression parsing/evaluation, and event-binding.
- `styles.css`: (to be added) futuristic visual styling separated from HTML.
- `pages/` (optional): example pages or progressive enhancements.

Design Notes
------------
- Keep the evaluation engine separate from DOM code. Implement a small expression parser (shunting-yard algorithm) or use a safe evaluation approach to respect operator precedence and functions.
- Calculator core should expose a small API: `evaluate(expression) -> number|string`, `formatDisplay(value)`, and optional memory functions.
- UI code should only handle rendering and user events, delegating calculation to the core.

UX / Visual Goals for `styles.css`
---------------------------------
- Futuristic look: dark background, subtle glass panel, neon accent colors (cyan, magenta, violet).
- Soft glows and inner shadows for depth, rounded buttons with hover/active neon outlines, and micro-interactions for key presses.
- Responsive layout: compact on narrow viewports and grid expansion on wide screens.

Testing & Validation
--------------------
- Manual browser testing: verify arithmetic, functions, operator precedence, and edge cases (divide by zero, invalid input).
- Basic unit tests for the evaluate function (if test harness added later).

Implementation Plan (short)
--------------------------
1. Implement calculator core in `scripts/calculator.js` using a safe parser and evaluation flow.
2. Build the UI in `index.html` and wire controls to the core.
3. Manually test and stabilize the baseline scientific calculator.
4. Add `styles.css` and apply futuristic design, ensuring responsiveness.
5. Polish, document usage, and optionally add keyboard and accessibility improvements.

Next Steps
----------
- Implement the baseline scientific calculator (step 1 & 2). After the MVP works, I will add `styles.css` and apply the futuristic theme.

Contributors
------------
Start with a single developer, iterate with PRs for features or styling.

License
-------
Project is small and permissively licensed by default; add a license file when ready.

Testing
-------
This project includes a small Jest test suite that validates the `evaluate()` implementation (operator precedence, functions, decimals, modulo, exponent associativity, and division-by-zero handling).

Run the tests locally:

```bash
npm install
npm test
```

The tests are located in the `tests/` directory and run under the `jsdom` environment so the calculator UI elements are created before the script is loaded.
