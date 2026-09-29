// ШАГ — общие части: шапка, подвал, товары, размеры, корзина
const PAGES = [["index.html","Каталог"],["constructor.html","Конструктор"],["checkout.html","Корзина"]];
const here = location.pathname.split("/").pop() || "index.html";

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · бренд вымышленный, кеды нарисованы в SVG · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap"><div class="bar">
  <a class="logo" href="index.html">ШАГ<span>●</span></a>
  <nav class="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <button class="cart-btn" id="cartBtn" aria-label="Открыть корзину">Корзина <b id="cartCount">0</b></button>
</div></div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div><h4>ШАГ</h4><p style="margin:0;max-width:32ch">Кеды из натуральной кожи и канваса. Шьём небольшими партиями, подошва — вулканизированная резина.</p></div>
  <div><h4>Покупателям</h4><ul><li><a href="index.html#sizes">Таблица размеров</a></li><li>Обмен 30 дней</li><li>Гарантия на подошву 1 год</li></ul></div>
  <div><h4>Доставка</h4><ul><li>СДЭК 1–5 дней</li><li>Бесплатно от 10 000 ₽</li><li>Примерка перед оплатой</li></ul></div>
  <div><h4>Связь</h4><ul><li style="user-select:all">hi@shag.example</li><li>Telegram: @shag_demo</li></ul></div>
  <div class="big" aria-hidden="true">ШАГ●</div>
  <div class="fine">«ШАГ» — вымышленный бренд. Демо-сайт для портфолио, заказы не принимаются. Фото: Unsplash.</div>
</div></footer>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Корзина">
  <header><h3>Корзина</h3><button class="x" id="closeCart" aria-label="Закрыть">×</button></header>
  <div class="lines" id="lines"></div>
  <footer id="drawerFoot"></footer>
</aside>
<div class="toast" id="toast" role="status"></div>`;

const C = (upper,toe,heel,stripe,laces,midsole,outsole)=>({upper,toe,heel,stripe,laces,midsole,outsole});
const PRODUCTS = [
  {slug:"baza", name:"База", model:"low", price:7900, bg:"#E7E7E0", c:C("#F4F4F0","#E6E6DF","#E6E6DF","#111111","#F4F4F0","#FFFFFF","#CFCFC8"), mat:"гладкая кожа", tag:"хит"},
  {slug:"noch", name:"Ночь", model:"low", price:7900, bg:"#DCE9B4", c:C("#1C1C1C","#2A2A2A","#2A2A2A","#C8F03C","#1C1C1C","#F4F4F0","#1C1C1C"), mat:"замша"},
  {slug:"kirpich", name:"Кирпич", model:"high", price:9400, bg:"#F2D2C8", c:C("#D84A2B","#F4F4F0","#F4F4F0","#1D3F8C","#F4F4F0","#F6EFE3","#7A5A3A"), mat:"канвас", tag:"новинка"},
  {slug:"grafit", name:"Графит", model:"mid", price:8600, bg:"#DADAD6", c:C("#6B6D70","#4B4D50","#4B4D50","#F4F4F0","#F4F4F0","#F4F4F0","#4B4D50"), mat:"нубук"},
  {slug:"trassa", name:"Трасса", model:"run", price:10900, bg:"#C8F03C", c:C("#1C1C1C","#303030","#C8F03C","#C8F03C","#C8F03C","#F4F4F0","#1C1C1C"), mat:"сетка и замша", tag:"новинка"},
  {slug:"leto", name:"Лето", model:"slip", price:6400, bg:"#F1E4C9", c:C("#E9D8B4","#F4F4F0","#C9A877","#C9A877","#F4F4F0","#F6EFE3","#C9A877"), mat:"лён"},
  {slug:"more", name:"Море", model:"high", price:9400, bg:"#CFE3F3", c:C("#1D3F8C","#F4F4F0","#F4F4F0","#E0452B","#F4F4F0","#FFFFFF","#1D3F8C"), mat:"канвас"},
  {slug:"myata", name:"Мята", model:"low", price:7900, bg:"#D5EDE3", c:C("#A8DCC6","#F4F4F0","#F4F4F0","#2E6B55","#F4F4F0","#FFFFFF","#2E6B55"), mat:"гладкая кожа", tag:"мало размеров"},
];
// размерная сетка: РФ → EU, US (муж.), длина стопы в см
const SIZES = [[36,37,4.5,23.5],[37,38,5.5,24],[38,39,6.5,25],[39,40,7,25.5],[40,41,8,26.5],[41,42,8.5,27],[42,43,9.5,27.5],[43,44,10,28.5],[44,45,11,29],[45,46,12,29.5]];
// наличие размеров: детерминированно от товара
const stock = (slug, ru) => { const h = [...slug].reduce((a,c)=>a+c.charCodeAt(0),0); return slug==="myata" ? [38,40,44].includes(ru) : ((h + ru*7) % 9) > 1; };
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";

function card(p){
  return `<a class="card" href="product.html#${p.slug}">
    ${p.tag ? `<span class="pill badge">${p.tag}</span>` : ""}
    <div class="stage" style="background:${p.bg}">${shoeSVG(p.model, p.c, {label:`Кеды ${p.name}`})}</div>
    <h3>${p.name}</h3><span class="sub">${MODELS[p.model].name} · ${p.mat}</span>
    <div class="row"><span class="price">${rub(p.price)}</span><span class="swatches" aria-hidden="true"><i style="background:${p.c.upper}"></i><i style="background:${p.c.stripe}"></i><i style="background:${p.c.outsole}"></i></span></div>
  </a>`;
}

// корзина: товар из каталога или собранный в конструкторе
const KEY = "shag-cart";
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ cart = []; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(cart)); }catch(_){} renderCart(); document.dispatchEvent(new Event("cart")); }
const cartTotal = () => cart.reduce((a,l)=>a+l.price*l.q,0);
function addToCart(item){
  const key = `${item.slug}|${item.size}|${item.custom?JSON.stringify(item.c)+item.text:""}`;
  const ex = cart.find(l=>l.key===key);
  ex ? ex.q++ : cart.push({...item, key, q:1});
  save(); toast(`${item.name}, ${item.size} размер — в корзине`);
}
let tt;
function toast(t){ const el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(()=>el.classList.remove("on"), 2200); }
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((a,l)=>a+l.q,0);
  document.getElementById("lines").innerHTML = cart.length ? cart.map(l=>`<div class="line">
      <div class="mini">${shoeSVG(l.model, l.c, {text:l.text})}</div>
      <div><b>${l.name}</b><small>${MODELS[l.model].name} · ${l.size} RU${l.text?` · «${l.text}»`:""}</small><br>
        <span class="qty"><button data-dec="${l.key}" aria-label="Меньше">−</button><span>${l.q}</span><button data-inc="${l.key}" aria-label="Больше">+</button></span></div>
      <b>${rub(l.price*l.q)}</b></div>`).join("") : `<p class="empty">Пока пусто.<br>Выберите пару в каталоге или соберите свою.</p>`;
  document.getElementById("drawerFoot").innerHTML = cart.length ? `<div class="sum"><span>Итого</span><span>${rub(cartTotal())}</span></div><a class="btn lime" href="checkout.html">Оформить</a>` : "";
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
