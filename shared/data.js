/*
  BETA_DATA is the entire dataset, shared by every design (betatrainmodern,
  betatrainsteam, and any future ones). Never duplicate this file per design —
  add a design, point its index.html at this one via a relative path instead.

  Field reference:
    id                    unique slug
    title                 game title
    platforms             array of "playstation" | "xbox" | "pc"
    platform_access_type  "confirmed-simultaneous" | "selection-during-signup"
                           | "unspecified" — only meaningful when platforms.length > 1,
                           only set when you've actually verified it
    signup_open_date      "YYYY-MM-DD", the day signups start
    signup_deadline       "YYYY-MM-DD" or null if unknown / rolling admission
    beta_window           { start: "YYYY-MM-DD", end: "YYYY-MM-DD" }
    open_beta_date        "YYYY-MM-DD" or null. Most betas start invite-only and
                           open to everyone partway through the window — this is
                           that switchover date. Leave null if the beta stays
                           invite-only for its entire run, or if you haven't
                           confirmed whether/when it opens up.
    signup_link           url string or null if not yet available
    description           short blurb for the detail panel
    source                url you verified this against (recordkeeping only,
                           never shown publicly)

  NOTE: every title below is a placeholder, invented for layout testing only.
  Dates are hand-picked around "today" so the board demonstrates every status
  at once (upcoming, signup open, missed deadline, closed beta, open beta,
  concluded). As real time passes these will drift out of sync with "today."
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
    open_beta_date: "2026-09-01",
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
    open_beta_date: "2026-09-22",
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
    open_beta_date: "2026-09-08",
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
    open_beta_date: null,
    signup_link: "https://example.com/emberlight-playtest",
    description: "Cooperative survival-crafting. Steam Playtest, rolling admission with no announced cutoff. Stays invite-only for the full test.",
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
    open_beta_date: "2026-09-27",
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
    open_beta_date: "2026-07-08",
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
    open_beta_date: "2026-10-12",
    signup_link: "https://example.com/redline-circuit-beta",
    description: "Arcade racing with live-service seasons. Long signup window ahead of an October test weekend.",
    source: "https://example.com/source-redline-circuit"
  },
  {
    id: "ironclad-horizon",
    title: "Ironclad Horizon",
    platforms: ["pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-07-15",
    signup_deadline: "2026-08-01",
    beta_window: { start: "2026-08-15", end: "2026-09-10" },
    open_beta_date: "2026-08-20",
    signup_link: "https://example.com/ironclad-horizon-beta",
    description: "Turn-based tactics with a persistent campaign. Now past its invite-only phase. Everyone can join.",
    source: "https://example.com/source-ironclad-horizon"
  },
  {
    id: "northbound-signal",
    title: "Northbound Signal",
    platforms: ["xbox"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-08-18",
    signup_deadline: "2026-09-05",
    beta_window: { start: "2026-09-10", end: "2026-09-20" },
    open_beta_date: "2026-09-17",
    signup_link: "https://example.com/northbound-signal-beta",
    description: "Cooperative heist thriller. First public test after a long closed alpha.",
    source: "https://example.com/source-northbound-signal"
  },
  {
    id: "ironvale-assault",
    title: "Ironvale Assault",
    platforms: ["xbox"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-07-20",
    signup_deadline: "2026-08-10",
    beta_window: { start: "2026-08-22", end: "2026-09-02" },
    open_beta_date: "2026-08-29",
    signup_link: "https://example.com/ironvale-assault-beta",
    description: "Squad-based tactical shooter. Closed beta now underway ahead of a wider open weekend.",
    source: "https://example.com/source-ironvale-assault"
  }
];
