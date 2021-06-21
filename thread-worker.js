const { parentPort, workerData } = require("worker_threads");
const { base32CharacterSet: characterSet } = require('./constants');

const collisionProbability = 0.001;
const numberOfIds = 10 ** 7;
// const attackersCapacity = 100 * 60 * 60;
const base = characterSet.length;
// c = log(n^2 / 2p) / log(b)
const lengthOfId = Math.ceil(
  Math.log(numberOfIds ** 2 / (2 * collisionProbability)) / Math.log(base)
);

function generateUniqueId() {
  const chars = [];
  for (let i = 0; i < lengthOfId; i += 1) {
    chars.push(characterSet[Math.random() * base | 0]);
  }
  return chars.join('');
}
 
// Main thread will pass the data you need
// through this event listener.
parentPort.on("message", (numberOfIds) => {
  const results = []
  for (let i = 0; i < numberOfIds; i += 1) {
    results.push(generateUniqueId());
  }
  // return the result to main thread.
  parentPort.postMessage(results);
});