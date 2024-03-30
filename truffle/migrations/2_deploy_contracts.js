var Election = artifacts.require("Election.sol");

module.exports = function (deployer, network, accounts) {
    // Get the first account address from Ganache
    const ownerAddress = accounts[0]; // Assuming you want to use the first account

    deployer.deploy(Election, ownerAddress);
};