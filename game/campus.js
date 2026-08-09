/* =====================================================================
 *  英语冒险闯关 · 校园关 (game/campus.js)
 *  题循环模式：听选 / 补句 / 拼写 / 跟读；完成后存分并引导去太空关。
 * ===================================================================== */
(function () {
  const DATA = window.GAME_DATA;
  const LV = DATA.levels.find(l => l.level === 'campus');
  const WORDS = LV.words;
  const SENTS = LV.sentences;

  /* ---- 小工具 ---- */
  function pick(arr, n) {
    const a = arr.slice(); const out = [];
    while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    return out;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function optBtn(en, zh) {
    return '<button class="gopt" data-en="' + esc(en) + '">' + esc(en) +
      (zh ? ' <span class="gopt-zh">' + esc(zh) + '</span>' : '') + '</button>';
  }

  /* ---- 题型构造 ---- */
  function makeListenChoice(s) {
    const others = SENTS.filter(x => x.zh !== s.zh);
    const opts = shuffle([s].concat(pick(others, 3)));
    return {
      word: null,
      render(ctx) {
        ctx.setBlindAudio(s.en, GameEngine.RATE_SENT);
        ctx.bodyHTML(
          '<div class="gq"><div class="gq-tip">👂 听一听，选这句话的意思</div>' +
          '<button class="btn speak g-play">🔊 听句子</button>' +
          '<div class="g-opts">' + opts.map(o => '<button class="gopt" data-zh="' + esc(o.zh) + '">' + esc(o.zh) + '</button>').join('') + '</div></div>'
        );
        const body = ctx.bodyEl();
        body.querySelector('.g-play').addEventListener('click', () => ctx.say(s.en, GameEngine.RATE_SENT));
        body.querySelectorAll('.gopt').forEach(b => b.addEventListener('click', () => {
          if (b.getAttribute('data-zh') === s.zh) ctx.pass(false);
          else ctx.retry();
        }));
        ctx.say(s.en, GameEngine.RATE_SENT);
      }
    };
  }

  function makeFill(s) {
    // 从句子里挑一个在词库中的实词挖空
    const toks = s.en.replace(/[^A-Za-z\' ]/g, ' ').split(/\s+/).filter(Boolean);
    const cand = toks.filter(t => WORDS.some(w => w.en.toLowerCase() === t.toLowerCase()));
    const blank = (cand.length ? cand[Math.floor(Math.random() * cand.length)] : toks[0]);
    const blankLow = blank.toLowerCase();
    const shown = s.en.replace(new RegExp('\\b' + blank + '\\b', 'i'), '____');
    const correct = WORDS.find(w => w.en.toLowerCase() === blankLow) || { en: blank, zh: '' };
    const distract = pick(WORDS.filter(w => w.en.toLowerCase() !== blankLow), 3);
    const opts = shuffle([correct].concat(distract));
    return {
      word: correct,
      render(ctx) {
        ctx.setBlindAudio(s.en, GameEngine.RATE_SENT);
        ctx.bodyHTML(
          '<div class="gq"><div class="gq-tip">✏️ 听句子，选出空里的词</div>' +
          '<div class="g-sentence">' + esc(shown) + '</div>' +
          '<button class="btn speak g-play">🔊 听句子</button>' +
          '<div class="g-opts">' + opts.map(o => optBtn(o.en, o.zh)).join('') + '</div></div>'
        );
        const body = ctx.bodyEl();
        body.querySelector('.g-play').addEventListener('click', () => ctx.say(s.en, GameEngine.RATE_SENT));
        body.querySelectorAll('.gopt').forEach(b => b.addEventListener('click', () => {
          if (norm(b.getAttribute('data-en')) === norm(correct.en)) ctx.pass(false);
          else ctx.retry();
        }));
        ctx.say(s.en, GameEngine.RATE_SENT);
      }
    };
  }

  function makeSpell(w) {
    return {
      word: w,
      render(ctx) {
        ctx.setBlindAudio(w.en, GameEngine.RATE_WORD);
        ctx.bodyHTML(
          '<div class="gq"><div class="gq-tip">🔤 拼出这个词的英文</div>' +
          '<div class="g-zh">' + esc(w.zh) + '</div>' +
          (w.ipa ? '<div class="g-ipa">/' + esc(w.ipa) + '/</div>' : '') +
          '<button class="btn speak g-play">🔊 听发音</button>' +
          '<input class="g-input" id="gSpell" type="text" autocomplete="off" placeholder="在这里拼出英文…" />' +
          '<div class="g-row"><button class="btn" id="gSub">提交</button></div></div>'
        );
        const body = ctx.bodyEl();
        body.querySelector('.g-play').addEventListener('click', () => ctx.say(w.en, GameEngine.RATE_WORD));
        const input = body.querySelector('#gSpell');
        const submit = () => {
          const v = input.value.trim();
          if (!v) { ctx.feedback('先拼出来再提交哦', 'bad'); return; }
          if (nearMatch(norm(w.en), norm(v))) ctx.pass(false);
          else ctx.retry();
        };
        body.querySelector('#gSub').addEventListener('click', submit);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
        setTimeout(() => input.focus(), 300);
        ctx.say(w.en, GameEngine.RATE_WORD);
      }
    };
  }

  function makeRead(s) {
    return {
      word: null,
      render(ctx) {
        ctx.setBlindAudio(s.en, GameEngine.RATE_SENT);
        const hasSp = GameEngine.speechSupported;
        ctx.bodyHTML(
          '<div class="gq"><div class="gq-tip">📢 大声跟读这句话</div>' +
          '<div class="g-sentence">' + esc(s.en) + '</div>' +
          '<div class="g-zh">' + esc(s.zh) + '</div>' +
          '<button class="btn speak g-play">🔊 听一句</button>' +
          (hasSp ? '<button class="mic g-mic">🎤</button>' : '') +
          '<div class="g-listen" id="gListen"></div>' +
          '<div id="gFbWrap" style="' + (hasSp ? 'display:none;' : '') + '">' +
            '<input class="g-input" id="gFallback" type="text" autocomplete="off" placeholder="' + (hasSp ? '在这里拼出英文…' : '语音不可用，在这里拼出英文…') + '" />' +
            '<div class="g-row"><button class="btn" id="gSub">提交拼写</button></div>' +
          '</div>' +
          (hasSp ? '<div class="g-row"><button class="btn ghost" id="gType">⌨️ 打字代替</button></div>' : '')
        );
        const body = ctx.bodyEl();
        const listen = body.querySelector('#gListen');
        const mic = body.querySelector('.g-mic');
        const fbWrap = body.querySelector('#gFbWrap');
        const fb = body.querySelector('#gFallback');
        const tryScore = (heard, err) => {
          if (err) {
            listen.textContent = GameEngine.speechErrMsg(err);
            if (err !== 'no-speech' && fbWrap) fbWrap.style.display = 'block';
            return;
          }
          const sc = ctx.scoreRead(s.en, heard);
          if (sc >= GameEngine.READ_PASS) { ctx.pass(sc >= GameEngine.READ_STAR); }
          else { listen.textContent = '我听到：' + heard + '（' + sc + '分，再试一次）'; ctx.retry(); }
        };
        body.querySelector('.g-play').addEventListener('click', () => ctx.say(s.en, GameEngine.RATE_SENT));
        if (mic) mic.addEventListener('click', () => {
          listen.textContent = '🎤 聆听中…请大声读出来～';
          ctx.cancelTTS();                 // 先停掉任何正在播放的朗读，避免麦克风录到网站自己的声音
          ctx.listen((cands, err) => tryScore(cands ? cands[0] : '', err));
        });
        const typeBtn = body.querySelector('#gType');
        if (typeBtn) typeBtn.addEventListener('click', () => { if (fbWrap) fbWrap.style.display = 'block'; typeBtn.style.display = 'none'; if (fb) fb.focus(); });
        body.querySelector('#gSub').addEventListener('click', () => { if (fb && fb.value.trim()) tryScore(fb.value, null); });
        ctx.say(s.en, GameEngine.RATE_SENT);
      }
    };
  }

  /* ---- 组装题目 ---- */
  function buildQuestions() {
    const listenS = SENTS.filter(s => s.type === 'listen');
    const qs = [];
    pick(listenS, 5).forEach(s => qs.push(makeListenChoice(s)));
    pick(SENTS, 3).forEach(s => qs.push(makeFill(s)));
    pick(WORDS, 1).forEach(w => qs.push(makeSpell(w)));
    pick(SENTS, 3).forEach(s => qs.push(makeRead(s)));
    return shuffle(qs);
  }

  /* ---- 入口 ---- */
  function launch() {
    const level = { id: 'campus', name: '校园关', icon: '🏫' };
    GameEngine.mount(level, buildQuestions(), function (r) {
      DB.game = DB.game || {};
      DB.game.campus = { score: r.score, stars: r.stars, total: r.total, ts: Date.now() };
      saveDB();
      GameEngine.bodyHTML(
        '<div class="g-end">' +
        '<div class="g-end-emoji">🏫</div>' +
        '<div class="g-end-txt">《校园关》闯关成功！</div>' +
        '<div class="g-end-score">得分 ' + r.score + '　⭐' + r.stars + '/' + r.total + '</div>' +
        '<div class="g-end-hint">下一步解锁《太空终极关》——迷宫 + 宇航员 BOSS！</div>' +
        '<div class="g-row"><button class="btn" id="gNext">🚀 去太空关</button>' +
        '<button class="btn ghost" id="gAgain">🔁 再玩一次</button>' +
        '<button class="btn ghost" id="gHome">🏠 回小课堂</button></div></div>'
      );
      $('gNext').addEventListener('click', () => { GameEngine.exit(); location.hash = '#/game/space'; });
      $('gAgain').addEventListener('click', launch);
      $('gHome').addEventListener('click', () => { GameEngine.exit(); location.hash = '#/' + (DECKS[0] ? DECKS[0].id : '') + '/' + (DECKS[0] ? DECKS[0].groups[0].id : ''); });
      cheer();
    });
  }

  window.GameLevels = window.GameLevels || {};
  window.GameLevels.campus = launch;
})();
