// Imports
const HDWalletPrivider = require("truffle-hdwallet-provider")
const Web3 = require("web3")
const { interface, bytecode } = require("./compile")
console.log("Unos imports")
const provider = new HDWalletPrivider(
    "dish record crystal sun hobby thunder afraid blame bid wrestle hospital gesture",
    "https://rinkeby.infura.io/v3/cc708442b2bd416bb894fc8c3c03cb2e"
);
const web3 = new Web3(provider)

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode})
    .send({ gas: "1000000", gasPrice: "5000000000", from: accounts[0] })
    console.log(interface)
    console.log("Deployed to: ", result.options.address)
}
deploy()
