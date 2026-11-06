use near_sdk::{env, near, AccountId, NearToken, PanicOnDefault};
use near_sdk::collections::LookupMap;
use near_sdk::json_types::U128;
use near_sdk::serde_json::{json, Value};
use std::collections::HashMap;
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct DeliveryDuckItems { owner_id:AccountId, balances:LookupMap<String,HashMap<AccountId,u128>>, supplies:LookupMap<String,u128>, metadata:LookupMap<String,String> }
#[near]
impl DeliveryDuckItems {
 #[init] pub fn new(owner_id:AccountId)->Self{Self{owner_id,balances:LookupMap::new(b'b'),supplies:LookupMap::new(b's'),metadata:LookupMap::new(b'm')}}
 #[payable] pub fn mt_mint(&mut self,account_id:AccountId,token_id:String,amount:U128){self.assert_owner();assert_eq!(env::attached_deposit(),NearToken::from_yoctonear(1),"Attach 1 yoctoNEAR");assert!(amount.0>0);let mut owners=self.balances.get(&token_id).unwrap_or_default();let b=owners.entry(account_id.clone()).or_insert(0);*b=b.checked_add(amount.0).expect("Balance overflow");self.balances.insert(&token_id,&owners);let supply=self.supplies.get(&token_id).unwrap_or(0);self.supplies.insert(&token_id,&(supply+amount.0));self.metadata.insert(&token_id,&token_id);Self::emit("mt_mint",json!([{"owner_id":account_id,"token_ids":[token_id],"amounts":[amount.0.to_string()]}]));}
 #[payable] pub fn mt_transfer(&mut self,receiver_id:AccountId,token_id:String,amount:U128,memo:Option<String>){assert_eq!(env::attached_deposit(),NearToken::from_yoctonear(1),"Attach exactly 1 yoctoNEAR");let sender=env::predecessor_account_id();let mut owners=self.balances.get(&token_id).unwrap_or_default();let balance=owners.get(&sender).copied().unwrap_or(0);assert!(balance>=amount.0,"Insufficient item balance");owners.insert(sender.clone(),balance-amount.0);let next=owners.get(&receiver_id).copied().unwrap_or(0).checked_add(amount.0).expect("Balance overflow");owners.insert(receiver_id.clone(),next);self.balances.insert(&token_id,&owners);Self::emit("mt_transfer",json!([{"old_owner_id":sender,"new_owner_id":receiver_id,"token_ids":[token_id],"amounts":[amount.0.to_string()],"memo":memo}]));}
 pub fn mt_balance_of(&self,account_id:AccountId,token_id:String)->U128{U128(self.balances.get(&token_id).and_then(|m|m.get(&account_id).copied()).unwrap_or(0))}
 pub fn mt_batch_balance_of(&self,account_id:AccountId,token_ids:Vec<String>)->Vec<U128>{token_ids.into_iter().map(|id|self.mt_balance_of(account_id.clone(),id)).collect()}
 pub fn mt_supply(&self,token_id:String)->Option<U128>{self.supplies.get(&token_id).map(U128)}
 pub fn mt_batch_supply(&self,token_ids:Vec<String>)->Vec<Option<U128>>{token_ids.into_iter().map(|id|self.mt_supply(id)).collect()}
 pub fn mt_token(&self,token_ids:Vec<String>)->Vec<Option<Value>>{token_ids.into_iter().map(|id|if self.supplies.get(&id).is_some(){Some(json!({"token_id":id,"owner_id":null}))}else{None}).collect()}
 pub fn mt_metadata(&self,token_id:String)->Option<String>{self.metadata.get(&token_id)}
 fn assert_owner(&self){assert_eq!(env::predecessor_account_id(),self.owner_id,"Only contract owner");}
 fn emit(event:&str,data:Value){env::log_str(&format!("EVENT_JSON:{}",json!({"standard":"nep245","version":"1.0.0","event":event,"data":data})));}
}
