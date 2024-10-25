import {
  FARMLAND_STOCKS_ABI,
  FARMLAND_STOCKS_ADDRESS,
  LIQUIDITY_POOL_ABI,
  LIQUIDITY_POOL_ADDRESS,
} from "@/helpers/constants";
import loadBalances from "@/helpers/loadBalances";
import loadTransactionsHistory, { Transaction } from "@/helpers/loadTransactions";
import { getContract } from "@/utils/web3";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";

interface WithdrawBtnProps {
  setTransactions(transactions: Transaction[]): void;
  address: string;
  setFlsBalance(balance: string): void;
}

export default function WithdrawButton({
  setTransactions,
  address,
  setFlsBalance
}: WithdrawBtnProps) {
  const [amount, setAmount] = useState("1"); // Default amount

  const handleWithdraw = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const farmlandStocksContract = new ethers.Contract(
        FARMLAND_STOCKS_ADDRESS,
        FARMLAND_STOCKS_ABI,
        signer
      );

      const gasLimit = BigInt("1000000");
      const gasPrice = (await provider.getFeeData()).gasPrice;

      // Approve the Liquidity Pool contract to spend the specified amount of Farmland Stocks (FLS)
      await farmlandStocksContract.approve(
        LIQUIDITY_POOL_ADDRESS,
        ethers.parseUnits(amount, 18), {gasLimit, gasPrice}
      );

      const liquidityPoolContract = new ethers.Contract(
        LIQUIDITY_POOL_ADDRESS,
        LIQUIDITY_POOL_ABI,
        signer
      );

      // Redeem FLS for USDC
      await liquidityPoolContract.redeemFLSForUSDC(
        ethers.parseUnits(amount, 18), {gasLimit, gasPrice}
      );

      toast(`Withdraw with success`, {
        hideProgressBar: true,
        autoClose: 4000,
        type: "success",
      });


      loadBalances({setFlsBalance, address});
      loadTransactionsHistory({ setTransactions, address });
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast(`Error on withdraw`, {
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
        placeholder="Enter FLS amount"
        min="0"
        step="0.01"
      />
      <button
        onClick={handleWithdraw}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
      >
        Withdraw
      </button>
    </div>
  );
}
