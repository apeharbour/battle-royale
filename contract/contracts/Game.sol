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
        uint8 travelDistane;
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

    constructor(address _mapAddress) {
        map = Map(_mapAddress);
    }

    function initGame(uint8 _radius) public {
        map.initMap(_radius);
        map.createIslands();
        gameInProgress = true;
    }

    function addShip() public returns (Ship memory) {
        if (ships[msg.sender].coordinate.q >0 && ships[msg.sender].coordinate.r >0) {
            revert ShipAlreadyAdded(msg.sender, ships[msg.sender].coordinate.q, ships[msg.sender].coordinate.r);
        }

        SharedStructs.Coordinate memory coord;
        bool alreadyTaken = false;
        do {
            coord = map.getRandomCoordinatePair();
            for (uint8 i=0; i<players.length; i++) {
              if (ships[players[i]].coordinate.q == coord.q && ships[players[i]].coordinate.r == coord.r) {
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
        ships[msg.sender].travelDistane = travelDist;
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
        emit PlayerDefeated(captain);
        delete (ships[captain]);
        delete (players[index]);
    }

    function updateWorld() public {
        // move all ships
        SharedStructs.Coordinate[] memory newPositions = new SharedStructs.Coordinate[](players.length);

        for (uint8 i = 0; i < players.length; i++) {
            if (ships[players[i]].publishedMove) {
                (bool dies, SharedStructs.Coordinate memory dest) = map.travel(
                    ships[players[i]].coordinate,
                    ships[players[i]].travelDirection,
                    ships[players[i]].travelDistane
                );
                if (dies) {
                    sinkShip(players[i], i);
                    continue;
                }

                // check if ship collides with another
                for (uint8 j=0; j<i; i++)
                if (newPositions[j].q != dest.q && newPositions[j].r != dest.r) {
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

        for (uint256 i = 0; i < players.length; i++) {
            returnShips[i] = ships[players[i]];
        }

        return returnShips;
    }

    function getRadius() public view returns (uint8) {
        return map.radius();
    }

    function getCell(SharedStructs.Coordinate memory _coord) public view returns (SharedStructs.Cell memory) {
        return map.getCell(_coord);
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
