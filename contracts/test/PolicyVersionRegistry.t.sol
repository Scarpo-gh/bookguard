// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../PolicyVersionRegistry.sol";

interface Vm {
    function prank(address msgSender) external;
}

contract PolicyVersionRegistryTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    PolicyVersionRegistry private registry;

    address private constant PUBLISHER = address(0xA11CE);
    address private constant OTHER_PUBLISHER = address(0xB0B);
    bytes32 private constant POLICY_ID = keccak256("bookguard:polymarket-clob-risk");
    bytes32 private constant CONTENT_HASH_V1 = keccak256("bookguard:policy:polymarket-clob-risk/v1");

    function setUp() public {
        registry = new PolicyVersionRegistry();
    }

    function testRegisterPolicyVersionBindsPublisherAndContent() public {
        vm.prank(PUBLISHER);
        registry.registerPolicyVersion(POLICY_ID, 1, CONTENT_HASH_V1);

        PolicyVersionRegistry.PolicyVersion memory policyVersion = registry.getPolicyVersion(POLICY_ID, 1);
        _assertEq(policyVersion.contentHash, CONTENT_HASH_V1, "content hash must be retained");
        _assertEq(policyVersion.publisher, PUBLISHER, "publisher must be retained");
        _assertTrue(policyVersion.publishedAt > 0, "publish time must be retained");
        _assertEq(registry.getPolicyPublisher(POLICY_ID), PUBLISHER, "first publisher owns the policy namespace");
    }

    function testRegisterPolicyVersionRejectsDuplicateVersion() public {
        vm.prank(PUBLISHER);
        registry.registerPolicyVersion(POLICY_ID, 1, CONTENT_HASH_V1);

        vm.prank(PUBLISHER);
        (bool ok,) = address(registry)
            .call(
                abi.encodeWithSignature("registerPolicyVersion(bytes32,uint64,bytes32)", POLICY_ID, 1, CONTENT_HASH_V1)
            );

        _assertTrue(!ok, "a policy version may only be registered once");
    }

    function testRegisterPolicyVersionRejectsAnotherPublisherInClaimedNamespace() public {
        vm.prank(PUBLISHER);
        registry.registerPolicyVersion(POLICY_ID, 1, CONTENT_HASH_V1);

        vm.prank(OTHER_PUBLISHER);
        (bool ok,) = address(registry)
            .call(
                abi.encodeWithSignature(
                    "registerPolicyVersion(bytes32,uint64,bytes32)",
                    POLICY_ID,
                    2,
                    keccak256("bookguard:policy:polymarket-clob-risk/v2")
                )
            );

        _assertTrue(!ok, "only the namespace publisher may publish a new version");
    }

    function testRegisterPolicyVersionRejectsEmptyIdentityOrContent() public {
        vm.prank(PUBLISHER);
        (bool emptyPolicyId,) = address(registry)
            .call(
                abi.encodeWithSignature("registerPolicyVersion(bytes32,uint64,bytes32)", bytes32(0), 1, CONTENT_HASH_V1)
            );
        _assertTrue(!emptyPolicyId, "policy id is required");

        vm.prank(PUBLISHER);
        (bool emptyVersion,) = address(registry)
            .call(
                abi.encodeWithSignature("registerPolicyVersion(bytes32,uint64,bytes32)", POLICY_ID, 0, CONTENT_HASH_V1)
            );
        _assertTrue(!emptyVersion, "policy version is required");

        vm.prank(PUBLISHER);
        (bool emptyContentHash,) = address(registry)
            .call(abi.encodeWithSignature("registerPolicyVersion(bytes32,uint64,bytes32)", POLICY_ID, 1, bytes32(0)));
        _assertTrue(!emptyContentHash, "policy content hash is required");
    }

    function _assertEq(bytes32 actual, bytes32 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(address actual, address expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertTrue(bool condition, string memory message) private pure {
        if (!condition) revert(message);
    }
}
