import { getContract } from "@/utils/web3";
import { FARMLAND_STOCKS_ABI, FARMLAND_STOCKS_ADDRESS } from "./constants";
import { ethers } from "ethers";

interface loadBalancesDTO {
    setFlsBalance(balance: string): void;
    address: string;
}

export default async function loadBalances ({setFlsBalance, address}: loadBalancesDTO)  {
    try {
      const flsContract = getContract(
        FARMLAND_STOCKS_ADDRESS,
        FARMLAND_STOCKS_ABI
      );

      const flsBal = await flsContract.balanceOf(address);

      setFlsBalance(ethers.formatUnits(flsBal, 18));
    } catch (error) {
      console.error("Error loading balances:", error);
    }
  };
