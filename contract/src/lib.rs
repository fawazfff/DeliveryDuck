use near_sdk::{env, near, AccountId, PanicOnDefault};
use near_sdk::json_types::U128;
use near_sdk_contract_tools::mt::*;

#[derive(PanicOnDefault, MultiToken)]
#[near(contract_state)]
pub struct DeliveryDuckItems { owner_id: AccountId }

#[near]
impl DeliveryDuckItems {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        let mut contract = Self { owner_id };
        contract.set_contract_metadata(&nep245::metadata::ContractMetadata::new("Delivery Duck Items"));
        for token_id in ["flour", "bread", "berries", "flowers"] {
            contract.create_token(token_id.to_string()).unwrap_or_else(|e| env::panic_str(&e.to_string()));
        }
        contract
    }

    /// Owner-controlled minting for rewards and initial merchant inventories.
    pub fn mint(&mut self, account_id: AccountId, token_id: String, amount: U128) {
        self.assert_owner();
        assert!(amount.0 > 0, "Amount must be positive");
        if self.token(&token_id).is_none() {
            self.create_token(token_id.clone()).unwrap_or_else(|e| env::panic_str(&e.to_string()));
        }
        Nep245Controller::mint(self, &Nep245Mint::single(token_id, amount.0, account_id))
            .unwrap_or_else(|e| env::panic_str(&e.to_string()));
    }

    /// Owner-controlled burn for expired quest items or controlled supply changes.
    pub fn burn(&mut self, account_id: AccountId, token_id: String, amount: U128) {
        self.assert_owner();
        assert!(amount.0 > 0, "Amount must be positive");
        Nep245Controller::burn(self, &Nep245Burn::single(token_id, amount.0, account_id))
            .unwrap_or_else(|e| env::panic_str(&e.to_string()));
    }

    fn assert_owner(&self) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only the game owner can mint or burn");
    }
}
