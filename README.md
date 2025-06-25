# AI Rules Context Generator

A client-side React and TypeScript application that allows users to assemble context for AI models by selecting and copying content from a collection of Markdown files.

## Features

- **Dynamic Content Loading**: Automatically loads Markdown files from the content directory
- **Development/Production Optimization**: Uses dynamic loading in development and pregenerated manifest in production
- **Metadata Extraction**: Parse frontmatter from Markdown files to extract categories and tags
- **Filtering & Sorting**: Filter files by categories and tags, sort by name or last modified date
- **Multi-Selection**: Select multiple files to include in your context
- **Context Generation**: Concatenate selected Markdown content and copy to clipboard
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-rules-helper.git
cd ai-rules-helper
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Content Files**: Place your Markdown files in the `public/content` directory. You can organize them in subdirectories as needed.

2. **Filter & Sort**: Use the filter panel to narrow down files by categories or tags. Sort files by name or last modified date.

3. **Select Content**: Check the boxes next to files you want to include in your context.

4. **Generate Context**: Click "Copy to Clipboard" to copy the concatenated content of all selected files.

## Markdown Format

The application expects Markdown files with optional YAML frontmatter. Example:

```markdown
---
category: Guidelines
tags: [AI, Rules, Best Practices]
---

# AI Rule: Always verify information

Always verify information before presenting it as fact...
```

## Technical Details

- Built with React and TypeScript
- Uses functional components with React Hooks
- Styled with Tailwind CSS
- Parses Markdown with gray-matter
- Dynamic content loading system with environment-specific optimizations
- Directory middleware for development mode
- Content manifest generation for production builds
- Implements copy-to-clipboard functionality using navigator.clipboard API
- Fully client-side with no backend dependencies

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will:
1. Generate a content manifest file listing all Markdown files in the `public/content` directory
2. Create an optimized production build

The build artifacts will be stored in the `build/` directory, ready for deployment to any static hosting service.

## Content Management

### Development Mode

In development mode, the application dynamically scans the `public/content` directory to find all Markdown files. This allows you to add, remove, or modify content files without restarting the development server.

### Production Mode

In production mode, the application uses a pregenerated content manifest file (`content-manifest.json`) that is created during the build process. This optimizes performance by avoiding directory scanning at runtime.

### Adding Content

To add new content:

1. Create Markdown files with appropriate frontmatter (see Markdown Format section)
2. Place them in the `public/content` directory or subdirectories
3. In development mode, they will be automatically detected
4. For production, rebuild the application to update the content manifest

## License

This project is licensed under the MIT License - see the LICENSE file for details.
