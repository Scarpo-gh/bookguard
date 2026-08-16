// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../EvidenceRootAnchor.sol";

interface Vm {
    function prank(address msgSender) external;
}

contract EvidenceRootAnchorTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    EvidenceRootAnchor private anchor;

    address private constant PUBLISHER = address(0xA11CE);
    bytes32 private constant ROOT = keccak256("bookguard:evidence-root/v1:batch-001");
    bytes32 private constant METADATA_HASH = keccak256("bookguard:evidence-metadata/v1:batch-001");
    uint64 private constant OBSERVED_FROM = 1_786_800_000;
    uint64 private constant OBSERVED_TO = 1_786_803_600;

    function setUp() public {
        anchor = new EvidenceRootAnchor();
    }

    function testAnchorEvidenceRootBindsBatchEvidence() public {
        vm.prank(PUBLISHER);
        anchor.anchorEvidenceRoot(ROOT, METADATA_HASH, OBSERVED_FROM, OBSERVED_TO);

        EvidenceRootAnchor.EvidenceBatch memory batch = anchor.getEvidenceBatch(ROOT);
        _assertEq(batch.root, ROOT, "root must be retained");
        _assertEq(batch.metadataHash, METADATA_HASH, "metadata hash must be retained");
        _assertEq(batch.observedFrom, OBSERVED_FROM, "observation start must be retained");
        _assertEq(batch.observedTo, OBSERVED_TO, "observation end must be retained");
        _assertEq(batch.publisher, PUBLISHER, "publisher must be retained");
        _assertTrue(batch.anchoredAt > 0, "anchor time must be retained");
    }

    function testAnchorEvidenceRootRejectsDuplicateRoot() public {
        anchor.anchorEvidenceRoot(ROOT, METADATA_HASH, OBSERVED_FROM, OBSERVED_TO);

        (bool ok,) = address(anchor)
            .call(
                abi.encodeWithSignature(
                    "anchorEvidenceRoot(bytes32,bytes32,uint64,uint64)", ROOT, METADATA_HASH, OBSERVED_FROM, OBSERVED_TO
                )
            );

        _assertTrue(!ok, "an evidence root may only be anchored once");
    }

    function testAnchorEvidenceRootRejectsMissingRootMetadataOrObservationWindow() public {
        (bool emptyRoot,) = address(anchor)
            .call(
                abi.encodeWithSignature(
                    "anchorEvidenceRoot(bytes32,bytes32,uint64,uint64)",
                    bytes32(0),
                    METADATA_HASH,
                    OBSERVED_FROM,
                    OBSERVED_TO
                )
            );
        _assertTrue(!emptyRoot, "root is required");

        (bool emptyMetadata,) = address(anchor)
            .call(
                abi.encodeWithSignature(
                    "anchorEvidenceRoot(bytes32,bytes32,uint64,uint64)", ROOT, bytes32(0), OBSERVED_FROM, OBSERVED_TO
                )
            );
        _assertTrue(!emptyMetadata, "metadata hash is required");

        (bool emptyObservationStart,) = address(anchor)
            .call(
                abi.encodeWithSignature(
                    "anchorEvidenceRoot(bytes32,bytes32,uint64,uint64)", ROOT, METADATA_HASH, 0, OBSERVED_TO
                )
            );
        _assertTrue(!emptyObservationStart, "observation start is required");

        (bool invertedWindow,) = address(anchor)
            .call(
                abi.encodeWithSignature(
                    "anchorEvidenceRoot(bytes32,bytes32,uint64,uint64)", ROOT, METADATA_HASH, OBSERVED_TO, OBSERVED_FROM
                )
            );
        _assertTrue(!invertedWindow, "observation end must not precede start");
    }

    function _assertEq(bytes32 actual, bytes32 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(address actual, address expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertEq(uint64 actual, uint64 expected, string memory message) private pure {
        if (actual != expected) revert(message);
    }

    function _assertTrue(bool condition, string memory message) private pure {
        if (!condition) revert(message);
    }
}
