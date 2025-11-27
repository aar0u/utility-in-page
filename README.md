A minimal static web utility suite with interactive HTML pages for [homework](homework.html) and [timer](timer.html). Each utility is standalone and can be deployed separately or together on any static host or local HTTP server.

- See [board](README-board.md) for details about the [task board](board.html).

## Customizing the Utilities
- To add a new counter, follow the pattern in `tasks.html` (see `countIds` array and `changeCount` function).
- For new timers, use the structure in `timer.html` (see `startCountdown` and `playSound`).
- Task data is stored in localStorage by default.

## Quick Start
1. Run `test-server.bat`.
2. Open `http://localhost:8000` in your browser.
3. Edit HTML files directly for changes.

## Azure Web App
- Do not use start_server.py for Azure Web App.
- Instead, set the Start Command to `cd /home/site/wwwroot && python -m http.server $PORT --directory /home/site/wwwroot`.
