// Обжиг — общие части: шапка, подвал, изделия, мастер-классы, корзина
const PAGES = [["index.html","Магазин"],["workshops.html","Мастер-классы"],["checkout.html","Корзина"]];
const here = location.pathname.split("/").pop() || "index.html";
const LOGO = `<svg viewBox="0 0 34 34" aria-hidden="true"><path d="M9 6h16l-1 5c5 3 6 9 4 14-2 4-6 6-11 6s-9-2-11-6c-2-5-1-11 4-14z" fill="#2B4A9B"/><path d="M8 18c5 2 13 2 18 0" stroke="#A9C2B3" stroke-width="2.5" fill="none"/></svg>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · мастерская вымышленная · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html">${LOGO}обжиг</a>
  <nav class="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <button class="cart-btn" id="cartBtn" aria-label="Открыть корзину">Корзина <b id="cartCount">0</b></button>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div><h4>обжиг</h4><p style="margin:0;max-width:34ch">Мастерская двух керамистов. Лепим и обжигаем сами — каждую вещь можно потрогать в студии.</p></div>
  <div><h4>Магазин</h4><ul><li><a href="index.html#catalog">Все изделия</a></li><li><a href="index.html#set">Собрать сервиз</a></li><li><a href="workshops.html">Мастер-классы</a></li></ul></div>
  <div><h4>Доставка</h4><ul><li>Упаковка в стружку — бесплатно</li><li>СДЭК 2–6 дней</li><li>Бой при доставке — заменим</li></ul></div>
  <div><h4>Студия</h4><ul><li>ул. Гончарная, 3</li><li>Ср–Вс, 12:00–21:00</li><li style="user-select:all">+7 900 777-66-55</li></ul></div>
  <div class="fine">«Обжиг» — вымышленная мастерская. Демо-сайт для портфолио, заказы не принимаются. Фото: Unsplash.</div>
</div></footer>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Корзина">
  <header><h3>Корзина</h3><button class="x" id="closeCart" aria-label="Закрыть">×</button></header>
  <div class="lines" id="lines"></div><footer id="drawerFoot"></footer>
</aside>
<div class="toast" id="toast" role="status"></div>`;

const GLAZES = {white:["Белая","#F1EFE8"], cream:["Сливочная","#EBDDB8"], speck:["Крапчатая","#CDBFA8"], dark:["Тёмная","#2E2D2B"], cobalt:["Кобальт","#2B4A9B"], mix:["Разные","conic-gradient(#2B4A9B 0 25%,#CDBFA8 0 50%,#A9C2B3 0 75%,#EBDDB8 0)"]};
const CATS = {mug:"Кружки", bowl:"Пиалы и миски", vase:"Вазы", set:"Наборы"};
const ITEMS = [
  {slug:"perepel", name:"Кружка «Перепел»", cat:"mug", glaze:"speck", price:2400, left:3, img:"img/i01.jpg", vol:"320 мл", size:"⌀ 8 × 9 см", dw:true, mw:true},
  {slug:"len", name:"Стаканы «Лён», набор из 4", cat:"set", glaze:"cream", price:6800, left:2, img:"img/i02.jpg", vol:"2×250, 2×150 мл", size:"до 11 см", dw:true, mw:true},
  {slug:"slivki", name:"Пиала «Сливки»", cat:"bowl", glaze:"cream", price:2900, left:5, img:"img/i03.jpg", vol:"600 мл", size:"⌀ 15 × 7 см", dw:true, mw:true},
  {slug:"tuman", name:"Миска «Туман»", cat:"bowl", glaze:"white", price:3200, left:4, img:"img/i04.jpg", vol:"900 мл", size:"⌀ 18 × 8 см", dw:true, mw:true},
  {slug:"kameshki", name:"Пиалы «Камешки», пара", cat:"set", glaze:"speck", price:4200, left:1, img:"img/i05.jpg", vol:"2 × 350 мл", size:"⌀ 12 см", dw:true, mw:false},
  {slug:"noch", name:"Чаша «Ночь»", cat:"bowl", glaze:"dark", price:3600, left:1, img:"img/i06.jpg", vol:"300 мл", size:"⌀ 13 × 6 см", dw:false, mw:false},
  {slug:"shar", name:"Ваза «Шар»", cat:"vase", glaze:"white", price:7900, left:1, img:"img/i07.jpg", vol:"—", size:"30 см", dw:false, mw:false},
  {slug:"sestry", name:"Вазочки «Сёстры», пара", cat:"vase", glaze:"speck", price:4600, left:2, img:"img/i08.jpg", vol:"—", size:"12 и 15 см", dw:false, mw:false},
  {slug:"bublik", name:"Ваза «Бублик»", cat:"vase", glaze:"cream", price:3900, left:6, img:"img/i09.jpg", vol:"—", size:"20 см", dw:false, mw:false},
  {slug:"holm", name:"Вазы «Холм», три штуки", cat:"set", glaze:"speck", price:8900, left:0, img:"img/i10.jpg", vol:"—", size:"10–18 см", dw:false, mw:false},
  {slug:"kobalt", name:"Набор «Кобальт»", cat:"set", glaze:"cobalt", price:12400, left:1, img:"img/i11.jpg", vol:"миски, кувшин, ваза", size:"5 предметов", dw:true, mw:false},
  {slug:"utro", name:"Кружка «Утро»", cat:"mug", glaze:"white", price:2200, left:7, img:"img/i12.jpg", vol:"350 мл", size:"⌀ 9 × 9 см", dw:true, mw:true},
  {slug:"palitra", name:"Соусники «Палитра», 6 шт.", cat:"set", glaze:"mix", price:5400, left:3, img:"img/i13.jpg", vol:"6 × 80 мл", size:"⌀ 8 см", dw:true, mw:true},
];
const WORKSHOPS = [
  {id:"wheel", name:"Гончарный круг для начинающих", dur:"2,5 часа", price:3800, seats:6, img:"img/w1.jpg", about:"Центровка глины, первая чашка и пиала. Изделия обожжём и покроем глазурью, заберёте через 2 недели."},
  {id:"slab", name:"Лепка из пласта", dur:"2 часа", price:3200, seats:8, img:"img/w3.jpg", about:"Без круга: тарелки, подставки и вазочки из раскатанной глины. Подходит детям от 10 лет."},
  {id:"date", name:"Свидание за кругом", dur:"2 часа", price:7200, seats:4, img:"img/w2.jpg", about:"Для двоих: один круг, одна большая форма и бутылка лимонада. Цена за пару."},
  {id:"glaze", name:"Роспись глазурями", dur:"1,5 часа", price:2600, seats:10, img:"img/tools.jpg", about:"Выберите готовое изделие с полки и распишите: ангобы, глазури, трафареты."},
];
// ближайшие занятия и свободные места — детерминированно от даты
function sessions(w, n = 6){
  const out = []; const d = new Date(); d.setHours(0,0,0,0); let i = 0;
  while(out.length < n && i < 40){ i++; const x = new Date(d); x.setDate(d.getDate()+i); const wd = x.getDay();
    if(wd>=3 || wd===0){ const seed = (x.getDate()*7 + w.id.length*13 + wd) % 11; if(seed < 7){ const busy = Math.min(w.seats, seed % (w.seats+1)); out.push({date:x, time: wd===0||wd===6 ? "14:00" : "19:00", free: w.seats - busy}); } } }
  return out;
}
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";
function stockLabel(it){ return it.left===0 ? `<span class="st out">продано</span>` : it.left===1 ? `<span class="st one">1 из 1</span>` : `<span class="st">осталось ${it.left}</span>`; }
function card(it, i){
  return `<a class="card" href="product.html#${it.slug}">
    <div class="ph blob-${i%4}"><img src="${it.img}" alt="${it.name}" loading="lazy"></div>${stockLabel(it)}
    <h3>${it.name}</h3><span class="meta"><span class="glaze" style="background:${GLAZES[it.glaze][1]}"></span>${GLAZES[it.glaze][0]} глазурь · ${it.size}</span>
    <div class="row"><span class="price">${rub(it.price)}</span></div></a>`;
}

// корзина: изделия (ограничены остатком) и билеты на мастер-классы
const KEY = "obzhig-cart";
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ cart = []; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(cart)); }catch(_){} renderCart(); document.dispatchEvent(new Event("cart")); }
const cartTotal = () => cart.reduce((a,l)=>a+l.price*l.q,0);
function addItem(slug){
  const it = ITEMS.find(x=>x.slug===slug); const ex = cart.find(l=>l.key===slug);
  const inCart = ex ? ex.q : 0;
  if(inCart >= it.left){ toast(it.left===1 ? "Это единственный экземпляр — он уже в корзине" : "Больше нет в наличии"); return false; }
  ex ? ex.q++ : cart.push({key:slug, type:"item", slug, name:it.name, price:it.price, img:it.img, q:1});
  save(); toast(`${it.name} — в корзине`); return true;
}
function addTicket(w, s, people){
  const key = `${w.id}|${s.date.toISOString().slice(0,10)}`;
  const ex = cart.find(l=>l.key===key);
  ex ? ex.q = Math.min(s.free, ex.q + people) : cart.push({key, type:"ticket", name:w.name, price:w.price, q:people, when:`${s.date.toLocaleDateString("ru-RU",{day:"numeric",month:"long",weekday:"short"})}, ${s.time}`});
  save(); toast(`Место на «${w.name}» — в корзине`);
}
let tt;
function toast(t){ const el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(()=>el.classList.remove("on"), 2400); }
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((a,l)=>a+l.q,0);
  document.getElementById("lines").innerHTML = cart.length ? cart.map(l=>`<div class="line">
      ${l.type==="ticket" ? `<span class="tk">мастер-<br>класс</span>` : `<img src="${l.img}" alt="">`}
      <div><b>${l.name}</b><small>${l.type==="ticket" ? `${l.when} · ${l.q} ${l.q===1?"место":"места"}` : `× ${l.q}`}</small><br><button class="rm" data-rm="${l.key}">Убрать</button></div>
      <b>${rub(l.price*l.q)}</b></div>`).join("") : `<p class="empty">Пока пусто.<br>Загляните в магазин или запишитесь на мастер-класс.</p>`;
  document.getElementById("drawerFoot").innerHTML = cart.length ? `<div class="sum"><span>Итого</span><span>${rub(cartTotal())}</span></div><a class="btn cobalt" href="checkout.html">Оформить</a>` : "";
}
document.addEventListener("click", e=>{ const r = e.target.closest("[data-rm]"); if(r){ cart = cart.filter(l=>l.key!==r.dataset.rm); save(); } });
const drawer = document.getElementById("drawer"), scrim = document.getElementById("scrim");
function openCart(){ drawer.classList.add("on"); scrim.classList.add("on"); document.getElementById("closeCart").focus(); }
function closeCart(){ drawer.classList.remove("on"); scrim.classList.remove("on"); }
document.getElementById("cartBtn").addEventListener("click", ()=> here==="checkout.html" ? scrollTo(0,0) : openCart());
document.getElementById("closeCart").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeCart(); });
renderCart();
