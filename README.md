# CKB Cell Checker

A simple script to check cells and capacity associated with configurable scripts on CKB Mainnet.

## Usage

To check different scripts, edit the `scripts` array in `index.ts` and add your script configurations.

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

Then run:

```bash
pnpm run build
pnpm start
```
