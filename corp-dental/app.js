// Эмаль — общие части: шапка, подвал, меню, врачи, прайс, запись
const PAGES = [["index.html","Клиника"],["doctors.html","Врачи"],["prices.html","Цены"],["contacts.html","Контакты"]];
const here = location.pathname.split("/").pop() || "index.html";
const LOGO = `<svg viewBox="0 0 30 34" aria-hidden="true"><path d="M15 4c-4-3-11-2-12 5-1 6 2 10 3 16 1 5 2 8 4 8s2-4 3-8c.5-2 1.5-3 2-3s1.5 1 2 3c1 4 1 8 3 8s3-3 4-8c1-6 4-10 3-16-1-7-8-8-12-5z" fill="#1E8C7E"/><path d="M9 9c1-2 3-2 4-1" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · клиника и врачи вымышленные · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html">${LOGO}Эмаль</a>
  <nav class="menu" id="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <div class="hours"><b>+7 900 222-33-44</b>без выходных</div>
  <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div class="cols">
    <div><a class="logo" href="index.html" style="color:#fff">${LOGO}Эмаль</a><p style="margin:14px 0 0;max-width:32ch">Семейная стоматология без боли и сюрпризов в счёте. Лицензия на медицинскую деятельность (номер условный).</p></div>
    <div><h4>Разделы</h4><ul>${PAGES.map(([h,n])=>`<li><a href="${h}">${n}</a></li>`).join("")}</ul></div>
    <div><h4>Направления</h4><ul><li>Лечение и профилактика</li><li>Имплантация</li><li>Ортодонтия</li><li>Детская стоматология</li></ul></div>
    <div><h4>Контакты</h4><ul><li>ул. Садовая, 21</li><li style="user-select:all">+7 900 222-33-44</li><li>Пн–Пт 8:00–22:00, Сб–Вс 9:00–20:00</li></ul></div>
  </div>
  <div class="fine"><span>«Эмаль» — вымышленная клиника. Демо-сайт для портфолио. Имеются противопоказания, необходима консультация специалиста.</span><span>Фото: Unsplash</span></div>
</div></footer>`;

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", ()=>{ const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });

const SPECS = {ther:"Терапевт", surg:"Хирург-имплантолог", orth:"Ортопед", ortho:"Ортодонт", kids:"Детский стоматолог"};
const DOCTORS = [
  {name:"Андрей Лебедев", spec:"orth", exp:"16 лет", note:"Коронки и виниры, цифровое моделирование улыбки", img:"img/d1.jpg"},
  {name:"Валерия Гончарова", spec:"ther", exp:"9 лет", note:"Лечение кариеса и каналов под микроскопом", img:"img/d2.jpg"},
  {name:"Роман Сафонов", spec:"surg", exp:"12 лет", note:"Имплантация, в том числе за один день", img:"img/d3.jpg"},
  {name:"Дмитрий Коваль", spec:"ortho", exp:"11 лет", note:"Брекеты и элайнеры для взрослых и подростков", img:"img/d4.jpg"},
  {name:"Амина Рахимова", spec:"kids", exp:"7 лет", note:"Лечение детей с 2 лет, адаптационные визиты", img:"img/d5.jpg"},
];
// свободные слоты: детерминированно от имени врача и даты
function slots(doc, days = 3){
  const out = []; const d = new Date(); let seed = [...doc.name].reduce((a,c)=>a+c.charCodeAt(0),0);
  for(let i=1; out.length<days; i++){
    const day = new Date(d); day.setDate(d.getDate()+i);
    const times = ["09:00","10:30","12:00","14:30","16:00","17:30","19:00"].filter((_,k)=>((seed*(k+3)+i*7)%5)>1).slice(0,4);
    out.push({day, times}); seed += 13;
  }
  return out;
}
function doctorCard(doc, withSlots){
  return `<article class="doc">
    <div class="ph"><img src="${doc.img}" alt="${doc.name}" loading="lazy"></div>
    <div class="b"><span class="spec">${SPECS[doc.spec]}</span><h3>${doc.name}</h3><span class="exp">Стаж ${doc.exp} · ${doc.note}</span>
      ${withSlots ? `<div class="slots">${slots(doc).map(s=>`<span class="day">${s.day.toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long"})}</span>${s.times.map(t=>`<button data-doc="${doc.name}" data-slot="${s.day.toLocaleDateString("ru-RU",{day:"numeric",month:"long"})}, ${t}">${t}</button>`).join("")}`).join("")}</div>` : ""}
    </div></article>`;
}

const PRICES = [
  ["Диагностика", [["Консультация врача", 1500], ["Консультация + план лечения + КТ", 2500], ["Прицельный снимок", 500], ["Компьютерная томография (КТ)", 3200]]],
  ["Лечение", [["Лечение кариеса с пломбой", 6500], ["Лечение каналов, 1 канал", 7800], ["Лечение каналов под микроскопом, 3 канала", 24000], ["Удаление нерва (пульпит)", 9500]]],
  ["Гигиена", [["Профессиональная гигиена", 5900], ["Air Flow", 3500], ["Фторирование", 1200], ["Отбеливание Zoom 4", 29000]]],
  ["Имплантация", [["Имплант Straumann под ключ", 89000], ["Имплант Osstem под ключ", 65000], ["Синус-лифтинг", 38000], ["Удаление зуба простое", 3500]]],
  ["Ортопедия", [["Коронка из диоксида циркония", 32000], ["Керамический винир", 28000], ["Вкладка керамическая", 22000], ["Временная коронка", 5000]]],
  ["Ортодонтия", [["Брекеты металлические, 1 челюсть", 55000], ["Брекеты керамические, 1 челюсть", 75000], ["Элайнеры, курс", 180000], ["Ретейнер", 9000]]],
  ["Детям", [["Адаптационный визит", 1000], ["Лечение молочного зуба", 4500], ["Герметизация фиссур", 2500], ["Серебрение", 700]]],
];
const rub = n => n.toLocaleString("ru-RU").replace(/ /g," ") + " ₽";

document.querySelectorAll("form[data-demo]").forEach(f=>f.addEventListener("submit", e=>{
  e.preventDefault(); const ok = f.querySelector(".ok"); ok.hidden = false;
  const miss = [...f.querySelectorAll("[required]")].some(i=>!i.value.trim());
  const slot = f.querySelector("[name=slot]")?.value;
  ok.textContent = miss ? "Укажите имя и телефон — администратор подтвердит запись."
    : `Записали${slot ? " на " + slot : ""}. Администратор позвонит за день до приёма. Это демо-сайт, звонка не будет.`;
}));
