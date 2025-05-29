# Copy Directory CLI

This CLI can be used to copy the content of all files in a directory and append to a text file

## Usage

1. Move to the project directory of any project you wish to gather all containing scripts into a PDF.

```bash
cd project-dir
```

2. run copydir

```bash
copydir
```

The puppeteer package is used to collect content as HTML and render that HTML and save it as a PDF.

## Features:

✅ Support for .js, .ts, .jsx, .tsx
✅ Syntax highlighting using Highlight.js
✅ Roboto Mono font
✅ Wrapping long lines
✅ Writing to a pdf/ subdirectory
✅ Page headers/footers
✅ Auto-opening the pdf/ folder after generation

```bash
npx puppeteer browsers install chrome
```

## Make CLI

1. Add a Shebang to the top of the script

```js
// This helps *nix systems know how to run it, and it won’t interfere with Windows.
#!/usr/bin/env node
```

2. In package.json add a "bin" section like this:

```json
{
  "name": "copydir",
  "version": "1.0.0",
  "main": "codeExporter.js",
  "bin": {
    "copydir": "./codeExporter.js"
  },
  ...
```

3.  Make the Script Executable via npm

```bash
# This tells npm to create a global symlink to your script, making the copydir command available anywhere in the terminal.
npm link

# Overwrite symlink
npm link --force

# To Unlink Later (if needed)
# If you ever want to remove it, just run:

npm unlink -g

```
