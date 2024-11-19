// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./PriceConverter.sol";
error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) addressToAmountFunded;
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;
    modifier onlyOwner() {
        require(msg.sender == i_owner, "You are not allowed to make this call");

        // for gas efficiency
        // if(msg.sender != i_owner){
        //     revert NotOwner();
        // }
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
        @notice this function funds the contract
        @dev the pricefeed is also passed in the getConversionRate as a solidity library 
    */

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "You need enough eth"
        );

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // only contract i_owner
    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }

        // resetting the funders array
        funders = new address[](0);

        // Withdrawing eth from the contract

        // 1. using the transfer method (throws an error gas not availble)
        // payable(msg.sender).transfer(address(this).balance);

        // 2. Using the send method
        // bool isSuccess = payable(msg.sender).send(address(this).balance);
        // require(isSuccess, "Failed to withdraw");

        // 3. using the call methid
        (bool sendSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(sendSuccess, "Failed to withdraw");
    }
}
