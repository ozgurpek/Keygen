import { describe } from "mocha";
import parseKey, { ParsedKey } from "../lib/parseKey";
import generateKey from "../lib/generateKey";
import { expect, use } from "chai";
import ChaiExclude from 'chai-exclude';

use(ChaiExclude);

const dummyInput = {
    userId: 100,
    sequenceNumber: 7,
    productId: 5371
};

describe('testing keygen', () => {
    let generatedKey: string;
    let parsedKey: ParsedKey;

    before(() => {
        generatedKey = generateKey(dummyInput.productId,
            dummyInput.sequenceNumber,
            dummyInput.userId);
        parsedKey = parseKey(generatedKey);
    });

    it('should return a key', () => expect(generatedKey).to.exist);
    it('should parse the key', () => expect(parsedKey).to.exist);
    it('should parse correctly', () => expect(parsedKey).excluding(['salt', 'timeStamp']).to.be.deep.equal(dummyInput));

});