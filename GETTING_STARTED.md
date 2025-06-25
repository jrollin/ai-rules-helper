# Getting Started with AI Rules Context Generator

This guide will help you get the AI Rules Context Generator up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn

## Installation Steps

1. **Install dependencies**

```bash
cd /home/julien/projects/ai-rules-helper
npm install
```

2. **Start the development server**

```bash
npm start
```

This will launch the application in development mode. Open [http://localhost:3000](http://localhost:3000) in your browser to view it.

## Testing with Sample Files

We've included sample Markdown files in the `sample` directory to help you test the application:

1. In the application, click "Select Markdown Files"
2. Navigate to the `sample` directory and select the `.md` files
3. Explore the filtering, sorting, and selection features
4. Generate context by selecting files and clicking "Copy to Clipboard"

## Building for Production

When you're ready to deploy the application:

```bash
npm run build
```

This creates an optimized production build in the `build` folder that you can deploy to any static hosting service.

## Troubleshooting

- If you encounter issues with file selection, ensure your browser supports the File API
- For directory selection, note that not all browsers support the `webkitdirectory` attribute
- If you can't copy to clipboard, check that your browser allows clipboard access
