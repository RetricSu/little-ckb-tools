import { ccc } from "@ckb-ccc/core";
import type { ClientCollectableSearchKeyLike } from "@ckb-ccc/core/dist.commonjs/advancedBarrel";

interface ScriptConfig {
  name: string;
  codeHash: string;
  hashType: "data" | "type";
  scriptType: "lock" | "type";
}

/**
 * Configurable script definitions. Add more scripts here to check different code hashes.
 */
const scripts: ScriptConfig[] = [
  {
    name: "Nostr Binding Type",
    codeHash:
      "0xb56ea08c4b10b454ed3389bb0e504ecfc57dcfe3089a5030654525a2def2108e",
    hashType: "type",
    scriptType: "type",
  },
  {
    name: "Nostr Lock",
    codeHash:
      "0x641a89ad2f77721b803cd50d01351c1f308444072d5fa20088567196c0574c68",
    hashType: "type",
    scriptType: "lock",
  },
];

export async function runScriptAnalysis() {
  const client = new ccc.ClientPublicMainnet();

  console.log("--- CKB Script Analysis ---");
  console.log(`Connecting to CKB Mainnet...`);

  const allCells: { [key: string]: ccc.Cell[] } = {};

  for (const script of scripts) {
    const searchKey: ClientCollectableSearchKeyLike = {
      script: {
        codeHash: script.codeHash,
        hashType: script.hashType,
        args: "0x",
      },
      scriptSearchMode: "prefix",
      scriptType: script.scriptType,
    };

    const cells: ccc.Cell[] = [];
    console.log(
      `\nQuerying cells with ${script.name} Script, CodeHash: ${script.codeHash}...`
    );

    let totalCapacity = BigInt(0);
    let cellCount = 0;

    // Iterate through all live cells
    for await (const cell of client.findCells(searchKey)) {
      cellCount++;
      totalCapacity += cell.cellOutput.capacity;
      cells.push(cell);
    }

    console.log("\n--- Results ---");
    console.log(`Total Cells Found: ${cellCount}`);
    console.log(`Total Capacity: ${ccc.fixedPointToString(totalCapacity)} CKB`);
    console.log(`Total Capacity (Shannons): ${totalCapacity.toString()}`);
    console.log("------------------------------");

    allCells[script.name] = cells;
  }

  await analyzeCells(allCells);

  process.exit(0);
}

async function analyzeCells(allCells: { [key: string]: ccc.Cell[] }) {
  console.log("\n--- Analytics ---");

  for (const scriptName in allCells) {
    const cells = allCells[scriptName];
    if (!cells) continue;
    console.log(`\nTop 10 Capacity Cells for ${scriptName}:`);
    const sortedCells = cells.sort((a, b) =>
      Number(b.cellOutput.capacity - a.cellOutput.capacity)
    );
    for (let i = 0; i < Math.min(10, sortedCells.length); i++) {
      const cell = sortedCells[i];
      console.log(
        `${i + 1}. Capacity: ${ccc.fixedPointToString(
          cell!.cellOutput.capacity
        )} CKB (outpoint: ${cell!.outPoint.txHash}:${cell!.outPoint.index})`
      );
    }
  }

  console.log("------------------------------");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runScriptAnalysis().catch((err) => {
    console.error("Error executing script:", err);
    process.exit(1);
  });
}
