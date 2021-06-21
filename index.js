// Collision test
// theory 0.001 probability is enough for any pre-determined base and max ids.
const { StaticPool } = require("node-worker-threads-pool");
const os = require("os");
const path = require("path");

const { base32CharacterSet: characterSet } = require('./constants');

const collisionProbability = 0.001;
const numberOfIds = 10 ** 7;
const base = characterSet.length;
// c = log(n^2 / 2p) / log(b)
const lengthOfId = Math.ceil(
  Math.log(numberOfIds ** 2 / (2 * collisionProbability)) / Math.log(base)
);
const poolSize = os.cpus().length;

console.log({
  collisionProbability,
  numberOfIds,
  base,
  lengthOfId,
  poolSize,
});
 

async function collisionTest() {
  const idSet = new Set();
  const collisionSet = new Set();

  const pool = new StaticPool({
    size: poolSize,
    task: path.resolve(__dirname, "./thread-worker.js"),
    workerData: [],
  });

  const idsToGenerate = numberOfIds;
  const promises = [];
  for (let i = 0; i < poolSize; i += 1) {
    promises.push(pool.exec(idsToGenerate / poolSize))
  }

  const results = (await Promise.all(promises)).flat();
  pool.destroy();

  for (let i = 0; i < results.length; i += 1) {
    const id = results[i];
    if (!idSet.has(id)) {
      idSet.add(id);
    } else {
      collisionSet.add(id);
    }
  }
  
  const collisions = collisionSet.size;
  const ratioOfCollisions = collisions / idsToGenerate;
  console.log(`Got ${collisions} collisions`);

  // if (ratioOfCollisions > 0) {
  //   console.log(ratioOfCollisions);
  // }
  return ratioOfCollisions;
}

(async () => {
  let sum = 0;
  let worstCase = 0;
  const runs = 10;
  console.log('Going to run collision test', runs, 'times and then compute the average and worst case:');
  for (let i = 0; i < runs; i += 1) {
    console.log('Run', i + 1);
    const ratio = await collisionTest();
    sum += ratio;
    worstCase = Math.max(worstCase, ratio);
  }
  
  console.log('Average of', runs, 'runs =', sum / runs);
  console.log('Worst Case =', worstCase);
})();