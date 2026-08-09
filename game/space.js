/* =====================================================================
 *  英语冒险闯关 · 太空终极关 (game/space.js)
 *  自定义流程：方向迷宫(10句/2隐藏路牌) + 宇航员BOSS(10连句,累计8/10胜)
 *  通过 GameEngine.begin(level, startFn, done) 接管，结束调 ctx.complete(result)。
 * ===================================================================== */
(function () {
  const DATA = window.GAME_DATA;
  const LV = DATA.levels.find(l => l.level === 'space');
  const SENTS = LV.sentences;
  const DIRS = SENTS.filter(s => s.type === 'direction');
  const READS = SENTS.filter(s => s.type === 'read');

  function detectDir(en) {
    const t = (en || '').toLowerCase();
    if (t.includes('around')) return 'around';
    if (t.includes('left')) return 'left';
    if (t.includes('right')) return 'right';
    return 'straight';
  }
  const DIR_INFO = {
    left:    { icon: '←', label: '左转', cls: 'd-left' },
    right:   { icon: '→', label: '右转', cls: 'd-right' },
    straight:{ icon: '↑', label: '直走', cls: 'd-straight' },
    around:  { icon: '⟳', label: '掉头', cls: 'd-around' }
  };
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pick(arr, n) { const a = arr.slice(), out = []; while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); return out; }

  function launch() {
    const level = { id: 'space', name: '太空终极关', icon: '🚀' };
    GameEngine.begin(level, startAdventure, function (r) {
      // done：由 startAdventure 内部自己渲染最终页（需要聚合校园关分数）
    });
  }

  function startAdventure(ctx) {
    showIntro(ctx);
  }

  function showIntro(ctx) {
    ctx.bodyHTML(
      '<div class="g-end">' +
      '<div class="g-end-emoji">🚀</div>' +
      '<div class="g-end-txt">《太空终极关》</div>' +
      '<div class="g-end-hint">第一段：🛰️ 走进 3D 迷宫星球，听懂英文指令带小宇航员转向前进<br>' +
      '（' + DIRS.length + ' 步，迷路了还有 2 次「看路牌」可以用）<br>' +
      '第二段：宇航员 BOSS 连句挑战（读对 8/10 获胜）</div>' +
      '<div class="g-row"><button class="btn" id="gGo">🚀 开始冒险</button>' +
      '<button class="btn ghost" id="gHome">🏠 回小课堂</button></div></div>'
    );
    $('gGo').addEventListener('click', () => runMaze(ctx));
    $('gHome').addEventListener('click', () => { GameEngine.exit(); location.hash = '#/' + (DECKS[0] ? DECKS[0].id : '') + '/' + (DECKS[0] ? DECKS[0].groups[0].id : ''); });
  }

  /* ---------------- 迷宫（3D 场景；无 WebGL 时降级为原来的进度点） ----------------
   * 注意：3D 场景必须持续存在，所以这里「只搭一次台」，每一步只刷新文字，
   *      不再像以前那样每步 bodyHTML 重建整块 DOM。 */
  function runMaze(ctx) {
    const steps = shuffle(DIRS).slice(0, Math.min(10, DIRS.length));
    const seq = steps.map(s => detectDir(s.en));     // 正确方向序列 = 迷宫的真实走法
    const total = steps.length;
    let i = 0, correct = 0, signsLeft = 2, busy = false;

    const use3D = !!(window.Maze3D && Maze3D.supported());

    ctx.bodyHTML(
      '<div class="gq">' +
        '<div class="gq-tip" id="mzTip"></div>' +
        (use3D
          ? '<div class="maze3d"><canvas id="mazeCanvas"></canvas>' +
            '<div class="mz-tag">🛰️ 迷宫星球</div><div class="mz-step" id="mzStep"></div></div>'
          : '<div class="maze" id="mzBar"></div>') +
        '<button class="btn speak g-play" id="mzPlay">🔊 听指令</button>' +
        '<div class="g-dirs">' +
          '<button class="gdir d-left" data-d="left">← 左转</button>' +
          '<button class="gdir d-straight" data-d="straight">↑ 直走</button>' +
          '<button class="gdir d-right" data-d="right">→ 右转</button>' +
          '<button class="gdir d-around" data-d="around">⟳ 掉头</button>' +
        '</div>' +
        '<div class="g-row" id="mzSignRow"></div>' +
      '</div>'
    );

    let mz = null;
    if (use3D) { try { mz = Maze3D.create($('mazeCanvas'), { dirs: seq }); } catch (e) { mz = null; } }

    const body = ctx.bodyEl();
    const tip = body.querySelector('#mzTip');
    const signRow = body.querySelector('#mzSignRow');

    body.querySelector('#mzPlay').addEventListener('click', () => {
      if (steps[i]) ctx.say(steps[i].en, GameEngine.RATE_SENT_SPACE);
    });
    body.querySelectorAll('.gdir').forEach(b => b.addEventListener('click', () => {
      if (busy || !steps[i]) return;                  // 动画播放中锁住按钮，避免连点乱走
      if (b.getAttribute('data-d') === seq[i]) { correct++; ctx.mark(null, true); advance(true); }
      else {
        ctx.feedback('❌ 方向不对，再听一次', 'bad');
        if (mz) mz.shake();                           // 宇航员原地摇头
        ctx.say(steps[i].en, GameEngine.RATE_SENT_SPACE);
      }
    }));

    function refresh() {
      tip.textContent = '🧭 第 ' + (i + 1) + ' / ' + total + ' 步 · 听指令，带宇航员走出迷宫';
      const st = body.querySelector('#mzStep');
      if (st) st.textContent = (i + 1) + ' / ' + total;
      const bar = body.querySelector('#mzBar');       // 降级模式下的进度点
      if (bar) bar.innerHTML = steps.map((_, k) =>
        '<span class="mdot ' + (k < i ? 'done' : (k === i ? 'cur' : '')) + '">' + (k < i ? '🚀' : (k === i ? '🛸' : '·')) + '</span>'
      ).join('<span class="mline"></span>');
      signRow.innerHTML = signsLeft > 0 ? '<button class="btn ghost" id="gSign">🪧 看路牌（剩 ' + signsLeft + '）</button>' : '';
      const sign = body.querySelector('#gSign');
      if (sign) sign.addEventListener('click', () => {
        if (busy) return;
        signsLeft--; correct++; ctx.mark(null, true);
        ctx.feedback('🪧 路牌提示：' + DIR_INFO[seq[i]].label + '！', 'ok');
        if (mz) { mz.hint(seq[i]); setTimeout(() => advance(true), 950); }   // 先亮箭头再走
        else advance(true);
      });
    }
    function ask() {
      refresh();
      ctx.setBlindAudio(steps[i].en, GameEngine.RATE_SENT_SPACE);
      ctx.say(steps[i].en, GameEngine.RATE_SENT_SPACE);
    }
    function advance(ok) {
      busy = true;
      ctx.stopListen();
      if (ok) ctx.feedback('✅ 走对了！', 'ok');
      const go = () => {
        i++;
        if (i >= total) {                              // 走完全程：保持 busy 锁，进 BOSS
          ctx.feedback('🌟 走出迷宫啦！前面就是宇航员 BOSS', 'ok');
          if (mz) { mz.celebrate(); setTimeout(() => { mz.dispose(); runBoss(ctx, correct, total); }, 1500); }
          else setTimeout(() => runBoss(ctx, correct, total), 900);
          return;
        }
        busy = false;
        ask();
      };
      if (mz) mz.walk(seq[i], go); else setTimeout(go, 900);
    }
    ask();
  }

  /* ---------------- BOSS 10 连句 ---------------- */
  function runBoss(ctx, mazeCorrect, mazeTotal) {
    const list = (READS.length >= 10 ? READS : READS.concat(pick(SENTS, 10 - READS.length)));
    const qs = shuffle(list).slice(0, 10);
    let i = 0, pass = 0, stars = 0;

    function render() {
      const s = qs[i];
      ctx.setBlindAudio(s.en, GameEngine.RATE_SENT_SPACE);
      ctx.renderHeader();
      const hasSp = GameEngine.speechSupported;
      ctx.bodyHTML(
        '<div class="gq"><div class="gq-tip">🦊 宇航员 BOSS · 第 ' + (i + 1) + ' / 10 句 · 已通过 ' + pass + '/10</div>' +
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
      body.querySelector('.g-play').addEventListener('click', () => ctx.say(s.en, GameEngine.RATE_SENT_SPACE));
      const listen = body.querySelector('#gListen');
      const mic = body.querySelector('.g-mic');
      const fbWrap = body.querySelector('#gFbWrap');
      const fb = body.querySelector('#gFallback');
      let done = false; let tries = 0;
      const tryScore = (heard, err) => {
        if (err) {
          listen.textContent = GameEngine.speechErrMsg(err);
          if (err !== 'no-speech' && fbWrap) fbWrap.style.display = 'block';
          return;
        }
        if (done) return;
        const sc = ctx.scoreRead(s.en, heard);
        if (sc >= GameEngine.READ_PASS) {
          done = true; pass++; if (sc >= GameEngine.READ_STAR) stars++;
          ctx.mark(null, true);
          listen.textContent = '我听到：' + heard + '（' + sc + '分 ✅）';
          ctx.feedback('✅ 通过！', 'ok'); advance();
        } else {
          tries++;
          if (tries >= 2 || (fb && fb.value)) {
            done = true; ctx.mark(null, false);
            listen.textContent = '正确：' + s.en;
            ctx.feedback('💡 这句没过，继续下一句', 'bad'); advance();
          } else {
            ctx.feedback('❌ ' + sc + '分，再试一次（剩 ' + (2 - tries) + ' 次）', 'bad');
            listen.textContent = '我听到：' + heard + '（' + sc + '分）';
          }
        }
      };
      if (mic) mic.addEventListener('click', () => {
        listen.textContent = '🎤 聆听中…请大声读出来～';
        ctx.cancelTTS();                 // 先停掉任何正在播放的朗读，避免麦克风录到网站自己的声音
        ctx.listen((cands, err) => tryScore(cands ? cands[0] : '', err));
      });
      const typeBtn = body.querySelector('#gType');
      if (typeBtn) typeBtn.addEventListener('click', () => { if (fbWrap) fbWrap.style.display = 'block'; typeBtn.style.display = 'none'; if (fb) fb.focus(); });
      body.querySelector('#gSub').addEventListener('click', () => { if (fb && fb.value.trim()) tryScore(fb.value, null); });
      ctx.say(s.en, GameEngine.RATE_SENT_SPACE);
    }
    function advance() {
      ctx.stopListen();
      setTimeout(() => {
        i++;
        if (i >= 10) finishBoss(ctx, mazeCorrect, mazeTotal, pass, stars);
        else render();
      }, 1000);
    }
    render();
  }

  function finishBoss(ctx, mazeCorrect, mazeTotal, bossPass, bossStars) {
    const total = mazeTotal + 10;
    const passed = mazeCorrect + bossPass;
    const score = Math.round(passed / total * 100);
    const stars = bossStars + (mazeCorrect === mazeTotal ? 1 : 0);
    DB.game = DB.game || {};
    DB.game.space = { score, stars, total, bossPass, ts: Date.now() };
    saveDB();

    // 聚合校园关
    const camp = DB.game.campus;
    let aggHtml = '';
    if (camp) {
      const agg = Math.round(camp.score * 0.3 + score * 0.7);
      const win = agg >= 70;
      aggHtml = '<div class="g-agg ' + (win ? 'win' : 'lose') + '">终极总分（校园×0.3 + 太空×0.7）= <b>' + agg + '</b><br>' +
        (win ? '🎉 你征服了整段冒险！' : '再加把劲，终极总分要到 70 哦～') + '</div>';
    } else {
      aggHtml = '<div class="g-agg lose">先去《校园关》拿分，才能算出终极总分～</div>';
    }

    ctx.bodyHTML(
      '<div class="g-end">' +
      '<div class="g-end-emoji">🏆</div>' +
      '<div class="g-end-txt">《太空终极关》完成！</div>' +
      '<div class="g-end-score">迷宫 ' + mazeCorrect + '/' + mazeTotal + ' · BOSS ' + bossPass + '/10 · 得分 ' + score + ' ⭐' + stars + '</div>' +
      aggHtml +
      '<div class="g-row"><button class="btn" id="gAgain">🔁 再挑战</button>' +
      '<button class="btn ghost" id="gCampus">🏫 去校园关</button>' +
      '<button class="btn ghost" id="gHome">🏠 回小课堂</button></div></div>'
    );
    $('gAgain').addEventListener('click', launch);
    $('gCampus').addEventListener('click', () => { GameEngine.exit(); location.hash = '#/game/campus'; });
    $('gHome').addEventListener('click', () => { GameEngine.exit(); location.hash = '#/' + (DECKS[0] ? DECKS[0].id : '') + '/' + (DECKS[0] && DECKS[0].groups[0] ? DECKS[0].groups[0].id : ''); });
    cheer();
  }

  window.GameLevels = window.GameLevels || {};
  window.GameLevels.space = launch;
})();
