import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';
import net from 'net';

const DEV_PORT = 4321;
const BASE_URL = `http://localhost:${DEV_PORT}`;
const OUTPUT_DIR = 'pdfs';

// --- Argument parsing ---
const arg = process.argv[2];
if (!arg) {
  console.error('Usage: pnpm run pdf -- <filename>');
  console.error('Example: pnpm run pdf -- Git_TeamPractices');
  console.error('         pnpm run pdf -- Git_TeamPractices.mdx');
  process.exit(1);
}

const filename = path.basename(arg, '.mdx');   // strip path and extension
const slug = filename.toLowerCase();            // matches Astro's entry.id.toLowerCase()
const pageUrl = `${BASE_URL}/blogs/${slug}`;
const outputPath = path.join(OUTPUT_DIR, `${filename}.pdf`);

// --- Helpers ---

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1500);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => resolve(false));
    socket.connect(port, 'localhost');
  });
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn('pnpm', ['run', 'dev'], {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const onData = (chunk) => {
      const text = chunk.toString().replace(/\x1B\[[0-9;]*m/g, '');
      if (text.includes('localhost')) resolve(proc);
    };

    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);
    proc.on('error', reject);

    // Fallback: give up waiting after 20 s and hope the server is up
    setTimeout(() => resolve(proc), 20_000);
  });
}

// --- Main ---

async function main() {
  let devServer = null;

  const alreadyRunning = await isPortOpen(DEV_PORT);
  if (alreadyRunning) {
    console.log(`Dev server already running on :${DEV_PORT}`);
  } else {
    console.log('Starting Astro dev server...');
    devServer = await startDevServer();
    // Give Astro a moment to finish compiling after announcing the port
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`Generating PDF → ${pageUrl}`);
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Use screen media so Tailwind/daisyui styles render as they appear in the browser
  await page.emulateMediaType('screen');
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30_000 });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '12mm', bottom: '15mm', left: '12mm' },
  });

  await browser.close();

  if (devServer) {
    devServer.kill();
    console.log('Dev server stopped.');
  }

  console.log(`Done — PDF saved to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
