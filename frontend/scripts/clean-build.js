#!/usr/bin/env node
// Limpia build/index.html de los scripts que solo sirven para la vista previa de Emergent.
const fs = require("fs");
const path = require("path");

const file = path.join(path.resolve(process.argv[2] || path.join(__dirname, "..", "build")), "index.html");
if (!fs.existsSync(file)) process.exit(0);

const before = fs.readFileSync(file, "utf8");
const after = before
  .replace(/<script[^>]*src="https:\/\/assets\.emergent\.sh[^"]*"[^>]*><\/script>/g, "")
  .replace(/<script>[^<]*PerformanceServerTiming[^<]*<\/script>/g, "");
fs.writeFileSync(file, after);
console.log(`[clean-build] Scripts de Emergent eliminados: ${before.length !== after.length ? "sí" : "no había"}`);
