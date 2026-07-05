# tvrcv.github.io

Styling of the website was originally taken from : https://kipp.ly/
twitter of the creator: https://twitter.com/kipperrii?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor

I don't intend to pass the original website styling/structure as mine.
Loved how the website looked, and wanted to try out github pages, and hosting a website.

I have made several changes since then, but wanted to give credit where credit is due.

Local development
-----------------

To run a local live-reload server (recommended using the repo virtualenv):

```bash
# activate the repository virtualenv (if not already active)
source .venv/bin/activate
# start the live-reload server
python3 serve.py
```

Or run directly without activating the venv:

```bash
./.venv/bin/python3 serve.py
```

If you don't use the virtualenv, install the dependency and run:

```bash
pip install livereload
python3 serve.py
```

The server serves the site at http://127.0.0.1:8000 and will auto-reload when HTML/CSS/JS files change.
