import {
  console as C,
  either as E,
  reader as R,
  readerTaskEither as RTE,
  task as T,
  taskEither as TE,
} from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
// es-module-interop must be set to true in ts-config
// some types for testcafe are in global namespace
import createTestCafe from "testcafe";

export const makeTestCafe = TE.tryCatchK(createTestCafe, (e) => e);

// run test and clean up with testcafe.close()
const runTests = (settings: (runner: Runner) => Runner) =>
  TE.bracket(
    makeTestCafe(),
    (testcafe) =>
      TE.tryCatch(
        () => pipe(testcafe.createRunner(), settings, (runner) => runner.run()),
        (e) => e
      ),
    (testcafe) =>
      TE.tryCatch(
        () => testcafe.close(),
        (e) => e
      )
  );

// if failed count is 0, it passes
const makeTestResults = flow(
  E.fromPredicate(
    (n: number) => n === 0,
    (n) => `Tests did not all pass, with a total of "${n}" failing.`
  ),
  E.map((n) => `All tests passed: a total of "${n}" failed`)
);

// console error/log the result.
// return the error code, 0 for success, 1 for fail
const teLog = TE.fold(
  flow(
    T.fromIOK(C.error),
    T.map(() => 1)
  ),
  flow(
    T.fromIOK(C.log),
    T.map(() => 0)
  )
);

// settings used for these tests
const settings = (runner: Runner): Runner =>
  runner
    .src("./tests/e2e-local/Sortable.test.js")
    .browsers("firefox:headless")
    .concurrency(3);

export const program = pipe(
  runTests,
  RTE.chain((n) => RTE.fromEitherK(makeTestResults)(n)),
  R.map(teLog)
);

program(settings)().then(process.exit);
