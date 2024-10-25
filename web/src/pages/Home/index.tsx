import { useEffect, useState } from "react";


import loadTransactionsHistory, { Transaction } from "@/helpers/loadTransactions";
import TransactionsTable from "@/components/TransactionsTable";
import loadExchangeRate from "@/helpers/loadExchangeRate";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import loadBalances from "@/helpers/loadBalances";
import DepositUsdcButton from "@/components/DepositUsdcButton";
import WithdrawButton from "@/components/WithdrawButton";

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [flsBalance, setFlsBalance] = useState<string>("0");
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  useEffect(() => {
    if (address) {
      loadBalances({setFlsBalance, address});
      loadExchangeRate({setExchangeRate});
      loadTransactionsHistory({ setTransactions, address });
    }
  }, [address]);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        BLSM
      </h1>
      {!address ? (
        <ConnectWalletButton setAddress={setAddress}/>
      ) : (
        <>
          <p className="text-center text-gray-300 mb-4">
            Connected as: {address}
          </p>

          <div className="bg-gray-800 shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Balances</h2>
            <p className="text-gray-300">BLSM Balance: {flsBalance}</p>
          </div>

          <div className="bg-gray-800 shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Exchange Rate
            </h2>
            <p className="text-gray-300">1 USDC = {exchangeRate} BLSM</p>
          </div>

          <div className="bg-gray-800 shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Actions</h2>
            <div className="flex space-x-4">
              <DepositUsdcButton
                setFlsBalance={setFlsBalance}
                setTransactions={setTransactions}
                address={address}
              />
              <WithdrawButton
                setFlsBalance={setFlsBalance}
                setTransactions={setTransactions}
                address={address}
              />
            </div>
          </div>

          <TransactionsTable transactions={transactions} />
        </>
      )}
    </div>
  );
}
