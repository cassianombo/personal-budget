import { WALLET_TYPE } from "../constants/walletTypes";

class Wallet {
  constructor({
    id,
    name,
    balance = 0,
    icon = null,
    background = null,
    type = WALLET_TYPE.DEBIT,
  }) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.icon = icon;
    this.background = background;
    this.type = type;
  }
}

export default Wallet;
