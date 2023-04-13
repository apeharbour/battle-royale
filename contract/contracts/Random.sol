// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

library Random {
    struct RandomGeneration {
        uint256 seed;
        uint8 currentShift;
    }

    uint8 constant SHIFT = 8;
    uint constant BITMASK = 2**SHIFT - 1;
    uint8 constant MAX_SHIFTS = uint8(256 / SHIFT) - 1;

    function init(uint256 _seed) internal pure returns (RandomGeneration memory) {
        return RandomGeneration( uint256(keccak256(abi.encode(_seed))), 0);
    }

    function getRandomValue(RandomGeneration storage _rnd, uint8 _maxValue) internal returns (uint8) {
        // console.log("Current values: { shift: %s, seed: %s }", _rnd.currentShift, _rnd.seed);

        if (_rnd.currentShift >= MAX_SHIFTS) {
            _rnd.seed = uint256(keccak256(abi.encode(_rnd.seed)));
            _rnd.currentShift = 0;
            // console.log('New seed needs to be generated %s', _rnd.seed);
        }

        uint8 result = uint8(
            (_rnd.seed >> (SHIFT * _rnd.currentShift)) & BITMASK
        ) % _maxValue;
        // console.log('new number with current shift %s, seed %s, Result %s', _rnd.currentShift, _rnd.seed, result);

        _rnd.currentShift++;
        return result;
    }
}
