var assert = require('chai').assert

const Tether = artifacts.require('Tether')
const Reward = artifacts.require('Reward')
const DecentralBank = artifacts.require('DecentralBank')
require('chai')
.use(require('chai-as-promised'))
.should()
contract('DecentralBank',([owner, customer]) =>{
//All the code goes here for test cases
    let tether, reward, decentralBank
    function tokens(number){
        return web3.utils.toWei(number,'ether')
    }

    before(async()=>{
        //Load Contracts
         tether = await Tether.new()
         reward = await Reward.new()
         decentralBank= await DecentralBank.new(reward.address, tether.address)
         //Transfer all the tokens to DecentralBank that is 1 million
         await reward.transfer(decentralBank.address,tokens('1000000'))

         //Transfer 100 mock tether to customer 
         await tether.transfer(customer,tokens('100'),{from: owner})
    })

    describe('Mock Tether Deloyment', async() => {
    it('matches name successfully', async()=>{
        const name = await tether.name()
        assert.equal(name,'Mock Tether Token')
    })
    
    describe('Reward Token', async() => {
        it('matches name successfully', async()=>{
            const name = await reward.name()
            assert.equal(name,'Reward Token')
        })
        
    })
    describe('Decentral Bank Deployment', async() => {
        it('matches name successfully', async()=>{
            const name = await decentralBank.name()
            assert.equal(name,'Decentralised Bank')
        })
        it('contract has tokens', async()=>{
            balance = await reward.balanceOf(decentralBank.address)
            assert.equal(balance,tokens('1000000'))
        })
        
    })

    describe('Yield Farming', async()=> {
        it('reward tokens for staking', async() =>{
            let result
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
            
        
        await tether.approve(decentralBank.address,tokens('100'), {from:customer})
        await decentralBank.depositTokens(tokens('100'), {from:customer})
        //check updated balance 
        result = await tether.balanceOf(customer)
        assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')
        //updated balance of decental bank 
        result = await tether.balanceOf(decentralBank.address)
        assert.equal(result.toString(), tokens('100'), 'decental bank mock wallet balance after staking from customer')
        //Is staking balance 
        result = await decentralBank.isStaked(customer)
        assert.equal(result.toString(),'true','customer is staking status after staking')
        
            //Issue tokens
        await decentralBank.issueTokens({ from: owner })
        //ensure only the owner can issue tokens
        await decentralBank.issueTokens({from:customer}).should.be.rejected
        //unstaked tokens
        await decentralBank.unstakeTokens({ from: customer })
        
        //check unstaking balances    
        result = await tether.balanceOf(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking 0 tokens')
        //updated balance of decental bank 
        result = await tether.balanceOf(decentralBank.address)
        assert.equal(result.toString(), tokens('0'), 'decental bank mock wallet balance after staking from customer')
        //Is staking update 
        result = await decentralBank.isStaked(customer)
        assert.equal(result.toString(),'false','customer is no longer staking  after unstaking')
   
            
        })
    })
})
})