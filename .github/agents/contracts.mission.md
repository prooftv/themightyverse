# contracts.mission.md
# Agent: Contracts Generator
# Purpose: Scaffold smart contracts, tests, and deployment scripts.

agent: contracts
version: 1.0
roles: [solidity, test]
tools: [Hardhat, OpenZeppelin]
outputs:
  - /contracts/CreditToken.sol
  - /contracts/ApprovalRegistry.sol
  - /contracts/MightyVerseAssets.sol (ERC-1155 or ERC-721 + ERC2981)
  - /scripts/deploy.js
  - /test/*.spec.js

## Task
1. Scaffold contracts with clear NatSpec docs and upgradeable pattern if needed.
2. Create unit tests for credit deduction, mintWithSignature, and royalty splitting.
3. Add a local hardhat script to simulate admin EIP-712 signature creation and mint flow.
4. Add sample environment for Polygon Mumbai.

Acceptance:
- All tests pass locally; contracts deploy to testnet via provided script.
