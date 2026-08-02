// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ReceiptAnchorV1
/// @notice Anchors canonical, off-chain OutcomeRail receipt evidence on Base.
/// @dev It does not validate upstream market data or make trading decisions.
contract ReceiptAnchorV1 {
    struct Anchor {
        bytes32 receiptHash;
        bytes32 policyHash;
        bytes32 marketHash;
        uint64 observedAt;
        address anchorer;
    }

    error EmptyReceiptHash();
    error EmptyPolicyHash();
    error EmptyMarketHash();
    error EmptyObservationTime();
    error ReceiptAlreadyAnchored();

    event ReceiptAnchored(
        bytes32 indexed receiptHash,
        bytes32 indexed policyHash,
        bytes32 indexed marketHash,
        uint64 observedAt,
        address anchorer
    );

    mapping(bytes32 receiptHash => Anchor receiptAnchor) private anchors;

    function anchorReceipt(
        bytes32 receiptHash,
        bytes32 policyHash,
        bytes32 marketHash,
        uint64 observedAt
    ) external {
        if (receiptHash == bytes32(0)) revert EmptyReceiptHash();
        if (policyHash == bytes32(0)) revert EmptyPolicyHash();
        if (marketHash == bytes32(0)) revert EmptyMarketHash();
        if (observedAt == 0) revert EmptyObservationTime();
        if (anchors[receiptHash].anchorer != address(0)) revert ReceiptAlreadyAnchored();

        anchors[receiptHash] = Anchor({
            receiptHash: receiptHash,
            policyHash: policyHash,
            marketHash: marketHash,
            observedAt: observedAt,
            anchorer: msg.sender
        });

        emit ReceiptAnchored(receiptHash, policyHash, marketHash, observedAt, msg.sender);
    }

    function getAnchor(bytes32 receiptHash) external view returns (Anchor memory) {
        return anchors[receiptHash];
    }
}
