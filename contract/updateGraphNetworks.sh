#!/bin/sh
# This script is used to update the subgraph networks in the graph folder

GP_ADDRESS=`jq -r '."BattleRoyale#GamePunk"' ./ignition/deployments/chain-1337/deployed_addresses.json`
GP_ADDRESS="$GP_ADDRESS" jq '. | .localhost.GamePunk.address = env.GP_ADDRESS' ../graph/newSubgraph/networks.json > ../graph/newSubgraph/networks.tmp
mv ../graph/newSubgraph/networks.tmp ../graph/newSubgraph/networks.json
echo "GamePunk address updated in networks.json to `jq -r '.localhost.GamePunk.address' ../graph/newSubgraph/networks.json`"

PUNKSHIPS_ADDRESS=`jq -r '."BattleRoyale#Punkships"' ./ignition/deployments/chain-1337/deployed_addresses.json`
PUNKSHIPS_ADDRESS="$PUNKSHIPS_ADDRESS" jq '. | .localhost.Punkships.address = env.PUNKSHIPS_ADDRESS' ../graph/newSubgraph/networks.json > ../graph/newSubgraph/networks.tmp
mv ../graph/newSubgraph/networks.tmp ../graph/newSubgraph/networks.json
echo "Punkships address updated in networks.json to `jq -r '.localhost.Punkships.address' ../graph/newSubgraph/networks.json`"

jq '.abi' ignition/deployments/chain-1337/artifacts/BattleRoyale\#GamePunk.json > ../graph/newSubgraph/abis/GamePunk.json
jq '.abi' ignition/deployments/chain-1337/artifacts/BattleRoyale\#Punkships.json > ../graph/newSubgraph/abis/Punkships.json
echo "ABIs updated in graph/newSubgraph/abis"

# Copy all the stuff over to punkships too
cp ../graph/newSubgraph/networks.json ../graph/punkships/networks.json
cp ../graph/newSubgraph/abis/GamePunk.json ../graph/punkships/abis/GamePunk.json
cp ../graph/newSubgraph/abis/Punkships.json ../graph/punkships/abis/Punkships.json