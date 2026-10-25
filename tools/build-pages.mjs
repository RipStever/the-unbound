// Builds the GitHub Pages site into _site/.
// index.html is written as a page fragment (the claude.ai artifact wraps it in its own skeleton),
// so for Pages we wrap it in a full document with phone-friendly meta tags and add the web app files.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, '_site');
mkdirSync(out, { recursive: true });

const src = readFileSync(join(root, 'index.html'), 'utf8');
const split = src.indexOf('<div id="rotate"');
if (split < 0) throw new Error('index.html: could not find where the page body starts');
const head = src.slice(0, split).trim();
const body = src.slice(split).trim();

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="theme-color" content="#0b0716">
<meta name="description" content="Walk backward through broken time toward the rift.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="The Unbound">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon.svg">
${head}
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(join(out, 'index.html'), page);
for (const f of readdirSync(join(root, 'web'))) copyFileSync(join(root, 'web', f), join(out, f));
console.log('built _site/ (' + Math.round(page.length / 1024) + ' KB)');
