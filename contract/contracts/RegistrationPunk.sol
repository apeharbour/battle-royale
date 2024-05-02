// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IGamePunk {
    function startNewGame(uint256 gameId, uint8 radius) external;

    function addShip(address players, uint256 gameId, uint256 tokenId) external;
}

interface IPunkships {
    function safeMint(address to, uint256 tokenId) external;

    function getRange(uint256 tokenId) external pure returns (uint8);

    function getShootingRange(uint256 tokenId) external pure returns (uint8);

    function getShipTypeName(
        uint256 tokenId
    ) external pure returns (string memory);

    function ownerOf(uint256 tokenId) external pure returns (address);
}

contract RegistrationPunk is Ownable {
    event RegistrationStarted(uint256 registrationPhase, uint256 firstGameId);
    event PlayerRegistered(
        uint256 registrationPhase,
        address player,
        uint256 punkshipId
    );
    event PlayerAdded(
        uint256 registrationPhase,
        address player,
        uint256 gameId,
        uint256 punkshipId
    );
    event RegistrationClosed(uint256 registrationPhase, uint256 gameId);

    error RegistrationClosedError();
    error PlayerAlreadyRegisteredError();
    error PlayerNotOwnerOfShipError();

    IGamePunk public gamePunk;
    IPunkships public punkships;

    mapping(address => Player) public registeredPlayers;
    address[] private registeredPlayerAddresses;
    bool public registrationClosed = true;
    uint256 public lastGameId;
    uint256 public registrationPhase;

    struct Player {
        bool registered;
        uint256 punkshipId;
    }

    constructor(
        address _gamePunkAddress,
        address _punkshipsAddress
    ) Ownable(msg.sender) {
        gamePunk = IGamePunk(_gamePunkAddress);
        punkships = IPunkships(_punkshipsAddress);
    }

    fallback() external {}

    function startRegistration() public onlyOwner {
        registrationPhase += 1;
        lastGameId += 1;
        registrationClosed = false;

        for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            delete registeredPlayers[registeredPlayerAddresses[i]];
        }
        delete registeredPlayerAddresses;
        emit RegistrationStarted(registrationPhase, lastGameId);
    }

    function registerPlayer(uint256 _punkshipId) public {
        if (registrationClosed) revert RegistrationClosedError();
        if (registeredPlayers[msg.sender].registered)
            revert PlayerAlreadyRegisteredError();
        if (punkships.ownerOf(_punkshipId) != msg.sender)
            revert PlayerNotOwnerOfShipError();

        // registeredPlayers[msg.sender] = Player(true, _punkshipId, punkships.getRange(_punkshipId), punkships.getShootingRange(_punkshipId));
        registeredPlayers[msg.sender] = Player(true, _punkshipId);
        registeredPlayerAddresses.push(msg.sender);
        emit PlayerRegistered(registrationPhase, msg.sender, _punkshipId);
    }

    function closeRegistration(
        uint8 _maxPlayersPerGame,
        uint8 _radius
    ) public onlyOwner {
        registrationClosed = true;
        uint8 gamePlayerCount = 0;

        for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            if (gamePlayerCount == 0) {
                emit RegistrationClosed(registrationPhase, lastGameId);
                gamePunk.startNewGame(lastGameId, _radius); // Start a new game when the previous one is filled
            }

            address playerAddress = registeredPlayerAddresses[i];
            Player storage player = registeredPlayers[playerAddress];

            gamePunk.addShip(playerAddress, lastGameId, player.punkshipId);
            emit PlayerAdded(
                registrationPhase,
                playerAddress,
                lastGameId,
                player.punkshipId
            );

            gamePlayerCount++;

            if (gamePlayerCount == _maxPlayersPerGame) {
                lastGameId++;
                gamePlayerCount = 0;
            }
        }
    }
}
