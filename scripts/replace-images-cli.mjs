import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPathRaw = process.argv[2];
if (!inputPathRaw) {
  console.error('❌ Please provide the path to the .mdx file as an argument.');
  process.exit(1);
}
const inputPath = path.normalize(inputPathRaw);
if (!fs.existsSync(inputPath)) {
  console.error(`❌ File not found: ${inputPath}`);
  process.exit(1);
}

let content = fs.readFileSync(inputPath, 'utf-8');

/**
 * Regex breakdown:
 * !\[ (.*?) \]             → alt text (group 1)
 * \(                      → open parenthesis
 * \/*src[\\/]+assets[\\/]+blogs[\\/]+([^\\/]+)[\\/]+([^\s\)]+)  → folder (group 2) and filename (group 3) (stops at space or ')')
 * (?:\s+"([^"]*)")?       → optional title attribute inside quotes (group 4)
 * \)                      → close parenthesis
 */
const imageRegex = /!\[(.*?)\]\(\/*src[\\/]+assets[\\/]+blogs[\\/]+([^\\/]+)[\\/]+([^\s\)]+)(?:\s+"([^"]*)")?\)/g;

const newContent = content.replace(imageRegex, (match, altText, folder, fileName, title) => {
  // Default class
  let imageClass = 'w-full';

  // If title exists and contains percentage, extract number
  if (title) {
    const percentMatch = title.match(/(\d+)%/);
    if (percentMatch) {
      imageClass = `w-${percentMatch[1]}`;
    }
  }

  const variableName = `images.${folder}_${fileName.replace(/\./g, '_')}`;

  return `<Image src={${variableName}} alt="${altText}" class="${imageClass}"/>`;
});

fs.writeFileSync(inputPath, newContent);
console.log(`✅ Images replaced successfully in: ${inputPath}`);
