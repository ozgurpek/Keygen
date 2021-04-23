const base = "245679WERTYPASDFGJKLZXCBM";

function convert(num: number) {
    let retVal: string = "";
    let n: number = num;
    do {
        const mod: number = Math.floor(n % base.length);
        retVal = base[mod] + retVal;
        n = Math.floor(n / base.length);
    }while (n > 1);
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
    console.log(`timeStamp: ${timeStamp}`);
    const productIdWithTimeStamp = productId + Math.floor(timeStamp % base.length) ;
    const userIdWithTimeStamp = userId + Math.floor(timeStamp % base.length);

    const convertedTimeStamp = convert(timeStamp);
    const convertedProductId = convert(productIdWithTimeStamp);
    const convertedSequenceNumber = convert(sequenceNumber);
    const convertedUserId = convert(userIdWithTimeStamp);

    let key = convertedUserId + '-' + convertedSequenceNumber + '-' + convertedTimeStamp + '-' + convertedProductId;

    
    key += '-' + checkSumCalculator(key);

    return key;
 }

 function convertBack(key: string): number {
     let retVal: number = 0;
     const size = key.length;
     for (let i = size - 1; i >= 0; --i) {
         const multiplier = Math.pow(base.length, size - i - 1);
         const letter = key[i];
         const index = base.indexOf(letter);
         retVal += (multiplier * index);
     }
     return retVal;
 }

function parseKey(key: string): {
            userId: number,
            timeStamp: number,
            sequenceNumber: number,
            productId: number
        } {
    const parts = key.split('-');
    if (parts.length !=  5) {
        throw RangeError('Key is incorrect');
    }

    const convertedUserId = parts[0];
    const convertedSequenceNumber = parts[1];
    const convertedTimeStamp = parts[2];
    const convertedProductId = parts[3];
    const checksum = parts[4];

    const keyWithouthChecksum = [parts[0], parts[1], parts[2], parts[3]].join('-');

    const calculatedChecksum = checkSumCalculator(keyWithouthChecksum);
    if (checksum !== calculatedChecksum) {
        throw ReferenceError("Key is not valid");
    }

    const timeStamp: number = convertBack(convertedTimeStamp);
    const userId: number = convertBack(convertedUserId) - Math.floor(timeStamp % base.length);
    const sequenceNumber: number = convertBack(convertedSequenceNumber);
    const productId: number = convertBack(convertedProductId) - Math.floor(timeStamp % base.length);

    return {
            userId,
            timeStamp,
            sequenceNumber,
            productId
        };

}

console.log("Starting application %%%%%");

const productId = Math.floor(Math.random() * 9999);
const sequenceNumber = Math.floor(Math.random() * 9999);
const userId = Math.floor(Math.random() * 9999);
const dashedKey = generateKey(productId, sequenceNumber, userId);
console.log("Randomly generating values...");
console.log(`userId: ${userId}, sequenceNumber: ${sequenceNumber}, productId: ${productId}`);
console.log(`dashedKey generated: ${dashedKey}`);
console.log("Parsing the key...");

const convertedObject = parseKey(dashedKey);
console.log(JSON.stringify(convertedObject));
