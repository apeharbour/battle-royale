#!/bin/sh
# This script is used to update the subgraph networks in the graph folder

GP_ADDRESS=`jq -r '."BattleRoyale#GamePunk"' ./ignition/deployments/chain-11155111/deployed_addresses.json`
GP_ADDRESS="$GP_ADDRESS" jq '. | .sepolia.GamePunk.address = env.GP_ADDRESS' ../graph/newSubgraph/networks.json > ../graph/newSubgraph/networks.tmp
mv ../graph/newSubgraph/networks.tmp ../graph/newSubgraph/networks.json
echo "GamePunk address updated in networks.json to `jq -r '.sepolia.GamePunk.address' ../graph/newSubgraph/networks.json`"

PUNKSHIPS_ADDRESS=`jq -r '."BattleRoyale#Punkships"' ./ignition/deployments/chain-11155111/deployed_addresses.json`
PUNKSHIPS_ADDRESS="$PUNKSHIPS_ADDRESS" jq '. | .sepolia.Punkships.address = env.PUNKSHIPS_ADDRESS' ../graph/newSubgraph/networks.json > ../graph/newSubgraph/networks.tmp
mv ../graph/newSubgraph/networks.tmp ../graph/newSubgraph/networks.json
echo "Punkships address updated in networks.json to `jq -r '.sepolia.Punkships.address' ../graph/newSubgraph/networks.json`"

REGISTRATION_ADDRESS=`jq -r '."BattleRoyale#RegistrationPunk"' ./ignition/deployments/chain-11155111/deployed_addresses.json`
REGISTRATION_ADDRESS="$REGISTRATION_ADDRESS" jq '. | .sepolia.Registration.address = env.REGISTRATION_ADDRESS' ../graph/newSubgraph/networks.json > ../graph/newSubgraph/networks.tmp
mv ../graph/newSubgraph/networks.tmp ../graph/newSubgraph/networks.json
echo "Registration address updated in networks.json to `jq -r '.sepolia.Registration.address' ../graph/newSubgraph/networks.json`"

jq '.abi' ignition/deployments/chain-11155111/artifacts/BattleRoyale\#GamePunk.json > ../graph/newSubgraph/abis/GamePunk.json
jq '.abi' ignition/deployments/chain-11155111/artifacts/BattleRoyale\#Punkships.json > ../graph/newSubgraph/abis/Punkships.json
jq '.abi' ignition/deployments/chain-11155111/artifacts/BattleRoyale\#RegistrationPunk.json > ../graph/newSubgraph/abis/Registration.json
echo "ABIs updated in graph/newSubgraph/abis"

# Copy all the stuff over to punkships too
cp ../graph/newSubgraph/networks.json ../graph/punkships/networks.json
cp ../graph/newSubgraph/abis/* ../graph/punkships/abis/
echo "ABIs updated in graph/punkships/abis"

# Copy all the stuff over to registration too
cp ../graph/newSubgraph/networks.json ../graph/registration/networks.json
cp ../graph/newSubgraph/abis/* ../graph/registration/abis/
echo "ABIs updated in graph/registration/abis"

# Copy ABIs to the frontend
cp ignition/deployments/chain-11155111/artifacts/BattleRoyale\#GamePunk.json ../frontend/battle-royale-ui/src/abis/GamePunk.json
cp ignition/deployments/chain-11155111/artifacts/BattleRoyale\#Punkships.json ../frontend/battle-royale-ui/src/abis/Punkships.json
cp ignition/deployments/chain-11155111/artifacts/BattleRoyale\#RegistrationPunk.json ../frontend/battle-royale-ui/src/abis/RegistrationPunk.json
echo "ABIs updated in frontend/battle-royale-ui/src/abis"