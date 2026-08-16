#!/usr/bin/env python3
"""Live reload server for this static site.

Run:
    python3 serve.py

Then open http://127.0.0.1:8000/index.html in your browser.
"""
from pathlib import Path
import sys

try:
    from livereload import Server
except ImportError as exc:
    print("Missing dependency: livereload")
    print("Install it with: pip install livereload")
    raise SystemExit(1) from exc

ROOT = Path(__file__).resolve().parent
INDEX = ROOT / "index.html"

if not INDEX.exists():
    print("Error: index.html not found in", ROOT)
    sys.exit(1)

server = Server()
for path in ROOT.glob("*.html"):
    server.watch(str(path))
for path in ROOT.glob("*.css"):
    server.watch(str(path))
for path in ROOT.glob("*.js"):
    server.watch(str(path))

server.serve(root=str(ROOT), host="127.0.0.1", port=8000, open_url_delay=1)
