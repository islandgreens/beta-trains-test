/* ---------- date helpers ---------- */

// Parses "YYYY-MM-DD" as a local-midnight Date, avoiding the UTC shift
// that new Date("YYYY-MM-DD") introduces in some timezones.
function parseYMD(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function inRange(date, start, end) {
  return date >= start && date <= end;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

/* ---------- status + color logic ---------- */

const PLATFORM_COLOR_VAR = {
  playstation: "--accent-playstation",
  xbox: "--accent-xbox",
  pc: "--accent-pc"
};

const PLATFORM_LABEL = {
  playstation: "PlayStation",
  xbox: "Xbox",
  pc: "PC"
};

const STATUS_LABEL = {
  upcoming: "Upcoming",
  "signup-open": "Signup open",
  "missed-deadline": "Signup closed",
  "beta-live": "Beta live",
  concluded: "Concluded"
};

function computeStatus(entry, today) {
  const open = parseYMD(entry.signup_open_date);
  const deadline = entry.signup_deadline ? parseYMD(entry.signup_deadline) : null;
  const betaStart = parseYMD(entry.beta_window.start);
  const betaEnd = parseYMD(entry.beta_window.end);

  if (inRange(today, betaStart, betaEnd)) return "beta-live";
  if (today > betaEnd) return "concluded";
  if (today < open) return "upcoming";
  if (deadline && today > deadline) return "missed-deadline";
  return "signup-open";
}

// The color that represents this entry when it isn't overridden by a
// grey/concluded state: single platform gets its brand color, anything
// with more than one platform (the majority case) gets the neutral color.
function primaryColorVar(entry) {
  if (entry.platforms.length === 1) return PLATFORM_COLOR_VAR[entry.platforms[0]];
  return "--accent-cross";
}

function signupSpan(entry) {
  const open = parseYMD(entry.signup_open_date);
  const betaStart = parseYMD(entry.beta_window.start);
  const end = entry.signup_deadline ? parseYMD(entry.signup_deadline) : addDays(betaStart, -1);
  return { start: open, end: end < open ? open : end };
}

function betaSpan(entry) {
  return { start: parseYMD(entry.beta_window.start), end: parseYMD(entry.beta_window.end) };
}

/* ---------- app state ---------- */

const today = startOfToday();
let viewMonth = today.getMonth();
let viewYear = today.getFullYear();
const activePlatforms = new Set();

/* ---------- rendering: weekday header ---------- */

function renderWeekdayHeader() {
  const el = document.getElementById("weekdays");
  el.innerHTML = WEEKDAY_LABELS.map(d => `<span>${d}</span>`).join("");
}

/* ---------- rendering: calendar grid ---------- */

function entryPassesFilter(entry) {
  if (activePlatforms.size === 0) return true;
  return entry.platforms.some(p => activePlatforms.has(p));
}

function getEntriesTouchingDate(date) {
  const results = [];
  BETA_DATA.forEach(entry => {
    if (!entryPassesFilter(entry)) return;
    const status = computeStatus(entry, today);
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
  let colorVar = primaryColorVar(entry);

  if (status === "concluded") {
    classes.push("entry-bar--concluded");
  } else if (status === "missed-deadline") {
    classes.push("entry-bar--missed");
    colorVar = "--accent-grey";
  }
  return { classes, colorVar };
}

function renderCalendarGrid() {
  const grid = document.getElementById("calendar-grid");
  const monthLabel = document.getElementById("month-label");
  monthLabel.textContent = `${MONTH_LABELS[viewMonth]} ${viewYear}`;
  monthLabel.classList.remove("flap-in");
  void monthLabel.offsetWidth; // restart animation
  monthLabel.classList.add("flap-in");

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingEmpty = firstOfMonth.getDay();

  let html = "";

  for (let i = 0; i < leadingEmpty; i++) {
    html += `<div class="day day--empty"></div>`;
  }

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
      const date = new Date(cell.getAttribute("data-date"));
      openPanelForDate(date);
    });
  });
}

/* ---------- rendering: detail panel ---------- */

function formatDateShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function renderEntryCard(entry, status) {
  const colorVar = status === "concluded" ? "--accent-grey-outline"
    : status === "missed-deadline" ? "--accent-grey"
    : primaryColorVar(entry);

  const platformLabels = entry.platforms.map(p => PLATFORM_LABEL[p]).join(" · ");
  const accessNote = entry.platforms.length > 1 && entry.platform_access_type === "selection-during-signup"
    ? `<div>Platform selection made during signup.</div>` : "";
  const accessConfirmed = entry.platforms.length > 1 && entry.platform_access_type === "confirmed-simultaneous"
    ? `<div>Confirmed simultaneous release across all listed platforms.</div>` : "";

  const deadlineLine = entry.signup_deadline
    ? `<strong>Signup deadline:</strong> ${formatDateShort(parseYMD(entry.signup_deadline))}`
    : `<strong>Signup deadline:</strong> Not announced (rolling admission)`;

  const linkHtml = entry.signup_link
    ? `<a class="entry-card__link" href="${entry.signup_link}" target="_blank" rel="noopener">Sign up for this beta &rarr;</a>`
    : `<div class="panel__empty" style="margin-top:8px;">No signup link yet</div>`;

  return `
    <article class="entry-card">
      <h3 class="entry-card__title">${entry.title}</h3>
      <div class="entry-card__badges">
        <span class="badge">${platformLabels}</span>
        <span class="badge badge--status" style="--badge-color: var(${colorVar});">${STATUS_LABEL[status]}</span>
      </div>
      <p class="entry-card__desc">${entry.description}</p>
      <div class="entry-card__meta">
        <div><strong>Signup opens:</strong> ${formatDateShort(parseYMD(entry.signup_open_date))}</div>
        <div>${deadlineLine}</div>
        <div><strong>Beta window:</strong> ${formatDateShort(parseYMD(entry.beta_window.start))} &ndash; ${formatDateShort(parseYMD(entry.beta_window.end))}</div>
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

  if (touching.length === 0) {
    body.innerHTML = `<p class="panel__empty">No betas touch this date.</p>`;
  } else {
    body.innerHTML = touching
      .sort((a, b) => a.entry.title.localeCompare(b.entry.title))
      .map(({ entry, status }) => renderEntryCard(entry, status))
      .join("");
  }

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
  label.classList.add("flap-in");
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
      const platform = btn.getAttribute("data-platform");
      if (activePlatforms.has(platform)) {
        activePlatforms.delete(platform);
        btn.setAttribute("aria-pressed", "false");
      } else {
        activePlatforms.add(platform);
        btn.setAttribute("aria-pressed", "true");
      }
      renderCalendarGrid();
    });
  });

  document.getElementById("panel-close").addEventListener("click", closePanel);
  document.getElementById("overlay").addEventListener("click", closePanel);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePanel();
  });
}

/* ---------- init ---------- */

renderWeekdayHeader();
renderClock();
setupControls();
renderCalendarGrid();
