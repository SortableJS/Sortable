// es module interop
import { randomBytes } from "crypto";
import { io as IO, readonlyRecord as ROR, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/pipeable";
import Bundler from "parcel-bundler";
import * as path from "path";

const projectDir = path.resolve(__dirname, "../");
const entryDir = path.resolve(projectDir, "./entry");

const randomString: IO.IO<string> = () => randomBytes(8).toString("hex");

interface BundlerOptions extends Bundler.ParcelOptions {
  entryFiles: string | string[];
}

// beats the devil out the constructor in constructor functions!
const bundler = ({ entryFiles, ...options }: BundlerOptions) =>
  new Bundler(entryFiles, options);

// taskEither version of bundler.bundle
const bundle = (bundler: Bundler) =>
  TE.tryCatch(
    () =>
      new Promise((res, rej) => {
        bundler.on("buildEnd", () => res(bundler));
        bundler.on("buildError", rej);
        // return this doesnt mean bundling has finished,
        // which is why we're in a promise statement right now!
        bundler.bundle();
      }),
    (e) => e
  );

// generate a random folder name for the parcel cache
const generateCacheDir = () =>
  path.resolve(projectDir, "./.cache", randomString());

const entryDefault = path.resolve(entryDir, "./entry-defaults.js");

// Sortable.js and Sortable.min.js
const nonmodular = {
  main: bundler({
    entryFiles: entryDefault,
    outDir: projectDir,
    outFile: "./Sortable.js",
    cacheDir: generateCacheDir(),
    minify: false,
    sourceMaps: false,
    scopeHoist: true,
    cache: false,
  }),
  min: bundler({
    entryFiles: entryDefault,
    outDir: projectDir,
    minify: true,
    outFile: "./Sortable.min.js",
    cacheDir: generateCacheDir(),
    sourceMaps: false,
    scopeHoist: true,
    cache: false,
  }),
};

const modularDir = path.resolve(projectDir, "./modular");

// the exports in modular/*
const modular = {
  core: bundler({
    entryFiles: path.resolve(entryDir, "./entry-core.js"),
    outDir: modularDir,
    outFile: "./sortable.core.esm.js",
    cacheDir: generateCacheDir(),
    sourceMaps: false,
    cache: false,
  }),
  complete: bundler({
    entryFiles: path.resolve(entryDir, "./entry-complete.js"),
    outDir: modularDir,
    outFile: "./sortable.complete.esm.js",
    cacheDir: generateCacheDir(),
    sourceMaps: false,
    cache: false,
  }),
  default: bundler({
    entryFiles: entryDefault,
    outDir: modularDir,
    outFile: "./sortable.esm.js",
    cacheDir: generateCacheDir(),
    sourceMaps: false,
    cache: false,
  }),
};

const bundlers = { ...nonmodular, ...modular };

const program = pipe(
  bundlers,
  // bundle each bundler
  ROR.map(bundle),
  // run them in parallel
  ROR.sequence(TE.ApplicativePar)
);

// run the program,
(async () => {
  await program()
    // logging the errors
    .catch(console.error)
    // logging the good stuff
    .then(console.log)
    // ensuring node exits
    .finally(() => process.exit(0));
})();
