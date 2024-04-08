// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./VotingToken.sol";

// Model of Ideology
struct Ideology {
    uint economy;
    uint education;
    uint security;
}

// Model of a Candidate
struct Candidate {
    uint id;
    string name;
    uint voteCount;
    Ideology ideology;
}

contract Election {
    event Reset();
    event NewCandidate();
    event NewVote(uint candidateID);

    VotingToken public token;
    address private owner; // Contract owner
    mapping(address => bool) public voters; // Store accounts that have voted
    mapping(uint => Candidate) public candidates; // Read/write candidates
    uint public candidatesCount; // Store Candidates Count
    address[] public voterAddresses; // Maintain a list of voter addresses
    uint256 public startTime; //elections start time
    uint256 public endTime; //elections end time

    // Constructor
    constructor(address tokenAddress) {
        owner = msg.sender;
        token = VotingToken(tokenAddress);
        startTime = block.timestamp + 300;
        endTime = block.timestamp + 3600;
        addCandidate("avi", Ideology(5, 3, 4));
        addCandidate("dan", Ideology(1, 1, 4));
        addCandidate("dan", Ideology(1, 5, 1));
    }
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function reset() public onlyOwner {
        // Reset candidates mapping
        for (uint i = 1; i <= candidatesCount; i++) delete candidates[i];
        // Reset voters mapping
        for (uint i = 0; i < voterAddresses.length; i++)
            delete voters[voterAddresses[i]];

        candidatesCount = 0;
        delete voterAddresses;
        emit Reset();
    }

    function addCandidate(
        string memory _name,
        Ideology memory ideology
    ) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            0,
            ideology
        );
        emit NewCandidate();
    }

    function vote(uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // Mint tokens to the voter
        token.mint(msg.sender, 1);

        // record that voter has voted
        voters[msg.sender] = true;
        voterAddresses.push(msg.sender);

        // update candidate vote Count
        candidates[_candidateId].voteCount++;

        emit NewVote(_candidateId);
    }

    function voteByIdeology(Ideology memory ideology) public returns (uint) {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // Find the candidate with the closest ideology
        uint minDistance = type(uint).max; // Initialize minDistance to maximum possible value
        uint compatibleCandidateId;

        for (uint i = 1; i <= candidatesCount; i++) {
            uint distance = calculateDistance(candidates[i].ideology, ideology);
            if (distance < minDistance) {
                minDistance = distance;
                compatibleCandidateId = i;
            }
        }

        // Vote for the candidate with the closest ideology
        vote(compatibleCandidateId);
        return compatibleCandidateId;
    }

    function calculateDistance(
        Ideology memory ideology1,
        Ideology memory ideology2
    ) internal pure returns (uint) {
        int economyDiff = int(ideology1.economy) - int(ideology2.economy);
        int educationDiff = int(ideology1.education) - int(ideology2.education);
        int securityDiff = int(ideology1.security) - int(ideology2.security);

        // Calculate the squared Euclidean distance
        uint distanceSquared = uint(
            economyDiff *
                economyDiff +
                educationDiff *
                educationDiff +
                securityDiff *
                securityDiff
        );

        return distanceSquared;
    }
    function setTime(uint256 _startTime, uint256 _endTime) public onlyOwner {
        startTime = _startTime;
        endTime = _endTime;
    }
}
