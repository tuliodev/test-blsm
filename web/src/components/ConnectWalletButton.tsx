import { connectWallet, getSignerAddress } from "@/utils/web3";
import { toast } from "react-toastify";

interface ConnectWalletButtonProps {
    setAddress(address: string): void;
}

export default function ConnectWalletButton({ setAddress }: ConnectWalletButtonProps) {
    const connect = async () => {
        try {
          const { provider, signer } = await connectWallet();
          const userAddress = await getSignerAddress();
          setAddress(userAddress);
          toast(`You are connected to: ${userAddress}`, {
            hideProgressBar: true,
            autoClose: 4000,
            type: "success",
          });
        } catch (error) {
          console.error("Error connecting wallet:", error);
          toast(`Error connecting wallet`, {
            hideProgressBar: true,
            autoClose: 4000,
            type: "error",
          });
        }
      };
    return (
        <div className="flex justify-center">
        <button
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Connect Wallet
        </button>
      </div>
    )
}