# Script Analysis

A tool to analyze and list live cells associated with configurable scripts on CKB Mainnet. Useful for finding outpoints of deployed scripts.

## Usage

Configure the scripts you want to analyze by editing the `scripts` array in `index.ts`, then run:

```bash
pnpm build
pnpm start
```

Each script config includes:

- `name`: A descriptive name for the script
- `codeHash`: The code hash of the script
- `hashType`: Either "data" or "type"
- `scriptType`: Either "lock" or "type"

Example:

```typescript
{
  name: "My Custom Script",
  codeHash: "0x...",
  hashType: "type",
  scriptType: "lock",
}
```

The tool will output statistics about found cells and list the top capacity cells with their outpoints, which can then be used with `script-download` to fetch the actual script binaries.
