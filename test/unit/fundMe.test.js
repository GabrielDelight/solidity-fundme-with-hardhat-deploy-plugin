// What to?
// @ 1, deploy the contract with beforeEach using hardhatdeploy
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const {assert} =  require("chai")
describe("fundMe", () => {
  let fundMe, deployer, mockV3Aggregator;
  // deploying our contract
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer; // to get the deployed contract network
    await deployments.fixture(["all"]);
    console.log("=====>>", ethers.getContract("fundMe"))
    fundMe = await ethers.getContract("fundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  // Testing the constructor function
  describe("constructor", async () => {
    it("sets the aggregator addresses correctly", async () => {
      const response =  await fundMe.priceFeed;
      assert(response, mockV3Aggregator.address)
    });
  });
});
