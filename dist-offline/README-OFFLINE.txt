Offline usage

Structure:
- start-windows.bat / start-mac-linux.sh (top level)
- site/ (all website files inside)

Run locally:
1) Open this folder in a terminal.
2) Start a local server:
   - Node (recommended): npx serve site
   - Python: cd site && python -m http.server 3000
3) Open http://localhost:3000/ (landing) and http://localhost:3000/editor.html (editor).

Deploy:
- Upload the site/ folder contents to any static host (Netlify, GitHub Pages, Cloudflare Pages).
