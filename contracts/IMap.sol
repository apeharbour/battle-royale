// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMap {

    struct Cell {
        uint8 q;
        uint8 r;
        bool island;
        bool exists;
    }

    // constructor (uint radius)


    function travel (Cell calldata _startCell, uint8 _direction, uint8 distance) external view returns (bool dies, Cell memory destinationCell);
    function deleteCell(Cell memory cell) external;
    function isIsland(Cell calldata cell) external view returns (bool);
    function getCell(uint8 q, uint8 r) external view returns (uint8, uint8, bool, bool);

}



