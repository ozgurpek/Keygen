import calculateCheckSum from "./calculateCheckSum";
import { base } from "./constants";

/**
 * Converts a non-negative number to its representation in the key character base.
 *
 * @param num - The number to encode.
 * @param length - The length of the keybase
 * @returns The encoded number.
 */
function convert(num: number, length: number): string {
  let retVal: string = "";
  let n: number = num;
  do {
    const mod: number = n % length;
    retVal = base[mod] + retVal;
    n = Math.floor(n / length);
  } while (n > 0);
  return retVal;
}

/**
 * Generates a checksum-protected key containing product, sequence, and user IDs.
 *
 * The key is assembled as six hyphen-separated segments:
 * `userId-sequenceNumber-timestamp-salt-productId-checksum`, with every numeric
 * segment encoded using the project's custom character base. Before encoding,
 * the timestamp and random salt contribute a small offset to each ID. This lets
 * otherwise identical input IDs produce different-looking keys while preserving
 * enough information for {@link parseKey} to reverse the offsets.
 *
 * The final checksum covers the first five segments so parsing can reject keys
 * that were altered or malformed. This is an integrity check, not encryption or
 * a security boundary: callers should not use generated keys to protect secrets.
 *
 * @param productId - The product identifier to include in the key.
 * @param sequenceNumber - The sequence number to include in the key.
 * @param userId - The user identifier to include in the key.
 * @param keyBase - Optional base to be used for key generation
 * @returns A hyphen-separated, checksum-protected key.
 */
function generateKey(
  productId: number,
  sequenceNumber: number,
  userId: number,
  keyBase: string = base
): string {
  const timeStamp = Date.now();
  const salt = Math.floor(Math.random() * 9999999999999);

  const length = keyBase.length;

  // Store a timestamp shifted by the salt-derived offset. `parseKey` first
  // recovers this timestamp, then uses the same offset to recover every ID.
  const saltedTimestamp = timeStamp + Math.floor(salt % length);

  // Apply the same timestamp- and salt-derived offset to all caller-provided
  // IDs. Keeping this calculation identical makes the transformation reversible.
  const productIdWithTimeStamp =
    productId +
    Math.floor(timeStamp % length) +
    Math.floor(salt % length);
  const userIdWithTimeStamp =
    userId +
    Math.floor(timeStamp % length) +
    Math.floor(salt % length);
  const saltedSequenceNumber =
    sequenceNumber +
    Math.floor(timeStamp % length) +
    Math.floor(salt % length);

  const convertedTimeStamp = convert(saltedTimestamp, length);
  const convertedProductId = convert(productIdWithTimeStamp, length);
  const convertedSequenceNumber = convert(saltedSequenceNumber, length);
  const convertedUserId = convert(userIdWithTimeStamp, length);
  const convertedSalt = convert(salt, length);

  // The segment order is part of the on-disk/public key format. Keep it aligned
  // with the corresponding extraction order in `parseKey`.
  let key = [
    convertedUserId,
    convertedSequenceNumber,
    convertedTimeStamp,
    convertedSalt,
    convertedProductId,
  ].join("-");

  // Calculate the checksum before appending it; the checksum itself is not part
  // of the data it validates.
  key += "-" + calculateCheckSum(key);

  return key;
}

export default generateKey;
