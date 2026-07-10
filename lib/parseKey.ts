import calculateCheckSum from "./calculateCheckSum";
import { base } from "./constants";

type ParsedKey = {
  userId: number;
  timeStamp: number;
  sequenceNumber: number;
  salt: number;
  productId: number;
};

/**
 * Converts a value encoded in the key character base back to a number.
 *
 * @param key - The encoded value to decode.
 * @param baseLength - The length of the key base
 * @returns The decoded numeric value.
 */
function convertBack(key: string, baseLength: number): number {
  let retVal: number = 0;
  const size = key.length;
  for (let i = 0; i < size; ++i) {
    const letter = key[i];
    const letterIndex = base.indexOf(letter);
    const multiplier = Math.pow(baseLength, size - 1 - i);
    retVal += multiplier * letterIndex;
  }
  return retVal;
}

/**
 * Validates and decodes a generated key.
 *
 * A valid key has five encoded data segments followed by a checksum. Parsing
 * first verifies that checksum, then decodes the salt and salted timestamp.
 * Those values reproduce the small offset added by {@link generateKey}, which
 * is subtracted from the decoded IDs to restore the original inputs.
 *
 * The checksum detects accidental or simple intentional changes; it does not
 * make the embedded values secret.
 *
 * @param key - The hyphen-separated key to parse.
 * @param keyBase - Optional string to be used as key base
 * @returns The identifiers, timestamp, and salt embedded in the key.
 * @throws {RangeError} If the key does not contain exactly six segments.
 * @throws {ReferenceError} If the key checksum is invalid.
 */
function parseKey(key: string, keyBase: string = base): ParsedKey {
  const parts = key.split("-");
  if (parts.length != 6) {
    throw RangeError("Key is incorrect");
  }

  const baseLength = keyBase.length;

  const convertedUserId = parts[0];
  const convertedSequenceNumber = parts[1];
  const convertedTimeStamp = parts[2];
  const convertedSalt = parts[3];
  const convertedProductId = parts[4];
  const checksum = parts[5];

  // Recreate exactly the portion that `generateKey` checks. The trailing
  // checksum segment must be excluded or validation would never match.
  const keyWithouthChecksum = [
    parts[0],
    parts[1],
    parts[2],
    parts[3],
    parts[4],
  ].join("-");

  const calculatedChecksum = calculateCheckSum(keyWithouthChecksum, keyBase);
  if (checksum !== calculatedChecksum) {
    throw ReferenceError("Key is not valid");
  }

  // The salt is self-contained. Its base-length remainder is the offset added
  // to the timestamp, so recover the timestamp before attempting the IDs.
  const salt: number = convertBack(convertedSalt, baseLength);
  const timeStamp: number =
    convertBack(convertedTimeStamp, baseLength) - Math.floor(salt % baseLength);

  // `generateKey` applied this same offset to every ID. Recompute and subtract
  // it from each decoded segment to reverse the generation transformation.
  const userId: number =
    convertBack(convertedUserId, baseLength) -
    Math.floor(timeStamp % baseLength) -
    Math.floor(salt % baseLength);
  const sequenceNumber: number =
    convertBack(convertedSequenceNumber, baseLength) -
    Math.floor(timeStamp % baseLength) -
    Math.floor(salt % baseLength);
  const productId: number =
    convertBack(convertedProductId, baseLength) -
    Math.floor(timeStamp % baseLength) -
    Math.floor(salt % baseLength);

  return {
    userId,
    timeStamp,
    sequenceNumber,
    salt,
    productId,
  };
}

export default parseKey;
export { ParsedKey };
