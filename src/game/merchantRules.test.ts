import {describe,it,expect} from 'vitest';
import {createTown,quotePrice,simulateDay} from './merchantRules';
import {buyFromTown,createListing,settleMarketDay} from './market';
describe('Delivery Duck town economy',()=>{
 it('prices scarce stock above abundant stock',()=>{const m=createTown()[0];const scarce={...m,stock:{flour:1}};const full={...m,stock:{flour:18}};expect(quotePrice(scarce,'flour').price).toBeGreaterThan(quotePrice(full,'flour').price);});
 it('moves a purchase into the player backpack and merchant treasury',()=>{const town=createTown();const result=buyFromTown(town,{},100,'berries',2);expect(result.inventory.berries).toBe(2);expect(result.coins).toBeLessThan(100);expect(result.merchants.find(m=>m.id==='market')!.treasury).toBeGreaterThan(155);});
 it('rejects listings when the player lacks inventory',()=>{expect(()=>createListing([],{},'bread',1,10,1)).toThrow();});
 it('settles affordable NPC purchases into player coins',()=>{const town=createTown().map(m=>m.id==='market'?{...m,stock:{...m.stock,berries:0},demand:1.7,treasury:100}:m);const result=settleMarketDay(town,[{id:'x',good:'berries',quantity:2,price:5,createdDay:1}],0,2);expect(result.earned).toBeGreaterThan(0);expect(result.listings.length).toBeLessThan(1);});
 it('advances town stocks and event log',()=>{const result=simulateDay(createTown(),2);expect(result.merchants.find(m=>m.id==='mill')!.stock.flour).toBe(16);expect(result.events.length).toBeGreaterThan(0);});
});
