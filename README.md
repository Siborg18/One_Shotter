# One Shotter

A frontend-only generator for tabletop one-shot prompts. Pick a theme, location, tone, party size and so on, bring your own heroes or let the AI roll them up, and copy a prompt that any capable LLM can turn into a complete, table-ready one-shot adventure.

## Run it locally

Double-click **`start-server.bat`**. It serves this folder at <http://localhost:8080> (or the next free port) and opens your browser. Close the window to stop it.

No installs are needed (it uses Windows PowerShell). You can also just open `index.html` directly. Everything works from the file, except fonts need an internet connection.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure and background art (inline SVG) |
| `css/styles.css` | All styling. Colours and fonts are CSS variables at the top |
| `js/data.js` | **Every dropdown option and the guidance text it injects into the prompt.** Add or edit options here |
| `js/prompt.js` | **The prompt template**: design principles and the fixed output format that keeps results consistent |
| `js/app.js` | UI wiring, randomiser, copy/download, saving choices in the browser |
| `serve.ps1` / `start-server.bat` | Tiny local web server |

## Tips (PayPal)

The footer has a "Tip with PayPal" button that stays hidden until you give it a link. Paste one of these into `SUPPORT_URL` at the top of `js/app.js`:

- **PayPal.me** (simplest): claim your link at <https://www.paypal.com/paypalme/> and use `https://www.paypal.com/paypalme/yourname`. Visitors choose how much to send.
- **PayPal Donate button**: in your PayPal business account, create a Donate button, then copy its link: `https://www.paypal.com/donate/?hosted_button_id=...`.

Either one opens PayPal in a new tab, so the site needs no server, client ID or keys.

## Going online

It's a static site, so you can upload the folder as-is to any static host (Netlify drop, GitHub Pages, Cloudflare Pages, Vercel). `serve.ps1` and `start-server.bat` aren't needed online.

Unofficial fan tool, not affiliated with Wizards of the Coast.
