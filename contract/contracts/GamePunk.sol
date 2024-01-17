// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./MapPunk.sol";
import "./SharedStructs.sol";
import "./Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ShipAlreadyAdded(address player, uint8 q, uint8 r);

contract GamePunk is  Ownable {
   //Events
    event PlayerAdded(
        address indexed player,
        uint8 gameId,
        uint8 q,
        uint8 r,
        uint8 speed,
        uint8 range
    );
    event PlayerDefeated(address indexed player, uint8 gameId);
    event GameUpdated(
        bool indexed gameStatus,
        address indexed winnerAddress,
        uint8 gameId
    );
    event GameWinner(address indexed winner, uint8 gameId);
    event GameStarted(uint8 gameId);
    event GameEnded(uint8 gameId);
    event NewRound(uint8 gameId, uint256 roundId, uint8 radius);
    event CommitPhaseStarted(uint8 gameId);
    event SubmitPhaseStarted(uint8 gameId, uint256 round);
    event MoveCommitted(address indexed player, uint8 gameId);
    event MoveSubmitted(
        address indexed player,
        uint8 gameId,
        uint256 roundId,
        uint8 destQ,
        uint8 destR,
        uint8 shotQ,
        uint8 shotR
    );
    event MapInitialized(uint8 radius, uint8 gameId);
    event ShipMoved(
        address indexed captain,
        uint8 initialQ,
        uint8 initialR,
        uint8 q,
        uint8 r,
        uint8 gameId
    );
    event ShipShot(
        address indexed captain,
        uint8 fromQ,
        uint8 fromR,
        uint8 shotQ,
        uint8 shotR,
        uint8 gameId
    );
    event ShipHit(
        address indexed victim,
        address indexed attacker,
        uint8 gameId
    );
    event ShipCollidedWithIsland(
        address indexed captain,
        uint8 gameId,
        uint8 q,
        uint8 r
    );
    event ShipSunk(address indexed captain, uint8 gameId);
    event ShipSunkOutOfMap(address indexed captain, uint8 gameId);
    event WorldUpdated(uint8 gameId);
    event ShipMovedInGame(address indexed captain, uint8 gameId);
    event MapShrink(uint8 gameId);
    event Cell(uint8 gameId, uint8 q, uint8 r, bool island);

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
        uint8 gameId;
    }

    struct GameInstance {
    uint256 round;
    uint8 shrinkNo;
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
    address public registrationContract;

       // Modifier to restrict the call to the registration contract
    modifier onlyRegistrationContract() {
        require(msg.sender == registrationContract, "Caller is not the registration contract");
        _;
    }

    constructor(address _mapAddress) Ownable(msg.sender) {
        map = MapPunk(_mapAddress);
    }

    // Function to set the registration contract's address
    function setRegistrationContract(address _registrationContract) external onlyOwner {
        registrationContract = _registrationContract;
    }

  function startNewGame(uint8 gameId, uint8 _radius) public onlyRegistrationContract () {
    require(gameId < 255, "Maximum number of games reached");
    require(!games[gameId].gameInProgress, "Game with this ID already in progress");
    games[gameId].gameInProgress = true;
    initGame(_radius, gameId);
    allowSubmitMoves(gameId);
    emit GameStarted(gameId);
}

    function endGame(uint8 gameId) public onlyOwner() {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        games[gameId].gameInProgress = false;   
        emit GameEnded(gameId);    
    }   

    // function to let players submit moves
     function allowSubmitMoves(uint8 gameId) public onlyOwner {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        // games[gameId].letCommitMoves = false;
        games[gameId].letSubmitMoves = true;
        emit SubmitPhaseStarted(gameId, games[gameId].round);       
    } 

  //Submit moves
  function revealMove(
    SharedStructs.Directions _travelDirection, 
    uint8 _travelDistance, 
    SharedStructs.Directions _shotDirection, 
    uint8 _shotDistance,
    //uint256 secret,
    uint8 gameId
) public {
    require(games[gameId].letSubmitMoves == true, 'Submit moves has not started yet!');
    require(games[gameId].gameInProgress == true, 'Game has not started yet!');

    // bytes32 moveHash = keccak256(abi.encodePacked(_travelDirection, _travelDistance, _shotDirection, _shotDistance, secret));

    // if(games[gameId].moveHashes[msg.sender] == moveHash){
        Ship storage ship = games[gameId].ships[msg.sender];
        ship.travelDirection = _travelDirection;
        if(_travelDistance > ship.yachtSpeed) {
            ship.travelDistance = ship.yachtSpeed;
        } else {
            ship.travelDistance = _travelDistance;
        }        
        ship.shotDirection = _shotDirection;
        if(_shotDistance > ship.yachtRange) {
            ship.shotDistance = ship.yachtRange;
        } else {
            ship.shotDistance = _shotDistance;
        }
        ship.publishedMove = true;
   // }
     // calculate cells
        SharedStructs.Coordinate memory shipCoord = ship.coordinate;
        SharedStructs.Coordinate memory dest = map.move(
            shipCoord,
            _travelDirection,
            _travelDistance
        );
        SharedStructs.Coordinate memory shotDestination = map.move(
            dest,
            _shotDirection,
            _shotDistance
        );

        // }
        emit MoveSubmitted(
            msg.sender,
            gameId,
            games[gameId].round,
            dest.q,
            dest.r,
            shotDestination.q,
            shotDestination.r
        );
}

    function initGame(uint8 _radius, uint8 gameId) internal {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        // reset ships
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            delete games[gameId].ships[games[gameId].players[i]];
        }
        delete games[gameId].players;
        addNewRound(gameId);

      SharedStructs.Cell[] memory cells = map.initMap(_radius, gameId);
        for (uint j = 0; j < cells.length; j++) {
            emit Cell(gameId, cells[j].q, cells[j].r, cells[j].island);
        }
        emit MapInitialized(_radius,gameId);
    }

    function addShip(uint8 gameId, address[] memory playerAddresses, uint8[] memory speeds, uint8[] memory ranges) public  onlyRegistrationContract {
                require(gameId < 255, "Maximum number of games reached");
                require(games[gameId].gameInProgress, "Game not in progress");
                require(playerAddresses.length == speeds.length && playerAddresses.length == ranges.length, "Array length mismatch");
                
                for (uint i = 0; i < playerAddresses.length; i++) {
                    address playerAddress = playerAddresses[i];
                    uint8 speed = speeds[i];
                    uint8 range = ranges[i];
                    if (games[gameId].ships[playerAddress].captain != address(0)) {
                        revert ShipAlreadyAdded(playerAddress, games[gameId].ships[playerAddress].coordinate.q, games[gameId].ships[playerAddress].coordinate.r);
                    }
                    SharedStructs.Coordinate memory coord = map.getRandomCoordinatePair(gameId);
    
                    while (isCoordinateTaken(coord, gameId)) {
                         coord = map.getRandomCoordinatePair(gameId);
                    }
                    Ship memory ship = Ship(
                    coord,
                    SharedStructs.Directions.E,
                    0,
                    SharedStructs.Directions.E,
                    0,
                    false,
                    playerAddress,
                    speed,
                    range,
                    gameId 
                    );

                    games[gameId].ships[playerAddress] = ship;
                    games[gameId].players.push(playerAddress);

                    emit PlayerAdded(playerAddress, gameId, coord.q, coord.r, speed, range);
                }
    }

    function isCoordinateTaken(SharedStructs.Coordinate memory coord, uint8 gameId) internal view returns (bool) {
        for (uint i = 0; i < games[gameId].players.length; i++) {
            if (games[gameId].ships[games[gameId].players[i]].coordinate.q == coord.q && games[gameId].ships[games[gameId].players[i]].coordinate.r == coord.r) {
                return true;
            }
        }
        return false;
    }

    function sinkShip(address captain, uint8 gameId) internal {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        // find player index
        uint8 playerIndex = 0;
        for (uint8 p = 0; p < games[gameId].players.length; p++) {
            if (games[gameId].players[p] == captain) {
                playerIndex = p;
                break;
            }
        }
        sinkShip(captain, playerIndex, gameId);
    }

  function sinkShip(address captain, uint8 index, uint8 gameId) internal {
        require (index < games[gameId].players.length, 'Index value out of range');
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        emit PlayerDefeated(captain,gameId);
        delete (games[gameId].ships[captain]);
        games[gameId].players[index] = address(0);
    }

function isShipOutsideMap(SharedStructs.Coordinate memory shipCoord, uint8 gameId) internal view returns (bool) {
    SharedStructs.Cell memory cell = map.getCell(shipCoord, gameId);
    return !cell.exists;
}


function updateWorld(uint8 gameId) public onlyOwner {
    require(games[gameId].gameInProgress == true, 'Game has not started yet!');
    
    if(games[gameId].round % 3 == 0){
        map.deleteOutermostRing(gameId, games[gameId].shrinkNo);
        games[gameId].shrinkNo++;
        emit MapShrink(gameId);
        
        // Sink players outside the invalid map cells
        for (uint8 i = 0; i < games[gameId].players.length; i++) {
            SharedStructs.Coordinate memory shipCoord = games[gameId].ships[games[gameId].players[i]].coordinate;
            
            if (isShipOutsideMap(shipCoord, gameId)) {
                sinkShip(games[gameId].players[i], i, gameId);
                emit ShipSunkOutOfMap(games[gameId].players[i],gameId); // Emitting event when ship is sunk due to being outside the map
                
                // Adjust the players array
                games[gameId].players[i] = games[gameId].players[games[gameId].players.length - 1]; // Swap with the last player
                games[gameId].players.pop(); // Remove the last player
                if (i > 0) {
                    i--; // Adjust the loop counter to recheck the swapped player
                }
            }
        }
    }
    
    // shot destination positions
    SharedStructs.Coordinate[] memory shotDestinations = new SharedStructs.Coordinate[](games[gameId].players.length);    
    // Flag to check if ship is active
    bool[] memory isActive = new bool[](games[gameId].players.length);
    // Initialize all ships as active
    for (uint8 i = 0; i < games[gameId].players.length; i++) {
        isActive[i] = true;
    }

    // Moving ships and handling deaths due to invalid moves
    for (uint8 i = 0; i < games[gameId].players.length; i++) {
        // Skip the moves of removed players
        if (games[gameId].ships[games[gameId].players[i]].captain == address(0)) {
            continue;
        }

        if (games[gameId].ships[games[gameId].players[i]].publishedMove) {
            (bool dies, SharedStructs.Coordinate memory dest) = map.travel(
                games[gameId].ships[games[gameId].players[i]].coordinate,
                games[gameId].ships[games[gameId].players[i]].travelDirection,
                games[gameId].ships[games[gameId].players[i]].travelDistance,
                gameId
            );
            if (dies) {
                
                emit ShipCollidedWithIsland(games[gameId].players[i],gameId, dest.q, dest.r); // Emitting event when ship collides and dies
                sinkShip(games[gameId].players[i], i, gameId);
                isActive[i] = false;
                 games[gameId].ships[games[gameId].players[i]].coordinate = dest;
                continue;
            }
            emit ShipMoved(games[gameId].players[i],  games[gameId].ships[games[gameId].players[i]].coordinate.q,  games[gameId].ships[games[gameId].players[i]].coordinate.r, dest.q, dest.r,gameId); // Emitting event after ship moves
             games[gameId].ships[games[gameId].players[i]].coordinate = dest;
           
            emit ShipMovedInGame(games[gameId].players[i], gameId);  // Emitting event with game ID
        }
    }

    // Calculate Shot destination for active ships
    for (uint8 i = 0; i < games[gameId].players.length; i++) {
        if (isActive[i]) {
            SharedStructs.Coordinate memory shotDest = map.calculateShot(
                games[gameId].ships[games[gameId].players[i]].coordinate,
                games[gameId].ships[games[gameId].players[i]].shotDirection,
                games[gameId].ships[games[gameId].players[i]].shotDistance
            );
            shotDestinations[i] = shotDest;
            emit ShipShot(games[gameId].players[i], games[gameId].ships[games[gameId].players[i]].coordinate.q, games[gameId].ships[games[gameId].players[i]].coordinate.r, shotDest.q, shotDest.r,gameId); // Emitting event after ship shoots
        }
    }

    // Handle ship collisions and shots
    for (uint8 i = 0; i < games[gameId].players.length; i++) {
        for (uint8 j = 0; j < games[gameId].players.length; j++) {
            if (i != j) {
                // Check for collisions
                if (isActive[i] && isActive[j] && games[gameId].ships[games[gameId].players[j]].coordinate.q == games[gameId].ships[games[gameId].players[i]].coordinate.q && games[gameId].ships[games[gameId].players[j]].coordinate.r == games[gameId].ships[games[gameId].players[i]].coordinate.r) {
                    isActive[i] = false;
                    isActive[j] = false;
                    emit ShipSunk(games[gameId].players[i],gameId); // Emitting event when ship is sunk
                    emit ShipSunk(games[gameId].players[j],gameId); // Emitting event when ship is sunk
                    sinkShip(games[gameId].players[i], i, gameId);
                    sinkShip(games[gameId].players[j], j, gameId);
                }
                // Check for shots
                if (isActive[i] && shotDestinations[j].q == games[gameId].ships[games[gameId].players[i]].coordinate.q && shotDestinations[j].r == games[gameId].ships[games[gameId].players[i]].coordinate.r) {
                   
                    emit ShipHit(games[gameId].players[i], games[gameId].players[j],gameId); // Emitting event when ship is hit by another ship's shot
                    sinkShip(games[gameId].players[i], i, gameId);
                }
            }
        }
    }

    // Remove sunk players
    for (uint8 i = 0; i < games[gameId].players.length; i++) {
        if (games[gameId].players[i] == address(0)) {
            games[gameId].players[i] = games[gameId].players[games[gameId].players.length - 1];
            games[gameId].players.pop();
            if (i > 0) {
                i--;
            }
        }
    }

    // Check for winner, emit events accordingly
    if (games[gameId].players.length == 0) {
        emit GameWinner(address(0) ,gameId);
        games[gameId].stopAddingShips = true;           
    } else if (games[gameId].players.length == 1) {
        emit GameWinner(games[gameId].players[0], gameId);
        games[gameId].stopAddingShips = true;
    } else {
        emit GameUpdated(false, games[gameId].players[0],gameId);
        for (uint8 i = 0; i < games[gameId].players.length; i++) {
            games[gameId].ships[games[gameId].players[i]].travelDirection = SharedStructs.Directions.NO_MOVE;
            games[gameId].ships[games[gameId].players[i]].travelDistance = 0;
            games[gameId].ships[games[gameId].players[i]].shotDirection = SharedStructs.Directions.NO_MOVE;
            games[gameId].ships[games[gameId].players[i]].shotDistance = 0;
        }
        games[gameId].letSubmitMoves = false;
        addNewRound(gameId);
        allowSubmitMoves(gameId);
    }

    emit WorldUpdated(gameId);  // Emitting the WorldUpdated event
}

 function addNewRound(uint8 gameId) internal returns (uint256) {
        uint8 currentRadius = map.gameRadii(gameId);
        games[gameId].round++;
        emit NewRound(gameId, games[gameId].round, currentRadius);
        return games[gameId].round;
    }


 function toString(address account) internal pure returns(string memory) {
    return toString(abi.encodePacked(account));
}

function toString(bytes memory data) internal pure returns(string memory) {
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < data.length; i++) {
        str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
    }
    return string(str);
}

    function getShips(uint8 gameId) public view returns (Ship[] memory) {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        Ship[] memory returnShips = new Ship[](games[gameId].players.length);

        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            returnShips[i] = games[gameId].ships[games[gameId].players[i]];
        }
        return returnShips;
    }

    function getRadius(uint8 gameId) public view returns (uint8) {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        return map.gameRadii(gameId);
    }

    function getCell(
        SharedStructs.Coordinate memory _coord,
        uint8 gameId
    ) public view returns (SharedStructs.Cell memory) {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        return map.getCell(_coord, gameId);
    }

    function move(
        SharedStructs.Coordinate memory _start,
        SharedStructs.Directions _dir,
        uint8 _distance,
        uint8 gameId
    ) external view returns (SharedStructs.Coordinate memory) {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        return map.move(_start, _dir, _distance);
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance,
        uint8 gameId
    ) external {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        (bool dies, SharedStructs.Coordinate memory dest) = map.travel(_startCell, _direction, _distance, gameId);

        if (dies) {
            sinkShip(msg.sender, gameId);
        } else {
            games[gameId].ships[msg.sender].coordinate.q = dest.q;
            games[gameId].ships[msg.sender].coordinate.r = dest.r;
        }
    }

function getCells(uint8 gameId)
        public
        view
        returns (SharedStructs.Coordinate[] memory)
    {
         require(games[gameId].gameInProgress == true, 'Game has not started yet!');
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