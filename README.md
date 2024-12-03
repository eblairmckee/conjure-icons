# @blairwitch/conjure-icons

A CLI tool and library to generate React Icon components from SVG files. Converts your SVG files into fully typed React components with proper TypeScript support.

## Features

- ✨ Converts SVG files to React components
- 🎯 Generates TypeScript types
- 🎨 Uses `currentColor` for dynamic coloring
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
conjure-icons -i ./assets/icons -o ./src/components/icons
```

### Library Usage

You can also use the package programmatically in your code:

```typescript
import { generateIcons } from "@blairwitch/conjure-icons";

await generateIcons({
  inputDir: "./assets/icons",
  outputDir: "./src/components/icons"
});
```

### Generated Structure

The tool will create the following structure in your output directory:

```
output-directory/
├── components/          # Individual icon components
│   ├── CheckIcon.tsx
│   ├── CloseIcon.tsx
│   └── ...
├── types/              # TypeScript type definitions
│   └── types.ts
└── index.ts           # Barrel file exporting all icons
```

### Using Generated Icons

```tsx
import { CheckIcon, CloseIcon } from "./components/icons";

function MyComponent() {
  return (
    <div>
      <CheckIcon className="w-6 h-6 text-green-500" />
      <CloseIcon className="w-6 h-6 text-red-500" />
    </div>
  );
}
```

### Styling Icons

The generated icons use `currentColor` for both `stroke` and `fill` (unless `fill="none"`), making them easy to style with CSS:

```css
/* Using CSS classes */
.icon-success {
  color: green;
  width: 24px;
  height: 24px;
}

/* Using Tailwind classes */
<CheckIcon className="w-6 h-6 text-green-500" />
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
