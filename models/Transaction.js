class Transaction {
  constructor({
    id,
    amount,
    categoryId,
    walletId,
    date,
    title,
    description = "",
    type, // "expense", "income", or "transfer" (required)
  }) {
    this.id = id;
    this.amount = amount;
    this.categoryId = categoryId;
    this.walletId = walletId;
    this.date = date;
    this.title = title;
    this.description = description;
    this.type = type;
  }
}

export default Transaction;
