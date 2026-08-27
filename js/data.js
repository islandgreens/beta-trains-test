/*
  BETA_DATA is the entire dataset for the site. Each entry is one beta.
  This file is meant to be hand-edited: add a new object to the array below
  to add a beta, no build step required.

  Field reference:
    id                    unique slug, used for links later
    title                 game title
    platforms             array of "playstation" | "xbox" | "pc"
    platform_access_type  "confirmed-simultaneous" | "selection-during-signup"
                           | "unspecified"  -- only meaningful when platforms.length > 1
                           and only set when you've actually verified it
    signup_open_date      "YYYY-MM-DD", the day signups start
    signup_deadline       "YYYY-MM-DD" or null if unknown / rolling admission
    beta_window           { start: "YYYY-MM-DD", end: "YYYY-MM-DD" }
    signup_link           url string or null if not yet available
    description           short blurb for the detail panel
    source                url you verified this against (not shown publicly,
                           kept for your own recordkeeping)

  NOTE: every title below is a placeholder, invented for layout testing only.
  They are not real games. The dates are hand-picked around "today" so the
  board demonstrates every status state (upcoming, signup open, missed
  deadline, beta live, concluded) at once. As real time passes these will
  drift out of sync with "today" and stop demonstrating every state, since
  this is seed data, not a live feed.
*/

const BETA_DATA = [
  {
    id: "nova-frontier",
    title: "Nova Frontier",
    platforms: ["playstation", "xbox", "pc"],
    platform_access_type: "selection-during-signup",
    signup_open_date: "2026-08-10",
    signup_deadline: "2026-08-20",
    beta_window: { start: "2026-08-25", end: "2026-09-05" },
    signup_link: null,
    description: "Open-world extraction shooter. First public network test, servers capped at 50k concurrent.",
    source: "https://example.com/source-nova-frontier"
  },
  {
    id: "aurelias-wake",
    title: "Aurelia's Wake",
    platforms: ["playstation"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-08-20",
    signup_deadline: "2026-09-10",
    beta_window: { start: "2026-09-15", end: "2026-09-25" },
    signup_link: "https://example.com/aurelias-wake-beta",
    description: "Narrative action-RPG. Closed beta focused on the first two story chapters and combat feedback.",
    source: "https://example.com/source-aurelias-wake"
  },
  {
    id: "steel-vanguard",
    title: "Steel Vanguard",
    platforms: ["xbox"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-07-01",
    signup_deadline: "2026-08-15",
    beta_window: { start: "2026-09-01", end: "2026-09-10" },
    signup_link: "https://example.com/steel-vanguard-beta",
    description: "Mech-combat multiplayer. Signup has closed; selected testers will be notified before the window opens.",
    source: "https://example.com/source-steel-vanguard"
  },
  {
    id: "emberlight",
    title: "Emberlight",
    platforms: ["pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-08-15",
    signup_deadline: null,
    beta_window: { start: "2026-09-20", end: "2026-09-30" },
    signup_link: "https://example.com/emberlight-playtest",
    description: "Cooperative survival-crafting. Steam Playtest, rolling admission with no announced cutoff.",
    source: "https://example.com/source-emberlight"
  },
  {
    id: "wraithbound",
    title: "Wraithbound",
    platforms: ["playstation", "pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-09-05",
    signup_deadline: "2026-09-15",
    beta_window: { start: "2026-09-20", end: "2026-09-30" },
    signup_link: null,
    description: "Asymmetric horror multiplayer. Signup page not live yet; official announcement confirmed platforms only.",
    source: "https://example.com/source-wraithbound"
  },
  {
    id: "foundry-9",
    title: "Foundry 9",
    platforms: ["playstation", "xbox", "pc"],
    platform_access_type: "confirmed-simultaneous",
    signup_open_date: "2026-06-01",
    signup_deadline: "2026-06-20",
    beta_window: { start: "2026-07-01", end: "2026-07-10" },
    signup_link: "https://example.com/foundry-9-beta",
    description: "Base-building strategy. First closed beta has concluded; a second test is expected before launch.",
    source: "https://example.com/source-foundry-9"
  },
  {
    id: "redline-circuit",
    title: "Redline Circuit",
    platforms: ["xbox", "pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-08-25",
    signup_deadline: "2026-09-25",
    beta_window: { start: "2026-10-05", end: "2026-10-15" },
    signup_link: "https://example.com/redline-circuit-beta",
    description: "Arcade racing with live-service seasons. Long signup window ahead of an October test weekend.",
    source: "https://example.com/source-redline-circuit"
  }
];
