# LMS Portal (React + Vite + Tailwind) with Embedded Chatbot (iframe)

## Quick start
```bash
npm install
npm run dev
```

Open the shown URL (e.g., http://localhost:5173).

Edit `src/LmsPortal.jsx` and set:
```js
const CHATBOT_IFRAME_SRC = "http://localhost:5000/"; // your chatbot page
```

## Tailwind setup
Already configured: `tailwind.config.js`, `postcss.config.js`, and `src/index.css` include Tailwind layers.

## Chatbot embedding (Flask example)
Your chatbot server must allow being embedded by this origin:
```python
@app.after_request
def set_embed_headers(resp):
    resp.headers["Content-Security-Policy"] = "frame-ancestors 'self' http://localhost:5173"
    return resp
```
In production, add your real domain to `frame-ancestors` and serve over HTTPS.
