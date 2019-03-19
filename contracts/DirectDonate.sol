pragma solidity ^0.4.22;


contract DirectDonate {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
}
