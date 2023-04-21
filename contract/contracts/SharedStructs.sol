// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library SharedStructs {

    struct Cell {
        uint8 q;
        uint8 r;
        bool island;
        bool exists;
    }

    struct Direction {
        int8 q;
        int8 r;
    }

    struct Coordinate {
        uint8 q;
        uint8 r;
    }

    enum Directions {
        E,
        NE,
        NW,
        W,
        SW,
        SE
    }

}
