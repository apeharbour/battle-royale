// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IMap.sol";
import "hardhat/console.sol";

error MapSizeMustBeInRange(uint suppliedSize, uint maxSize);

contract Map is IMap {
    uint8 constant MAX_RADIUS = 127;

    struct RandomGeneration {
        uint256 seed;
        uint8 shiftValue;
        uint8 bitmask;
        uint8 currentShift;
    }

    mapping(int => mapping(int => Cell)) public hexCells;
    int8 public size;
    RandomGeneration private rnd;

    constructor(uint8 _size, uint256 _seed) {
        if (_size > 127) {
            revert MapSizeMustBeInRange(_size, MAX_RADIUS);
        }
        size = int8(_size);
        rnd = RandomGeneration(
            uint256(keccak256(abi.encode(_seed))),
            4,
            255,
            0
        );

        initializeHexGrid();
        createIslands();
    }

    function getRandomValue(uint8 _maxValue) public returns (uint8) {
        if (rnd.currentShift >= 31) {
            rnd.seed = uint256(keccak256(abi.encode(rnd.seed)));
            rnd.currentShift = 0;
            // console.log('New seed needs to be generated %s', rnd.seed);
        }

        uint8 result = uint8(
            (rnd.seed >> (rnd.shiftValue * rnd.currentShift)) & rnd.bitmask
        ) % _maxValue;
        rnd.currentShift++;
        // console.log('new number with current shift %s, seed %s, Result %s', rnd.currentShift, rnd.seed, result);
        return result;
    }

    function initializeHexGrid() private {
        for (int8 q = -size; q <= size; q++) {
            int8 r1 = max(-size, -q - size);
            int8 r2 = min(size, -q + size);
            for (int8 r = r1; r <= r2; r++) {
                hexCells[q][r] = Cell({
                    q: q,
                    r: r,
                    island: false
                    // Add additional properties as needed
                });
            }
        }
    }

    function createIslands() private {
        uint8 gridSize = 1 + 6 * uint8(size);
        uint8 islandNo = (gridSize * 16) / 100;
        for (uint8 i = 0; i < islandNo; i++) {
            (int8 q, int8 r) = getRandomCoordinatePair();
            hexCells[q][r].island = true;
        }
    }

    function getCell(int8 q, int8 r) external view returns(int8, int8, bool) {
        return (hexCells[q][r].q, hexCells[q][r].r, hexCells[q][r].island);
    }

    function getRandomCoordinatePair() public returns (int8, int8) {
        console.log('Size: ');
        console.logInt(size);
        console.log('cast value %s', uint8(2 * size + 1));
        uint8 randomQ = getRandomValue(uint8(2 * size + 1));
        uint8 randomR = getRandomValue(uint8(2 * size + 1));
        console.log('rnd values %s and %s', randomQ, randomR);
        int8 q = int8(randomQ) - size;
        int8 r = int8(randomR) - size;
        console.logInt(q);
        console.logInt(r);


        // Ensure the generated coordinates are within the hex grid
        while (
            !(q >= -size &&
                q <= size &&
                r >= -size &&
                r <= size &&
                r >= -(q + size) &&
                r <= (q + size))
        ) {
            randomQ = (randomQ + 1) % uint8(2 * size + 1);
            randomR = (randomR + 1) % uint8(2 * size + 1);
            q = int8(randomQ) - size;
            r = int8(randomR) - size;
        }

        return (q, r);
    }

    function max(int8 a, int8 b) private pure returns (int8) {
        return a >= b ? a : b;
    }

    function min(int8 a, int8 b) private pure returns (int8) {
        return a <= b ? a : b;
    }

    function travel(Cell calldata _startCell, uint8 _direction, uint8 distance) external view returns (bool dies, Cell memory destinationCell){
        int8 q = _startCell.q;
        int8 r = _startCell.r;
        bool island = _startCell.island;

        destinationCell = Cell(q, r, island);


        if(_direction == 1){      // NE
            for(int i = 1; i <= int256(uint256(distance)); i++){
                if (this.isIsland(destinationCell) == true){
                    dies = true;
                    return (dies, destinationCell);
            } else {
                destinationCell.q +=  1;
                destinationCell.r -=  1;
            }
            }
        } else if(_direction == 2){   // E 
            for(int i = 1; i <= int256(uint256(distance)); i++){
                if (this.isIsland(destinationCell) == true){
               dies = true;
         return (dies, destinationCell);
            } else {
                destinationCell.q +=  1;
            }
            }          
        } else if(_direction == 3){   // SE
            for(int i = 1; i <= int256(uint256(distance)); i++){
                if (this.isIsland(destinationCell) == true){
               dies = true;
              return (dies, destinationCell);
            } else {
                destinationCell.r +=  1;
            }
            }          
        } else if(_direction == 4){   // SW
           for(int i = 1; i <= int256(uint256(distance)); i++){
                if (this.isIsland(destinationCell) == true){
                    dies = true;
                    return (dies, destinationCell);
            } else {
                destinationCell.q -=  1;
                destinationCell.r +=  1;
            }
            }
        } else if(_direction == 5){   // W  
             for(int i = 1; i <= int256(uint256(distance)); i++){
                if (this.isIsland(destinationCell) == true){
                   dies = true;
                return (dies, destinationCell);
            } else {
                destinationCell.q -=  1;
            }
            }
        } else {                     // NW
            for(int i = 1; i <= int256(uint256(distance)); i++){
                if (this.isIsland(destinationCell) == true){
                    dies = true;
                    return (dies, destinationCell);
            } else {
                destinationCell.r -=  1;
            }
            }          
        }
    
       return (dies, destinationCell);
    }

    function reduceHexGrid() public {
    // Ensure the grid has a size greater than 0
    require(size > 0, "Grid size cannot be reduced below 0");

    int intSize = int(size);

    // Remove cells along the top-right to bottom-right edge
    for (int q = -intSize + 1; q <= intSize; q++) {
        delete hexCells[q][intSize - 1];
    }

    // Remove cells along the bottom-right to bottom-left edge
    for (int r = intSize - 1; r >= -intSize; r--) {
        delete hexCells[intSize - 1][r];
    }

    // Remove cells along the bottom-left to top-left edge
    for (int q = intSize - 1; q >= -intSize; q--) {
        delete hexCells[q][-intSize + 1];
    }

    // Remove cells along the top-left to top-right edge
    for (int r = -intSize + 1; r <= intSize; r++) {
        delete hexCells[-intSize + 1][r];
    }

    // Decrement the size
    size -= 1;
}

    function deleteCell(Cell memory _cell) external {
        delete hexCells[ _cell.q][_cell.r];
    }

    function isIsland(Cell calldata _cell) external view returns(bool){
        if(hexCells[_cell.q][_cell.r].island == true){
        return true;
    }  else {
        return false;
    }

}
}
