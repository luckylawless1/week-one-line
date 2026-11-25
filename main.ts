import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Your Week in One Line — u-boge-your-week-in-one-line-d1c14ced
// Gate: /output/entry.txt must be UTF-8 text of 1-100 characters, not only whitespace.
const ENTRY =
  "Shipped 40 entries, fought GitHub's rate limit twice, and still lost to a fridge texting at 3am.";

const chars = [...ENTRY].length;
if (chars < 1 || chars > 100) {
  throw new Error(`entry is ${chars} chars, must be 1-100`);
}
if (!ENTRY.trim()) throw new Error("entry must not be only whitespace");
if (ENTRY.includes("\n")) throw new Error("entry must be a single line");
if (ENTRY !== ENTRY.trim()) throw new Error("entry must not have leading/trailing whitespace");
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) throw new Error("entry must not contain control characters");
const bytes = Buffer.byteLength(ENTRY, "utf8");

const outDir = "/output";
mkdirSync(outDir, { recursive: true });
for (const f of ["entry.txt"]) {
  try {
    rmSync(`${outDir}/${f}`);
  } catch {}
}
writeFileSync(`${outDir}/entry.txt`, ENTRY + "\n", "utf8");

// Read-back verification: the file must hold exactly the entry.
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back !== ENTRY + "\n") throw new Error("read-back mismatch");
console.log(`entry: ${chars} chars / ${bytes} bytes, sha256 ${createHash("sha256").update(back).digest("hex")}`);
console.log(ENTRY);
