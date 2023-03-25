// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './IMap.sol';
import 'hardhat/console.sol';

contract Map is IMap{

    mapping(int => mapping(int => Cell)) public hexCells;
    uint public size;

    constructor(uint _size){
     size = _size;
     initializeHexGrid();
     createIsland();
    }

    function initializeHexGrid() private {
    int intSize = int(size);
    for (int q = -intSize; q <= intSize; q++) {
        int r1 = max(-intSize, -q - intSize);
        int r2 = min(intSize, -q + intSize);
        for (int r = r1; r <= r2; r++) {
            console.log("Creating");
            console.logInt(q);
            console.logInt(r);
            hexCells[q][r] = Cell({
                q: q,
                r: r,
                island: false
                // Add additional properties as needed
            });
        }
    }
}

function createIsland() private {
    uint gridSize = 1 + 6 * size;
    uint islandNo = gridSize * 16 / 100;
     for (uint i = 0; i < islandNo; i++) {
        (int q, int r) = getRandomCoordinatePair();
        hexCells[q][r].island = true;
}
}

function getRandomCoordinatePair() public view returns (int, int) {
    uint randomQ = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % (2 * size + 1);
    uint randomR = uint(keccak256(abi.encodePacked(block.timestamp + 1, block.difficulty))) % (2 * size + 1);
    int q = int(randomQ) - int(size);
    int r = int(randomR) - int(size);
    
    // Ensure the generated coordinates are within the hex grid
    while (!(q >= -int(size) && q <= int(size) && r >= -int(size) && r <= int(size) && r >= -(q + int(size)) && r <= (q + int(size)))) {
        randomQ = (randomQ + 1) % (2 * size + 1);
        randomR = (randomR + 1) % (2 * size + 1);
        q = int(randomQ) - int(size);
        r = int(randomR) - int(size);
    }
    
    return (q, r);
}


function max(int a, int b) private pure returns (int) {
    return a >= b ? a : b;
}

function min(int a, int b) private pure returns (int) {
    return a <= b ? a : b;
}



    function travel(Cell calldata _startCell, uint8 _direction, uint8 distance) external pure returns (bool dies, Cell calldata destinationCell){
        int q = _startCell.q;
        int r = _startCell.r;
        bool island = _startCell.island;
        if(island) {
        dies = true;
        }



        destinationCell = _startCell;

        return (dies, destinationCell);
    }

    function deleteCell(Cell memory _cell) external {
        
    }

    function isIsland(Cell calldata _cell) external view returns(bool){
        return true;
    }
}