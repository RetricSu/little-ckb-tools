# CLI

Command-line interface for Little CKB Tools.

## Installation

```bash
pnpm install -g @little-ckb-tools/cli
```

## Usage

```bash
little-ckb-tools --help
```

### Commands

- `script-analysis`: Analyze and list live cells for configured scripts on CKB Mainnet
- `script-download <outpoint> <outputFile>`: Download CKB script binary from a live cell

### Examples

```bash
# Analyze scripts
little-ckb-tools script-analysis

# Download a script
little-ckb-tools script-download 0x1234...abcd:0 script.bin --mode release
```
