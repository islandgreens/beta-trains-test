/*
  Rendering logic only — date math, status computation, and labels come from
  ../shared/logic.js and ../shared/data.js, loaded before this file.
*/

const PLATFORM_COLOR_VAR = {
  playstation: "--signal-blue",
  xbox: "--heritage-green",
  pc: "--lamp-amber",
  cross: "--mourning-plum"
};

function colorVarFor(entry) {
  return PLATFORM_COLOR_VAR[platformColorKey(entry)];
}

/* ---------- app state ---------- */

const today = startOfToday();
let viewMonth = today.getMonth();
let viewYear = today.getFullYear();
const activePlatforms = new Set();
const activeEventTypes = new Set();

/* ---------- rendering: weekday header ---------- */

function renderWeekdayHeader() {
  document.getElementById("weekdays").innerHTML =
    WEEKDAY_LABELS.map(d => `<span>${d}</span>`).join("");
}

/* ---------- filtering ---------- */

function entryPassesFilters(entry, status) {
  const platformOk = activePlatforms.size === 0 || entry.platforms.some(p => activePlatforms.has(p));
  const eventOk = activeEventTypes.size === 0 ||
    Array.from(activeEventTypes).some(f => matchesEventFilter(status, f));
  return platformOk && eventOk;
}

function getEntriesTouchingDate(date) {
  const results = [];
  BETA_DATA.forEach(entry => {
    const status = computeStatus(entry, today);
    if (!entryPassesFilters(entry, status)) return;

    const bSpan = betaSpan(entry);
    const sSpan = signupSpan(entry);
    if (inRange(date, bSpan.start, bSpan.end)) {
      results.push({ entry, status, barType: "beta" });
    } else if (inRange(date, sSpan.start, sSpan.end)) {
      results.push({ entry, status, barType: "signup" });
    }
  });
  return results;
}

function barStyleFor(entry, status, barType) {
  const classes = [barType === "beta" ? "entry-bar--beta" : "entry-bar--signup"];
  let colorVar = colorVarFor(entry);

  if (status === "concluded") {
    classes.push("entry-bar--concluded");
  } else if (status === "missed-deadline") {
    classes.push("entry-bar--missed");
    colorVar = "--grey-slate";
  }
  return { classes, colorVar };
}

/* ---------- rendering: calendar grid ---------- */

function renderCalendarGrid() {
  const grid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("month-label");
  monthLabel.textContent = `${MONTH_LABELS[viewMonth]} ${viewYear}`;

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingEmpty = firstOfMonth.getDay();

  let html = "";
  for (let i = 0; i < leadingEmpty; i++) html += `<div class="day day--empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewYear, viewMonth, day);
    const touching = getEntriesTouchingDate(date);
    const isToday = sameDate(date, today);

    const visible = touching.slice(0, 3);
    const overflow = touching.length - visible.length;

    const barsHtml = visible.map(({ entry, status, barType }) => {
      const { classes, colorVar } = barStyleFor(entry, status, barType);
      return `<span class="entry-bar ${classes.join(" ")}" style="--bar-color: var(${colorVar});" title="${entry.title} — ${STATUS_LABEL[status]}"></span>`;
    }).join("");

    const moreHtml = overflow > 0 ? `<span class="day__more">+${overflow} more</span>` : "";

    html += `
      <button type="button" class="day${isToday ? " day--today" : ""}" data-date="${date.toISOString()}" aria-label="${MONTH_LABELS[viewMonth]} ${day}, ${touching.length} beta${touching.length === 1 ? "" : "s"}">
        <span class="day__num">${day}</span>
        <span class="day__entries">${barsHtml}${moreHtml}</span>
      </button>
    `;
  }

  grid.innerHTML = html;

  grid.querySelectorAll(".day:not(.day--empty)").forEach(cell => {
    cell.addEventListener("click", () => {
      openPanelForDate(new Date(cell.getAttribute("data-date")));
    });
  });
}

/* ---------- rendering: detail panel (ticket cards) ---------- */

function formatDateShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function renderTicket(entry, status) {
  const colorVar = status === "concluded" ? "--grey-outline"
    : status === "missed-deadline" ? "--grey-slate"
    : colorVarFor(entry);

  const platformLabels = entry.platforms.map(p => PLATFORM_LABEL[p]).join(" · ");
  const accessNote = entry.platforms.length > 1 && entry.platform_access_type === "selection-during-signup"
    ? `<div>Platform selection made during signup.</div>` : "";
  const accessConfirmed = entry.platforms.length > 1 && entry.platform_access_type === "confirmed-simultaneous"
    ? `<div>Confirmed simultaneous release across all listed platforms.</div>` : "";

  const deadlineLine = entry.signup_deadline
    ? `<strong>Signup deadline:</strong> ${formatDateShort(parseYMD(entry.signup_deadline))}`
    : `<strong>Signup deadline:</strong> Not announced (rolling admission)`;

  const openBetaLine = entry.open_beta_date
    ? `<div><strong>Opens to everyone:</strong> ${formatDateShort(parseYMD(entry.open_beta_date))}</div>`
    : `<div>Invite-only for the entire test</div>`;

  const linkHtml = entry.signup_link
    ? `<a class="ticket__link" href="${entry.signup_link}" target="_blank" rel="noopener">Sign up for this beta &rarr;</a>`
    : `<div class="panel__empty" style="margin-top:8px;">No signup link yet</div>`;

  let stampHtml = "";
  if (status === "closed-beta") {
    stampHtml = `<div class="ticket__stamp">Invite<br>Only</div>`;
  } else if (status === "open-beta") {
    stampHtml = `<div class="ticket__stamp ticket__stamp--open">Open<br>To All</div>`;
  }

  const statusTagClass = status === "open-beta" ? "tag tag--status tag--filled" : "tag tag--status";

  return `
    <article class="ticket">
      ${stampHtml}
      <h3 class="ticket__title">${entry.title}</h3>
      <div class="ticket__badges">
        <span class="tag">${platformLabels}</span>
        <span class="${statusTagClass}" style="--badge-color: var(${colorVar});">${STATUS_LABEL[status]}</span>
      </div>
      <p class="ticket__desc">${entry.description}</p>
      <div class="ticket__perforation"></div>
      <div class="ticket__stub">
        <div><strong>Signup opens:</strong> ${formatDateShort(parseYMD(entry.signup_open_date))}</div>
        <div>${deadlineLine}</div>
        <div><strong>Beta window:</strong> ${formatDateShort(parseYMD(entry.beta_window.start))} &ndash; ${formatDateShort(parseYMD(entry.beta_window.end))}</div>
        ${openBetaLine}
        ${accessNote}
        ${accessConfirmed}
      </div>
      ${linkHtml}
    </article>
  `;
}

function openPanelForDate(date) {
  const touching = getEntriesTouchingDate(date);
  const panel = document.getElementById("panel");
  const overlay = document.getElementById("overlay");
  const title = document.getElementById("panel-title");
  const body = document.getElementById("panel-body");

  title.textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  body.innerHTML = touching.length === 0
    ? `<p class="panel__empty">No betas touch this date${activePlatforms.size || activeEventTypes.size ? " with the current filters" : ""}.</p>`
    : touching.sort((a, b) => a.entry.title.localeCompare(b.entry.title))
        .map(({ entry, status }) => renderTicket(entry, status)).join("");

  panel.hidden = false;
  overlay.hidden = false;
  document.getElementById("panel-close").focus();
}

function closePanel() {
  document.getElementById("panel").hidden = true;
  document.getElementById("overlay").hidden = true;
}

/* ---------- controls ---------- */

function renderClock() {
  const label = document.getElementById("board-clock-value");
  label.textContent = today.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function setupControls() {
  document.getElementById("prev-month").addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderCalendarGrid();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderCalendarGrid();
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      const group = btn.getAttribute("data-filter-group");
      const set = group === "platform" ? activePlatforms : activeEventTypes;
      const key = group === "platform" ? btn.getAttribute("data-platform") : btn.getAttribute("data-event");

      if (set.has(key)) {
        set.delete(key);
        btn.setAttribute("aria-pressed", "false");
      } else {
        set.add(key);
        btn.setAttribute("aria-pressed", "true");
      }
      renderCalendarGrid();
    });
  });

  document.getElementById("panel-close").addEventListener("click", closePanel);
  document.getElementById("overlay").addEventListener("click", closePanel);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });
}

/* ---------- init ---------- */

renderWeekdayHeader();
renderClock();
setupControls();
renderCalendarGrid();
