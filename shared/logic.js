/*
  Shared date, status, and label logic for the site. Lives here rather than
  in js/app.js so status rules stay in one place. Only rendering and styling
  belong in js/app.js.
*/

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

const PLATFORM_LABEL = {
  playstation: "PlayStation",
  xbox: "Xbox",
  pc: "PC"
};

// Status values: upcoming, signup-open, missed-deadline, closed-beta,
// open-beta, concluded. "closed-beta" and "open-beta" both mean the beta
// window is currently active — they only differ in whether it's invite-only
// or open to everyone right now.
const STATUS_LABEL = {
  upcoming: "Upcoming",
  "signup-open": "Signup open",
  "missed-deadline": "Signup closed",
  "closed-beta": "Closed beta",
  "open-beta": "Open beta",
  concluded: "Concluded"
};

function computeStatus(entry, today) {
  const open = parseYMD(entry.signup_open_date);
  const deadline = entry.signup_deadline ? parseYMD(entry.signup_deadline) : null;
  const betaStart = parseYMD(entry.beta_window.start);
  const betaEnd = parseYMD(entry.beta_window.end);
  const openBeta = entry.open_beta_date ? parseYMD(entry.open_beta_date) : null;

  if (inRange(today, betaStart, betaEnd)) {
    return (openBeta && today >= openBeta) ? "open-beta" : "closed-beta";
  }
  if (today > betaEnd) return "concluded";
  if (today < open) return "upcoming";
  if (deadline && today > deadline) return "missed-deadline";
  return "signup-open";
}

// True if a betaLive-type filter ("Live now") should match this status —
// keeps closed-beta and open-beta grouped as one filterable concept, since
// the open/closed distinction is scoped to the detail cards, not filtering.
function matchesEventFilter(status, filterValue) {
  if (filterValue === "beta-live") return status === "closed-beta" || status === "open-beta";
  return status === filterValue;
}

// Abstract platform "family" for an entry — NOT a color. Each design maps
// this key to its own token names, so the color system can differ per
// design while this logic stays identical.
function platformColorKey(entry) {
  if (entry.platforms.length === 1) return entry.platforms[0];
  return "cross";
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
