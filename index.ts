import { ccc } from "@ckb-ccc/core";
import type { ClientCollectableSearchKeyLike } from "@ckb-ccc/core/dist.commonjs/advancedBarrel";
/**
 * Nostr Binding deployed code hashes on CKB Mainnet
 * https://github.com/cryptape/nostr-binding/tree/main/deployment
 */
const NOSTR_LOCK_CODE_HASH =
  "0x641a89ad2f77721b803cd50d01351c1f308444072d5fa20088567196c0574c68";
const NOSTR_BINDING_TYPE_CODE_HASH =
  "0xb56ea08c4b10b454ed3389bb0e504ecfc57dcfe3089a5030654525a2def2108e";

async function main() {
  const client = new ccc.ClientPublicMainnet();

  console.log("--- CKB Nostr Cell Checker ---");
  console.log(`Connecting to CKB Mainnet...`);

  const searchTypeKey: ClientCollectableSearchKeyLike = {
    script: {
      codeHash: NOSTR_BINDING_TYPE_CODE_HASH,
      hashType: "type",
      args: "0x",
    },
    scriptSearchMode: "prefix",
    scriptType: "type",
  };
  const searchLockKey: ClientCollectableSearchKeyLike = {
    script: {
      codeHash: NOSTR_LOCK_CODE_HASH,
      hashType: "type",
      args: "0x",
    },
    scriptSearchMode: "prefix",
    scriptType: "lock",
  };

  const typeCells: ccc.Cell[] = [];
  const lockCells: ccc.Cell[] = [];

  {
    console.log(
      `\nQuerying cells with Nostr Binding Type Script, CodeHash: ${NOSTR_BINDING_TYPE_CODE_HASH}...`
    );

    let totalCapacity = BigInt(0);
    let cellCount = 0;

    // Iterate through all live cells
    for await (const cell of client.findCells(searchTypeKey)) {
      cellCount++;
      totalCapacity += cell.cellOutput.capacity;
      typeCells.push(cell);
    }

    console.log("\n--- Results ---");
    console.log(`Total Cells Found: ${cellCount}`);
    console.log(`Total Capacity: ${ccc.fixedPointToString(totalCapacity)} CKB`);
    console.log(`Total Capacity (Shannons): ${totalCapacity.toString()}`);
    console.log("------------------------------");
  }

  {
    console.log(
      `\nQuerying cells with Nostr Lock Script, CodeHash: ${NOSTR_LOCK_CODE_HASH}...`
    );

    let totalCapacity = BigInt(0);
    let cellCount = 0;

    // Iterate through all live cells
    for await (const cell of client.findCells(searchLockKey)) {
      cellCount++;
      totalCapacity += cell.cellOutput.capacity;
      lockCells.push(cell);
    }

    console.log("\n--- Results ---");
    console.log(`Total Cells Found: ${cellCount}`);
    console.log(`Total Capacity: ${ccc.fixedPointToString(totalCapacity)} CKB`);
    console.log(`Total Capacity (Shannons): ${totalCapacity.toString()}`);
    console.log("------------------------------");
  }

  await analyzeCells(typeCells, lockCells);

  process.exit(0);
}

async function analyzeCells(typeCells: ccc.Cell[], lockCells: ccc.Cell[]) {
  console.log("\n--- Analytics ---");

  // Analyze Type Script Cells
  console.log("\nTop 10 Capacity Cells for Nostr Binding Type Script:");
  const sortedTypeCells = typeCells.sort((a, b) =>
    Number(b.cellOutput.capacity - a.cellOutput.capacity)
  );
  for (let i = 0; i < Math.min(10, sortedTypeCells.length); i++) {
    const cell = sortedTypeCells[i];
    console.log(
      `${i + 1}. Capacity: ${ccc.fixedPointToString(
        cell!.cellOutput.capacity
      )} CKB (outpoint: ${cell!.outPoint.txHash}:${cell!.outPoint.index})`
    );
  }

  // Analyze Lock Script Cells
  console.log("\nTop 10 Capacity Cells for Nostr Lock Script:");
  const sortedLockCells = lockCells.sort((a, b) =>
    Number(b.cellOutput.capacity - a.cellOutput.capacity)
  );
  for (let i = 0; i < Math.min(10, sortedLockCells.length); i++) {
    const cell = sortedLockCells[i];
    console.log(
      `${i + 1}. Capacity: ${ccc.fixedPointToString(
        cell!.cellOutput.capacity
      )} CKB (outpoint: ${cell!.outPoint.txHash}:${cell!.outPoint.index})`
    );
  }

  console.log("------------------------------");
}

main().catch((err) => {
  console.error("Error executing script:", err);
  process.exit(1);
});
