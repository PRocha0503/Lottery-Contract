// https://rinkeby.infura.io/v3/cc708442b2bd416bb894fc8c3c03cb2e

// Imports
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");
// exp create a new instance of web 3, the argument is the etherum network we are connecting to
const web3 = new Web3(ganache.provider());

// Motcha
let accounts;
let inbox;
const INITIAL_STRING = "Mensaje de inicio de contrato";
beforeEach(async () => {
	// exp get a list of all acounts, return a promise
	accounts = await web3.eth.getAccounts();
	// exp use one of those acounts to deploy a contact
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({
			data: bytecode,
			arguments: [INITIAL_STRING],
		})
		.send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
	it("deploys a contact", () => {
		assert.ok(inbox.options.address);
	});
	it("has initial message", async () => {
		const message = await inbox.methods.message().call();
		assert.equal(message, INITIAL_STRING);
	});
	it("can update message", async () => {
		await inbox.methods.setMessage("Cambiado").send({ from: accounts[0] });
		const message = await inbox.methods.message().call();
		assert.equal(message, "Cambiado");
	});
});
