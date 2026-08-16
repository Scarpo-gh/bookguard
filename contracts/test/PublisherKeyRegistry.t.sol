// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../PublisherKeyRegistry.sol";

interface Vm {
    function prank(address msgSender) external;
}

contract PublisherKeyRegistryTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    PublisherKeyRegistry private registry;

    address private constant PUBLISHER = address(0xA11CE);
    address private constant OTHER_PUBLISHER = address(0xB0B);
    bytes32 private constant KEY_ID_V1 = keccak256("bookguard:publisher-key:example/v1");
    bytes32 private constant KEY_ID_V2 = keccak256("bookguard:publisher-key:example/v2");
    bytes32 private constant PUBLIC_KEY_HASH_V1 = keccak256("bookguard:ed25519-public-key/v1");
    bytes32 private constant PUBLIC_KEY_HASH_V2 = keccak256("bookguard:ed25519-public-key/v2");
    string private constant KEY_URI_V1 = "ipfs://bafybookguardpublisherkeyv1";
    string private constant KEY_URI_V2 = "ipfs://bafybookguardpublisherkeyv2";

    function setUp() public {
        registry = new PublisherKeyRegistry();
    }

    function testRegisterPublisherKeyPublishesAnActiveDiscoveryRecord() public {
        vm.prank(PUBLISHER);
        registry.registerPublisherKey(KEY_ID_V1, PUBLIC_KEY_HASH_V1, KEY_URI_V1);

        PublisherKeyRegistry.PublisherKey memory key = registry.getPublisherKey(PUBLISHER, KEY_ID_V1);
        _assertEq(key.keyId, KEY_ID_V1, "key id must be retained");
        _assertEq(key.publicKeyHash, PUBLIC_KEY_HASH_V1, "public key hash must be retained");
        _assertEq(key.publisher, PUBLISHER, "publisher must be retained");
        _assertEq(key.uri, KEY_URI_V1, "public key URI must be retained");
        _assertTrue(key.registeredAt > 0, "registration time must be retained");
        _assertEq(registry.getActiveKeyId(PUBLISHER), KEY_ID_V1, "registered key must become active");
    }

    function testRotatePublisherKeySupersedesTheOldKey() public {
        vm.prank(PUBLISHER);
        registry.registerPublisherKey(KEY_ID_V1, PUBLIC_KEY_HASH_V1, KEY_URI_V1);

        vm.prank(PUBLISHER);
        registry.rotatePublisherKey(KEY_ID_V2, PUBLIC_KEY_HASH_V2, KEY_URI_V2);

        PublisherKeyRegistry.PublisherKey memory oldKey = registry.getPublisherKey(PUBLISHER, KEY_ID_V1);
        PublisherKeyRegistry.PublisherKey memory newKey = registry.getPublisherKey(PUBLISHER, KEY_ID_V2);
        _assertEq(oldKey.supersededBy, KEY_ID_V2, "old key must identify its replacement");
        _assertTrue(oldKey.supersededAt > 0, "old key must record replacement time");
        _assertEq(newKey.publicKeyHash, PUBLIC_KEY_HASH_V2, "new key hash must be retained");
        _assertEq(registry.getActiveKeyId(PUBLISHER), KEY_ID_V2, "new key must become active");
    }

    function testRevokeActiveKeyClearsDiscoveryAndPreventsRotationWithoutAReplacement() public {
        vm.prank(PUBLISHER);
        registry.registerPublisherKey(KEY_ID_V1, PUBLIC_KEY_HASH_V1, KEY_URI_V1);

        vm.prank(PUBLISHER);
        registry.revokeActiveKey();

        PublisherKeyRegistry.PublisherKey memory key = registry.getPublisherKey(PUBLISHER, KEY_ID_V1);
        _assertTrue(key.revokedAt > 0, "revocation time must be retained");
        _assertEq(registry.getActiveKeyId(PUBLISHER), bytes32(0), "revoked key must no longer be active");

        vm.prank(PUBLISHER);
        (bool ok,) = address(registry)
            .call(
                abi.encodeWithSignature(
                    "rotatePublisherKey(bytes32,bytes32,string)", KEY_ID_V2, PUBLIC_KEY_HASH_V2, KEY_URI_V2
                )
            );
        _assertTrue(!ok, "rotation without an active key must fail");
    }

    function testRejectsDuplicateOrEmptyKeyDataAndIsolatesPublisherNamespaces() public {
        vm.prank(PUBLISHER);
        registry.registerPublisherKey(KEY_ID_V1, PUBLIC_KEY_HASH_V1, KEY_URI_V1);

        vm.prank(PUBLISHER);
        (bool duplicate,) = address(registry)
            .call(
                abi.encodeWithSignature(
                    "registerPublisherKey(bytes32,bytes32,string)", KEY_ID_V1, PUBLIC_KEY_HASH_V1, KEY_URI_V1
                )
            );
        _assertTrue(!duplicate, "a publisher key id may only be registered once");

        vm.prank(OTHER_PUBLISHER);
        registry.registerPublisherKey(KEY_ID_V1, PUBLIC_KEY_HASH_V2, KEY_URI_V2);
        PublisherKeyRegistry.PublisherKey memory original = registry.getPublisherKey(PUBLISHER, KEY_ID_V1);
        PublisherKeyRegistry.PublisherKey memory other = registry.getPublisherKey(OTHER_PUBLISHER, KEY_ID_V1);
        _assertEq(original.publicKeyHash, PUBLIC_KEY_HASH_V1, "another publisher must not alter this namespace");
        _assertEq(other.publicKeyHash, PUBLIC_KEY_HASH_V2, "key ids are publisher-scoped");

        vm.prank(PUBLISHER);
        (bool emptyKeyId,) = address(registry)
            .call(
                abi.encodeWithSignature(
                    "registerPublisherKey(bytes32,bytes32,string)", bytes32(0), PUBLIC_KEY_HASH_V2, KEY_URI_V2
                )
            );
        _assertTrue(!emptyKeyId, "key id is required");
    }

    function _assertEq(bytes32 actual, bytes32 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(address actual, address expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(string memory actual, string memory expected, string memory message) private pure {
        if (keccak256(bytes(actual)) != keccak256(bytes(expected))) revert(message);
    }

    function _assertTrue(bool condition, string memory message) private pure {
        if (!condition) revert(message);
    }
}
