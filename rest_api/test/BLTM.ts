import { expect } from "chai";
import { ethers } from "hardhat";

describe("BLTM", function () {
  async function deployFarmlandStocksFixture() {
    const [deployer, otherAccount, minter] = await ethers.getSigners();

    const FarmlandStocks = await ethers.getContractFactory("FarmlandStocks");
    const farmlandStocks = await FarmlandStocks.deploy();


    // Grant the minter role to another account for testing
    await farmlandStocks.grantRole(await farmlandStocks.MINTER_ROLE(), minter.address);

    return { farmlandStocks, deployer, otherAccount, minter };
  }

  describe("Pausing", function () {
    it("Should allow pausing and unpausing by pauser", async function () {
      const { farmlandStocks, deployer } = await deployFarmlandStocksFixture();

      // Cast to any to bypass TypeScript error
      await (farmlandStocks as any).pause();
      expect(await farmlandStocks.paused()).to.be.true;

      await (farmlandStocks as any).unpause();
      expect(await farmlandStocks.paused()).to.be.false;
    });

  });
});
