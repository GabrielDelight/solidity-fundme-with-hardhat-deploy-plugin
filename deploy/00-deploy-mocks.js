const {developmentChains, DECIMALS, INITIAL_ANSWER} =  require("../helper-hardhat-config")
const {network} = require("hardhat")
module.exports = async ({getNamedAccounts, deployments})  => {
   const { deploy, log } = deployments;
   const { deployer } = await getNamedAccounts();

   if(developmentChains.includes(network.name)){
      log("Local network detected!! Deploying mock.....")
      await deploy("MockV3Aggregator", {
         contract: "MockV3Aggregator", 
         from: deployer,
         args: [DECIMALS, INITIAL_ANSWER],
         log: true
      })


      log("MockV3Aggregator Deployed!")
      log("------------------------------------")
   }

}

module.exports.tags  = ["all", "mock"]