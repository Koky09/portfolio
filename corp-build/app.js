// ГК «Каркас» — общие части страниц: шапка, подвал, меню, данные проектов, демо-формы

const PAGES = [["index.html","Главная"],["projects.html","Проекты"],["about.html","О компании"],["contacts.html","Контакты"]];
const here = location.pathname.split("/").pop() || "index.html";

const LOGO = `<svg viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" fill="#E89A0C"/><path d="M7 26V13l10-6 10 6v13" fill="none" stroke="#22252A" stroke-width="3"/><path d="M13 26v-8h8v8" fill="none" stroke="#22252A" stroke-width="3"/></svg>`;

document.getElementById("header").outerHTML = `
<div class="demo">Демо-сайт из портфолио · компания вымышленная · <a href="../">← все работы</a></div>
<header class="top">
  <div class="wrap">
    <a class="logo" href="index.html">${LOGO}<b>КАРКАС</b></a>
    <nav class="menu" id="menu" aria-label="Основное меню">
      ${PAGES.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")}
    </nav>
    <span class="phone">+7 900 300-20-10</span>
    <button class="burger" id="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
    </button>
  </div>
</header>`;

document.getElementById("footer").outerHTML = `
<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div><a class="logo" href="index.html" style="color:#fff">${LOGO}<b>КАРКАС</b></a>
        <p style="margin:14px 0 0;max-width:34ch">Строим загородные дома под ключ по фиксированной смете с 2011 года.</p></div>
      <div><h4>Разделы</h4><ul>${PAGES.map(([h,n])=>`<li><a href="${h}">${n}</a></li>`).join("")}</ul></div>
      <div><h4>Технологии</h4><ul><li>Каркасные дома</li><li>Газобетон</li><li>Кирпич</li><li>Клееный брус</li></ul></div>
      <div><h4>Офис</h4><ul><li>ул. Строителей, 17, офис 204</li><li>Пн–Сб, 9:00–19:00</li><li style="user-select:all">+7 900 300-20-10</li></ul></div>
    </div>
    <div class="fine"><span>ООО «Каркас» — вымышленная компания. Демо-сайт для портфолио.</span><span>Фото: Unsplash</span></div>
  </div>
</footer>`;

const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", ()=>{
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});

// проекты: используются на главной и на странице проектов
const PROJECTS = [
  {id:"sosny",   name:"Дом «Сосны»",      where:"Истринский р-н, КП «Лесная поляна»", tech:"frame",  area:148, weeks:16, cost:9.8,  img:"img/p1.jpg", tag:"Каркас"},
  {id:"bereg",   name:"Дом «Берег»",      where:"Дмитровский р-н, у водохранилища",   tech:"gas",    area:212, weeks:26, cost:16.4, img:"img/p2.jpg", tag:"Газобетон"},
  {id:"kvadrat", name:"Дом «Квадрат»",    where:"Одинцовский р-н, КП «Горки-8»",       tech:"brick",  area:265, weeks:34, cost:24.1, img:"img/p3.jpg", tag:"Кирпич"},
  {id:"sever",   name:"Дом «Север»",      where:"Солнечногорский р-н",                  tech:"timber", area:176, weeks:20, cost:15.2, img:"img/p4.jpg", tag:"Клееный брус"},
  {id:"dacha",   name:"Дача «Малая»",     where:"Рузский р-н, СНТ «Ветерок»",           tech:"frame",  area:84,  weeks:9,  cost:4.9,  img:"img/p5.jpg", tag:"Каркас"},
  {id:"terrasa", name:"Дом «Терраса»",    where:"Раменский р-н, КП «Заречье»",          tech:"gas",    area:156, weeks:22, cost:12.3, img:"img/p6.jpg", tag:"Газобетон"},
];
function projectCard(p){
  return `<article class="pcard">
    <div class="ph"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="tag">${p.tag}</span></div>
    <div class="body"><h3>${p.name}</h3><div class="where">${p.where}</div>
      <div class="specs"><div><b>${p.area} м²</b><span>площадь</span></div><div><b>${p.weeks} нед.</b><span>срок</span></div><div><b>${p.cost.toLocaleString("ru-RU")} млн</b><span>смета, ₽</span></div></div>
    </div></article>`;
}

// демо-формы: без отправки, с понятным ответом
document.querySelectorAll("form[data-demo]").forEach(f=>{
  f.addEventListener("submit", e=>{
    e.preventDefault();
    const ok = f.querySelector(".ok"); ok.hidden = false;
    const need = [...f.querySelectorAll("[required]")].filter(i=>!i.value.trim());
    ok.textContent = need.length ? "Заполните имя и телефон, чтобы инженер мог перезвонить."
      : `Спасибо, ${f.querySelector("[name=name]").value.trim()}! Инженер перезвонит в течение часа в рабочее время. Это демо-сайт, звонка не будет.`;
  });
});
