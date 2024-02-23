// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IGamePunk {
    function startNewGame(uint8 gameId, uint8 radius) external;
    function addShip(address players, uint8 gameId, uint8 speeds, uint8 ranges) external;
}

contract RegistrationPunk is Ownable {

    IGamePunk public gamePunk;
    mapping(address => Player) public registeredPlayers;
    address[] private registeredPlayerAddresses;
    bool public registrationClosed = true;
    uint8 public lastGameId = 0;
    uint8 public registrationPhase = 0;
    struct Player {
        bool registered;
        uint8 speed;
        uint8 range;
    }

    constructor(address _gamePunkAddress) Ownable(msg.sender) {
        gamePunk = IGamePunk(_gamePunkAddress);
    }

     function startRegistration() public onlyOwner {
        registrationClosed = false;
        lastGameId += 1;

         for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            delete registeredPlayers[registeredPlayerAddresses[i]];
        }
        delete registeredPlayerAddresses;
    }

    function registerPlayer(uint8 _speed, uint8 _range) public {
        require(!registrationClosed, "Registration is closed");
        require(!registeredPlayers[msg.sender].registered, "Player already registered");

        registeredPlayers[msg.sender] = Player(true, _speed, _range);
        registeredPlayerAddresses.push(msg.sender);
    }

  function closeRegistration(uint8 _maxPlayersPerGame, uint8 _radius) public onlyOwner {
    registrationClosed = true;
    uint8 gamePlayerCount = 0;

    for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
        if(gamePlayerCount == 0) {
            gamePunk.startNewGame(lastGameId, _radius); // Start a new game when the previous one is filled
        }
        
        address playerAddress = registeredPlayerAddresses[i];
        Player storage player = registeredPlayers[playerAddress];
        
        gamePunk.addShip(playerAddress,lastGameId,player.speed, player.range);

        gamePlayerCount++;
       
        if (gamePlayerCount == _maxPlayersPerGame) {
            lastGameId++;
            gamePlayerCount = 0;
        }
    }
}

}

