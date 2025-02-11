// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IGameyarts {
    function startNewGame(
        uint256 gameId,
        uint8 radius,
        uint8 mapShrink
    ) external;

    function addShip(address players, uint256 gameId, uint256 tokenId) external;
}

interface Iyarts {
    function safeMint(address to, uint256 tokenId) external;

    function getRange(uint256 tokenId) external view returns (uint8);

    function getShootingRange(uint256 tokenId) external view returns (uint8);

    function getShipTypeName(
        uint256 tokenId
    ) external view returns (string memory);

    function ownerOf(uint256 tokenId) external view returns (address);
}

contract Registrationyarts is Ownable {
    event RegistrationStarted(uint256 registrationPhase, uint256 firstGameId);
    event PlayerRegistered(
        uint256 registrationPhase,
        address player,
        uint256 yartsshipId
    );
    event PlayerAdded(
        uint256 registrationPhase,
        address player,
        uint256 gameId,
        uint256 yartsshipId
    );
    event RegistrationClosed(uint256 registrationPhase, uint256 gameId);

    error RegistrationClosedError();
    error PlayerAlreadyRegisteredError();
    error PlayerNotOwnerOfShipError();

    IGameyarts public gameyarts;
    Iyarts public yarts;

    mapping(address => Player) public registeredPlayers;
    address[] private registeredPlayerAddresses;
    bool public registrationClosed = true;
    uint256 public lastGameId;
    uint256 public registrationPhase;
    address public kmsPublicAddress;

    modifier onlyKmsOrOwner() {
        require(
            msg.sender == kmsPublicAddress || msg.sender == owner(),
            "Caller is not owner or KMS"
        );
        _;
    }

    struct Player {
        bool registered;
        uint256 yartsshipId;
    }

    constructor(
        address _gameyartsAddress,
        address _yartsAddress
    ) Ownable(msg.sender) {
        gameyarts = IGameyarts(_gameyartsAddress);
        yarts = Iyarts(_yartsAddress);
    }

    fallback() external {}

    // Function to set the KMS public address
    function setKmsPublicAddress(address _kmsPublicAddress) external onlyOwner {
        kmsPublicAddress = _kmsPublicAddress;
    }

    function startRegistration() public onlyKmsOrOwner {
        registrationPhase += 1;
        registrationClosed = false;

        for (uint i = 0; i < registeredPlayerAddresses.length; i++) {
            delete registeredPlayers[registeredPlayerAddresses[i]];
        }
        delete registeredPlayerAddresses;
        emit RegistrationStarted(registrationPhase, lastGameId);
    }

    function registerPlayer(uint256 _yartsshipId) public {
        if (registrationClosed) revert RegistrationClosedError();
        if (registeredPlayers[msg.sender].registered)
            revert PlayerAlreadyRegisteredError();
        if (yarts.ownerOf(_yartsshipId) != msg.sender)
            revert PlayerNotOwnerOfShipError();

        // registeredPlayers[msg.sender] = Player(true, _yartsshipId, yarts.getRange(_yartsshipId), yarts.getShootingRange(_yartsshipId));
        registeredPlayers[msg.sender] = Player(true, _yartsshipId);
        registeredPlayerAddresses.push(msg.sender);
        emit PlayerRegistered(registrationPhase, msg.sender, _yartsshipId);
    }

    function closeRegistration(
        uint8 _maxPlayersPerGame,
        uint8 _radius,
        uint8 _mapShrink
    ) public onlyKmsOrOwner {
        registrationClosed = true;
        uint16 totalPlayers = uint16(registeredPlayerAddresses.length);
        uint16 numberOfFullGames = totalPlayers / _maxPlayersPerGame;
        uint16 currentIndex = 0;

        for (uint16 gameCount = 0; gameCount < numberOfFullGames; gameCount++) {
            lastGameId++;
            emit RegistrationClosed(registrationPhase, lastGameId);
            gameyarts.startNewGame(lastGameId, _radius, _mapShrink);

            for (uint16 i = 0; i < _maxPlayersPerGame; i++) {
                address playerAddress = registeredPlayerAddresses[currentIndex];
                Player storage player = registeredPlayers[playerAddress];

                gameyarts.addShip(
                    playerAddress,
                    lastGameId,
                    player.yartsshipId
                );
                emit PlayerAdded(
                    registrationPhase,
                    playerAddress,
                    lastGameId,
                    player.yartsshipId
                );

                currentIndex++;
            }
        }
    }
}
