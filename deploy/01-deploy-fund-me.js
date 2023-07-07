/// version 1
// function deployFunc() {
//     console.log("Hi")
// }

// module.exports.default = deployFunc

/// version 2
// module.exports = async (hre) => {
//    const { getNamedAccounts, deployments } = hre // this is the same as  below
//    // hre.getNamedAccounts
//    // hre.deployments
// }
// module.exports.default = deployFunc

/// version 3

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X use address Y
    // if chainId is Z use address A

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    log("Deploying FundMe and waiting for confirmations...")

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }
    log("---------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
