// Imports
const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require("web3")
const web3 = new Web3(ganache.provider())

const { interface, bytecode} = require("../compile")

let lottery;
let accounts;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: "1000000",gasPrice: "5000000"})
})

// Motcha

describe("Lottery Contract", () => {
    it("Deployed",() => {
        assert.ok(lottery.options.address)
    })

    it("Player can enter",async () => {
        await lottery.methods.enter().send({from: accounts[0],value: web3.utils.toWei("1","ether")})
        const players = await lottery.methods.getPlayers().call({from: accounts[0]})
        assert.equal(accounts[0],players[0])
        assert.equal(1,players.length)
    })

    it("Players can enter",async () => {
        await lottery.methods.enter().send({from: accounts[0],value: web3.utils.toWei("1","ether")})
        await lottery.methods.enter().send({from: accounts[1],value: web3.utils.toWei("1","ether")})
        await lottery.methods.enter().send({from: accounts[2],value: web3.utils.toWei("1","ether")})
        const players = await lottery.methods.getPlayers().call({from: accounts[0]})
        assert.equal(accounts[0],players[0])
        assert.equal(accounts[1],players[1])
        assert.equal(accounts[2],players[2])
        assert.equal(3,players.length)
    })

    it("Requires minimum amount", async () => {
        try{
            await lottery.methods.enter().send({from: accounts[0],value: web3.utils.toWei("0.0001","ether")})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })

    it("Maneger can pick winner", async () => {
        await lottery.methods.enter().send({from: accounts[0],value: web3.utils.toWei("1","ether")})
        await lottery.methods.enter().send({from: accounts[1],value: web3.utils.toWei("1","ether")})
        try{
            await lottery.methods.pickWinner().call({from: accounts[0]})
            assert(true)
        }
        catch(err){
            assert(err)
        }
    })

    it("Players cant pick winner", async () => {
        await lottery.methods.enter().send({from: accounts[0],value: web3.utils.toWei("1","ether")})
        await lottery.methods.enter().send({from: accounts[1],value: web3.utils.toWei("1","ether")})
        try{
            await lottery.methods.pickWinner().call({from: accounts[1]})
            assert(false)
        }
        catch(err){
            assert(err)
        }
    })

    it("End to end",async () => {
        const players = await lottery.methods.getPlayers().call({from: accounts[0]})
        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether'),
        });

        const origBalance = await web3.eth.getBalance(accounts[1]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[1]);
        const winnings = finalBalance - origBalance;

        assert.equal(web3.utils.toWei('2', 'ether'), winnings);
        assert.equal(0,players.length)
        assert(lotteryBalance == 0);
    })
})