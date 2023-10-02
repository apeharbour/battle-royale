// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./MapWOT.sol";
import "./SharedStructs.sol";
import "./Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error ShipAlreadyAdded(address player, uint8 q, uint8 r);

contract GameWOT is  Ownable {

    //Events
    event PlayerAdded(address indexed player, uint8 gameId);
    event PlayerDefeated(address indexed player);
    event GameUpdated(bool indexed gameStatus, address indexed winnerAddress);
    event GameWinner(string gameWinner);
    event GameStarted(uint8 gameId);
    event GameEnded(uint8 gameId);
    event CommitPhaseStarted(uint8 gameId);
    event SubmitPhaseStarted(uint8 gameId);
    event MoveCommitted(address indexed player);
    event MoveSubmitted(address indexed player);
    event MapInitialized(uint8 radius, uint8 gameId);
    event ShipMoved(address indexed captain, uint8 q, uint8 r);
    event ShipShot(address indexed captain, uint8 shotQ, uint8 shotR);
    event ShipHit(address indexed victim, address indexed attacker);
    event ShipCollidedWithIsland(address indexed captain);
    event ShipSunk(address indexed captain);
    event WorldUpdated(uint256 gameId);
    event ShipMovedInGame(address indexed captain, uint256 gameId);



    struct Ship {
        SharedStructs.Coordinate coordinate;
        SharedStructs.Directions travelDirection;
        uint8 travelDistance;
        SharedStructs.Directions shotDirection;
        uint8 shotDistance;
        bool publishedMove;
        address captain;
        uint yachtSpeed;
        uint yachtRange;
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
    MapWOT immutable map;

    constructor(address _mapAddress) {
        map = MapWOT(_mapAddress);
    }

  function startNewGame(uint8 gameId) public onlyOwner () {
    require(gameId < 255, "Maximum number of games reached");
    require(!games[gameId].gameInProgress, "Game with this ID already in progress");
    games[gameId].gameInProgress = true; 
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
        emit SubmitPhaseStarted(gameId);
        games[gameId].round++; 
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
        ship.travelDistance = _travelDistance;
        ship.shotDirection = _shotDirection;
        ship.shotDistance = _shotDistance;
        ship.publishedMove = true;
   // }
    emit MoveSubmitted(msg.sender);
}

    function initGame(uint8 _radius, uint8 gameId) public onlyOwner {
        require(games[gameId].gameInProgress == true, 'Game has not started yet!');
        // reset ships
        for (uint256 i = 0; i < games[gameId].players.length; i++) {
            delete games[gameId].ships[games[gameId].players[i]];
        }
        delete games[gameId].players;
        map.initMap(_radius, gameId);
        map.createIslands(gameId);
        emit MapInitialized(_radius,gameId);
    }

    function addShip(uint8 gameId, uint _speed, uint _range) public returns (Ship memory) {
                require(games[gameId].stopAddingShips == false && games[gameId].gameInProgress == true, 'Game has not started yet!');
        if (
            games[gameId].ships[msg.sender].coordinate.q > 0 &&
            games[gameId].ships[msg.sender].coordinate.r > 0
        ) {
            revert ShipAlreadyAdded(
                msg.sender,
                games[gameId].ships[msg.sender].coordinate.q,
                games[gameId].ships[msg.sender].coordinate.r
            );
        }
        SharedStructs.Coordinate memory coord;
        bool alreadyTaken = false;
        do {
            coord = map.getRandomCoordinatePair(gameId);
            console.log("New rnd pair %s, %s", coord.q, coord.r);
            for (uint8 i = 0; i < games[gameId].players.length; i++) {
                console.log("in loop %s, address: %s", i, games[gameId].players[i]);
                if (
                    games[gameId].ships[games[gameId].players[i]].coordinate.q == coord.q &&
                    games[gameId].ships[games[gameId].players[i]].coordinate.r == coord.r
                ) {
                    alreadyTaken = true;
                    break;
                }
            }
        } while (alreadyTaken);
        Ship memory ship = Ship(
            coord,
            SharedStructs.Directions.E,
            0,
            SharedStructs.Directions.E,
            0,
            false,
            msg.sender,
            _speed,
            _range
        );
        games[gameId].ships[msg.sender] = ship;
        games[gameId].players.push(msg.sender);
        emit PlayerAdded(msg.sender, gameId);
        return ship;
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
        emit PlayerDefeated(captain);
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
        
        // Sink players outside the valid map cells
        for (uint8 i = 0; i < games[gameId].players.length; i++) {
            SharedStructs.Coordinate memory shipCoord = games[gameId].ships[games[gameId].players[i]].coordinate;
            
            if (isShipOutsideMap(shipCoord, gameId)) {
                sinkShip(games[gameId].players[i], i, gameId);
                emit ShipSunk(games[gameId].players[i]); // Emitting event when ship is sunk due to being outside the map
                
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
                sinkShip(games[gameId].players[i], i, gameId);
                isActive[i] = false;
                emit ShipCollidedWithIsland(games[gameId].players[i]); // Emitting event when ship collides and dies
                continue;
            }
            games[gameId].ships[games[gameId].players[i]].coordinate = dest;
            emit ShipMoved(games[gameId].players[i], dest.q, dest.r); // Emitting event after ship moves
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
            emit ShipShot(games[gameId].players[i], shotDest.q, shotDest.r); // Emitting event after ship shoots
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
                    sinkShip(games[gameId].players[i], i, gameId);
                    sinkShip(games[gameId].players[j], j, gameId);
                    emit ShipSunk(games[gameId].players[i]); // Emitting event when ship is sunk
                    emit ShipSunk(games[gameId].players[j]); // Emitting event when ship is sunk
                }
                // Check for shots
                if (isActive[i] && shotDestinations[j].q == games[gameId].ships[games[gameId].players[i]].coordinate.q && shotDestinations[j].r == games[gameId].ships[games[gameId].players[i]].coordinate.r) {
                    sinkShip(games[gameId].players[i], i, gameId);
                    emit ShipHit(games[gameId].players[i], games[gameId].players[j]); // Emitting event when ship is hit by another ship's shot
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
        emit GameWinner("No winner");
        games[gameId].stopAddingShips = true;           
    } else if (games[gameId].players.length == 1) {
        emit GameWinner(string(abi.encodePacked("The Game winner is: ", toString(games[gameId].players[0]))));
        games[gameId].stopAddingShips = true;
    } else {
        emit GameUpdated(false, games[gameId].players[0]);
        for (uint8 i = 0; i < games[gameId].players.length; i++) {
            games[gameId].ships[games[gameId].players[i]].travelDirection = SharedStructs.Directions.NO_MOVE;
            games[gameId].ships[games[gameId].players[i]].travelDistance = 0;
            games[gameId].ships[games[gameId].players[i]].shotDirection = SharedStructs.Directions.NO_MOVE;
            games[gameId].ships[games[gameId].players[i]].shotDistance = 0;
        }
        games[gameId].letSubmitMoves = false;
    }

    emit WorldUpdated(gameId);  // Emitting the WorldUpdated event
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
        console.log("Retrieving ships");

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