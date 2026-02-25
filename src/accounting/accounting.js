// Extracted business logic for testability
class AccountingSystem {
  constructor() {
    this.reset();
  }
  reset() {
    this.balance = 1000.00;
  }
  viewBalance() {
    return this.balance;
  }
  credit(amount) {
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      throw new Error('Invalid amount');
    }
    this.balance += amount;
    return this.balance;
  }
  debit(amount) {
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      throw new Error('Invalid amount');
    }
    if (this.balance >= amount) {
      this.balance -= amount;
      return { success: true, balance: this.balance };
    } else {
      return { success: false, message: 'Insufficient funds for this debit.', balance: this.balance };
    }
  }
}

module.exports = AccountingSystem;
