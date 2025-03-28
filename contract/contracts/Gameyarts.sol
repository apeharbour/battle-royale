// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./Mapyarts.sol";
import "./SharedStructs.sol";
import "./Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICOV {
    function mint(
        address to,
        uint256 tokenId,
        uint256 gameId,
        int16[] calldata islandsQ,
        int16[] calldata islandsR,
        address[] calldata players,
        uint8[] calldata qs,
        uint8[] calldata rs,
        uint256[] calldata indices,
        uint8[] calldata winnerQs,
        uint8[] calldata winnerRs,
        uint8[3] calldata hullColor,
        uint8[3] calldata windowColor,
        uint8[3] calldata mastColor
    ) external;
}

error ShipAlreadyAdded(address player, uint8 q, uint8 r);
error NotOwnerOfShip(address player, uint256 tokenId);

interface Iyartsships {
    function getRange(uint256 tokenId) external view returns (uint8);

    function getShootingRange(uint256 tokenId) external view returns (uint8);

    function getShipTypeName(
        uint256 tokenId
    ) external view returns (string memory);

    function getImage(uint256 tokenId) external view returns (string memory);

    function getColors(
        uint256 tokenId
    ) external view returns (uint8[3][10] memory);

    function ownerOf(uint256 tokenId) external view returns (address);

    function burnByGameContract(uint256 tokenId) external;
}

contract Gameyarts is Ownable {
    //Events
    event PlayerAdded(
        address indexed player,
        uint256 gameId,
        uint256 yartsshipId,
        uint8 q,
        uint8 r,
        uint8 speed,
        uint8 range,
        string image
    );
    event PlayerDefeated(address indexed player, uint256 gameId);
    event GameUpdated(
        bool indexed gameStatus,
        address indexed winnerAddress,
        uint256 gameId
    );
    event GameWinner(address indexed winner, uint256 gameId);
    event GameStarted(uint256 gameId);
    event GameEnded(uint256 gameId);
    event NewRound(uint256 gameId, uint256 roundId, uint8 radius);
    event CommitPhaseStarted(uint256 gameId);
    event SubmitPhaseStarted(uint256 gameId, uint256 round);
    event MoveCommitted(
        address indexed player,
        uint256 gameId,
        bytes32 moveHash
    );
    event MoveSubmitted(
        address indexed player,
        uint256 gameId,
        uint256 roundId,
        uint8 destQ,
        uint8 destR,
        uint8 shotQ,
        uint8 shotR
    );
    event MapInitialized(uint8 radius, uint256 gameId, uint8 mapShrink);
    event ShipMoved(
        address indexed captain,
        uint8 initialQ,
        uint8 initialR,
        uint8 q,
        uint8 r,
        uint256 gameId
    );
    event ShipShot(
        address indexed captain,
        uint8 fromQ,
        uint8 fromR,
        uint8 shotQ,
        uint8 shotR,
        uint256 gameId
    );
    event ShipHit(
        address indexed victim,
        address indexed attacker,
        uint256 gameId
    );
    event ShipCollidedWithIsland(
        address indexed captain,
        uint256 gameId,
        uint8 q,
        uint8 r
    );
    event ShipSunk(address indexed captain, uint256 gameId);
    event ShipSunkOutOfMap(address indexed captain, uint256 gameId);
    event WorldUpdated(uint256 gameId);
    event ShipMovedInGame(address indexed captain, uint256 gameId);
    event MapShrink(uint256 gameId);
    event Cell(uint256 gameId, uint8 q, uint8 r, bool island);
    event CellDeleted(uint256 gameId, uint8 q, uint8 r);
    event MutualShot(address[] players, uint256 gameId);

    struct Ship {
        SharedStructs.Coordinate coordinate;
        SharedStructs.Directions travelDirection;
        uint8 travelDistance;
        SharedStructs.Directions shotDirection;
        uint8 shotDistance;
        bool publishedMove;
        address captain;
        uint8 yachtSpeed;
        uint8 yachtRange;
        uint256 gameId;
        uint256 yartsshipId;
    }

    struct MovementData {
        uint8 destQ;
        uint8 destR;
    }

    struct GameInstance {
        uint256 round;
        uint8 shrinkNo;
        uint8 mapShrink;
        mapping(address => Ship) ships;
        address[] players;
        address[] allPlayers;
        bool gameInProgress;
        bool stopAddingShips;
        bool letCommitMoves;
        bool letSubmitMoves;
        mapping(address => bytes32) moveHashes;
        mapping(address => MovementData[]) movementHistory;
    }

    mapping(uint256 => GameInstance) public games;
    mapping(uint256 => SharedStructs.Coordinate[]) private gameIslands;

    Mapyarts immutable map;
    Iyartsships immutable yartsships;
    ICOV immutable cov;
    address public registrationContract;
    address public kmsPublicAddress;

    // Modifier to restrict the call to the registration contract
    modifier onlyRegistrationContractOrOwner() {
        require(
            msg.sender == registrationContract || msg.sender == owner(),
            "Invalid caller"
        );
        _;
    }

    modifier onlyKmsOrOwner() {
        require(
            msg.sender == kmsPublicAddress || msg.sender == owner(),
            "Invalid caller"
        );
        _;
    }

    constructor(
        address _mapAddress,
        address _yartsshipsAddress,
        address _covAddress
    ) Ownable(msg.sender) {
        map = Mapyarts(_mapAddress);
        yartsships = Iyartsships(_yartsshipsAddress);
        cov = ICOV(_covAddress);
    }

    fallback() external {}

    // Function to set the registration contract's address
    function setRegistrationContract(
        address _registrationContract
    ) external onlyOwner {
        registrationContract = _registrationContract;
    }

    // Function to set the KMS public address
    function setKmsPublicAddress(address _kmsPublicAddress) external onlyOwner {
        kmsPublicAddress = _kmsPublicAddress;
    }

    function startNewGame(
        uint256 _gameId,
        uint8 _radius,
        uint8 _mapShrink
    ) public onlyRegistrationContractOrOwner {
        require(!games[_gameId].gameInProgress, "GameID already progress");
        games[_gameId].gameInProgress = true;
        initGame(_radius, _gameId, _mapShrink);
        allowCommitMoves(_gameId);
        emit GameStarted(_gameId);
    }

    function initGame(
        uint8 _radius,
        uint256 _gameId,
        uint8 _mapShrink
    ) internal {
        require(games[_gameId].gameInProgress == true, "not started");

        // Reset ships for the game
        for (uint256 i = 0; i < games[_gameId].players.length; i++) {
            delete games[_gameId].ships[games[_gameId].players[i]];
        }
        delete games[_gameId].players;

        // Reset islands storage for this game
        delete gameIslands[_gameId];

        // Start a new round and initialize map shrink value
        addNewRound(_gameId);
        games[_gameId].mapShrink = _mapShrink;

        // Initialize the map and fetch cells
        SharedStructs.Cell[] memory cells = map.initMap(_radius, _gameId);

        // Store all island positions
        for (uint j = 0; j < cells.length; j++) {
            if (cells[j].island) {
                gameIslands[_gameId].push(
                    SharedStructs.Coordinate(cells[j].q, cells[j].r)
                );
            }
            emit Cell(_gameId, cells[j].q, cells[j].r, cells[j].island);
        }

        emit MapInitialized(_radius, _gameId, _mapShrink);
    }

    //function to let players commit moves
    function allowCommitMoves(uint256 gameId) internal {
        require(games[gameId].gameInProgress == true, "not started");
        games[gameId].letCommitMoves = true;
        emit CommitPhaseStarted(gameId);
    }

    //commit moves
    function commitMove(bytes32 moveHash, uint256 gameId) public {
        require(games[gameId].letCommitMoves == true, "not started");
        games[gameId].moveHashes[msg.sender] = moveHash;
        emit MoveCommitted(msg.sender, gameId, moveHash);
    }

    function encodeCommitment(
        SharedStructs.Directions _travelDirection,
        uint8 _travelDistance,
        SharedStructs.Directions _shotDirection,
        uint8 _shotDistance,
        uint8 _secret,
        address _playerAddress
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _travelDirection,
                    _travelDistance,
                    _shotDirection,
                    _shotDistance,
                    _secret,
                    _playerAddress
                )
            );
    }

    function submitMove(
        SharedStructs.Directions[] memory _travelDirections,
        uint8[] memory _travelDistances,
        SharedStructs.Directions[] memory _shotDirections,
        uint8[] memory _shotDistances,
        uint8[] memory _secrets,
        address[] memory _playerAddresses,
        uint256 gameId
    ) public onlyKmsOrOwner {
        require(games[gameId].gameInProgress == true, "not started");
        require(
            _playerAddresses.length == _travelDirections.length,
            "same length"
        );
        require(
            _travelDirections.length == _travelDistances.length,
            "same length"
        );
        require(_shotDirections.length == _shotDistances.length, "same length");
        require(_secrets.length == _playerAddresses.length, "same length");

        for (uint i = 0; i < _playerAddresses.length; i++) {
            // Calculate move hash
            bytes32 moveHash = encodeCommitment(
                _travelDirections[i],
                _travelDistances[i],
                _shotDirections[i],
                _shotDistances[i],
                _secrets[i],
                _playerAddresses[i]
            );

            // Initialize variables for destination coordinates
            Ship storage ship = games[gameId].ships[_playerAddresses[i]];
            SharedStructs.Coordinate memory dest;

            // Check if moveHash matches the stored hash for this player
            if (games[gameId].moveHashes[_playerAddresses[i]] == moveHash) {
                ship.travelDirection = _travelDirections[i];
                ship.travelDistance = _travelDistances[i] > ship.yachtSpeed
                    ? ship.yachtSpeed
                    : _travelDistances[i];
                ship.shotDirection = _shotDirections[i];
                ship.shotDistance = _shotDistances[i] > ship.yachtRange
                    ? ship.yachtRange
                    : _shotDistances[i];
                ship.publishedMove = true;

                // Calculate move coordinates
                SharedStructs.Coordinate memory shipCoord = ship.coordinate;
                dest = map.move(
                    shipCoord,
                    _travelDirections[i],
                    _travelDistances[i]
                );
                SharedStructs.Coordinate memory shotDestination = map.move(
                    dest,
                    _shotDirections[i],
                    _shotDistances[i]
                );

                emit MoveSubmitted(
                    _playerAddresses[i],
                    gameId,
                    games[gameId].round,
                    dest.q,
                    dest.r,
                    shotDestination.q,
                    shotDestination.r
                );
            } else {
                dest = ship.coordinate;
            }

            MovementData memory movement = MovementData({
                destQ: dest.q,
                destR: dest.r
            });
            games[gameId].movementHistory[_playerAddresses[i]].push(movement);
        }
        updateWorld(gameId);
    }

    function addShip(
        address playerAddress,
        uint256 gameId,
        uint256 _yartsshipId
    ) public onlyRegistrationContractOrOwner {
        require(games[gameId].gameInProgress == true, "not started");

        if (yartsships.ownerOf(_yartsshipId) != playerAddress) {
            revert NotOwnerOfShip(playerAddress, _yartsshipId);
        }

        if (
            games[gameId].ships[playerAddress].coordinate.q > 0 &&
            games[gameId].ships[playerAddress].coordinate.r > 0
        ) {
            revert ShipAlreadyAdded(
                playerAddress,
                games[gameId].ships[playerAddress].coordinate.q,
                games[gameId].ships[playerAddress].coordinate.r
            );
        }
        SharedStructs.Coordinate memory coord;
        bool alreadyTaken = false;
        do {
            alreadyTaken = false;
            coord = map.getRandomCoordinatePair(gameId);
            for (uint8 i = 0; i < games[gameId].players.length; i++) {
                if (
                    games[gameId]
                        .ships[games[gameId].players[i]]
                        .coordinate
                        .q ==
                    coord.q &&
                    games[gameId]
                        .ships[games[gameId].players[i]]
                        .coordinate
                        .r ==
                    coord.r
                ) {
                    alreadyTaken = true;
                    break;
                }
            }
        } while (alreadyTaken);

        uint8 range = yartsships.getRange(_yartsshipId);
        uint8 shootingRange = yartsships.getShootingRange(_yartsshipId);
        string memory image = yartsships.getImage(_yartsshipId);

        Ship memory ship = Ship(
            coord,
            SharedStructs.Directions.E,
            0,
            SharedStructs.Directions.E,
            0,
            false,
            playerAddress,
            range,
            shootingRange,
            gameId,
            _yartsshipId
        );

        games[gameId].ships[playerAddress] = ship;
        games[gameId].players.push(playerAddress);
        games[gameId].allPlayers.push(playerAddress);

        MovementData memory initialMovement = MovementData({
            destQ: coord.q,
            destR: coord.r
        });
        games[gameId].movementHistory[playerAddress].push(initialMovement);

        emit PlayerAdded(
            playerAddress,
            gameId,
            _yartsshipId,
            coord.q,
            coord.r,
            range,
            shootingRange,
            image
        );
    }

    function sinkShip(address captain, uint256 gameId) internal {
        require(games[gameId].gameInProgress == true, "not started");
        emit PlayerDefeated(captain, gameId);
        yartsships.burnByGameContract(games[gameId].ships[captain].yartsshipId);
        delete games[gameId].ships[captain];
    }

    function isShipOutsideMap(
        SharedStructs.Coordinate memory shipCoord,
        uint256 gameId
    ) internal view returns (bool) {
        SharedStructs.Cell memory cell = map.getCell(shipCoord, gameId);
        return !cell.exists;
    }

    function updateWorld(uint256 gameId) public onlyKmsOrOwner {
        require(games[gameId].gameInProgress, "not started");

        // Initialize shot destinations and active status
        SharedStructs.Coordinate[]
            memory shotDestinations = new SharedStructs.Coordinate[](
                games[gameId].players.length
            );
        bool[] memory isActive = new bool[](games[gameId].players.length);

        // Initialize all ships as active
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            isActive[i] = true;
        }

        // Move ships and handle deaths due to invalid moves
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            address player = games[gameId].players[i];
            Ship storage ship = games[gameId].ships[player];

            if (ship.captain == address(0)) {
                continue;
            }

            if (ship.publishedMove) {
                (bool dies, SharedStructs.Coordinate memory dest) = map.travel(
                    ship.coordinate,
                    ship.travelDirection,
                    ship.travelDistance,
                    gameId
                );

                if (dies) {
                    emit ShipCollidedWithIsland(player, gameId, dest.q, dest.r);
                    sinkShip(player, gameId);
                    isActive[i] = false;
                    ship.coordinate = dest;
                    continue;
                }
                emit ShipMoved(
                    player,
                    ship.coordinate.q,
                    ship.coordinate.r,
                    dest.q,
                    dest.r,
                    gameId
                );
                ship.coordinate = dest;

                emit ShipMovedInGame(player, gameId);
            }
        }

        // Calculate shot destinations for active ships
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            if (isActive[i]) {
                address player = games[gameId].players[i];
                Ship storage ship = games[gameId].ships[player];

                SharedStructs.Coordinate memory shotDest = map.calculateShot(
                    ship.coordinate,
                    ship.shotDirection,
                    ship.shotDistance
                );
                shotDestinations[i] = shotDest;
                emit ShipShot(
                    player,
                    ship.coordinate.q,
                    ship.coordinate.r,
                    shotDest.q,
                    shotDest.r,
                    gameId
                );
            }
        }

        // Handle ship collisions
        bool[] memory collided = new bool[](games[gameId].players.length);
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            if (!isActive[i]) continue;
            address playerI = games[gameId].players[i];
            Ship storage shipI = games[gameId].ships[playerI];
            for (uint256 j = i + 1; j < games[gameId].players.length; j++) {
                if (!isActive[j]) continue;
                address playerJ = games[gameId].players[j];
                Ship storage shipJ = games[gameId].ships[playerJ];
                if (
                    shipI.coordinate.q == shipJ.coordinate.q &&
                    shipI.coordinate.r == shipJ.coordinate.r
                ) {
                    collided[i] = true;
                    collided[j] = true;
                }
            }
        }
        // Now sink every ship that was marked as collided
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            if (collided[i]) {
                emit ShipSunk(games[gameId].players[i], gameId);
                sinkShip(games[gameId].players[i], gameId);
                isActive[i] = false;
            }
        }
        
        // Track which ships have been shot and by whom
        bool[] memory isShot = new bool[](games[gameId].players.length);
        uint256[] memory shotBy = new uint256[](games[gameId].players.length);

        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            isShot[i] = false;
            shotBy[i] = type(uint256).max; // Max value represents 'no shooter'
        }

        // Identify ships that have been shot
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            if (!isActive[i]) continue;

            for (uint256 j = 0; j < games[gameId].players.length; j++) {
                if (i == j || !isActive[j]) continue;

                Ship storage targetShip = games[gameId].ships[
                    games[gameId].players[i]
                ];
                SharedStructs.Coordinate memory shotDest = shotDestinations[j];

                if (
                    shotDest.q == targetShip.coordinate.q &&
                    shotDest.r == targetShip.coordinate.r
                ) {
                    isShot[i] = true;
                    shotBy[i] = j;
                }
            }
        }

        // Track mutual shots
        address[] memory playersInvolvedInMutualShot = new address[](
            games[gameId].players.length
        );
        uint256 mutualShotCount = 0;

        // Handle shots
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            if (!isActive[i]) continue;

            if (isShot[i]) {
                uint256 attackerIndex = shotBy[i];
                address attacker = games[gameId].players[attackerIndex];

                // Check if mutual shot
                if (isShot[attackerIndex] && shotBy[attackerIndex] == i) {
                    // Mutual shot
                    if (
                        !alreadyAddedToMutualShot(
                            playersInvolvedInMutualShot,
                            games[gameId].players[i]
                        )
                    ) {
                        playersInvolvedInMutualShot[mutualShotCount] = games[
                            gameId
                        ].players[i];
                        mutualShotCount++;
                    }
                    if (
                        !alreadyAddedToMutualShot(
                            playersInvolvedInMutualShot,
                            attacker
                        )
                    ) {
                        playersInvolvedInMutualShot[mutualShotCount] = attacker;
                        mutualShotCount++;
                    }
                    isActive[i] = false;
                    isActive[attackerIndex] = false;
                } else {
                    // Only the target ship is sunk
                    emit ShipHit(games[gameId].players[i], attacker, gameId);
                    isActive[i] = false;
                    sinkShip(games[gameId].players[i], gameId);
                }
            }
        }

        // Handle mutual shots
        if (mutualShotCount > 0) {
            address[] memory mutualShotPlayers = new address[](mutualShotCount);
            for (uint256 k = 0; k < mutualShotCount; k++) {
                mutualShotPlayers[k] = playersInvolvedInMutualShot[k];
            }
            emit MutualShot(mutualShotPlayers, gameId);
            for (uint256 k = 0; k < mutualShotPlayers.length; k++) {
                sinkShip(mutualShotPlayers[k], gameId);
                // Find the index of the player and set isActive to false
                for (
                    uint256 idx = 0;
                    idx < games[gameId].players.length;
                    idx++
                ) {
                    if (games[gameId].players[idx] == mutualShotPlayers[k]) {
                        isActive[idx] = false;
                        break;
                    }
                }
            }
        }

        // Remove sunk players from the active list
        uint256 i = games[gameId].players.length;
        while (i > 0) {
            i--;
            if (!isActive[i]) {
                // Remove the player
                games[gameId].players[i] = games[gameId].players[
                    games[gameId].players.length - 1
                ];
                games[gameId].players.pop();
            }
        }

        // Check for winner, emit events accordingly
        if (games[gameId].players.length == 0) {
            emit GameWinner(address(0), gameId);
            games[gameId].stopAddingShips = true;
        } else if (games[gameId].players.length == 1) {
            address winner = games[gameId].players[0];
            emit GameWinner(winner, gameId);
            games[gameId].stopAddingShips = true;

            uint256 winnerShipId = games[gameId].ships[winner].yartsshipId;

            // Call getColors from Yarts contract
            uint8[3][10] memory colors = yartsships.getColors(winnerShipId);

            uint8[3] memory hullColor = colors[2];
            uint8[3] memory windowColor = colors[4];
            uint8[3] memory mastColor = colors[5];

            // Get islands data
            (uint8[] memory IslandsQ, uint8[] memory IslandsR) = getIslands(
                gameId
            );

            // Get players' addresses and movement data
            address[] memory players;
            uint8[] memory qs;
            uint8[] memory rs;
            uint256[] memory indices;

            (players, qs, rs, indices) = getPlayersMovementData(gameId, winner);

            // Convert islands data to int16[]
            int16[] memory islandsQ = uint8ArrayToInt16Array(IslandsQ);
            int16[] memory islandsR = uint8ArrayToInt16Array(IslandsR);

            // Generate a unique tokenId
            uint256 tokenId = gameId;

            // Extract winner's movement history
            MovementData[] storage winnerMovements = games[gameId]
                .movementHistory[winner];
            uint8[] memory winnerQs = new uint8[](winnerMovements.length);
            uint8[] memory winnerRs = new uint8[](winnerMovements.length);

            for (uint256 i = 0; i < winnerMovements.length; i++) {
                winnerQs[i] = winnerMovements[i].destQ;
                winnerRs[i] = winnerMovements[i].destR;
            }

            // Call the cov contract's mint function
            cov.mint(
                winner,
                tokenId,
                gameId,
                islandsQ,
                islandsR,
                players,
                qs,
                rs,
                indices,
                winnerQs,
                winnerRs,
                hullColor,
                windowColor,
                mastColor
            );
        } else {
            // Shrink map every [mapShrink] rounds
            uint8 currentRadius = map.gameRadii(gameId);
            if (
                currentRadius > 1 &&
                (games[gameId].round % games[gameId].mapShrink == 0)
            ) {
                SharedStructs.Coordinate[] memory deletedCells = map
                    .deleteOutermostRing(gameId);
                games[gameId].shrinkNo++;
                emit MapShrink(gameId);
                for (uint8 i = 0; i < deletedCells.length; i++) {
                    emit CellDeleted(
                        gameId,
                        deletedCells[i].q,
                        deletedCells[i].r
                    );
                }

                // Sink players outside the invalid map cells
                uint256 i = games[gameId].players.length;
                while (i > 0) {
                    i--;
                    address player = games[gameId].players[i];
                    SharedStructs.Coordinate memory shipCoord = games[gameId]
                        .ships[player]
                        .coordinate;

                    if (isShipOutsideMap(shipCoord, gameId)) {
                        emit ShipSunkOutOfMap(player, gameId);
                        sinkShip(player, gameId);

                        // Remove the player from the array
                        games[gameId].players[i] = games[gameId].players[
                            games[gameId].players.length - 1
                        ];
                        games[gameId].players.pop();
                    }
                }
            }
            emit GameUpdated(false, games[gameId].players[0], gameId);
            for (uint256 i = 0; i < games[gameId].players.length; i++) {
                Ship storage ship = games[gameId].ships[
                    games[gameId].players[i]
                ];
                ship.travelDirection = SharedStructs.Directions.NO_MOVE;
                ship.travelDistance = 0;
                ship.shotDirection = SharedStructs.Directions.NO_MOVE;
                ship.shotDistance = 0;
                ship.publishedMove = false;
            }
            games[gameId].letSubmitMoves = false;
            addNewRound(gameId);
            allowCommitMoves(gameId);
        }

        emit WorldUpdated(gameId);
    }

    // Helper function to check if a player is already added to the mutual shot array
    function alreadyAddedToMutualShot(
        address[] memory players,
        address player
    ) internal pure returns (bool) {
        for (uint8 i = 0; i < players.length; i++) {
            if (players[i] == player) {
                return true;
            }
        }
        return false;
    }

    function addNewRound(uint256 gameId) internal returns (uint256) {
        uint8 currentRadius = map.gameRadii(gameId);
        games[gameId].round++;
        emit NewRound(gameId, games[gameId].round, currentRadius);
        return games[gameId].round;
    }

    function toString(address account) internal pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(bytes memory data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function getShips(uint256 gameId) public view returns (Ship[] memory) {
        require(games[gameId].gameInProgress == true, "not started");
        Ship[] memory returnShips = new Ship[](games[gameId].players.length);

        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            returnShips[i] = games[gameId].ships[games[gameId].players[i]];
        }
        return returnShips;
    }

    function getRadius(uint256 gameId) public view returns (uint8) {
        require(games[gameId].gameInProgress == true, "not started");
        return map.gameRadii(gameId);
    }

    function getCell(
        SharedStructs.Coordinate memory _coord,
        uint256 gameId
    ) public view returns (SharedStructs.Cell memory) {
        require(games[gameId].gameInProgress == true, "not started");
        return map.getCell(_coord, gameId);
    }

    function move(
        SharedStructs.Coordinate memory _start,
        SharedStructs.Directions _dir,
        uint8 _distance,
        uint256 gameId
    ) external view returns (SharedStructs.Coordinate memory) {
        require(games[gameId].gameInProgress == true, "not started");
        return map.move(_start, _dir, _distance);
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance,
        uint256 gameId
    ) external {
        require(games[gameId].gameInProgress == true, "not started");
        (bool dies, SharedStructs.Coordinate memory dest) = map.travel(
            _startCell,
            _direction,
            _distance,
            gameId
        );

        if (dies) {
            sinkShip(msg.sender, gameId);
        } else {
            games[gameId].ships[msg.sender].coordinate.q = dest.q;
            games[gameId].ships[msg.sender].coordinate.r = dest.r;
        }
    }

    function getCoordinates(
        uint256 gameId
    ) public view returns (SharedStructs.Coordinate[] memory) {
        require(games[gameId].gameInProgress == true, "not started");
        uint8 radius = map.gameRadii(gameId);
        uint256 numberOfCells = 1 + 3 * radius * (radius + 1);
        SharedStructs.Coordinate[]
            memory cells = new SharedStructs.Coordinate[](numberOfCells);
        cells[0] = SharedStructs.Coordinate(radius, radius);
        for (uint8 i = 1; i <= radius; i++) {
            // loop through all radii
            uint256 start = 1 + 3 * (i - 1) * i; // #of cells at radius -1
            SharedStructs.Coordinate[] memory ring = map.ring(cells[0], i);
            for (uint8 c = 0; c < ring.length; c++) {
                cells[start + c] = ring[c];
            }
        }
        return cells;
    }

    function getIslands(
        uint256 gameId
    ) public view returns (uint8[] memory IslandsQ, uint8[] memory IslandsR) {
        require(games[gameId].gameInProgress == true, "not started");

        uint256 islandCount = gameIslands[gameId].length;
        IslandsQ = new uint8[](islandCount);
        IslandsR = new uint8[](islandCount);

        for (uint256 i = 0; i < islandCount; i++) {
            IslandsQ[i] = uint8(gameIslands[gameId][i].q);
            IslandsR[i] = uint8(gameIslands[gameId][i].r);
        }

        return (IslandsQ, IslandsR);
    }

    function getPlayersMovementData(
        uint256 gameId,
        address winner
    )
        internal
        view
        returns (
            address[] memory players,
            uint8[] memory qs,
            uint8[] memory rs,
            uint256[] memory indices
        )
    {
        address[] storage allPlayers = games[gameId].allPlayers;
        uint256 totalPlayers = allPlayers.length;
        uint256 playerCount = 0;
        uint256 totalMovements = 0;

        // First pass: count the players and total movements
        for (uint256 i = 0; i < totalPlayers; i++) {
            address player = allPlayers[i];
            if (player != winner) {
                playerCount++;
                totalMovements += games[gameId].movementHistory[player].length;
            }
        }

        // Initialize arrays
        players = new address[](playerCount);
        qs = new uint8[](totalMovements);
        rs = new uint8[](totalMovements);
        indices = new uint256[](playerCount + 1);

        uint256 movementIndex = 0;
        uint256 playerIndex = 0;

        // Second pass: populate arrays
        for (uint256 i = 0; i < totalPlayers; i++) {
            address player = allPlayers[i];
            if (player != winner) {
                players[playerIndex] = player;
                indices[playerIndex] = movementIndex;

                MovementData[] storage movements = games[gameId]
                    .movementHistory[player];
                for (uint256 j = 0; j < movements.length; j++) {
                    qs[movementIndex] = movements[j].destQ;
                    rs[movementIndex] = movements[j].destR;
                    movementIndex++;
                }

                playerIndex++;
            }
        }

        indices[playerIndex] = movementIndex; // End index

        return (players, qs, rs, indices);
    }

    function uint8ArrayToInt16Array(
        uint8[] memory input
    ) internal pure returns (int16[] memory output) {
        output = new int16[](input.length);
        for (uint256 i = 0; i < input.length; i++) {
            output[i] = int16(uint16(input[i]));
        }
        return output;
    }
}
