# The Beta Train

A calendar of upcoming and active video game betas across PlayStation, Xbox, and PC.
Victorian train-terminus aesthetic — brick, iron, brass, and cream enamel signage.

## Structure

```
index.html         the site
css/styles.css      styling
js/app.js           calendar rendering, filters, status display
assets/             logo and corner ornament images

shared/
  data.js           the entire dataset
  logic.js          date math, status computation, labels

about.html          about page
submit.html         beta submission form (Formspree-backed)
admin.html          private entry-editing tool, not linked from the public site
```

This was previously two parallel designs (betatrainmodern and betatrainsteam) sharing
a `shared/` folder one level down. betatrainmodern was retired and betatrainsteam moved
up to become the site itself, so paths are now flat and root-relative throughout.

## Adding or editing a beta

Use `admin.html` to add, edit, or remove entries with a form instead of hand-editing
JS, then paste its generated output over `shared/data.js`. Or edit `shared/data.js`
directly — field reference is documented in the comment at the top of that file.
Status is always derived from today's date, never hand-set:

- **Upcoming** — before signup opens
- **Signup open** — between signup open and the deadline (or indefinitely, if no deadline)
- **Signup closed** — past the deadline, beta hasn't started yet
- **Closed beta** — the beta window is active and it's still invite-only
- **Open beta** — the beta window is active and it's open to everyone (set `open_beta_date`)
- **Concluded** — the beta window has ended

Most betas start closed and open up partway through — that's what `open_beta_date`
is for. Leave it `null` if a beta stays invite-only for its whole run.

Each entry also has a `needs_review` array listing any fields that weren't confirmed
from a source. `admin.html` shows this as a badge per entry and can sort unverified
entries to the top — except entries whose status has concluded, which are treated as
clean regardless of `needs_review`, since unconfirmed details on a beta that's already
over aren't worth chasing down.

## Color system

A single-platform beta gets that platform's color (PlayStation blue, Xbox green, PC
amber). Anything spanning more than one platform gets the multi-platform plum, since
that's expected to be the majority case for real betas.

## Filtering

Platform filters are inclusive (matches any entry supporting that platform, not
exclusive-only). Event-type filters (opening soon / signups open / live now) group
closed-beta and open-beta together under "live now" — the open/closed distinction is
shown on the detail cards, not used for filtering.

## Versioning

The footer shows a small version number (currently v2), incremented each time a build
goes out. The zip filename carries the same number. There's no shared source for this
number, it's hand-set in the page footer each round.

## Deploying to GitHub Pages

Upload the contents of this folder to a repo, enable Pages in Settings, done. No build
step, no dependencies to install.
