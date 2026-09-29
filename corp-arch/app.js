// Ось — общие части: шапка, подвал, проекты и планировки
const PAGES = [["index.html","Бюро"],["projects.html","Проекты"],["contacts.html","Контакты"]];
const here = location.pathname.split("/").pop() || "index.html";

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · бюро и проекты вымышленные · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h18M3 16h18"/></svg></button>
  <nav class="menu" id="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here||(here==="project.html"&&h==="projects.html")?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <a class="logo" href="index.html">ОСЬ</a>
  <a class="contact-link" href="mailto:studio@os.example">studio@os.example</a>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div><b>Бюро</b>Архитектура и интерьеры.<br>Основано в 2012 году.</div>
  <div><b>Студия</b>Хлебозавод, корпус 3, 2 этаж<br>Пн–Пт, 10:00–19:00</div>
  <div><b>Связь</b><span style="user-select:all">studio@os.example</span><br><span style="user-select:all">+7 900 010-20-30</span></div>
  <div><b>Разделы</b>${PAGES.map(([h,n])=>`<a href="${h}">${n}</a>`).join("<br>")}</div>
  <div class="big" aria-hidden="true">ОСЬ</div>
  <div style="grid-column:1/-1;font-size:12.5px;color:var(--muted)">«Ось» — вымышленное бюро, проекты и цифры условные. Демо-сайт для портфолио. Фото: Unsplash.</div>
</div></footer>`;

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", ()=>{ const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });

// планировки: комнаты в метрах [название, x, y, ширина, глубина]
const PLANS = {
  flat: {w:14, h:9, rooms:[["Гостиная-кухня",0,0,8,5.4],["Спальня",8,0,6,4.2],["Гардероб",8,4.2,2.4,1.8],["Санузел",10.4,4.2,3.6,1.8],["Прихожая",0,5.4,4.2,3.6],["Кабинет",4.2,5.4,3.8,3.6],["Детская",8,6,6,3]]},
  house:{w:16, h:11, rooms:[["Гостиная",0,0,7,6],["Кухня-столовая",7,0,5,6],["Терраса",12,0,4,6],["Спальня",0,6,5,5],["Ванная",5,6,3,2.4],["Холл",5,8.4,3,2.6],["Спальня гостевая",8,6,4.5,5],["Котельная",12.5,6,3.5,2.2],["Гараж",12.5,8.2,3.5,2.8]]},
  office:{w:18, h:10, rooms:[["Опенспейс",0,0,10,6.5],["Переговорная большая",10,0,5,4],["Переговорная малая",15,0,3,4],["Кухня",10,4,4,2.5],["Фокус-комнаты",14,4,4,2.5],["Ресепшн",0,6.5,5,3.5],["Лаунж",5,6.5,7,3.5],["Санузлы",12,6.5,3,3.5],["Серверная",15,6.5,3,3.5]]},
  public:{w:20, h:12, rooms:[["Главный зал",0,0,12,8],["Фойе",12,0,8,5],["Гардероб",12,5,4,3],["Кафе",16,5,4,3],["Мастерская",0,8,6,4],["Библиотека",6,8,6,4],["Служебные",12,8,8,4]]},
};
const TYPES = {res:"Жилое", pub:"Общественное", int:"Интерьер", off:"Офис"};
const PROJECTS = [
  {slug:"lameli", name:"Ламели", type:"res", city:"Москва", year:2025, area:18400, status:"построен", img:"img/lamel.jpg", gal:["img/lamel.jpg","img/cube2.jpg"], plan:"flat",
   about:"Жилой квартал из четырёх корпусов с фасадом из вертикальных ламелей термодерева. Ламели работают как солнцезащита и меняют рисунок фасада в течение дня."},
  {slug:"beton", name:"Бетон", type:"res", city:"Подмосковье", year:2024, area:420, status:"построен", img:"img/beton.jpg", gal:["img/beton.jpg","img/beton2.jpg","img/beton3.jpg"], plan:"house",
   about:"Частный дом из монолитного бетона с открытой текстурой опалубки. Объёмы сдвинуты так, чтобы из каждой спальни был вид на лес, но не на соседей."},
  {slug:"kub", name:"Белый куб", type:"res", city:"Казань", year:2023, area:9600, status:"построен", img:"img/cube.jpg", gal:["img/cube.jpg","img/cube2.jpg"], plan:"flat",
   about:"Клубный дом на 64 квартиры. Консольные объёмы верхних этажей дают каждой квартире террасу без колонн внизу."},
  {slug:"grani", name:"Грани", type:"off", city:"Санкт-Петербург", year:2025, area:12800, status:"строится", img:"img/grani.jpg", gal:["img/grani.jpg","img/grani2.jpg"], plan:"office",
   about:"Офисное здание с гранёным фасадом из фибробетонных панелей. Угол каждой грани рассчитан так, чтобы не пускать прямое солнце в рабочие зоны."},
  {slug:"kampus", name:"Кампус", type:"pub", city:"Екатеринбург", year:2026, area:22500, status:"проект", img:"img/campus.jpg", gal:["img/campus.jpg"], plan:"public",
   about:"Учебный корпус университета с открытым атриумом на четыре этажа. Цветные вставки на фасаде обозначают факультеты."},
  {slug:"presnya", name:"Квартира на Пресне", type:"int", city:"Москва", year:2025, area:126, status:"реализован", img:"img/presnya.jpg", gal:["img/presnya.jpg","img/presnya2.jpg"], plan:"flat",
   about:"Интерьер квартиры для семьи с двумя детьми. Убрали коридор и собрали хранение в одной стене на всю длину квартиры."},
  {slug:"ozero", name:"Дом у озера", type:"int", city:"Карелия", year:2024, area:210, status:"реализован", img:"img/lake.jpg", gal:["img/lake.jpg","img/lake2.jpg"], plan:"house",
   about:"Интерьер загородного дома: панорамное остекление, микроцемент, дуб и минимум декора — главное за окном."},
  {slug:"arki", name:"Арки", type:"int", city:"Сочи", year:2023, area:88, status:"реализован", img:"img/arki.jpg", gal:["img/arki.jpg","img/arki2.jpg"], plan:"flat",
   about:"Апартаменты у моря. Серия арок из гипса собирает анфиладу и прячет инженерию в толще стен."},
];
function projectCard(p){
  return `<a class="pc" href="project.html#${p.slug}">
    <div class="ph"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="meta"><h3>${p.name}</h3><span>${p.year}</span></div>
    <p>${TYPES[p.type]} · ${p.city} · ${p.area.toLocaleString("ru-RU")} м²</p></a>`;
}

document.querySelectorAll("form[data-demo]").forEach(f=>f.addEventListener("submit", e=>{
  e.preventDefault(); const ok = f.querySelector(".ok"); ok.hidden = false;
  const miss = [...f.querySelectorAll("[required]")].some(i=>!i.value.trim());
  ok.textContent = miss ? "Оставьте имя и контакт — без них мы не сможем ответить."
    : "Спасибо. Мы изучим задачу и предложим время для встречи в студии. Это демо-сайт, ответа не будет.";
}));
