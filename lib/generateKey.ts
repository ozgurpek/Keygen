import calculateCheckSum from "./calculateCheckSum";
import { base } from "./constants";

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

    let key = [convertedUserId,
        convertedSequenceNumber,
        convertedTimeStamp,
        convertedSalt,
        convertedProductId].join('-');

    
    key += '-' + calculateCheckSum(key);

    return key;
 }

 export default generateKey;