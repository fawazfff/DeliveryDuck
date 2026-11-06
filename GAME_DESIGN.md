# Delivery Duck: Game Design

**Tiny duck. Big deliveries. A town that reacts.**

## Every 30 seconds
Accept the next request, collect a visible parcel, steer through town, avoid carts and customers, deliver it, and collect a reward. The parcel moves stock between merchant inventories, while the destination pays from its treasury.

## Every five minutes
The town market advances: merchants consume stock, restock, respond to demand, change prices, and may pause trading when their treasury runs low. The bakery turns flour into bread. Customers enter the street when the bakery reopens.

## Each session
Restore the bakery, unlock the player market stall, earn coins, buy a hat, and leave the town with healthier shops. Progress persists in the browser.

## Movement and collisions
A top-down 2D town. WASD or arrow keys move the duck, diagonal movement is normalized, buildings and map edges block movement, and carts/customers slow the duck on contact. Press E or the interaction button near a marked shop to pick up or deliver.

## Goods, payments, rewards
The origin merchant reserves one item. Successful delivery moves that item to the destination inventory. The destination pays the courier from its own treasury and the origin receives a settlement share. Flour delivered to the bakery fuels its oven; bread is produced and consumed by customers.

## Economic scene changes
The pricing authority is src/game/merchantRules.ts. Prices react to stock scarcity and demand. Tooltips explain each decision. Three flour deliveries light the bakery, start bread production, and add moving customers to the road. Fast-forward simulates seven trading days in sixty seconds.

## Architecture and milestones
1. React, TypeScript, Vite, Canvas town, controls and collisions.
2. Merchant inventories, treasuries, pricing, transfers and daily simulation.
3. Local save, bakery milestone, market stall and cosmetic hats.
4. NEP-245 Rust contract source and optional NEAR Testnet read-only ledger inspection.
5. Judge mode: seven economic days in one minute.

## Product boundary
The game works without a wallet or network. Local save is the playable profile. The NEAR contract is source code until deployed; the client only claims live ledger reads when a contract ID is configured. No wallet, gas, seed phrase, or signature is needed during normal play.