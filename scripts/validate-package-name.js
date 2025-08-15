#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (err) {
  console.error('Error: could not read package.json:', err.message);
  process.exit(2);
}

const name = String(pkg.name || '');
// Rules: lowercase letters, digits, dots, underscores, hyphens; up to 100 chars; must not contain '---'
const isValid = /^(?!.*---)[a-z0-9._-]{1,100}$/.test(name);

if (!isValid) {
  console.error(`Invalid project name: "${name}"`);
  console.error("Rules: 1-100 chars; lowercase letters (a-z), digits (0-9), and the characters '.', '_', '-' are allowed; the sequence '---' is not allowed.");
  process.exit(1);
}

console.log(`Project name OK: "${name}"`);
process.exit(0);
