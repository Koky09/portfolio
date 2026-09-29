// Меридиан 01 — процедурная 3D-модель часов на Three.js (r128) и управление сценой по прокрутке.
(function(){
const canvas = document.getElementById("scene");
let renderer;
try{ renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true}); }
catch(e){ document.body.classList.add("no-webgl"); return; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
camera.position.set(0, 0, 9);

// Окружение для отражений металла: «студия» из светящихся панелей
const pmrem = new THREE.PMREMGenerator(renderer);
const env = new THREE.Scene();
env.add(new THREE.Mesh(new THREE.BoxGeometry(30,30,30), new THREE.MeshBasicMaterial({color:0x10131c, side:THREE.BackSide})));
[[0,10,4,16,3,1.6],[-9,2,6,3,12,1.1],[9,-1,5,3,10,.8],[0,-8,-6,14,2,.5],[4,4,-10,8,6,.7]].forEach(([x,y,z,w,h,k])=>{
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({color:new THREE.Color(k,k*.97,k*.92)}));
  m.position.set(x,y,z); m.lookAt(0,0,0); env.add(m);
});
scene.environment = pmrem.fromScene(env, .04).texture;

const key = new THREE.DirectionalLight(0xfff4e6, 1.4); key.position.set(4,6,8); scene.add(key);
const rim = new THREE.DirectionalLight(0x8fb0ff, .8); rim.position.set(-6,-2,-6); scene.add(rim);
scene.add(new THREE.AmbientLight(0x404860, .6));

// Материалы
const M = {
  case: new THREE.MeshStandardMaterial({color:0xC9CCD1, metalness:1, roughness:.22}),
  steel: new THREE.MeshStandardMaterial({color:0xD6D8DC, metalness:1, roughness:.18}),
  brass: new THREE.MeshStandardMaterial({color:0xC9A25A, metalness:1, roughness:.3}),
  plate: new THREE.MeshStandardMaterial({color:0xB8BCC4, metalness:1, roughness:.45}),
  ruby: new THREE.MeshStandardMaterial({color:0xB0102A, metalness:.2, roughness:.15, emissive:0x300008}),
  glass: new THREE.MeshStandardMaterial({color:0xDDE8FF, metalness:0, roughness:0, transparent:true, opacity:.14}),
  hand: new THREE.MeshStandardMaterial({color:0xE9EBEF, metalness:1, roughness:.15}),
  sec: new THREE.MeshStandardMaterial({color:0xD4A657, metalness:.8, roughness:.25}),
  strap: new THREE.MeshStandardMaterial({color:0x5A3320, metalness:0, roughness:.85, envMapIntensity:.35}),
  index: new THREE.MeshStandardMaterial({color:0xE9EBEF, metalness:1, roughness:.12}),
};

// Циферблат рисуем на canvas: гильоше, минутная дорожка, надписи
const dialCanvas = document.createElement("canvas"); dialCanvas.width = dialCanvas.height = 1024;
const dialTex = new THREE.CanvasTexture(dialCanvas); dialTex.encoding = THREE.sRGBEncoding; dialTex.anisotropy = 8;
function drawDial(color, ink){
  const c = dialCanvas.getContext("2d"), S = 1024, r = S/2;
  c.clearRect(0,0,S,S);
  const g = c.createRadialGradient(r*.8,r*.7,20,r,r,r); g.addColorStop(0, shade(color,18)); g.addColorStop(1, shade(color,-12));
  c.fillStyle = g; c.beginPath(); c.arc(r,r,r,0,7); c.fill();
  // гильоше «солнечные лучи»
  c.save(); c.translate(r,r); c.globalAlpha = .07; c.strokeStyle = ink;
  for(let i=0;i<360;i++){ c.rotate(Math.PI/180); c.beginPath(); c.moveTo(60,0); c.lineTo(r*.78,0); c.lineWidth = i%2?1:2; c.stroke(); }
  c.restore();
  // минутная дорожка
  c.save(); c.translate(r,r); c.strokeStyle = ink; c.globalAlpha = .75;
  for(let i=0;i<60;i++){ c.beginPath(); const L = i%5 ? 18 : 0; if(L){ c.moveTo(0,-r*.94); c.lineTo(0,-r*.94+L); c.lineWidth = 3; c.stroke(); } c.rotate(Math.PI/30); }
  c.restore();
  c.fillStyle = ink; c.textAlign = "center";
  c.font = "600 44px 'Cormorant Garamond', Georgia, serif"; c.globalAlpha = .9; c.fillText("МЕРИДИАН", r, r*.52);
  c.font = "500 22px 'Montserrat', Arial, sans-serif"; c.globalAlpha = .6; c.fillText("АВТОМАТ · 25 КАМНЕЙ", r, r*1.5);
  c.font = "500 18px 'Montserrat', Arial, sans-serif"; c.fillText("СДЕЛАНО В РОССИИ", r, r*1.58);
  c.globalAlpha = 1; dialTex.needsUpdate = true;
}
function shade(hex, pct){ const n = parseInt(hex.slice(1),16); const f = v => Math.max(0,Math.min(255, v + pct*2.55|0));
  return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`; }

// Шестерня из контура с зубьями
function gear(R, teeth, depth, thick, mat, hole = .08){
  const s = new THREE.Shape();
  for(let i=0;i<teeth;i++){
    const a0 = i/teeth*Math.PI*2, a1 = (i+.25)/teeth*Math.PI*2, a2 = (i+.5)/teeth*Math.PI*2, a3 = (i+.75)/teeth*Math.PI*2;
    const p = (a,rr)=>[Math.cos(a)*rr, Math.sin(a)*rr];
    const pts = [p(a0,R-depth),p(a1,R),p(a2,R),p(a3,R-depth)];
    pts.forEach(([x,y],k)=> i===0&&k===0 ? s.moveTo(x,y) : s.lineTo(x,y));
  }
  const h = new THREE.Path(); h.absarc(0,0,hole,0,Math.PI*2,true); s.holes.push(h);
  // спицы-окна
  if(R>.4) for(let k=0;k<4;k++){ const w = new THREE.Path(); const a = k*Math.PI/2+.3, rr = R*.55; w.absarc(Math.cos(a)*rr, Math.sin(a)*rr, R*.2, 0, Math.PI*2, true); s.holes.push(w); }
  const g = new THREE.ExtrudeGeometry(s, {depth:thick, bevelEnabled:false, curveSegments:6});
  g.translate(0,0,-thick/2);
  return new THREE.Mesh(g, mat);
}

const watch = new THREE.Group(); scene.add(watch);
const layers = {}; // слои для «разбора»
function layer(name, z){ const g = new THREE.Group(); g.userData.z = z; layers[name] = g; watch.add(g); return g; }

// Корпус (ось часов — Z, циферблат смотрит на +Z)
const caseG = layer("case", 0);
const body = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.02, .7, 128, 1, true), M.case); body.rotation.x = Math.PI/2; caseG.add(body);
const bezel = new THREE.Mesh(new THREE.TorusGeometry(2.0, .13, 32, 128), M.case); bezel.position.z = .35; caseG.add(bezel);
const backRing = new THREE.Mesh(new THREE.TorusGeometry(1.98, .1, 24, 128), M.case); backRing.position.z = -.35; caseG.add(backRing);
const crown = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .32, 32), M.case); crown.rotation.z = Math.PI/2; crown.position.set(2.28,0,0); caseG.add(crown);
for(let i=0;i<24;i++){ const k = new THREE.Mesh(new THREE.BoxGeometry(.3,.03,.03), M.case); const a = i/24*Math.PI*2; k.position.set(2.28, Math.cos(a)*.22, Math.sin(a)*.22); k.rotation.x = a; caseG.add(k); }
// ушки: скруглённый профиль с фаской
const lugShape = new THREE.Shape(); { const w=.17, h=.5, r=.12; lugShape.moveTo(-w,-h+r); lugShape.lineTo(-w,h-r); lugShape.quadraticCurveTo(-w,h,-w+r,h); lugShape.lineTo(w-r,h); lugShape.quadraticCurveTo(w,h,w,h-r); lugShape.lineTo(w,-h+r); lugShape.quadraticCurveTo(w,-h,w-r,-h); lugShape.lineTo(-w+r,-h); lugShape.quadraticCurveTo(-w,-h,-w,-h+r); }
const lugGeo = new THREE.ExtrudeGeometry(lugShape, {depth:.34, bevelEnabled:true, bevelThickness:.06, bevelSize:.05, bevelSegments:4, curveSegments:8}); lugGeo.translate(0,0,-.17);
[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sy])=>{ const l = new THREE.Mesh(lugGeo, M.case); l.position.set(sx*1.18, sy*2.12, -.08); l.rotation.z = sx*sy*.1; l.rotation.x = -sy*.18; caseG.add(l); });

// Ремешок: два изогнутых сегмента
const strapG = layer("strap", 0);
function strapPiece(dir){
  const pts = []; for(let i=0;i<=10;i++){ const t = i/10; pts.push(new THREE.Vector3(0, dir*(2.4 + t*2.2), -.2 - t*t*1.6)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const shape = new THREE.Shape(); shape.moveTo(-.95,-.1); shape.lineTo(.95,-.1); shape.lineTo(.95,.1); shape.lineTo(-.95,.1); shape.lineTo(-.95,-.1);
  const g = new THREE.ExtrudeGeometry(shape, {steps:40, bevelEnabled:false, extrudePath:curve});
  return new THREE.Mesh(g, M.strap);
}
strapG.add(strapPiece(1), strapPiece(-1));

// Циферблат и индексы
const dialG = layer("dial", 1.0);
const dial = new THREE.Mesh(new THREE.CircleGeometry(1.88, 128), new THREE.MeshStandardMaterial({map:dialTex, metalness:.35, roughness:.45})); dial.position.z = .12; dialG.add(dial);
for(let i=0;i<12;i++){ const big = i%3===0; const b = new THREE.Mesh(new THREE.BoxGeometry(big?.11:.07, big?.42:.28, .05), M.index); const a = i/12*Math.PI*2;
  b.position.set(Math.sin(a)*1.5, Math.cos(a)*1.5, .15); b.rotation.z = -a; dialG.add(b); }

// Стрелки
const handsG = layer("hands", 1.6);
function hand(len, w, mat, z, tail = .25){ const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, len+tail, .03), mat); m.position.y = (len-tail)/2; g.add(m); g.position.z = z; handsG.add(g); return g; }
const hH = hand(1.0, .12, M.hand, .2), hM = hand(1.45, .08, M.hand, .24), hS = hand(1.6, .025, M.sec, .28, .4);
const cap = new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.06,24), M.sec); cap.rotation.x = Math.PI/2; cap.position.z = .31; handsG.add(cap);

// Стекло
const crystalG = layer("crystal", 2.3);
const crystal = new THREE.Mesh(new THREE.SphereGeometry(6, 64, 16, 0, Math.PI*2, 0, .33), M.glass);
crystal.rotation.x = Math.PI/2; crystal.position.z = .38 - 6*Math.cos(.33) + .02; crystal.scale.set(1,1,1); crystalG.add(crystal);

// Механизм: платина, шестерни, баланс, камни
const moveG = layer("movement", -.9);
const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.85,1.85,.12,96), M.plate); plate.rotation.x = Math.PI/2; plate.position.z = -.05; moveG.add(plate);
const gears = [];
[[0,0,.55,32,M.brass,.9],[.9,.55,.38,24,M.brass,-1.4],[-.7,.75,.32,20,M.steel,1.9],[.35,-.9,.45,28,M.brass,-1.1],[-.95,-.35,.25,16,M.steel,2.6]].forEach(([x,y,R,n,m,sp])=>{
  const g = gear(R, n, .06, .06, m); g.position.set(x,y,-.17); g.userData.speed = sp; moveG.add(g); gears.push(g);
  const j = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.04,16), M.ruby); j.rotation.x = Math.PI/2; j.position.set(x,y,-.22); moveG.add(j);
});
const balance = new THREE.Group(); balance.position.set(.95,-.65,-.24); moveG.add(balance);
balance.add(new THREE.Mesh(new THREE.TorusGeometry(.34,.035,12,48), M.brass));
for(let k=0;k<3;k++){ const s = new THREE.Mesh(new THREE.BoxGeometry(.68,.03,.02), M.brass); s.rotation.z = k*Math.PI/3; balance.add(s); }
const spring = new THREE.Mesh(new THREE.TorusGeometry(.14,.008,6,64), M.steel); spring.position.z = -.02; balance.add(spring);

// Ротор автоподзавода
const rotorG = layer("rotor", -1.8);
const rotor = new THREE.Group(); rotorG.add(rotor);
const rs = new THREE.Shape(); rs.absarc(0,0,1.75,0,Math.PI,false); rs.lineTo(-.25,0); rs.absarc(0,0,.25,Math.PI,0,true); rs.lineTo(1.75,0);
const rotorMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(rs,{depth:.06,bevelEnabled:false,curveSegments:48}), M.brass); rotorMesh.position.z = -.38; rotor.add(rotorMesh);
const hub = new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.1,24), M.steel); hub.rotation.x = Math.PI/2; hub.position.z = -.36; rotor.add(hub);

// Задняя крышка с окном
const backG = layer("caseback", -2.6);
const bk = new THREE.Mesh(new THREE.RingGeometry(1.45, 2.0, 96), M.case); bk.position.z = -.46; bk.rotation.y = Math.PI; backG.add(bk);
const bkGlass = new THREE.Mesh(new THREE.CircleGeometry(1.45, 64), M.glass); bkGlass.position.z = -.46; bkGlass.rotation.y = Math.PI; backG.add(bkGlass);
for(let i=0;i<6;i++){ const n = new THREE.Mesh(new THREE.BoxGeometry(.22,.06,.04), M.case); const a = i/6*Math.PI*2; n.position.set(Math.cos(a)*1.72, Math.sin(a)*1.72, -.49); n.rotation.z = a; backG.add(n); }

// ——— Конфигурация ———
const CFG = {
  case:{steel:[0xC9CCD1,.22], gold:[0xD9AE62,.25], black:[0x2A2B2F,.35]},
  dial:{ivory:["#EDE7DA","#1B1D22"], blue:["#1E3A6B","#E9EBEF"], green:["#1F4A3A","#E9EBEF"], salmon:["#E3A48F","#2A1D19"]},
  strap:{brown:[0x5A3320,.85,0], black:[0x151617,.8,0], navy:[0x1A2540,.8,0], steel:[0xCDD0D5,.2,1]},
};
function apply(cfg){
  const [c, r] = CFG.case[cfg.case]; M.case.color.setHex(c); M.case.roughness = r;
  const [dc, ink] = CFG.dial[cfg.dial]; drawDial(dc, ink);
  const [sc, sr, sm] = CFG.strap[cfg.strap]; M.strap.color.setHex(sc).convertSRGBToLinear(); M.strap.roughness = sr; M.strap.metalness = sm; M.strap.envMapIntensity = sm ? 1 : .35;
  M.index.color.setHex(cfg.case==="gold" ? 0xE3BF7A : 0xE9EBEF);
  M.hand.color.setHex(cfg.case==="gold" ? 0xE3BF7A : 0xE9EBEF);
}
window.MERIDIAN = {apply};
apply({case:"steel", dial:"blue", strap:"brown"});

// ——— Сцена по прокрутке ———
// ключевые кадры для каждой секции: поворот, сдвиг, «разбор», дистанция камеры
const KEYS = [
  {ry:.45, rx:-.28, x: 2.1, y:0,  ex:0, cz:14},
  {ry:Math.PI+.35, rx:-.12, x:-2.2, y:0,  ex:0, cz:12.5},
  {ry:-.95, rx:-.5, x: .6,  y:0,  ex:1, cz:19},
  {ry:.25, rx:-.18, x:-2.3, y:0,  ex:0, cz:13},
  {ry:.7,  rx:-.35, x: 2.6, y:-.2, ex:0, cz:15},
];
const sections = [...document.querySelectorAll("[data-key]")];
const lerp = (a,b,t)=>a+(b-a)*t, ease = t=>t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
let target = {...KEYS[0]}, cur = {...KEYS[0]}, drag = 0, dragV = 0;
function fromScroll(){
  const y = scrollY + innerHeight*.5;
  let i = 0; while(i < sections.length-1 && sections[i+1].offsetTop <= y) i++;
  const a = sections[i], b = sections[i+1];
  const t = b ? Math.min(1, Math.max(0, (y - a.offsetTop - a.offsetHeight*.45) / (b.offsetTop - a.offsetTop - a.offsetHeight*.45))) : 0;
  const k0 = KEYS[+a.dataset.key], k1 = b ? KEYS[+b.dataset.key] : k0, e = ease(t);
  for(const k in k0) target[k] = lerp(k0[k], k1[k], e);
  document.documentElement.style.setProperty("--ex", target.ex.toFixed(3));
}
addEventListener("scroll", fromScroll, {passive:true});

// вращение мышью / пальцем
let down = null;
canvas.addEventListener("pointerdown", e=>{ down = e.clientX; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener("pointermove", e=>{ if(down===null) return; dragV = (e.clientX - down)*.008; drag += dragV; down = e.clientX; });
addEventListener("pointerup", ()=>{ down = null; });

// подписи слоёв при разборе
const labels = [...document.querySelectorAll("[data-layer]")];
const v = new THREE.Vector3();

function resize(){
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w/h;
  // на узких экранах часы по центру и чуть дальше
  camera.position.z = cur.cz * (w < 760 ? 1.35 : 1);
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);

const clock = new THREE.Clock();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function frame(){
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  for(const k in cur) cur[k] = lerp(cur[k], target[k], reduce ? 1 : 1 - Math.pow(.001, dt));
  if(down===null){ dragV *= .92; drag += dragV; drag *= .985; }
  const narrow = innerWidth < 760;
  watch.rotation.set(cur.rx + Math.sin(t*.6)*.02, cur.ry + drag + Math.sin(t*.4)*.03, 0);
  watch.position.set(narrow ? 0 : cur.x, cur.y + (narrow ? .6 : 0) + Math.sin(t*.8)*.04, 0);
  camera.position.z = cur.cz * (narrow ? 1.45 : 1);
  for(const n in layers){ const L = layers[n]; L.position.z = L.userData.z * cur.ex * 1.25; }
  // время: часы, минуты, секунды с шагом 1/6 с (28 800 полуколебаний в час)
  const d = new Date(), s = d.getSeconds() + Math.floor(d.getMilliseconds()/166.67)/6, m = d.getMinutes() + s/60, h = d.getHours()%12 + m/60;
  hS.rotation.z = -s/60*Math.PI*2; hM.rotation.z = -m/60*Math.PI*2; hH.rotation.z = -h/12*Math.PI*2;
  gears.forEach(g=>g.rotation.z += g.userData.speed*dt*.6);
  balance.rotation.z = Math.sin(t*Math.PI*2*4)*1.4;
  rotor.rotation.z += dt * (.35 + Math.abs(dragV)*6);
  // подписи
  labels.forEach(el=>{
    const L = layers[el.dataset.layer]; v.set(2.4, 0, 0); L.localToWorld(v); v.project(camera);
    el.style.transform = `translate(${(v.x*.5+.5)*innerWidth}px, ${(-v.y*.5+.5)*innerHeight}px)`;
  });
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
resize(); fromScroll(); cur = {...target}; frame();
document.body.classList.add("ready");
})();
