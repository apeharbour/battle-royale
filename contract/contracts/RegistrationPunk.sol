// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IGamePunk {
    function startNewGame(uint8 gameId, uint8 radius) external;
    function addShip(uint8 gameId, address[] memory players, uint8[] memory speeds, uint8[] memory ranges) external;
}

contract RegistrationPunk is Ownable {

    IGamePunk public gamePunk;
    mapping(address => Player) public registeredPlayers;
    address[] private registeredPlayerAddresses;
    bool public registrationClosed = false;
    struct Player {
        bool registered;
        uint8 speed;
        uint8 range;
    }

    constructor(address _gamePunkAddress) Ownable(msg.sender) {
        gamePunk = IGamePunk(_gamePunkAddress);
    }

    function registerPlayer(uint8 _speed, uint8 _range) public {
        require(!registrationClosed, "Registration is closed");
        require(!registeredPlayers[msg.sender].registered, "Player already registered");

        registeredPlayers[msg.sender] = Player(true, _speed, _range);
        registeredPlayerAddresses.push(msg.sender);
    }

     function closeRegistration() public onlyOwner {
        registrationClosed = true;
        uint8 maxPlayersPerGame = 8;
        uint8 gameId = 1;
        uint8 playerIndex = 0;
        address[] memory players = new address[](maxPlayersPerGame);
        uint8[] memory speeds = new uint8[](maxPlayersPerGame);
        uint8[] memory ranges = new uint8[](maxPlayersPerGame);

        for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            if(playerIndex == 0) {
                gamePunk.startNewGame(gameId, 6);
            }
            address playerAddress = registeredPlayerAddresses[i];
            Player storage player = registeredPlayers[playerAddress];

            players[playerIndex] = playerAddress;
            speeds[playerIndex] = player.speed;
            ranges[playerIndex] = player.range;
            playerIndex++;

            if (playerIndex == maxPlayersPerGame) {
                gamePunk.addShip(gameId, players, speeds, ranges);
                gameId++;
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
            gamePunk.addShip(gameId, lastBatchPlayers, lastBatchSpeeds, lastBatchRanges);
        }
    }
}

