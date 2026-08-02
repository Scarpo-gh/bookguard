// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../ReceiptAnchorV1.sol";

interface Vm {
    function prank(address msgSender) external;
}

contract ReceiptAnchorV1Test {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    ReceiptAnchorV1 private anchor;

    address private constant ANCHORER = address(0xA11CE);
    bytes32 private constant RECEIPT_HASH = keccak256("canonical-receipt");
    bytes32 private constant POLICY_HASH = keccak256("policy-v1");
    bytes32 private constant MARKET_HASH = keccak256("limitless/market/outcome");
    uint64 private constant OBSERVED_AT = 1_700_000_000;

    function setUp() public {
        anchor = new ReceiptAnchorV1();
    }

    function testAnchorReceiptBindsCanonicalEvidence() public {
        vm.prank(ANCHORER);
        anchor.anchorReceipt(RECEIPT_HASH, POLICY_HASH, MARKET_HASH, OBSERVED_AT);

        ReceiptAnchorV1.Anchor memory receiptAnchor = anchor.getAnchor(RECEIPT_HASH);
        _assertEq(receiptAnchor.receiptHash, RECEIPT_HASH, "receipt hash must be retained");
        _assertEq(receiptAnchor.policyHash, POLICY_HASH, "policy hash must be retained");
        _assertEq(receiptAnchor.marketHash, MARKET_HASH, "market hash must be retained");
        _assertEq(uint256(receiptAnchor.observedAt), uint256(OBSERVED_AT), "observation time must be retained");
        _assertEq(receiptAnchor.anchorer, ANCHORER, "anchorer must be retained");
    }

    function testAnchorReceiptRejectsDuplicateReceiptHash() public {
        anchor.anchorReceipt(RECEIPT_HASH, POLICY_HASH, MARKET_HASH, OBSERVED_AT);

        (bool ok,) = address(anchor).call(
            abi.encodeWithSignature(
                "anchorReceipt(bytes32,bytes32,bytes32,uint64)",
                RECEIPT_HASH,
                POLICY_HASH,
                MARKET_HASH,
                OBSERVED_AT
            )
        );

        _assertTrue(!ok, "a canonical receipt may only be anchored once");
    }

    function _assertEq(bytes32 actual, bytes32 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(address actual, address expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(uint256 actual, uint256 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertTrue(bool condition, string memory message) private pure {
        if (!condition) revert(message);
    }
}
