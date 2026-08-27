# The Beta Train

A calendar of upcoming and active video game betas across PlayStation, Xbox, and PC.
Static site, no build step, no backend. Everything lives in three files.

## Structure

```
index.html        page structure
css/styles.css     all styling
js/data.js         the entire dataset — edit this to add/update betas
js/app.js          calendar rendering, status logic, filters, detail panel
```

## Adding or editing a beta

Open `js/data.js` and add an object to the `BETA_DATA` array. Field reference
is documented in the comment at the top of that file. You don't need to
compute status yourself, it's derived automatically from today's date and
the dates you enter:

- **Upcoming** — before signup opens
- **Signup open** — between signup open and the deadline (or indefinitely, if no deadline is known)
- **Signup closed** — past the deadline, beta hasn't started yet (shown greyed out)
- **Beta live** — today falls inside the beta window (always takes priority over a missed deadline)
- **Concluded** — the beta window has ended

## Color system

- Blue / green / orange mark a beta that's exclusive to PlayStation / Xbox / PC respectively.
- Purple marks anything available on more than one platform. This is expected to be the
  majority of entries, so the three brand colors are reserved for genuine exclusives
  rather than diluted across everything.
- Grey (solid) means the signup deadline has passed. Grey (dashed) means the beta has concluded.

## Filtering

Two independent filter rows sit above the calendar: platform (PlayStation / Xbox / PC,
inclusive, matches any entry that supports the selected platform) and event type
(opening soon / signups open / live now). Both use the same pressed-button pattern:
a filled, glowing chip means it's active. Combining filters narrows by both at once.

## Current data

The seven entries in `js/data.js` right now are placeholder titles for layout testing,
not real games. They're dated around the current day on purpose, to demonstrate every
status state at once. Replace them with real, verified betas when you're ready — a
working signup link is optional, but only add an entry once you've confirmed it against
an official source (the `source` field is for your own recordkeeping, it's never shown
on the page).

## Deploying to GitHub Pages

See the setup steps provided separately. Short version: create a new repo, upload
these files keeping the folder structure intact, enable Pages in the repo's Settings,
done. No build step, no dependencies to install.
