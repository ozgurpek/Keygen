import { base } from "./constants";

function calculateCheckSum(keyWithoutCheckSum: string): string {
  let count = 0;
  let sum = 0;
  for (let c of keyWithoutCheckSum) {
    if (c !== "-") {
      const val = base.indexOf(c);
      sum += val;
      if (count % 2 === 1) {
        sum += val;
      }
      count += 1;
    }
  }

  sum = Math.floor((sum * count) % (count + 1));
  sum %= base.length;

  return base[sum];
}

export default calculateCheckSum;
