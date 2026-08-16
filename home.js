// ---------------------------------------------------------------------------
// The log. To add an entry, add one line to ITEMS below.
//   kind:  "essay" | "book" | "video"
//   q:     Q(year, quarter)
//   meta:  short label shown in the Description column
// ---------------------------------------------------------------------------

const Q = (y, q) => ({ y, q, label: "Q" + q + " " + y, key: y * 10 + q });

const ITEMS = [
  { kind: "essay", q: Q(2023, 3), title: "The Pareto principle has been inverted", by: "", meta: "WIP", url: "pareto.html" },
  { kind: "video", q: Q(2026, 3), title: "I Made a 32-bit Computer Inside Terraria", by: "", meta: "Video", url: "https://www.youtube.com/watch?v=zXPiqk0-zDY" },
  { kind: "book",  q: Q(2026, 1), title: "Sh\u014dgun", by: "James Clavell", meta: "Book", url: "https://readerslibrary.org/wp-content/uploads/Shogun.pdf" },
  { kind: "book",  q: Q(2026, 1), title: "Can't Hurt Me", by: "David Goggins", meta: "Book", url: "https://sportbook.gr/wp-content/uploads/2023/11/cant-hurt-me-pdf.pdf" },
  { kind: "book",  q: Q(2025, 1), title: "The Dawn of Everything", by: "Graeber & Wengrow", meta: "Book", url: "https://docdrop.org/download_annotation_doc/The-Dawn-of-Everything-by-David-Graeber-David-Wengrow-z-lib.-zmbbo.pdf" },
  { kind: "book",  q: Q(2025, 1), title: "Zen and the Art of Motorcycle Maintenance", by: "Robert M. Pirsig", meta: "Book", url: "https://www.bartneck.de/projects/research/pirsig/zen.pdf" },
  { kind: "book",  q: Q(2025, 1), title: "Economics in One Lesson", by: "Henry Hazlitt", meta: "Book", url: "https://www.liberalstudies.ca/wp-content/uploads/2014/11/Economics-in-One-Lesson_2.pdf" },
  { kind: "book",  q: Q(2024, 2), title: "How to Read a Book", by: "Adler & Van Doren", meta: "Book", url: "https://delong.typepad.com/files/adler-read.pdf" },
  { kind: "video", q: Q(2023, 2), title: "AI Learns Monopoly", by: "b2studios", meta: "Video", url: "https://www.youtube.com/watch?v=dkvFcYBznPI" },
  { kind: "video", q: Q(2021, 2), title: "Obama's Speech to America's Students", by: "The White House", meta: "Video", url: "https://www.youtube.com/watch?v=5a5VSkkdpB4" },
  { kind: "video", q: Q(2020, 3), title: "Foundations of Happiness", by: "Will Schoder", meta: "Video", url: "https://www.youtube.com/watch?v=p4X7uXfZ2cY" },
  { kind: "video", q: Q(2020, 2), title: "The Answer is not a Cabin in the Woods", by: "exurb1a", meta: "Video", url: "https://www.youtube.com/watch?v=PK2SMIOHYig" },
  { kind: "video", q: Q(2020, 2), title: "Original GME DeepValue Play", by: "Roaring Kitty", meta: "Video", url: "https://www.youtube.com/watch?v=GZTr1-Gp74U" },
  { kind: "video", q: Q(2020, 2), title: "The Federal Reserve vs Covid", by: "", meta: "Video", url: "https://www.youtube.com/watch?v=GI7sBsBHdCk" }
];

const LABELS = { all: "all", essay: "writing", book: "books", video: "watch" };

const el = (id) => document.getElementById(id);
const listEl = el("list");
const statusEl = el("status");
const emptyEl = el("empty");
const qEl = el("q");
const yearEl = el("year");
const arrowEl = el("arrow");

let state = { filter: "all", query: "", year: "all", desc: true, cursor: -1 };
let visible = [];

const chipEls = document.querySelectorAll(".chip");
chipEls.forEach((c) => {
  const k = c.dataset.kind;
  const n = k === "all" ? ITEMS.length : ITEMS.filter((i) => i.kind === k).length;
  c.textContent = LABELS[k] + " \u00b7 " + n;
  c.addEventListener("click", () => {
    state.filter = k;
    state.cursor = -1;
    render();
  });
});

["all"].concat([...new Set(ITEMS.map((i) => i.q.y))].sort((a, b) => b - a).map(String))
  .forEach((y) => {
    const o = document.createElement("option");
    o.value = y;
    o.textContent = y;
    yearEl.appendChild(o);
  });

yearEl.addEventListener("change", () => { state.year = yearEl.value; state.cursor = -1; render(); });
qEl.addEventListener("input", () => { state.query = qEl.value; state.cursor = -1; render(); });
qEl.addEventListener("keydown", (e) => { if (e.key === "Escape") { qEl.blur(); reset(); } });
el("sort").addEventListener("click", () => { state.desc = !state.desc; state.cursor = -1; render(); });
el("reset").addEventListener("click", reset);

function reset() {
  state = { filter: "all", query: "", year: "all", desc: state.desc, cursor: -1 };
  qEl.value = "";
  yearEl.value = "all";
  render();
}

document.addEventListener("keydown", (e) => {
  const t = e.target.tagName;
  if (e.key === "/" && t !== "INPUT" && t !== "SELECT") { e.preventDefault(); qEl.focus(); return; }
  if (t === "INPUT" || t === "SELECT") return;

  const max = visible.length - 1;
  if (e.key === "j" || e.key === "ArrowDown") {
    e.preventDefault();
    state.cursor = Math.min(max, state.cursor + 1);
    render();
  } else if (e.key === "k" || e.key === "ArrowUp") {
    e.preventDefault();
    state.cursor = Math.max(0, state.cursor - 1);
    render();
  } else if (e.key === "Enter" && visible[state.cursor]) {
    const it = visible[state.cursor];
    if (/^https?:/.test(it.url)) window.open(it.url, "_blank", "noopener");
    else window.location.href = it.url;
  } else if (e.key === "Escape") {
    reset();
  }
});

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function render() {
  const q = state.query.trim().toLowerCase();

  visible = ITEMS
    .filter((i) =>
      (state.filter === "all" || i.kind === state.filter) &&
      (state.year === "all" || String(i.q.y) === state.year) &&
      (!q || (i.title + " " + i.by).toLowerCase().includes(q)))
    .sort((a, b) => (state.desc ? b.q.key - a.q.key : a.q.key - b.q.key));

  listEl.innerHTML = visible.map((i, idx) =>
    '<a class="row' + (idx === state.cursor ? " on" : "") + '" href="' + esc(i.url) + '"' +
    (/^https?:/.test(i.url) ? ' target="_blank" rel="noopener"' : "") +
    ' data-i="' + idx + '">' +
      '<span class="date">' + i.q.label + "</span>" +
      '<span class="title">' + esc(i.title) + "</span>" +
      '<span class="by">' + (i.by ? esc(i.by) : "\u2014") + "</span>" +
      '<span class="meta">' + esc(i.meta) + "</span>" +
    "</a>"
  ).join("");

  listEl.querySelectorAll(".row").forEach((r) => {
    r.addEventListener("mouseenter", () => {
      state.cursor = Number(r.dataset.i);
      listEl.querySelectorAll(".row").forEach((x) => x.classList.remove("on"));
      r.classList.add("on");
    });
  });

  chipEls.forEach((c) =>
    c.setAttribute("aria-pressed", String(c.dataset.kind === state.filter)));

  arrowEl.textContent = state.desc ? "\u2193" : "\u2191";
  emptyEl.classList.toggle("on", visible.length === 0);

  statusEl.textContent =
    visible.length + " of " + ITEMS.length + " entries" +
    (state.year !== "all" ? " \u00b7 " + state.year : "") +
    (state.query.trim() ? " \u00b7 matching \u201c" + state.query.trim() + "\u201d" : "");
}

render();
