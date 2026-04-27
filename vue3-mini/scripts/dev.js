import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild";

const args = minimist(process.argv.slice(2));
const target = args._[0];
const format = args.f || "global";
const filename = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);
const pkg = require(`../packages/${target}/package.json`);

const __dirname = dirname(filename);
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
console.log(args);

esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(
      __dirname,
      `../packages/${target}/dist/${target}.${format}-bundler.js`,
    ),
    bundle: true,
    format,
    sourcemap: true,
    platform: "browser",
    globalName: pkg.buildOptions?.name,
  })
  .then((ctx) => {
    ctx.watch();
    console.log("watching...");
  });
