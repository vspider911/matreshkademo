(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';
  const dur = m => (m >= 60 ? `${Math.floor(m / 60)} ч` : '') + (m % 60 ? `${m >= 60 ? ' ' : ''}${m % 60} мин` : '');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Данные: цены условные, отзывы с Яндекс Карт ----------
     g — «зона» мастера: услуги из разных зон (руки / волосы / лицо) можно делать одновременно.
     Массаж тела (body) параллельно не делается. */
  const CATS = [
    { key: 'nails', title: 'Маникюр и педикюр', img: 'nails.webp', alt: 'Маникюр в лиловых и серебристых тонах', items: [
      ['Маникюр с покрытием гель-лак', 2600, 90, 'hands'], ['Френч', 3200, 120, 'hands'], ['Мужской маникюр', 1900, 60, 'hands'], ['SMART-педикюр с покрытием', 3900, 90, 'hands'], ['Классический педикюр', 2700, 75, 'hands'] ]},
    { key: 'hair', title: 'Волосы', img: 'hair.webp', alt: 'Мастер делает причёску клиентке', items: [
      ['Женская стрижка', 2900, 60, 'hair'], ['Укладка', 3000, 60, 'hair'], ['Уход для волос', 4500, 60, 'hair'] ]},
    { key: 'color', title: 'Окрашивание', img: 'color.webp', alt: 'Длинные волосы, окрашенные в лавандовый оттенок', items: [
      ['Окрашивание в один тон', 5500, 120, 'hair'], ['Сложное окрашивание', 8500, 180, 'hair'], ['Тонирование', 3500, 90, 'hair'] ]},
    { key: 'brows', title: 'Брови и ресницы', img: 'brows.webp', alt: 'Ухоженная бровь крупным планом', items: [
      ['Оформление и окрашивание бровей', 1600, 45, 'face'], ['Мужская коррекция бровей', 1200, 30, 'face'], ['Ламинирование ресниц', 2800, 60, 'face'] ]},
    { key: 'face', title: 'Косметология', img: 'face.webp', alt: 'Массаж лица', items: [
      ['Массаж лица', 3200, 45, 'face'], ['Комбинированная чистка лица', 4200, 75, 'face'], ['Пилинг', 3800, 45, 'face'] ]},
    { key: 'massage', title: 'Массаж', img: 'massage.webp', alt: 'Массажист разминает руку клиента', items: [
      ['Расслабляющий массаж тела', 3200, 60, 'body'], ['Шейно-воротниковая зона', 2200, 30, 'body'], ['Массаж ног', 1800, 30, 'body'] ]},
    { key: 'makeup', title: 'Макияж', img: 'makeup.webp', alt: 'Нежный макияж глаз', items: [
      ['Дневной макияж', 3200, 60, 'face'], ['Вечерний макияж', 4200, 75, 'face'], ['Свадебный макияж', 7000, 120, 'face'] ]},
    { key: 'scalp', title: 'Трихология', img: 'scalp.webp', alt: 'Мойки для ухода за волосами и кожей головы', items: [
      ['Диагностика кожи головы', 2500, 40, 'hair'], ['Пилинг кожи головы', 2400, 40, 'hair'] ]},
    { key: 'first', title: 'Первый визит', hidden: true, items: [
      ['Маникюр с покрытием для новых клиентов', 2290, 90, 'hands'], ['Оформление и окрашивание бровей для новых клиентов', 1400, 45, 'face'], ['Знакомство с мастером: массаж', 1700, 60, 'body'], ['Чистка лица и пилинг для новых клиентов', 7900, 90, 'face'] ]},
  ];
  const ITEMS = {}; CATS.forEach(c => c.items.forEach(([n, p, m, g]) => { ITEMS[n] = { n, p, m, g, cat: c.key }; }));

  const MASTERS = [
    ['Дарья', 'маникюр', 'Безупречный френч — её конёк.', 'Елена Б.'],
    ['Алина', 'стрижки, окрашивание, укладки', 'Сделала именно так, как я хотела.', 'Мария С.'],
    ['Анастасия', 'массаж', 'Золотые руки: ушло напряжение, с которым я жила неделями.', 'Ольга Ш.'],
    ['Юлия', 'брови, в том числе мужские', 'Брови остались мужскими, но ухоженными — она отлично чувствует эту грань.', 'Марк К.'],
    ['Мария', 'косметолог', 'Великолепный массаж лица и подходящий уход, подскажет косметику.', 'Елена Б.'],
    ['Елена', 'брови и окрашивание', 'Спрашивала мои предпочтения на всех этапах — было очень комфортно.', 'Оксана Л.'],
  ];
  const REVIEWS = [
    ['Валерия Т.', '20 июня', 'Я еду с другого конца Москвы, чтобы оказаться в руках мастеров этого салона. Небольшой, но такой стильный салон, в котором всё идеально: от чайной пары с вкуснейшим напитком до качества услуги.'],
    ['Ольга Ш.', '16 августа', 'Отличный салон и прекрасный мастер Анастасия! С порога погружаешься в спокойную атмосферу. Проработала шейно-воротниковую зону — ушло напряжение, с которым я жила неделями. А массаж ног — просто восторг.'],
    ['Людмила К.', '4 августа', 'Нашла салон по отзывам, приехала из другого города на свадьбу дочери. Алина подстригла как я хотела, а Анастасия сделала расслабляющий массаж лица и уход — сняла отёчность. Осталась очень довольна!'],
    ['Полина К.', '15 июля', 'Была на маникюре у Дарьи: всё качественно и довольно быстро. Приятная атмосфера за счёт интерьера, музыки и фильмов, есть подставочки под сумку и телефон — очень удобно.'],
    ['Марк К.', '8 августа', 'Хожу на мужскую коррекцию бровей к Юлии уже не первый раз — 10/10. Она всегда советует, как лучше с учётом роста волос и типа лица, при этом без навязывания лишних услуг.'],
    ['Катя', '5 января', 'Обращалась из-за выпадения волос после стресса. Сделали диагностику у трихолога, подобрали курс пилингов и укрепляющих процедур, добавили массаж шеи. Через три недели волосы перестали выпадать.'],
  ];

  /* ---------- Карточки услуг ---------- */
  $('#cards').innerHTML = CATS.filter(c => !c.hidden).map((c, i) => {
    const min = Math.min(...c.items.map(x => x[1]));
    return `<article class="card reveal" style="--i:${i % 4}">
      <div class="card__img"><img src="img/${c.img}" alt="${c.alt}" width="1000" height="1000"></div>
      <div class="card__body">
        <div class="card__top"><h3>${c.title}</h3><span class="card__from">от ${rub(min)}</span></div>
        <ul>${c.items.slice(0, 3).map(([n, p, m]) => `<li><span>${n}</span><b>${rub(p)}</b><small>${dur(m)}</small></li>`).join('')}</ul>
        <a class="btn btn--line" href="#booking" data-book-cat="${c.key}">Записаться</a>
      </div>
    </article>`;
  }).join('');
  $('#offers').innerHTML = CATS.find(c => c.key === 'first').items.map(([n, p]) => `<li><span>${n.replace(' для новых клиентов', '')}</span><b>${rub(p)}</b></li>`).join('');

  /* ---------- Мастера и отзывы ---------- */
  $('#teamGrid').innerHTML = MASTERS.map(([n, role, q, who], i) => `
    <article class="master reveal" style="--i:${i % 3}">
      <div class="master__mono">${n[0]}</div>
      <h3>${n}</h3>
      <em>${role}</em>
      <q>${q}</q>
    </article>`).join('');
  $('#rv').innerHTML = REVIEWS.map(([who, date, text], i) => `
    <article class="rv__item reveal" style="--i:${i % 3}">
      <div class="rv__stars" aria-label="5 из 5">★★★★★</div>
      <p>${text}</p>
      <div class="rv__who"><b>${who}</b><span>${date}</span></div>
    </article>`).join('');

  /* ---------- Открыто / Закрыто по Москве ---------- */
  function mskNow() {
    const p = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    return +p.find(x => x.type === 'hour').value * 60 + +p.find(x => x.type === 'minute').value;
  }
  const OPEN = 10 * 60, CLOSE = 22 * 60;
  function paintStatus() {
    const t = mskNow(), open = t >= OPEN && t < CLOSE;
    const text = open ? (CLOSE - t <= 60 ? `Открыто ещё ${CLOSE - t} мин · до 22:00` : 'Открыто сейчас · до 22:00') : 'Закрыто · с 10:00 — запишитесь онлайн';
    $$('[data-status]').forEach(el => {
      el.classList.toggle('is-open', open); el.classList.toggle('is-closed', !open);
      el.querySelector('span').textContent = el.classList.contains('status--inline') ? (open ? 'открыто' : 'закрыто') : text;
    });
  }
  paintStatus(); setInterval(paintStatus, 60000);

  /* ---------- Онлайн-запись ---------- */
  const selected = new Set();
  let activeTab = 'nails', activeDay = 0, activeSlot = null;
  const tabs = $('#bookTabs'), list = $('#svcList');
  const bookCats = [CATS.find(c => c.key === 'first'), ...CATS.filter(c => !c.hidden)];

  function renderTabs() {
    tabs.innerHTML = bookCats.map(c => {
      const n = c.items.filter(([name]) => selected.has(name)).length;
      return `<button type="button" class="tab${c.key === activeTab ? ' is-on' : ''}" data-tab="${c.key}">${c.title}${n ? `<i>${n}</i>` : ''}</button>`;
    }).join('');
  }
  function renderList() {
    renderTabs();
    const c = CATS.find(x => x.key === activeTab);
    list.innerHTML = c.items.map(([n, p, m]) => `<label><input type="checkbox" data-name="${n}" ${selected.has(n) ? 'checked' : ''}><span>${n}<small>${dur(m)}</small></span><b>${rub(p)}</b></label>`).join('');
  }
  tabs.addEventListener('click', e => { const b = e.target.closest('.tab'); if (!b) return; activeTab = b.dataset.tab; renderList(); });
  list.addEventListener('change', e => { const c = e.target; if (!c.dataset.name) return; c.checked ? selected.add(c.dataset.name) : selected.delete(c.dataset.name); renderTabs(); renderSum(); });

  function timing() {
    const its = [...selected].map(n => ITEMS[n]);
    const seq = its.reduce((a, x) => a + x.m, 0);
    const groups = {}; its.forEach(x => { groups[x.g] = (groups[x.g] || 0) + x.m; });
    const parallelGroups = ['hands', 'hair', 'face'].filter(g => groups[g]);
    const canPar = parallelGroups.length >= 2;
    const par = Math.max(0, ...parallelGroups.map(g => groups[g])) + (groups.body || 0);
    const usePar = canPar && $('#parToggle').checked;
    return { seq, par, canPar, usePar, total: its.reduce((a, x) => a + x.p, 0), time: usePar ? par : seq };
  }

  const DOW = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const mskToday = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
  const days = Array.from({ length: 7 }, (_, i) => { const d = mskToday(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; });
  const SLOTS = []; for (let m = OPEN; m <= CLOSE - 60; m += 60) SLOTS.push(m);
  const fmt = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const busy = (d, m) => { const x = Math.sin(d.getDate() * 61 + d.getMonth() * 11 + m * 5.13) * 10000; return (x - Math.floor(x)) < 0.36; };

  $('#days').innerHTML = days.map((d, i) => `<button type="button" class="day" data-day="${i}"><small>${i === 0 ? 'сег' : DOW[d.getDay()]}</small><b>${d.getDate()}</b></button>`).join('');
  function renderSlots() {
    $$('.day').forEach(b => b.classList.toggle('is-on', +b.dataset.day === activeDay));
    const d = days[activeDay], now = mskNow();
    $('#slots').innerHTML = SLOTS.map(m => {
      const off = busy(d, m) || (activeDay === 0 && m <= now + 30);
      return `<button type="button" class="slot${activeSlot === m && !off ? ' is-on' : ''}" data-slot="${m}" ${off ? 'disabled aria-label="' + fmt(m) + ' занято"' : ''}>${fmt(m)}</button>`;
    }).join('');
  }
  $('#days').addEventListener('click', e => { const b = e.target.closest('.day'); if (!b) return; activeDay = +b.dataset.day; activeSlot = null; renderSlots(); renderSum(); });
  $('#slots').addEventListener('click', e => { const b = e.target.closest('.slot'); if (!b || b.disabled) return; activeSlot = +b.dataset.slot; renderSlots(); renderSum(); });
  if (SLOTS.every(m => busy(days[0], m) || m <= mskNow() + 30)) activeDay = 1;

  const whenText = () => activeSlot == null ? '—' : `${activeDay === 0 ? 'сегодня' : activeDay === 1 ? 'завтра' : DOW[days[activeDay].getDay()]}, ${days[activeDay].getDate()} ${MON[days[activeDay].getMonth()]}, ${fmt(activeSlot)}`;
  function renderSum() {
    const t = timing();
    $('#sumList').textContent = selected.size ? [...selected].join(', ') : 'ничего';
    $('#sumWhen').textContent = whenText();
    $('#sumTime').textContent = selected.size ? dur(t.time) + (t.usePar ? ' · одновременно' : '') : '—';
    $('#sumTotal').textContent = rub(t.total);
    $('#parBox').hidden = !t.canPar;
    if (t.canPar) $('#parText').textContent = $('#parToggle').checked
      ? `Два мастера работают одновременно: ${dur(t.par)} вместо ${dur(t.seq)}. Экономия — ${dur(t.seq - t.par)}.`
      : `По очереди займёт ${dur(t.seq)}. Включите, чтобы уложиться в ${dur(t.par)}.`;
    $('#bookErr').textContent = '';
  }
  $('#parToggle').addEventListener('change', renderSum);

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-book-cat]'); if (!a) return;
    const c = CATS.find(x => x.key === a.dataset.bookCat);
    activeTab = c.key;
    if (!c.items.some(([n]) => selected.has(n))) selected.add(c.items[0][0]);
    renderList(); renderSum();
  });

  const phone = $('[name="phone"]');
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    phone.value = '+7' + (p[0] ? ` (${p[0]}` : '') + (p[0].length === 3 ? ')' : '') + (p[1] ? ` ${p[1]}` : '') + (p[2] ? `-${p[2]}` : '') + (p[3] ? `-${p[3]}` : '');
  });

  $('#bookForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('[name="name"]').value.trim();
    const err = !selected.size ? 'Отметьте хотя бы одну услугу.' : activeSlot == null ? 'Выберите день и свободное время.' : !name ? 'Укажите имя.' : phone.value.replace(/\D/g, '').length < 11 ? 'Укажите телефон полностью.' : '';
    if (err) { $('#bookErr').textContent = err; return; }
    const t = timing();
    $('#doneText').textContent = `${name}, ждём вас ${whenText()} на Старопетровском проезде, 8. ${[...selected].join(', ')}. В салоне ${dur(t.time)}${t.usePar ? ', услуги одновременно' : ''}. Итого от ${rub(t.total)}. Администратор подтвердит запись.`;
    $('#bookForm').hidden = true; $('#done').hidden = false;
    $('#done').scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  });
  $('#doneBack').addEventListener('click', () => {
    $('#bookForm').reset(); selected.clear(); activeSlot = null;
    renderList(); renderSlots(); renderSum();
    $('#done').hidden = true; $('#bookForm').hidden = false;
  });

  renderList(); renderSlots(); renderSum();

  /* ---------- Анимации ---------- */
  const top = $('#top'), heroMedia = $('.hero__media'), heroIn = $('.hero__in');
  const steps = $$('.step'), shots = $$('.par__shot'), parLabel = $('[data-par-label]'), parOld = $('[data-par-old]');
  const screen = $('.par__screen'), dots = $$('.par__dots b');
  const SCENE = [['1 услуга', ''], ['2 услуги одновременно', 'вместо 2 ч 15 мин'], ['3 услуги одновременно', 'вместо 3 ч 15 мин']];
  let ticking = false, lastStep = -1;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    top.classList.toggle('is-solid', y > 30);
    if (!reduce && y < vh * 1.3) {
      const p = Math.min(y / vh, 1);
      heroMedia.style.transform = `translate3d(0,${p * 90}px,0) scale(${1 + p * 0.1})`;
      heroIn.style.transform = `translate3d(0,${-p * 60}px,0)`;
      heroIn.style.opacity = String(Math.max(0, 1 - p * 1.3));
    }
    let best = 0, dist = Infinity;
    steps.forEach((s, i) => { const r = s.getBoundingClientRect(), c = Math.abs(r.top + Math.min(r.height, vh) / 3 - vh / 2); if (c < dist) { dist = c; best = i; } });
    // прогресс сцены: от первого до последнего шага (0…1) и внутри текущего шага (0…1)
    const first = steps[0].getBoundingClientRect(), last = steps[steps.length - 1].getBoundingClientRect();
    const span = last.top - first.top || 1;
    const sp = Math.min(1, Math.max(0, (vh / 2 - first.top) / span));
    const cur = steps[best].getBoundingClientRect();
    const pp = Math.min(1, Math.max(0, (vh * 0.75 - cur.top) / (cur.height + vh * 0.25)));
    if (!reduce) { screen.style.setProperty('--sp', sp.toFixed(3)); screen.style.setProperty('--pp', pp.toFixed(3)); }
    if (best !== lastStep) {
      lastStep = best;
      steps.forEach((s, i) => s.classList.toggle('is-on', i === best));
      shots.forEach((s, i) => s.classList.toggle('is-on', i === best));
      dots.forEach((d, i) => d.classList.toggle('is-on', i <= best));
      parLabel.textContent = SCENE[best][0];
      parOld.textContent = SCENE[best][1]; parOld.hidden = !SCENE[best][1];
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  const els = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) els.forEach(el => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      const el = en.target;
      if (en.isIntersecting) { el.classList.add('is-in'); el.classList.remove('is-above'); }
      else { el.classList.remove('is-in'); el.classList.toggle('is-above', en.boundingClientRect.top < 0); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  }
})();
