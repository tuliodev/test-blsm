import {
  LIQUIDITY_POOL_ABI,
  LIQUIDITY_POOL_ADDRESS,
  USDC_ABI,
  USDC_ADDRESS,
} from "@/helpers/constants";
import loadBalances from "@/helpers/loadBalances";
import loadTransactionsHistory, { Transaction } from "@/helpers/loadTransactions";
import { getContract } from "@/utils/web3";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";

interface DepositUsdcBtnProps {
  setTransactions(transactions: Transaction[]): void;
  setFlsBalance(balance: string): void;
  address: string;
}

export default function DepositUsdcButton({
  setTransactions,
  address,
  setFlsBalance
}: DepositUsdcBtnProps) {
  const [amount, setAmount] = useState("1"); // Default amount

  const handleDeposit = async () => {
    try {
      

      const amountInUnits = ethers.parseUnits(amount, 6);
      const liquidityPoolContract = getContract(
        LIQUIDITY_POOL_ADDRESS,
        LIQUIDITY_POOL_ABI
      );

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const gasLimit = BigInt("1000000");
      const gasPrice = (await provider.getFeeData()).gasPrice;

      // Create the USDC contract instance with the signer (new signer because it's a third-party contract)
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

      // Approve the Liquidity Pool contract to spend the specified amount of USDC
      await usdcContract.approve(LIQUIDITY_POOL_ADDRESS, amountInUnits, {
        gasLimit,
        gasPrice,
      });

      await liquidityPoolContract.swapUSDCForFLS(amountInUnits, {
        gasLimit,
        gasPrice,
      });

      toast(`Deposited ${amount} with success`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "success",
      });


      loadBalances({ setFlsBalance, address });
      loadTransactionsHistory({ setTransactions, address });
    } catch (error: any) {
      console.log(error.message);
      toast(`Error on deposit`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded-lg px-4 py-2 text-black"
        placeholder="Enter USDC amount"
        min="0"
        step="0.01"
      />
      <button
        onClick={handleDeposit}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
      >
        Deposit USDC
      </button>
    </div>
  );
}
