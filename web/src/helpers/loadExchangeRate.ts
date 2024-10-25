import { getContract } from "@/utils/web3";
import { LIQUIDITY_POOL_ABI, LIQUIDITY_POOL_ADDRESS } from "./constants";

interface loadExchangeRateDTO {
    setExchangeRate(rate: number): void;
}

export default async function loadExchangeRate({setExchangeRate}: loadExchangeRateDTO) {
    try {
        const liquidityPoolContract = getContract(
          LIQUIDITY_POOL_ADDRESS,
          LIQUIDITY_POOL_ABI
        );
        const rate = await liquidityPoolContract.exchangeRate();
        setExchangeRate(Number(rate)); // Convert rate to number for display
      } catch (error) {
        console.error("Error loading exchange rate:", error);
      }

}