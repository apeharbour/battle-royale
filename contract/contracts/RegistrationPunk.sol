// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IGamePunk {
    function startNewGame(uint8 gameId, uint8 radius) external;
    function addShip(address players, uint8 gameId, uint256 tokenId) external;
}

interface IPunkships {
    function safeMint(address to, uint256 tokenId) external;
    function getRange(uint256 tokenId) external pure returns (uint8);
    function getShootingRange(uint256 tokenId) external pure returns (uint8);
    function getShipTypeName(uint256 tokenId) external pure returns (string memory);
    function ownerOf(uint256 tokenId) external pure returns (address);
}

contract RegistrationPunk is Ownable {

    event RegistrationStarted(uint256 firstGameId);
    event PlayerRegistered(address player, uint256 punkshipId, uint8 speed, uint8 range);
    event PlayerAdded(address player, uint8 gameId, uint256 punkshipId);
    event RegistrationClosed(uint256 gameId);

    IGamePunk public gamePunk;
    IPunkships public punkships;

    mapping(address => Player) public registeredPlayers;
    address[] private registeredPlayerAddresses;
    bool public registrationClosed = true;
    uint8 public lastGameId = 0;
    uint8 public registrationPhase = 0;

    struct Player {
        bool registered;
        uint256 punkshipId;
        // uint8 speed;
        // uint8 range;
    }

    constructor(address _gamePunkAddress, address _punkshipsAddress) Ownable(msg.sender) {
        gamePunk = IGamePunk(_gamePunkAddress);
        punkships = IPunkships(_punkshipsAddress);
    }

     function startRegistration() public onlyOwner {
        registrationClosed = false;
        lastGameId += 1;

         for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            delete registeredPlayers[registeredPlayerAddresses[i]];
        }
        delete registeredPlayerAddresses;
        emit RegistrationStarted(lastGameId);
    }

    function registerPlayer(uint256 _punkshipId) public {
        require(!registrationClosed, "Registration is closed");
        require(!registeredPlayers[msg.sender].registered, "Player already registered");
        require(punkships.ownerOf(_punkshipId) == msg.sender, "You do not own this ship");

        // registeredPlayers[msg.sender] = Player(true, _punkshipId, punkships.getRange(_punkshipId), punkships.getShootingRange(_punkshipId));
        registeredPlayers[msg.sender] = Player(true, _punkshipId);
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
        
        gamePunk.addShip(playerAddress,lastGameId, player.punkshipId);
        emit PlayerAdded(playerAddress, lastGameId, player.punkshipId);

        gamePlayerCount++;
       
        if (gamePlayerCount == _maxPlayersPerGame) {
            lastGameId++;
            gamePlayerCount = 0;
            emit RegistrationClosed(lastGameId);
        }
    }
}

}

