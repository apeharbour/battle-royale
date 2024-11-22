// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./MapPunk.sol";
import "./SharedStructs.sol";
import "./Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ShipAlreadyAdded(address player, uint8 q, uint8 r);
error NotOwnerOfShip(address player, uint256 tokenId);

interface IPunkships {
    function safeMint(address to, uint256 tokenId) external;

    function getRange(uint256 tokenId) external pure returns (uint8);

    function getShootingRange(uint256 tokenId) external pure returns (uint8);

    function getShipTypeName(
        uint256 tokenId
    ) external pure returns (string memory);

    function getImage(uint256 tokenId) external pure returns (string memory);

    function ownerOf(uint256 tokenId) external pure returns (address);

    function burnByGameContract(uint256 tokenId) external;
}

contract GamePunk is Ownable {
    //Events
    event PlayerAdded(
        address indexed player,
        uint256 gameId,
        uint256 punkshipId,
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
        uint256 punkshipId;
    }

    struct GameInstance {
        uint256 round;
        uint8 shrinkNo;
        uint8 mapShrink;
        mapping(address => Ship) ships;
        address[] players;
        bool gameInProgress;
        bool stopAddingShips;
        bool letCommitMoves;
        bool letSubmitMoves;
        mapping(address => bytes32) moveHashes;
    }
    mapping(uint256 => GameInstance) public games;
    MapPunk immutable map;
    IPunkships immutable punkships;
    address public registrationContract;

    // Modifier to restrict the call to the registration contract
    modifier onlyRegistrationContractOrOwner() {
        require(
            msg.sender == registrationContract || msg.sender == owner(),
            "Caller is not owner or registration contract"
        );
        _;
    }

    constructor(
        address _mapAddress,
        address _punkshipsAddress
    ) Ownable(msg.sender) {
        map = MapPunk(_mapAddress);
        punkships = IPunkships(_punkshipsAddress);
    }

    fallback() external {}

    // Function to set the registration contract's address
    function setRegistrationContract(
        address _registrationContract
    ) external onlyOwner {
        registrationContract = _registrationContract;
    }

    function startNewGame(
        uint256 _gameId,
        uint8 _radius,
        uint8 _mapShrink
    ) public onlyRegistrationContractOrOwner {
        require(
            !games[_gameId].gameInProgress,
            "Game with this ID already in progress"
        );
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
        require(
            games[_gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        // reset ships
        for (uint256 i = 0; i < games[_gameId].players.length; i++) {
            delete games[_gameId].ships[games[_gameId].players[i]];
        }
        delete games[_gameId].players;
        addNewRound(_gameId);
        games[_gameId].mapShrink = _mapShrink;
        SharedStructs.Cell[] memory cells = map.initMap(_radius, _gameId);
        for (uint j = 0; j < cells.length; j++) {
            emit Cell(_gameId, cells[j].q, cells[j].r, cells[j].island);
        }
        emit MapInitialized(_radius, _gameId, _mapShrink);
    }

    //function to let players commit moves
    function allowCommitMoves(uint256 gameId) internal {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        games[gameId].letCommitMoves = true;
        emit CommitPhaseStarted(gameId);
    }

    //commit moves
    function commitMove(bytes32 moveHash, uint256 gameId) public {
        require(
            games[gameId].letCommitMoves == true,
            "Commit moves has not started yet!"
        );
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

    //SubmitMove
    function submitMove(
        SharedStructs.Directions[] memory _travelDirections,
        uint8[] memory _travelDistances,
        SharedStructs.Directions[] memory _shotDirections,
        uint8[] memory _shotDistances,
        uint8[] memory _secrets,
        address[] memory _playerAddresses,
        uint256 gameId
    ) public onlyOwner {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        require(
            _playerAddresses.length == _travelDirections.length,
            "Arrays must have the same length"
        );
        require(
            _travelDirections.length == _travelDistances.length,
            "Arrays must have the same length"
        );
        require(
            _shotDirections.length == _shotDistances.length,
            "Arrays must have the same length"
        );
        require(
            _secrets.length == _playerAddresses.length,
            "Arrays must have the same length"
        );

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

            // console.log("hashes match %s", games[gameId].moveHashes[_playerAddresses[i]] == moveHash);

            // Check if moveHash matches the stored hash for this player
            if (games[gameId].moveHashes[_playerAddresses[i]] == moveHash) {
                Ship storage ship = games[gameId].ships[_playerAddresses[i]];
                ship.travelDirection = _travelDirections[i];
                ship.travelDistance = _travelDistances[i] > ship.yachtSpeed
                    ? ship.yachtSpeed
                    : _travelDistances[i];
                ship.shotDirection = _shotDirections[i];
                ship.shotDistance = _shotDistances[i] > ship.yachtRange
                    ? ship.yachtRange
                    : _shotDistances[i];
                ship.publishedMove = true;

                // Calculate and emit move coordinates
                SharedStructs.Coordinate memory shipCoord = ship.coordinate;
                SharedStructs.Coordinate memory dest = map.move(
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
            }
        }
        updateWorld(gameId);
    }

    function addShip(
        address playerAddress,
        uint256 gameId,
        uint256 _punkshipId
    ) public onlyRegistrationContractOrOwner {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );

        if (punkships.ownerOf(_punkshipId) != playerAddress) {
            revert NotOwnerOfShip(playerAddress, _punkshipId);
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

        uint8 range = punkships.getRange(_punkshipId);
        uint8 shootingRange = punkships.getShootingRange(_punkshipId);
        string memory image = punkships.getImage(_punkshipId);

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
            _punkshipId
        );

        games[gameId].ships[playerAddress] = ship;
        games[gameId].players.push(playerAddress);
        emit PlayerAdded(
            playerAddress,
            gameId,
            _punkshipId,
            coord.q,
            coord.r,
            range,
            shootingRange,
            image
        );
    }

    function sinkShip(address captain, uint256 gameId) internal {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        emit PlayerDefeated(captain, gameId);
        punkships.burnByGameContract(games[gameId].ships[captain].punkshipId);
        delete games[gameId].ships[captain];
    }

    function isShipOutsideMap(
        SharedStructs.Coordinate memory shipCoord,
        uint256 gameId
    ) internal view returns (bool) {
        SharedStructs.Cell memory cell = map.getCell(shipCoord, gameId);
        return !cell.exists;
    }

    function updateWorld(uint256 gameId) public onlyOwner {
        require(games[gameId].gameInProgress, "Game has not started yet!");

        // Shrink map every [mapShrink] rounds
        if (games[gameId].round % games[gameId].mapShrink == 0) {
            SharedStructs.Coordinate[] memory deletedCells = map
                .deleteOutermostRing(gameId, games[gameId].shrinkNo);
            games[gameId].shrinkNo++;
            emit MapShrink(gameId);
            for (uint8 i = 0; i < deletedCells.length; i++) {
                emit CellDeleted(gameId, deletedCells[i].q, deletedCells[i].r);
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
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            if (!isActive[i]) continue;

            for (uint256 j = i + 1; j < games[gameId].players.length; j++) {
                if (!isActive[j]) continue;

                Ship storage shipI = games[gameId].ships[
                    games[gameId].players[i]
                ];
                Ship storage shipJ = games[gameId].ships[
                    games[gameId].players[j]
                ];

                if (
                    shipI.coordinate.q == shipJ.coordinate.q &&
                    shipI.coordinate.r == shipJ.coordinate.r
                ) {
                    // Collision occurred
                    isActive[i] = false;
                    isActive[j] = false;
                    emit ShipSunk(games[gameId].players[i], gameId);
                    emit ShipSunk(games[gameId].players[j], gameId);
                    sinkShip(games[gameId].players[i], gameId);
                    sinkShip(games[gameId].players[j], gameId);
                }
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
                // No need to update isActive[i]
            }
        }

        // Check for winner, emit events accordingly
        if (games[gameId].players.length == 0) {
            emit GameWinner(address(0), gameId);
            games[gameId].stopAddingShips = true;
        } else if (games[gameId].players.length == 1) {
            emit GameWinner(games[gameId].players[0], gameId);
            games[gameId].stopAddingShips = true;
        } else {
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
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        Ship[] memory returnShips = new Ship[](games[gameId].players.length);

        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            returnShips[i] = games[gameId].ships[games[gameId].players[i]];
        }
        return returnShips;
    }

    function getRadius(uint256 gameId) public view returns (uint8) {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        return map.gameRadii(gameId);
    }

    function getCell(
        SharedStructs.Coordinate memory _coord,
        uint256 gameId
    ) public view returns (SharedStructs.Cell memory) {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        return map.getCell(_coord, gameId);
    }

    function move(
        SharedStructs.Coordinate memory _start,
        SharedStructs.Directions _dir,
        uint8 _distance,
        uint256 gameId
    ) external view returns (SharedStructs.Coordinate memory) {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
        return map.move(_start, _dir, _distance);
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance,
        uint256 gameId
    ) external {
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
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
        require(
            games[gameId].gameInProgress == true,
            "Game has not started yet!"
        );
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
}
