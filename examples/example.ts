/**
 * Demonstrates generating a key, decoding it, and generating additional keys
 * for the same product, sequence, and user identifiers.
 */
import generateKey from "../lib/generateKey";
import parseKey from "../lib/parseKey";

console.log("Starting application");

/** Random product identifier used throughout this example. */
const productId = Math.floor(Math.random() * 99999);
/** Random sequence number used throughout this example. */
const sequenceNumber = Math.floor(Math.random() * 10);
/** Random user identifier used throughout this example. */
const userId = Math.floor(Math.random() * 9999);
/** Checksum-protected key generated from the example identifiers. */
const dashedKey = generateKey(productId, sequenceNumber, userId);
console.log("Randomly generating values...");
console.log(
  `userId: ${userId}, sequenceNumber: ${sequenceNumber}, productId: ${productId}`,
);
console.log(`dashedKey generated: ${dashedKey}`);
console.log("Parsing the key...");

/** Decoded values embedded in the generated key. */
const convertedObject = parseKey(dashedKey);
console.log(JSON.stringify(convertedObject));

/** Generate ten additional unique keys for the same identifiers. */
for (let i = 0; i < 10; ++i) {
  console.log(generateKey(productId, sequenceNumber, userId));
}
