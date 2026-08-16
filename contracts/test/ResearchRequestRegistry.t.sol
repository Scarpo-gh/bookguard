// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../ResearchRequestRegistry.sol";

interface Vm {
    function prank(address msgSender) external;
}

contract ResearchRequestRegistryTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    ResearchRequestRegistry private registry;

    address private constant REQUESTER = address(0xA11CE);
    address private constant OTHER = address(0xB0B);
    bytes32 private constant REQUEST_HASH = keccak256("bookguard:research-request/v1:example");
    bytes32 private constant SCOPE_HASH = keccak256("bookguard:research-scope/v1:example");
    bytes32 private constant FULFILLMENT_HASH = keccak256("bookguard:research-fulfillment/v1:example");

    function setUp() public {
        registry = new ResearchRequestRegistry();
    }

    function testCreateRequestRecordsAnOpenNonCustodialCommitment() public {
        vm.prank(REQUESTER);
        registry.createRequest(REQUEST_HASH, SCOPE_HASH);

        ResearchRequestRegistry.ResearchRequest memory request = registry.getRequest(REQUEST_HASH);
        _assertEq(request.requestHash, REQUEST_HASH, "request hash must be retained");
        _assertEq(request.scopeHash, SCOPE_HASH, "scope hash must be retained");
        _assertEq(request.requester, REQUESTER, "requester must be retained");
        _assertEq(uint8(request.status), uint8(ResearchRequestRegistry.Status.Open), "request must be open");
        _assertTrue(request.createdAt > 0, "creation time must be retained");
    }

    function testRequesterCanWithdrawOnlyAnOpenRequest() public {
        vm.prank(REQUESTER);
        registry.createRequest(REQUEST_HASH, SCOPE_HASH);

        vm.prank(REQUESTER);
        registry.withdrawRequest(REQUEST_HASH);

        ResearchRequestRegistry.ResearchRequest memory request = registry.getRequest(REQUEST_HASH);
        _assertEq(uint8(request.status), uint8(ResearchRequestRegistry.Status.Withdrawn), "request must be withdrawn");

        vm.prank(REQUESTER);
        (bool secondWithdrawal,) =
            address(registry).call(abi.encodeWithSignature("withdrawRequest(bytes32)", REQUEST_HASH));
        _assertTrue(!secondWithdrawal, "withdrawal is a terminal state");
    }

    function testRequesterCanAcceptFulfillmentOnlyWhileOpen() public {
        vm.prank(REQUESTER);
        registry.createRequest(REQUEST_HASH, SCOPE_HASH);

        vm.prank(REQUESTER);
        registry.fulfillRequest(REQUEST_HASH, FULFILLMENT_HASH);

        ResearchRequestRegistry.ResearchRequest memory request = registry.getRequest(REQUEST_HASH);
        _assertEq(request.fulfillmentHash, FULFILLMENT_HASH, "fulfillment hash must be retained");
        _assertEq(uint8(request.status), uint8(ResearchRequestRegistry.Status.Fulfilled), "request must be fulfilled");

        vm.prank(REQUESTER);
        (bool withdrawal,) = address(registry).call(abi.encodeWithSignature("withdrawRequest(bytes32)", REQUEST_HASH));
        _assertTrue(!withdrawal, "fulfilled request cannot be withdrawn");
    }

    function testRejectsDuplicateEmptyAndUnauthorizedRequestMutations() public {
        vm.prank(REQUESTER);
        registry.createRequest(REQUEST_HASH, SCOPE_HASH);

        vm.prank(REQUESTER);
        (bool duplicate,) =
            address(registry).call(abi.encodeWithSignature("createRequest(bytes32,bytes32)", REQUEST_HASH, SCOPE_HASH));
        _assertTrue(!duplicate, "request hash may only be created once");

        vm.prank(OTHER);
        (bool unauthorized,) = address(registry).call(abi.encodeWithSignature("withdrawRequest(bytes32)", REQUEST_HASH));
        _assertTrue(!unauthorized, "only requester may change lifecycle");

        vm.prank(REQUESTER);
        (bool emptyRequest,) =
            address(registry).call(abi.encodeWithSignature("createRequest(bytes32,bytes32)", bytes32(0), SCOPE_HASH));
        _assertTrue(!emptyRequest, "request hash is required");

        vm.prank(REQUESTER);
        (bool emptyFulfillment,) =
            address(registry).call(abi.encodeWithSignature("fulfillRequest(bytes32,bytes32)", REQUEST_HASH, bytes32(0)));
        _assertTrue(!emptyFulfillment, "fulfillment hash is required");
    }

    function _assertEq(bytes32 actual, bytes32 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(address actual, address expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(uint8 actual, uint8 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertTrue(bool condition, string memory message) private pure {
        if (!condition) revert(message);
    }
}
