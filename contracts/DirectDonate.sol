pragma solidity ^0.4.22;


contract DirectDonate {
    address public owner;

    uint public projectIndex;

    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
        projectIndex = 0;
    }

    function addProject () public {
        projectIndex++;
    }
}
