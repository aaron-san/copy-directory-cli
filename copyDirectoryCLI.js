#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const rootDir = path.resolve(process.env.ROOT_DIR || "./");
const excludeDirs = (
  process.env.EXCLUDE_DIRS || "node_modules,.git,dist"
).split(",");
const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || ".js,.ts").split(
  ","
);
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE_MB || "1") * 1024 * 1024;
const outputPrefix = process.env.OUTPUT_PREFIX || "output";

let outputFileIndex = 1;
let currentSize = 0;
let writeStream = null;

function getOutputFilePath() {
  return path.join(process.cwd(), `${outputPrefix}-${outputFileIndex}.txt`);
}

function openNewWriteStream() {
  if (writeStream) {
    writeStream.end();
  }
  const filePath = getOutputFilePath();
  writeStream = fs.createWriteStream(filePath, { flags: "w" });
  currentSize = 0;
  console.log(`📄 Writing to ${filePath}`);
}

function shouldExclude(filePath) {
  return excludeDirs.some((exclude) =>
    filePath.includes(path.sep + exclude + path.sep)
  );
}

function isHiddenOrInvalid(filePath) {
  const baseName = path.basename(filePath);
  const ext = path.extname(filePath);
  return baseName.startsWith(".") || !allowedExtensions.includes(ext);
}

function writeWithSizeCheck(data) {
  const buffer = Buffer.from(data, "utf-8");

  if (currentSize + buffer.length > maxFileSize) {
    outputFileIndex++;
    openNewWriteStream();
  }

  writeStream.write(buffer);
  currentSize += buffer.length;
}

function processFile(filePath) {
  if (isHiddenOrInvalid(filePath)) return;

  const relativePath = path.relative(rootDir, filePath);
  const content = fs.readFileSync(filePath, "utf-8");

  const header = `--- FILE: ${relativePath} ---\n`;
  const fullContent = `${header}${content}\n\n`;

  writeWithSizeCheck(fullContent);
}

function traverseDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      if (!shouldExclude(fullPath)) {
        traverseDirectory(fullPath);
      }
    } else {
      processFile(fullPath);
    }
  }
}

function main() {
  openNewWriteStream();
  traverseDirectory(rootDir);
  if (writeStream) writeStream.end(() => console.log("✅ All done!"));
}

main();
