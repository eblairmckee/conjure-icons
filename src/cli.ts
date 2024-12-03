#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import { generateIcons } from ".";

interface CliOptions {
  input: string;
  output: string;
}

const program = new Command();

program
  .name("conjure-icons")
  .description("Generate React Icon components from SVG files")
  .requiredOption(
    "-i, --input <directory>",
    "Input directory containing SVG files"
  )
  .requiredOption(
    "-o, --output <directory>",
    "Output directory for generated components"
  )
  .action(async (options: CliOptions) => {
    try {
      const inputDir = path.resolve(options.input);
      const outputDir = path.resolve(options.output);

      await generateIcons({
        inputDir,
        outputDir
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
      process.exit(1);
    }
  });

program.parse();
