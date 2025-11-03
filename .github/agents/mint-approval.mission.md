# mint-approval.mission.md
# Agent: Mint Approval Agent
# Purpose: Verify mint preconditions, coordinate credit burn (or admin signature), and submit mint transaction on testnet.

agent: mint-approval
version: 1.0
roles: [contract, ops, admin]
tools: [Hardhat, Ethers.js, OpenZeppelin]
outputs:
  - mint_tx.json
  - tx_receipt

## Task
1. Input:
   - manifest_cid (IPFS metadata)
   - card_id, credits_required
   - admin_approval_signature (EIP-712) OR credit token balance check
2. Checks:
   - Confirm metadata `QC:approved`.
   - Confirm `ad_anchor_cid` present if campaign requires ad placement.
   - Confirm `isrc` and `samro` fields present when audio included.
   - Verify minter wallet has credits or admin signature present.
3. Actions:
   - If credits: call CreditToken.burnForMint(minter, credits); call NFTCollection.mintWithCredit(minter, manifest_cid, adminSigOptional).
   - If signature: call NFTCollection.mintWithSignature(minter, manifest_cid, adminSig).
4. Human-in-loop:
   - Admin must confirm and sign via multisig before production mainnet mint.
5. Output:
   - Save `mint_tx.json` and `tx_receipt` to `/data/mints/{card_id}/`.

Acceptance:
- Token minted on testnet; receipt logged; indexer picks event for dashboard.
