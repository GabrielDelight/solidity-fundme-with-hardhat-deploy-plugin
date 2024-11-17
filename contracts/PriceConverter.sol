// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// Get the price of usd in eth
library PriceConverter {
    function getPrice(
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        (, int256 answer, , , ) = _priceFeed.latestRoundData();

        return uint256(answer * 1e10);
    }

    //  get the price of eth in usd
    function getConversionRate(
        uint256 _eth,
        AggregatorV3Interface _priceFeed
    ) internal view returns (uint256) {
        uint256 price = getPrice(_priceFeed);

        uint256 convertedPrice = (price * _eth) / 1e18;

        return convertedPrice;
    }
}
