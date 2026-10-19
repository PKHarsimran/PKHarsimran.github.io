# Live Lab

The standalone `/lab/` page is copied unchanged by Jekyll and deployed on the existing GitHub Pages site. It needs no package install, database, account, or server-side code.

- `lab/core.mjs`: random visitor passes, validated progress, training cases, vault rules, deterministic creature art, and SVG badge source.
- `lab/network.mjs`: optional public-IP lookup through ipify, with a timeout and response validation. Importing it makes no request.
- `lab/app.mjs`: accessible DOM controls, local progress, packet tour, mascot reactions, animation preferences, and PNG export.
- Pixel's terminal: press `/` outside an input or choose **Ask Pixel**. `help` lists its fixed commands; `hint` follows puzzle progress. The native dialog closes with **Close** or Escape, and keeps commands only in the current page's memory. No command is executed or forwarded to a server.
- Mission patches: five milestones derived from the visitor's saved progress. Earlier passes migrate without losing their callsign or solved cases. Greeting Pixel or using its terminal records a bounded counter/boolean; no device data is used.
- `lab/lab.css`: desktop/mobile layouts and reduced-motion behavior. Fonts are local and their licenses are in `lab/fonts/`.

## Run and check

From the repository root:

```sh
python -m http.server 8866 --bind 127.0.0.1
node --test docs/tests/live-lab.test.mjs
node docs/tests/ioc-workbench.test.cjs
```

Open `http://127.0.0.1:8866/lab/`. The rest of the Jekyll site still needs its normal Jekyll build. The GitHub workflow checks the lab's rules and optional lookup before the strict-front-matter Jekyll build.

The page's CSS, entry module, and module imports share an asset revision query. Bump it together when shipping changes so an older cached module cannot be mixed with a new interface.

## Data boundaries

The app stores only a seed, derived callsign, creation time, completed room IDs, route progress, vault status, and motion preference. The callsign is random, not derived from an IP or device information. A visitor must click the reveal button before a direct request to `api64.ipify.org` runs. It omits credentials and referrer information, and the address is not saved, included in a badge, or used to seed the creature. The standalone page loads no analytics script.

The packet route is an illustration of the public project/lab story, not real network telemetry. Cases use reserved example domains and a documentation IP address. The browser puzzle is intentionally inspectable; it is not an authentication boundary. Only the curated service inventory is included; no private lab configuration is used.

Use **Start a fresh visit** to replace the pass and clear its puzzle and tour progress. Motion preferences also follow the system reduced-motion setting.
