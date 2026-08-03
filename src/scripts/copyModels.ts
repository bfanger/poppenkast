import fs from "node:fs";
import path from "node:path";

const target = "public/mediapipe_hands";
const src = path.resolve("node_modules/@mediapipe/hands");
const dest = path.resolve(target);

fs.mkdirSync(dest, { recursive: true });

console.info("Copying @mediapipe/hands:");
function copyDir(srcDir: string, destDir: string) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      const relative = path.relative(dest, destPath);
      console.info(`  ${target}/${relative}`);
    }
  }
}

copyDir(src, dest);
