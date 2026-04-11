// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {KairosLearnSBTRegistry} from "../src/SBTRegistry.sol";

contract Deploy is Script {
    function run() external {
        address owner  = vm.envAddress("OWNER_ADDRESS");
        address issuer = vm.envAddress("ISSUER_ADDRESS");

        vm.startBroadcast();
        KairosLearnSBTRegistry registry = new KairosLearnSBTRegistry(owner, issuer);
        vm.stopBroadcast();

        console.log("SBTRegistry deployed at:", address(registry));
    }
}
