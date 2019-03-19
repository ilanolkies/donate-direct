pragma solidity ^0.4.22;


contract DirectDonate {
    address public owner;

    Project[] public projects;

    struct Project {
        string name;
        address receiver;
        string url;
    }

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

    function addProject (string name, address receiver, string url) public {
        Project memory project;
        project.name = name;
        project.receiver = receiver;
        project.url = url;

        projects.push(project);
    }

    function projectName (uint index) public view returns (string) {
        return projects[index].name;
    }

    function donate (uint index) public payable {
        address receiver = projects[index].receiver;

        receiver.transfer(msg.value);
    }
}
