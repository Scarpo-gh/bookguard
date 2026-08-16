// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title EvidenceRootAnchor
/// @notice Anchors immutable Merkle evidence-batch commitments on Base.
/// @dev Inclusion proof construction and verification intentionally remain off-chain.
///      This contract stores no evidence leaves, funds, orders, or trading state.
contract EvidenceRootAnchor {
    struct EvidenceBatch {
        bytes32 root;
        bytes32 metadataHash;
        uint64 observedFrom;
        uint64 observedTo;
        uint64 anchoredAt;
        address publisher;
    }

    error EmptyRoot();
    error EmptyMetadataHash();
    error EmptyObservationStart();
    error InvalidObservationWindow();
    error EvidenceRootAlreadyAnchored();

    event EvidenceRootAnchored(
        bytes32 indexed root,
        bytes32 indexed metadataHash,
        address indexed publisher,
        uint64 observedFrom,
        uint64 observedTo,
        uint64 anchoredAt
    );

    mapping(bytes32 root => EvidenceBatch batch) private evidenceBatches;

    /// @notice Records a unique Merkle root and canonical batch metadata commitment.
    /// @param root Merkle root derived from the documented BookGuard proof format.
    /// @param metadataHash Keccak-256 hash of the canonical batch metadata JSON.
    /// @param observedFrom Inclusive UTC Unix timestamp for the batch observation window.
    /// @param observedTo Inclusive UTC Unix timestamp for the batch observation window.
    function anchorEvidenceRoot(bytes32 root, bytes32 metadataHash, uint64 observedFrom, uint64 observedTo) external {
        if (root == bytes32(0)) revert EmptyRoot();
        if (metadataHash == bytes32(0)) revert EmptyMetadataHash();
        if (observedFrom == 0) revert EmptyObservationStart();
        if (observedTo < observedFrom) revert InvalidObservationWindow();
        if (evidenceBatches[root].publisher != address(0)) revert EvidenceRootAlreadyAnchored();

        uint64 anchoredAt = uint64(block.timestamp);
        evidenceBatches[root] = EvidenceBatch({
            root: root,
            metadataHash: metadataHash,
            observedFrom: observedFrom,
            observedTo: observedTo,
            anchoredAt: anchoredAt,
            publisher: msg.sender
        });

        emit EvidenceRootAnchored(root, metadataHash, msg.sender, observedFrom, observedTo, anchoredAt);
    }

    /// @notice Returns an anchored batch or an empty struct when the root is unknown.
    function getEvidenceBatch(bytes32 root) external view returns (EvidenceBatch memory) {
        return evidenceBatches[root];
    }
}
