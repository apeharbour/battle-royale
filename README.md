# Battle Royale
An on-chain battle royale based loosely on *Battleships*. The main game play is round-based: Each player has one ship on board. With each move they can move in a straight line up to their range. They can shoot one canon ball per round, up to their shooting range. They moves are collected and the executed at the same time. Last man standing wins.

## Repository
This repo is a monorepo with code for various components:
- **backend (`AWSLambda/*`):** Lambda functions that help with the game play – we collect all moves off-line and submit them in on tx to the smart contract.
- **smart contracts (`contract/*`):** The smart contracts manage the core game. In addition there is an NFT collection that is used for the players' ships.
- **subgraphs (`graph/*`):** The subgraphs index the game play for the frontend.
- **frontend (`frontend`/*):** React-based frontedn to play the game.

## Development
The developement environment is best managed with [pnpm](https://pnpm.io/). The workspace configuration for the repo is using pnpm's standard. There are various scripts that help with development:

### Local Environment
To test on a local machine, follow these steps from the root of the repository:

1. `pnpm -r run infra:local:up`: This spins up a local blockchain that listens on http://localhost:8545. In parallel it spins up a graph node with docker-compose. The two scripts are defined in the respective `package.json` files. The `-r` (=recursive) flag runs them in all workspaces.
2. `pnpm -r run deploy:local`: This deploys the smart contracts, copies over some of the config (mostly the addresses) and then deploys the subgraphs. 

If a subgraph needs to be redeployed during development, the command is: `pnpm --filter <subgraph name> run update:local`.

After testing the enviroment can be torn down with: `pnpm -r infra:local:down`. 