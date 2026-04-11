# KairosLearn Smart Contracts

ERC-5192 soulbound credential registry. Deployed once per environment.

## Build
forge build

## Test
forge test -vvv

## Deploy (Base Sepolia)
export BASE_RPC_URL=https://sepolia.base.org
export ISSUER_PRIVATE_KEY=0x...
export OWNER_ADDRESS=0x...
export ISSUER_ADDRESS=0x...
forge script script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast --private-key $ISSUER_PRIVATE_KEY
