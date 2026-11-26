/* Cena 3D do topo: bule servindo café na xícara da Ruah.
   Montada com three.js; o arquivo final (js/xicara3d.js) é gerado com esbuild a partir deste.
   Uso: montaXicara(elementoContainer, {logo:'img/logo.webp'}) → Promise que resolve quando o 1º quadro foi desenhado. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, Object3D,
  LatheGeometry, CylinderGeometry, TorusGeometry, SphereGeometry, RingGeometry, CircleGeometry, BufferGeometry, BufferAttribute, PlaneGeometry,
  MeshPhysicalMaterial, MeshBasicMaterial, DirectionalLight, AmbientLight, HemisphereLight,
  Vector2, Vector3, Color, CanvasTexture, TextureLoader, SRGBColorSpace,
  PMREMGenerator, ACESFilmicToneMapping, DoubleSide, Clock
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* tubo de raio variável (bico do bule e filete de café) */
function tubo(NL, NR) {
  const geo = new BufferGeometry(), pos = new Float32Array(NL * NR * 3), ix = [];
  for (let i = 0; i < NL - 1; i++) for (let j = 0; j < NR; j++) { const a = i * NR + j, b = i * NR + (j + 1) % NR, c = a + NR, d = b + NR; ix.push(a, c, b, b, c, d); }
  geo.setIndex(ix); geo.setAttribute('position', new BufferAttribute(pos, 3));
  const t3 = new Vector3(), n2 = new Vector3();
  // pontos[i], tangentes[i], raios[i] (número ou [rw, rn]), w = vetor perpendicular ao plano da curva
  geo.atualiza = (pontos, tangentes, raios, w) => {
    for (let i = 0; i < NL; i++) {
      n2.crossVectors(tangentes[i], w).normalize();
      const r = raios[i], rw = Array.isArray(r) ? r[0] : r, rn = Array.isArray(r) ? r[1] : r;
      for (let j = 0; j < NR; j++) {
        const a = j / NR * Math.PI * 2;
        t3.copy(pontos[i]).addScaledVector(w, Math.cos(a) * rw).addScaledVector(n2, Math.sin(a) * rn);
        const o = (i * NR + j) * 3; pos[o] = t3.x; pos[o + 1] = t3.y; pos[o + 2] = t3.z;
      }
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
  };
  return geo;
}

export function montaXicara(box, opts = {}) {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  box.appendChild(canvas);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;

  const camera = new PerspectiveCamera(30, 1, 0.1, 60);
  const alvo = new Vector3(-0.2, 0.75, 0);

  scene.add(new HemisphereLight(0xfff1dc, 0x123a2f, 0.6));
  const sol = new DirectionalLight(0xffd9a0, 2.4);
  sol.position.set(-3, 6, 4); sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024); sol.shadow.radius = 5; sol.shadow.bias = -0.0005;
  Object.assign(sol.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 18 });
  scene.add(sol);
  const recorte = new DirectionalLight(0xbfe8d0, 1.6); recorte.position.set(4, 2.5, -4); scene.add(recorte);
  scene.add(new AmbientLight(0xffffff, 0.12));

  /* ---------- materiais ---------- */
  const porcelana = new MeshPhysicalMaterial({ color: 0xfbf7ef, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.3, sheenColor: new Color(0xfff3e0) });
  // inox escovado no corpo, inox polido nos frisos, baquelite preta na alça e no pegador
  const inox = new MeshPhysicalMaterial({ color: 0xdfe3e6, metalness: 1, roughness: 0.2, clearcoat: 0.4, clearcoatRoughness: 0.15, side: DoubleSide });
  const inoxPolido = new MeshPhysicalMaterial({ color: 0xf2f4f5, metalness: 1, roughness: 0.06 });
  const baquelite = new MeshPhysicalMaterial({ color: 0x161412, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const cafe = new MeshPhysicalMaterial({ color: 0x2b1207, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.02, ior: 1.36 });
  const cc = document.createElement('canvas'); cc.width = cc.height = 256; const g = cc.getContext('2d');
  const rg = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  rg.addColorStop(0, '#b97a40'); rg.addColorStop(.5, '#9a5726'); rg.addColorStop(.85, '#6e3412'); rg.addColorStop(1, '#3f1a09');
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '230,180,120' : '80,35,12'},${Math.random() * .16})`; g.beginPath(); g.arc(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 9, 0, 7); g.fill(); }
  const cremaTex = new CanvasTexture(cc); cremaTex.colorSpace = SRGBColorSpace;
  const crema = new MeshPhysicalMaterial({ map: cremaTex, roughness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.1 });

  /* ---------- xícara da Ruah (em pé, recebendo o café) ---------- */
  const H = 1.25, RB = 0.6, RT = 0.95, E = 0.055, FUNDO = 0.12, NIVEL = 1.0;
  const rOut = y => RB + (RT - RB) * (y / H);
  const rIn = y => rOut(y) - E;
  const perfil = [];
  perfil.push(new Vector2(0.001, 0.02), new Vector2(RB - 0.08, 0.0), new Vector2(RB - 0.02, 0.0), new Vector2(RB, 0.04));
  for (let i = 1; i <= 16; i++) { const y = 0.04 + (H - 0.06) * i / 16; perfil.push(new Vector2(rOut(y) + Math.sin(i / 16 * Math.PI) * 0.035, y)); }
  for (let i = 0; i <= 8; i++) { const a = Math.PI * i / 8; perfil.push(new Vector2(rOut(H) - E / 2 + Math.cos(a) * E / 2, H + Math.sin(a) * E * 0.7)); }
  for (let i = 1; i <= 12; i++) { const y = H - (H - FUNDO) * i / 12; perfil.push(new Vector2(rIn(y), y)); }
  perfil.push(new Vector2(rIn(FUNDO) * 0.6, FUNDO - 0.01), new Vector2(0.001, FUNDO - 0.012));
  const xicara = new Group();
  const corpo = new Mesh(new LatheGeometry(perfil, 96), porcelana); corpo.castShadow = corpo.receiveShadow = true; xicara.add(corpo);
  const asa = new Mesh(new TorusGeometry(0.3, 0.068, 24, 48, Math.PI * 1.4), porcelana);
  asa.rotation.z = Math.PI * 1.3; asa.scale.set(0.9, 1.1, 1); asa.position.set(rOut(0.68) + 0.13, 0.68, 0); asa.castShadow = true;
  xicara.add(asa);
  if (opts.logo) {
    const y0 = 0.25, y1 = 1.0, th = 0.86;
    const dec = new Mesh(new CylinderGeometry(rOut(y1) + 0.032, rOut(y0) + 0.032, y1 - y0, 48, 1, true, -th / 2, th),
      new MeshPhysicalMaterial({ transparent: true, roughness: 0.3, clearcoat: 1, polygonOffset: true, polygonOffsetFactor: -2 }));
    dec.position.y = (y0 + y1) / 2;
    new TextureLoader().load(opts.logo, t => { t.colorSpace = SRGBColorSpace; t.anisotropy = 8; dec.material.map = t; dec.material.needsUpdate = true; });
    xicara.add(dec);
  }
  // café dentro da xícara, com ondinhas saindo de onde o filete cai
  const supGeo = new RingGeometry(0.0005, rIn(NIVEL) - 0.004, 72, 22);
  const supBase = supGeo.attributes.position.array.slice();
  const superficie = new Mesh(supGeo, crema); superficie.rotation.x = -Math.PI / 2; superficie.position.y = NIVEL; xicara.add(superficie);

  // pires
  const pp = [];
  pp.push(new Vector2(0.001, 0.0), new Vector2(0.45, 0.0), new Vector2(0.5, 0.03), new Vector2(0.55, 0.06));
  for (let i = 0; i <= 10; i++) { const t = i / 10; pp.push(new Vector2(0.55 + 0.6 * t, 0.06 + 0.16 * t * t)); }
  pp.push(new Vector2(1.17, 0.24), new Vector2(1.16, 0.26));
  for (let i = 0; i <= 10; i++) { const t = 1 - i / 10; pp.push(new Vector2(0.55 + 0.58 * t, 0.1 + 0.15 * t * t)); }
  pp.push(new Vector2(0.4, 0.1), new Vector2(0.001, 0.1));
  const pires = new Mesh(new LatheGeometry(pp, 96), porcelana); pires.castShadow = pires.receiveShadow = true;
  pires.scale.setScalar(1.12); pires.position.y = -0.11;
  const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sg = sc.getContext('2d');
  const sgr = sg.createRadialGradient(64, 64, 0, 64, 64, 64); sgr.addColorStop(0, 'rgba(0,0,0,.55)'); sgr.addColorStop(.55, 'rgba(0,0,0,.22)'); sgr.addColorStop(1, 'rgba(0,0,0,0)');
  sg.fillStyle = sgr; sg.fillRect(0, 0, 128, 128);
  const sombra = new Mesh(new PlaneGeometry(3.6, 3.6), new MeshBasicMaterial({ map: new CanvasTexture(sc), transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = -0.3;
  const mesa = new Group(); mesa.add(xicara, pires, sombra);
  xicara.rotation.y = -0.12;
  scene.add(mesa);

  /* ---------- bule de inox ---------- */
  const bule = new Group();
  const pb = [new Vector2(0.001, 0), new Vector2(0.5, 0), new Vector2(0.56, 0.04)];
  for (let i = 1; i <= 20; i++) { const t = i / 20, y = 0.04 + 1.22 * t; pb.push(new Vector2(0.56 + 0.26 * Math.sin(Math.min(1, t * 1.25) * Math.PI) * (1 - t * 0.35) - 0.12 * t * t, y)); }
  pb.push(new Vector2(0.47, 1.3), new Vector2(0.5, 1.34), new Vector2(0.49, 1.37), new Vector2(0.44, 1.35));
  for (let i = 1; i <= 6; i++) pb.push(new Vector2(0.44 - 0.02 * i, 1.35 - 0.12 * i)); // borda pra dentro (por onde se vê o interior)
  const corpoBule = new Mesh(new LatheGeometry(pb, 96), inox); corpoBule.castShadow = true; bule.add(corpoBule);
  // tampa
  const pt = [new Vector2(0.47, 1.36)];
  for (let i = 1; i <= 10; i++) { const a = i / 10 * Math.PI / 2; pt.push(new Vector2(0.47 * Math.cos(a) + 0.001, 1.36 + 0.26 * Math.sin(a))); }
  bule.add(new Mesh(new LatheGeometry(pt.reverse(), 64), inox));
  const pegador = new Mesh(new SphereGeometry(0.1, 24, 16), baquelite); pegador.position.y = 1.68; pegador.scale.y = 0.85; bule.add(pegador);
  const haste = new Mesh(new CylinderGeometry(0.04, 0.07, 0.08, 24), inoxPolido); haste.position.y = 1.61; bule.add(haste);
  const aro = new Mesh(new TorusGeometry(0.495, 0.022, 12, 96), inoxPolido); aro.rotation.x = Math.PI / 2; aro.position.y = 1.355; bule.add(aro);
  const faixa = new Mesh(new TorusGeometry(0.56, 0.016, 12, 96), inoxPolido); faixa.rotation.x = Math.PI / 2; faixa.position.y = 0.06; bule.add(faixa);
  // alça
  const alca = new Mesh(new TorusGeometry(0.4, 0.07, 24, 64, Math.PI * 1.3), baquelite);
  alca.rotation.z = Math.PI * 0.35; alca.scale.set(0.75, 1.05, 1); alca.position.set(-0.86, 0.72, 0); alca.castShadow = true; bule.add(alca);
  // bico (curva de Bézier quadrática afinando até a ponta)
  const B0 = new Vector3(0.62, 0.34, 0), B1 = new Vector3(1.02, 0.5, 0), B2 = new Vector3(1.32, 1.02, 0);
  const bez = t => new Vector3().addScaledVector(B0, (1 - t) ** 2).addScaledVector(B1, 2 * (1 - t) * t).addScaledVector(B2, t * t);
  const bezT = t => new Vector3().addScaledVector(B1.clone().sub(B0), 2 * (1 - t)).addScaledVector(B2.clone().sub(B1), 2 * t).normalize();
  const NB = 30, pB = [], tB = [], rB = [];
  for (let i = 0; i < NB; i++) { const t = i / (NB - 1); pB.push(bez(t)); tB.push(bezT(t)); const r = 0.15 - 0.085 * t + (t > 0.93 ? 0.02 * (t - 0.93) / 0.07 : 0); rB.push(i === 0 ? r * 1.25 : r); }
  pB[0].addScaledVector(tB[0], -0.12);
  const bicoGeo = tubo(NB, 28); bicoGeo.atualiza(pB, tB, rB, new Vector3(0, 0, 1));
  const bico = new Mesh(bicoGeo, inox); bico.castShadow = true; bule.add(bico);
  const bocaBico = new Mesh(new CircleGeometry(rB[NB - 1] * 0.8, 24), cafe);
  bocaBico.position.copy(pB[NB - 1]).addScaledVector(tB[NB - 1], -0.02);
  bocaBico.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), tB[NB - 1]); bule.add(bocaBico);
  const aroBico = new Mesh(new TorusGeometry(rB[NB - 1], 0.012, 8, 32), inoxPolido);
  aroBico.position.copy(pB[NB - 1]); aroBico.quaternion.copy(bocaBico.quaternion); bule.add(aroBico);
  scene.add(bule);
  const TIP = pB[NB - 1].clone().addScaledVector(tB[NB - 1], 0.01), TIPT = tB[NB - 1].clone();
  const bulePos = new Vector3(-1.75, 1.75, -0.1), buleInc = -0.95;

  /* ---------- filete de café ---------- */
  const NL = 60;
  const filGeo = tubo(NL, 14);
  const filete = new Mesh(filGeo, cafe); filete.castShadow = true; filete.frustumCulled = false; scene.add(filete);
  const NG = 40;
  const gotas = new InstancedMesh(new SphereGeometry(1, 14, 10), cafe, NG); gotas.frustumCulled = false; scene.add(gotas);
  const gp = Array.from({ length: NG }, () => ({ p: new Vector3(), v: new Vector3(), r: 0, vida: -1, piso: 0 }));

  const G = new Vector3(0, -9.8, 0), UP = new Vector3(0, 1, 0), dummy = new Object3D();
  const tip = new Vector3(), tipT = new Vector3(), w = new Vector3(), queda = new Vector3();
  let yNivel = 0;
  const trilha = Array.from({ length: NL }, () => ({ p: new Vector3(), vel: new Vector3() }));
  const pts = trilha.map(k => k.p), tans = Array.from({ length: NL }, () => new Vector3()), rs = new Array(NL).fill(0);
  const v0 = new Vector3(), tmp = new Vector3();
  const mouse = new Vector2(), mouseS = new Vector2();
  let tempo = 0, nascer = 0;

  function atualizaBule(t) {
    const sway = reduz ? 0 : Math.sin(t * 0.8) * 0.018;
    bule.position.copy(bulePos); bule.position.y += reduz ? 0 : Math.sin(t * 1.1) * 0.02;
    bule.rotation.set(0, -0.2, buleInc + sway);
    bule.updateMatrixWorld(true);
    tip.copy(TIP).applyMatrix4(bule.matrixWorld);
    tipT.copy(TIPT).transformDirection(bule.matrixWorld);
  }

  function atualizaFilete(t) {
    v0.copy(tipT).multiplyScalar(0.85);
    const A = 0.5 * G.y, B = v0.y, C = tip.y - yNivel;
    const tf = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
    w.set(v0.x, 0, v0.z).normalize(); w.crossVectors(w, UP).normalize();
    const v0l = v0.length();
    for (let i = 0; i < NL; i++) {
      // pontos mais densos perto do bico, onde a curva é maior
      const s = i / (NL - 1), tt = s * tf;
      const p = trilha[i].p.copy(tip).addScaledVector(v0, tt).addScaledVector(G, 0.5 * tt * tt);
      const vel = trilha[i].vel.copy(v0).addScaledVector(G, tt);
      tans[i].copy(vel).normalize();
      let r = 0.075 * Math.sqrt(v0l / vel.length());
      if (i < 3) r *= 0.75 + 0.25 * i / 3;
      // ondinhas descendo sempre na mesma velocidade = fluxo constante
      r *= 1 + (reduz ? 0 : 0.07 * Math.sin(s * 34 - t * 14) + 0.03 * Math.sin(s * 77 - t * 23));
      rs[i] = i === NL - 1 ? r * 1.25 : r;
    }
    filGeo.atualiza(pts, tans, rs, w);
    queda.copy(trilha[NL - 1].p);
  }

  function atualizaSuperficie(t) {
    const lx = queda.x - mesa.position.x, lz = queda.z - mesa.position.z;
    // converte para o sistema do anel (girado -90° em x e pela rotação y da xícara)
    const cy = Math.cos(-xicara.rotation.y), sy = Math.sin(-xicara.rotation.y);
    const qx = lx * cy - lz * sy, qz = lx * sy + lz * cy;
    const ix = qx, iy = -qz;
    const arr = supGeo.attributes.position.array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = supBase[i], y = supBase[i + 1], d = Math.hypot(x - ix, y - iy);
      arr[i + 2] = reduz ? 0 : (0.022 * Math.sin(d * 24 - t * 11) * Math.exp(-d * 2.2) - 0.03 * Math.exp(-d * d * 60));
    }
    supGeo.attributes.position.needsUpdate = true; supGeo.computeVertexNormals();
  }

  function atualizaGotas(dt) {
    if (!reduz) {
      nascer += dt * 30;
      while (nascer > 1) {
        nascer--; let g = null; for (const x of gp) if (x.vida < 0) { g = x; break; } if (!g) break;
        if (Math.random() < 0.7) {
          const a = Math.random() * Math.PI * 2, s = 0.15 + Math.random() * 0.45;
          g.p.copy(queda).add(tmp.set(Math.cos(a) * 0.04, 0.01, Math.sin(a) * 0.04));
          g.v.set(Math.cos(a) * s, 0.9 + Math.random() * 1.2, Math.sin(a) * s); g.r = 0.01 + Math.random() * 0.018; g.piso = yNivel;
        } else {
          const k = trilha[Math.floor(8 + Math.random() * (NL - 16))];
          g.p.copy(k.p).addScaledVector(w, (Math.random() - 0.5) * 0.06);
          g.v.copy(k.vel).add(tmp.set((Math.random() - 0.5) * 0.3, Math.random() * 0.2, (Math.random() - 0.5) * 0.3)); g.r = 0.012 + Math.random() * 0.016; g.piso = yNivel;
        }
        g.vida = 1.5;
      }
    }
    for (let i = 0; i < NG; i++) { const g = gp[i];
      if (g.vida >= 0) {
        g.v.addScaledVector(G, dt); g.p.addScaledVector(g.v, dt); g.vida -= dt;
        if (g.p.y < g.piso && g.v.y < 0) g.vida = -1;
      }
      if (g.vida < 0) dummy.scale.setScalar(0);
      else {
        dummy.position.copy(g.p);
        dummy.quaternion.setFromUnitVectors(UP, tmp.copy(g.v).normalize());
        dummy.scale.set(g.r, g.r * (1 + Math.min(g.v.length() * 0.25, 1.4)), g.r);
      }
      dummy.updateMatrix(); gotas.setMatrixAt(i, dummy.matrix);
    }
    gotas.instanceMatrix.needsUpdate = true;
  }

  // posiciona a xícara exatamente onde o café cai (um pouco fora do centro)
  atualizaBule(0);
  mesa.position.set(0, -0.6, 0); yNivel = mesa.position.y + NIVEL;
  atualizaFilete(0);
  const dirQ = new Vector3(queda.x - tip.x, 0, queda.z - tip.z).normalize();
  mesa.position.x = queda.x + dirQ.x * 0.18; mesa.position.z = queda.z + dirQ.z * 0.18;

  function ajusta() {
    const r = box.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajusta).observe(box); ajusta();

  function quadro(dt) {
    dt = Math.min(dt, 1 / 30); // sem saltos depois de trocar de aba ou rolar a página
    tempo += dt;
    mouseS.lerp(mouse, Math.min(1, dt * 3));
    const raio = 11.2, az = 0.1 + mouseS.x * 0.2, el = 0.27 - mouseS.y * 0.08;
    camera.position.set(alvo.x + Math.sin(az) * raio * Math.cos(el), alvo.y + Math.sin(el) * raio, alvo.z + Math.cos(az) * raio * Math.cos(el));
    camera.lookAt(alvo);
    atualizaBule(tempo); atualizaFilete(tempo); atualizaSuperficie(tempo); atualizaGotas(dt);
    renderer.render(scene, camera);
  }

  addEventListener('pointermove', e => { mouse.set(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1); }, { passive: true });

  const relogio = new Clock(); let visivel = true, rodando = false;
  const laco = () => { if (!visivel || document.hidden) { rodando = false; return; } rodando = true; quadro(relogio.getDelta()); requestAnimationFrame(laco); };
  const liga = () => { if (!rodando && !reduz) { relogio.getDelta(); requestAnimationFrame(laco); } };
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) liga(); }).observe(box);
  document.addEventListener('visibilitychange', liga);

  for (let i = 0; i < 60; i++) { tempo += 1 / 60; atualizaFilete(tempo); atualizaGotas(1 / 60); }
  quadro(0.016);
  if (!reduz) liga();
  return Promise.resolve(canvas);
}
