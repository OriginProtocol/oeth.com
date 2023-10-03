import { useQuery } from "react-query";
import { readContract } from "@wagmi/core";
import { formatUnits } from "viem";

const addresses = {
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as const,
  stETH: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84" as const,
  rETH: "0xae78736cd615f374d3085123a210448e74fc6393" as const,
  frxETH: "0x5e8422345238f34275888049021821e8e08caa1f" as const,
  sfrxETH: "0xac3e018457b222d93114458476f3e3416abbe38f" as const,
};

const getRateOETH = async (address: `0x${string}`, block?: number) => {
  const raw = await readContract({
    chainId: 1,
    address: "0xbE19cC5654e30dAF04AD3B5E06213D70F4e882eE",
    abi: routerAbi,
    functionName: "price",
    args: [address],
    blockNumber: BigInt(block),
  });

  const float = +formatUnits(raw, 18);

  return { raw, float };
};

const getRateSfrxETH = async (block?: number) => {
  const raw = await readContract({
    chainId: 1,
    address: "0xac3e018457b222d93114458476f3e3416abbe38f",
    abi: fraxAbi,
    functionName: "previewRedeem",
    args: [BigInt("1000000000000000000")],
    blockNumber: BigInt(block),
  });

  const float = +formatUnits(raw, 18);

  return { raw, float };
};

export const useRatesOETH = (block: number, enabled: boolean) => {
  return useQuery({
    enabled,
    queryKey: ["useRatesOETH", block],
    queryFn: async () => {
      const WETH = await getRateOETH(addresses.WETH, block);
      const stETH = await getRateOETH(addresses.stETH, block);
      const rETH = await getRateOETH(addresses.rETH, block);
      const frxETH = await getRateOETH(addresses.frxETH, block);
      const sfrxETH = await getRateSfrxETH(block);
      return {
        OETH: { raw: BigInt("1000000000000000000"), float: 1 },
        ETH: { raw: BigInt("1000000000000000000"), float: 1 },
        WETH,
        stETH,
        rETH,
        frxETH,
        sfrxETH,
      } as const;
    },
  });
};

const routerAbi = [
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "cacheDecimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "price",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const fraxAbi = [
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "previewRedeem",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
