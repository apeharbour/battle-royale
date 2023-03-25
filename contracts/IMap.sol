// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMap {

    struct Cell {
        int q;
        int r;
        bool island;
    }

    // constructor (uint radius)


    function travel (Cell calldata _startCell, uint8 _direction, uint8 distance) external view returns (bool dies, Cell calldata destinationCell);
    function deleteCell(Cell memory cell) external;
    function isIsland(Cell calldata cell) external view returns (bool);

}