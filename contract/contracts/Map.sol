// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Random.sol";
import "./SharedStructs.sol";

error MapSizeMustBeInRange(uint suppliedSize, uint maxSize);

contract Map {
    uint8 constant MAX_RADIUS = 127;

    mapping(SharedStructs.Directions => SharedStructs.Direction)
        private directionVectors;

    // struct Cell {
    //     uint8 q;
    //     uint8 r;
    //     bool island;
    //     bool exists;
    // }

    // struct Direction {
    //     int8 q;
    //     int8 r;
    // }

    // struct Coordinate {
    //     uint8 q;
    //     uint8 r;
    // }

    // enum Directions {
    //     E,
    //     NE,
    //     NW,
    //     W,
    //     SW,
    //     SE
    // }

    // hexCells is the mapping holding all cells. It can be addressed with hexCells[r][q].
    // Note the rows first adressing
    mapping(uint8 => mapping(uint8 => SharedStructs.Cell)) public hexCells;

    uint8 public radius;
    Random.RandomGeneration private rnd;

    constructor(uint256 _seed) {
        rnd = Random.init(_seed);

        directionVectors[SharedStructs.Directions.E] = SharedStructs.Direction(
            1,
            0
        );
        directionVectors[SharedStructs.Directions.NE] = SharedStructs.Direction(
            1,
            -1
        );
        directionVectors[SharedStructs.Directions.NW] = SharedStructs.Direction(
            0,
            -1
        );
        directionVectors[SharedStructs.Directions.W] = SharedStructs.Direction(
            -1,
            0
        );
        directionVectors[SharedStructs.Directions.SW] = SharedStructs.Direction(
            -1,
            1
        );
        directionVectors[SharedStructs.Directions.SE] = SharedStructs.Direction(
            0,
            1
        );
    }

    function move(
        SharedStructs.Coordinate memory _start,
        SharedStructs.Directions _dir,
        uint8 _distance
    ) public view returns (SharedStructs.Coordinate memory) {
        uint8 q = uint8(
            int8(_start.q) + directionVectors[_dir].q * int8(_distance)
        );
        uint8 r = uint8(
            int8(_start.r) + directionVectors[_dir].r * int8(_distance)
        );
        return SharedStructs.Coordinate(q, r);
    }

    function abs(int8 _x) internal pure returns (int8) {
        return _x < 0 ? -_x : _x;
    }

    function distance(
        SharedStructs.Coordinate memory _a,
        SharedStructs.Coordinate memory _b
    ) public pure returns (uint8) {
        return
            uint8(
                (abs(int8(_a.q) - int8(_b.q)) +
                    abs(int8(_a.q) + int8(_a.r) - int8(_b.q) - int8(_b.r)) +
                    abs(int8(_a.r) - int8(_b.r))) / 2
            );
    }

    function neighbor(
        SharedStructs.Coordinate memory _current,
        SharedStructs.Directions _dir
    ) private view returns (SharedStructs.Coordinate memory) {
        return move(_current, _dir, 1);
    }

    function ring(
        SharedStructs.Coordinate memory _center,
        uint8 _radius
    ) public view returns (SharedStructs.Coordinate[] memory) {
        SharedStructs.Coordinate[]
            memory cells = new SharedStructs.Coordinate[](_radius * 6);

        SharedStructs.Coordinate memory coordinate = move(
            _center,
            SharedStructs.Directions.SW,
            _radius
        );

        // loop through the ring. The outer loop (i) loops through the directions, inner loop (j) through cells per side.
        for (
            uint8 i = uint8(SharedStructs.Directions.E);
            i <= uint(SharedStructs.Directions.SE);
            i++
        ) {
            for (uint8 j = 0; j < _radius; j++) {
                cells[i * _radius + j] = coordinate;
                coordinate = neighbor(coordinate, SharedStructs.Directions(i));
            }
        }
        return cells;
    }

    function initCell(SharedStructs.Coordinate memory _coordinate) private {
        SharedStructs.Cell storage cell = hexCells[_coordinate.r][
            _coordinate.q
        ];
        cell.q = _coordinate.q;
        cell.r = _coordinate.r;
        cell.island = false;
        cell.exists = true;
    }

    function initMap(uint8 _radius) public {
        if (_radius > MAX_RADIUS) {
            revert MapSizeMustBeInRange(_radius, MAX_RADIUS);
        }
        radius = _radius;

        // set center cell
        hexCells[radius][radius] = SharedStructs.Cell({
            q: radius,
            r: radius,
            island: false,
            exists: true
        });

        for (uint8 i = 1; i <= radius; i++) {
            // create ring of radius i

            SharedStructs.Coordinate memory center = SharedStructs.Coordinate(
                radius,
                radius
            );
            SharedStructs.Coordinate[] memory coordinates = ring(center, i);

            for (uint8 c = 0; c < coordinates.length; c++) {
                initCell(coordinates[c]);
            }
        }
    }

    function createIslands() public {
        uint256 gridSize = uint256(
            1 + 3 * uint256(radius) * (uint256(radius) + 1)
        );
        uint256 islandNo = (gridSize * 16) / 100;
        for (uint256 i = 0; i < islandNo; i++) {
            SharedStructs.Coordinate memory coord = getRandomCoordinatePair();
            hexCells[coord.r][coord.q].island = true;
        }
    }

    function getRandomCoordinatePair()
        public
        returns (SharedStructs.Coordinate memory)
    {
        SharedStructs.Coordinate memory coord = SharedStructs.Coordinate(
            Random.getRandomValue(rnd, 2 * radius),
            Random.getRandomValue(rnd, 2 * radius)
        );
        SharedStructs.Cell memory cell = hexCells[coord.r][coord.q];

        while (!cell.exists || cell.island) {
            coord = SharedStructs.Coordinate(
                Random.getRandomValue(rnd, 2 * radius),
                Random.getRandomValue(rnd, 2 * radius)
            );
            cell = hexCells[coord.r][coord.q];
        }

        return coord;
    }

    function getCell(
        SharedStructs.Coordinate memory _coord
    ) public view returns (SharedStructs.Cell memory) {
        return hexCells[_coord.r][_coord.q];
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance
    ) external view returns (bool, SharedStructs.Coordinate memory) {
        console.log("Called travel");

        for (uint8 i = 0; i < _distance; i++) {
            _startCell = neighbor(_startCell, _direction);
            SharedStructs.Cell memory cell = getCell(_startCell);

            if (cell.island || !cell.exists) {
                return (true, _startCell);
            }
        }

        return (false, _startCell);
    }

    function deleteCell(SharedStructs.Coordinate calldata _coord) external {
        console.log("Called deleteCell");
        hexCells[_coord.r][_coord.q].exists = false;
    }

    function isIsland(
        SharedStructs.Coordinate memory _coord
    ) public view returns (bool) {
        console.log("Called isIsland");
        SharedStructs.Cell memory c = getCell(_coord);

        return c.island;
    }
}