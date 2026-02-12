import { ClientFunction } from 'testcafe';

fixture`Prettify query parsing`
  .page`http://localhost:8080/tests/prettify-runner.html`;

const runWithAttack = ClientFunction(a => window.__runWithAttack(a));
const getDuration   = ClientFunction(() => window.__duration__);
const getStatus     = ClientFunction(() => window.__status__);

test('run_prettify.js completes within 2000ms', async t => {
  const attack = '?'.repeat(10000) + '=';
  await runWithAttack(attack);
  await t.expect(getDuration()).ok({ timeout: 15000 });
  const status = await getStatus();
  const ms = await getDuration();
  await t.expect(ms).gt(0, `status=${status}`);
  await t.expect(ms).lt(2000, `status=${status}`);
});

