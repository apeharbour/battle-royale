// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Map.sol";
import "./SharedStructs.sol";
import "./Random.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    Map immutable map;
    uint256 public round;

    mapping(address => Ship) public ships;
    address[] public players;
    bool public gameInProgress;
    bool public stopAddingShips;
    bool public letCommitMoves;
    bool public letSubmitMoves;
    mapping(address => bytes32) public moveHashes;

    constructor(address _mapAddress) {
        map = Map(_mapAddress);
    }

    // function to let players commit moves
     function allowCommitMoves() public onlyOwner {
        letCommitMoves = true;
    }

    // function to let players submit moves
     function allowSubmitMoves() public onlyOwner {
        letCommitMoves = false;
        letSubmitMoves = true;
    }

    //commit moves
    function commitMove(bytes32 moveHash) public {
    require(letCommitMoves == true, 'Commit moves has not started yet!');    
    moveHashes[msg.sender] = moveHash;
}

    // submit moves
    function revealMove(
    SharedStructs.Directions _travelDirection, 
    uint8 _travelDistance, 
    SharedStructs.Directions _shotDirection, 
    uint8 _shotDistance,
    uint256 nonce
) public {
    require(letSubmitMoves == true, 'Submit moves has not started yet!');

    bytes32 moveHash = keccak256(abi.encodePacked(_travelDirection, _travelDistance, _shotDirection, _shotDistance, nonce));

    if(moveHashes[msg.sender] == moveHash){
    Ship storage ship = ships[msg.sender];
    ship.travelDirection = _travelDirection;
    ship.travelDistance = _travelDistance;
    ship.shotDirection = _shotDirection;
    ship.shotDistance = _shotDistance;
    ship.publishedMove = true;
    }
}

    function initGame(uint8 _radius) public onlyOwner {
        // reset ships
        for (uint256 i = 0; i < players.length; i++) {
            delete ships[players[i]];
        }
        delete players;

        map.initMap(_radius);
        map.createIslands();
        gameInProgress = true;
    }

    function addShip() public returns (Ship memory) {
        require(stopAddingShips == false && gameInProgress == true, 'Game has not started yet!');
        if (
            ships[msg.sender].coordinate.q > 0 &&
            ships[msg.sender].coordinate.r > 0
        ) {
            revert ShipAlreadyAdded(
                msg.sender,
                ships[msg.sender].coordinate.q,
                ships[msg.sender].coordinate.r
            );
        }

        SharedStructs.Coordinate memory coord;
        bool alreadyTaken = false;
        do {
            coord = map.getRandomCoordinatePair();
            console.log("New rnd pair %s, %s", coord.q, coord.r);
            for (uint8 i = 0; i < players.length; i++) {
                console.log("in loop %s, address: %s", i, players[i]);
                if (
                    ships[players[i]].coordinate.q == coord.q &&
                    ships[players[i]].coordinate.r == coord.r
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
        ships[msg.sender] = ship;
        players.push(msg.sender);

        console.log("New ship at %s, %s", ship.coordinate.q, ship.coordinate.r);

        emit PlayerAdded(msg.sender);

        return ship;
    }


    function sinkShip(address captain) internal {
        // find player index
        uint8 playerIndex = 0;
        for (uint8 p = 0; p < players.length; p++) {
            if (players[p] == captain) {
                playerIndex = p;
                break;
            }
        }

        sinkShip(captain, playerIndex);
    }


  function sinkShip(address captain, uint8 index) internal {
        require (index < players.length, 'Index value out of range');

        emit PlayerDefeated(captain);
        delete (ships[captain]);

        players[index] = address(0);
    }

    function updateWorld() public onlyOwner {
        
        // shot destination positions
        SharedStructs.Coordinate[]
            memory shotDestinations = new SharedStructs.Coordinate[](
                players.length
            );    

        // moving ships
        for (uint8 i = 0; i < players.length; i++) {
            if (ships[players[i]].publishedMove) {
                (bool dies, SharedStructs.Coordinate memory dest) = map.travel(
                    ships[players[i]].coordinate,
                    ships[players[i]].travelDirection,
                    ships[players[i]].travelDistance
                );
                if (dies) {
                    sinkShip(players[i], i);
                    continue;
                }

                //Calculate Shot destination
                 SharedStructs.Coordinate memory shotDest = map.calculateShot(
                    ships[players[i]].coordinate,
                    ships[players[i]].shotDirection,
                    ships[players[i]].shotDistance
                    );

                 shotDestinations[i] = shotDest;
                 ships[players[i]].coordinate = dest;
            }         
            
        }

            // check if ship collides with another
           if(players.length > 0) { 
            bool[] memory collisions = new bool[](players.length); 
             for (uint8 i = 0; i < players.length; i++){
                 for (uint8 j = i + 1; j < players.length; j++){
                    if (i != j && 
                        ships[players[j]].coordinate.q == ships[players[i]].coordinate.q &&
                        ships[players[j]].coordinate.r == ships[players[i]].coordinate.r) {
                        collisions[i] = true;
                        collisions[j] = true;
                }
            }
        }
        for (uint8 i = 0; i < players.length; i++) {
            if(collisions[i]){
                sinkShip(players[i], i);
            }
        }
    }   

            // Check if ship has been shot
          if(players.length > 0) {
            bool[] memory hits = new bool[](players.length);
            for (uint8 i = 0; i < players.length; i++){
                for (uint8 j = 0; j < players.length; j++){
                    if (i != j && 
                        shotDestinations[j].q == ships[players[i]].coordinate.q &&
                        shotDestinations[j].r == ships[players[i]].coordinate.r) {
                        hits[i] = true;
                        break;
                }
            }
         }
          for (uint8 i = 0; i < players.length; i++) {
            if(hits[i]){
                sinkShip(players[i], i);
            }
        }
    }  

            // Remove sunk players
        for (uint8 i = 0; i < players.length; i++) {
            if (players[i] == address(0)) {
                players[i] = players[players.length - 1];
                players.pop();
                 if (i > 0) {
                      i--;
                 }
            }
        }
        // Check for winner, emit events accordingly
        // unset publishedMove
         if (players.length == 0){
            emit GameWinner("No winner"); 
            gameInProgress = false;
            stopAddingShips = true;           
        } else if(players.length == 1) {
            emit GameWinner(string(abi.encodePacked("The Game winner is: ", toString(players[0]))));
            gameInProgress = false;
            stopAddingShips = true;
        } else{
            emit GameUpdated(false, players[0]);
            for (uint8 i = 0; i < players.length; i++) {
            ships[players[i]].travelDirection = SharedStructs.Directions.NO_MOVE;
            ships[players[i]].travelDistance = 0;
            ships[players[i]].shotDirection = SharedStructs.Directions.NO_MOVE;
            ships[players[i]].shotDistance = 0;
        }
        letCommitMoves = false;
        letSubmitMoves = false;
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
 

    function getShips() public view returns (Ship[] memory) {
        Ship[] memory returnShips = new Ship[](players.length);
        console.log("Retrieving ships");

        for (uint256 i = 0; i < players.length; i++) {
            returnShips[i] = ships[players[i]];
        }

        return returnShips;
    }

    function getRadius() public view returns (uint8) {
        return map.radius();
    }

    function getCell(
        SharedStructs.Coordinate memory _coord
    ) public view returns (SharedStructs.Cell memory) {
        return map.getCell(_coord);
    }

    function move(
        SharedStructs.Coordinate memory _start,
        SharedStructs.Directions _dir,
        uint8 _distance
    ) external view returns (SharedStructs.Coordinate memory) {
        return map.move(_start, _dir, _distance);
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance
    ) external {
        (bool dies, SharedStructs.Coordinate memory dest) = map.travel(_startCell, _direction, _distance);

        if (dies) {
            sinkShip(msg.sender);
        } else {
            ships[msg.sender].coordinate.q = dest.q;
            ships[msg.sender].coordinate.r = dest.r;
        }
    }

    function getCells()
        public
        view
        returns (SharedStructs.Coordinate[] memory)
    {
        uint8 radius = map.radius();
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


 