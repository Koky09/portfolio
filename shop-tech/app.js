// Модуль — общие части: шапка с таймером доставки, подвал, товары, сравнение, корзина
const here = location.pathname.split("/").pop() || "index.html";

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · бренд «Модуль» вымышленный · <a href="../">← все работы</a></div>
<div class="strip" id="strip"></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html"><i aria-hidden="true"><b></b><b></b><b></b><b></b></i>Модуль</a>
  <form class="search" action="index.html" method="get" role="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input name="q" placeholder="Наушники, клавиатура, 20000 мАч…" aria-label="Поиск по каталогу"></form>
  <nav aria-label="Основное меню">
    <a class="icon-btn" href="index.html#catalog"${here==="index.html"?' aria-current="page"':""}><span class="t">Каталог</span><span aria-hidden="true" style="display:none"></span></a>
    <a class="icon-btn" href="compare.html"${here==="compare.html"?' aria-current="page"':""}><span class="t">Сравнение</span><b id="cmpCount">0</b></a>
    <button class="icon-btn" id="cartBtn" aria-label="Открыть корзину"><span class="t">Корзина</span><b id="cartCount">0</b></button>
  </nav>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div><h4>Модуль</h4><p style="margin:0;max-width:32ch">Звук, клавиатуры и питание для рабочего стола. Проектируем в Москве, гарантия 2 года на всё.</p></div>
  <div><h4>Каталог</h4><ul><li><a href="index.html?cat=audio#catalog">Наушники</a></li><li><a href="index.html?cat=speaker#catalog">Колонки</a></li><li><a href="index.html?cat=kb#catalog">Клавиатуры</a></li><li><a href="index.html?cat=power#catalog">Аккумуляторы</a></li></ul></div>
  <div><h4>Покупателям</h4><ul><li>Доставка сегодня до 16:00</li><li>Рассрочка 0% до 24 месяцев</li><li>Возврат 14 дней</li></ul></div>
  <div><h4>Поддержка</h4><ul><li style="user-select:all">8 800 000-10-10</li><li style="user-select:all">help@modul.example</li></ul></div>
  <div class="fine">«Модуль» — вымышленный бренд. Демо-сайт для портфолио, товары и характеристики условные. Фото: Unsplash.</div>
</div></footer>
<div class="tray" id="tray" aria-live="polite"></div>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Корзина">
  <header><h3>Корзина</h3><button class="x" id="closeCart" aria-label="Закрыть">×</button></header>
  <div class="lines" id="lines"></div><footer id="drawerFoot"></footer>
</aside>
<div class="toast" id="toast" role="status"></div>`;

// таймер «привезём сегодня»: заказ до 16:00 — курьер сегодня вечером
function strip(){
  const n = new Date(), cut = new Date(n); cut.setHours(16,0,0,0);
  const el = document.getElementById("strip");
  if(n < cut){ const m = Math.floor((cut-n)/60000); el.innerHTML = `Закажите в течение <b>${Math.floor(m/60)} ч ${String(m%60).padStart(2,"0")} мин</b> — привезём сегодня с 18:00 до 22:00`; }
  else el.innerHTML = `Сегодня уже не успеем — закажите сейчас, и курьер приедет <b>завтра</b> с 10:00`;
}
strip(); setInterval(strip, 30000);

const CATS = {audio:"Наушники", speaker:"Колонки", kb:"Клавиатуры", power:"Аккумуляторы"};
// характеристики для сравнения; better: "max" | "min" — какое значение лучше
const SPECS = {
  audio:[["Тип","type"],["Шумоподавление","anc"],["Автономность, ч","battery","max"],["Вес, г","weight","min"],["Кодеки","codec"],["Подключение","conn"]],
  speaker:[["Мощность, Вт","watts","max"],["Автономность, ч","battery","max"],["Защита","ip"],["Вес, г","weight","min"],["Стерео-пара","pair"]],
  kb:[["Формат","layout"],["Переключатели","switch"],["Подключение","conn"],["Подсветка","light"],["Корпус","body"]],
  power:[["Ёмкость, мАч","mah","max"],["Мощность, Вт","watts","max"],["Порты","ports"],["Вес, г","weight","min"]],
};
const PRODUCTS = [
  {id:"n1", name:"Наушники Модуль Н1", cat:"audio", price:14990, old:17990, img:"img/t01.jpg", rate:4.8, rev:312, s:{type:"полноразмерные",anc:"активное, −35 дБ",battery:40,weight:254,codec:"AAC, LDAC",conn:"Bluetooth 5.3, 3,5 мм"}},
  {id:"studio", name:"Наушники Н1 Студия", cat:"audio", price:7490, img:"img/t02.jpg", rate:4.7, rev:98, s:{type:"мониторные, провод",anc:"нет",battery:0,weight:236,codec:"—",conn:"кабель 3 м, 6,3 мм"}},
  {id:"noch", name:"Наушники Модуль Ночь", cat:"audio", price:21990, img:"img/t03.jpg", rate:4.9, rev:156, s:{type:"полноразмерные",anc:"адаптивное, −42 дБ",battery:32,weight:268,codec:"AAC, LDAC, aptX",conn:"Bluetooth 5.4, USB-C"}, badge:"новинка"},
  {id:"retro", name:"Наушники Ретро", cat:"audio", price:9990, img:"img/t04.jpg", rate:4.5, rev:77, s:{type:"накладные",anc:"нет",battery:30,weight:198,codec:"AAC",conn:"Bluetooth 5.2, 3,5 мм"}},
  {id:"kapli", name:"Беспроводные наушники Капли", cat:"audio", price:6990, old:8490, img:"img/t05.jpg", rate:4.6, rev:540, s:{type:"вкладыши TWS",anc:"активное, −28 дБ",battery:28,weight:48,codec:"AAC",conn:"Bluetooth 5.3"}},
  {id:"kub", name:"Колонка Куб", cat:"speaker", price:5990, img:"img/t06.jpg", rate:4.7, rev:203, s:{watts:10,battery:16,ip:"IP67",weight:420,pair:"да"}},
  {id:"bashnya", name:"Колонка Башня", cat:"speaker", price:16990, img:"img/t07.jpg", rate:4.8, rev:88, s:{watts:40,battery:24,ip:"IPX4",weight:1350,pair:"да"}, badge:"хит"},
  {id:"k75", name:"Клавиатура Клик 75", cat:"kb", price:11990, img:"img/t08.jpg", rate:4.9, rev:421, s:{layout:"75%, 84 клавиши",switch:"линейные, hot-swap",conn:"Bluetooth, 2,4 ГГц, USB-C",light:"RGB",body:"алюминий"}, badge:"хит"},
  {id:"tkl", name:"Клавиатура Клик TKL", cat:"kb", price:13490, img:"img/t09.jpg", rate:4.7, rev:130, s:{layout:"TKL, 87 клавиш",switch:"тактильные",conn:"USB-C",light:"белая",body:"пластик, стальная пластина"}},
  {id:"pastel", name:"Клавиатура Пастель", cat:"kb", price:12990, img:"img/t10.jpg", rate:4.6, rev:64, s:{layout:"65%, 68 клавиш",switch:"линейные, тихие",conn:"Bluetooth, USB-C",light:"нет",body:"пластик"}},
  {id:"k65", name:"Клавиатура Клик 65", cat:"kb", price:9990, old:11490, img:"img/t11.jpg", rate:4.8, rev:287, s:{layout:"65%, 68 клавиш",switch:"линейные, hot-swap",conn:"Bluetooth, USB-C",light:"RGB",body:"пластик"}},
  {id:"z20", name:"Аккумулятор Заряд 20", cat:"power", price:3990, img:"img/t12.jpg", rate:4.8, rev:612, s:{mah:20000,watts:65,ports:"2 × USB-C, USB-A",weight:390}},
  {id:"z10", name:"Аккумулятор Заряд 10", cat:"power", price:2490, img:"img/t13.jpg", rate:4.7, rev:338, s:{mah:10000,watts:30,ports:"USB-C, USB-A",weight:210}},
];
const short = p => { const s = p.s; return p.cat==="audio" ? `${s.battery?s.battery+" ч · ":""}${s.anc==="нет"?"без ANC":"ANC"}` : p.cat==="speaker" ? `${s.watts} Вт · ${s.battery} ч · ${s.ip}` : p.cat==="kb" ? `${s.layout.split(",")[0]} · ${s.switch.split(",")[0]}` : `${s.mah.toLocaleString("ru-RU")} мАч · ${s.watts} Вт`; };
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";

// сравнение
const CKEY = "modul-compare";
let cmp = []; try{ cmp = JSON.parse(localStorage.getItem(CKEY) || "[]"); }catch(_){ cmp = []; }
function saveCmp(){ try{ localStorage.setItem(CKEY, JSON.stringify(cmp)); }catch(_){} renderTray(); document.dispatchEvent(new Event("cmp")); }
function toggleCmp(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(cmp.includes(id)){ cmp = cmp.filter(x=>x!==id); saveCmp(); return; }
  const first = PRODUCTS.find(x=>x.id===cmp[0]);
  if(first && first.cat!==p.cat){ cmp = [id]; toast(`Сравниваем только одну категорию — начали заново с «${CATS[p.cat].toLowerCase()}»`); }
  else if(cmp.length>=3){ toast("Сравнить можно до трёх товаров"); return; }
  else cmp.push(id);
  saveCmp();
}
function renderTray(){
  document.getElementById("cmpCount").textContent = cmp.length;
  const t = document.getElementById("tray");
  t.classList.toggle("on", cmp.length>0 && here!=="compare.html");
  t.innerHTML = `<span>Сравнение: ${cmp.length} из 3</span><span class="thumbs">${cmp.map(id=>`<img src="${PRODUCTS.find(p=>p.id===id).img}" alt="">`).join("")}</span><a class="btn" href="compare.html" ${cmp.length<2?'aria-disabled="true" style="opacity:.5;pointer-events:none"':""}>Сравнить</a>`;
}
function card(p){
  return `<article class="card">
    <a class="ph" href="product.html#${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a>
    ${p.old ? `<span class="badge sale">−${Math.round((1-p.price/p.old)*100)}%</span>` : p.badge ? `<span class="badge">${p.badge}</span>` : ""}
    <span class="rating"><b>★</b> ${String(p.rate).replace(".",",")} · ${p.rev} отзывов</span>
    <h3><a href="product.html#${p.id}">${p.name}</a></h3>
    <span class="spec">${short(p)}</span>
    <div class="row"><span><span class="price">${rub(p.price)}</span>${p.old?`<span class="old">${rub(p.old)}</span>`:""}</span>
      <span class="acts"><button class="cmp" data-cmp="${p.id}" aria-pressed="${cmp.includes(p.id)}" aria-label="Сравнить ${p.name}">⇄</button><button class="add" data-add="${p.id}" aria-label="В корзину ${p.name}">+</button></span></div>
  </article>`;
}

// корзина
const KEY = "modul-cart";
let cart = []; try{ cart = JSON.parse(localStorage.getItem(KEY) || "[]"); }catch(_){ cart = []; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(cart)); }catch(_){} renderCart(); document.dispatchEvent(new Event("cart")); }
const cartTotal = () => cart.reduce((a,l)=>a+PRODUCTS.find(p=>p.id===l.id).price*l.q,0);
function addToCart(id, color = "чёрный"){
  const key = `${id}|${color}`; const ex = cart.find(l=>l.key===key);
  ex ? ex.q++ : cart.push({key, id, color, q:1});
  save(); toast(`${PRODUCTS.find(p=>p.id===id).name} — в корзине`);
}
let tt;
function toast(t){ const el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(()=>el.classList.remove("on"), 2600); }
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((a,l)=>a+l.q,0);
  document.getElementById("lines").innerHTML = cart.length ? cart.map(l=>{ const p = PRODUCTS.find(x=>x.id===l.id);
    return `<div class="line"><img src="${p.img}" alt=""><div><b>${p.name}</b><small>${l.color}</small><br><span class="qty"><button data-dec="${l.key}" aria-label="Меньше">−</button><span>${l.q}</span><button data-inc="${l.key}" aria-label="Больше">+</button></span></div><b>${rub(p.price*l.q)}</b></div>`; }).join("")
    : `<p class="empty">Корзина пустая</p>`;
  document.getElementById("drawerFoot").innerHTML = cart.length ? `<div class="sum"><span>Итого</span><span>${rub(cartTotal())}</span></div><span style="font-size:13.5px;color:var(--muted)">или ${rub(Math.ceil(cartTotal()/12))} × 12 мес. в рассрочку</span><a class="btn" href="checkout.html">Оформить</a>` : "";
}
function changeQty(key, d){ const l = cart.find(x=>x.key===key); if(!l) return; l.q += d; if(l.q<=0) cart = cart.filter(x=>x!==l); save(); }
document.addEventListener("click", e=>{
  const a = e.target.closest("[data-add]"); if(a){ addToCart(a.dataset.add); return; }
  const c = e.target.closest("[data-cmp]"); if(c){ toggleCmp(c.dataset.cmp); document.querySelectorAll(`[data-cmp]`).forEach(b=>b.setAttribute("aria-pressed", cmp.includes(b.dataset.cmp))); return; }
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
renderCart(); renderTray();
