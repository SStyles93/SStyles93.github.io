import fs from "fs";
import path from "path";

// 📁 Root images folder
const rootDir = "./src/assets/blogs";

// 📄 Output files
const outputFile = path.join(rootDir, "index.ts");
const typeFile = path.join(rootDir, "index.d.ts");

// Supported image extensions
const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

// Clean old files if exist
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
if (fs.existsSync(typeFile)) fs.unlinkSync(typeFile);

// Recursively collect image paths
function collectImages(folderPath, relativePath = "") {
  const files = fs.readdirSync(folderPath, { withFileTypes: true });

  let imageEntries = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file.name);
    const fileRelativePath = path.join(relativePath, file.name);

    if (file.isDirectory()) {
      imageEntries = imageEntries.concat(collectImages(filePath, path.join(relativePath, file.name)));
    } else if (allowedExtensions.includes(path.extname(file.name).toLowerCase())) {
      const ext = path.extname(file.name).toLowerCase().slice(1); // without dot
      const baseName = fileRelativePath
        .replace(/\\/g, "/")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_]/g, "_");
      const importPath = `./${fileRelativePath.replace(/\\/g, "/")}`;
      const exportName = `${baseName}_${ext}`;
      imageEntries.push({ exportName, importPath });
    }
  }

  return imageEntries;
}

// Collect images
const images = collectImages(rootDir);

// Generate index.ts content
const exportLines = images.map(({ exportName, importPath }) =>
  `export { default as ${exportName} } from "${importPath}";`
);
fs.writeFileSync(outputFile, exportLines.join("\n") + "\n");

// Generate index.d.ts content
const typeLines = [
  'declare module "*";',
  "",
  "export declare const images: {",
  ...images.map(({ exportName }) => `  ${exportName}: string;`),
  "};"
];
fs.writeFileSync(typeFile, typeLines.join("\n") + "\n");

console.log(`✅ Generated ${outputFile} and ${typeFile} with ${images.length} exports.`);
