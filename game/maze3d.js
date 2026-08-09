/* =====================================================================
 *  太空迷宫 3D 场景 (game/maze3d.js)
 *  依赖：外壳 index.html 已全局加载的 three.js r128（无 THREE / 无 WebGL 时
 *        supported() 返回 false，space.js 自动回退到平面迷宫条）。
 *
 *  设计要点（延续本站「护眼」原则）：
 *   - 柔和深蓝底色，不用纯黑高对比；无频闪、无高速粒子。
 *   - 镜头缓慢跟随（lerp），转向/前进动画时长偏长，避免眩晕。
 *   - 画面只在浏览器标签可见时渲染；canvas 离开 DOM 自动销毁，不留后台开销。
 *
 *  用法：
 *    const mz = Maze3D.create(canvasEl, { dirs: ['left','straight',...] });
 *    mz.walk('left', cb)  转向并前进一格，动画结束回调 cb
 *    mz.shake()           答错：原地摇头
 *    mz.hint('right')     看路牌：前方浮现发光箭头
 *    mz.celebrate()       通关：原地欢呼跳跃
 *    mz.dispose()         销毁
 * ===================================================================== */
window.Maze3D = (function () {
  const TILE = 4;        // 每格边长
  const WALL_H = 2.8;    // 墙高
  const WALL_T = 0.3;    // 墙厚
  // 朝向：0=北(-Z) 1=东(+X) 2=南(+Z) 3=西(-X)
  const STEP = [{ x: 0, z: -1 }, { x: 1, z: 0 }, { x: 0, z: 1 }, { x: -1, z: 0 }];

  function turn(h, d) {
    if (d === 'left') return (h + 3) % 4;
    if (d === 'right') return (h + 1) % 4;
    if (d === 'around') return (h + 2) % 4;
    return h;
  }
  /* 转向时的 yaw 增量：用增量而非绝对值，保证「左转」视觉上真的往左转 */
  function yawDelta(d) {
    if (d === 'left') return Math.PI / 2;
    if (d === 'right') return -Math.PI / 2;
    if (d === 'around') return -Math.PI;
    return 0;
  }
  function key(x, z) { return x + ',' + z; }
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function shuffle4() {
    const a = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function supported() {
    if (typeof THREE === 'undefined') return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  /* ---------- 小宇航员 ---------- */
  function buildAstronaut(store) {
    const g = new THREE.Group();
    const suit = new THREE.MeshPhongMaterial({ color: 0xf4f8ff, shininess: 44, specular: 0xa8c2ee });
    const dark = new THREE.MeshPhongMaterial({ color: 0x44548a, shininess: 30 });
    const glass = new THREE.MeshPhongMaterial({ color: 0x8fe0ff, shininess: 130, specular: 0xffffff, transparent: true, opacity: 0.55, emissive: 0x11405e });
    const skin = new THREE.MeshPhongMaterial({ color: 0xffd9b8, shininess: 8 });
    store.mats.push(suit, dark, glass, skin);

    const add = (mesh) => { g.add(mesh); store.geos.push(mesh.geometry); return mesh; };

    // 身体（圆柱 + 上下半球，圆润一点像小孩）
    const body = add(new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.34, 0.58, 20), suit)); body.position.y = 0.74;
    const chest = add(new THREE.Mesh(new THREE.SphereGeometry(0.30, 18, 14), suit)); chest.position.y = 1.02;
    const hip = add(new THREE.Mesh(new THREE.SphereGeometry(0.335, 18, 14), suit)); hip.position.y = 0.46;
    // 胸前控制板
    const panel = add(new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.14, 0.06), dark)); panel.position.set(0, 0.86, -0.29);

    // 头 + 头盔（正面朝 -Z）
    const head = add(new THREE.Mesh(new THREE.SphereGeometry(0.255, 20, 16), skin)); head.position.set(0, 1.33, 0.02);
    const helm = add(new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 18), glass)); helm.position.set(0, 1.33, 0);
    const ring = add(new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.05, 10, 24), dark)); ring.position.set(0, 1.06, 0); ring.rotation.x = Math.PI / 2;

    const eyeMat = new THREE.MeshPhongMaterial({ color: 0x28324f }); store.mats.push(eyeMat);
    const eyeGeo = new THREE.SphereGeometry(0.045, 10, 8); store.geos.push(eyeGeo);
    const e1 = new THREE.Mesh(eyeGeo, eyeMat); e1.position.set(-0.088, 1.36, -0.205); g.add(e1);
    const e2 = new THREE.Mesh(eyeGeo, eyeMat); e2.position.set(0.088, 1.36, -0.205); g.add(e2);
    const mouthMat = new THREE.MeshPhongMaterial({ color: 0xd07a7a }); store.mats.push(mouthMat);
    const mouth = add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), mouthMat));
    mouth.scale.set(1.6, 0.55, 0.55); mouth.position.set(0, 1.25, -0.215);

    // 生命维持背包 + 天线
    const pack = add(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.22), dark)); pack.position.set(0, 0.82, 0.31);
    const antMat = new THREE.MeshPhongMaterial({ color: 0xffd43b, emissive: 0x6b5200 }); store.mats.push(antMat);
    const ant = add(new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.34, 8), antMat)); ant.position.set(0.20, 1.20, 0.26); ant.rotation.z = -0.35;
    const bulb = add(new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), antMat)); bulb.position.set(0.28, 1.36, 0.26);

    // 手臂（用 Group 做肩关节，方便摆动）
    const armGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.46, 12); store.geos.push(armGeo);
    const gloveGeo = new THREE.SphereGeometry(0.10, 12, 10); store.geos.push(gloveGeo);
    function mkArm(sx) {
      const grp = new THREE.Group();
      const a = new THREE.Mesh(armGeo, suit); a.position.y = -0.23; grp.add(a);
      const gl = new THREE.Mesh(gloveGeo, dark); gl.position.y = -0.48; grp.add(gl);
      grp.position.set(sx * 0.37, 0.98, 0);
      g.add(grp); return grp;
    }
    const armL = mkArm(-1), armR = mkArm(1);

    // 腿 + 靴子
    const legGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.44, 12); store.geos.push(legGeo);
    const bootGeo = new THREE.BoxGeometry(0.20, 0.13, 0.29); store.geos.push(bootGeo);
    function mkLeg(sx) {
      const grp = new THREE.Group();
      const l = new THREE.Mesh(legGeo, suit); l.position.y = -0.22; grp.add(l);
      const b = new THREE.Mesh(bootGeo, dark); b.position.set(0, -0.47, -0.04); grp.add(b);
      grp.position.set(sx * 0.145, 0.44, 0);
      g.add(grp); return grp;
    }
    const legL = mkLeg(-1), legR = mkLeg(1);

    return { group: g, armL, armR, legL, legR };
  }

  /* ---------- 场景 ---------- */
  function create(canvas, opts) {
    opts = opts || {};
    const dirSeq = opts.dirs || [];

    /* 1) 按题目方向序列推算真实路径（每题一步，走出来的就是这张迷宫图） */
    let h = 0, cx = 0, cz = 0;
    const path = [{ x: 0, z: 0, h: 0 }];
    dirSeq.forEach(d => { h = turn(h, d); cx += STEP[h].x; cz += STEP[h].z; path.push({ x: cx, z: cz, h: h }); });

    /* 2) 地板集合 = 路径格 + 若干死胡同分支走廊（制造「这是一片迷宫」的分叉感）
     *    题目方向有掉头/连续右转时路径会自交，格子偏少，分支能把场景撑开。 */
    const floor = new Set();
    path.forEach(p => floor.add(key(p.x, p.z)));
    path.forEach((p, i) => {
      if (i === 0 || Math.random() > 0.6) return;
      let bx = p.x, bz = p.z;
      const len = 1 + (Math.random() < 0.45 ? 1 : 0);              // 分支长 1~2 格
      for (let s = 0; s < len; s++) {
        const order = shuffle4();
        let moved = false;
        for (let k = 0; k < 4; k++) {
          const nx = bx + STEP[order[k]].x, nz = bz + STEP[order[k]].z;
          if (!floor.has(key(nx, nz))) { floor.add(key(nx, nz)); bx = nx; bz = nz; moved = true; break; }
        }
        if (!moved) break;
      }
    });

    /* 3) 出口：最后一格再往前一格。必须避开已有通路，否则 BOSS 门会压在半路上被穿过去 */
    const lastP = path[path.length - 1];
    let exitH = lastP.h, ex = lastP.x + STEP[exitH].x, ez = lastP.z + STEP[exitH].z, exitY = 1.35;
    if (floor.has(key(ex, ez))) {
      const order = shuffle4();
      let found = false;
      for (let k = 0; k < 4; k++) {
        const nx = lastP.x + STEP[order[k]].x, nz = lastP.z + STEP[order[k]].z;
        if (!floor.has(key(nx, nz))) { exitH = order[k]; ex = nx; ez = nz; found = true; break; }
      }
      if (!found) { ex = lastP.x; ez = lastP.z; exitY = 3.7; }    // 四周都是路：改成悬浮传送门，绝不挡路
    }
    floor.add(key(ex, ez));

    const store = { geos: [], mats: [] };
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    const BG = 0x111c3c;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.Fog(BG, TILE * 2.4, TILE * 7.5);         // 远处走廊淡出 → 纵深感
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 260);

    scene.add(new THREE.AmbientLight(0xc3d8ff, 0.9));               // 环境光给足，避免孩子眯眼看
    const k1 = new THREE.DirectionalLight(0xffffff, 0.7); k1.position.set(4, 9, 3); scene.add(k1);
    const k2 = new THREE.DirectionalLight(0x8fb6ff, 0.45); k2.position.set(-5, 3, -6); scene.add(k2);

    /* 星空（缓慢自转，不闪烁） */
    const starGeo = new THREE.BufferGeometry();
    const sp = [];
    for (let i = 0; i < 420; i++) {
      const r = 60 + Math.random() * 50, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
      sp.push(r * Math.sin(b) * Math.cos(a), Math.abs(r * Math.cos(b)) * 0.7 + 8, r * Math.sin(b) * Math.sin(a));
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xdce9ff, size: 0.9, sizeAttenuation: true, fog: false, transparent: true, opacity: 0.85 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars); store.geos.push(starGeo); store.mats.push(starMat);

    /* 地板（棋盘双色）*/
    const tileGeo = new THREE.BoxGeometry(TILE - 0.1, 0.24, TILE - 0.1);
    const tileA = new THREE.MeshPhongMaterial({ color: 0x1d2d5c, shininess: 18, specular: 0x2b3f77 });
    const tileB = new THREE.MeshPhongMaterial({ color: 0x25376e, shininess: 18, specular: 0x2b3f77 });
    store.geos.push(tileGeo); store.mats.push(tileA, tileB);

    /* 墙 + 墙顶发光条 */
    const wallGeo = new THREE.BoxGeometry(TILE, WALL_H, WALL_T);
    const wallMat = new THREE.MeshPhongMaterial({ color: 0x3c4d8f, shininess: 26, specular: 0x22346a, emissive: 0x0e1533 });
    const capGeo = new THREE.BoxGeometry(TILE, 0.13, WALL_T * 1.35);
    const capMat = new THREE.MeshPhongMaterial({ color: 0x49d9ff, emissive: 0x1d7fa4, shininess: 70 });
    store.geos.push(wallGeo, capGeo); store.mats.push(wallMat, capMat);

    floor.forEach(k => {
      const parts = k.split(','), gx = +parts[0], gz = +parts[1];
      const t = new THREE.Mesh(tileGeo, (Math.abs(gx + gz) % 2 === 0) ? tileA : tileB);
      t.position.set(gx * TILE, -0.12, gz * TILE);
      scene.add(t);
      for (let d = 0; d < 4; d++) {
        if (floor.has(key(gx + STEP[d].x, gz + STEP[d].z))) continue;   // 相邻也是路 → 不砌墙（自然形成走廊/岔路）
        const w = new THREE.Mesh(wallGeo, wallMat);
        w.position.set(gx * TILE + STEP[d].x * TILE / 2, WALL_H / 2, gz * TILE + STEP[d].z * TILE / 2);
        if (d === 1 || d === 3) w.rotation.y = Math.PI / 2;
        scene.add(w);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(w.position.x, WALL_H + 0.06, w.position.z);
        cap.rotation.y = w.rotation.y;
        scene.add(cap);
      }
    });

    /* 终点：BOSS 传送门（暖橙发光，站在走廊里远远就能看见目标）*/
    const portalGrp = new THREE.Group();
    const ptGeo = new THREE.TorusGeometry(1.15, 0.14, 14, 32);
    const ptMat = new THREE.MeshPhongMaterial({ color: 0xffa94d, emissive: 0x8a4a05, shininess: 80 });
    const coreGeo = new THREE.CircleGeometry(1.05, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffd8a8, transparent: true, opacity: 0.34, side: THREE.DoubleSide });
    store.geos.push(ptGeo, coreGeo); store.mats.push(ptMat, coreMat);
    const pt = new THREE.Mesh(ptGeo, ptMat); portalGrp.add(pt);
    const core = new THREE.Mesh(coreGeo, coreMat); portalGrp.add(core);
    portalGrp.position.set(ex * TILE, exitY, ez * TILE);
    portalGrp.rotation.y = -exitH * Math.PI / 2;
    scene.add(portalGrp);

    /* 主角 */
    const av = buildAstronaut(store);
    const avatar = av.group;
    avatar.position.set(0, 0, 0);
    scene.add(avatar);

    let yaw = 0, headIdx = 0, stepIdx = 0;
    avatar.rotation.y = yaw;

    /* 相机初始位（角色后上方）*/
    const camPos = new THREE.Vector3(), camAim = new THREE.Vector3();
    function idealCam(out, aim) {
      const fx = -Math.sin(yaw), fz = -Math.cos(yaw);     // 角色正面方向（-Z 为基准）
      out.set(avatar.position.x - fx * 5.0, 3.5, avatar.position.z - fz * 5.0);
      aim.set(avatar.position.x + fx * 2.2, 1.15, avatar.position.z + fz * 2.2);
    }
    idealCam(camPos, camAim);
    camera.position.copy(camPos);
    camera.lookAt(camAim);
    const aimNow = camAim.clone();

    /* ---------- 动画队列 ---------- */
    const queue = [];
    let cur = null, swing = 0, hintObj = null, hintDie = 0, disposed = false, raf = 0;

    function push(a) { queue.push(a); if (!cur) cur = queue.shift(); }

    function walk(dirKey, onDone) {
      clearHint();                                        // 起步就收掉路牌箭头
      const dy = yawDelta(dirKey);
      const nextH = turn(headIdx, dirKey);
      const tgt = path[stepIdx + 1] || { x: path[path.length - 1].x + STEP[nextH].x, z: path[path.length - 1].z + STEP[nextH].z };
      headIdx = nextH; stepIdx++;
      if (dy) push({ type: 'turn', dur: dirKey === 'around' ? 760 : 520, from: yaw, to: yaw + dy });
      push({
        type: 'move', dur: 820,
        fx: avatar.position.x, fz: avatar.position.z,
        tx: tgt.x * TILE, tz: tgt.z * TILE,
        end: onDone                                       // 转向+前进整段结束后才回调（直走时也一样）
      });
    }
    function shake() { push({ type: 'shake', dur: 620, from: yaw }); }
    function celebrate() { push({ type: 'cheer', dur: 1200 }); }

    /* 看路牌：前方浮现一个发光箭头指向正确方向 */
    function hint(dirKey) {
      clearHint();
      const th = turn(headIdx, dirKey);
      const g = new THREE.Group();
      const m = new THREE.MeshPhongMaterial({ color: 0xffd43b, emissive: 0x7a5c00, shininess: 90 });
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.16, 0.16), m); shaft.position.x = -0.3;
      const tipG = new THREE.ConeGeometry(0.32, 0.6, 16);
      const tip = new THREE.Mesh(tipG, m); tip.position.x = 0.42; tip.rotation.z = -Math.PI / 2;
      g.add(shaft); g.add(tip);
      // 箭头整体朝目标方向：世界方向向量 (STEP[th].x, STEP[th].z)，箭头默认指 +X
      g.rotation.y = Math.atan2(-STEP[th].z, STEP[th].x);
      g.position.set(avatar.position.x + STEP[th].x * TILE * 0.5, 2.05, avatar.position.z + STEP[th].z * TILE * 0.5);
      scene.add(g);
      hintObj = g; hintDie = performance.now() + 2400;
      store.geos.push(tipG); store.mats.push(m);
    }
    function clearHint() { if (hintObj) { scene.remove(hintObj); hintObj = null; } }

    /* ---------- 渲染循环 ---------- */
    let lastT = performance.now();
    function frame(now) {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      if (!canvas.isConnected) { dispose(); return; }      // 离开 DOM（退出游戏/切换页面）自动清理
      if (document.hidden || !canvas.clientWidth) return;   // 标签页不可见 / 画布被隐藏时不渲染，省电
      const dt = Math.min(64, now - lastT); lastT = now;

      stars.rotation.y += 0.00012 * dt;
      portalGrp.rotation.z += 0.0004 * dt;
      if (hintObj) {
        hintObj.position.y = 2.05 + Math.sin(now / 260) * 0.12;
        if (now > hintDie) clearHint();
      }

      /* 当前动作 */
      let bob = Math.sin(now / 560) * 0.05;                 // 失重感：轻微上下浮动
      let armSwing = Math.sin(now / 700) * 0.12;
      if (cur) {
        if (cur.t0 == null) cur.t0 = now;
        const t = Math.min(1, (now - cur.t0) / cur.dur), e = ease(t);
        if (cur.type === 'turn') {
          yaw = cur.from + (cur.to - cur.from) * e;
          armSwing = Math.sin(t * Math.PI * 3) * 0.30;
        } else if (cur.type === 'move') {
          avatar.position.x = cur.fx + (cur.tx - cur.fx) * e;
          avatar.position.z = cur.fz + (cur.tz - cur.fz) * e;
          swing = Math.sin(t * Math.PI * 4) * 0.62;         // 迈步
          armSwing = -swing * 0.5;
          bob = Math.abs(Math.sin(t * Math.PI * 4)) * 0.07;
        } else if (cur.type === 'shake') {
          yaw = cur.from + Math.sin(t * Math.PI * 6) * 0.36; // 原地摇头「不对哦」
          armSwing = Math.sin(t * Math.PI * 6) * 0.25;
        } else if (cur.type === 'cheer') {
          bob = Math.abs(Math.sin(t * Math.PI * 3)) * 0.55;  // 欢呼跳跃
          armSwing = -1.9;
        }
        if (t >= 1) {
          if (cur.type === 'turn') yaw = cur.to;
          if (cur.type === 'move') { avatar.position.x = cur.tx; avatar.position.z = cur.tz; swing = 0; }
          if (cur.type === 'shake') yaw = cur.from;
          const done = cur.end; cur = queue.shift() || null;
          if (done) done();
        }
      } else {
        swing += (0 - swing) * 0.12;
      }

      avatar.rotation.y = yaw;
      avatar.position.y = bob;
      av.legL.rotation.x = swing; av.legR.rotation.x = -swing;
      av.armL.rotation.x = -armSwing; av.armR.rotation.x = armSwing;

      /* 相机平滑跟随 */
      idealCam(camPos, camAim);
      camera.position.lerp(camPos, 0.06);
      aimNow.lerp(camAim, 0.09);
      camera.lookAt(aimNow);

      renderer.render(scene, camera);
    }

    function resize() {
      if (disposed) return;
      const w = canvas.clientWidth || 480, hgt = canvas.clientHeight || 300;
      renderer.setSize(w, hgt, false);
      camera.aspect = w / hgt;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(frame);

    function dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      store.geos.forEach(g => { try { g.dispose(); } catch (e) {} });
      store.mats.forEach(m => { try { m.dispose(); } catch (e) {} });
      try { renderer.dispose(); } catch (e) {}
    }

    return { walk, shake, hint, celebrate, resize, dispose, get busy() { return !!cur; } };
  }

  return { supported, create };
})();
