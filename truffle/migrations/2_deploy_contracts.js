const Election = artifacts.require("Election");
const VotingToken = artifacts.require("VotingToken");

module.exports = function (deployer, network, accounts) {
    // Get the first account address from Ganache
    // const ownerAddress = accounts[0]; // Assuming you want to use the first account

    deployer.deploy(VotingToken, 1000) // Deploy the VotingToken contract with an initial supply of 1000 tokens
        .then(function () {
            console.log(VotingToken.address)
            return deployer.deploy(Election, VotingToken.address); // Pass the address of the VotingToken contract to the Election constructor
        });
};