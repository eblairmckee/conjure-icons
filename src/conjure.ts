import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";
import { format } from "prettier";
import type { HTMLElement } from "node-html-parser";

export interface IconGeneratorOptions {
  inputDir: string;
  outputDir: string;
}

interface IconInfo {
  original: string;
  clean: string;
  pascal: string;
  wasModified: boolean;
}

const convertSvgToJsx = async (svgContent: string): Promise<string> => {
  const cleanedContent = svgContent
    .replace(/<\?xml.*?\?>/g, "")
    .replace(/<!DOCTYPE.*?>/g, "");

  const root = parse(cleanedContent);
  const svg = root.querySelector("svg");

  if (!svg) {
    throw new Error("No SVG element found");
  }

  const viewBox = svg.getAttribute("viewBox") || "0 0 24 24";
  svg.removeAttribute("class");

  const convertAttributes = (el: HTMLElement) => {
    const attrs = el.attributes;
    Object.keys(attrs).forEach((attr) => {
      if (attr.includes("-")) {
        const camelCase = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        el.setAttribute(camelCase, attrs[attr]);
        el.removeAttribute(attr);
      }
    });

    if (el.getAttribute("stroke")) {
      el.setAttribute("stroke", "currentColor");
    }
    if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
      el.setAttribute("fill", "currentColor");
    }
  };

  convertAttributes(svg);
  svg.querySelectorAll("*").forEach((el) => convertAttributes(el));

  const jsx = `
    import React, { forwardRef, type SVGProps } from "react";

    const Icon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, ref) => (
      <svg
        width="1em"
        height="1em"
        viewBox="${viewBox}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        ${svg.innerHTML}
      </svg>
    ));

    Icon.displayName = "Icon";
    
    export default Icon;
  `;

  return format(jsx, { parser: "typescript" });
};

const cleanFileName = (str: string): string =>
  str
    .replace(".svg", "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9-_]/g, "");

const toPascalCase = (str: string): string => {
  const pascal = str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  return /^\d/.test(pascal) ? `Icon${pascal}` : pascal;
};

export const generateIcons = async ({
  inputDir,
  outputDir
}: IconGeneratorOptions): Promise<void> => {
  const componentsDir = path.join(outputDir, "components");
  const typesDir = path.join(outputDir, "types");
  const utilsDir = path.join(outputDir, "utils");

  [componentsDir, typesDir, utilsDir].forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });

  const svgFiles = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith(".svg"));

  const iconMap: IconInfo[] = svgFiles.map((file) => {
    const original = file.replace(".svg", "");
    const clean = cleanFileName(original);
    return {
      original,
      clean,
      pascal: toPascalCase(clean),
      wasModified: original !== clean
    };
  });

  // Generate components
  for (const { original, pascal } of iconMap) {
    const svgContent = fs.readFileSync(
      path.join(inputDir, `${original}.svg`),
      "utf8"
    );
    const jsxContent = await convertSvgToJsx(svgContent);
    fs.writeFileSync(path.join(componentsDir, `${pascal}Icon.tsx`), jsxContent);
    console.log(`✓ Generated: ${pascal}Icon`);
  }

  // Generate types
  const typeDefinition = `// This file is auto-generated. Do not edit manually
export type IconName = ${iconMap.map(({ clean }) => `'${clean}'`).join(" | ")};`;

  // Generate icon map
  const iconMapContent = `// This file is auto-generated. Do not edit manually
import type { FC, SVGProps } from "react";
import type { IconName } from "../types/types";

${iconMap
  .map(
    ({ pascal }) => `import ${pascal}Icon from "../components/${pascal}Icon";`
  )
  .join("\n")}

type IconComponent = FC<SVGProps<SVGSVGElement>>;

export const IconMap: Record<IconName, IconComponent> = {
${iconMap.map(({ clean, pascal }) => `  "${clean}": ${pascal}Icon,`).join("\n")}
} as const;

${
  iconMap.filter(({ wasModified }) => wasModified).length > 0
    ? `\n// Name transformations applied:\n${iconMap
        .filter(({ wasModified }) => wasModified)
        .map(({ original, clean }) => `// - "${original}" → "${clean}"`)
        .join("\n")}`
    : ""
}`;

  fs.writeFileSync(path.join(typesDir, "types.ts"), typeDefinition);
  fs.writeFileSync(path.join(utilsDir, "icon-map.ts"), iconMapContent);

  // Generate index file
  const indexContent = `export type { IconName } from './types/types';
export { IconMap } from './utils/icon-map';
${iconMap
  .map(
    ({ pascal }) =>
      `export { default as ${pascal}Icon } from './components/${pascal}Icon';`
  )
  .join("\n")}`;

  fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent);

  console.log(`\n✓ Generated ${iconMap.length} icons`);
  console.log("✓ Created index file");
  console.log("✓ Created types file");
  console.log("✓ Created icon map");
};
