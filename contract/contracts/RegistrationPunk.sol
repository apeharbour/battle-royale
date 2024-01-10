// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IGamePunk {
    function addShip(address playerAddress, uint8 gameId, uint8 _speed, uint8 _range) external returns (bool);
}

contract RegistrationPunk is Ownable {

    // Events
    event PlayerAdded(address indexed player, uint8 gameId);
    event RegistrationClosed(bool registrationClosed);

    IGamePunk public gamePunk;
    mapping(address => mapping(uint8 => bool)) public registeredAddresses;
    bool public registrationClosed = false;

    constructor(address _gamePunkAddress) Ownable(msg.sender) {
        gamePunk = IGamePunk(_gamePunkAddress);
    }

    function registerPlayer(uint8 gameId, uint8 _speed, uint8 _range) public {
        require(!registrationClosed, "Registration closed for the game");
        require(!registeredAddresses[msg.sender][gameId], "Player already registered for this game");

        gamePunk.addShip(msg.sender, gameId, _speed, _range);
        emit PlayerAdded(msg.sender, gameId);
        registeredAddresses[msg.sender][gameId] = true;
    }

    function closeRegistration() public onlyOwner {
        registrationClosed = true;
        emit RegistrationClosed(true);
    }
}
