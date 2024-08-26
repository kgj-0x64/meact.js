# Meact Framework

## What Is It?

See [Meact.js = My (implementation of) React.js](../README.md)

This "Multi-Page Application" framework takes that Meact.js library (that is, "meact" and "meact-dom" implementations) and serves pages using Express.js server with "pages" directory as router like Next.js. Pages are generated on demand using tree-shaken and code-split JavaScript bundles (and chunks) which were generated at build time for each page.

### Out of scope

- All DOM manipulation (rendering) happens on the client-side only, there is no server-side rendering like Next.js or Remix.js.

- This is not a Single Page Application (SPA) since there is no client-side routing, and all pages are fetched by making a GET request to the server.

## How To Use

See [HackerNews Clone app built using it](../hackernews-clone/README.md)
