import { ethers } from "hardhat";


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy BLTM contract
  const BLTM = await ethers.getContractFactory("BLTM");
  const bltmDeploy = await BLTM.deploy();
  await bltmDeploy.waitForDeployment(); // Wait for deployment to be mined
  console.log("bltmDeploy deployed to:", bltmDeploy.target);

  // Deploy LiquidityPool contract
  const usdcTokenAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"; // USDC on Amoy Testnet
  const initialExchangeRate = 2; // Example exchange rate: 1 USDC = 2 BLTM
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(
    usdcTokenAddress,
    bltmDeploy.target,
    initialExchangeRate
  );
  await liquidityPool.waitForDeployment(); // Wait for deployment to be mined
  console.log("LiquidityPool deployed to:", liquidityPool.target);

  // Grant MINTER_ROLE to LiquidityPool contract
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  // const tx = await bltmDeploy.grantRole(MINTER_ROLE, liquidityPool.target);
  // await tx.wait();
  console.log(`MINTER_ROLE granted to LiquidityPool contract at: ${liquidityPool.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
