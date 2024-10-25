import { getContract } from "@/utils/web3";
import { ethers } from "ethers";
import { LIQUIDITY_POOL_ABI, LIQUIDITY_POOL_ADDRESS } from "./constants";

export interface Transaction {
    date: string;
    action: string;
    minted?: string;
    spent?: string;
    burned?: string;
  }

interface loadTransactionsHistoryDTO {
    setTransactions(transactions: Transaction[]): void;
    address: string;
}

export default async function loadTransactionsHistory({setTransactions, address}: loadTransactionsHistoryDTO) {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const liquidityPoolContract = getContract(
          LIQUIDITY_POOL_ADDRESS,
          LIQUIDITY_POOL_ABI
        );
        const swapFilter = liquidityPoolContract.filters.Swapped(address);
        const redeemFilter = liquidityPoolContract.filters.Redeemed(address);
  
        const swapEvents = await liquidityPoolContract.queryFilter(swapFilter);
        const redeemEvents = await liquidityPoolContract.queryFilter(
          redeemFilter
        );
  
        const transactions = [
          ...swapEvents.map(async (event) => {
            const decoded = liquidityPoolContract.interface.decodeEventLog(
              "Swapped",
              event.data,
              event.topics
            );
            const block = await provider.getBlock(event.blockNumber);
            if (block) {
              return {
                date: new Date(block.timestamp * 1000).toLocaleDateString(),
                action: "Swap",
                minted: `${ethers.formatUnits(decoded.flsAmount, 18)} FLS`,
                spent: `${ethers.formatUnits(decoded.usdcAmount, 6)} USDC`,
              };
            } else {
              console.error(
                `Block not found for blockNumber ${event.blockNumber}`
              );
              return null;
            }
          }),
          ...redeemEvents.map(async (event) => {
            const decoded = liquidityPoolContract.interface.decodeEventLog(
              "Redeemed",
              event.data,
              event.topics
            );
            const block = await provider.getBlock(event.blockNumber);
            if (block) {
              return {
                date: new Date(block.timestamp * 1000).toLocaleDateString(),
                action: "Redeem",
                minted: `${ethers.formatUnits(decoded.usdcAmount, 6)} USDC`,
                burned: `${ethers.formatUnits(decoded.flsAmount, 18)} FLS`,
              };
            } else {
              console.error(
                `Block not found for blockNumber ${event.blockNumber}`
              );
              return null;
            }
          }),
        ];
        // Await all transactions to resolve their dates, filter out any null values
        const resolvedTransactions = (await Promise.all(transactions)).filter(
          (t) => t !== null
        );
  
        // Sort transactions by date
        resolvedTransactions.sort(
          (a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()
        );
  
        setTransactions(resolvedTransactions);
      } catch (error) {
        console.error("Error loading transaction history:", error);
      }
}