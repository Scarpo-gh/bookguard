// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title PolicyVersionRegistry
/// @notice Records immutable content hashes for publisher-owned policy versions.
/// @dev This contract stores provenance metadata only. It does not evaluate a policy,
///      validate external data, custody funds, route orders, or make trading decisions.
contract PolicyVersionRegistry {
    struct PolicyVersion {
        bytes32 contentHash;
        address publisher;
        uint64 publishedAt;
    }

    error EmptyPolicyId();
    error EmptyPolicyVersion();
    error EmptyContentHash();
    error PolicyVersionAlreadyRegistered();
    error UnauthorizedPolicyPublisher();

    event PolicyVersionRegistered(
        bytes32 indexed policyId,
        uint64 indexed version,
        bytes32 indexed contentHash,
        address publisher,
        uint64 publishedAt
    );

    mapping(bytes32 policyId => address publisher) private policyPublishers;
    mapping(bytes32 policyId => mapping(uint64 version => PolicyVersion policyVersion)) private policyVersions;

    /// @notice Claims a policy namespace on first use and records an immutable version.
    /// @dev Policy IDs should be globally unique and publisher-scoped off-chain, for example
    ///      a hash of the publisher address and a human-readable policy slug.
    function registerPolicyVersion(bytes32 policyId, uint64 version, bytes32 contentHash) external {
        if (policyId == bytes32(0)) revert EmptyPolicyId();
        if (version == 0) revert EmptyPolicyVersion();
        if (contentHash == bytes32(0)) revert EmptyContentHash();

        address publisher = policyPublishers[policyId];
        if (publisher == address(0)) {
            policyPublishers[policyId] = msg.sender;
            publisher = msg.sender;
        } else if (publisher != msg.sender) {
            revert UnauthorizedPolicyPublisher();
        }

        if (policyVersions[policyId][version].publisher != address(0)) {
            revert PolicyVersionAlreadyRegistered();
        }

        uint64 publishedAt = uint64(block.timestamp);
        policyVersions[policyId][version] =
            PolicyVersion({contentHash: contentHash, publisher: publisher, publishedAt: publishedAt});

        emit PolicyVersionRegistered(policyId, version, contentHash, publisher, publishedAt);
    }

    /// @notice Returns the first publisher that claimed a policy namespace.
    function getPolicyPublisher(bytes32 policyId) external view returns (address) {
        return policyPublishers[policyId];
    }

    /// @notice Returns a registered policy version or an empty struct when it does not exist.
    function getPolicyVersion(bytes32 policyId, uint64 version) external view returns (PolicyVersion memory) {
        return policyVersions[policyId][version];
    }
}
