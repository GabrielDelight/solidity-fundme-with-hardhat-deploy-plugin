const { network } = require("hardhat");

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verifyContract } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].priceFeedAddress;
  }
  let args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    log: true,
    args,
  });

  log("Deployed FundMe");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  )
    await verifyContract(fundMe.address, args);
};

module.exports.tags = ["all", "fundme "];
