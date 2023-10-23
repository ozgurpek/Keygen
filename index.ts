// const base = "245679WERTYPASDFGJKLZXCBQ0O1INM";

const base = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM";

function convert(num: number) {
    let retVal: string = "";
    let n: number = num;
    do {
        const mod: number = n % base.length;
        retVal = base[mod] + retVal;
        n = Math.floor(n / base.length);
    }while (n > 0);
    return retVal;
 }

 function checkSumCalculator(keyWithoutCheckSum: string): string {
     let count = 0;
    let sum = 0;
    for (let c of keyWithoutCheckSum) {
        if (c !== '-') {
            const val = base.indexOf(c);
            sum += val;
            if ( count % 2 === 1) {
                sum += val;
            }
            count += 1;
        }
    }

    sum = Math.floor(sum * count % (count + 1));
    sum %= base.length;

    return base[sum];
 }

 function generateKey(productId: number, sequenceNumber: number, userId: number) {
    const timeStamp = Date.now();
    const salt = Math.floor(Math.random() * 9999999999999);
    const saltedTimestamp = timeStamp + Math.floor(salt % base.length);
    const productIdWithTimeStamp = productId + Math.floor(timeStamp % base.length) + Math.floor(salt % base.length);
    const userIdWithTimeStamp = userId + Math.floor(timeStamp % base.length) + Math.floor(salt % base.length);
    const saltedSequenceNumber = sequenceNumber + Math.floor(timeStamp % base.length) + Math.floor(salt % base.length);

    const convertedTimeStamp = convert(saltedTimestamp);
    const convertedProductId = convert(productIdWithTimeStamp);
    const convertedSequenceNumber = convert(saltedSequenceNumber);
    const convertedUserId = convert(userIdWithTimeStamp);
    const convertedSalt = convert(salt);

    let key = convertedUserId + '-' + convertedSequenceNumber + '-' + convertedTimeStamp + '-' + convertedSalt + '-' + convertedProductId;

    
    key += '-' + checkSumCalculator(key);

    return key;
 }

 function convertBack(key: string): number {
     let retVal: number = 0;
     const size = key.length;
     for (let i = 0; i < size; ++i) {
        const letter = key[i];
        const letterIndex = base.indexOf(letter);
        const multiplier = Math.pow(base.length, size - 1 - i);
        retVal += (multiplier * letterIndex);
     }
     return retVal;
 }

function parseKey(key: string): {
            userId: number,
            timeStamp: number,
            sequenceNumber: number,
            salt: number,
            productId: number
        } {
    const parts = key.split('-');
    if (parts.length !=  6) {
        throw RangeError('Key is incorrect');
    }

    const convertedUserId = parts[0];
    const convertedSequenceNumber = parts[1];
    const convertedTimeStamp = parts[2];
    const convertedSalt = parts[3];
    const convertedProductId = parts[4];
    const checksum = parts[5];

    const keyWithouthChecksum = [parts[0], parts[1], parts[2], parts[3], parts[4]].join('-');

    const calculatedChecksum = checkSumCalculator(keyWithouthChecksum);
    if (checksum !== calculatedChecksum) {
        throw ReferenceError("Key is not valid");
    }
    const salt: number = convertBack(convertedSalt);
    const timeStamp: number = convertBack(convertedTimeStamp) - Math.floor(salt % base.length);
    const userId: number = convertBack(convertedUserId) - Math.floor(timeStamp % base.length) - Math.floor(salt % base.length);
    const sequenceNumber: number = convertBack(convertedSequenceNumber) - Math.floor(timeStamp % base.length) - Math.floor(salt % base.length);
    const productId: number = convertBack(convertedProductId) - Math.floor(timeStamp % base.length) - Math.floor(salt % base.length);

    return {
            userId,
            timeStamp,
            sequenceNumber,
            salt,
            productId
        };

}

console.log("Starting application");

const productId = Math.floor(Math.random() * 99999);
const sequenceNumber = Math.floor(Math.random() * 10);
const userId = Math.floor(Math.random() * 9999);
const dashedKey = generateKey(productId, sequenceNumber, userId);
console.log("Randomly generating values...");
console.log(`userId: ${userId}, sequenceNumber: ${sequenceNumber}, productId: ${productId}`);
console.log(`dashedKey generated: ${dashedKey}`);
console.log("Parsing the key...");

const convertedObject = parseKey(dashedKey);
console.log(JSON.stringify(convertedObject));

for (let i = 0; i < 100; ++i) {
   console.log(generateKey(productId, sequenceNumber, userId));
}
