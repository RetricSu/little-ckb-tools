import { ccc } from "@ckb-ccc/core";
import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node dist/index.js <outpoint> <output-file>");
    console.error("Example: node dist/index.js 0x1234...abcd:0 build/ckb-script-bin");
    process.exit(1);
  }

  const outpointStr = args[0]!;
  const outputFile = args[1]!;

  // Parse outpoint
  const [txHash, indexStr] = outpointStr.split(":");
  if (!txHash || !indexStr) {
    console.error("Invalid outpoint format. Expected: txHash:index");
    process.exit(1);
  }

  const index = parseInt(indexStr, 10);
  if (isNaN(index)) {
    console.error("Invalid index in outpoint");
    process.exit(1);
  }

  const client = new ccc.ClientPublicMainnet();

  console.log("--- CKB Script Download ---");
  console.log(`Connecting to CKB Mainnet...`);
  console.log(`Fetching cell: ${txHash}:${index}`);

  try {
    const outPoint = { txHash, index };
    const cell = await client.getCell(outPoint);

    if (!cell) {
      console.error("Cell not found or not live");
      process.exit(1);
    }

    console.log(`Cell found! Capacity: ${ccc.fixedPointToString(cell.cellOutput.capacity)} CKB`);

    // Get cell data
    const cellData = cell.outputData;
    if (!cellData || cellData.length === 0) {
      console.error("Cell has no data");
      process.exit(1);
    }

    const cellDataBytes = ccc.bytesFrom(cellData.slice(2), "hex");
    console.log(`Cell data length: ${cellDataBytes.length} bytes`);

    // Ensure output directory exists
    const outputDir = dirname(outputFile);
    mkdirSync(outputDir, { recursive: true });

    // Save binary data
    writeFileSync(outputFile, cellDataBytes);
    console.log(`Saved script binary to: ${outputFile}`);

    // Generate checksum
    const hash = createHash("sha256");
    hash.update(cellDataBytes);
    const checksum = hash.digest("hex");

    // Create checksum file in build/checksums-$(MODE).txt format
    const checksumDir = `${outputDir}/checksums.txt`;
    const checksumContent = `${checksum}  ${outputFile}\n`;

    mkdirSync("build", { recursive: true });
    writeFileSync(checksumDir, checksumContent);
    console.log(`Generated checksum file: ${checksumDir}`);

    console.log("--- Download Complete ---");
    console.log(`Checksum: ${checksum}`);

  } catch (error) {
    console.error("Error downloading script:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
