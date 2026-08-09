/* =====================================================================
 *  英语冒险闯关 · 通用引擎 (game/engine.js)
 *  复用外壳底座：speak(美音TTS) / norm / nearMatch / lev / record(错词本)
 *              / cheer / toast / startClock(护眼) / DB / saveDB
 *  语音识别：独立 new 一个 SpeechRecognition，避免覆盖闪卡的 recog 回调。
 *  关卡文件只需提供 questions = [{ render(ctx){...} }, ...]，引擎管循环。
 * ===================================================================== */
window.GameEngine = (function () {
  const MAX_RETRIES = 3;                 // 同一小题最多重答次数（之后自动放行并记错词）
  const READ_PASS = 60, READ_STAR = 85;  // 跟读评分阈值（按可执行需求文档 MVP）

  /* ---------- 闯关朗读语速 ----------
   * 句子较长，读慢一点方便小朋友听清：在原语速基础上再放慢 20%
   *   校园关句子 0.90 → 0.72，太空关句子 1.00 → 0.80
   * 单词保持原速（本来就短、够清楚）。想再快/再慢只改这两个数字。 */
  const RATE_SENT = 0.72;                // 句子语速（校园关/闭眼听读）
  const RATE_SENT_SPACE = 0.80;          // 太空关句子语速
  const RATE_WORD = 0.85;                // 单词语速（未放慢）

  let host = null, level = null, qs = [], qi = 0, passed = 0, stars = 0, curRetries = 0, onDone = null, inGame = false;

  /* ---------- 独立语音识别 ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recog = null, listening = false, wantMic = false, ttsActive = false, curCb = null, watchdog = null;

  /* 把语音识别的错误码翻译成家长/孩子看得懂的提示 */
  function speechErrMsg(err) {
    switch (err) {
      case 'not-allowed':
      case 'service-not-allowed':
        return '🎤 麦克风没权限：请点浏览器地址栏左侧的图标，允许本网站使用麦克风，再点一次 🎤。';
      case 'audio-capture':
        return '🎤 没检测到麦克风设备，插上麦克风或用「打字代替」。';
      case 'network':
        return '🎤 语音识别需要联网，请检查网络后再试。';
      case 'no-speech-api':
        return '当前浏览器不支持语音识别（建议用 Chrome 或 Edge 打开），可用「打字代替」。';
      case 'start-failed':
        return '🎤 麦克风启动失败，请检查浏览器权限与麦克风设置。';
      case 'no-speech':
        return '🎤 没听到声音，再大声读一次～（或点「打字代替」）';
      case 'ended':
        return '🎤 没听到声音，再大声读一次～（或点「打字代替」）';
      default:
        return '🎤 语音出错了：' + (err || '未知错误') + '（可点「打字代替」）';
    }
  }

  function setupRecog() {
    if (!SR || recog) return;
    recog = new SR();
    recog.lang = 'en-US'; recog.interimResults = false; recog.maxAlternatives = 3;
    recog.onstart = () => { listening = true; };
    recog.onresult = e => {
      if (ttsActive) return;
      clearTimeout(watchdog);
      const cands = [];
      for (let i = 0; i < e.results[0].length; i++) cands.push(e.results[0][i].transcript);
      listening = false;
      if (curCb) { const cb = curCb; curCb = null; cb(cands, null); }
    };
    recog.onerror = e => { clearTimeout(watchdog); listening = false; if (e.error === 'aborted') return; if (curCb) { const cb = curCb; curCb = null; cb(null, e.error); } };
    recog.onend = () => { clearTimeout(watchdog); listening = false; if (wantMic) { wantMic = false; setTimeout(() => { try { recog.start(); } catch (x) {} }, 150); } };
  }
  function listen(cb) {
    setupRecog();
    if (!recog) { cb(null, 'no-speech-api'); return; }
    curCb = cb;
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {                            // 兜底：超时不返回则强制结束，避免界面卡在「聆听中」
      if (curCb) { const c = curCb; curCb = null; try { recog.stop(); } catch (e) {} c(null, 'no-speech'); }
    }, 12000);
    try { recog.start(); }
    catch (e) { if (!(e && e.message && /already started/i.test(e.message))) cb(null, 'start-failed'); }
  }
  function stopListen() { wantMic = false; try { recog && recog.stop(); } catch (e) {} }
  function cancelTTS() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} ttsActive = false; clearTimeout(watchdog); }

  /* ---------- 朗读评分（0-100） ---------- */
  const _lev = (typeof lev === 'function') ? lev : function (a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j), cur = new Array(n + 1);
    for (let i = 1; i <= m; i++) { cur[0] = i; for (let j = 1; j <= n; j++) { const c = a[i - 1] === b[j - 1] ? 0 : 1; cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c); } [prev, cur] = [cur, prev]; }
    return prev[n];
  };
  function scoreRead(target, heard) {
    target = norm(target); heard = norm(heard || '');
    if (!heard) return 0;
    if (heard === target) return 100;
    const L = Math.max(target.length, heard.length) || 1;
    return Math.max(0, Math.round((1 - _lev(target, heard) / L) * 100));
  }

  /* ---------- 题循环 ---------- */
  function setTitle(t) { const el = $('gameTitle'); if (el) el.textContent = t; }
  function say(text, rate) {
    if (!text) return;
    stopListen();                                       // 朗读前先关掉识别，避免麦克风录到网站自己的声音（与闪卡底座一致）
    ttsActive = true;                                   // 播放期间忽略麦克风结果（避免把网站自己的发音当成读对）
    const r = rate || RATE_SENT;
    speak(text, r);
    /* 估算 TTS 时长兜底：语速越慢播得越久，必须按 rate 反比放大，否则慢速朗读还没读完就解除屏蔽 */
    const est = (1800 + text.replace(/[^A-Za-z]/g, '').length * 120) / Math.max(0.4, r);
    setTimeout(() => { ttsActive = false; }, est);
  }
  function feedback(txt, cls) { const f = $('gameFb'); if (!f) return; f.textContent = txt || ''; f.className = 'g-fb' + (cls ? ' ' + cls : ''); }
  function bodyHTML(html) { const b = $('gameBody'); if (b) b.innerHTML = html; return b; }
  function bodyEl() { return $('gameBody'); }

  function renderHeader() {
    setTitle((level.icon || '🚀') + ' ' + level.name);
    const p = $('gameProg');
    if (p) p.textContent = '第 ' + (qi + 1) + ' / ' + qs.length + ' 关 · ⭐' + stars;
  }

  const ctx = {
    get q() { return qs[qi]; }, get qIndex() { return qi; }, get total() { return qs.length; },
    level, say, listen, stopListen, cancelTTS, scoreRead, feedback, bodyHTML, bodyEl,
    setTitle, renderHeader,
    pass(star) { passQ(!!star); },
    retry() { retryQ(); },
    setBlindAudio(text, rate) { blindAudio = { text, rate: rate || RATE_SENT }; },
    /* 自定义流程（如太空关迷宫+BOSS）使用： */
    mark(word, good) { if (word) record('game-' + level.id, word, !!good); },
    addStar() { stars++; },
    addPass() { passed++; },
    complete(result) { complete(result); }
  };

  let blindAudio = null;

  function passQ(star) {
    if (ctx.q && ctx.q.word) record('game-' + level.id, ctx.q.word, true);
    if (star) stars++;
    passed++;
    feedback('✅ 答对啦！', 'ok');
    cheer();
    setTimeout(advance, 1100);
  }
  function retryQ() {
    curRetries++;
    feedback('❌ 再试一次！', 'bad');
    if (curRetries >= MAX_RETRIES) {           // 超过上限：放行并记错词
      if (ctx.q && ctx.q.word) record('game-' + level.id, ctx.q.word, false);
      feedback('💡 正确答案稍后复习～', 'bad');
      setTimeout(advance, 1200);
      return;
    }
    if (blindAudio) say(blindAudio.text, blindAudio.rate);
    setTimeout(() => { if (inGame) renderCurrent(); }, 700);
  }
  function advance() {
    qi++;
    curRetries = 0;
    blindAudio = null;
    if (qi >= qs.length) { finish(); return; }
    renderHeader();
    renderCurrent();
  }
  function renderCurrent() {
    feedback('', '');
    const b = bodyEl(); if (b) b.innerHTML = '';
    if (qs[qi] && typeof qs[qi].render === 'function') qs[qi].render(ctx);
  }

  function finish() {
    stopListen(); inGame = false;
    const score = qs.length ? Math.round(passed / qs.length * 100) : 0;
    if (onDone) onDone({ level, passed, total: qs.length, score, stars });
    else endScreen({ level, passed, total: qs.length, score, stars });
  }

  /* 通用结束页（关卡自带的 onDone 也可覆盖） */
  function endScreen(r) {
    bodyHTML(
      '<div class="g-end">' +
      '<div class="g-end-emoji">🏆</div>' +
      '<div class="g-end-txt">《' + esc(r.level.name) + '》完成！</div>' +
      '<div class="g-end-score">得分 ' + r.score + '　⭐' + r.stars + '/' + r.total + '</div>' +
      '<div class="g-row"><button class="btn" id="gAgain">🔁 再玩一次</button>' +
      '<button class="btn ghost" id="gHome">🏠 回到小课堂</button></div>' +
      '</div>'
    );
    $('gAgain').addEventListener('click', () => { if (r.level.replay) r.level.replay(); });
    $('gHome').addEventListener('click', () => { GameEngine.exit(); location.hash = '#/' + (DECKS[0] ? DECKS[0].id : '') + '/' + (DECKS[0] ? DECKS[0].groups[0].id : ''); });
    cheer();
  }

  /* ---------- 挂载 / 退出 ---------- */
  function setup(lv, done) {
    inGame = true; level = lv; passed = 0; stars = 0; onDone = done || null;
    const g = $('gameArea'); if (g) g.style.display = 'block';
    ['seeStage', 'blindStage', 'colSide'].forEach(id => { const e = $(id); if (e) e.style.display = 'none'; });
    const pb = $('practiceBlock'); if (pb) pb.style.display = 'none';
    if (blindEl) { blindEl.classList.remove('on'); blindEl.innerHTML = ''; }
    $('blindStage') && $('blindStage').classList.remove('on');
    const st = $('start'); if (st) st.style.display = 'none';
    const pt = $('pageTitle'); if (pt) pt.textContent = '🚀 英语冒险';
    started = true; startClock();   // 护眼计时接力
  }
  function mount(lv, questions, done) {
    setup(lv, done);
    qs = questions || []; qi = 0; curRetries = 0;
    renderHeader();
    renderCurrent();
  }
  /* 自定义流程：startFn(ctx) 自己接管 body，结束后调 ctx.complete(result) */
  function begin(lv, startFn, done) {
    setup(lv, done);
    renderHeader();
    if (typeof startFn === 'function') startFn(ctx);
  }
  function complete(result) {
    stopListen(); inGame = false;
    if (onDone) onDone(result);
    else endScreen(result);
  }
  function exit() {
    inGame = false; stopListen();
    const g = $('gameArea'); if (g) g.style.display = 'none';
    // 还原闪卡界面显示状态
    const blind = (typeof mode !== 'undefined') ? mode === 'blind' : false;
    const ss = $('seeStage'); if (ss) ss.style.display = blind ? 'none' : 'block';
    const pb = $('practiceBlock'); if (pb) pb.style.display = 'block';
    const bs = $('blindStage');
    if (bs) { bs.style.display = blind ? 'flex' : 'none'; bs.classList.toggle('on', blind); }
  }
  function isInGame() { return inGame; }

  /* ---------- 闭眼听读（游戏内） ---------- */
  let blindEl = null;
  function toggleBlind() {
    if (!blindEl) blindEl = $('gameBlind');
    if (!blindEl) return;
    const on = blindEl.classList.toggle('on');
    const body = bodyEl(); if (body) body.style.visibility = on ? 'hidden' : 'visible';
    if (on) {
      blindEl.innerHTML =
        '<div class="b-title">🌗 闭眼听读模式</div>' +
        '<div class="b-sub">闭上眼睛，先听，再大声读。<br>不用看屏幕，保护小眼睛。</div>' +
        '<button class="b-mic" id="gBMic">🎤</button>' +
        '<div class="b-status" id="gBStatus">点上面的麦克风开始</div>' +
        '<div class="b-row"><button class="b-btn speak" id="gBSpeak">🔊 再听一次</button>' +
        '<button class="b-btn" id="gBExit">👀 退出闭眼</button></div>';
      const bs = $('gBSpeak'), bm = $('gBMic'), be = $('gBExit');
      if (blindAudio && bs) bs.addEventListener('click', () => say(blindAudio.text, blindAudio.rate));
      if (bm) bm.addEventListener('click', () => {
        if (!blindAudio) { toast('这一题没有要读的音频'); return; }
        cancelTTS();                 // 先停朗读，避免录到网站自己的声音
        const bst = $('gBStatus'); if (bst) { bst.textContent = '🎤 聆听中…请大声读出来～'; bst.className = 'b-status'; }
        listen((cands, err) => {
          if (!bst) return;
          if (err) { bst.textContent = GameEngine.speechErrMsg(err); bst.className = 'b-status bad'; return; }
          if (!cands) { bst.textContent = '🎤 没听到，再读一次～'; bst.className = 'b-status'; return; }
          const sc = scoreRead(blindAudio.text, cands[0] || '');
          if (sc >= READ_PASS) { bst.textContent = '✅ 读得真好！（' + sc + '分）'; bst.className = 'b-status ok'; }
          else { bst.textContent = '再试一次～（' + sc + '分）'; bst.className = 'b-status bad'; }
        });
      });
      if (be) be.addEventListener('click', toggleBlind);
    }
  }

  return { mount, begin, complete, exit, isInGame, toggleBlind, say, listen, stopListen, cancelTTS, scoreRead,
           get lev() { return _lev; }, READ_PASS, READ_STAR, MAX_RETRIES,
           RATE_SENT, RATE_SENT_SPACE, RATE_WORD,
           get speechSupported() { return !!SR; }, speechErrMsg };
})();
