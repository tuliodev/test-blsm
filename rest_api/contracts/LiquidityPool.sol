// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BLTM.sol";

contract LiquidityPool is Ownable, ReentrancyGuard {
    IERC20 public immutable usdcToken;
    BLTM public immutable farmlandStocks;
    uint256 public exchangeRate;

    event Swapped(address indexed user, uint256 usdcAmount, uint256 flsAmount);
    event Redeemed(address indexed user, uint256 flsAmount, uint256 usdcAmount);
    event Withdraw(address indexed user, uint256 usdcAmount);

    constructor(
        address _usdcToken,
        address _farmlandStocks,
        uint256 _exchangeRate
    ) Ownable(msg.sender) {
        require(_usdcToken != address(0), "USDC address cannot be zero");
        require(_farmlandStocks != address(0), "BLTM address cannot be zero");
        require(_exchangeRate > 0, "Exchange rate must be greater than zero");

        usdcToken = IERC20(_usdcToken);
        farmlandStocks = BLTM(_farmlandStocks);
        exchangeRate = _exchangeRate;
    }

    function updateExchangeRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Exchange rate must be greater than zero");
        exchangeRate = newRate;
    }

    function swapUSDCForFLS(uint256 usdcAmount) external nonReentrant {
        require(usdcAmount > 0, "USDC amount must be greater than zero");
        uint256 flsAmount = (usdcAmount * exchangeRate * (10 ** 12));  // scale by 10^12 to adjust for the 12-decimal difference between USDC and BLTM
        require(flsAmount > 0, "Calculated BLTM amount must be greater than zero");
        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");
        farmlandStocks.mint(msg.sender, flsAmount);
        emit Swapped(msg.sender, usdcAmount, flsAmount);
    }

    function redeemFLSForUSDC(uint256 flsAmount) external nonReentrant {
        require(flsAmount > 0, "BLTM amount must be greater than zero");
        // Adjust calculation to account for decimal difference
        uint256 usdcAmount = flsAmount / (exchangeRate * (10 ** 12));
        require(usdcAmount > 0, "Calculated USDC amount must be greater than zero");
        farmlandStocks.burn(msg.sender, flsAmount);
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");
        emit Redeemed(msg.sender, flsAmount, usdcAmount);
    }


    function withdrawUSDC(uint256 usdcAmount) external onlyOwner nonReentrant {
        require(usdcAmount > 0, "USDC amount must be greater than zero");
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Insufficient USDC balance");
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC withdrawal failed");
        emit Withdraw(msg.sender, usdcAmount);
    }
}
