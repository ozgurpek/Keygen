import { describe } from "mocha";
import parseKey, { ParsedKey } from "../lib/parseKey";
import generateKey from "../lib/generateKey";
import { expect, use } from "chai";
import ChaiExclude from "chai-exclude";
import { faker } from "@faker-js/faker";

use(ChaiExclude);

/** The deterministic fields that a parsed key must preserve. */
type PartialParsedKey = Omit<ParsedKey, "salt" | "timeStamp">;

let generatedKey: string;
let parsedKey: ParsedKey;
let productId: number;
let sequenceNumber: number;
let userId: number;
const keyBase = "0123456789ABCDEF";

/**
 * Creates a key with random identifiers and parses it for the test assertions.
 *
 * @returns Nothing.
 */
function setUpGeneratedKey(keyBase?: string): void {
  productId = faker.number.int();
  sequenceNumber = faker.number.int();
  userId = faker.number.int();

  if (keyBase) {
    generatedKey = generateKey(productId, sequenceNumber, userId, keyBase);
    parsedKey = parseKey(generatedKey, keyBase);
    return;
  }

  generatedKey = generateKey(productId, sequenceNumber, userId);
  parsedKey = parseKey(generatedKey);
}

/**
 * Verifies that generation produces a key value.
 *
 * @returns Nothing.
 */
function expectGeneratedKey(): void {
  expect(generatedKey).to.exist;
}

/**
 * Verifies that a generated key can be parsed.
 *
 * @returns Nothing.
 */
function expectParsedKey(): void {
  expect(parsedKey).to.exist;
}

/**
 * Verifies that parsing preserves the input identifiers.
 *
 * The timestamp and salt are deliberately excluded because they are generated
 * internally by the key generator.
 *
 * @returns Nothing.
 */
function expectParsedValues(): void {
  const testInput: PartialParsedKey = {
    productId,
    sequenceNumber,
    userId,
  };
  expect(parsedKey)
    .excluding(["salt", "timeStamp"])
    .to.be.deep.equal(testInput);
}

/** Registers the key-generation test suite and its assertions. */
function defineKeygenTests(keyBase?: string): void {
  before(() => setUpGeneratedKey(keyBase));
  it("should return a key", expectGeneratedKey);
  it("should parse the key", expectParsedKey);
  it("should parse correctly", expectParsedValues);
}

describe("testing keygen with the default base", () => defineKeygenTests());
describe("testing keygen with a custom base", () => defineKeygenTests(keyBase));
