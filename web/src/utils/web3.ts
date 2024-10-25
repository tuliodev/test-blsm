import { Contract, ethers } from 'ethers';
import Web3Modal from 'web3modal';

let provider: ethers.BrowserProvider;
let signer: ethers.JsonRpcSigner;
let web3Modal: Web3Modal;


export const connectWallet = async () => {
  const providerOptions = {};

  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });

  const instance = await web3Modal.connect();
  provider = new ethers.BrowserProvider(instance);
  signer = await provider.getSigner();

  const {chainId} = await provider.getNetwork();

  if (Number(chainId) !== 80002) {
    alert('Please connect to the Polygon Amoy Testnet');
    throw new Error('Wrong network');
  }

  return { provider, signer };
};

export const getSignerAddress = async () => {
  return signer.getAddress();
};

export const getContract = (address: string, abi: any) => {
  return new Contract(address, abi, signer);
};
