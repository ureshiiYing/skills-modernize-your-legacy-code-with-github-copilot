# Test Plan for COBOL Account Management App

This test plan documents test cases that validate the business logic and current implementation behavior of the COBOL app in `src/cobol/`.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View current balance | App compiled and running; initial runtime state | 1) Start app. 2) Enter `1` to View Balance. 3) Observe output. | Displays current balance initialized to 1000.00 (shown as `001000.00`). | | | Confirms default starting balance from working-storage. |
| TC-002 | Credit account (valid amount) | App running; balance = 1000.00 | 1) Start app. 2) Enter `2` to Credit. 3) When prompted, enter `50.00`. 4) View displayed new balance. | New balance equals 1050.00 and is displayed. | | | Validates ADD and WRITE flows with DataProgram. |
| TC-003 | Debit account (sufficient funds) | App running; balance >= debit amount | 1) Start app. 2) Enter `3` to Debit. 3) Enter `100.00` when prompted. 4) Observe new balance. | Balance reduced by 100.00 and displayed accordingly. | | | Verifies SUBTRACT and WRITE when funds suffice. |
| TC-004 | Debit account (insufficient funds) | App running; balance < debit amount | 1) Start app. 2) Enter `3` to Debit. 3) Enter an amount larger than current balance (e.g., 999999.99). 4) Observe output. | Displays message "Insufficient funds for this debit." No balance change. | | | Confirms enforcement of no-overdraft rule. |
| TC-005 | Credit then Debit sequence | App running; balance = 1000.00 | 1) Credit 200.00 via option `2`. 2) Debit 150.00 via option `3`. 3) View balance via option `1`. | Balance should be 1050.00 after sequence (1000+200-150). | | | Checks sequential read/write consistency within single run. |
| TC-006 | Persistence across runs | App compiled; not running | 1) Start app, view balance (expect 1000.00). 2) Credit 20.00 and exit. 3) Restart app and view balance. | Balance resets to initial 1000.00 (no persistence). | | | Confirms working-storage volatility and lack of persistence. |
| TC-007 | Input validation — non-numeric amount | App running | 1) Choose Credit or Debit. 2) When prompted, enter `abc` or malformed input. 3) Observe behavior/output. | Current implementation does not validate input: behavior may be undefined (likely rejects or treats as 0 depending on runtime). Document actual behavior here. | | | Recommend adding input validation in modernization. |
| TC-008 | Operation code spacing sensitivity | Call `Operations` program or simulate menu selections | 1) Ensure caller passes operation code shorter/longer or without expected trailing spaces (e.g., `TOTAL` vs `TOTAL `). 2) Observe which branches execute. | Application requires exact 6-character codes (space-padded). Mismatched codes will not invoke expected branch. | | | Highlights brittle fixed-width operation codes. |
| TC-009 | Upper limit numeric boundary (PIC overflow) | App running | 1) Attempt to credit an amount that causes balance > 999999.99 (PIC limit). 2) Observe behavior. | Behavior depends on runtime: may truncate, overflow, or raise an error. Document actual behavior. | | | Tests numeric field size limit `PIC 9(6)V99`. |
| TC-010 | Menu invalid choice handling | App running | 1) Enter menu option `9` or non-numeric choice. 2) Observe message and behavior. | Displays "Invalid choice, please select 1-4." and returns to menu. | | | Confirms menu input validation via `EVALUATE ... WHEN OTHER` branch. |

Notes for stakeholders:
- Use the "Actual Result" column to record observed behavior during stakeholder validation sessions.
- For `TC-007` and `TC-009`, the current COBOL code does not include defensive input validation; record observed runtime behavior and decide acceptance criteria.
- The test plan is intentionally agnostic to the COBOL runtime; when converting to Node.js, implement tests to assert deterministic behavior and to enforce stricter input validation, persistence, and numeric limits.
