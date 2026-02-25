#!/usr/bin/env node
/**
 * Node.js rewrite of COBOL Account Management System
 * Preserves business logic, menu, and data flow from COBOL sources.
 */
const readline = require('readline');

// In-memory balance (volatile, like COBOL WORKING-STORAGE)
let balance = 1000.00;

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
  process.stdout.write('Enter your choice (1-4): ');
}

function viewBalance() {
  // Mimic COBOL's zero-padded output
  console.log(`Current balance: ${balance.toFixed(2).padStart(9, '0')}`);
}

function creditAccount(rl, callback) {
  rl.question('Enter credit amount: ', (input) => {
    const amount = parseFloat(input);
    if (isNaN(amount) || amount < 0) {
      console.log('Invalid amount.');
      callback();
      return;
    }
    balance += amount;
    console.log(`Amount credited. New balance: ${balance.toFixed(2).padStart(9, '0')}`);
    callback();
  });
}

function debitAccount(rl, callback) {
  rl.question('Enter debit amount: ', (input) => {
    const amount = parseFloat(input);
    if (isNaN(amount) || amount < 0) {
      console.log('Invalid amount.');
      callback();
      return;
    }
    if (balance >= amount) {
      balance -= amount;
      console.log(`Amount debited. New balance: ${balance.toFixed(2).padStart(9, '0')}`);
    } else {
      console.log('Insufficient funds for this debit.');
    }
    callback();
  });
}

function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let continueFlag = true;

  function loop() {
    if (!continueFlag) {
      console.log('Exiting the program. Goodbye!');
      rl.close();
      return;
    }
    displayMenu();
    rl.question('', (choice) => {
      switch (choice.trim()) {
        case '1':
          viewBalance();
          loop();
          break;
        case '2':
          creditAccount(rl, loop);
          break;
        case '3':
          debitAccount(rl, loop);
          break;
        case '4':
          continueFlag = false;
          loop();
          break;
        default:
          console.log('Invalid choice, please select 1-4.');
          loop();
      }
    });
  }
  loop();
}

if (require.main === module) {
  main();
}
