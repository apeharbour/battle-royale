// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IGamePunk {
    function startNewGame(uint8 gameId, uint8 radius) external;
    function addShip(uint8 gameId, address[] memory players, uint8[] memory speeds, uint8[] memory ranges) external;
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
        uint8 playerIndex = 0;
        address[] memory players = new address[](_maxPlayersPerGame);
        uint8[] memory speeds = new uint8[](_maxPlayersPerGame);
        uint8[] memory ranges = new uint8[](_maxPlayersPerGame);
        console.log("Im here register players in the game:", registeredPlayerAddresses.length);

        for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            if(playerIndex == 0) {
                gamePunk.startNewGame(lastGameId, _radius);
            }
            address playerAddress = registeredPlayerAddresses[i];
            Player storage player = registeredPlayers[playerAddress];

            players[playerIndex] = playerAddress;
            speeds[playerIndex] = player.speed;
            ranges[playerIndex] = player.range;
            playerIndex++;

            if (playerIndex == _maxPlayersPerGame) {
                gamePunk.addShip(lastGameId, players, speeds, ranges);
                lastGameId++;
                playerIndex = 0;
            }
        }

        //Last bunch of players
        if (playerIndex > 0) {
            address[] memory lastBatchPlayers = new address[](playerIndex);
            uint8[] memory lastBatchSpeeds = new uint8[](playerIndex);
            uint8[] memory lastBatchRanges = new uint8[](playerIndex);
            for (uint8 i = 0; i < playerIndex; i++) {
                lastBatchPlayers[i] = players[i];
                lastBatchSpeeds[i] = speeds[i];
                lastBatchRanges[i] = ranges[i];
            }
            gamePunk.addShip(lastGameId, lastBatchPlayers, lastBatchSpeeds, lastBatchRanges);
        }
    }
}

