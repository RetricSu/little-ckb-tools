# Script Download

A tool to download CKB script binaries from live cells on the CKB Mainnet.

## Usage

Download a script binary from a specific cell outpoint:

```bash
pnpm build
pnpm start <outpoint> <output-file>
```

### Parameters

- `outpoint`: The transaction hash and index in the format `txHash:index` (e.g., `0x1234...abcd:0`)
- `output-file`: Path where the script binary will be saved (e.g., `script.bin`)

### Example

```bash
pnpm start 0x641a89ad2f77721b803cd50d01351c1f308444072d5fa20088567196c0574c68:0 nostr-lock.bin 
```

This will:
1. Fetch the cell data from the specified outpoint
2. Save the binary data to `nostr-lock.bin`
3. Generate a checksum file at `checksums.txt` in the format compatible with CKB script development toolchains

## Checksum Format

The generated checksum file follows the format used by CKB script development Makefiles:

```
sha256sum build/$(MODE)/* > $(CHECKSUM_FILE)
```

Example checksum file content:
```
a1b2c3d4...  script.bin
```
