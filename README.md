# Little CKB Tools

A monorepo of tools for CKB (Nervos Network) development.

## Packages

- [ckb-cell-checker](./packages/ckb-cell-checker) - A tool to check cells and capacity associated with configurable scripts on CKB Mainnet.
- [script-analysis](./packages/script-analysis) - Analyzes and lists cells for configured scripts on CKB Mainnet.
- [script-download](./packages/script-download) - Downloads CKB script binaries from live cells and generates checksums.
- [cli](./packages/cli) - Command-line interface for all tools.

## Getting Started

```bash
pnpm install
pnpm build
```

You can also install the CLI globally:

```bash
pnpm add -g @little-ckb-tools/cli
```

Then use:

```bash
little-ckb-tools --help
```

## Usage

Each package has its own README with specific usage instructions.
