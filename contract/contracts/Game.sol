// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Map.sol";
import "./SharedStructs.sol";
import "./Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface Yachts{
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

error ShipAlreadyAdded(address player, uint8 q, uint8 r);

contract Game is Ownable {
    event PlayerAdded(address indexed player);
    event PlayerDefeated(address indexed player);
    event GameUpdated(bool indexed gameStatus, address indexed winnerAddress);
    event GameWinner(string gameWinner);

    struct Ship {
        SharedStructs.Coordinate coordinate;
        SharedStructs.Directions travelDirection;
        uint8 travelDistance;
        SharedStructs.Directions shotDirection;
        uint8 shotDistance;
        bool publishedMove;
        address captain;
    }

    struct GameInstance {
    uint256 round;
    mapping(address => Ship) ships;
    address[] players;
    bool gameInProgress;
    bool stopAddingShips;
    bool letCommitMoves;
    bool letSubmitMoves;
    mapping(address => bytes32) moveHashes;
}


    mapping(uint256 => GameInstance) public games;
    Map immutable map;
    Yachts public yachts;

    constructor(address _mapAddress, address _yachtsAddress) {
        map = Map(_mapAddress);
        yachts = Yachts(_yachtsAddress);
    }

  function startNewGame(uint8 gameId) public onlyOwner () {
    require(gameId < 255, "Maximum number of games reached");
    require(!games[gameId].gameInProgress, "Game with this ID already in progress");
    games[gameId].gameInProgress = true; 
}

    function endGame(uint gameId) public onlyOwner() {
         GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        games[gameId].gameInProgress = false;        
    }
 


    function getMetadata(address ownerAddress) public view returns (string memory) {
        uint256 tokenId = yachts.tokenOfOwnerByIndex(ownerAddress, 1);
        return yachts.tokenURI(tokenId);
    }

    // function to let players commit moves
     function allowCommitMoves(uint8 gameId) public onlyOwner {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        game.letCommitMoves = true;
    }

    // function to let players submit moves
     function allowSubmitMoves(uint8 gameId) public onlyOwner {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        game.letCommitMoves = false;
        game.letSubmitMoves = true;
    }

    //commit moves
    function commitMove(bytes32 moveHash, uint8 gameId) public {
   
    GameInstance storage game = games[gameId];
     require(game.letCommitMoves == true, 'Commit moves has not started yet!');
     game.moveHashes[msg.sender] = moveHash;
}

    // submit moves
    function revealMove(
    SharedStructs.Directions _travelDirection, 
    uint8 _travelDistance, 
    SharedStructs.Directions _shotDirection, 
    uint8 _shotDistance,
    uint256 secret,
    uint8 gameId
) public {
    GameInstance storage game = games[gameId];
    require(game.letSubmitMoves == true, 'Submit moves has not started yet!');
    require(game.gameInProgress == true, 'Game has not started yet!');

    bytes32 moveHash = keccak256(abi.encodePacked(_travelDirection, _travelDistance, _shotDirection, _shotDistance, secret));

    if(game.moveHashes[msg.sender] == moveHash){
    Ship storage ship = game.ships[msg.sender];
    ship.travelDirection = _travelDirection;
    ship.travelDistance = _travelDistance;
    ship.shotDirection = _shotDirection;
    ship.shotDistance = _shotDistance;
    ship.publishedMove = true;
    }
}

    function initGame(uint8 _radius, uint8 gameId) public onlyOwner {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');

        // reset ships
        for (uint256 i = 0; i < game.players.length; i++) {
            delete game.ships[game.players[i]];
        }
        delete game.players;

        map.initMap(_radius, gameId);
        map.createIslands(gameId);
    }

    function addShip(uint8 gameId) public returns (Ship memory) {
        GameInstance storage game = games[gameId];
        require(game.stopAddingShips == false && game.gameInProgress == true, 'Game has not started yet!');
        if (
            game.ships[msg.sender].coordinate.q > 0 &&
            game.ships[msg.sender].coordinate.r > 0
        ) {
            revert ShipAlreadyAdded(
                msg.sender,
                game.ships[msg.sender].coordinate.q,
                game.ships[msg.sender].coordinate.r
            );
        }

        SharedStructs.Coordinate memory coord;
        bool alreadyTaken = false;
        do {
            coord = map.getRandomCoordinatePair(gameId);
            console.log("New rnd pair %s, %s", coord.q, coord.r);
            for (uint8 i = 0; i < game.players.length; i++) {
                console.log("in loop %s, address: %s", i, game.players[i]);
                if (
                    game.ships[game.players[i]].coordinate.q == coord.q &&
                    game.ships[game.players[i]].coordinate.r == coord.r
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
            msg.sender
        );
        game.ships[msg.sender] = ship;
        game.players.push(msg.sender);

        console.log("New ship at %s, %s", ship.coordinate.q, ship.coordinate.r);

        emit PlayerAdded(msg.sender);

        return ship;
    }


    function sinkShip(address captain, uint8 gameId) internal {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        // find player index
        uint8 playerIndex = 0;
        for (uint8 p = 0; p < game.players.length; p++) {
            if (game.players[p] == captain) {
                playerIndex = p;
                break;
            }
        }

        sinkShip(captain, playerIndex, gameId);
    }


  function sinkShip(address captain, uint8 index, uint8 gameId) internal {
        GameInstance storage game = games[gameId];
        require (index < game.players.length, 'Index value out of range');
        require(game.gameInProgress == true, 'Game has not started yet!');

        emit PlayerDefeated(captain);
        delete (game.ships[captain]);

        game.players[index] = address(0);
    }

function updateWorld(uint8 gameId) public onlyOwner {
    GameInstance storage game = games[gameId];
    require(game.gameInProgress == true, 'Game has not started yet!');

    // shot destination positions
    SharedStructs.Coordinate[] memory shotDestinations = new SharedStructs.Coordinate[](game.players.length);
    
    // Flag to check if ship is active
    bool[] memory isActive = new bool[](game.players.length);   

    // Initialize all ships as active
    for (uint8 i = 0; i < game.players.length; i++) {
        isActive[i] = true;
    }    

    // Moving ships and handling deaths due to invalid moves
    for (uint8 i = 0; i < game.players.length; i++) {
        if (game.ships[game.players[i]].publishedMove) {
            (bool dies, SharedStructs.Coordinate memory dest) = map.travel(
                game.ships[game.players[i]].coordinate,
                game.ships[game.players[i]].travelDirection,
                game.ships[game.players[i]].travelDistance,
                gameId
            );
            if (dies) {
                sinkShip(game.players[i], i, gameId);
                isActive[i] = false;
                continue;
            }
            game.ships[game.players[i]].coordinate = dest;
        }
    }

     // Calculate Shot destination for active ships
    for (uint8 i = 0; i < game.players.length; i++) {
        if (isActive[i]) {
            SharedStructs.Coordinate memory shotDest = map.calculateShot(
                game.ships[game.players[i]].coordinate,
                game.ships[game.players[i]].shotDirection,
                game.ships[game.players[i]].shotDistance
            );
            shotDestinations[i] = shotDest;
        }
    }  

  // Handle ship collisions and shots
    for (uint8 i = 0; i < game.players.length; i++) {
        for (uint8 j = 0; j < game.players.length; j++) {
            if (i != j) {
                // Check for collisions
                if (isActive[i] && isActive[j] && game.ships[game.players[j]].coordinate.q == game.ships[game.players[i]].coordinate.q && game.ships[game.players[j]].coordinate.r == game.ships[game.players[i]].coordinate.r) {
                    isActive[i] = false;
                    isActive[j] = false;
                    sinkShip(game.players[i], i, gameId);
                    sinkShip(game.players[j], j, gameId);
                }
                // Check for shots
                if (isActive[i] && shotDestinations[j].q == game.ships[game.players[i]].coordinate.q && shotDestinations[j].r == game.ships[game.players[i]].coordinate.r) {
                    sinkShip(game.players[i], i, gameId);
                }
            }
        }
    }

    // Remove sunk players
    for (uint8 i = 0; i < game.players.length; i++) {
        if (game.players[i] == address(0)) {
            game.players[i] = game.players[game.players.length - 1];
            game.players.pop();
            if (i > 0) {
                i--;
            }
        }
    }

    // Check for winner, emit events accordingly
    if (game.players.length == 0) {
        emit GameWinner("No winner");
        game.stopAddingShips = true;           
    } else if (game.players.length == 1) {
        emit GameWinner(string(abi.encodePacked("The Game winner is: ", toString(game.players[0]))));
        game.stopAddingShips = true;
    } else {
        emit GameUpdated(false, game.players[0]);
        for (uint8 i = 0; i < game.players.length; i++) {
            game.ships[game.players[i]].travelDirection = SharedStructs.Directions.NO_MOVE;
            game.ships[game.players[i]].travelDistance = 0;
            game.ships[game.players[i]].shotDirection = SharedStructs.Directions.NO_MOVE;
            game.ships[game.players[i]].shotDistance = 0;
        }
        game.letCommitMoves = false;
        game.letSubmitMoves = false;
    }
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
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        Ship[] memory returnShips = new Ship[](game.players.length);
        console.log("Retrieving ships");

        for (uint256 i = 0; i < game.players.length; i++) {
            returnShips[i] = game.ships[game.players[i]];
        }

        return returnShips;
    }

    function getRadius(uint8 gameId) public view returns (uint8) {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        return map.gameRadii(gameId);
    }

    function getCell(
        SharedStructs.Coordinate memory _coord,
        uint8 gameId
    ) public view returns (SharedStructs.Cell memory) {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        return map.getCell(_coord, gameId);
    }

    function move(
        SharedStructs.Coordinate memory _start,
        SharedStructs.Directions _dir,
        uint8 _distance,
        uint8 gameId
    ) external view returns (SharedStructs.Coordinate memory) {
       GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        return map.move(_start, _dir, _distance);
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance,
        uint8 gameId
    ) external {
        GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
        (bool dies, SharedStructs.Coordinate memory dest) = map.travel(_startCell, _direction, _distance, gameId);

        if (dies) {
            sinkShip(msg.sender, gameId);
        } else {
            game.ships[msg.sender].coordinate.q = dest.q;
            game.ships[msg.sender].coordinate.r = dest.r;
        }
    }

    function getCells(uint8 gameId)
        public
        view
        returns (SharedStructs.Coordinate[] memory)
    {
         GameInstance storage game = games[gameId];
        require(game.gameInProgress == true, 'Game has not started yet!');
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


 