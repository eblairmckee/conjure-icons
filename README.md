# @blairwitch/conjure-icons

A CLI tool and library to conjure fully typed React Icon components from SVG files with proper Typescript support, and CSS custom properties --because why not?

## Features

- ✨ Converts SVG files to React components
- 🎯 Generates TypeScript types and IconMap
- 🎨 Configurable styling with CSS variables
- 📦 Can be used as a CLI tool or library
- 🔄 Handles kebab-case to PascalCase conversion
- 🎁 Generates index file for easy importing
- 💪 Maintains SVG viewBox and structure
- 🔧 Fully typed with TypeScript

## Installation

```bash
# Install globally to use as a CLI tool
npm install -g @blairwitch/conjure-icons

# Or install locally in your project
npm install @blairwitch/conjure-icons --save-dev
```

## Usage

### CLI Usage

```bash
conjure-icons -i <input-directory> -o <output-directory>
```

#### Options

- `-i, --input <directory>`: Directory containing SVG files (required)
- `-o, --output <directory>`: Output directory for generated components (required)
- `-v, --version`: Display version number
- `-h, --help`: Display help information

#### Example

```bash
conjure-icons -i ./assets/icons -o ./src/icons
```

will output:

```
output-directory/
├── icons/          # Individual icon components
│   ├── CheckIcon.tsx
│   ├── CloseIcon.tsx
│   └── ...
├── types/              # TypeScript type definitions
│   └── icon-types.ts        # Contains IconName type
├── utils/
│   └── icon-map.ts     # Maps icon names to components
└── index.ts           # Exports everything
```

### Library Usage

You can also use the package programmatically in your code:

```typescript
import { generateIcons } from "@blairwitch/conjure-icons";

await generateIcons({
  inputDir: "./assets/icons",
  outputDir: "./src/icons"
});
```

### Using Generated Icons

#### Direct Component Usage

```tsx
import { CheckIcon, CloseIcon } from "./icons";

function MyComponent() {
  return <CheckIcon />;
}
```

#### Using the IconMap

```tsx
import { IconMap, type IconName } from "./icons";

// Type-safe icon name
const iconName: IconName = "check";

function DynamicIcon({ name }: { name: IconName }) {
  const Icon = IconMap[name];
  return <Icon className="icon-wrapper" />;
}
```

### Styling Icons

The generated icons are designed to be flexible with styling:

```css
/* Size control - icons fill their container */
.icon-wrapper {
  width: 24px;
  height: 24px;
}

/* Color control */
.icon-success {
  /* For filled icons */
  color: green;

  /* For stroked icons */
  --icon-stroke: #00ff00;
}

/* Using with Tailwind */
<div className="w-6 h-6 text-green-500">
  <CheckIcon />
</div>
```

#### Styling Properties

- Icons use `width: 100%` and `height: 100%` to fill their container
- Fill colors use `currentColor` (controlled via CSS `color` property)
- Stroke colors use `var(--icon-stroke, inherit)` (falls back to inherited color)
