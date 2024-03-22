// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./Random.sol";
import "./SharedStructs.sol";

error MapSizeMustBeInRange(uint suppliedSize, uint maxSize);

contract MapPunk {
    uint8 constant MAX_RADIUS = 127;

    mapping(SharedStructs.Directions => SharedStructs.Direction)
        private directionVectors;
    // hexCells is the mapping holding all cells. It can be addressed with hexCells[r][q].
    // Note the rows first adressing
    mapping(uint256 => mapping(uint8 => mapping(uint8 => SharedStructs.Cell)))
        public gameHexCells;
    mapping(uint256 => uint8) public gameRadii;

    // uint8 public radius;
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

    function initCell(
        SharedStructs.Coordinate memory _coordinate,
        uint256 gameId, bool _island
    ) private {
        SharedStructs.Cell storage cell = gameHexCells[gameId][_coordinate.r][
            _coordinate.q
        ];
        cell.q = _coordinate.q;
        cell.r = _coordinate.r;
        cell.island = _island;
        cell.exists = true;
    }

    function initMap(
        uint8 _radius,
        uint256 gameId
    ) public returns (SharedStructs.Cell[] memory) {
        if (_radius > MAX_RADIUS) {
            revert MapSizeMustBeInRange(_radius, MAX_RADIUS);
        }
        gameRadii[gameId] = _radius;

        uint256 numberOfCells = 1 + 3 * _radius * (_radius + 1);
        SharedStructs.Cell[] memory cells = new SharedStructs.Cell[](
            numberOfCells
        );

        // FIXME: Here we are doing some weird double accounting for the cells: In the gameHexCells mapping and in the cells array.
        // it should only go to the gameHexCells mapping!

        // set center cell
        initCell(SharedStructs.Coordinate(_radius, _radius), gameId, false);
        cells[0] = gameHexCells[gameId][_radius][_radius];

        for (uint8 i = 1; i <= _radius; i++) {
            // loop through all all the rings
            uint256 start = 1 + 3 * (i - 1) * i; // #of cells at radius -1
            SharedStructs.Coordinate[] memory currentRing = ring(
                SharedStructs.Coordinate(_radius, _radius),
                i
            );
            for (uint8 c = 0; c < currentRing.length; c++) {
                bool island = Random.getRandomValue(rnd, 100) < 16;
                initCell(currentRing[c], gameId, island);
                cells[start + c] = gameHexCells[gameId][currentRing[c].r][
                    currentRing[c].q
                ];
            }
        }
        return cells;
    }

    function deleteOutermostRing(uint256 gameId, uint8 shrinkNo) public {
        uint8 gameRadius = gameRadii[gameId];
        uint8 actualRadius = gameRadius - shrinkNo;
        SharedStructs.Coordinate[] memory outerRing = ring(
            SharedStructs.Coordinate(gameRadius, gameRadius),
            actualRadius
        );

        for (uint8 i = 0; i < outerRing.length; i++) {
            gameHexCells[gameId][outerRing[i].r][outerRing[i].q].exists = false;
        }
    }

    function getRandomCoordinatePair(
        uint256 gameId
    ) public returns (SharedStructs.Coordinate memory) {
        uint8 gameRadius = gameRadii[gameId];
        SharedStructs.Coordinate memory coord;
        SharedStructs.Cell memory cell;

        do {
            coord = SharedStructs.Coordinate(
                Random.getRandomValue(rnd, 2 * gameRadius),
                Random.getRandomValue(rnd, 2 * gameRadius)
            );
            cell = gameHexCells[gameId][coord.r][coord.q];
        } while (cell.island || !cell.exists);

        return coord;
    }

    function getCell(
        SharedStructs.Coordinate memory _coord,
        uint256 gameId
    ) public view returns (SharedStructs.Cell memory) {
        return gameHexCells[gameId][_coord.r][_coord.q];
    }

    function travel(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _direction,
        uint8 _distance,
        uint256 gameId
    ) external view returns (bool, SharedStructs.Coordinate memory) {
        console.log("Traveling from (%d, %d)", _startCell.q, _startCell.r);
        for (uint8 i = 0; i < _distance; i++) {
            _startCell = neighbor(_startCell, _direction);
            SharedStructs.Cell memory cell = getCell(_startCell, gameId);

            console.log("Traveling to (%d, %d, %s)", _startCell.q, _startCell.r, cell.island ? "island" : "water");
            console.log("   computed isIsland: %s", isIsland(_startCell, gameId) ? "island" : "water");

            if (cell.island || !cell.exists) {
                return (true, _startCell);
            }
        }

        return (false, _startCell);
    }

    function calculateShot(
        SharedStructs.Coordinate memory _startCell,
        SharedStructs.Directions _directions,
        uint8 _distance
    ) external view returns (SharedStructs.Coordinate memory) {
        for (uint8 i = 0; i < _distance; i++) {
            _startCell = neighbor(_startCell, _directions);
        }

        return _startCell;
    }

    function deleteCell(
        SharedStructs.Coordinate calldata _coord,
        uint256 gameId
    ) external {
        gameHexCells[gameId][_coord.r][_coord.q].exists = false;
    }

    function isIsland(
        SharedStructs.Coordinate memory _coord,
        uint256 gameId
    ) public view returns (bool) {
        SharedStructs.Cell memory c = getCell(_coord, gameId);

        return c.island;
    }
}
