// Магистраль — общие части: шапка, подвал, меню, города и расчёт перевозки
const PAGES = [["index.html","Главная"],["services.html","Услуги и автопарк"],["tracking.html","Отследить груз"],["contacts.html","Контакты"]];
const here = location.pathname.split("/").pop() || "index.html";
const MARK = `<span class="mk"><span>М</span></span>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · компания вымышленная · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html">${MARK}<b>Магистраль</b></a>
  <nav class="menu" id="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <span class="hot"><small>круглосуточно</small>8 800 000-00-00</span>
  <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="dash"></div><div class="wrap">
  <div class="cols">
    <div><a class="logo" href="index.html" style="color:#fff">${MARK}<b>Магистраль</b></a><p style="margin:14px 0 0;max-width:32ch">Грузоперевозки по России с 2009 года. 12 филиалов, 240 машин, свой склад 18 000 м².</p></div>
    <div><h4>Разделы</h4><ul>${PAGES.map(([h,n])=>`<li><a href="${h}">${n}</a></li>`).join("")}</ul></div>
    <div><h4>Перевозки</h4><ul><li>Отдельная машина</li><li>Сборные грузы</li><li>Рефрижератор</li><li>Хранение на складе</li></ul></div>
    <div><h4>Связь</h4><ul><li style="user-select:all">8 800 000-00-00</li><li style="user-select:all">cargo@magistral.example</li><li>Диспетчерская 24/7</li></ul></div>
  </div>
  <div class="fine"><span>«Магистраль» — вымышленная компания. Демо-сайт для портфолио.</span><span>Фото: Unsplash</span></div>
</div></footer>`;

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", ()=>{ const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });

const CITIES = {
  "Москва":[55.75,37.62], "Санкт-Петербург":[59.94,30.31], "Казань":[55.79,49.12], "Нижний Новгород":[56.33,44.0],
  "Екатеринбург":[56.84,60.6], "Новосибирск":[55.03,82.92], "Краснодар":[45.04,38.98], "Ростов-на-Дону":[47.23,39.72],
  "Самара":[53.2,50.15], "Воронеж":[51.66,39.2], "Уфа":[54.73,55.96], "Пермь":[58.01,56.25],
};
// дорожное расстояние ≈ расстояние по прямой × 1,22
function roadKm(a, b){
  const [la1,lo1] = CITIES[a], [la2,lo2] = CITIES[b], R = 6371, r = Math.PI/180;
  const h = Math.sin((la2-la1)*r/2)**2 + Math.cos(la1*r)*Math.cos(la2*r)*Math.sin((lo2-lo1)*r/2)**2;
  return Math.round(2*R*Math.asin(Math.sqrt(h)) * 1.22);
}
const TRUCKS = [
  {id:"g", name:"Газель", t:1.5, m3:9,  rate:38, len:4.2},
  {id:"m", name:"5-тонник", t:5, m3:36, rate:55, len:6.2},
  {id:"l", name:"10-тонник", t:10, m3:54, rate:72, len:7.4},
  {id:"f", name:"Фура", t:20, m3:86, rate:95, len:13.6},
];
function quote({from, to, kg, m3, mode}){
  const km = from===to ? 30 : roadKm(from, to);
  if(mode==="ltl"){
    const price = Math.max(3500, Math.round(kg*km*0.011 + m3*km*1.9));
    return {km, price, days:[Math.ceil(km/550)+1, Math.ceil(km/550)+3], truck:null};
  }
  const truck = TRUCKS.find(t=>kg/1000<=t.t && m3<=t.m3) || TRUCKS[3];
  const k = mode==="reefer" ? 1.3 : 1;
  const price = Math.max(8000, Math.round(km*truck.rate*k/100)*100);
  return {km, price, days:[Math.max(1,Math.ceil(km/750)), Math.ceil(km/750)+1], truck, fill:Math.min(1, Math.max(kg/1000/truck.t, m3/truck.m3))};
}
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";

document.querySelectorAll("form[data-demo]").forEach(f=>f.addEventListener("submit", e=>{
  e.preventDefault(); const ok = f.querySelector(".ok"); ok.hidden = false;
  const miss = [...f.querySelectorAll("[required]")].some(i=>!i.value.trim());
  ok.textContent = miss ? "Укажите имя и телефон, чтобы логист мог перезвонить."
    : "Заявка принята. Логист перезвонит в течение 15 минут и подтвердит машину. Это демо-сайт, звонка не будет.";
}));
