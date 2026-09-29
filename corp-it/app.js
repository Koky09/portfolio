// Полигон — общие части: шапка, подвал, меню, кейсы, демо-формы
const PAGES = [["index.html","Студия"],["cases.html","Кейсы"],["about.html","Команда"],["contacts.html","Контакты"]];
const here = location.pathname.split("/").pop() || "index.html";
const LOGO = `<svg viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill="#0E0E10"/><path d="M8 20V8h7a4 4 0 0 1 0 8H8" fill="none" stroke="#FBFBFA" stroke-width="2.6"/><circle cx="20.5" cy="20" r="2.2" fill="#3B3BF5"/></svg>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · студия и кейсы вымышленные · <a href="../">← все работы</a></div>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html">${LOGO}полигон</a>
  <nav class="menu" id="menu" aria-label="Основное меню">${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}</nav>
  <a class="btn" href="contacts.html">Обсудить проект <span class="arr">→</span></a>
  <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
</div></header>`;

document.getElementById("footer").outerHTML = `
<footer class="site"><div class="wrap">
  <div class="big"><a href="contacts.html">Давайте сделаем →</a></div>
  <div class="cols">
    <div><h4>// студия</h4><ul>${PAGES.map(([h,n])=>`<li><a href="${h}">${n}</a></li>`).join("")}</ul></div>
    <div><h4>// делаем</h4><ul><li>Веб-сервисы</li><li>Мобильные приложения</li><li>CRM и внутренние системы</li><li>Боты и интеграции</li></ul></div>
    <div><h4>// связь</h4><ul><li style="user-select:all">hello@poligon.example</li><li style="user-select:all">+7 900 404-00-01</li></ul></div>
    <div><h4>// офис</h4><ul><li>Технопарк, корпус Б, 5 этаж</li><li>Пн–Пт, 10:00–19:00</li></ul></div>
  </div>
  <div class="fine"><span>«Полигон» — вымышленная студия. Демо-сайт для портфолио.</span><span>Фото: Unsplash</span></div>
</div></footer>`;

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", ()=>{ const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });

const CASES = [
  {name:"Капля", about:"Мобильный банк для фрилансеров: счета, налоги и выплаты в одном приложении.", ind:"fintech", plat:["iOS","Android"], img:"img/c1.jpg", m:[["4,7★","рейтинг в сторах"],["120 тыс.","пользователей"],["5 мес.","до релиза"]]},
  {name:"Суп да каша", about:"Доставка домашней еды: приложение для клиентов и панель для кухонь.", ind:"food", plat:["iOS","Android","Веб"], img:"img/c2.jpg", m:[["+38%","повторных заказов"],["12 мин","средняя сборка"],["3 города","запуска"]]},
  {name:"Кадр", about:"Онлайн-кинотеатр для авторского кино: витрина, подписка и плеер.", ind:"media", plat:["Веб","Smart TV"], img:"img/c3.jpg", m:[["2,1 млн","просмотров в месяц"],["99,95%","аптайм"],["−40%","стоимость CDN"]]},
  {name:"Звук", about:"Приложение для музыкальных школ: расписание, задания и оплата уроков.", ind:"edu", plat:["iOS","Android"], img:"img/c4.jpg", m:[["64","школы на платформе"],["−6 ч","админки в неделю"],["4,8★","рейтинг"]]},
  {name:"Лавка", about:"Маркетплейс фермерских продуктов: каталог, логистика и кабинет продавца.", ind:"ecom", plat:["Веб","iOS"], img:"img/c5.jpg", m:[["×2,4","выручка за год"],["1 800","продавцов"],["1,2 с","загрузка каталога"]]},
  {name:"Смена", about:"CRM для сети кофеен: смены бариста, остатки и аналитика по точкам.", ind:"b2b", plat:["Веб","Android"], img:"img/c6.jpg", m:[["42","кофейни"],["−18%","списаний"],["2 нед.","внедрение"]]},
];
const IND = {fintech:"Финтех", food:"Фудтех", media:"Медиа", edu:"Образование", ecom:"E-commerce", b2b:"B2B"};
function caseCard(c){
  return `<a class="case" href="cases.html#${encodeURIComponent(c.name)}">
    <div class="ph"><img src="${c.img}" alt="Проект ${c.name}" loading="lazy"><div class="chips"><span>${IND[c.ind]}</span>${c.plat.map(p=>`<span>${p}</span>`).join("")}</div></div>
    <h3>${c.name}</h3><p>${c.about}</p>
    <div class="metrics">${c.m.map(([b,s])=>`<div><b>${b}</b><span>${s}</span></div>`).join("")}</div></a>`;
}

document.querySelectorAll("form[data-demo]").forEach(f=>f.addEventListener("submit", e=>{
  e.preventDefault(); const ok = f.querySelector(".ok"); ok.hidden = false;
  const miss = [...f.querySelectorAll("[required]")].some(i=>!i.value.trim());
  ok.textContent = miss ? "Заполните имя и контакт — без них мы не сможем ответить."
    : "Бриф получен. Менеджер ответит в течение рабочего дня с вопросами и оценкой. Это демо-сайт, ответа не будет.";
}));
