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
 * @returns The decoded numeric value.
 */
function convertBack(key: string): number {
  let retVal: number = 0;
  const size = key.length;
  for (let i = 0; i < size; ++i) {
    const letter = key[i];
    const letterIndex = base.indexOf(letter);
    const multiplier = Math.pow(base.length, size - 1 - i);
    retVal += multiplier * letterIndex;
  }
  return retVal;
}

/**
 * Validates and decodes a generated key.
 *
 * @param key - The hyphen-separated key to parse.
 * @returns The identifiers, timestamp, and salt embedded in the key.
 * @throws {RangeError} If the key does not contain exactly six segments.
 * @throws {ReferenceError} If the key checksum is invalid.
 */
function parseKey(key: string): ParsedKey {
  const parts = key.split("-");
  if (parts.length != 6) {
    throw RangeError("Key is incorrect");
  }

  const convertedUserId = parts[0];
  const convertedSequenceNumber = parts[1];
  const convertedTimeStamp = parts[2];
  const convertedSalt = parts[3];
  const convertedProductId = parts[4];
  const checksum = parts[5];

  const keyWithouthChecksum = [
    parts[0],
    parts[1],
    parts[2],
    parts[3],
    parts[4],
  ].join("-");

  const calculatedChecksum = calculateCheckSum(keyWithouthChecksum);
  if (checksum !== calculatedChecksum) {
    throw ReferenceError("Key is not valid");
  }
  const salt: number = convertBack(convertedSalt);
  const timeStamp: number =
    convertBack(convertedTimeStamp) - Math.floor(salt % base.length);
  const userId: number =
    convertBack(convertedUserId) -
    Math.floor(timeStamp % base.length) -
    Math.floor(salt % base.length);
  const sequenceNumber: number =
    convertBack(convertedSequenceNumber) -
    Math.floor(timeStamp % base.length) -
    Math.floor(salt % base.length);
  const productId: number =
    convertBack(convertedProductId) -
    Math.floor(timeStamp % base.length) -
    Math.floor(salt % base.length);

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
