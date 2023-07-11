// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Map.sol";
import "./SharedStructs.sol";
import "./Random.sol";

error ShipAlreadyAdded(address player, uint8 q, uint8 r);

contract Game {
    event PlayerAdded(address indexed player);
    event PlayerDefeated(address indexed player);

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

    // //To store clear text version of the move submitted by the players
    // struct PlayerMoves {
    //     string moveDirection;
    //     uint8 moveDistance;
    //     string shotDirection;
    //     uint8 shotDistance;
    // }

    // // Mapping of each move submitted w.r.t its players address
    //  mapping(address => PlayerMoves) public playersmoves;

    constructor(address _mapAddress) {
        map = Map(_mapAddress);
    }

    // Function to set player action
    function submitMove( 
        SharedStructs.Directions _travelDirection, 
        uint8 _travelDistance, 
        SharedStructs.Directions _shotDirection, 
        uint8 _shotDistance
    ) 
    public {
         Ship storage ship = ships[msg.sender];

         ship.travelDirection = _travelDirection;
         ship.travelDistance = _travelDistance;
         ship.shotDirection = _shotDirection;
         ship.shotDistance = _shotDistance;
    }

    // Function to get player action
    function getPlayerMove(address _player) public view returns (SharedStructs.Directions, uint8, SharedStructs.Directions, uint8) {
        Ship memory ship = ships[_player];

        return (
            ship.travelDirection, 
            ship.travelDistance, 
            ship.shotDirection, 
            ship.shotDistance
        );
    }

    function initGame(uint8 _radius) public {
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

    function revealMove(
        SharedStructs.Directions travelDir,
        uint8 travelDist,
        SharedStructs.Directions shotDir,
        uint8 shotDist
    ) public {
        ships[msg.sender].travelDirection = travelDir;
        ships[msg.sender].travelDistance = travelDist;
        ships[msg.sender].shotDirection = shotDir;
        ships[msg.sender].shotDistance = shotDist;
        ships[msg.sender].publishedMove = true;
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

        players[index] = players[players.length - 1];
        players.pop();
    }

    function updateWorld() public {
        // move all ships
        SharedStructs.Coordinate[]
            memory newPositions = new SharedStructs.Coordinate[](
                players.length
            );

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

                // check if ship collides with another
                for (uint8 j = 0; j < i; i++)
                    if (
                        newPositions[j].q != dest.q &&
                        newPositions[j].r != dest.r
                    ) {
                        // existing move
                        sinkShip(players[j], j);
                        sinkShip(players[i], i);
                        break;
                    }

                newPositions[i] = dest;
            }

            // TODO fire shot
            // TODO check if ship has been hit
            // TODO check for winner
            // TODO unset publishedMove
        }
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
