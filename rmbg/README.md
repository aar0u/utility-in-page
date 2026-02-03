# PhotoCut - AI Background Removal

Browser-based photo background removal tool with Vite build system.

## Features

- ✂️ AI-powered background removal
- 🌐 Runs entirely in browser
- 🔒 Privacy-focused - no uploads
- ⚡ Vite for fast development
- 📦 Optimized production build

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Build Output

After `npm run build`, the `dist/` folder will contain:
- `index.html` (~2KB)
- `assets/` folder with optimized JS and WASM files (~72MB total)

## Deployment

### Netlify
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Static Server
Simply serve the `dist/` folder with any HTTP server.

## Tech Stack

- Vite
- @imgly/background-removal
- Vanilla JavaScript (ES6+)
