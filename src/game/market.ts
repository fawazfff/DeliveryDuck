import {quotePrice, type Merchant} from './merchantRules';
export type MarketListing={id:string;good:string;quantity:number;price:number;createdDay:number};
export type TradeEvent={day:number;message:string;amount:number};
export const marketGoods=['flour','bread','berries','flowers'] as const;
export function bestOffer(merchants:Merchant[],good:string){return merchants.filter(m=>m.open&&(m.stock[good]??0)>0&&m.base[good]!==undefined).map(m=>({merchant:m,price:quotePrice(m,good).price})).sort((a,b)=>a.price-b.price)[0]??null;}
export function buyFromTown(merchants:Merchant[],inventory:Record<string,number>,coins:number,good:string,quantity:number){
 if(!Number.isInteger(quantity)||quantity<1||quantity>20)throw new Error('Choose between 1 and 20 items.');
 const offer=bestOffer(merchants,good);if(!offer)throw new Error('No shop has this item in stock.');
 const total=offer.price*quantity;if(coins<total)throw new Error('Not enough duck coins for this purchase.');
 if((offer.merchant.stock[good]??0)<quantity)throw new Error(offer.merchant.name+' does not have that many in stock.');
 return {coins:coins-total,inventory:{...inventory,[good]:(inventory[good]??0)+quantity},merchants:merchants.map(m=>m.id===offer.merchant.id?{...m,stock:{...m.stock,[good]:m.stock[good]-quantity},treasury:m.treasury+total,demand:Math.max(.5,m.demand-.015)}:m),event:{message:'Bought '+quantity+' '+good+' from '+offer.merchant.name+' for '+total+' coins.',amount:-total}};
}
export function createListing(listings:MarketListing[],inventory:Record<string,number>,good:string,quantity:number,price:number,day:number){
 if(!Number.isInteger(quantity)||quantity<1)throw new Error('Listing quantity must be at least one.');
 if(!Number.isInteger(price)||price<1||price>500)throw new Error('Set a price between 1 and 500 coins.');
 if((inventory[good]??0)<quantity)throw new Error('You do not have enough items in your backpack.');
 return {inventory:{...inventory,[good]:inventory[good]-quantity},listings:[...listings,{id:crypto.randomUUID(),good,quantity,price,createdDay:day}]};
}
export function cancelListing(listings:MarketListing[],inventory:Record<string,number>,id:string){const listing=listings.find(l=>l.id===id);if(!listing)return {listings,inventory};return {listings:listings.filter(l=>l.id!==id),inventory:{...inventory,[listing.good]:(inventory[listing.good]??0)+listing.quantity}};}
export function settleMarketDay(merchants:Merchant[],listings:MarketListing[],coins:number,day:number){
 let nextMerchants=merchants.map(m=>({...m,stock:{...m.stock}})),nextListings=listings.map(l=>({...l}));let earned=0;const events:TradeEvent[]=[];
 for(const listing of nextListings){for(const buyer of nextMerchants){if(listing.quantity<=0||!buyer.open||buyer.base[listing.good]===undefined)continue;const stock=buyer.stock[listing.good]??0;const willingness=quotePrice(buyer,listing.good).price;const budgetQty=Math.floor(buyer.treasury/listing.price);const demandQty=Math.max(0,Math.round((buyer.demand-.55)*2));const targetStock=listing.good==='flowers'?10:listing.good==='bread'?7:listing.good==='flour'?6:8;const wanted=Math.max(0,Math.min(targetStock-stock,demandQty,budgetQty,listing.quantity));if(wanted===0||listing.price>willingness)continue;const paid=wanted*listing.price;listing.quantity-=wanted;earned+=paid;nextMerchants=nextMerchants.map(m=>m.id===buyer.id?{...m,stock:{...m.stock,[listing.good]:(m.stock[listing.good]??0)+wanted},treasury:m.treasury-paid,demand:Math.min(1.8,m.demand+.04)}:m);events.push({day,amount:paid,message:buyer.name+' bought '+wanted+' '+listing.good+' from your stall for '+paid+' coins.'});}}
 return {merchants:nextMerchants,listings:nextListings.filter(l=>l.quantity>0),coins:coins+earned,events,earned};
}
