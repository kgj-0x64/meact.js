# Hackernews Clone

## Architecture

### Based on

My code is just a copy of ["hackernews-remix-react" repository](https://github.com/clintonwoo/hackernews-remix-react) which has been adapted to work with my UI library "Meact.js". I owe much gratitude to its author.

- ! Do note that its auth works with a local LRU cache and is not synchronized with HackerNews API/DB. Also, it doesn't implement all of the app e.g. item's comment (i.e. subitem) on its own page (which I have implemented) etc.

## Framework User Land

### File Name Conventions

See [Naming Conventions](./meact-framework/constants/namingConventions.ts)

- `./app` directory
  - `./app/index.tsx`: entrypoint to pages (thus, to the app) with fixed content
  - `./app/pages/*.tsx` directory: contains pages as compoenents identified by their file names
  - `./app/_app.tsx` file: contains "loader" configuration
- `./server` directory
  - `./server/api/*.ts` directory: contains server-side executables for pages & components
    - components are distinguished by pages and placed out of Express.js routing by strating their names with "\_"
- `./app.server.ts`: instantiate your server resources & services, if any
