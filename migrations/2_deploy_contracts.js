const Tether = artifacts.require('Tether')
const Reward = artifacts.require('Reward')
const DecentralBank = artifacts.require('DecentralBank')



module.exports = async function (deployer){
    //Deploy Mock Tether Contract
    await deployer.deploy(Tether)

    //Deploy Mock Reward Contract
    await deployer.deploy(Reward)

    //Deploy Mock Decentralise Bank 
    await deployer.deploy(DecentralBank)

};