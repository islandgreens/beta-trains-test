# The Beta Train

A calendar of upcoming and active video game betas across PlayStation, Xbox, and PC.
Two visual designs share one dataset and one set of rules for what a status means.

## Structure

```
shared/
  data.js          the entire dataset — edit this once, both designs update
  logic.js         date math, status computation, labels — identical for both designs

betatrainmodern/   sleek, vibrant, dark game-launcher aesthetic
betatrainsteam/    Victorian train-terminus aesthetic (brick, iron, brass, enamel signage)
```

Each design is a self-contained static site (its own `index.html`, `css/`, `js/`) that
loads `../shared/data.js` and `../shared/logic.js` before its own rendering code. Never
duplicate the dataset or the status logic into a design folder — if you're adding a
third design, point it at `shared/` the same way.

## Adding or editing a beta

Edit `shared/data.js`. Field reference is documented in the comment at the top of that
file. Both designs pick up the change automatically. Status is always derived from
today's date, never hand-set:

- **Upcoming** — before signup opens
- **Signup open** — between signup open and the deadline (or indefinitely, if no deadline)
- **Signup closed** — past the deadline, beta hasn't started yet
- **Closed beta** — the beta window is active and it's still invite-only
- **Open beta** — the beta window is active and it's open to everyone (set `open_beta_date`)
- **Concluded** — the beta window has ended

Most betas start closed and open up partway through — that's what `open_beta_date`
is for. Leave it `null` if a beta stays invite-only for its whole run.

## Color systems (differ per design, same logic)

Both designs use the same rule: a single-platform beta gets that platform's color,
anything spanning more than one platform gets the "multi-platform" color, since that's
expected to be the majority case. The actual colors differ:

- **betatrainmodern**: vivid blue / green / orange / purple
- **betatrainsteam**: heritage rail-signal blue / green / amber, with a muted plum for
  multi-platform, all rendered on cream enamel boards

## Filtering

Platform filters are inclusive (matches any entry supporting that platform, not
exclusive-only). Event-type filters (opening soon / signups open / live now) group
closed-beta and open-beta together under "live now" — the open/closed distinction is
shown on the detail cards, not used for filtering.

## Deploying to GitHub Pages

Same as before: create a repo, upload the whole `beta-train` folder (or its contents)
keeping the folder structure intact, enable Pages in Settings, done. No build step. If
you want both designs live at once, they'll sit at `yoursite/betatrainmodern/` and
`yoursite/betatrainsteam/` automatically, since each is self-contained.
