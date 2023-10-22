"use strict";
var base = "245679WERTYPASDFGJKLZXCBM0O1INM";
function convert(num) {
    var retVal = "";
    var n = num;
    do {
        var mod = Math.floor(n % base.length);
        retVal = base[mod] + retVal;
        n = Math.floor(n / base.length);
    } while (n > 1);
    return retVal;
}
function checkSumCalculator(keyWithoutCheckSum) {
    var count = 0;
    var sum = 0;
    for (var _i = 0, keyWithoutCheckSum_1 = keyWithoutCheckSum; _i < keyWithoutCheckSum_1.length; _i++) {
        var c = keyWithoutCheckSum_1[_i];
        if (c !== '-') {
            var val = base.indexOf(c);
            sum += val;
            if (count % 2 === 1) {
                sum += val;
            }
            count += 1;
        }
    }
    sum = Math.floor(sum * count % (count + 1));
    sum %= base.length;
    return base[sum];
}
function generateKey(productId, sequenceNumber, userId) {
    var timeStamp = Date.now();
    console.log("timeStamp: " + timeStamp);
    var productIdWithTimeStamp = productId + Math.floor(timeStamp % base.length);
    var userIdWithTimeStamp = userId + Math.floor(timeStamp % base.length);
    var convertedTimeStamp = convert(timeStamp);
    var convertedProductId = convert(productIdWithTimeStamp);
    var convertedSequenceNumber = convert(sequenceNumber);
    var convertedUserId = convert(userIdWithTimeStamp);
    var key = convertedUserId + '-' + convertedSequenceNumber + '-' + convertedTimeStamp + '-' + convertedProductId;
    key += '-' + checkSumCalculator(key);
    return key;
}
function convertBack(key) {
    var retVal = 0;
    var size = key.length;
    for (var i = size - 1; i >= 0; --i) {
        var multiplier = Math.pow(base.length, size - i - 1);
        var letter = key[i];
        var index = base.indexOf(letter);
        retVal += (multiplier * index);
    }
    return retVal;
}
function parseKey(key) {
    var parts = key.split('-');
    if (parts.length != 5) {
        throw RangeError('Key is incorrect');
    }
    var convertedUserId = parts[0];
    var convertedSequenceNumber = parts[1];
    var convertedTimeStamp = parts[2];
    var convertedProductId = parts[3];
    var checksum = parts[4];
    var keyWithouthChecksum = [parts[0], parts[1], parts[2], parts[3]].join('-');
    var calculatedChecksum = checkSumCalculator(keyWithouthChecksum);
    if (checksum !== calculatedChecksum) {
        throw ReferenceError("Key is not valid");
    }
    var timeStamp = convertBack(convertedTimeStamp);
    var userId = convertBack(convertedUserId) - Math.floor(timeStamp % base.length);
    var sequenceNumber = convertBack(convertedSequenceNumber);
    var productId = convertBack(convertedProductId) - Math.floor(timeStamp % base.length);
    return {
        userId: userId,
        timeStamp: timeStamp,
        sequenceNumber: sequenceNumber,
        productId: productId
    };
}
console.log("Starting application %%%%%");
var productId = Math.floor(Math.random() * 9999);
var sequenceNumber = Math.floor(Math.random() * 9999);
var userId = Math.floor(Math.random() * 9999);
var dashedKey = generateKey(productId, sequenceNumber, userId);
console.log("Randomly generating values...");
console.log("userId: " + userId + ", sequenceNumber: " + sequenceNumber + ", productId: " + productId);
console.log("dashedKey generated: " + dashedKey);
console.log("Parsing the key...");
var convertedObject = parseKey(dashedKey);
console.log(JSON.stringify(convertedObject));
