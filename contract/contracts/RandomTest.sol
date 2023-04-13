// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Random.sol";


contract RandomTest {
    Random.RandomGeneration private rnd;

    constructor(uint256 _seed) {
        rnd = Random.init(_seed);
        console.log("Initial values in parent: { shift: %s, seed: %s }", rnd.currentShift, rnd.seed);
    }

    function test(uint8 _maxValue) external returns (uint8) {
        uint8 result = Random.getRandomValue(rnd, _maxValue);
        console.log('result %s, shift %s, seed %s', result, rnd.currentShift, rnd.seed);
        return result;
    }


}
