(function () {
  'use strict';

  // ---------- Letter data ----------

  var LETTERS = [
    ['alpha', 'Αα', 'ALPHA', 'AL · FUH', 'A'],
    ['beta', 'Ββ', 'BETA', 'BAY · TUH', 'B'],
    ['gamma', 'Γγ', 'GAMMA', 'GAM · UH', 'G'],
    ['delta', 'Δδ', 'DELTA', 'DEL · TUH', 'D'],
    ['epsilon', 'Εε', 'EPSILON', 'EP · SIH · LON', 'E'],
    ['zeta', 'Ζζ', 'ZETA', 'ZAY · TUH', 'Z'],
    ['eta', 'Ηη', 'ETA', 'AY · TUH', 'Ē'],
    ['theta', 'Θθ', 'THETA', 'THAY · TUH', 'TH'],
    ['iota', 'Ιι', 'IOTA', 'EYE · OH · TUH', 'I'],
    ['kappa', 'Κκ', 'KAPPA', 'KAP · UH', 'K'],
    ['lambda', 'Λλ', 'LAMBDA', 'LAM · DUH', 'L'],
    ['mu', 'Μμ', 'MU', 'MYOO', 'M'],
    ['nu', 'Νν', 'NU', 'NOO', 'N'],
    ['xi', 'Ξξ', 'XI', 'ZYE', 'X'],
    ['omicron', 'Οο', 'OMICRON', 'OM · IH · KRON', 'O'],
    ['pi', 'Ππ', 'PI', 'PIE', 'P'],
    ['rho', 'Ρρ', 'RHO', 'ROH', 'R'],
    ['sigma', 'Σσ', 'SIGMA', 'SIG · MUH', 'S'],
    ['tau', 'Ττ', 'TAU', 'TOW', 'T'],
    ['upsilon', 'Υυ', 'UPSILON', 'OOP · SIH · LON', 'Y'],
    ['phi', 'Φφ', 'PHI', 'FYE', 'PH'],
    ['chi', 'Χχ', 'CHI', 'KYE', 'CH'],
    ['psi', 'Ψψ', 'PSI', 'SYE', 'PS'],
    ['omega', 'Ωω', 'OMEGA', 'OH · MAY · GUH', 'Ō']
  ].map(function (l, i) { return { key: l[0], glyph: l[1], name: l[2], pron: l[3], latin: l[4], num: i }; });

  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
    'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV'];

  // Each letter has two cards: its capital and its small form.
  var CARDS = [];
  LETTERS.forEach(function (l) {
    CARDS.push({ id: l.key + '.upper', letter: l, upper: true, glyph: l.glyph.charAt(0), latin: l.latin });
    CARDS.push({ id: l.key + '.lower', letter: l, upper: false, glyph: l.glyph.charAt(1), latin: l.latin.toLowerCase() });
  });

  var NC = CARDS.length;
  var MAX_LEVEL = 5;
  var STORAGE_KEY = 'greekFlashcards.v1';

  // ---------- Progress model ----------

  function blankProgress() {
    var p = { version: 2, levels: {}, correct: {}, attempts: {}, trained: 0, lastCard: CARDS[0].id };
    CARDS.forEach(function (c) { p.levels[c.id] = 0; p.correct[c.id] = 0; p.attempts[c.id] = 0; });
    return p;
  }

  function isCount(v, max) {
    return typeof v === 'number' && isFinite(v) && v >= 0 && Math.floor(v) === v && (max === undefined || v <= max);
  }

  // Returns clean v2 progress, or null if the data is not valid. Version 1 (one record per
  // letter) is upgraded by giving both the capital and the small card the letter's record.
  function validate(data) {
    if (!data || typeof data !== 'object' || (data.version !== 1 && data.version !== 2)) return null;
    if (!data.levels || !data.correct || !data.attempts || !isCount(data.trained)) return null;
    var p = blankProgress();
    for (var i = 0; i < NC; i++) {
      var id = CARDS[i].id;
      var src = data.version === 1 ? CARDS[i].letter.key : id;
      if (!isCount(data.levels[src], MAX_LEVEL) || !isCount(data.correct[src]) || !isCount(data.attempts[src])) return null;
      p.levels[id] = data.levels[src];
      p.attempts[id] = data.attempts[src];
      p.correct[id] = Math.min(data.correct[src], data.attempts[src]);
    }
    p.trained = data.trained;
    if (data.version === 2 && cardIndex(data.lastCard) >= 0) p.lastCard = data.lastCard;
    return p;
  }

  function cardIndex(id) {
    for (var i = 0; i < NC; i++) if (CARDS[i].id === id) return i;
    return -1;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return validate(JSON.parse(raw)) || blankProgress();
    } catch (e) { /* storage unavailable: run in memory */ }
    var p = blankProgress();
    p.lastCard = CARDS[Math.floor(Math.random() * NC)].id;
    return p;
  }

  function save() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* in-memory only */ }
  }

  var progress = load();

  function levelOf(c) { return progress.levels[CARDS[c].id]; }
  function masteredCount() {
    return CARDS.reduce(function (n, c) { return n + (progress.levels[c.id] === MAX_LEVEL ? 1 : 0); }, 0);
  }

  // ---------- Card order: weighted random with history ----------

  // Weaker cards come up more often; mastered cards still appear, just rarely.
  var WEIGHT = [10, 7, 5, 3, 2, 1];
  var NO_REPEAT = 6; // a card isn't drawn again within this many cards

  var history = [cardIndex(progress.lastCard)];
  var pos = 0;          // position of the current card in history
  var upcoming = null;  // the pre-drawn next card, so it can sit behind the current one

  function draw() {
    var recent = history.slice(-NO_REPEAT);
    var pool = [], total = 0;
    for (var i = 0; i < NC; i++) {
      if (recent.indexOf(i) >= 0) continue;
      var w = WEIGHT[levelOf(i)];
      pool.push([i, w]);
      total += w;
    }
    var r = Math.random() * total;
    for (var k = 0; k < pool.length; k++) { r -= pool[k][1]; if (r < 0) return pool[k][0]; }
    return pool[pool.length - 1][0];
  }

  function current() { return history[pos]; }
  function nextCard() {
    if (pos < history.length - 1) return history[pos + 1];
    if (upcoming === null) upcoming = draw();
    return upcoming;
  }
  function prevCard() { return pos > 0 ? history[pos - 1] : null; }

  function goNext() {
    if (pos === history.length - 1) { history.push(nextCard()); upcoming = null; }
    pos += 1;
    if (history.length > 200) { history.splice(0, 100); pos -= 100; }
  }
  function goPrev() { if (pos > 0) pos -= 1; }

  // ---------- DOM ----------

  var $ = function (id) { return document.getElementById(id); };
  var deck = $('deck');
  var table = $('table');
  var stageBox = $('stageBox');
  var stage = $('stage');
  var cardEl = $('card');
  var behindEl = $('behind');
  var live = $('live');
  var sampleEl = $('sample');
  var measure = $('measure');

  var reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(reducedQuery && reducedQuery.matches); }
  function syncReduced() { document.documentElement.classList.toggle('reduced', reduced()); }
  syncReduced();
  if (reducedQuery) {
    if (reducedQuery.addEventListener) reducedQuery.addEventListener('change', syncReduced);
    else if (reducedQuery.addListener) reducedQuery.addListener(syncReduced);
  }

  // ---------- Card faces ----------

  // Small seeded PRNG so each card's marble has its own (stable) veins.
  function rng(seed) {
    var s = (seed * 2654435761) >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  function veinsSVG(i) {
    var r = rng(i + 7);
    var j = function (v, amt) { return Math.round(v + (r() * 2 - 1) * amt); };
    var a = 'M-10 ' + j(88, 26) + ' C ' + j(66, 14) + ' ' + j(66, 22) + ', ' + j(120, 16) + ' ' + j(154, 26) + ', ' + j(208, 16) + ' ' + j(132, 26) +
      ' S ' + j(308, 10) + ' ' + j(186, 26) + ', 340 ' + j(165, 26);
    var b = 'M-10 ' + j(330, 26) + ' C ' + j(76, 14) + ' ' + j(297, 22) + ', ' + j(154, 16) + ' ' + j(374, 22) + ', ' + j(242, 16) + ' ' + j(341, 22) +
      ' S ' + j(318, 10) + ' ' + j(363, 22) + ', 340 ' + j(330, 26);
    var c = 'M' + j(132, 40) + ' -10 C ' + j(154, 30) + ' 66, ' + j(99, 30) + ' 132, ' + j(143, 34) + ' ' + j(220, 30);
    return '<svg class="veins" width="330" height="462" viewBox="0 0 330 462" aria-hidden="true">' +
      '<path d="' + a + '" fill="none" stroke="#C9C1B2" stroke-width="1.2"/>' +
      '<path d="' + b + '" fill="none" stroke="#D3CCBF" stroke-width="1"/>' +
      '<path d="' + c + '" fill="none" stroke="#D8D2C6" stroke-width="0.8"/></svg>';
  }

  // Name sizes that fit the 272px inner frame, measured once fonts are ready.
  var INNER_W = 330 - 28 - 28 - 2;
  var fitName = {};

  function fitSize(text, font, maxSize, spacing, avail) {
    measure.style.font = font.replace('{s}', maxSize + 'px');
    measure.style.letterSpacing = spacing + 'px';
    measure.textContent = text;
    var w = measure.offsetWidth - spacing; // trailing letter-spacing doesn't show
    return w > avail ? Math.floor(maxSize * avail / w) : maxSize;
  }

  function computeFits() {
    LETTERS.forEach(function (l) { fitName[l.key] = fitSize(l.name, "600 {s} 'Cinzel', serif", 54, 4, INNER_W - 6); });
  }

  function caseWord(c) { return c.upper ? 'CAPITAL' : 'SMALL'; }

  function frontHTML(i) {
    var c = CARDS[i];
    return '<div class="face face-front">' + veinsSVG(i) +
      '<div class="frame">' +
      '<div class="card-top"><span>GREEK · ' + ROMAN[c.letter.num] + '</span><span>' + caseWord(c) + '</span></div>' +
      '<div class="glyph-front" lang="el">' + c.glyph + '</div>' +
      '<div class="card-foot">TAP TO FLIP</div>' +
      '</div></div>';
  }

  function backHTML(i) {
    var c = CARDS[i], l = c.letter;
    var fs = fitName[l.key] || 50;
    // Show the pair, with the form this card tests in full gold and its partner dimmed.
    var pair = c.upper
      ? '<span>' + l.glyph.charAt(0) + '</span><span class="partner">' + l.glyph.charAt(1) + '</span>'
      : '<span class="partner">' + l.glyph.charAt(0) + '</span><span>' + l.glyph.charAt(1) + '</span>';
    return '<div class="face face-back"><div class="frame">' +
      '<div class="card-top"><span>GREEK · ' + ROMAN[l.num] + '</span><span>= ' + c.latin + '</span></div>' +
      '<div class="back-stack">' +
      '<div class="glyph-back" lang="el">' + pair + '</div>' +
      '<div class="name" style="font-size:' + fs + 'px">' + l.name + '</div>' +
      '<div class="pron">' + l.pron + '</div>' +
      '</div>' +
      '<div class="card-foot">↑ GOT IT · ↓ MISSED</div>' +
      '</div></div>';
  }

  function titleCase(s) { return s.charAt(0) + s.slice(1).toLowerCase(); }
  function spokenName(c) { return (c.upper ? 'Capital ' : 'Small ') + titleCase(c.letter.name); }

  var behindIndex = null;

  function renderCard(keepWord) {
    var c = CARDS[current()];
    cardEl.innerHTML = frontHTML(current()) + backHTML(current());
    cardEl.classList.remove('flipped');
    if (!keepWord) word = pickWord(c);
    renderSample();
    sampleEl.classList.remove('hide');
    cardEl.setAttribute('aria-label', (c.upper ? 'Capital' : 'Small') +
      ' letter card. Tap to flip, arrow up for got it, arrow down for missed, arrow left for previous, arrow right to skip.');
    setBehind(nextCard());
  }

  function setBehind(i) {
    if (i === null || behindIndex === i) return;
    behindIndex = i;
    behindEl.innerHTML = frontHTML(i);
  }

  function renderHud() {
    var lv = levelOf(current());
    $('levelLabel').textContent = 'CARD · ' + lv + ' / 5';
    var segs = $('levelSegs').children;
    for (var k = 0; k < segs.length; k++) segs[k].classList.toggle('on', k < lv);
    var m = masteredCount();
    $('masteredLabel').textContent = 'MASTERED · ' + m + ' / ' + NC;
    $('masteredFill').style.width = (m / NC * 100) + '%';
    $('openStoa').setAttribute('aria-label', 'Mastered ' + m + ' of ' + NC + ' cards. Open the Stoa statistics');
  }

  function announce(text) { live.textContent = text; }

  function flip() {
    if (busy) return;
    var on = !cardEl.classList.contains('flipped');
    cardEl.classList.toggle('flipped', on);
    renderSample();
    var c = CARDS[current()];
    if (on) announce(spokenName(c) + '. Pronounced ' + c.letter.pron.replace(/ · /g, ' ').toLowerCase() + '. Latin ' + c.latin + '.' +
      (word ? ' Example: ' + word[0] + ', ' + word[2] + '.' : ''));
  }

  // ---------- Sample words ----------

  var WORDS = window.GREEK_WORDS || {};
  var lastWord = {};   // card id -> index of the word shown last time, to avoid repeats
  var word = null;     // [word, reading, meaning] for the current card

  function pickWord(c) {
    var list = WORDS[c.id] || [];
    if (!list.length) return null;
    var k = Math.floor(Math.random() * list.length);
    if (list.length > 1 && k === lastWord[c.id]) k = (k + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
    lastWord[c.id] = k;
    return list[k];
  }

  function baseChar(ch) { return ch.normalize('NFD').charAt(0); }

  function escapeHTML(t) { return t.replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }

  // The word with the first occurrence of the card's letter (ignoring accents) in gold.
  function highlighted(text, target) {
    var chars = Array.from(text);
    for (var i = 0; i < chars.length; i++) {
      if (baseChar(chars[i]) === target) {
        return escapeHTML(chars.slice(0, i).join('')) + '<span class="hl">' + chars[i] + '</span>' + escapeHTML(chars.slice(i + 1).join(''));
      }
    }
    return escapeHTML(text);
  }

  function renderSample() {
    var c = CARDS[current()];
    if (!word) { sampleEl.innerHTML = ''; return; }
    if (cardEl.classList.contains('flipped')) {
      sampleEl.innerHTML = '<div class="sample-reading">' + escapeHTML(word[1]) + '</div>' +
        '<div class="sample-meaning">' + escapeHTML(word[2]) + '</div>';
    } else {
      sampleEl.innerHTML = '<div class="sample-word" lang="el">' + highlighted(word[0], c.glyph) + '</div>';
    }
  }

  // ---------- Layout: scale the 330x462 card and centre it on the screen ----------

  var scale = 1;

  function layout() {
    var cs = getComputedStyle(deck);
    var h = deck.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var w = deck.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var hud = deck.querySelector('.hud').offsetHeight;
    var gap = h < 560 ? 24 : 48;
    deck.style.setProperty('--deck-gap', gap + 'px');
    // keep room below the card for the sample word
    var s = Math.max(0.5, Math.min(1, w / 330, (h - hud - gap - SAMPLE_ROOM) / 462));
    stage.style.setProperty('--fit', s);
    stageBox.style.width = (330 * s) + 'px';
    stageBox.style.height = (462 * s) + 'px';
    scale = s;
    // Balance the header above with matching space below so the card sits at the
    // screen's vertical centre, as far as the free space allows.
    var slack = Math.max(0, h - hud - gap - 462 * s);
    var pad = hud + gap + parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    table.style.paddingBottom = Math.max(0, Math.min(slack, pad)) + 'px';
    // The sample word fills the space between the card and the bottom of the screen.
    sampleEl.style.top = (stageBox.getBoundingClientRect().bottom - deck.getBoundingClientRect().top) + 'px';
  }
  var SAMPLE_ROOM = 56;

  // ---------- Actions & motion ----------

  var busy = false;
  var queued = null;
  var DUR = { up: 380, down: 440, left: 240, right: 240 };

  function clearMotion() {
    cardEl.classList.remove('up', 'down', 'left', 'right', 'spring', 'dragging');
    behindEl.classList.remove('rise-up', 'rise-down', 'rise-now');
    cardEl.style.setProperty('--dx', '0px');
    cardEl.style.setProperty('--dy', '0px');
  }

  // dir: 'up' (got it), 'down' (missed), 'left' (back), 'right' (skip).
  // dx/dy: drag offset at release in card px, so the motion starts where the finger left it.
  function act(dir, dx, dy) {
    if (busy) { queued = dir; return; }
    if (dir === 'left' && prevCard() === null) { springBack(); return; }
    busy = true;

    if (dir === 'up' || dir === 'down') {
      var c = CARDS[current()], id = c.id;
      progress.attempts[id] += 1;
      if (dir === 'up') { progress.correct[id] += 1; progress.levels[id] = Math.min(MAX_LEVEL, progress.levels[id] + 1); }
      else progress.levels[id] = Math.max(0, progress.levels[id] - 1);
      progress.trained += 1;
      renderHud();
      announce((dir === 'up' ? 'Got it. ' : 'Missed. ') + spokenName(c) + ' is level ' + progress.levels[id] + '.');
    }

    setBehind(dir === 'left' ? prevCard() : nextCard());

    cardEl.classList.remove('spring', 'dragging');
    cardEl.style.setProperty('--dx', (dx || 0) + 'px');
    cardEl.style.setProperty('--dy', (dy || 0) + 'px');
    // restart animations even if the same class was just removed
    void cardEl.offsetWidth;
    cardEl.classList.add(dir);
    sampleEl.classList.add('hide');
    behindEl.classList.add(dir === 'up' ? 'rise-up' : dir === 'down' ? 'rise-down' : 'rise-now');

    var total = reduced() ? 150 : DUR[dir];
    setTimeout(function () {
      if (dir === 'left') goPrev(); else goNext();
      progress.lastCard = CARDS[current()].id;
      save();
      clearMotion();
      renderCard();
      renderHud();
      busy = false;
      if (queued) {
        var q = queued; queued = null;
        requestAnimationFrame(function () { act(q, 0, 0); });
      }
    }, total);
  }

  function springBack() {
    cardEl.classList.add('spring');
    cardEl.style.setProperty('--dx', '0px');
    cardEl.style.setProperty('--dy', '0px');
    setTimeout(function () { if (!drag && !busy) { cardEl.classList.remove('spring'); setBehind(nextCard()); } }, 240);
  }

  // ---------- Pointer gestures ----------

  var drag = null;
  var TAP = 6, COMMIT = 90, FLICK_V = 0.6, FLICK_MIN = 30;

  cardEl.addEventListener('pointerdown', function (e) {
    if (busy || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null, moved: false, samples: [{ t: e.timeStamp, x: e.clientX, y: e.clientY }] };
    try { cardEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    cardEl.classList.remove('spring');
    cardEl.classList.add('dragging');
  });

  cardEl.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
    if (drag.samples.length > 8) drag.samples.shift();
    if (!drag.moved) {
      if (Math.abs(dx) < TAP && Math.abs(dy) < TAP) return;
      drag.moved = true;
      drag.axis = Math.abs(dy) >= Math.abs(dx) ? 'y' : 'x';
    }
    if (drag.axis === 'y') {
      cardEl.style.setProperty('--dy', (dy / scale) + 'px');
      setBehind(nextCard());
    } else {
      cardEl.style.setProperty('--dx', (dx / scale) + 'px');
      setBehind(dx < 0 && prevCard() !== null ? prevCard() : nextCard());
    }
  });

  function velocity(d, e) {
    var now = e.timeStamp, s = d.samples, first = s[0];
    for (var i = s.length - 1; i >= 0; i--) { if (now - s[i].t > 100) { first = s[i]; break; } }
    var dt = Math.max(now - first.t, 1);
    return { x: (e.clientX - first.x) / dt, y: (e.clientY - first.y) / dt };
  }

  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    cardEl.classList.remove('dragging');
    var dx = e.clientX - d.x, dy = e.clientY - d.y;

    if (!cancelled && !d.moved) { flip(); return; }
    if (!cancelled) {
      var v = velocity(d, e);
      if (d.axis === 'y') {
        if (dy <= -COMMIT || (v.y < -FLICK_V && dy <= -FLICK_MIN)) return act('up', 0, dy / scale);
        if (dy >= COMMIT || (v.y > FLICK_V && dy >= FLICK_MIN)) return act('down', 0, dy / scale);
      } else {
        if (dx <= -COMMIT || (v.x < -FLICK_V && dx <= -FLICK_MIN)) return act('left', dx / scale, 0);
        if (dx >= COMMIT || (v.x > FLICK_V && dx >= FLICK_MIN)) return act('right', dx / scale, 0);
      }
    }
    springBack();
  }

  cardEl.addEventListener('pointerup', function (e) { endDrag(e, false); });
  cardEl.addEventListener('pointercancel', function (e) { endDrag(e, true); });
  cardEl.addEventListener('lostpointercapture', function (e) { if (drag && e.pointerId === drag.id) endDrag(e, true); });
  cardEl.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // Keyboard / assistive-tech activation of the button (pointer taps are handled above).
  cardEl.addEventListener('click', function (e) { if (e.detail === 0) flip(); });

  // ---------- Keyboard ----------

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (!stoaEl.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeStoa(); }
      return;
    }
    var map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (map[e.key]) { e.preventDefault(); act(map[e.key], 0, 0); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      // A focused button handles its own Enter/Space (the card flips via its click handler).
      if (e.target && e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      flip();
    }
  });

  // ---------- Stoa ----------

  var stoaEl = $('stoa');
  var LEARN = ['#211F1C', '#4A4640'];
  var MASTER = ['#D8CFBE', '#F4F1EA'];

  function hexToRgb(h) { return [1, 3, 5].map(function (k) { return parseInt(h.slice(k, k + 2), 16); }); }
  function mix(pair, p) {
    var a = hexToRgb(pair[0]), b = hexToRgb(pair[1]);
    return '#' + a.map(function (v, k) { return Math.round(v + (b[k] - v) * p).toString(16).padStart(2, '0'); }).join('');
  }

  // The Stoa shows one tile per letter, combining its capital and small cards.
  function letterStats(l) {
    var u = l.key + '.upper', s = l.key + '.lower';
    var att = progress.attempts[u] + progress.attempts[s];
    var acc = att ? Math.round((progress.correct[u] + progress.correct[s]) / att * 100) : 0;
    var lu = progress.levels[u], ls = progress.levels[s];
    return { upper: lu, lower: ls, mastered: lu === MAX_LEVEL && ls === MAX_LEVEL, score: (lu + ls) / 2 * 100 + acc, acc: acc };
  }

  function segRow(lv, done) {
    var out = '';
    for (var k = 0; k < 5; k++) out += '<span' + (k < lv ? ' style="background:' + (done ? '#8C7B5E' : '#D2B27A') + '"' : '') + '></span>';
    return '<span class="tile-segs">' + out + '</span>';
  }

  function renderStoa() {
    var m = masteredCount();
    $('stoaMastered').textContent = 'MASTERED · ' + m + ' / ' + NC;
    $('stoaTrained').textContent = 'TRAINED · ' + progress.trained;
    $('stoaFill').style.width = (m / NC * 100) + '%';

    var stats = LETTERS.map(letterStats);
    var html = '';
    LETTERS.forEach(function (l, i) {
      var st = stats[i];
      var done = st.mastered;
      // rank within its own state; ties share the lower rank
      var group = stats.filter(function (x) { return x.mastered === done; })
        .map(function (x) { return x.score; }).sort(function (a, b) { return a - b; });
      var p = group.length > 1 ? group.indexOf(st.score) / (group.length - 1) : 1;
      html += '<li class="tile" style="background:' + mix(done ? MASTER : LEARN, p) + ';color:' + (done ? '#3A352E' : '#EFEBE3') + '"' +
        ' aria-label="' + titleCase(l.name) + ': capital level ' + st.upper + ', small level ' + st.lower + ' of 5' +
        (done ? ', mastered' : '') + ', accuracy ' + st.acc + ' percent">' +
        '<span class="tile-glyph" lang="el" aria-hidden="true">' + l.glyph + '</span>' +
        '<span class="tile-name" aria-hidden="true">' + l.name + '</span>' +
        '<span class="tile-bars" aria-hidden="true">' + segRow(st.upper, done) + segRow(st.lower, done) + '</span></li>';
    });
    $('grid').innerHTML = html;

    var steps = [0, 0.25, 0.5, 0.75, 1];
    $('rampLearning').innerHTML = steps.map(function (p) { return '<span style="background:' + mix(LEARN, p) + '"></span>'; }).join('');
    $('rampMastered').innerHTML = steps.map(function (p) { return '<span style="background:' + mix(MASTER, p) + '"></span>'; }).join('');
  }

  function setMsg(t) { $('stoaMsg').textContent = t || ''; }

  function openStoa() {
    renderStoa();
    setMsg('');
    hideReset();
    stoaEl.hidden = false;
    deck.setAttribute('aria-hidden', 'true');
    deck.inert = true;
    stoaEl.scrollTop = 0;
    $('closeStoa').focus();
    checkOffline();
  }

  function closeStoa() {
    stoaEl.hidden = true;
    deck.removeAttribute('aria-hidden');
    deck.inert = false;
    $('openStoa').focus();
  }

  $('openStoa').addEventListener('click', openStoa);
  $('closeStoa').addEventListener('click', closeStoa);

  // Export
  $('exportBtn').addEventListener('click', function () {
    var json = JSON.stringify(progress, null, 2);
    var name = 'greek-flashcards-progress.json';
    var blob = new Blob([json], { type: 'application/json' });
    var file = null;
    try { file = new File([blob], name, { type: 'application/json' }); } catch (e) { /* old browser */ }
    var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (file && touch && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'Greek flashcards progress' })
        .then(function () { setMsg('Progress exported.'); })
        .catch(function (err) { if (!err || err.name !== 'AbortError') downloadBlob(blob, name); });
      return;
    }
    downloadBlob(blob, name);
  });

  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    setMsg('Progress exported as ' + name + '.');
  }

  function restart() {
    history = [cardIndex(progress.lastCard)];
    pos = 0;
    upcoming = null;
    behindIndex = null;
    renderCard();
    renderHud();
    renderStoa();
  }

  // Import
  $('importBtn').addEventListener('click', function () { $('importFile').click(); });
  $('importFile').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var data = null;
      try { data = validate(JSON.parse(reader.result)); } catch (err) { data = null; }
      if (!data) { setMsg('That file isn’t a valid progress export.'); return; }
      progress = data;
      save();
      restart();
      setMsg('Progress imported.');
    };
    reader.onerror = function () { setMsg('Couldn’t read that file.'); };
    reader.readAsText(f);
  });

  // Reset (in-app confirmation)
  function hideReset() { $('resetConfirm').hidden = true; $('resetBtn').hidden = false; }
  $('resetBtn').addEventListener('click', function () {
    $('resetBtn').hidden = true;
    $('resetConfirm').hidden = false;
    $('resetCancel').focus();
  });
  $('resetCancel').addEventListener('click', function () { hideReset(); $('resetBtn').focus(); });
  $('resetYes').addEventListener('click', function () {
    progress = blankProgress();
    progress.lastCard = CARDS[Math.floor(Math.random() * NC)].id;
    save();
    restart();
    hideReset();
    $('resetBtn').focus();
    setMsg('Progress reset.');
  });

  // ---------- Offline status ----------

  var offlinePoll = null;
  function setOffline(ready) {
    var el = $('offline');
    el.textContent = ready ? 'READY OFFLINE ✓' : 'PREPARING OFFLINE…';
    el.classList.toggle('ready', ready);
  }

  function askWorker() {
    return new Promise(function (resolve) {
      if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return resolve(false);
      var ch = new MessageChannel();
      var done = false;
      ch.port1.onmessage = function (ev) { done = true; resolve(!!(ev.data && ev.data.ready)); };
      navigator.serviceWorker.controller.postMessage({ type: 'status' }, [ch.port2]);
      setTimeout(function () { if (!done) resolve(false); }, 1500);
    });
  }

  function checkOffline() {
    clearTimeout(offlinePoll);
    askWorker().then(function (ready) {
      setOffline(ready);
      if (!ready && !stoaEl.hidden) offlinePoll = setTimeout(checkOffline, 1000);
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () { /* offline unsupported */ });
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (!stoaEl.hidden) checkOffline(); });
  }

  // ---------- Boot ----------

  function boot() {
    computeFits();
    behindIndex = null;
    renderCard(true);
    renderHud();
    layout();
  }

  renderCard();
  renderHud();
  layout();
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', function () { setTimeout(layout, 150); });
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load("400 100px 'GFS Didot'", 'Αα'),
      document.fonts.load("600 50px 'Cinzel'", 'AĒŌ'),
      document.fonts.load("500 18px 'Cinzel'", 'A')
    ]).then(function () { if (!busy) boot(); else setTimeout(boot, 500); }, boot);
  } else {
    boot();
  }
})();
