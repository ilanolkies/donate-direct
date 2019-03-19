pragma solidity ^0.4.22;


contract DirectDonate {
    address public owner;

    Project[] public projects;

    struct Project {
        string name;
        address receiver;
        string url;
        address[] donors;
        uint[] donations;
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
        address[] memory donors;
        project.donors = donors;
        uint[] memory donations;
        project.donations = donations;

        projects.push(project);
    }

    function projectName (uint index) public view returns (string) {
        return projects[index].name;
    }

    function donate (uint index) public payable {
        Project storage project = projects[index];
        address receiver = project.receiver;
        project.donors.push(msg.sender);
        project.donations.push(msg.value);

        receiver.transfer(msg.value);
    }

    function donors (uint index) public view returns (address[] memory) {
        Project storage project = projects[index];
        return project.donors;
    }

    function donations (uint index) public view returns (uint[] memory) {
        Project storage project = projects[index];
        return project.donations;
    }
}
