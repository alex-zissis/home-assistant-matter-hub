import * as fs from "node:fs";
import * as path from "node:path";
import { distDir } from "@home-assistant-matter-hub/build-utils";

const packageJsonPath = import.meta.resolve(
  "home-assistant-matter-hub/package.json",
);
const packageDist = distDir(packageJsonPath);
const filename = fs
  .readFileSync(path.join(packageDist, "package-name.txt"), "utf-8")
  .trim();

const packagePath = filename.startsWith("/")
  ? filename
  : path.join(packageDist, filename);
const destinationAddon = path.join(import.meta.dirname, "addon", "package.tgz");
const destinationStandalone = path.join(
  import.meta.dirname,
  "standalone",
  "package.tgz",
);

fs.copyFileSync(packagePath, destinationAddon);
console.log(`Copied ${packagePath} to ${destinationAddon}`);

fs.copyFileSync(packagePath, destinationStandalone);
console.log(`Copied ${packagePath} to ${destinationStandalone}`);

// Copy all patches
const patchesDir = path.join(import.meta.dirname, "..", "..", "patches");
const patchesDestination = path.join(
  import.meta.dirname,
  "standalone",
  "patches",
);

// Create patches directory if it doesn't exist
if (!fs.existsSync(patchesDestination)) {
  fs.mkdirSync(patchesDestination, { recursive: true });
}

// Copy all patch files
const patchFiles = fs.readdirSync(patchesDir);
for (const patchFile of patchFiles) {
  if (patchFile.endsWith(".patch")) {
    fs.copyFileSync(
      path.join(patchesDir, patchFile),
      path.join(patchesDestination, patchFile),
    );
    console.log(`Copied patch ${patchFile} to ${patchesDestination}`);
  }
}
