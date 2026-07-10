import generateKey from "../lib/generateKey";
import parseKey from "../lib/parseKey";

console.log("Starting application");

const productId = Math.floor(Math.random() * 99999);
const sequenceNumber = Math.floor(Math.random() * 10);
const userId = Math.floor(Math.random() * 9999);
const dashedKey = generateKey(productId, sequenceNumber, userId);
console.log("Randomly generating values...");
console.log(
  `userId: ${userId}, sequenceNumber: ${sequenceNumber}, productId: ${productId}`,
);
console.log(`dashedKey generated: ${dashedKey}`);
console.log("Parsing the key...");

const convertedObject = parseKey(dashedKey);
console.log(JSON.stringify(convertedObject));

for (let i = 0; i < 100; ++i) {
  console.log(generateKey(productId, sequenceNumber, userId));
}
