const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async function () {
        // deploy our fundMe contract
        // using Hardhat deploy
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        const deploymentResults = await deployments.fixture(["all"])

        const fundMeAddress = deploymentResults['FundMe']?.address
        fundMe = await ethers.getContractAt("FundMe", fundMeAddress)

        const mockV3AggregatorAddress =
            deploymentResults['MockV3Aggregator']?.address
        mockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            mockV3AggregatorAddress
        )
    })

    describe("constructor", async function () {
        it("Sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            const mockV3AggregatorAddress = await mockV3Aggregator.getAddress()
            assert.equal(response, mockV3AggregatorAddress)
        })
    })
})
