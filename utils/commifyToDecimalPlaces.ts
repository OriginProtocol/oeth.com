import { commify } from "ethers/lib/utils";

const commifyToDecimalPlaces = (num: number, decimalPlaces: number) =>
  commify(Math.floor(num)) + "." + num.toFixed(decimalPlaces).split(".")[1];

export default commifyToDecimalPlaces;
