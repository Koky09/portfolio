// ШАГ — отрисовка кед в SVG. Вид сбоку, носок вправо, земля на y≈188.
// ry — верх задника, (tx,ty) — начало шнуровки; модели отличаются ими и подошвой.
const MODELS = {
  low:  {ry:86, tx:160, ty:92, holes:5, sole:"flat", name:"Низкие"},
  mid:  {ry:62, tx:156, ty:66, holes:6, sole:"flat", name:"Средние"},
  high: {ry:36, tx:150, ty:40, holes:7, sole:"flat", name:"Высокие"},
  run:  {ry:84, tx:160, ty:90, holes:5, sole:"run",  name:"Беговые"},
  slip: {ry:92, tx:160, ty:96, holes:0, sole:"flat", name:"Слипоны"},
};
function shoeSVG(model, c, opts = {}){
  const m = MODELS[model], {ry, tx, ty} = m;
  const run = m.sole === "run";
  const mTop = run ? 140 : 150;
  const line = "rgba(0,0,0,.32)";
  const upper = `M40,152 C36,128 38,${ry+22} 46,${ry+10} L70,${ry} C95,${ry+6} 130,${ty+6} ${tx},${ty} L264,108 C312,108 358,118 378,138 L384,152 Z`;
  const heel = `M40,152 C36,128 38,${ry+22} 46,${ry+10} L70,${ry} C62,${ry+34} 70,132 102,152 Z`;
  const toe = `M302,112 C334,112 364,122 380,140 L384,152 L296,152 C289,138 292,120 302,112 Z`;
  const tongue = `M${tx-4},${ty+6} C${tx-2},${ty-10} ${tx+10},${ty-19} ${tx+24},${ty-19} C${tx+38},${ty-19} ${tx+44},${ty-10} ${tx+44},${ty+4} L${tx+38},${ty+14} Z`;
  const stay = `M${tx},${ty} L264,108 L259,123 L${tx-3},${ty+15} Z`;
  const holes = Array.from({length:m.holes},(_,i)=>{ const t = m.holes>1 ? i/(m.holes-1) : 0; return [tx+6 + t*(258-tx-6), ty+8 + t*(115-ty-8)]; });
  const laces = holes.map(([x,y])=>`M${x-9},${y-7} L${x+7},${y+2}`).join(" ");
  const stripe = `M104,140 C150,116 206,106 258,114`;
  const tab = `M44,${ry+2} L58,${ry-4} L64,${ry+16} L50,${ry+22} Z`;
  const tread = Array.from({length:23},(_,i)=>`M${52+i*14.5},178 l5,8`).join(" ");
  const text = opts.text ? String(opts.text).toUpperCase().slice(0,6).replace(/[<>&"]/g,"") : "";
  return `<svg viewBox="0 -8 420 206" role="img" aria-label="${opts.label || "Кеды ШАГ, модель " + m.name.toLowerCase()}"><g transform="translate(36 -22.6) scale(.82 1.12)">
    <ellipse cx="212" cy="191" rx="178" ry="7" fill="rgba(0,0,0,.13)"/>
    <path d="M36,${mTop} L386,${mTop+2} Q396,${mTop+8} 390,176 L40,176 Q30,${mTop+12} 36,${mTop} Z" fill="${c.midsole}" stroke="${line}" stroke-width="1.4"/>
    ${run ? `<path d="M52,${mTop+16} C110,${mTop+26} 170,${mTop+6} 240,${mTop+18} S340,${mTop+10} 376,${mTop+18}" stroke="rgba(0,0,0,.16)" stroke-width="3" fill="none"/>` : `<path d="M44,${mTop+13} L384,${mTop+13}" stroke="rgba(0,0,0,.12)" stroke-width="1.5" stroke-dasharray="4 4"/>`}
    <path d="M40,176 L390,176 Q392,186 378,188 L50,188 Q38,186 40,176 Z" fill="${c.outsole}"/>
    <path d="${tread}" stroke="rgba(0,0,0,.2)" stroke-width="2"/>
    ${m.holes ? `<path d="${tongue}" fill="${c.upper}" stroke="${line}" stroke-width="1.4"/>` : ""}
    <path d="${upper}" fill="${c.upper}" stroke="${line}" stroke-width="1.4"/>
    <path d="${toe}" fill="${c.toe}" stroke="${line}" stroke-width="1.4"/>
    <path d="M306,119 C334,119 358,128 372,142" stroke="rgba(0,0,0,.28)" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
    <path d="${heel}" fill="${c.heel}" stroke="${line}" stroke-width="1.4"/>
    <path d="${stripe}" stroke="${c.stripe}" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="${stripe}" stroke="rgba(0,0,0,.22)" stroke-width="1" stroke-dasharray="3 3" fill="none" transform="translate(0 -4)"/>
    ${model==="high" ? `<circle cx="104" cy="${ry+30}" r="12" fill="${c.stripe}" stroke="${line}" stroke-width="1.2"/><circle cx="104" cy="${ry+30}" r="5" fill="${c.upper}"/>` : ""}
    ${m.holes ? `<path d="${stay}" fill="${c.heel}" stroke="${line}" stroke-width="1.2"/>` : `<path d="M${tx-6},${ty+2} L${tx+18},${ty+4} L${tx+10},${ty+30} Z" fill="${c.heel}" stroke="${line}" stroke-width="1.2"/><path d="M${tx},${ty+6} l3,18 M${tx+6},${ty+6} l2,18 M${tx+12},${ty+6} l0,14" stroke="rgba(0,0,0,.3)" stroke-width="1"/>`}
    ${holes.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.3" fill="#EDEDE8" stroke="${line}" stroke-width="1.2"/>`).join("")}
    ${m.holes ? `<path d="${laces}" stroke="rgba(0,0,0,.45)" stroke-width="7" stroke-linecap="round"/><path d="${laces}" stroke="${c.laces}" stroke-width="4.6" stroke-linecap="round"/>` : ""}
    <path d="M46,${ry+10} L70,${ry} C95,${ry+6} 130,${ty+6} ${tx},${ty}" stroke="rgba(0,0,0,.4)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="${tab}" fill="${c.stripe}" stroke="${line}" stroke-width="1"/>
    ${text ? `<text x="58" y="${mTop+17}" font-family="Dela Gothic One, Arial Black, sans-serif" font-size="12" letter-spacing="1" fill="${c.stripe}" stroke="rgba(0,0,0,.35)" stroke-width=".5">${text}</text>` : ""}
  </g></svg>`;
}
