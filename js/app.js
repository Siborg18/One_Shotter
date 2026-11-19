/* One Shotter — UI wiring. Plain JS, no build step, works from file:// or a server. */
(function () {
  "use strict";
  const D = window.OS_DATA;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const STORE_KEY = "oneshotter.v1";
  const MAX_HEROES = 10;
  // "Roll the bones" leaves these practical settings alone.
  const KEEP_ON_ROLL = new Set(["system", "level", "size", "length", "rating", "experience"]);
  // PayPal link for tips: a PayPal.me link (https://www.paypal.com/paypalme/yourname)
  // or a Donate button link (https://www.paypal.com/donate/?hosted_button_id=...).
  // The support button stays hidden until this is set.
  const SUPPORT_URL = "";

  const D20 = '<svg viewBox="0 0 64 64" aria-hidden="true"><polygon points="32,3 58,18 58,46 32,61 6,46 6,18"/><polygon points="32,15 48,42 16,42"/></svg>';

  /* ---------- state ---------- */
  function defaults() {
    const values = {};
    D.fields.forEach((f) => (values[f.key] = f.def));
    const s = { values, party: [], notes: "", avoid: "" };
    syncParty(s);
    return s;
  }
  function blankHero() { return { mode: "random", name: "", ancestry: "", cls: "", hook: "" }; }
  const hasDetails = (h) => ["name", "ancestry", "cls", "hook"].some((k) => (h[k] || "").trim());
  function partySize(s) {
    const n = parseInt((s || state).values.size, 10);
    return n >= 1 && n <= MAX_HEROES ? n : 4;
  }
  // Keep a seat for every player. Seats beyond the size are kept (hidden) so
  // lowering the size and raising it again doesn't lose what was typed.
  function syncParty(s) {
    s = s || state;
    while (s.party.length < partySize(s)) s.party.push(blankHero());
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      const d = defaults();
      const hadSize = s.values && s.values.size;
      s.values = Object.assign(d.values, s.values || {});
      // Drop saved values that no longer match an option (e.g. after editing data.js).
      D.fields.forEach((f) => {
        if (!f.options.some((o) => o.id === s.values[f.key])) s.values[f.key] = f.def;
      });
      if (!Array.isArray(s.party)) s.party = [];
      s.party = s.party.slice(0, MAX_HEROES).map((h) => {
        h = Object.assign(blankHero(), h);
        // Saves from before party size existed: filled-in heroes become "existing".
        if (h.mode !== "random" && h.mode !== "existing") h.mode = hasDetails(h) ? "existing" : "random";
        return h;
      });
      if (!hadSize && s.party.length) s.values.size = String(Math.max(4, s.party.length));
      syncParty(s);
      return s;
    } catch (e) { return null; }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }

  let state = load() || defaults();

  /* ---------- Chapter I: fields ---------- */
  function renderFields() {
    const wrap = $("#fields");
    wrap.innerHTML = "";
    D.fields.forEach((f) => {
      const div = document.createElement("div");
      div.className = "field";
      const id = "f-" + f.key;
      div.innerHTML =
        '<label for="' + id + '"></label><p class="hint"></p>' +
        '<div class="control"><select id="' + id + '"></select>' +
        '<button type="button" class="die" title="Roll a random ' + f.label.toLowerCase() + '" aria-label="Random ' + f.label + '">' + D20 + "</button></div>";
      $("label", div).textContent = f.label;
      $(".hint", div).textContent = f.hint;
      const sel = $("select", div);
      f.options.forEach((o) => {
        const opt = document.createElement("option");
        opt.value = o.id;
        opt.textContent = o.label;
        sel.appendChild(opt);
      });
      sel.value = state.values[f.key];
      sel.addEventListener("change", () => { state.values[f.key] = sel.value; fieldChanged(f); });
      $(".die", div).addEventListener("click", (e) => {
        rollField(f);
        const b = e.currentTarget;
        b.classList.remove("spin"); void b.offsetWidth; b.classList.add("spin");
        fieldChanged(f);
      });
      wrap.appendChild(div);
    });
    $("#notes").value = state.notes || "";
    $("#avoid").value = state.avoid || "";
  }

  function rollField(f) {
    const pool = f.options.filter((o) => o.id !== "ai" && o.id !== state.values[f.key]);
    const choice = pool[Math.floor(Math.random() * pool.length)];
    state.values[f.key] = choice.id;
    const sel = $("#f-" + f.key);
    sel.value = choice.id;
    sel.classList.remove("flash"); void sel.offsetWidth; sel.classList.add("flash");
  }
  function fieldChanged(f) {
    if (f.key === "size") { syncParty(); renderParty(); }
    update();
  }

  /* ---------- Chapter II: party ---------- */
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  const activeParty = () => state.party.slice(0, partySize());
  function renderParty(focusIndex) {
    const list = $("#party-list");
    list.innerHTML = "";
    activeParty().forEach((h, i) => {
      const card = document.createElement("div");
      const existing = h.mode === "existing";
      card.className = "hero" + (existing ? "" : " is-random");
      const ph = D.sampleNames[i % D.sampleNames.length];
      const n = i + 1;
      let html =
        '<span class="hero-num">' + ROMAN[i] + "</span>" +
        '<div class="hero-mode" role="radiogroup" aria-label="Hero ' + n + '">' +
          '<label><input type="radio" name="hero-mode-' + i + '" value="random"' + (existing ? "" : " checked") + "><span>Random</span></label>" +
          '<label><input type="radio" name="hero-mode-' + i + '" value="existing"' + (existing ? " checked" : "") + "><span>Existing hero</span></label>" +
        "</div>";
      if (existing) {
        html +=
          '<input type="text" class="name" data-k="name" maxlength="60" autocomplete="off" aria-label="Hero ' + n + ' name">' +
          '<input type="text" data-k="ancestry" list="dl-ancestry" maxlength="40" placeholder="Ancestry" autocomplete="off" aria-label="Hero ' + n + ' ancestry">' +
          '<input type="text" data-k="cls" list="dl-class" maxlength="40" placeholder="Class" autocomplete="off" aria-label="Hero ' + n + ' class">' +
          '<input type="text" class="hook" data-k="hook" maxlength="240" placeholder="A secret, a goal or a fear (optional)" autocomplete="off" aria-label="Hero ' + n + ' detail">';
      } else {
        html += '<p class="hero-random">' + D20 + "The AI will create this hero to round out the party.</p>";
      }
      card.innerHTML = html;

      $$(".hero-mode input", card).forEach((r) => {
        r.addEventListener("change", () => {
          state.party[i].mode = r.value;
          renderParty(r.value === "existing" ? i : null);
          update();
        });
      });
      if (existing) {
        $(".name", card).placeholder = "e.g. " + ph;
        $$("input[type=text]", card).forEach((inp) => {
          inp.value = h[inp.dataset.k] || "";
          inp.addEventListener("input", () => { state.party[i][inp.dataset.k] = inp.value; update(); });
        });
      }
      list.appendChild(card);
      if (i === focusIndex) {
        $$("input[type=text]", card).forEach((x) => x.classList.add("hero-mode-in"));
        $(".name", card).focus();
      }
    });
    updatePartyCount();
  }
  function updatePartyCount() {
    const seats = activeParty();
    const own = seats.filter((h) => h.mode === "existing" && hasDetails(h)).length;
    const rnd = seats.length - own;
    const parts = [];
    if (own) parts.push(own + " existing");
    if (rnd) parts.push(rnd + " random");
    $("#party-count").textContent = seats.length + (seats.length === 1 ? " hero · " : " heroes · ") + parts.join(", ");
  }
  function fillDatalists() {
    const a = $("#dl-ancestry"), c = $("#dl-class");
    D.ancestries.forEach((x) => { const o = document.createElement("option"); o.value = x; a.appendChild(o); });
    D.classes.forEach((x) => { const o = document.createElement("option"); o.value = x; c.appendChild(o); });
  }

  /* ---------- Chapter III: prompt ---------- */
  let currentPrompt = "";
  function renderPrompt() {
    currentPrompt = window.OS_buildPrompt(state);
    const pre = $("#prompt-text");
    pre.textContent = "";
    const names = activeParty().filter((h) => h.mode === "existing").map((h) => (h.name || "").trim()).filter(Boolean).sort((a, b) => b.length - a.length);
    const nameRe = names.length ? new RegExp("(" + names.map(escapeRe).join("|") + ")", "g") : null;
    const frag = document.createDocumentFragment();
    currentPrompt.split("\n").forEach((line, idx) => {
      if (idx) frag.appendChild(document.createTextNode("\n"));
      let host = frag;
      if (/^# /.test(line)) { host = el("span", "pl-h1"); frag.appendChild(host); }
      else if (/^## /.test(line)) { host = el("span", "pl-h2"); frag.appendChild(host); }
      if (nameRe) {
        line.split(nameRe).forEach((part, j) => {
          if (!part) return;
          if (j % 2) { const s = el("span", "pl-user"); s.textContent = part; host.appendChild(s); }
          else host.appendChild(document.createTextNode(part));
        });
      } else host.appendChild(document.createTextNode(line));
    });
    pre.appendChild(frag);

    const words = currentPrompt.split(/\s+/).filter(Boolean).length;
    $("#prompt-stats").textContent = words.toLocaleString() + " words · ~" + Math.round(currentPrompt.length / 4).toLocaleString() + " tokens";
    const q = encodeURIComponent(currentPrompt);
    $("#open-claude").href = "https://claude.ai/new?q=" + q;
    $("#open-chatgpt").href = "https://chatgpt.com/?q=" + q;
  }
  function el(tag, cls) { const e = document.createElement(tag); e.className = cls; return e; }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  let saveTimer = null;
  function update() {
    updatePartyCount();
    renderPrompt();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 250);
  }

  /* ---------- actions ---------- */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-on"), 2200);
  }
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(currentPrompt);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = currentPrompt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (err) { /* ignore */ }
      ta.remove();
    }
    toast("Prompt copied. Go paste it into your AI");
  }
  function download() {
    const title = (D.fields.find((f) => f.key === "theme").options.find((o) => o.id === state.values.theme) || {}).label || "one-shot";
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const blob = new Blob([currentPrompt], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "one-shot-prompt-" + slug + ".txt";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  let resetArmed = false;
  function reset() {
    if (!resetArmed) {
      resetArmed = true;
      toast("Click reset again to clear everything");
      setTimeout(() => (resetArmed = false), 3000);
      return;
    }
    resetArmed = false;
    state = defaults();
    renderFields(); renderParty(); update();
    toast("A fresh page in the tome");
  }

  /* ---------- chapter tracking ---------- */
  function trackChapters() {
    const setActive = (id) => {
      $$(".badge").forEach((b) => b.classList.toggle("is-active", b.dataset.target === id));
      $$(".rail-dot").forEach((d) => d.classList.toggle("is-active", d.dataset.target === id));
      $("#float-copy").classList.toggle("is-hidden", id === "prompt");
    };
    setActive("tale");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$(".chapter").forEach((c) => io.observe(c));
  }

  /* ---------- floating motes ---------- */
  function motes() {
    const cv = $("#motes");
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W, H, dpr, ps = [];
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (W * H) / 22000));
      ps = Array.from({ length: count }, () => spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10,
        r: Math.random() * 1.8 + 0.4, vy: Math.random() * 0.25 + 0.06,
        ph: Math.random() * Math.PI * 2, sp: Math.random() * 0.02 + 0.006, a: Math.random() * 0.6 + 0.25
      };
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p, i) => {
        p.ph += p.sp; p.y -= p.vy; p.x += Math.sin(p.ph) * 0.25;
        if (p.y < -10) ps[i] = spawn(false);
        const tw = 0.55 + 0.45 * Math.sin(p.ph * 2.3);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, "rgba(160,255,248," + (p.a * tw) + ")");
        g.addColorStop(1, "rgba(60,210,220,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2); ctx.fill();
      });
      if (!reduce) requestAnimationFrame(frame);
    }
    size();
    window.addEventListener("resize", size);
    frame();
  }

  /* ---------- init ---------- */
  fillDatalists();
  renderFields();
  renderParty();
  renderPrompt();
  trackChapters();
  motes();
  if (SUPPORT_URL) {
    $("#support-link").href = SUPPORT_URL;
    $("#support").hidden = false;
  }

  $("#notes").addEventListener("input", (e) => { state.notes = e.target.value; update(); });
  $("#avoid").addEventListener("input", (e) => { state.avoid = e.target.value; update(); });
  $("#roll-all").addEventListener("click", () => {
    D.fields.forEach((f) => { if (!KEEP_ON_ROLL.has(f.key)) rollField(f); });
    update();
    toast("The dice have spoken");
  });
  $("#copy").addEventListener("click", copyPrompt);
  $("#float-copy").addEventListener("click", copyPrompt);
  $("#download").addEventListener("click", download);
  $("#reset").addEventListener("click", reset);
})();
