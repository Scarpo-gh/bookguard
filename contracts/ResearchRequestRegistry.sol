// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ResearchRequestRegistry
/// @notice Records non-custodial public commitments for prediction-market research requests.
/// @dev This contract holds no funds, does not broker work, resolve disputes, or validate research.
contract ResearchRequestRegistry {
    enum Status {
        None,
        Open,
        Withdrawn,
        Fulfilled
    }

    struct ResearchRequest {
        bytes32 requestHash;
        bytes32 scopeHash;
        bytes32 fulfillmentHash;
        uint64 createdAt;
        uint64 updatedAt;
        address requester;
        Status status;
    }

    error EmptyRequestHash();
    error EmptyScopeHash();
    error EmptyFulfillmentHash();
    error RequestAlreadyExists();
    error RequestNotFound();
    error UnauthorizedRequester();
    error InvalidStatusTransition();

    event ResearchRequestCreated(
        bytes32 indexed requestHash, bytes32 indexed scopeHash, address indexed requester, uint64 createdAt
    );
    event ResearchRequestWithdrawn(bytes32 indexed requestHash, address indexed requester, uint64 withdrawnAt);
    event ResearchRequestFulfilled(
        bytes32 indexed requestHash, bytes32 indexed fulfillmentHash, address indexed requester, uint64 fulfilledAt
    );

    mapping(bytes32 requestHash => ResearchRequest request) private requests;

    /// @notice Creates an open research-scope commitment without sending or holding ETH/tokens.
    function createRequest(bytes32 requestHash, bytes32 scopeHash) external {
        if (requestHash == bytes32(0)) revert EmptyRequestHash();
        if (scopeHash == bytes32(0)) revert EmptyScopeHash();
        if (requests[requestHash].requester != address(0)) revert RequestAlreadyExists();

        uint64 createdAt = uint64(block.timestamp);
        requests[requestHash] = ResearchRequest({
            requestHash: requestHash,
            scopeHash: scopeHash,
            fulfillmentHash: bytes32(0),
            createdAt: createdAt,
            updatedAt: createdAt,
            requester: msg.sender,
            status: Status.Open
        });
        emit ResearchRequestCreated(requestHash, scopeHash, msg.sender, createdAt);
    }

    /// @notice Allows only the requester to permanently withdraw an open request.
    function withdrawRequest(bytes32 requestHash) external {
        ResearchRequest storage request = _requireOpenRequester(requestHash);
        uint64 withdrawnAt = uint64(block.timestamp);
        request.status = Status.Withdrawn;
        request.updatedAt = withdrawnAt;
        emit ResearchRequestWithdrawn(requestHash, msg.sender, withdrawnAt);
    }

    /// @notice Allows only the requester to accept a fulfillment hash for an open request.
    /// @dev A contributor may deliver off-chain; requester acceptance prevents unsolicited fulfillment claims.
    function fulfillRequest(bytes32 requestHash, bytes32 fulfillmentHash) external {
        if (fulfillmentHash == bytes32(0)) revert EmptyFulfillmentHash();
        ResearchRequest storage request = _requireOpenRequester(requestHash);
        uint64 fulfilledAt = uint64(block.timestamp);
        request.fulfillmentHash = fulfillmentHash;
        request.status = Status.Fulfilled;
        request.updatedAt = fulfilledAt;
        emit ResearchRequestFulfilled(requestHash, fulfillmentHash, msg.sender, fulfilledAt);
    }

    /// @notice Returns a request lifecycle record, or an empty record when unknown.
    function getRequest(bytes32 requestHash) external view returns (ResearchRequest memory) {
        return requests[requestHash];
    }

    function _requireOpenRequester(bytes32 requestHash) private view returns (ResearchRequest storage request) {
        request = requests[requestHash];
        if (request.requester == address(0)) revert RequestNotFound();
        if (request.requester != msg.sender) revert UnauthorizedRequester();
        if (request.status != Status.Open) revert InvalidStatusTransition();
    }
}
