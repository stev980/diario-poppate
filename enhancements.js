'use strict';
(() => {
  const STORAGE_PAGE = 'diarioPoppate.activePage';
  let summaryMode = 'week';

  function romeDate(offsetDays = 0) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
    const date = new Date(Date.UTC(+values.year, +values.month - 1, +values.day + offsetDays));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`;
  }

  function selectPeriod(mode) {
    summaryMode = mode;
    if (mode === 'today') {
      const today = romeDate(0);
      document.getElementById('summaryFrom').value = today;
      document.getElementById('summaryTo').value = today;
    } else if (mode === 'yesterday') {
      const yesterday = romeDate(-1);
      document.getElementById('summaryFrom').value = yesterday;
      document.getElementById('summaryTo').value = yesterday;
    } else {
      document.getElementById('summaryFrom').value = romeDate(-6);
      document.getElementById('summaryTo').value = romeDate(0);
    }
    renderSummary();
  }

  function addProjection() {
    const container = document.getElementById('summaryCards');
    if (!container) return;
    container.querySelector('[data-projection-card]')?.remove();
    if (summaryMode !== 'today') return;

    const today = romeDate(0);
    const total = records
      .filter(r => r.feeding_at.slice(0, 10) === today)
      .reduce((sum, r) => sum + Number(r.ml), 0);

    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
    const elapsedSeconds = (+values.hour * 3600) + (+values.minute * 60) + (+values.second);
    const projection = elapsedSeconds > 0 ? Math.round(total * 86400 / elapsedSeconds) : total;

    const card = document.createElement('div');
    card.className = 'stat';
    card.dataset.projectionCard = 'true';
    card.innerHTML = `<span>Proiezione giornata</span><b>${projection} ml</b>`;
    container.appendChild(card);
  }

  window.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '.summary-presets{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.summary-presets button{width:100%}';
    document.head.appendChild(style);

    const originalNavigate = navigate;
    navigate = function(page) {
      if (['insert','list','summary'].includes(page)) localStorage.setItem(STORAGE_PAGE, page);
      return originalNavigate(page);
    };

    const oldLast7 = document.getElementById('last7Days');
    if (oldLast7) {
      const presets = document.createElement('div');
      presets.className = 'summary-presets';
      presets.innerHTML = '<button id="todaySummary" class="secondary" type="button">Oggi</button><button id="yesterdaySummary" class="secondary" type="button">Ieri</button><button id="weekSummary" class="secondary" type="button">Settimana</button>';
      oldLast7.replaceWith(presets);
      document.getElementById('todaySummary').onclick = () => selectPeriod('today');
      document.getElementById('yesterdaySummary').onclick = () => selectPeriod('yesterday');
      document.getElementById('weekSummary').onclick = () => selectPeriod('week');
    }

    const apply = document.getElementById('applySummary');
    if (apply) apply.onclick = () => { summaryMode = 'custom'; renderSummary(); };

    const originalRenderSummary = renderSummary;
    renderSummary = function() {
      originalRenderSummary();
      addProjection();
    };

    const savedPage = localStorage.getItem(STORAGE_PAGE);
    if (['insert','list','summary'].includes(savedPage)) {
      setTimeout(() => navigate(savedPage), 0);
    }
  });
})();
