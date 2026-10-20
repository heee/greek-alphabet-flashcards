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
  ].map(function (l) { return { key: l[0], glyph: l[1], name: l[2], pron: l[3], latin: l[4] }; });

  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
    'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV'];

  var N = LETTERS.length;
  var MAX_LEVEL = 5;
  var STORAGE_KEY = 'greekFlashcards.v1';

  // ---------- Progress model ----------

  function blankProgress() {
    var p = { version: 1, levels: {}, correct: {}, attempts: {}, trained: 0, lastIndex: 0 };
    LETTERS.forEach(function (l) { p.levels[l.key] = 0; p.correct[l.key] = 0; p.attempts[l.key] = 0; });
    return p;
  }

  function isCount(v, max) {
    return typeof v === 'number' && isFinite(v) && v >= 0 && Math.floor(v) === v && (max === undefined || v <= max);
  }

  // Returns a clean progress object, or null if the data is not valid v1 progress.
  function validate(data) {
    if (!data || typeof data !== 'object' || data.version !== 1) return null;
    var p = blankProgress();
    for (var i = 0; i < N; i++) {
      var k = LETTERS[i].key;
      if (!data.levels || !isCount(data.levels[k], MAX_LEVEL)) return null;
      if (!data.correct || !isCount(data.correct[k])) return null;
      if (!data.attempts || !isCount(data.attempts[k])) return null;
      p.levels[k] = data.levels[k];
      p.attempts[k] = data.attempts[k];
      p.correct[k] = Math.min(data.correct[k], data.attempts[k]);
    }
    if (!isCount(data.trained)) return null;
    p.trained = data.trained;
    p.lastIndex = isCount(data.lastIndex) && data.lastIndex < N ? data.lastIndex : 0;
    return p;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return validate(JSON.parse(raw)) || blankProgress();
    } catch (e) { /* storage unavailable: run in memory */ }
    return blankProgress();
  }

  function save() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* in-memory only */ }
  }

  var progress = load();
  var index = progress.lastIndex;

  function levelOf(i) { return progress.levels[LETTERS[i].key]; }
  function masteredCount() {
    return LETTERS.reduce(function (n, l) { return n + (progress.levels[l.key] === MAX_LEVEL ? 1 : 0); }, 0);
  }
  function accuracy(i) {
    var k = LETTERS[i].key;
    return progress.attempts[k] ? Math.round(progress.correct[k] / progress.attempts[k] * 100) : 0;
  }
  function wrap(i) { return (i + N) % N; }

  // ---------- DOM ----------

  var $ = function (id) { return document.getElementById(id); };
  var deck = $('deck');
  var stageBox = $('stageBox');
  var stage = $('stage');
  var cardEl = $('card');
  var behindEl = $('behind');
  var live = $('live');
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

  // Small seeded PRNG so each letter's marble has its own (stable) veins.
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

  // Font sizes that fit the 272px inner frame, measured once fonts are ready.
  var INNER_W = 330 - 28 - 28 - 2;
  var fit = { front: {}, name: {} };

  function fitSize(text, font, maxSize, spacing, avail) {
    measure.style.font = font.replace('{s}', maxSize + 'px');
    measure.style.letterSpacing = spacing + 'px';
    measure.textContent = text;
    var w = measure.offsetWidth - spacing; // trailing letter-spacing doesn't show
    return w > avail ? Math.floor(maxSize * avail / w) : maxSize;
  }

  function computeFits() {
    LETTERS.forEach(function (l) {
      fit.front[l.key] = fitSize(l.glyph, "400 {s} 'GFS Didot', serif", 176, 0, INNER_W - 8);
      fit.name[l.key] = fitSize(l.name, "600 {s} 'Cinzel', serif", 54, 4, INNER_W - 6);
    });
  }

  function frontHTML(i) {
    var l = LETTERS[i];
    var fs = fit.front[l.key] || 176;
    return '<div class="face face-front">' + veinsSVG(i) +
      '<div class="frame">' +
      '<div class="card-top"><span>GREEK · ' + ROMAN[i] + '</span><span>ALPHABET</span></div>' +
      '<div class="glyph-front" lang="el" style="font-size:' + fs + 'px">' + l.glyph + '</div>' +
      '<div class="card-foot">TAP TO FLIP</div>' +
      '</div></div>';
  }

  function backHTML(i) {
    var l = LETTERS[i];
    var fs = fit.name[l.key] || 50;
    return '<div class="face face-back"><div class="frame">' +
      '<div class="card-top"><span>GREEK · ' + ROMAN[i] + '</span><span>= ' + l.latin + '</span></div>' +
      '<div class="back-stack">' +
      '<div class="glyph-back" lang="el">' + l.glyph + '</div>' +
      '<div class="name" style="font-size:' + fs + 'px">' + l.name + '</div>' +
      '<div class="pron">' + l.pron + '</div>' +
      '</div>' +
      '<div class="card-foot">↑ GOT IT · ↓ MISSED</div>' +
      '</div></div>';
  }

  function titleCase(s) { return s.charAt(0) + s.slice(1).toLowerCase(); }

  var behindIndex = null;

  function renderCard() {
    var l = LETTERS[index];
    cardEl.innerHTML = frontHTML(index) + backHTML(index);
    cardEl.classList.remove('flipped');
    cardEl.setAttribute('aria-label', 'Card ' + titleCase(l.name) +
      '. Tap to flip, arrow up for got it, arrow down for missed, arrow left for previous, arrow right to skip.');
    setBehind(wrap(index + 1));
  }

  function setBehind(i) {
    if (behindIndex === i) return;
    behindIndex = i;
    behindEl.innerHTML = frontHTML(i);
  }

  function renderHud() {
    var lv = levelOf(index);
    $('levelLabel').textContent = 'CARD · ' + lv + ' / 5';
    var segs = $('levelSegs').children;
    for (var k = 0; k < segs.length; k++) segs[k].classList.toggle('on', k < lv);
    var m = masteredCount();
    $('masteredLabel').textContent = 'MASTERED · ' + m + ' / 24';
    $('masteredFill').style.width = (m / N * 100) + '%';
    $('openStoa').setAttribute('aria-label', 'Mastered ' + m + ' of 24. Open the Stoa statistics');
  }

  function announce(text) { live.textContent = text; }

  function flip() {
    if (busy) return;
    var on = !cardEl.classList.contains('flipped');
    cardEl.classList.toggle('flipped', on);
    var l = LETTERS[index];
    if (on) announce(titleCase(l.name) + '. Pronounced ' + l.pron.replace(/ · /g, ' ').toLowerCase() + '. Latin ' + l.latin + '.');
  }

  // ---------- Layout: scale the 330x462 card to the screen ----------

  function layout() {
    var cs = getComputedStyle(deck);
    var h = deck.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var w = deck.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var hud = deck.querySelector('.hud').offsetHeight;
    var gap = h < 560 ? 24 : 48;
    deck.style.setProperty('--deck-gap', gap + 'px');
    var s = Math.min(1, w / 330, (h - hud - gap) / 462);
    s = Math.max(0.5, s);
    stage.style.setProperty('--fit', s);
    stageBox.style.width = (330 * s) + 'px';
    stageBox.style.height = (462 * s) + 'px';
    scale = s;
  }
  var scale = 1;

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
    busy = true;

    if (dir === 'up' || dir === 'down') {
      var k = LETTERS[index].key;
      progress.attempts[k] += 1;
      if (dir === 'up') { progress.correct[k] += 1; progress.levels[k] = Math.min(MAX_LEVEL, progress.levels[k] + 1); }
      else progress.levels[k] = Math.max(0, progress.levels[k] - 1);
      progress.trained += 1;
      renderHud();
      announce((dir === 'up' ? 'Got it. ' : 'Missed. ') + titleCase(LETTERS[index].name) + ' is level ' + progress.levels[k] + '.');
    }

    var target = dir === 'left' ? wrap(index - 1) : wrap(index + 1);
    setBehind(target);

    cardEl.classList.remove('spring', 'dragging');
    cardEl.style.setProperty('--dx', (dx || 0) + 'px');
    cardEl.style.setProperty('--dy', (dy || 0) + 'px');
    // restart animations even if the same class was just removed
    void cardEl.offsetWidth;
    cardEl.classList.add(dir);
    behindEl.classList.add(dir === 'up' ? 'rise-up' : dir === 'down' ? 'rise-down' : 'rise-now');

    var total = reduced() ? 150 : DUR[dir];
    setTimeout(function () {
      index = target;
      progress.lastIndex = index;
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
      setBehind(wrap(index + 1));
    } else {
      cardEl.style.setProperty('--dx', (dx / scale) + 'px');
      setBehind(dx < 0 ? wrap(index - 1) : wrap(index + 1));
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
    // spring back
    cardEl.classList.add('spring');
    cardEl.style.setProperty('--dx', '0px');
    cardEl.style.setProperty('--dy', '0px');
    setTimeout(function () { if (!drag && !busy) { cardEl.classList.remove('spring'); setBehind(wrap(index + 1)); } }, 240);
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

  function renderStoa() {
    var m = masteredCount();
    $('stoaMastered').textContent = 'MASTERED · ' + m + ' / 24';
    $('stoaTrained').textContent = 'TRAINED · ' + progress.trained;
    $('stoaFill').style.width = (m / N * 100) + '%';

    var scores = LETTERS.map(function (l, i) { return levelOf(i) * 100 + accuracy(i); });
    var html = '';
    LETTERS.forEach(function (l, i) {
      var lv = levelOf(i);
      var done = lv === MAX_LEVEL;
      // rank within its own state; ties share the lower rank
      var group = scores.filter(function (_, j) { return (levelOf(j) === MAX_LEVEL) === done; }).sort(function (a, b) { return a - b; });
      var p = group.length > 1 ? group.indexOf(scores[i]) / (group.length - 1) : 1;
      var segs = '';
      for (var k = 0; k < 5; k++) segs += '<span' + (k < lv ? ' style="background:' + (done ? '#8C7B5E' : '#D2B27A') + '"' : '') + '></span>';
      html += '<li class="tile" style="background:' + mix(done ? MASTER : LEARN, p) + ';color:' + (done ? '#3A352E' : '#EFEBE3') + '"' +
        ' aria-label="' + titleCase(l.name) + ', level ' + lv + ' of 5' + (done ? ', mastered' : '') + ', accuracy ' + accuracy(i) + ' percent">' +
        '<span class="tile-glyph" lang="el" aria-hidden="true">' + l.glyph + '</span>' +
        '<span class="tile-name" aria-hidden="true">' + l.name + '</span>' +
        '<span class="tile-segs" aria-hidden="true">' + segs + '</span></li>';
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
      index = progress.lastIndex;
      save();
      renderCard();
      renderHud();
      renderStoa();
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
    index = 0;
    save();
    renderCard();
    renderHud();
    renderStoa();
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
    renderCard();
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
