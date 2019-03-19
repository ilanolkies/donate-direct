pragma solidity ^0.4.22;


contract DirectDonate {
    address public owner;

    string[] public projects;

    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function projectIndex () public view returns (uint) {
        return projects.length;
    }

    function addProject (string projectName) public {
        projects.push(projectName);
    }
}
