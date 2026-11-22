# Installation

HTDC is an ESM Node.js package written in TypeScript. It is still early-stage (`0.0.1`), so the recommended way to use it is from source.

## Requirements

- Node.js with ESM support
- [pnpm](https://pnpm.io/) 12.21.0 (pinned by `packageManager` in `package.json`)
- Chromium for Playwright

## Install from source

```sh
git clone https://github.com/sadgabi20/htdc.git
cd htdc
pnpm install
pnpm exec playwright install chromium
```

The last command downloads the browser used to render PDFs. It only needs to be run once per machine.

## Run the bundled examples

```sh
pnpm dlx tsx examples/basic/index.ts
pnpm dlx tsx examples/api/index.ts
```

`examples/basic` uses `.htdc` markup and is the best starting point. `examples/api` shows the advanced programmatic interface.

> The published npm package is currently a placeholder. Use the repository until a runnable package is released.
