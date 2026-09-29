// Подоконник — общие части: шапка, подвал, растения, корзина
const PAGES = [["index.html","Растения"],["care.html","График полива"],["checkout.html","Корзина"]];
const here = location.pathname.split("/").pop() || "index.html";
const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 20h14l-2 9H11z" fill="#F2C4B8"/><path d="M16 20c0-6 2-11 8-13-1 7-4 11-8 13zM16 20c0-5-3-9-8-10 0 6 3 9 8 10z" fill="#4E8A55"/></svg>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · магазин вымышленный · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html">${LOGO}Подоконник</a>
  <nav class="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <button class="cart-btn" id="cartBtn" aria-label="Открыть корзину">Корзина <b id="cartCount">0</b></button>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div><h4>Подоконник</h4><p style="margin:0;max-width:34ch">Растения из тепличного хозяйства под Калугой. Каждое живёт у нас две недели на карантине, прежде чем поехать к вам.</p></div>
  <div><h4>Магазин</h4><ul><li><a href="index.html#finder">Подбор по условиям</a></li><li><a href="index.html#catalog">Все растения</a></li><li><a href="care.html">График полива</a></li></ul></div>
  <div><h4>Доставка</h4><ul><li>В тёплой машине от +12 °C</li><li>Зимой — только курьером</li><li>Бесплатно от 5 000 ₽</li></ul></div>
  <div><h4>Помощь</h4><ul><li>Растение погибло за 14 дней — заменим</li><li style="user-select:all">help@podokonnik.example</li></ul></div>
  <div class="fine">«Подоконник» — вымышленный магазин. Демо-сайт для портфолио, заказы не принимаются. Токсичность указана справочно — при сомнениях спросите ветеринара. Фото: Unsplash.</div>
</div></footer>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Корзина">
  <header><h3>Корзина</h3><button class="x" id="closeCart" aria-label="Закрыть">×</button></header>
  <div class="lines" id="lines"></div><footer id="drawerFoot"></footer>
</aside>
<div class="toast" id="toast" role="status"></div>`;

// light: 1 тень, 2 полутень, 3 яркий рассеянный, 4 прямое солнце; care: 1 легко, 2 средне, 3 капризное
const PLANTS = [
  {slug:"monstera", name:"Монстера", latin:"Monstera deliciosa", img:"img/p01.jpg", img2:"img/p01b.jpg", light:[2,3], water:9, care:1, safe:false, price:{S:1900,M:3900,L:8900}, h:{S:"40 см",M:"70 см",L:"120 см"}, about:"Классика с резными листьями. Растёт быстро, в тени листья будут мельче и без прорезей."},
  {slug:"pilea", name:"Пилея", latin:"Pilea peperomioides", img:"img/p02.jpg", light:[3], water:7, care:1, safe:true, price:{S:900,M:1600}, h:{S:"15 см",M:"25 см"}, about:"«Денежное дерево» с круглыми листьями. Даёт детки — легко делиться с друзьями."},
  {slug:"ficus", name:"Фикус каучуконосный", latin:"Ficus elastica", img:"img/p03.jpg", light:[2,3], water:10, care:1, safe:false, price:{M:2900,L:6400}, h:{M:"60 см",L:"110 см"}, about:"Плотные глянцевые листья, прощает пропущенный полив. Сок раздражает кожу и опасен для животных."},
  {slug:"sansevieria", name:"Сансевиерия", latin:"Dracaena trifasciata", img:"img/p04.jpg", img2:"img/p04b.jpg", light:[1,2,3,4], water:18, care:1, safe:false, price:{S:1200,M:2400,L:4900}, h:{S:"30 см",M:"55 см",L:"80 см"}, about:"Почти неубиваемая: живёт в тени и выдерживает полив раз в три недели."},
  {slug:"pothos", name:"Эпипремнум", latin:"Epipremnum aureum", img:"img/p05.jpg", img2:"img/p05b.jpg", light:[1,2,3], water:7, care:1, safe:false, price:{S:1100,M:2200}, h:{S:"плети 40 см",M:"плети 90 см"}, about:"Ампельное растение для полки или кашпо. По листьям сразу видно, когда пора поливать — они слегка обвисают."},
  {slug:"philodendron", name:"Филодендрон лазающий", latin:"Philodendron hederaceum", img:"img/p06.jpg", light:[2,3], water:7, care:1, safe:false, price:{S:1300,M:2500}, h:{S:"плети 40 см",M:"плети 80 см"}, about:"Сердцевидные тёмные листья. Можно пустить по опоре или оставить свисать."},
  {slug:"haworthia", name:"Хавортия", latin:"Haworthiopsis attenuata", img:"img/p07.jpg", light:[3,4], water:14, care:1, safe:true, price:{S:650}, h:{S:"10 см"}, about:"Маленький суккулент с белыми полосками. Безопасна для кошек, любит яркий подоконник."},
  {slug:"echeveria", name:"Эхеверия", latin:"Echeveria elegans", img:"img/p08.jpg", light:[4], water:14, care:2, safe:true, price:{S:590}, h:{S:"⌀ 8 см"}, about:"Каменная роза. Без прямого солнца вытягивается, поэтому нужен южный подоконник или фитолампа."},
  {slug:"lyrata", name:"Фикус лировидный", latin:"Ficus lyrata", img:"img/p09.jpg", light:[3], water:8, care:3, safe:false, price:{M:4900,L:11900}, h:{M:"70 см",L:"140 см"}, about:"Эффектный, но капризный: не любит сквозняки и перестановки. Сбрасывает листья, если его двигать."},
  {slug:"calathea", name:"Калатея", latin:"Goeppertia roseopicta", img:"img/p10.jpg", light:[2], water:5, care:3, safe:true, price:{S:1500,M:2900}, h:{S:"25 см",M:"45 см"}, about:"Узорчатые листья складываются на ночь. Нужна влажность и мягкая вода. Безопасна для кошек и собак."},
  {slug:"succulents", name:"Суккуленты, набор из 6", latin:"Echeveria, Haworthia, Crassula", img:"img/p11.jpg", light:[3,4], water:14, care:1, safe:true, price:{S:2900}, h:{S:"6 × ⌀ 6 см"}, about:"Шесть маленьких растений в горшках ⌀ 6 см. Хороший подарок и первый шаг для тех, кто боится растений."},
  {slug:"hahnii", name:"Сансевиерия мини", latin:"Dracaena trifasciata ‘Hahnii’", img:"img/p12.jpg", light:[1,2,3], water:18, care:1, safe:false, price:{S:990}, h:{S:"15 см"}, about:"Компактная розетка для стола. Всё то же, что у большой сансевиерии, но помещается рядом с ноутбуком."},
];
const LIGHT = ["","Тень","Полутень","Яркий рассеянный","Прямое солнце"];
const CARE = ["","Легко","Средне","Капризное"];
const SHORT = ["","тень","полутень","яркий свет","солнце"];
const lightShort = p => p.light.length===1 ? SHORT[p.light[0]] : `${SHORT[p.light[0]]}–${SHORT[p.light[p.light.length-1]]}`;
const POTS = {none:["Технический горшок",0,"#6B7C6E"], white:["Кашпо белое",700,"#F4F4F0"], terra:["Кашпо терракота",900,"#C86B4A"], concrete:["Кашпо бетон",1200,"#9A9C98"]};
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";
const minPrice = p => Math.min(...Object.values(p.price));
function card(p){
  return `<a class="card" href="product.html#${p.slug}">
    <div class="ph"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="tags">${p.safe?`<span class="safe">безопасно для питомцев</span>`:""}<span>${CARE[p.care]}</span></div>
    <h3>${p.name}</h3><span class="latin">${p.latin}</span>
    <div class="icons"><span>${lightShort(p)}</span><span>·</span><span>полив раз в ${p.water} дн.</span></div>
    <div class="row"><span class="price">${Object.keys(p.price).length>1?"от ":""}${rub(minPrice(p))}</span></div></a>`;
}

const KEY = "podokonnik-cart";
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ cart = []; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(cart)); }catch(_){} renderCart(); document.dispatchEvent(new Event("cart")); }
const linePrice = l => { const p = PLANTS.find(x=>x.slug===l.slug); return (p.price[l.size] + POTS[l.pot][1]) * l.q; };
const cartTotal = () => cart.reduce((a,l)=>a+linePrice(l),0);
function addToCart(slug, size, pot = "none"){
  const key = `${slug}|${size}|${pot}`; const ex = cart.find(l=>l.key===key);
  ex ? ex.q++ : cart.push({key, slug, size, pot, q:1});
  save(); toast(`${PLANTS.find(x=>x.slug===slug).name} — в корзине`);
}
let tt;
function toast(t){ const el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(()=>el.classList.remove("on"), 2200); }
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((a,l)=>a+l.q,0);
  document.getElementById("lines").innerHTML = cart.length ? cart.map(l=>{ const p = PLANTS.find(x=>x.slug===l.slug);
    return `<div class="line"><img src="${p.img}" alt=""><div><b>${p.name}</b><small>${l.size} · ${p.h[l.size]} · ${POTS[l.pot][0].toLowerCase()}</small><br>
      <span class="qty"><button data-dec="${l.key}" aria-label="Меньше">−</button><span>${l.q}</span><button data-inc="${l.key}" aria-label="Больше">+</button></span></div><b>${rub(linePrice(l))}</b></div>`; }).join("")
    : `<p class="empty">Пока пусто.<br>Подберите растение под свой подоконник.</p>`;
  document.getElementById("drawerFoot").innerHTML = cart.length ? `<div class="sum"><span>Итого</span><span>${rub(cartTotal())}</span></div><a class="btn" href="checkout.html">Оформить</a>` : "";
}
function changeQty(key, d){ const l = cart.find(x=>x.key===key); if(!l) return; l.q += d; if(l.q<=0) cart = cart.filter(x=>x!==l); save(); }
document.addEventListener("click", e=>{
  const inc = e.target.closest("[data-inc]"); if(inc){ changeQty(inc.dataset.inc, 1); return; }
  const dec = e.target.closest("[data-dec]"); if(dec){ changeQty(dec.dataset.dec, -1); }
});
const drawer = document.getElementById("drawer"), scrim = document.getElementById("scrim");
function openCart(){ drawer.classList.add("on"); scrim.classList.add("on"); document.getElementById("closeCart").focus(); }
function closeCart(){ drawer.classList.remove("on"); scrim.classList.remove("on"); }
document.getElementById("cartBtn").addEventListener("click", ()=> here==="checkout.html" ? scrollTo(0,0) : openCart());
document.getElementById("closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeCart(); });
renderCart();
