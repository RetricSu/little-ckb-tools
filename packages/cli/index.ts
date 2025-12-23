#!/usr/bin/env node

import { Command } from "commander";
import { runScriptAnalysis } from "@little-ckb-tools/script-analysis";
import { runScriptDownload } from "@little-ckb-tools/script-download";

const program = new Command();

program
  .name("little-ckb-tools")
  .description("CLI for Little CKB Tools")
  .version("1.0.0");

program
  .command("script-analysis")
  .description("Analyze and list live cells for configured scripts on CKB Mainnet")
  .action(async () => {
    await runScriptAnalysis();
  });

program
  .command("script-download <outpoint> <outputFile>")
  .description("Download CKB script binary from a live cell")
  .action(async (outpoint: string, outputFile: string) => {
    await runScriptDownload([outpoint, outputFile]);
  });

program.parse();
