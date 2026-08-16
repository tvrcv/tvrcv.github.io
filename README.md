# tvrcv.github.io

A log of what I read, watch, and generally a space to play around.

## Structure

    index.html    the log — markup shell only
    home.css      all styling (log + article pages)
    home.js       the entries and the filter/sort/search behaviour
    pareto.html   an article page
    serve.py      local live-reload server

## Adding an entry

Add one line to the `ITEMS` array in `home.js`:

```js
{ kind: "book", q: Q(2026, 3), title: "Some Book", by: "Author", meta: "Book", url: "https://..." },
```

`kind` is `essay`, `book`, or `video` (it drives the filter chips).
`q` is `Q(year, quarter)` — the list sorts newest-first on this.
`meta` is the short label in the Description column.
Year options in the dropdown are derived automatically.

## Keyboard

    /        focus search
    j / k    move the cursor (arrows work too)
    ↩        open the selected entry
    esc      clear all filters

## Local development

```bash
source .venv/bin/activate
python3 serve.py
```

Or without the virtualenv:

```bash
pip install livereload
python3 serve.py
```

Serves at http://127.0.0.1:8000 and auto-reloads on HTML/CSS/JS changes.

## History

The site's original styling was adapted from https://kipp.ly/ — credit to
[@kipperrii](https://twitter.com/kipperrii). That version has since been fully
replaced; nothing of the original styling remains.
