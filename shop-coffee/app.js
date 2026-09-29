// Жаровня — общие части: шапка, подвал, товары, пачки в SVG, корзина
const PAGES = [["index.html","Кофе"],["about.html","Обжарка"],["checkout.html","Корзина"]];
const here = location.pathname.split("/").pop() || "index.html";
const LOGO = `<svg viewBox="0 0 28 28" aria-hidden="true"><ellipse cx="14" cy="14" rx="9" ry="12" fill="#C98A4B" transform="rotate(25 14 14)"/><path d="M9 6c4 5 6 11 10 16" stroke="#1D1410" stroke-width="2" fill="none"/></svg>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · магазин вымышленный, оплата не подключена · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html">${LOGO}Жаровня</a>
  <nav class="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <button class="cart-btn" id="cartBtn" aria-label="Открыть корзину"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>Корзина <b id="cartCount">0</b></button>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div><h4>Жаровня</h4><p style="margin:0;max-width:30ch">Обжариваем по средам, отправляем по четвергам. Кофе приходит не старше 7 дней после обжарки.</p></div>
  <div><h4>Магазин</h4><ul><li><a href="index.html#catalog">Весь кофе</a></li><li><a href="index.html#finder">Подобрать по вкусу</a></li><li><a href="checkout.html">Корзина</a></li></ul></div>
  <div><h4>Доставка</h4><ul><li>СДЭК от 290 ₽</li><li>Курьер по городу 350 ₽</li><li>Бесплатно от 3 000 ₽</li></ul></div>
  <div><h4>Связь</h4><ul><li style="user-select:all">hello@zharovnya.example</li><li>Telegram: @zharovnya_demo</li></ul></div>
  <div class="fine">«Жаровня» — вымышленная обжарочная. Демо-сайт для портфолио, заказы не принимаются. Фото: Unsplash.</div>
</div></footer>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Корзина">
  <header><h3>Корзина</h3><button class="x" id="closeCart" aria-label="Закрыть">×</button></header>
  <div class="lines" id="lines"></div>
  <footer id="drawerFoot"></footer>
</aside>
<div class="toast" id="toast" role="status"></div>`;

const PRODUCTS = [
  {slug:"yirgacheffe", country:"Эфиопия", region:"Иргачеффе", process:"мытая", roast:"светлая", method:["filter"], sca:87, notes:"жасмин, бергамот, лимон", p250:890, p1000:3200, color:"#F2C230", acid:5, body:2, sweet:4, alt:"1 900–2 200 м", variety:"эфиопские эндемики", farm:"станция Кочере"},
  {slug:"guji", country:"Эфиопия", region:"Гуджи", process:"натуральная", roast:"светлая", method:["filter"], sca:86.5, notes:"черника, клубника, какао", p250:950, p1000:3400, color:"#E86A8E", acid:4, body:3, sweet:5, alt:"2 000–2 300 м", variety:"эфиопские эндемики", farm:"станция Шакисо"},
  {slug:"kenya", country:"Кения", region:"Ньери АА", process:"мытая", roast:"светлая", method:["filter"], sca:87.5, notes:"смородина, томат, грейпфрут", p250:1100, p1000:3900, color:"#D6452F", acid:5, body:3, sweet:3, alt:"1 700–1 900 м", variety:"SL28, SL34", farm:"фабрика Гачатья"},
  {slug:"huila", country:"Колумбия", region:"Уила", process:"мытая", roast:"средняя", method:["filter","espresso"], sca:85, notes:"карамель, красное яблоко, орех", p250:790, p1000:2800, color:"#3E9A5A", acid:3, body:3, sweet:4, alt:"1 600–1 900 м", variety:"Катурра, Кастильо", farm:"мелкие фермеры Питалито"},
  {slug:"cerrado", country:"Бразилия", region:"Серрадо", process:"натуральная", roast:"тёмная", method:["espresso"], sca:83, notes:"молочный шоколад, фундук", p250:650, p1000:2300, color:"#2F6FB2", acid:1, body:4, sweet:4, alt:"1 000–1 200 м", variety:"Мундо Ново", farm:"фазенда Санта-Инес"},
  {slug:"antigua", country:"Гватемала", region:"Антигуа", process:"мытая", roast:"средняя", method:["filter","espresso"], sca:84.5, notes:"какао, специи, апельсин", p250:820, p1000:2900, color:"#7B4FA0", acid:3, body:4, sweet:3, alt:"1 500–1 700 м", variety:"Бурбон", farm:"финка Сан-Себастьян"},
  {slug:"tarrazu", country:"Коста-Рика", region:"Тарразу", process:"хани", roast:"светлая", method:["filter"], sca:86, notes:"мёд, персик, тростниковый сахар", p250:980, p1000:3500, color:"#F08A3C", acid:3, body:3, sweet:5, alt:"1 600–1 800 м", variety:"Катуаи", farm:"микромельница Ла-Пастора"},
  {slug:"sumatra", country:"Индонезия", region:"Суматра", process:"влажная очистка", roast:"тёмная", method:["espresso"], sca:82.5, notes:"тёмный шоколад, кедр, пряности", p250:720, p1000:2600, color:"#2F5E4E", acid:1, body:5, sweet:2, alt:"1 100–1 500 м", variety:"Атенг, Типика", farm:"кооператив Гайо"},
  {slug:"blend", country:"Смесь", region:"Жаровня", process:"Бразилия + Колумбия", roast:"тёмная", method:["espresso"], sca:84, notes:"шоколад, карамель, грецкий орех", p250:690, p1000:2400, color:"#1D1410", acid:2, body:4, sweet:4, alt:"—", variety:"70/30", farm:"наш фирменный эспрессо"},
  {slug:"decaf", country:"Декаф", region:"Колумбия", process:"Swiss Water", roast:"средняя", method:["filter","espresso"], sca:83, notes:"какао, ваниль, изюм", p250:850, p1000:3000, color:"#9C8B7D", acid:2, body:3, sweet:3, alt:"1 500–1 800 м", variety:"Кастильо", farm:"без кофеина, без химии"},
];
const GRINDS = ["В зёрнах","Для эспрессо","Для турки","Для фильтра","Для френч-пресса"];
const METHOD = {filter:"Фильтр", espresso:"Эспрессо"};

function bag(p, size = 1){
  const light = ["#F2C230","#E86A8E","#F08A3C","#9C8B7D"].includes(p.color);
  const tc = light ? "#1D1410" : "#F7F5F0";
  const dots = {"светлая":1,"средняя":2,"тёмная":3}[p.roast];
  return `<svg viewBox="0 0 160 220" role="img" aria-label="Пачка кофе ${p.country} ${p.region}">
    <path d="M22 18 L138 18 L146 206 Q80 216 14 206 Z" fill="#E8E0D4"/>
    <path d="M22 18 L138 18 L140 34 L20 34 Z" fill="#D6CBBB"/>
    <path d="M26 18 v16 M134 18 v16" stroke="#C7BBA9" stroke-width="2"/>
    <circle cx="80" cy="54" r="7" fill="#CFC4B3" stroke="#BCAF9C" stroke-width="2"/>
    <rect x="26" y="74" width="108" height="112" rx="6" fill="${p.color}"/>
    <text x="80" y="108" text-anchor="middle" font-family="Alumni Sans, Arial Narrow, sans-serif" font-weight="800" font-size="${p.country.length>8?20:26}" fill="${tc}" letter-spacing="1">${p.country.toUpperCase()}</text>
    <text x="80" y="130" text-anchor="middle" font-family="Wix Madefor Text, Arial, sans-serif" font-size="11" font-weight="700" fill="${tc}" opacity=".85">${p.region}</text>
    <line x1="40" y1="142" x2="120" y2="142" stroke="${tc}" stroke-opacity=".35"/>
    ${[0,1,2].map(i=>`<circle cx="${68+i*12}" cy="158" r="4" fill="${i<dots?tc:"none"}" stroke="${tc}" stroke-width="1.5"/>`).join("")}
    <text x="80" y="178" text-anchor="middle" font-family="Wix Madefor Text, Arial, sans-serif" font-size="8.5" fill="${tc}" opacity=".8">SCA ${String(p.sca).replace(".",",")} · ${p.process}</text>
  </svg>`;
}
const title = p => p.country==="Смесь" ? `Смесь «${p.region}»` : `${p.country} ${p.region}`;
const packBg = p => `color-mix(in srgb, ${p.color} 18%, #F7F5F0)`;
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";

function card(p){
  return `<a class="card" href="product.html#${p.slug}">
    <div class="pack" style="background:${packBg(p)}">${bag(p)}</div>
    <span class="label">${p.method.map(m=>METHOD[m]).join(" · ")} · ${p.roast} обжарка</span>
    <h3>${title(p)}</h3>
    <span class="notes">${p.notes}</span>
    <div class="row"><span class="price">${rub(p.p250)} <small style="font-weight:400;color:var(--muted)">/ 250 г</small></span>
      <button class="add" data-add="${p.slug}" aria-label="Добавить ${p.country} ${p.region} в корзину">+</button></div>
  </a>`;
}

// корзина
const KEY = "zharovnya-cart";
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ cart = []; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(cart)); }catch(_){} renderCart(); document.dispatchEvent(new Event("cart")); }
const linePrice = l => { const p = PRODUCTS.find(x=>x.slug===l.slug); return Math.round((l.w===1000?p.p1000:p.p250) * (l.sub?0.9:1)) * l.q; };
const cartTotal = () => cart.reduce((a,l)=>a+linePrice(l),0);
function addToCart(slug, {grind = GRINDS[0], w = 250, sub = false, q = 1} = {}){
  const key = `${slug}|${grind}|${w}|${sub}`;
  const ex = cart.find(l=>l.key===key);
  ex ? ex.q += q : cart.push({key, slug, grind, w, sub, q});
  save();
  const p = PRODUCTS.find(x=>x.slug===slug);
  toast(`${p.country} ${p.region} — в корзине`);
}
let tt;
function toast(t){ const el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(()=>el.classList.remove("on"), 2200); }
const FREE = 3000;
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((a,l)=>a+l.q,0);
  const total = cartTotal();
  document.getElementById("lines").innerHTML = cart.length ? cart.map(l=>{
    const p = PRODUCTS.find(x=>x.slug===l.slug);
    return `<div class="line"><div class="mini" style="background:${packBg(p)}">${bag(p)}</div>
      <div><b>${p.country} ${p.region}</b><small>${l.w===1000?"1 кг":"250 г"} · ${l.grind.toLowerCase()}${l.sub?" · подписка −10%":""}</small><br>
        <span class="qty"><button data-dec="${l.key}" aria-label="Меньше">−</button><span>${l.q}</span><button data-inc="${l.key}" aria-label="Больше">+</button></span></div>
      <b>${rub(linePrice(l))}</b></div>`;
  }).join("") : `<p class="empty">Корзина пустая.<br>Выберите кофе в каталоге.</p>`;
  document.getElementById("drawerFoot").innerHTML = cart.length ? `
    <div class="sum"><span>Итого</span><span>${rub(total)}</span></div>
    <div class="free">${total>=FREE ? "Доставка бесплатная" : `До бесплатной доставки ${rub(FREE-total)}`}<div class="bar"><i style="width:${Math.min(100,total/FREE*100)}%"></i></div></div>
    <a class="btn crema" href="checkout.html">Оформить заказ</a>` : "";
}
function changeQty(key, d){ const l = cart.find(x=>x.key===key); if(!l) return; l.q += d; if(l.q<=0) cart = cart.filter(x=>x!==l); save(); }
document.addEventListener("click", e=>{
  const a = e.target.closest("[data-add]"); if(a){ e.preventDefault(); addToCart(a.dataset.add); return; }
  const inc = e.target.closest("[data-inc]"); if(inc){ changeQty(inc.dataset.inc, 1); return; }
  const dec = e.target.closest("[data-dec]"); if(dec){ changeQty(dec.dataset.dec, -1); return; }
});
const drawer = document.getElementById("drawer"), scrim = document.getElementById("scrim");
function openCart(){ drawer.classList.add("on"); scrim.classList.add("on"); document.getElementById("closeCart").focus(); }
function closeCart(){ drawer.classList.remove("on"); scrim.classList.remove("on"); }
document.getElementById("cartBtn").addEventListener("click", ()=> here==="checkout.html" ? scrollTo(0,0) : openCart());
document.getElementById("closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeCart(); });
renderCart();
