// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {KairosLearnSBTRegistry} from "../src/SBTRegistry.sol";

contract SBTRegistryTest is Test {
    KairosLearnSBTRegistry public registry;
    address owner   = address(0xA11CE);
    address issuer  = address(0xB0B);
    address alice   = address(0xCAFE);
    address bob     = address(0xBEEF);

    function setUp() public {
        registry = new KairosLearnSBTRegistry(owner, issuer);
    }

    function test_LockedAlwaysTrue() public view {
        assertTrue(registry.locked(0));
        assertTrue(registry.locked(99999));
    }

    function test_OnlyIssuerCanMintDiploma() public {
        vm.prank(alice);
        vm.expectRevert(KairosLearnSBTRegistry.NotIssuer.selector);
        registry.mintDiploma(alice, "google-swe-mock-mastery", "ipfs://meta");
    }

    function test_IssuerCanMintDiploma() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "google-swe-mock-mastery", "ipfs://meta");

        assertEq(tokenId, 1);
        assertEq(registry.ownerOf(tokenId), alice);
        assertEq(registry.diplomaIdOf(tokenId), "google-swe-mock-mastery");
        assertEq(registry.tokenURI(tokenId), "ipfs://meta");
    }

    function test_TransferRevertsAsSoulbound() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(alice);
        vm.expectRevert(KairosLearnSBTRegistry.Soulbound.selector);
        registry.transferFrom(alice, bob, tokenId);
    }

    function test_BatchPublishedToIssuer() public {
        bytes32 root = keccak256("root1");
        vm.prank(issuer);
        uint256 tokenId = registry.publishBatch(root, "ipfs://batch1");

        assertEq(registry.merkleRootOf(tokenId), root);
        assertEq(registry.ownerOf(tokenId), issuer);
        assertEq(registry.tokenURI(tokenId), "ipfs://batch1");
    }

    function test_OwnerCanRevokeAndBurn() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(owner);
        registry.revoke(tokenId);

        assertTrue(registry.revoked(tokenId));
        vm.expectRevert(); // ERC721NonexistentToken after burn
        registry.ownerOf(tokenId);
    }

    function test_NonOwnerCannotRevoke() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(alice);
        vm.expectRevert(); // OwnableUnauthorizedAccount
        registry.revoke(tokenId);
    }

    function test_OwnerCanRotateIssuer() public {
        address newIssuer = address(0xFEED);
        vm.prank(owner);
        registry.setIssuer(newIssuer);

        assertEq(registry.issuer(), newIssuer);

        vm.prank(issuer);
        vm.expectRevert(KairosLearnSBTRegistry.NotIssuer.selector);
        registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(newIssuer);
        registry.mintDiploma(alice, "x", "ipfs://x");
    }
}
