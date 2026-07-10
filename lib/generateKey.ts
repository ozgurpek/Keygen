import calculateCheckSum from "./calculateCheckSum";
import { base } from "./constants";

/**
 * Converts a non-negative number to its representation in the key character base.
 *
 * @param num - The number to encode.
 * @returns The encoded number.
 */
function convert(num: number): string {
  let retVal: string = "";
  let n: number = num;
  do {
    const mod: number = n % base.length;
    retVal = base[mod] + retVal;
    n = Math.floor(n / base.length);
  } while (n > 0);
  return retVal;
}

/**
 * Generates a checksum-protected key containing product, sequence, and user IDs.
 *
 * The generated key also embeds the current timestamp and a random salt.
 *
 * @param productId - The product identifier to include in the key.
 * @param sequenceNumber - The sequence number to include in the key.
 * @param userId - The user identifier to include in the key.
 * @returns A hyphen-separated, checksum-protected key.
 */
function generateKey(
  productId: number,
  sequenceNumber: number,
  userId: number,
): string {
  const timeStamp = Date.now();
  const salt = Math.floor(Math.random() * 9999999999999);
  const saltedTimestamp = timeStamp + Math.floor(salt % base.length);
  const productIdWithTimeStamp =
    productId +
    Math.floor(timeStamp % base.length) +
    Math.floor(salt % base.length);
  const userIdWithTimeStamp =
    userId +
    Math.floor(timeStamp % base.length) +
    Math.floor(salt % base.length);
  const saltedSequenceNumber =
    sequenceNumber +
    Math.floor(timeStamp % base.length) +
    Math.floor(salt % base.length);

  const convertedTimeStamp = convert(saltedTimestamp);
  const convertedProductId = convert(productIdWithTimeStamp);
  const convertedSequenceNumber = convert(saltedSequenceNumber);
  const convertedUserId = convert(userIdWithTimeStamp);
  const convertedSalt = convert(salt);

  let key = [
    convertedUserId,
    convertedSequenceNumber,
    convertedTimeStamp,
    convertedSalt,
    convertedProductId,
  ].join("-");

  key += "-" + calculateCheckSum(key);

  return key;
}

export default generateKey;
