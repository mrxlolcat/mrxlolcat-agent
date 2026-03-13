// USDC Contract configurations on Base
export const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const TIP_RECEIVER = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Default Dev Address

export const erc20Abi = [
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
