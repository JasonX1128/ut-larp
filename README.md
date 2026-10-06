# UT LARP

A fan-made UT Austin admissions and college-career roulette game.

## Play

Open [`index.html`](./index.html) locally, or enable GitHub Pages for the repository.

The game includes UT majors and honors paths, campus organizations, eight study semesters, and three summer recruiting cycles.

Recruiting starts with an interview-count reel. Every interview rolls an employer and role from the 250-entry research dataset, with a modest boost for roles that fit your stats. After the interviews resolve, choose among the job offers. Employer names and roles come from `docs/research/reference/companies.csv`; USD wages, stat effects, and odds are game content.

## Development

No build step or external dependencies. Keep `index.html`, `styles.css`, `app.js`, `game-engine.js`, and `company-data.js` together. The scripts are regular browser scripts so opening `index.html` from disk works.

The rules are shared between interactive play and the outcome simulator. Run the regression checks with:

```sh
node --test tests/engine.test.js
node --check app.js
node --check game-engine.js
```

`scripts/import-companies.js` parses the reference CSV and prints the derived company data as JSON. `company-data.js` is the checked-in browser table.

Progress saves in the current browser. NEW RUN creates a fresh seed and updates the URL; a copied seed link reproduces the random sequence when you make the same choices. Completed runs remain viewable after refresh.
