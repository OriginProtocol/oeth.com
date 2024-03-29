import { mainnet } from "wagmi";
import { formatUnits } from "viem";
import { readContract } from "@wagmi/core";
import { useQuery } from "react-query";

export const useChainlinkEthUsd = () => {
  return useQuery({
    queryKey: ["useChainlinkUsd"],
    queryFn: async () => {
      const usd = await readContract({
        chainId: 1,
        address: "0x017aD99900b9581Cd40C815990890EE9F0858246",
        abi: ChainlinkOracleABI,
        functionName: "ethUsdPrice",
      });

      const floatUsd = +formatUnits(usd, 6);
      const gweiUsd = floatUsd * 1e-9;

      return { usd, floatUsd, gweiUsd };
    },
  });
};

export const ChainlinkOracleABI = [
  {
    constant: true,
    inputs: [],
    name: "governor",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "string", name: "symbol", type: "string" }],
    name: "tokEthPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "string", name: "symbol", type: "string" }],
    name: "tokUsdPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "claimGovernance",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "ethUsdPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isGovernor",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "_newGovernor", type: "address" },
    ],
    name: "transferGovernance",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "feed", type: "address" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "bool", name: "directToUsd", type: "bool" },
    ],
    name: "registerFeed",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "string", name: "symbol", type: "string" }],
    name: "price",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "ethFeed_", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_feed",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_directToUsd",
        type: "bool",
      },
    ],
    name: "FeedRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousGovernor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newGovernor",
        type: "address",
      },
    ],
    name: "PendingGovernorshipTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousGovernor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newGovernor",
        type: "address",
      },
    ],
    name: "GovernorshipTransferred",
    type: "event",
  },
] as const;
