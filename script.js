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
  initQuestionSystem();
  initPerformanceDashboard();
  initDisciplinesPageEnhancements();
  initNotesSystem();
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

const performanceStorageKey = 'cronoQuestPerformance';
const QUESTIONS = [
  {
    enunciado: 'Em uma prova do ENEM, uma aluna resolve a equação 2x + 3 = 11. Qual é o valor de x?',
    alternativas: {
      A: '2',
      B: '3',
      C: '4',
      D: '5',
      E: '6'
    },
    correta: 'C',
    explicacao: 'Resolvendo 2x + 3 = 11 temos 2x = 8, portanto x = 4.',
    disciplina: 'Matemática'
  },
  {
    enunciado: 'Qual foi uma das principais causas da Independência do Brasil em 1822?',
    alternativas: {
      A: 'A Revolução Industrial na Inglaterra.',
      B: 'A cobrança de altos impostos pelo Reino Unido da França.',
      C: 'A insatisfação com as políticas de exploração e controle econômico de Portugal.',
      D: 'A influência política dos Estados Unidos.',
      E: 'A expansão do comunismo na América do Sul.'
    },
    correta: 'C',
    explicacao: 'A Independência do Brasil está ligada à insatisfação com as políticas econômicas e o controle político de Portugal.',
    disciplina: 'História'
  },
  {
    enunciado: 'Qual é a função principal do DNA em uma célula?',
    alternativas: {
      A: 'Produzir energia para a célula.',
      B: 'Transportar oxigênio pelo organismo.',
      C: 'Armazenar e transmitir a informação genética.',
      D: 'Eliminar substâncias tóxicas.',
      E: 'Regular a temperatura corporal.'
    },
    correta: 'C',
    explicacao: 'O DNA contém o código genético responsável por armazenar e transmitir informação hereditária.',
    disciplina: 'Biologia'
  },
  {
    enunciado: 'Em uma reação de oxirredução, o que ocorre?',
    alternativas: {
      A: 'Apenas liberação de calor.',
      B: 'Perda de elétrons por uma substância e ganho por outra.',
      C: 'Formação de ligações iônicas apenas.',
      D: 'Transformação de um ácido em uma base.',
      E: 'Apenas mudança de fase.'
    },
    correta: 'B',
    explicacao: 'Oxirredução envolve transferência de elétrons: uma substância oxida-se e outra reduz-se.',
    disciplina: 'Química'
  },
  {
    enunciado: 'Qual é a solução para a inequação x² - 5x + 6 < 0?',
    alternativas: {
      A: 'x < 2 ou x > 3',
      B: '2 < x < 3',
      C: 'x < 3',
      D: 'x > 2',
      E: 'x = 2 ou x = 3'
    },
    correta: 'B',
    explicacao: 'Fatorando: (x-2)(x-3) < 0. O produto é negativo quando os fatores têm sinais opostos, logo 2 < x < 3.',
    disciplina: 'Matemática'
  },
  {
    enunciado: 'Se um produto custa R$ 100,00 e sofre um aumento de 20%, qual será o novo preço?',
    alternativas: {
      A: 'R$ 80,00',
      B: 'R$ 100,00',
      C: 'R$ 120,00',
      D: 'R$ 140,00',
      E: 'R$ 150,00'
    },
    correta: 'C',
    explicacao: 'Aumento de 20% sobre R$ 100 = 100 + (100 × 0,20) = 100 + 20 = R$ 120,00',
    disciplina: 'Matemática'
  },
  {
    enunciado: 'Qual é a área de um círculo com raio de 5 cm?',
    alternativas: {
      A: '10π cm²',
      B: '15π cm²',
      C: '25π cm²',
      D: '50π cm²',
      E: '100π cm²'
    },
    correta: 'C',
    explicacao: 'A área de um círculo é A = πr². Com r = 5, temos A = π(5)² = 25π cm².',
    disciplina: 'Matemática'
  },
  {
    enunciado: 'Em uma progressão aritmética, o primeiro termo é 3 e a razão é 5. Qual é o 10º termo?',
    alternativas: {
      A: '40',
      B: '48',
      C: '50',
      D: '52',
      E: '55'
    },
    correta: 'B',
    explicacao: 'usando an = a1 + (n-1)r. a10 = 3 + (10-1)×5 = 3 + 45 = 48',
    disciplina: 'Matemática'
  },
  {
    enunciado: 'Uma empresa produz 1.000 unidades por dia. Quantas unidades são produzidas em um mês de 30 dias?',
    alternativas: {
      A: '10.000',
      B: '20.000',
      C: '30.000',
      D: '40.000',
      E: '50.000'
    },
    correta: 'C',
    explicacao: '1.000 unidades/dia × 30 dias = 30.000 unidades',
    disciplina: 'Matemática'
  },
  {
    enunciado: 'Qual imperador assinou a Lei Áurea em 13 de maio de 1888?',
    alternativas: {
      A: 'Dom Pedro I',
      B: 'Dom Pedro II',
      C: 'Dom João VI',
      D: 'Getúlio Vargas',
      E: 'Tiradentes'
    },
    correta: 'B',
    explicacao: 'Dom Pedro II assinou a Lei Áurea que aboliu a escravidão no Brasil em 1888.',
    disciplina: 'História'
  },
  {
    enunciado: 'Qual período ficou conhecido como Revolução Francesa?',
    alternativas: {
      A: '1656-1660',
      B: '1689-1697',
      C: '1789-1799',
      D: '1820-1835',
      E: '1860-1880'
    },
    correta: 'C',
    explicacao: 'A Revolução Francesa ocorreu entre 1789 e 1799, marcando transformações políticas e sociais na Europa.',
    disciplina: 'História'
  },
  {
    enunciado: 'Qual foi a consequência imediata do acidente de Chernobyl em 1986?',
    alternativas: {
      A: 'Aumento da produção de energia nuclear globalmente.',
      B: 'Evacuação de cidades e contaminação radioativa em larga escala.',
      C: 'Desenvolvimento de novas tecnologias nucleares.',
      D: 'Reforço da indústria de carvão na Europa.',
      E: 'Criação da União Europeia.'
    },
    correta: 'B',
    explicacao: 'O acidente de Chernobyl causou evacuação de cidades como Pripyat e contaminação radioativa que afetou vários países.',
    disciplina: 'História'
  },
  {
    enunciado: 'Qual das seguintes é uma característica da Idade Média europeia?',
    alternativas: {
      A: 'Centralização do poder nas mãos do rei.',
      B: 'Sistema feudal com vassalagem e servidão.',
      C: 'Desenvolvimento de democracias atenienses.',
      D: 'Expansão do Império Romano.',
      E: 'Industrialização em larga escala.'
    },
    correta: 'B',
    explicacao: 'A Idade Média foi caracterizada pelo sistema feudal, com relações de vassalagem e servidão entre senhores e camponeses.',
    disciplina: 'História'
  },
  {
    enunciado: 'O processo de respiração celular ocorre principalmente onde?',
    alternativas: {
      A: 'No ribossomo',
      B: 'Na mitocôndria',
      C: 'No núcleo',
      D: 'Na membrana celular',
      E: 'No retículo endoplasmático'
    },
    correta: 'B',
    explicacao: 'A respiração celular, especialmente a fosforilação oxidativa, ocorre nas mitocôndrias.',
    disciplina: 'Biologia'
  },
  {
    enunciado: 'Qual é o nome do processo em que plantas convertem luz solar em energia química?',
    alternativas: {
      A: 'Respiração',
      B: 'Fermentação',
      C: 'Fotossíntese',
      D: 'Osmose',
      E: 'Difusão'
    },
    correta: 'C',
    explicacao: 'A fotossíntese é o processo em que as plantas usam luz solar, água e dióxido de carbono para produzir glicose e oxigênio.',
    disciplina: 'Biologia'
  },
  {
    enunciado: 'Quantos pares de cromossomos os humanos têm?',
    alternativas: {
      A: '10',
      B: '19',
      C: '23',
      D: '46',
      E: '50'
    },
    correta: 'C',
    explicacao: 'Os humanos têm 23 pares de cromossomos (46 no total) - 22 pares de autossomos e 1 par de cromossomos sexuais.',
    disciplina: 'Biologia'
  },
  {
    enunciado: 'Qual é o órgão responsável pela filtragem do sangue no corpo humano?',
    alternativas: {
      A: 'Coração',
      B: 'Pulmão',
      C: 'Rim',
      D: 'Fígado',
      E: 'Pâncreas'
    },
    correta: 'C',
    explicacao: 'Os rins são responsáveis pela filtragem do sangue, removendo resíduos e formando a urina.',
    disciplina: 'Biologia'
  },
  {
    enunciado: 'Qual é o pH de uma solução neutra?',
    alternativas: {
      A: '0',
      B: '5',
      C: '7',
      D: '10',
      E: '14'
    },
    correta: 'C',
    explicacao: 'Uma solução neutra tem pH 7, onde [H+] = [OH-] = 10^-7 mol/L.',
    disciplina: 'Química'
  },
  {
    enunciado: 'Quantas moléculas de água têm massa total de 36 gramas? (Massa molar da água = 18 g/mol)',
    alternativas: {
      A: '6,02 × 10²²',
      B: '1,20 × 10²⁴',
      C: '2,4 × 10²⁴',
      D: '3,6 × 10²³',
      E: '7,2 × 10²³'
    },
    correta: 'B',
    explicacao: '36g ÷ 18 g/mol = 2 mol. 2 mol × 6,02×10²³ = 1,20×10²⁴ moléculas.',
    disciplina: 'Química'
  },
  {
    enunciado: 'Qual tipo de ligação química mantém os átomos de uma molécula de H₂ unidos?',
    alternativas: {
      A: 'Ligação iônica',
      B: 'Ligação covalente',
      C: 'Ligação metálica',
      D: 'Ligação de hidrogênio',
      E: 'Força de Van der Waals'
    },
    correta: 'B',
    explicacao: 'A molécula H₂ é mantida unida por uma ligação covalente, onde os dois átomos de hidrogênio compartilham um par de elétrons.',
    disciplina: 'Química'
  },
  {
    enunciado: 'Em qual temperatura a água muda de estado de líquido para gasoso (pressão atmosférica normal)?',
    alternativas: {
      A: '0°C',
      B: '50°C',
      C: '100°C',
      D: '150°C',
      E: '200°C'
    },
    correta: 'C',
    explicacao: 'A água ferve a 100°C em pressão atmosférica normal (1 atm).',
    disciplina: 'Química'
  },
  {
    enunciado: 'Qual é uma estratégia eficaz para elaborar a introdução de uma redação?',
    alternativas: {
      A: 'Contar uma história muito longa sobre sua vida.',
      B: 'Apresentar o tema de forma clara e relevante, indicando os pontos a serem discutidos.',
      C: 'Usar apenas perguntas retóricas.',
      D: 'Copiar trechos de textos famosos.',
      E: 'Escrever de forma poética e confusa.'
    },
    correta: 'B',
    explicacao: 'Uma boa introdução apresenta o tema de forma clara, relevante e indica o caminho da argumentação.',
    disciplina: 'Redação'
  },
  {
    enunciado: 'Qual desses elementos não é recomendado em uma redação argumentativa?',
    alternativas: {
      A: 'Argumentos com dados e evidências.',
      B: 'Citações de especialistas ou pesquisas.',
      C: 'Opinião pessoal sem fundamentação.',
      D: 'Análise crítica do tema.',
      E: 'Estrutura clara com introdução, desenvolvimento e conclusão.'
    },
    correta: 'C',
    explicacao: 'Opiniões sem fundamentação enfraquecem a argumentação. É essencial usar evidências e dados.',
    disciplina: 'Redação'
  },
  {
    enunciado: 'Qual é a função das coesões em um texto?',
    alternativas: {
      A: 'Aumentar o número de palavras.',
      B: 'Conectar ideias e estabelecer relações lógicas entre as partes do texto.',
      C: 'Substituir o uso de pontuação.',
      D: 'Tornar o texto mais difícil de entender.',
      E: 'Eliminar a necessidade de coerência.'
    },
    correta: 'B',
    explicacao: 'As coesões conectam ideias através de palavras e expressões, garantindo fluidez e clareza no texto.',
    disciplina: 'Redação'
  },
  {
    enunciado: 'Qual conceito é fundamental para manter a qualidade de uma redação do ENEM?',
    alternativas: {
      A: 'Usar palavras raras e complicadas.',
      B: 'Coerência entre as ideias apresentadas.',
      C: 'Escrever sem estrutura para parecer criativo.',
      D: 'Repetir a mesma informação várias vezes.',
      E: 'Ignorar o tema proposto.'
    },
    correta: 'B',
    explicacao: 'A coerência garante que as ideias façam sentido lógico e estejam bem conectadas ao tema.',
    disciplina: 'Redação'
  },
  {
    enunciado: 'Qual é a velocidade da luz no vácuo?',
    alternativas: {
      A: '3 × 10⁶ m/s',
      B: '3 × 10⁷ m/s',
      C: '3 × 10⁸ m/s',
      D: '3 × 10⁹ m/s',
      E: '3 × 10¹⁰ m/s'
    },
    correta: 'C',
    explicacao: 'A velocidade da luz no vácuo é aproximadamente 3 × 10⁸ m/s ou 300.000 km/s.',
    disciplina: 'Física'
  },
  {
    enunciado: 'A Segunda Lei de Newton estabelece que:',
    alternativas: {
      A: 'Para toda ação há uma reação igual e oposta.',
      B: 'A força é igual à massa multiplicada pela aceleração (F = ma).',
      C: 'A aceleração é inversamente proporcional ao tempo.',
      D: 'Todo objeto em repouso permanece em repouso infinitamente.',
      E: 'A energia não pode ser criada nem destruída, mas transformada.'
    },
    correta: 'B',
    explicacao: 'A Segunda Lei de Newton (F = ma) relaciona força, massa e aceleração.',
    disciplina: 'Física'
  },
  {
    enunciado: 'Qual é a unidade de medida da energia no Sistema Internacional?',
    alternativas: {
      A: 'Newton (N)',
      B: 'Watt (W)',
      C: 'Joule (J)',
      D: 'Pascal (Pa)',
      E: 'Hertz (Hz)'
    },
    correta: 'C',
    explicacao: 'O Joule (J) é a unidade de energia no SI, equivalente a 1 N·m.',
    disciplina: 'Física'
  },
  {
    enunciado: 'Um objeto com massa de 10 kg é acelerado a 5 m/s². Qual é a força aplicada?',
    alternativas: {
      A: '15 N',
      B: '30 N',
      C: '50 N',
      D: '75 N',
      E: '100 N'
    },
    correta: 'C',
    explicacao: 'Usando F = ma, temos F = 10 kg × 5 m/s² = 50 N.',
    disciplina: 'Física'
  },
  {
    enunciado: 'Qual tipo de espelho produz uma imagem sempre virtual, direita e menor?',
    alternativas: {
      A: 'Espelho plano',
      B: 'Espelho côncavo',
      C: 'Espelho convexo',
      D: 'Espelho parabólico',
      E: 'Espelho cilíndrico'
    },
    correta: 'C',
    explicacao: 'O espelho convexo (divergente) sempre produz imagens virtuais, direitas e menores que o objeto.',
    disciplina: 'Física'
  },
  {
    enunciado: 'What is the correct form of the verb "to be" in the sentence: "She ___ a teacher."?',
    alternativas: {
      A: 'are',
      B: 'am',
      C: 'is',
      D: 'be',
      E: 'been'
    },
    correta: 'C',
    explicacao: 'Com o sujeito "she" (ela), usamos "is" como forma presente do verbo "to be".',
    disciplina: 'Inglês'
  },
  {
    enunciado: 'Which sentence is grammatically correct in English?',
    alternativas: {
      A: 'He go to school every day.',
      B: 'He goes to school every day.',
      C: 'He is go to school every day.',
      D: 'He going to school every day.',
      E: 'He gone to school every day.'
    },
    correta: 'B',
    explicacao: 'Com sujeito singular "he", o verbo "go" deve ser conjugado como "goes" no presente simples.',
    disciplina: 'Inglês'
  },
  {
    enunciado: 'What is the past tense of "eat"?',
    alternativas: {
      A: 'eats',
      B: 'ate',
      C: 'eaten',
      D: 'eating',
      E: 'eatted'
    },
    correta: 'B',
    explicacao: '"Ate" é o passado simples do verbo irregular "eat". "Eaten" é o particípio passado.',
    disciplina: 'Inglês'
  },
  {
    enunciado: 'Choose the correct form: "If I _____ rich, I would travel around the world."',
    alternativas: {
      A: 'am',
      B: 'was',
      C: 'were',
      D: 'had been',
      E: 'would be'
    },
    correta: 'C',
    explicacao: 'Em contrafatos (second conditional), usamos "were" com "I" mesmo que seja não-padrão: "If I were..."',
    disciplina: 'Inglês'
  },
  {
    enunciado: 'Qual é a principal características da Filosofia Existencialista?',
    alternativas: {
      A: 'A existência precede a essência.',
      B: 'O ser humano é um produto das circunstâncias.',
      C: 'A razão é a única fonte de conhecimento.',
      D: 'A felicidade é o maior bem.',
      E: 'Deus é a origem de tudo.'
    },
    correta: 'A',
    explicacao: 'Na filosofia existencialista, especialmente em Sartre, a existência precede a essência - somos livres para criar nosso próprio significado.',
    disciplina: 'Filosofia'
  },
  {
    enunciado: 'Qual filósofo propôs a ideia da "Caverna" como metáfora do conhecimento?',
    alternativas: {
      A: 'Aristóteles',
      B: 'Platão',
      C: 'Sócrates',
      D: 'Descartes',
      E: 'Kant'
    },
    correta: 'B',
    explicacao: 'Platão descreveu a "Alegoria da Caverna" em sua obra "A República", ilustrando etapas do conhecimento e da libertação da ignorância.',
    disciplina: 'Filosofia'
  },
  {
    enunciado: 'O que é a ética de acordo com a filosofia?',
    alternativas: {
      A: 'O estudo das leis jurídicas.',
      B: 'O estudo dos valores morais e do que é correto e incorreto.',
      C: 'O estudo da política.',
      D: 'O estudo da história.',
      E: 'O estudo das artes.'
    },
    correta: 'B',
    explicacao: 'A ética é o ramo da filosofia que estuda valores morais e princípios que guiam comportamentos humanos.',
    disciplina: 'Filosofia'
  },
  {
    enunciado: 'Qual é o conceito-chave do "Dualismo Cartesiano" de Descartes?',
    alternativas: {
      A: 'Existe apenas a matéria.',
      B: 'Existe apenas o espírito.',
      C: 'Existem duas substâncias: mente e corpo.',
      D: 'Tudo é conhecimento.',
      E: 'Não existe realidade além dos sentidos.'
    },
    correta: 'C',
    explicacao: 'Descartes propôs que existem duas substâncias distintas: res cogitans (mente/pensamento) e res extensa (corpo/matéria).',
    disciplina: 'Filosofia'
  },
  {
    enunciado: 'O que é Sociologia?',
    alternativas: {
      A: 'O estudo da anatomia do corpo humano.',
      B: 'O estudo científico do comportamento humano em grupos e sociedade.',
      C: 'O estudo da história política.',
      D: 'O estudo exclusivo da economia.',
      E: 'O estudo das personalidades individuais.'
    },
    correta: 'B',
    explicacao: 'Sociologia é a ciência que estuda as estruturas sociais, instituições e comportamentos humanos em sociedade.',
    disciplina: 'Sociologia'
  },
  {
    enunciado: 'Qual pensador é considerado um dos fundadores da Sociologia moderna?',
    alternativas: {
      A: 'Karl Marx',
      B: 'Immanuel Kant',
      C: 'Auguste Comte',
      D: 'Adam Smith',
      E: 'Thomas Hobbes'
    },
    correta: 'C',
    explicacao: 'Auguste Comte é considerado o fundador da sociologia, tendo cunhado o termo e desenvolvido o "positivismo" como abordagem.',
    disciplina: 'Sociologia'
  },
  {
    enunciado: 'Na sociologia, qual conceito refere-se à posição social de uma pessoa?',
    alternativas: {
      A: 'Papel social',
      B: 'Status',
      C: 'Norma social',
      D: 'Instituição',
      E: 'Estratificação'
    },
    correta: 'B',
    explicacao: 'Status refere-se à posição ou prestígio de uma pessoa na hierarquia social.',
    disciplina: 'Sociologia'
  },
  {
    enunciado: 'O que é um "papel social" em sociologia?',
    alternativas: {
      A: 'Uma profissão remunerada.',
      B: 'Um conjunto de comportamentos e responsabilidades esperados de alguém em uma posição específica.',
      C: 'Uma lei estabelecida pelo governo.',
      D: 'Uma característica física imutável.',
      E: 'Uma crença religiosa.'
    },
    correta: 'B',
    explicacao: 'O papel social é um conjunto de expectativas comportamentais associadas a uma posição social que um indivíduo ocupa.',
    disciplina: 'Sociologia'
  },
  {
    enunciado: 'Qual é a diferença entre orações "[Subordinadas Adjetivas Restritivas" e "Subordinadas Adjetivas Explicativas"?',
    alternativas: {
      A: 'As restritivas restringem o sentido do nome e não têm pausa; as explicativas adicionam informação e têm pausa.',
      B: 'Não há diferença entre elas.',
      C: 'As explicativas modificam o verbo; as restritivas modificam o nome.',
      D: 'As restritivas vêm sempre no final do período.',
      E: 'As explicativas nunca usam pronomes relativos.'
    },
    correta: 'A',
    explicacao: 'Restritivas restringem/definem (sem pausa na fala, sem vírgula na escrita). Explicativas adicionam informação (com pausa e vírgula).',
    disciplina: 'Gramática'
  },
  {
    enunciado: 'Qual termo identifica a palavra que recebe a ação do verbo?',
    alternativas: {
      A: 'Sujeito',
      B: 'Objeto Direto',
      C: 'Predicado',
      D: 'Complemento Nominal',
      E: 'Adjunto Adverbial'
    },
    correta: 'B',
    explicacao: 'O objeto direto é o termo que recebe a ação do verbo transitivo direto sem preposição.',
    disciplina: 'Gramática'
  },
  {
    enunciado: 'Qual é a classificação da palavra "rápido" nesta frase: "Ele corria rápido"?',
    alternativas: {
      A: 'Adjetivo',
      B: 'Advérbio',
      C: 'Substantivo',
      D: 'Verbo',
      E: 'Preposição'
    },
    correta: 'B',
    explicacao: 'Nesta frase, "rápido" modifica o verbo "corria", exercendo função de advérbio de modo.',
    disciplina: 'Gramática'
  },
  {
    enunciado: 'Qual é a estrutura correta de uma oração com vírgula em uma enumeração?',
    alternativas: {
      A: 'Elementos separados por ponto.',
      B: 'Elementos separados por vírgula, e o último introduzido por "e".',
      C: 'Todos os elementos separados por "e".',
      D: 'Elementos sem separação clara.',
      E: 'Apenas dois elementos unidos por vírgula.'
    },
    correta: 'B',
    explicacao: 'Na enumeração, elementos são separados por vírgula, e o último geralmente vem precedido de "e" (série enumerativa).',
    disciplina: 'Gramática'
  },
  {
    enunciado: 'Qual é o antônimo de "verboso"?',
    alternativas: {
      A: 'Prolixo',
      B: 'Conciso',
      C: 'Redundante',
      D: 'Loquaz',
      E: 'Eloquente'
    },
    correta: 'B',
    explicacao: '"Verboso" significa prolixo (muitas palavras); "conciso" é seu antônimo (poucas palavras, direto).',
    disciplina: 'Gramática'
  },
  {
    enunciado: 'Qual obra é considerada a primeira grande obra da literatura portuguesa?',
    alternativas: {
      A: 'Os Lusíadas',
      B: 'Mensagem',
      C: 'Cancioneiro da Ajuda',
      D: 'O Cortiço',
      E: 'Dom Casmurro'
    },
    correta: 'C',
    explicacao: 'O Cancioneiro da Ajuda é a mais antiga antologia de poesia trovadoresca portuguesa, do século XIII.',
    disciplina: 'Literatura'
  },
  {
    enunciado: 'Qual é o movimento literário ao qual Machado de Assis está associado?',
    alternativas: {
      A: 'Romantismo',
      B: 'Realismo/Naturalismo',
      C: 'Modernismo',
      D: 'Barroco',
      E: 'Arcadismo'
    },
    correta: 'B',
    explicacao: 'Machado de Assis é o principal expoente do Realismo na literatura brasileira do século XIX.',
    disciplina: 'Literatura'
  },
  {
    enunciado: 'Qual é a característica principal do Realismo literário?',
    alternativas: {
      A: 'Idealização de sentimentos e natureza.',
      B: 'Representação fiel da realidade social e cotidiana.',
      C: 'Busca pela beleza e pela perfeição da forma.',
      D: 'Exploração do fantástico e do oculto.',
      E: 'Retorno aos valores clássicos greco-romanos.'
    },
    correta: 'B',
    explicacao: 'O Realismo literário busca representar a realidade de forma objetiva, sem idealizações românticas.',
    disciplina: 'Literatura'
  },
  {
    enunciado: 'Qual poeta português é autor de "Mensagem"?',
    alternativas: {
      A: 'Luis de Camões',
      B: 'Fernando Pessoa',
      C: 'Cesário Verde',
      D: 'Antero de Quental',
      E: 'Eça de Queirós'
    },
    correta: 'B',
    explicacao: '"Mensagem" é uma obra poética de Fernando Pessoa que explora a identidade portuguesa e mística.',
    disciplina: 'Literatura'
  },
  {
    enunciado: 'Qual continente é o maior do mundo em extensão territorial?',
    alternativas: {
      A: 'África',
      B: 'América do Sul',
      C: 'Ásia',
      D: 'América do Norte',
      E: 'Oceania'
    },
    correta: 'C',
    explicacao: 'A Ásia é o maior continente com aproximadamente 44,6 milhões de km².',
    disciplina: 'Geografia'
  },
  {
    enunciado: 'Qual é a capital da Austrália?',
    alternativas: {
      A: 'Sydney',
      B: 'Melbourne',
      C: 'Canberra',
      D: 'Brisbane',
      E: 'Perth'
    },
    correta: 'C',
    explicacao: 'Canberra é a capital planejada da Austrália, construída em 1927 como um compromisso entre Sydney e Melbourne.',
    disciplina: 'Geografia'
  },
  {
    enunciado: 'Qual é o servidor mais comprido do Brasil?',
    alternativas: {
      A: 'Rio São Francisco',
      B: 'Rio Amazonas',
      C: 'Rio Paraná',
      D: 'Rio Tocantins',
      E: 'Rio Araguaia'
    },
    correta: 'B',
    explicacao: 'O Rio Amazonas é o servidor mais comprido do Brasil, com aproximadamente 6.992 km de extensão.',
    disciplina: 'Geografia'
  },
  {
    enunciado: 'Qual bioma brasileiro é conhecido como a "floresta tropical úmida"?',
    alternativas: {
      A: 'Cerrado',
      B: 'Caatinga',
      C: 'Amazônia',
      D: 'Pantanal',
      E: 'Pampa'
    },
    correta: 'C',
    explicacao: 'A Amazônia é a maior floresta tropical úmida do mundo, localizada no Brasil e em outros países da América do Sul.',
    disciplina: 'Geografia'
  }
];

let currentQuestionIndex = 0;
let currentDiscipline = '';
let currentQuestionSet = [];
let correctCount = 0;
let wrongCount = 0;
let quizFinished = false;
let questionAnswered = false;

function initQuestionSystem() {
  const disciplineSelection = document.getElementById('disciplineSelection');
  const questionPanel = document.getElementById('questionPanel');
  const backButton = document.getElementById('backButton');
  
  if (backButton) {
    backButton.addEventListener('click', () => {
      currentQuestionIndex = 0;
      correctCount = 0;
      wrongCount = 0;
      questionAnswered = false;
      quizFinished = false;
      updateScoreDisplay();
      disciplineSelection.style.display = 'block';
      questionPanel.style.display = 'none';
    });
  }

  renderDisciplineSelection();

  const nextButton = document.getElementById('nextQuestionButton');
  nextButton?.addEventListener('click', handleNextQuestion);
}

function renderDisciplineSelection() {
  const disciplineGrid = document.getElementById('disciplineGrid');
  if (!disciplineGrid) return;

  const disciplines = getAvailableDisciplines();
  const performanceData = getPerformanceData();

  disciplineGrid.innerHTML = disciplines.map((disciplina) => {
    const summary = performanceData[disciplina];
    const progress = summary ? summary.accuracy : 0;
    const remaining = 100 - progress;
    const status = progress === 0 ? 'Não iniciado' : 
                   progress < 50 ? 'Em progresso' : 
                   progress < 100 ? 'Quase pronto' : 
                   'Completado';

    return `
      <article class="summary-card">
        <div class="summary-card__header"><span class="summary-card__label">${disciplina}</span></div>
        <div class="summary-card__progress-wrap">
          <div class="summary-card__progress-bar"><div class="summary-card__progress-fill" style="width: ${progress}%;"></div></div>
          <span class="summary-card__progress-pct">${progress}%</span>
        </div>
        <p class="summary-card__sub">${status} · ${summary ? `${summary.correct} acertos` : 'Comece agora'}</p>
        <button type="button" class="summary-card__action-btn" data-discipline="${disciplina}">
          ${progress === 0 ? 'Começar' : 'Continuar'} <i data-lucide="arrow-right">→</i>
        </button>
      </article>
    `;
  }).join('');

  // Inicializa os ícones lucide
  if (typeof lucide !== 'undefined') lucide.createIcons();

  disciplineGrid.querySelectorAll('.summary-card__action-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentDiscipline = btn.dataset.discipline;
      correctCount = 0;
      wrongCount = 0;
      currentQuestionIndex = 0;
      updateScoreDisplay();
      renderQuestionSet();
      
      document.getElementById('disciplineSelection').style.display = 'none';
      document.getElementById('questionPanel').style.display = 'block';
    });
  });
}


function getAvailableDisciplines() {
  return [...new Set(QUESTIONS.map((question) => question.disciplina))];
}

function renderQuestionSet() {
  currentQuestionSet = QUESTIONS.filter((question) => question.disciplina === currentDiscipline);
  currentQuestionIndex = 0;
  renderQuestion();
}

function getPerformanceData() {
  try {
    return JSON.parse(localStorage.getItem(performanceStorageKey)) || {};
  } catch {
    return {};
  }
}

function savePerformanceData(discipline, correct, wrong, total) {
  const data = getPerformanceData();
  const existing = data[discipline] || { attempts: 0, correct: 0, wrong: 0, total: 0, accuracy: 0 };
  existing.attempts += 1;
  existing.correct += correct;
  existing.wrong += wrong;
  existing.total += total;
  existing.accuracy = existing.total > 0 ? Math.round((existing.correct / existing.total) * 100) : 0;
  existing.lastUpdated = new Date().toISOString();
  data[discipline] = existing;
  localStorage.setItem(performanceStorageKey, JSON.stringify(data));
}

function initPerformanceDashboard() {
  const overallAccuracyValue = document.getElementById('overallAccuracyValue');
  const totalAttemptsValue = document.getElementById('totalAttemptsValue');
  const totalCorrectValue = document.getElementById('totalCorrectValue');
  const totalWrongValue = document.getElementById('totalWrongValue');
  const performanceGrid = document.getElementById('performanceGrid');
  const performanceData = getPerformanceData();

  if (!overallAccuracyValue && !performanceGrid) return;

  let overallCorrect = 0;
  let overallTotal = 0;
  let overallWrong = 0;
  let overallAttempts = 0;

  Object.values(performanceData).forEach((summary) => {
    overallCorrect += summary.correct;
    overallWrong += summary.wrong;
    overallTotal += summary.total;
    overallAttempts += summary.attempts;
  });

  const accuracy = overallTotal > 0 ? Math.round((overallCorrect / overallTotal) * 100) : 0;

  if (overallAccuracyValue) overallAccuracyValue.textContent = `${accuracy}%`;
  if (totalAttemptsValue) totalAttemptsValue.textContent = `${overallAttempts}`;
  if (totalCorrectValue) totalCorrectValue.textContent = `${overallCorrect}`;
  if (totalWrongValue) totalWrongValue.textContent = `${overallWrong}`;

  if (performanceGrid) {
    const disciplines = Object.entries(performanceData);
    if (!disciplines.length) {
      performanceGrid.innerHTML = '<p class="performance-empty">Responda algumas questões para ver seu desempenho por disciplina aqui.</p>';
      return;
    }

    performanceGrid.innerHTML = disciplines.map(([discipline, summary]) => `
      <article class="performance-card">
        <div class="performance-card__header">
          <span class="performance-card__label">${discipline}</span>
          <span class="performance-card__score">${summary.accuracy}%</span>
        </div>
        <p class="performance-card__meta">Acertos ${summary.correct} • Erros ${summary.wrong}</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width:${summary.accuracy}%"></div>
        </div>
      </article>
    `).join('');
  }
}

function renderQuestion() {
  quizFinished = false;
  questionAnswered = false;

  const question = currentQuestionSet[currentQuestionIndex];
  const questionDiscipline = document.getElementById('questionDiscipline');
  const questionStatement = document.getElementById('questionStatement');
  const questionOptions = document.getElementById('questionOptions');
  const questionFeedback = document.getElementById('questionFeedback');
  const questionSummary = document.getElementById('questionSummary');
  const questionResult = document.getElementById('questionResult');
  const questionIndex = document.getElementById('questionIndex');
  const questionTotal = document.getElementById('questionTotal');
  const nextButton = document.getElementById('nextQuestionButton');

  if (!questionDiscipline || !questionStatement || !questionOptions || !questionFeedback || !questionSummary || !questionIndex || !questionTotal || !nextButton || !questionResult) {
    return;
  }

  questionDiscipline.textContent = currentDiscipline || 'Disciplina';
  questionIndex.textContent = currentQuestionIndex + 1;
  questionTotal.textContent = currentQuestionSet.length;
  questionResult.style.display = 'none';

  if (!question) {
    questionStatement.textContent = 'Nenhuma questão disponível para esta disciplina.';
    questionOptions.innerHTML = '';
    questionFeedback.textContent = 'Escolha outra disciplina para começar.';
    questionFeedback.className = 'question-feedback';
    questionSummary.classList.remove('active');
    nextButton.disabled = true;
    return;
  }

  questionStatement.textContent = question.enunciado;
  questionOptions.innerHTML = Object.entries(question.alternativas).map(([key, value]) => {
    return `
      <button type="button" class="question-option" data-option="${key}">
        <span>${key}</span>
        <span>${value}</span>
      </button>
    `;
  }).join('');

  questionOptions.querySelectorAll('.question-option').forEach(button => {
    button.addEventListener('click', handleOptionClick);
  });

  questionFeedback.textContent = 'Selecione uma alternativa para conferir.';
  questionFeedback.className = 'question-feedback';
  questionSummary.classList.remove('active');
  nextButton.textContent = currentQuestionIndex < currentQuestionSet.length - 1 ? 'Próxima questão' : 'Ver resultado final';
  nextButton.disabled = true;
  questionAnswered = false;
}

function handleOptionClick(event) {
  if (questionAnswered || quizFinished) return;
  const selectedButton = event.currentTarget;
  const selectedOption = selectedButton.dataset.option;
  if (!selectedOption) return;

  processAnswer(selectedOption, selectedButton);
}

function processAnswer(selectedOption, selectedButton) {
  const question = currentQuestionSet[currentQuestionIndex];
  const questionFeedback = document.getElementById('questionFeedback');
  const questionOptions = document.getElementById('questionOptions');
  const questionSummary = document.getElementById('questionSummary');
  const questionExplanation = document.getElementById('questionExplanation');
  const nextButton = document.getElementById('nextQuestionButton');

  if (!question || !questionFeedback || !questionOptions || !questionSummary || !questionExplanation || !nextButton) return;

  questionAnswered = true;
  const isCorrect = selectedOption === question.correta;

  if (isCorrect) {
    correctCount += 1;
    questionFeedback.textContent = 'Resposta correta! Muito bem.';
    questionFeedback.classList.add('correct');
    selectedButton.classList.add('correct');
  } else {
    wrongCount += 1;
    questionFeedback.textContent = `Resposta incorreta. A alternativa correta é ${question.correta}.`;
    questionFeedback.classList.add('wrong');
    selectedButton.classList.add('wrong');
    const correctButton = questionOptions.querySelector(`[data-option="${question.correta}"]`);
    correctButton?.classList.add('correct');
  }

  questionOptions.querySelectorAll('.question-option').forEach(button => {
    button.classList.add('disabled');
    button.disabled = true;
  });

  questionExplanation.textContent = question.explicacao;
  questionSummary.classList.add('active');
  nextButton.disabled = false;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const correctCountEl = document.getElementById('correctCount');
  const wrongCountEl = document.getElementById('wrongCount');
  if (correctCountEl) correctCountEl.textContent = correctCount;
  if (wrongCountEl) wrongCountEl.textContent = wrongCount;
}

function handleNextQuestion() {
  if (!questionAnswered && !quizFinished) return;

  if (quizFinished) {
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    updateScoreDisplay();
    renderQuestionSet();
    return;
  }

  if (currentQuestionIndex < currentQuestionSet.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
  } else {
    showFinalResult();
  }
}

function showFinalResult() {
  quizFinished = true;
  savePerformanceData(currentDiscipline, correctCount, wrongCount, currentQuestionSet.length);
  initPerformanceDashboard();
  const questionStatement = document.getElementById('questionStatement');
  const questionOptions = document.getElementById('questionOptions');
  const questionFeedback = document.getElementById('questionFeedback');
  const questionSummary = document.getElementById('questionSummary');
  const questionResult = document.getElementById('questionResult');
  const nextButton = document.getElementById('nextQuestionButton');

  if (!questionStatement || !questionOptions || !questionFeedback || !questionSummary || !questionResult || !nextButton) return;

  questionStatement.textContent = `Você concluiu o banco de questões de ${currentDiscipline}!`;
  questionOptions.innerHTML = '';
  questionFeedback.textContent = '';
  questionFeedback.className = 'question-feedback';
  questionSummary.classList.remove('active');
  questionResult.style.display = 'block';
  questionResult.innerHTML = `
    <strong>Resultado final</strong><br>
    Você acertou <strong>${correctCount}</strong> de <strong>${currentQuestionSet.length}</strong> questões.<br>
    Erros: <strong>${wrongCount}</strong>.<br>
    Taxa de acerto: <strong>${Math.round((correctCount / currentQuestionSet.length) * 100)}%</strong>.
  `;
  nextButton.textContent = 'Reiniciar';
  nextButton.disabled = false;
}

function resetQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  quizFinished = false;
  updateScoreDisplay();
  renderQuestion();
}

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
   6. PÁGINA DE DISCIPLINAS - Enhancements
══════════════════════════════════════════════════════ */
function initDisciplinesPageEnhancements() {
  // Adiciona funcionalidade ao botão "Estudar Agora"
  const studyButton = document.querySelector('.weekly-recommendation__btn');
  if (studyButton) {
    studyButton.addEventListener('click', () => {
      window.location.href = 'questoes.html';
    });
  }

  // Adiciona interatividade aos cards de disciplinas
  const disciplineCards = document.querySelectorAll('.summary-card');
  disciplineCards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Extrai o nome da disciplina do card
      const disciplineName = card.querySelector('.summary-card__label')?.textContent || '';
      if (disciplineName) {
        // Redireciona para questões da disciplina específica
        window.location.href = `questoes.html?disciplina=${encodeURIComponent(disciplineName)}`;
      }
    });

    // Feedback visual onhover
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Adiciona animação de entrada nos títulos de seções
  const sectionTitles = document.querySelectorAll('.disciplines-section__title');
  sectionTitles.forEach((title, index) => {
    title.style.opacity = '0';
    title.style.animation = `fadeInDown 0.6s ease-out ${0.1 * index}s forwards`;
  });
}

/* ══════════════════════════════════════════════════════
   6. SISTEMA DE ANOTAÇÕES
══════════════════════════════════════════════════════ */
const notesStorageKey = 'cronoStudyNotes';

function initNotesSystem() {
  const newNoteBtn = document.getElementById('newNoteBtn');
  const noteModal = document.getElementById('noteModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const noteForm = document.getElementById('noteForm');
  const notesSearchInput = document.getElementById('notesSearchInput');
  const notesFilterDiscipline = document.getElementById('notesFilterDiscipline');

  if (!newNoteBtn) return; // Page is not anotacoes.html

  let editingNoteId = null;

  // Open modal
  function openModal(id = null) {
    editingNoteId = id;
    const modal = document.getElementById('noteModal');
    const form = document.getElementById('noteForm');
    const modalTitle = document.getElementById('modalTitle');

    if (id) {
      const notes = getNotes();
      const note = notes.find(n => n.id === id);
      if (note) {
        modalTitle.textContent = 'Editar Anotação';
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteDiscipline').value = note.discipline;
        document.getElementById('noteContent').value = note.content;
      }
    } else {
      modalTitle.textContent = 'Nova Anotação';
      form.reset();
    }

    modal.style.display = 'flex';
    setTimeout(() => {
      document.getElementById('noteTitle').focus();
    }, 0);
  }

  function closeModal() {
    noteModal.style.display = 'none';
    editingNoteId = null;
  }

  newNoteBtn.addEventListener('click', () => openModal());
  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Form submit
  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const discipline = document.getElementById('noteDiscipline').value;
    const content = document.getElementById('noteContent').value;

    if (!title || !discipline || !content) return;

    const notes = getNotes();
    if (editingNoteId) {
      const note = notes.find(n => n.id === editingNoteId);
      if (note) {
        note.title = title;
        note.discipline = discipline;
        note.content = content;
        note.updatedAt = new Date().toISOString();
      }
    } else {
      notes.push({
        id: Date.now(),
        title,
        discipline,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(notesStorageKey, JSON.stringify(notes));
    closeModal();
    renderNotes();
  });

  // Search & Filter
  notesSearchInput.addEventListener('input', renderNotes);
  notesFilterDiscipline.addEventListener('change', renderNotes);

  // Initial render
  renderNotes();

  function renderNotes() {
    const notesList = document.getElementById('notesList');
    const notesEmpty = document.getElementById('notesEmpty');
    const searchTerm = notesSearchInput.value.toLowerCase();
    const selectedDiscipline = notesFilterDiscipline.value;

    let notes = getNotes();

    // Filter
    notes = notes.filter(note => {
      const matchSearch = note.title.toLowerCase().includes(searchTerm) || 
                         note.content.toLowerCase().includes(searchTerm);
      const matchDiscipline = !selectedDiscipline || note.discipline === selectedDiscipline;
      return matchSearch && matchDiscipline;
    });

    if (notes.length === 0) {
      notesList.innerHTML = '';
      notesEmpty.style.display = 'block';
      return;
    }

    notesEmpty.style.display = 'none';
    notesList.innerHTML = notes.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    ).map((note) => {
      const date = new Date(note.createdAt);
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      return `
        <article class="notes-card" data-discipline="${note.discipline}">
          <div class="notes-card__header">
            <h3 class="notes-card__title">${note.title}</h3>
          </div>
          <span class="notes-card__discipline">${note.discipline}</span>
          <p class="notes-card__content">${note.content}</p>
          <div class="notes-card__footer">
            <span class="notes-card__date">${dateStr}</span>
            <div class="notes-card__actions">
              <button class="notes-card__btn notes-edit-btn" data-id="${note.id}">Editar</button>
              <button class="notes-card__btn notes-card__btn--danger notes-delete-btn" data-id="${note.id}">Excluir</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Add event listeners
    document.querySelectorAll('.notes-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.notes-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir essa anotação?')) {
          const notes = getNotes();
          const filtered = notes.filter(n => n.id !== parseInt(btn.dataset.id));
          localStorage.setItem(notesStorageKey, JSON.stringify(filtered));
          renderNotes();
        }
      });
    });
  }
}

function getNotes() {
  try {
    return JSON.parse(localStorage.getItem(notesStorageKey)) || [];
  } catch {
    return [];
  }
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
