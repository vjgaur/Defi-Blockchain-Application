const Tether = artifacts.require('Tether')
const Reward = artifacts.require('Reward')
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function (deployer,network,accounts){
    //Deploy Mock Tether Contract
    await deployer.deploy(Tether)
    const tether = await Tether.deployed();
    //Deploy Mock Reward Contract
    await deployer.deploy(Reward)
    const reward = await Reward.deployed()

    //Deploy Mock Decentralise Bank 
    await deployer.deploy(DecentralBank, reward.address,tether.address)
    const decentralisedBank = await DecentralBank.deployed()
    
    
    await reward.transfer(decentralisedBank.address,'1000000000000000000000000')
    await tether.transfer(accounts[1], '1000000000000000000')
    
};