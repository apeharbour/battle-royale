#!/bin/sh
# This script is used to update the subgraph networks in the graph folder

GP_ADDRESS=`jq -r '."BattleRoyale#GamePunk"' ./ignition/deployments/chain-1337/deployed_addresses.json`
GP_ADDRESS="$GP_ADDRESS" jq '. | .localhost.GamePunk.address = env.GP_ADDRESS' ../graph/newSubgraph/networks.json > ../graph/newSubgraph/networks.tmp
mv ../graph/newSubgraph/networks.tmp ../graph/newSubgraph/networks.json
echo "GamePunk address updated in networks.json to `jq -r '.localhost.GamePunk.address' ../graph/newSubgraph/networks.json`"

jq '.abi' ignition/deployments/chain-1337/artifacts/BattleRoyale\#GamePunk.json > ../graph/newSubgraph/abis/GamePunk.json
echo "GamePunk ABI updated in graph/newSubgraph/abis/GamePunk.json"