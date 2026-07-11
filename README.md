# Keygen

`Keygen` is a small TypeScript library for creating readable, checksum-protected
keys that carry a product ID, sequence number, and user ID. A generated key can
be parsed later to recover those values, along with the timestamp and random
salt used when it was created.

Each key has six hyphen-separated segments:

```
userId-sequenceNumber-timestamp-salt-productId-checksum
```

By default, numeric values are encoded with the project's uppercase
alphanumeric character set. A custom key base can be supplied when generating
and parsing a key. The final checksum validates the preceding segments and
helps detect malformed or modified keys.

> This is an integrity check, not encryption or access control. The values in a
> key can be decoded by anyone with this library, so do not put secrets in it or
> use it as the only authorization mechanism.

## Install and build

This project requires Node.js and npm.

```bash
npm install
npm run build
```

Compiled JavaScript is emitted alongside the TypeScript source files.

## Usage

```ts
import { generateKey, parseKey } from "@ozgurpek/keygen";

const key = generateKey(42, 7, 1234);
// Example shape: 1AB-9K-...-Q

const parsed = parseKey(key);

const keyBase = "0123456789ABCDEF";
const customBaseKey = generateKey(42, 7, 1234, keyBase);
const customBaseParsed = parseKey(customBaseKey, keyBase);

console.log(parsed);
// {
//   userId: 1234,
//   sequenceNumber: 7,
//   productId: 42,
//   timeStamp: 1710000000000,
//   salt: 987654321
// }
```

`generateKey(productId, sequenceNumber, userId, keyBase?)` produces a new key.
Its timestamp and random salt mean repeated calls with the same IDs normally
create different keys. Omit `keyBase` to use the default base.

`parseKey(key, keyBase?)` checks the key format and checksum, then returns:

- `userId`
- `sequenceNumber`
- `productId`
- `timeStamp` — generation time in Unix milliseconds
- `salt` — random value used while generating the key

`parseKey` throws a `RangeError` when the key does not have six segments and a
`ReferenceError` when its checksum is invalid.

When generating a key with `keyBase`, pass that same value to `parseKey`.

## Example

Build first, then run the included example:

```bash
npm run build
node examples/example.js
```

## Test

```bash
npm test
```

The test suite verifies that generated keys parse successfully and preserve the
input product, sequence, and user IDs.
