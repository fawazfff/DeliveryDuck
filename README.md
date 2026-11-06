# 🦆 Delivery Duck

**Tiny duck. Big deliveries. A town that reacts.**

A cheerful 2D delivery game where a small duck carries goods between animal-run shops. Deliver flour to an empty bakery, bring its oven back to life, earn duck coins, and dress for the job.

## Play
- Move with **WASD** or **arrow keys**.
- Walk to the glowing pickup shop and press **E**.
- Follow the marker to the destination and press **E** again.
- Deliver three flour sacks to reopen Bunbury Bakery. Its oven lights up, bread appears, and customers fill the street.
- Spend duck coins on hats. Progress saves in this browser.
- Open **See economy** to inspect merchant stock, treasury, demand, prices and price explanations.
- Select **Run week** to simulate seven trading days in about a minute.

## Run locally
```bash
npm install
npm run dev
```
Build with `npm run build`.

## The economy
The economic simulation and pricing rule live in `src/game/merchantRules.ts`. Goods move from the pickup merchant's inventory into the destination merchant's inventory. The destination pays the delivery reward from its own treasury, and the origin receives a settlement share. Daily simulation restocks the mill and garden, sells market berries, consumes bakery flour to bake bread, changes demand, and pauses shops that run out of funds.

## NEAR integration
The `contract/` folder contains a Rust NEAR contract implementing a core NEP-245 item ledger prototype: mint, transfer, balances, supply, batch balance/supply views, token lookup, and NEP-245 event logs. Shared item IDs are `flour`, `bread`, `berries`, and `flowers`.

The browser can inspect balances from NEAR Testnet using public JSON-RPC view calls. Set `VITE_NEAR_MT_CONTRACT_ID` to a deployed contract account, then enter a NEAR account ID and choose **Inspect ledger**.

**Honest status:** contract source is included but not deployed by this repository. No social-login provider or relayer is configured. Until a contract ID is supplied, gameplay uses browser-local persistence. No wallet, signature, gas prompt, or seed phrase is required during normal gameplay. Local coins are not on-chain assets.

See [NEP-245](https://github.com/near/NEPs/blob/master/neps/nep-0245.md) and [GAME_DESIGN.md](./GAME_DESIGN.md).

## Track
NEAR HACKATHON · Games With Real Economies (`games`). Built around merchant inventories and treasuries, demand-driven prices, visible economic simulation, and NEP-245 item types.
 
## Player-owned market
The Duckling's Corner stall is a functioning player-owned market in the playable economy. Buy inventory from NPC shops using your coin balance, choose your own listing price, and let merchants buy automatically when your price is competitive with their stock, demand and wallet. Sales move goods into merchant inventories and coins from merchant treasuries into your wallet. Listings can be cancelled and returned to your backpack. These are local game-economy trades, not on-chain transactions.

## NEP-245 contract
The Rust contract uses the NEAR SDK Contract Tools MultiToken implementation rather than a hand-written partial interface. It exposes NEP-245 core multi-token methods, metadata, transfer and batch-transfer support through the derive implementation, and standard event handling. The game owner can mint and burn the four item types. Build with cargo-near from contract/ after installing Rust and cargo-near. Deploy only after configuring a funded NEAR Testnet deployer account. The app's RPC inspector reads mt_batch_balance_of from the deployed contract. Contract deployment and a live account are still required before on-chain balances can appear.

NEAR's published NEP-245 specification: https://github.com/near/NEPs/blob/master/neps/nep-0245.md. Contract implementation: https://github.com/near/near-sdk-contract-tools.
