/*
  BETA_DATA is the entire dataset for the site.

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
    needs_review           array of field names that were NOT confirmed from a
                           source and need a manual check — e.g. ["signup_link"].
                           Empty array means every field is source-confirmed.
                           This is separate from a field being null on purpose
                           (e.g. open_beta_date: null because a beta is
                           confirmed invite-only for its whole run is NOT a
                           review item — only "I don't actually know" is).

  This file was populated from a real research pass (web search + article
  fetches) on 2026-08-28. Every entry's source field points to the actual
  article it was pulled from. Anything not stated explicitly in that source
  was left null and flagged in needs_review rather than guessed.
*/

const BETA_DATA = [
  {
    id: "tsurugihime",
    title: "TSURUGIHIME",
    platforms: ["pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-08-17",
    signup_deadline: "2026-08-23",
    beta_window: { start: "2026-08-25", end: "2026-09-06" },
    open_beta_date: null,
    signup_link: "https://forms.gle/E9DCkxhprnLwZqib9",
    description: "Combat-only closed beta for this side-scrolling action RPG, capped at 100 testers worldwide and focused entirely on the battle system ahead of full production.",
    source: "https://www.gematsu.com/2026/08/tsurugihime-combat-focused-closed-beta-test-set-for-august-25-to-september-6",
    needs_review: []
  },
  {
    id: "cod-modern-warfare-4",
    title: "Call of Duty: Modern Warfare 4",
    platforms: ["playstation", "xbox", "pc"],
    platform_access_type: "confirmed-simultaneous",
    signup_open_date: "2026-07-20",
    signup_deadline: null,
    beta_window: { start: "2026-08-21", end: "2026-09-01" },
    open_beta_date: "2026-08-28",
    signup_link: null,
    description: "Multiplayer beta ahead of October's launch. Early access opens first for pre-orders and Game Pass members, then opens to everyone on August 28.",
    source: "https://www.gematsu.com/2026/07/call-of-duty-modern-warfare-4-open-beta-test-set-for-august-28-to-september-1",
    needs_review: ["signup_open_date", "signup_link"]
  },
  {
    id: "crazy-taxi-world-tour",
    title: "Crazy Taxi: World Tour",
    platforms: ["playstation", "xbox", "pc"],
    platform_access_type: "confirmed-simultaneous",
    signup_open_date: "2026-07-28",
    signup_deadline: "2026-08-31",
    beta_window: { start: "2026-09-11", end: "2026-09-13" },
    open_beta_date: null,
    signup_link: "https://www.sega.com/crazy-taxi/crazy-taxi-world-tour?tab=closed-network-test",
    description: "Closed network test focused on the game's online multiplayer modes, Pickup Race and Cops 'N' Cabbies, ahead of the full 2027 release. Only a small number of applicants will be selected.",
    source: "https://www.gematsu.com/2026/07/crazy-taxi-world-tour-closed-network-test-set-for-september-11-to-13",
    needs_review: []
  },
  {
    id: "gears-of-war-e-day",
    title: "Gears of War: E-Day",
    platforms: ["xbox", "pc"],
    platform_access_type: "confirmed-simultaneous",
    signup_open_date: "2026-06-07",
    signup_deadline: null,
    beta_window: { start: "2026-08-06", end: "2026-08-17" },
    open_beta_date: "2026-08-13",
    signup_link: null,
    description: "Two multiplayer beta weekends ahead of October's launch: early access for pre-orders and Game Pass members first, then open to everyone for the second weekend.",
    source: "https://www.purexbox.com/guides/gears-of-war-e-day-open-beta-dates-start-times-and-xbox-game-pass-details",
    needs_review: ["signup_open_date", "signup_link"]
  },
  {
    id: "marvel-tokon-fighting-souls",
    title: "MARVEL Tokon: Fighting Souls",
    platforms: ["playstation", "pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-07-17",
    signup_deadline: null,
    beta_window: { start: "2026-07-24", end: "2026-07-26" },
    open_beta_date: "2026-07-24",
    signup_link: null,
    description: "Open beta test for Arc System Works' 4v4 tag-team fighting game set in the Marvel universe.",
    source: "https://www.gematsu.com/tag/betas",
    needs_review: ["signup_open_date", "signup_link", "platform_access_type"]
  },
  {
    id: "time-takers",
    title: "TIME TAKERS",
    platforms: ["pc"],
    platform_access_type: "unspecified",
    signup_open_date: "2026-08-24",
    signup_deadline: null,
    beta_window: { start: "2026-09-05", end: "2026-09-08" },
    open_beta_date: "2026-09-05",
    signup_link: null,
    description: "72-hour global multiplayer playtest for this time-survival shooter, open to any player who requests access, building on feedback from an earlier closed test in March.",
    source: "https://www.invenglobal.com/articles/25059/ncs-time-takers-to-run-steam-playtest-starting-september-5",
    needs_review: ["signup_link"]
  }
];
