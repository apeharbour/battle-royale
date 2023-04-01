// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// import "./IMap.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// error NotOwnerOfYacht(address account, uint256 yachtId);
// error TooManyPlayers(uint gameId, uint256 numberOfPlayers);



// struct Game {
//     uint256 startBlock;
//     uint256 round;
//     uint8 maxNumberOfPlayers;
//     uint8 numberOfPlayers;
// }

// struct Player {
//     address captain;
//     uint256 yachtId;
// }

// contract BattleRoyale {

//     event GameRegistered(uint256 gameId, uint256 startBlock);
//     event PlayerRegistered(uint256 gameId, address captain, uint256 yachtId);

//     uint256 public nextId;
//     mapping(uint256 => Game) games;
//     IERC721 private immutable ahy;
//     mapping (uint256 => Player[]) players;

//     constructor(address _ahyAddress) {
//         nextId = 1;
//         ahy = IERC721(_ahyAddress);
//     }

//     function registerGame(
//         uint8 _radius,
//         uint256 _startBlock,
//         uint8 _maxNumberOfPlayers
//     ) public returns (uint256) {
//         uint256 gameId = nextId;
//         nextId++;

//         games[gameId] = Game(_startBlock, 1, _maxNumberOfPlayers, 0);
//         players[gameId] = new Player[](_maxNumberOfPlayers);

//         emit GameRegistered(gameId, _startBlock);

//         return gameId;
//     }

//     function register(uint256 _gameId, uint256 _yachtId) external {

//         // check yacht ownership
//         if (ahy.ownerOf(_yachtId) != msg.sender) {
//             revert NotOwnerOfYacht(msg.sender, _yachtId);
//         }

//         // check max number of players
//         if (games[_gameId].maxNumberOfPlayers <= games[_gameId].numberOfPlayers) {
//             revert TooManyPlayers(_gameId, games[_gameId].numberOfPlayers);
//         }

//         // player can play
//         players[_gameId][games[_gameId].numberOfPlayers] = Player(msg.sender, _yachtId);
//         games[_gameId].numberOfPlayers++;

//         emit PlayerRegistered(_gameId, msg.sender, _yachtId);
//     }
// }
