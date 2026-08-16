# PublisherKeyRegistry

`PublisherKeyRegistry` is BookGuard's planned fourth Base Mainnet contract. It publishes a publisher-scoped discovery record for public receipt/policy/evidence signing keys, plus explicit rotation and revocation state.

> **Deployment status:** Implemented and locally tested; **not deployed**. No contract address, transaction, or wallet approval exists yet.

## Product boundary

A BookGuard consumer needs a public place to discover which public key a publisher declares active for a given signing role. The registry records the key identifier, a hash of its exact public-key representation, and a public URI where that representation can be retrieved.

It does **not** store private keys, sign data, verify cryptographic signatures, custody funds, route orders, manage tokens, or decide whether a receipt is true. Consumers must separately verify signatures with an appropriate off-chain cryptography implementation.

## Key lifecycle

Each publisher owns its own key-ID namespace.

1. `registerPublisherKey(keyId, publicKeyHash, uri)` records the first active key, or a new key after an earlier revocation.
2. `rotatePublisherKey(keyId, publicKeyHash, uri)` records a successor, marks the old active key with `supersededBy` and `supersededAt`, then makes the successor active.
3. `revokeActiveKey()` irreversibly marks the active key revoked and clears active-key discovery.

A key ID can never be reused inside the same publisher namespace. The same key ID may be used independently by another publisher address.

## On-chain record

```text
PublisherKey {
  keyId          bytes32
  publicKeyHash  bytes32
  supersededBy   bytes32
  registeredAt   uint64
  supersededAt   uint64
  revokedAt      uint64
  publisher      address
  uri            string
}
```

`getActiveKeyId(publisher)` returns the active key ID or zero when none is currently active. `getPublisherKey(publisher, keyId)` returns the immutable public discovery record plus lifecycle timestamps.

## Off-chain helper

`web/publisher-key.mjs` provides dependency-free utilities:

- canonical publisher-scoped `keyId` from publisher address and key slug;
- keccak-256 hash of the exact public-key representation;
- ABI-encoded wallet calldata for register, rotate, and revoke operations;
- exact public-key representation ↔ `publicKeyHash` comparison.

The v1 namespace is:

```text
keyId = keccak256("bookguard:publisher-key/v1:" + lowercasePublisher + ":" + normalizedSlug)
publicKeyHash = keccak256(exact UTF-8 public key representation)
```

## Local validation

```bash
PATH="$HOME/.local/bin:$PATH" forge test --match-contract PublisherKeyRegistryTest -vv
node --test web/test/publisher-key.test.mjs
```

## Mainnet deployment gate

Before any broadcast: run full tests and format checks, generate an exact bytecode/gas preview, then inspect a wallet-controlled Base Mainnet confirmation that shows the intended signer, a new contract deployment, `0 ETH` value, and acceptable gas. After explicit approval: deploy, verify source on BaseScan, record the transaction/address in `DEPLOYMENTS.md`, then refresh Guild Verify.
