/**
 * CronoEstudo – script.js
 * Funcionalidades: sidebar, submenu, cronograma semanal,
 * checkboxes interativos, barra de progresso dinâmica,
 * navegação de semanas.
 */

'use strict';

/* ══════════════════════════════════════════════════════
   1. LUCIDE ICONS INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide
  if (typeof lucide !== 'undefined') lucide.createIcons();

  initSidebar();
  initDisciplinasToggle();
  setActiveSidebarItem();
  initSidebarLinks();
  setActiveHeaderLink();
  initHeaderLinks();
  initProPlanLinks();
  initCalendarQuickActions();
  initFlashcardReview();
  renderSchedule();
  initCheckboxes();
});

function setActiveSidebarItem() {
  const currentFile = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const labelMap = {
    'index.html': 'Dashboard',
    '': 'Dashboard',
    'cronogramas.html': 'Cronogramas',
    'disciplinas.html': 'Disciplinas',
    'flashcards.html': 'Flashcards',
    'questoes.html': 'Questões',
    'desempenho.html': 'Desempenho',
    'anotacoes.html': 'Anotações',
    'suporte.html': 'Suporte',
  };

  const targetLabel = labelMap[currentFile];
  if (!targetLabel) return;

  document.querySelectorAll('.sidebar__item').forEach(item => {
    item.classList.remove('sidebar__item--active');
    const link = item.querySelector('.sidebar__link');
    if (link?.dataset.label === targetLabel) {
      item.classList.add('sidebar__item--active');
      if (item.classList.contains('sidebar__item--has-sub')) {
        item.classList.add('open');
      }
    }
  });
}

function setActiveHeaderLink() {
  const currentFile = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const labelMap = {
    'index.html': 'Início',
    '': 'Início',
    'cursos.html': 'Cursos',
    'calendario.html': 'Calendário',
    'comunidade.html': 'Comunidade',
  };

  const targetLabel = labelMap[currentFile];
  if (!targetLabel) return;

  document.querySelectorAll('.header__nav-link').forEach(link => {
    link.classList.toggle('header__nav-link--active', link.dataset.label === targetLabel);
  });
}

/* ══════════════════════════════════════════════════════
   2. SIDEBAR (mobile toggle)
══════════════════════════════════════════════════════ */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const hamburger= document.getElementById('hamburger');
  const closeBtn = document.getElementById('sidebarClose');
  const overlay  = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
}

/* ══════════════════════════════════════════════════════
   3. DISCIPLINAS SUBMENU TOGGLE
══════════════════════════════════════════════════════ */
function initDisciplinasToggle() {
  const toggle = document.getElementById('disciplinasToggle');
  if (!toggle) return;

  // Abre por padrão
  toggle.classList.add('open');

  toggle.querySelector('.sidebar__link--toggle')?.addEventListener('click', (e) => {
    const target = e.target;
    const clickedChevron = target.closest('.sidebar__chevron');
    if (!clickedChevron) return;

    e.preventDefault();
    toggle.classList.toggle('open');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
}

/* ══════════════════════════════════════════════════════
   4. SIDEBAR LINK ACTIVATION
══════════════════════════════════════════════════════ */
function initSidebarLinks() {
  const links = document.querySelectorAll('.sidebar__link:not(.sidebar__link--toggle)');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
      }
      document.querySelectorAll('.sidebar__item').forEach(i => i.classList.remove('sidebar__item--active'));
      link.closest('.sidebar__item')?.classList.add('sidebar__item--active');
    });
  });

  // Sub-links
  const subLinks = document.querySelectorAll('.sidebar__sublink');
  subLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.sidebar__subitem').forEach(i => i.classList.remove('sidebar__subitem--active'));
      link.closest('.sidebar__subitem')?.classList.add('sidebar__subitem--active');
    });
  });
}

/* ══════════════════════════════════════════════════════
   5. HEADER NAV ACTIVATION
══════════════════════════════════════════════════════ */
function initHeaderLinks() {
  const navLinks = document.querySelectorAll('.header__nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
      }
      navLinks.forEach(l => l.classList.remove('header__nav-link--active'));
      link.classList.add('header__nav-link--active');
    });
  });
}

function initProPlanLinks() {
  const planLinks = document.querySelectorAll('.sidebar__plan-item');
  planLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Plano Pro é pago. Consulte o suporte para mais informações.');
    });
  });
}

function initCalendarQuickActions() {
  const buttons = document.querySelectorAll('[data-event-type]');
  const container = document.getElementById('calendarEvents');
  if (!buttons.length || !container) return;

  const attachAll = () => {
    container.querySelectorAll('.calendar-event-card').forEach(attachCalendarDragHandlers);
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.eventType;
      const typeClass = {
        'Prova': 'prova',
        'Revisão': 'revisao',
        'Entrega': 'entrega'
      }[type] || type.toLowerCase().replace(/[^a-z0-9]+/g, '');

      const card = document.createElement('article');
      card.className = 'calendar-event-card';
      card.draggable = true;
      card.innerHTML = `
        <button type="button" class="calendar-event__delete" aria-label="Excluir evento"><i data-lucide="trash-2"></i></button>
        <div class="calendar-event__handle"><i data-lucide="move"></i></div>
        <div class="calendar-event__tag calendar-event__tag--${typeClass}">${type}</div>
        <div class="summary-card__header"><span class="summary-card__label">${type} rápida</span></div>
        <p class="summary-card__sub">Evento visual criado para organizar sua semana com mais clareza.</p>
      `;
      container.appendChild(card);
      attachCalendarDragHandlers(card);
      attachCalendarDeleteHandler(card);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  container.addEventListener('dragover', (event) => {
    event.preventDefault();
    const draggingCard = container.querySelector('.dragging');
    const afterElement = getDragAfterElement(container, event.clientY);
    if (!draggingCard) return;
    if (afterElement == null) {
      container.appendChild(draggingCard);
    } else {
      container.insertBefore(draggingCard, afterElement);
    }
  });

  attachAll();
}

function attachCalendarDragHandlers(card) {
  if (!card) return;
  card.addEventListener('dragstart', (event) => {
    card.classList.add('dragging');
    event.dataTransfer?.setData('text/plain', 'drag');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });
  attachCalendarDeleteHandler(card);
}

function attachCalendarDeleteHandler(card) {
  if (!card) return;
  const deleteButton = card.querySelector('.calendar-event__delete');
  if (!deleteButton) return;

  deleteButton.addEventListener('click', () => {
    card.remove();
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.calendar-event-card:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function initFlashcardReview() {
  const cards = document.querySelectorAll('.review-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('review-card--done');
      if (card.classList.contains('review-card--done')) {
        card.style.opacity = '0.8';
      } else {
        card.style.opacity = '1';
      }
    });
  });
}

/* ══════════════════════════════════════════════════════
   6. SCHEDULE – DADOS E RENDERIZAÇÃO
══════════════════════════════════════════════════════ */

/** Dados da semana – cada dia tem um array de blocos */
const WEEK_DATA = [
  {
    day: 'SEG', num: 7, isToday: false,
    blocks: [
      { time: '08:00', title: 'Matemática', sub: 'Álgebra',      color: 'blue' },
      { time: '10:00', title: 'História',   sub: 'Brasil Império', color: 'blue-dark' },
      { time: '14:00', title: 'Revisão',    sub: 'Redação',       color: 'slate' },
      { time: '17:30', title: 'Exercícios', sub: '',              color: 'teal' },
    ]
  },
  {
    day: 'TER', num: 8, isToday: false,
    blocks: [
      { time: '08:00', title: 'Matemática', sub: 'Álgebra',         color: 'blue' },
      { time: '10:00', title: 'História',   sub: 'Brasil Império',   color: 'blue-dark' },
      { time: '14:00', title: 'Revisão',    sub: 'Redação',          color: 'slate' },
      { time: '17:30', title: 'Exercícios', sub: 'Genética',         color: 'teal' },
    ]
  },
  {
    day: 'QUA', num: 9, isToday: false,
    blocks: [
      { time: '08:00', title: 'Matemática', sub: 'Álgebra',       color: 'blue' },
      { time: '10:00', title: 'História',   sub: 'Brasil Império', color: 'blue-dark' },
      { time: '14:00', title: 'Revisão',    sub: 'Redação',        color: 'slate' },
      { time: '17:30', title: 'Exercícios', sub: '',               color: 'teal' },
    ]
  },
  {
    day: 'QUI', num: 10, isToday: true,
    blocks: [
      {
        time: '08:00', title: 'Matemática', sub: 'Álgebra', color: 'blue',
        completed: ['Completada', 'Completada', 'Completada']
      },
      { time: '15:00', title: 'Biologia',   sub: 'Genética',   color: 'indigo' },
      { time: '17:30', title: 'Exercícios', sub: '',            color: 'teal', hasAdd: true },
    ]
  },
  {
    day: 'SEX', num: 11, isToday: false,
    blocks: [
      { time: '08:00', title: 'Matemática', sub: 'Álgebra',  color: 'blue' },
      { time: '15:00', title: 'Biologia',   sub: 'Genética', color: 'indigo' },
      { time: '17:30', title: 'Exercícios', sub: '',          color: 'teal', hasAdd: true },
    ]
  },
  {
    day: 'SÁB', num: 12, isToday: false,
    blocks: []
  },
  {
    day: 'DOM', num: 13, isToday: false,
    blocks: []
  },
];

/** Controle de semana atual */
let weekOffset = 0;

/**
 * Renderiza o cronograma na grade
 */
function renderSchedule() {
  const grid = document.getElementById('scheduleGrid');
  if (!grid) return;

  grid.innerHTML = '';

  WEEK_DATA.forEach(day => {
    const col = document.createElement('div');
    col.className = `day-col${day.isToday ? ' day-col--today' : ''}`;

    // Header do dia
    col.innerHTML = `
      <div class="day-col__header">
        <span class="day-col__name">${day.day}</span>
        <span class="day-col__num">${day.num + weekOffset}</span>
      </div>
    `;

    // Blocos
    if (day.blocks.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center;color:var(--gray-300);font-size:.75rem;padding:16px 4px;';
      empty.textContent = '—';
      col.appendChild(empty);
    }

    day.blocks.forEach(block => {
      const el = document.createElement('div');
      el.className = `block block--${block.color}`;
      el.title = `${block.time} · ${block.title}${block.sub ? ': ' + block.sub : ''}`;

      let inner = `
        <span class="block__time">${block.time}</span>
        <span class="block__title">${block.title}</span>
        ${block.sub ? `<span class="block__sub">${block.sub}</span>` : ''}
      `;

      // Itens completados (hoje)
      if (block.completed) {
        const iconOk   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        const iconPend = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`;

        const checkItems = block.completed.map((label, i) => {
          const done = label === 'Completada';
          return `
            <div class="block__check-item${done ? ' block__check-item--done' : ''}">
              ${done ? iconOk : iconPend}
              <span>${label}</span>
            </div>
          `;
        }).join('');

        inner += `<div class="block__check-list">${checkItems}</div>`;
      }

      // Botão de adicionar
      if (block.hasAdd) {
        inner += `<span style="position:absolute;top:6px;right:6px;font-size:1.1rem;font-weight:700;opacity:.7;">+</span>`;
        el.style.position = 'relative';
      }

      el.innerHTML = inner;
      col.appendChild(el);
    });

    grid.appendChild(col);
  });

  // Re-inicializa ícones se necessário
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* Navegação entre semanas */
document.getElementById('prevWeek')?.addEventListener('click', () => {
  weekOffset -= 7;
  updateWeekRange();
  renderSchedule();
});
document.getElementById('nextWeek')?.addEventListener('click', () => {
  weekOffset += 7;
  updateWeekRange();
  renderSchedule();
});

function updateWeekRange() {
  const el = document.getElementById('weekRange');
  if (!el) return;
  const baseStart = 7 + weekOffset;
  const baseEnd   = 13 + weekOffset;
  el.textContent  = `Março ${baseStart}–${baseEnd}`;
}

/* ══════════════════════════════════════════════════════
   7. CHECKBOXES INTERATIVOS (Atividades de hoje)
══════════════════════════════════════════════════════ */
function initCheckboxes() {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;

  function updateProgress() {
    const all     = taskList.querySelectorAll('.task-list__check');
    const done    = taskList.querySelectorAll('.task-list__check:checked');
    const total   = all.length;
    const checked = done.length;
    const pct     = total > 0 ? Math.round((checked / total) * 100) : 0;

    const progressText = document.getElementById('taskProgress');
    const progressFill = document.getElementById('taskProgressFill');

    if (progressText) progressText.textContent = `${checked} de ${total} concluídas`;
    if (progressFill) progressFill.style.width = `${pct}%`;
  }

  taskList.addEventListener('change', (e) => {
    if (!e.target.classList.contains('task-list__check')) return;

    const item = e.target.closest('.task-list__item');
    if (!item) return;

    if (e.target.checked) {
      item.classList.add('task-list__item--done');
    } else {
      item.classList.remove('task-list__item--done');
    }

    updateProgress();
  });

  // Inicializa progresso
  updateProgress();
}

/* ══════════════════════════════════════════════════════
   8. PROGRESS BAR ANIMADA (Meta diária)
══════════════════════════════════════════════════════ */
(function animateMainProgress() {
  const fill = document.getElementById('progressFill');
  const pct  = document.getElementById('progressPct');
  if (!fill || !pct) return;

  // Simula incremento gradual
  let current = 0;
  const target = 70;
  const step = () => {
    if (current < target) {
      current = Math.min(current + 1, target);
      fill.style.width = `${current}%`;
      pct.textContent  = `${current}%`;
      requestAnimationFrame(step);
    }
  };

  // Aguarda um frame para garantir renderização
  setTimeout(() => requestAnimationFrame(step), 300);
})();

/* ══════════════════════════════════════════════════════
   9. TOOLTIP NO BLOCO (hover extra info)
══════════════════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  const block = e.target.closest('.block');
  if (!block) return;

  // Feedback visual ao clicar
  block.style.transition = 'transform .1s';
  block.style.transform = 'scale(.97)';
  setTimeout(() => {
    block.style.transform = '';
  }, 120);
});
