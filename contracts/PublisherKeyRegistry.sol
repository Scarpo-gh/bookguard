// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title PublisherKeyRegistry
/// @notice Publishes and rotates public signing-key discovery records for BookGuard publishers.
/// @dev Private keys, signatures, funds, orders, and trading logic never enter this contract.
contract PublisherKeyRegistry {
    struct PublisherKey {
        bytes32 keyId;
        bytes32 publicKeyHash;
        bytes32 supersededBy;
        uint64 registeredAt;
        uint64 supersededAt;
        uint64 revokedAt;
        address publisher;
        string uri;
    }

    error EmptyKeyId();
    error EmptyPublicKeyHash();
    error EmptyKeyUri();
    error PublisherAlreadyHasActiveKey();
    error PublisherHasNoActiveKey();
    error PublisherKeyAlreadyRegistered();

    event PublisherKeyRegistered(
        address indexed publisher, bytes32 indexed keyId, bytes32 indexed publicKeyHash, string uri, uint64 registeredAt
    );
    event PublisherKeyRotated(
        address indexed publisher, bytes32 indexed previousKeyId, bytes32 indexed newKeyId, uint64 rotatedAt
    );
    event PublisherKeyRevoked(address indexed publisher, bytes32 indexed keyId, uint64 revokedAt);

    mapping(address publisher => bytes32 keyId) private activeKeyIds;
    mapping(address publisher => mapping(bytes32 keyId => PublisherKey key)) private publisherKeys;

    /// @notice Registers a first or post-revocation public key for the calling publisher.
    function registerPublisherKey(bytes32 keyId, bytes32 publicKeyHash, string calldata uri) external {
        if (activeKeyIds[msg.sender] != bytes32(0)) revert PublisherAlreadyHasActiveKey();
        _registerKey(msg.sender, keyId, publicKeyHash, uri);
    }

    /// @notice Registers a successor key and makes it the caller's active discovery key.
    function rotatePublisherKey(bytes32 keyId, bytes32 publicKeyHash, string calldata uri) external {
        bytes32 previousKeyId = activeKeyIds[msg.sender];
        if (previousKeyId == bytes32(0)) revert PublisherHasNoActiveKey();

        uint64 rotatedAt = uint64(block.timestamp);
        PublisherKey storage previousKey = publisherKeys[msg.sender][previousKeyId];
        previousKey.supersededBy = keyId;
        previousKey.supersededAt = rotatedAt;

        _registerKey(msg.sender, keyId, publicKeyHash, uri);
        emit PublisherKeyRotated(msg.sender, previousKeyId, keyId, rotatedAt);
    }

    /// @notice Irreversibly revokes the caller's current key and clears active-key discovery.
    function revokeActiveKey() external {
        bytes32 keyId = activeKeyIds[msg.sender];
        if (keyId == bytes32(0)) revert PublisherHasNoActiveKey();

        uint64 revokedAt = uint64(block.timestamp);
        publisherKeys[msg.sender][keyId].revokedAt = revokedAt;
        activeKeyIds[msg.sender] = bytes32(0);
        emit PublisherKeyRevoked(msg.sender, keyId, revokedAt);
    }

    /// @notice Returns the current key ID for a publisher, or zero after revocation/no registration.
    function getActiveKeyId(address publisher) external view returns (bytes32) {
        return activeKeyIds[publisher];
    }

    /// @notice Returns one publisher-scoped public key record, or an empty record when unknown.
    function getPublisherKey(address publisher, bytes32 keyId) external view returns (PublisherKey memory) {
        return publisherKeys[publisher][keyId];
    }

    function _registerKey(address publisher, bytes32 keyId, bytes32 publicKeyHash, string calldata uri) private {
        if (keyId == bytes32(0)) revert EmptyKeyId();
        if (publicKeyHash == bytes32(0)) revert EmptyPublicKeyHash();
        if (bytes(uri).length == 0) revert EmptyKeyUri();
        if (publisherKeys[publisher][keyId].publisher != address(0)) revert PublisherKeyAlreadyRegistered();

        uint64 registeredAt = uint64(block.timestamp);
        publisherKeys[publisher][keyId] = PublisherKey({
            keyId: keyId,
            publicKeyHash: publicKeyHash,
            supersededBy: bytes32(0),
            registeredAt: registeredAt,
            supersededAt: 0,
            revokedAt: 0,
            publisher: publisher,
            uri: uri
        });
        activeKeyIds[publisher] = keyId;

        emit PublisherKeyRegistered(publisher, keyId, publicKeyHash, uri, registeredAt);
    }
}
