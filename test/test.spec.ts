import { describe } from "mocha";
import parseKey, { ParsedKey } from "../lib/parseKey";
import generateKey from "../lib/generateKey";
import { expect, use } from "chai";
import ChaiExclude from "chai-exclude";
import { faker } from "@faker-js/faker";

use(ChaiExclude);

type PartialParsedKey = Omit<ParsedKey, "salt" | "timeStamp">;

describe("testing keygen", () => {
  let generatedKey: string;
  let parsedKey: ParsedKey;
  let productId: number;
  let sequenceNumber: number;
  let userId: number;

  before(() => {
    productId = faker.number.int();
    sequenceNumber = faker.number.int();
    userId = faker.number.int();

    generatedKey = generateKey(productId, sequenceNumber, userId);
    parsedKey = parseKey(generatedKey);
  });

  it("should return a key", () => expect(generatedKey).to.exist);
  it("should parse the key", () => expect(parsedKey).to.exist);
  it("should parse correctly", () => {
    const testInput: PartialParsedKey = {
      productId,
      sequenceNumber,
      userId,
    };
    expect(parsedKey)
      .excluding(["salt", "timeStamp"])
      .to.be.deep.equal(testInput);
  });
});
