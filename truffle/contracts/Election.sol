// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Model a Candidate
struct Candidate {
    uint id;
    string name;
    uint voteCount;
}

contract Election {
    event Reset();
    event NewCandidate();
    event NewVote();

    address private owner; // Contract owner
    mapping(address => bool) public voters; // Store accounts that have voted
    mapping(uint => Candidate) public candidates; // Read/write candidates
    uint public candidatesCount; // Store Candidates Count
    address[] public voterAddresses; // Maintain a list of voter addresses
    uint256 public startTime; //elections start time
    uint256 public endTime; //elections end time

    // Constructor
    constructor(address ownerAddress) {
        owner = ownerAddress;
        startTime = block.timestamp + 300;
        endTime = block.timestamp + 3600;
        addCandidate("avi");
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

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit NewCandidate();
    }

    function vote(uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;
        voterAddresses.push(msg.sender);

        // update candidate vote Count
        candidates[_candidateId].voteCount++;

        emit NewVote();
    }

    function setTime(uint256 _startTime, uint256 _endTime) public onlyOwner {
        startTime = _startTime;
        endTime = _endTime;
    }
}
