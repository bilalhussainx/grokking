import { Module } from "../types";

export const atmSystemModule: Module = {
  id: "ood-atm",
  title: "Design an ATM System",
  description: "Design an ATM system using the State design pattern to manage transaction flows, account operations, and cash dispensing.",
  lessons: [
    {
      id: "atm-requirements",
      slug: "atm-requirements",
      title: "Requirements & Use Cases",
      content: `# ATM System — Requirements & Use Cases

## Problem Statement

Design an Automated Teller Machine (ATM) system that handles user authentication, balance inquiries, cash withdrawals, deposits, and transfers. The system should manage multiple account types and handle concurrent access safely.

## Actors

| Actor | Description |
|---|---|
| **Customer** | Bank account holder who uses the ATM |
| **Bank System** | Backend that validates accounts and processes transactions |
| **Operator** | Maintains the ATM hardware and cash supply |

## Core Use Cases

1. **Authenticate** — Insert card, enter PIN, verify with bank
2. **Check Balance** — Display current account balance
3. **Withdraw Cash** — Dispense cash, update balance, print receipt
4. **Deposit** — Accept cash/check deposits
5. **Transfer Funds** — Move money between accounts
6. **Session Management** — Handle timeouts, card ejection, receipt printing

## Key Design Considerations

- **State management** — The ATM transitions through distinct states (idle → card inserted → authenticated → transaction → complete)
- **Transaction atomicity** — Withdrawals must be all-or-nothing: don't debit the account if cash can't be dispensed
- **Cash inventory** — Track denominations available and handle "insufficient cash" scenarios
- **Security** — PIN validation, session timeouts, card retention after failed attempts
- **Concurrency** — Only one customer uses the ATM at a time, but multiple ATMs access the same bank system

## Constraints

- Maximum 3 PIN attempts before card retention
- Daily withdrawal limit per account
- ATM has finite cash in specific denominations (e.g., $20, $50, $100)
- Receipts are optional but must be offered`,
    },
    {
      id: "atm-class-diagram",
      slug: "atm-class-diagram",
      title: "Class Diagram & State Machine",
      content: `# ATM System — Class Diagram & State Machine

## Core Classes

\`\`\`
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│    ATM       │────▶│ CardReader   │     │ CashDispenser│
│─────────────│     │──────────────│     │──────────────│
│ atm_id      │     │ read_card()  │     │ denominations│
│ location    │     │ eject_card() │     │ dispense()   │
│ state       │     │ retain_card()│     │ has_enough() │
│─────────────│     └──────────────┘     └──────────────┘
│ authenticate│
│ select_txn()│     ┌──────────────┐     ┌──────────────┐
│ end_session()│    │   Screen     │     │   Keypad     │
└─────────────┘     │──────────────│     │──────────────│
       │            │ show_message()│    │ get_input()  │
       ▼            │ show_menu()  │     │ get_pin()    │
┌─────────────┐     └──────────────┘     └──────────────┘
│ ATMState    │
│ (abstract)  │◀──── IdleState, CardInsertedState,
│─────────────│      AuthenticatedState, TransactionState
│ handle()    │
└─────────────┘

┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Account   │     │  Transaction │     │     Card     │
│─────────────│     │──────────────│     │──────────────│
│ account_num │     │ txn_id       │     │ card_number  │
│ balance     │     │ type         │     │ expiry       │
│ account_type│     │ amount       │     │ pin_hash     │
│─────────────│     │ timestamp    │     │ account      │
│ withdraw()  │     │ status       │     └──────────────┘
│ deposit()   │     └──────────────┘
│ get_balance()│
└─────────────┘
\`\`\`

## State Machine

The ATM is a classic application of the **State design pattern**:

\`\`\`
                 insert card         PIN correct
  ┌────────┐  ─────────────▶  ┌──────────┐  ───────────▶  ┌───────────────┐
  │  IDLE  │                  │  HAS_CARD │                │ AUTHENTICATED │
  └────────┘  ◀─────────────  └──────────┘                └───────────────┘
                 eject/timeout    │ 3 fails                     │
                                 ▼                              ▼
                           ┌──────────┐                  ┌─────────────┐
                           │ CARD_HELD│                  │ TRANSACTION │
                           └──────────┘                  └─────────────┘
                                                              │
                                                              ▼ complete
                                                         ┌──────────┐
                                                         │ COMPLETE │──▶ IDLE
                                                         └──────────┘
\`\`\`

## Key Relationships

- **ATM** has-a CardReader, CashDispenser, Screen, Keypad, and ATMState
- **ATM** delegates behavior to its current **ATMState**
- **Transaction** references an **Account** and records the operation
- **Card** maps to an **Account** via the bank system`,
    },
    {
      id: "atm-implementation",
      slug: "atm-implementation",
      title: "Implementation",
      content: `# ATM System — Implementation

## Core Implementation

Implement the ATM system using the State pattern. The ATM delegates all behavior to its current state object, and state transitions happen by replacing the state.

### Key Design Decisions

1. **State pattern** — Each ATM state is a separate class with its own \`handle()\` logic
2. **Strategy for cash dispensing** — Use a greedy algorithm to dispense largest denominations first
3. **Transaction log** — Every operation creates a Transaction record for audit
4. **PIN hashing** — Store hashed PINs, not plaintext`,
      starterCode: `from enum import Enum
from abc import ABC, abstractmethod
from datetime import datetime
import hashlib

# ─── Enums ───────────────────────────────────────────────
class TransactionType(Enum):
    WITHDRAWAL = "withdrawal"
    DEPOSIT = "deposit"
    BALANCE_INQUIRY = "balance_inquiry"
    TRANSFER = "transfer"

class TransactionStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class AccountType(Enum):
    CHECKING = "checking"
    SAVINGS = "savings"

# ─── Account ─────────────────────────────────────────────
class Account:
    def __init__(self, account_num, balance, account_type, daily_limit=1000):
        self.account_num = account_num
        self.balance = balance
        self.account_type = account_type
        self.daily_limit = daily_limit
        self.withdrawn_today = 0

    # TODO: Implement withdraw(amount) — check balance and daily limit
    # TODO: Implement deposit(amount)
    # TODO: Implement get_balance()

# ─── Card ────────────────────────────────────────────────
class Card:
    def __init__(self, card_number, pin, account):
        self.card_number = card_number
        self.pin_hash = hashlib.sha256(pin.encode()).hexdigest()
        self.account = account

    # TODO: Implement verify_pin(pin)

# ─── CashDispenser ───────────────────────────────────────
class CashDispenser:
    def __init__(self):
        self.denominations = {100: 50, 50: 100, 20: 200}  # denomination: count

    # TODO: Implement has_enough(amount) — check if ATM can dispense
    # TODO: Implement dispense(amount) — greedy: largest bills first

# ─── Transaction ─────────────────────────────────────────
class Transaction:
    _counter = 0
    def __init__(self, txn_type, amount, account):
        Transaction._counter += 1
        self.txn_id = Transaction._counter
        # TODO: Complete initialization

# ─── ATM State (State Pattern) ───────────────────────────
class ATMState(ABC):
    @abstractmethod
    def handle(self, atm):
        pass

# TODO: Implement IdleState
# TODO: Implement HasCardState
# TODO: Implement AuthenticatedState

# ─── ATM ─────────────────────────────────────────────────
class ATM:
    def __init__(self, atm_id, location):
        self.atm_id = atm_id
        self.location = location
        self.cash_dispenser = CashDispenser()
        self.current_card = None
        self.pin_attempts = 0
        self.state = None  # TODO: Set initial state
        self.transactions = []

    # TODO: Implement insert_card(card)
    # TODO: Implement enter_pin(pin)
    # TODO: Implement withdraw(amount)
    # TODO: Implement check_balance()
    # TODO: Implement end_session()

# ─── Test ────────────────────────────────────────────────
account = Account("1234567890", 5000, AccountType.CHECKING)
card = Card("4111111111111111", "1234", account)
atm = ATM("ATM-001", "Main Street Branch")

# Test: insert card, authenticate, check balance, withdraw
print("Testing ATM System...")
`,
      solutionCode: `from enum import Enum
from abc import ABC, abstractmethod
from datetime import datetime
import hashlib

class TransactionType(Enum):
    WITHDRAWAL = "withdrawal"
    DEPOSIT = "deposit"
    BALANCE_INQUIRY = "balance_inquiry"
    TRANSFER = "transfer"

class TransactionStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class AccountType(Enum):
    CHECKING = "checking"
    SAVINGS = "savings"

class Account:
    def __init__(self, account_num, balance, account_type, daily_limit=1000):
        self.account_num = account_num
        self.balance = balance
        self.account_type = account_type
        self.daily_limit = daily_limit
        self.withdrawn_today = 0

    def withdraw(self, amount):
        if amount <= 0:
            return False, "Invalid amount"
        if amount > self.balance:
            return False, "Insufficient funds"
        if self.withdrawn_today + amount > self.daily_limit:
            return False, f"Daily limit exceeded (remaining: \${self.daily_limit - self.withdrawn_today})"
        self.balance -= amount
        self.withdrawn_today += amount
        return True, "Success"

    def deposit(self, amount):
        if amount <= 0:
            return False, "Invalid amount"
        self.balance += amount
        return True, "Success"

    def get_balance(self):
        return self.balance

class Card:
    def __init__(self, card_number, pin, account):
        self.card_number = card_number
        self.pin_hash = hashlib.sha256(pin.encode()).hexdigest()
        self.account = account

    def verify_pin(self, pin):
        return hashlib.sha256(pin.encode()).hexdigest() == self.pin_hash

class CashDispenser:
    def __init__(self):
        self.denominations = {100: 50, 50: 100, 20: 200}

    def has_enough(self, amount):
        return self._calculate_bills(amount) is not None

    def dispense(self, amount):
        bills = self._calculate_bills(amount)
        if bills is None:
            return False, "Cannot dispense exact amount"
        for denom, count in bills.items():
            self.denominations[denom] -= count
        return True, bills

    def _calculate_bills(self, amount):
        remaining = amount
        bills = {}
        for denom in sorted(self.denominations.keys(), reverse=True):
            if remaining <= 0:
                break
            count = min(remaining // denom, self.denominations[denom])
            if count > 0:
                bills[denom] = count
                remaining -= denom * count
        return bills if remaining == 0 else None

class Transaction:
    _counter = 0
    def __init__(self, txn_type, amount, account):
        Transaction._counter += 1
        self.txn_id = Transaction._counter
        self.txn_type = txn_type
        self.amount = amount
        self.account = account
        self.timestamp = datetime.now()
        self.status = TransactionStatus.PENDING

class ATMState(ABC):
    @abstractmethod
    def insert_card(self, atm, card):
        print("Invalid operation in current state")

    @abstractmethod
    def enter_pin(self, atm, pin):
        print("Invalid operation in current state")

    @abstractmethod
    def withdraw(self, atm, amount):
        print("Invalid operation in current state")

    @abstractmethod
    def check_balance(self, atm):
        print("Invalid operation in current state")

class IdleState(ATMState):
    def insert_card(self, atm, card):
        atm.current_card = card
        atm.pin_attempts = 0
        atm.state = HasCardState()
        print(f"Card \${card.card_number[-4:]} inserted. Please enter PIN.")

    def enter_pin(self, atm, pin): print("Please insert card first.")
    def withdraw(self, atm, amount): print("Please insert card first.")
    def check_balance(self, atm): print("Please insert card first.")

class HasCardState(ATMState):
    def insert_card(self, atm, card): print("Card already inserted.")

    def enter_pin(self, atm, pin):
        if atm.current_card.verify_pin(pin):
            atm.state = AuthenticatedState()
            print("PIN verified. Select transaction.")
        else:
            atm.pin_attempts += 1
            if atm.pin_attempts >= 3:
                print("Too many failed attempts. Card retained.")
                atm.current_card = None
                atm.state = IdleState()
            else:
                print(f"Incorrect PIN. \${3 - atm.pin_attempts} attempts remaining.")

    def withdraw(self, atm, amount): print("Please enter PIN first.")
    def check_balance(self, atm): print("Please enter PIN first.")

class AuthenticatedState(ATMState):
    def insert_card(self, atm, card): print("Session active.")
    def enter_pin(self, atm, pin): print("Already authenticated.")

    def withdraw(self, atm, amount):
        account = atm.current_card.account
        txn = Transaction(TransactionType.WITHDRAWAL, amount, account)
        atm.transactions.append(txn)

        if not atm.cash_dispenser.has_enough(amount):
            txn.status = TransactionStatus.FAILED
            print("ATM has insufficient cash.")
            return

        success, msg = account.withdraw(amount)
        if not success:
            txn.status = TransactionStatus.FAILED
            print(f"Withdrawal failed: \${msg}")
            return

        dispensed, bills = atm.cash_dispenser.dispense(amount)
        txn.status = TransactionStatus.COMPLETED
        print(f"Dispensing \${amount}: \${bills}")

    def check_balance(self, atm):
        balance = atm.current_card.account.get_balance()
        txn = Transaction(TransactionType.BALANCE_INQUIRY, 0, atm.current_card.account)
        txn.status = TransactionStatus.COMPLETED
        atm.transactions.append(txn)
        print(f"Current balance: \${balance:.2f}")

class ATM:
    def __init__(self, atm_id, location):
        self.atm_id = atm_id
        self.location = location
        self.cash_dispenser = CashDispenser()
        self.current_card = None
        self.pin_attempts = 0
        self.state = IdleState()
        self.transactions = []

    def insert_card(self, card):
        self.state.insert_card(self, card)

    def enter_pin(self, pin):
        self.state.enter_pin(self, pin)

    def withdraw(self, amount):
        self.state.withdraw(self, amount)

    def check_balance(self):
        self.state.check_balance(self)

    def end_session(self):
        self.current_card = None
        self.state = IdleState()
        print("Session ended. Card ejected.")

# ─── Test ────────────────────────────────────────────────
account = Account("1234567890", 5000, AccountType.CHECKING)
card = Card("4111111111111111", "1234", account)
atm = ATM("ATM-001", "Main Street Branch")

atm.insert_card(card)
atm.enter_pin("0000")       # Wrong PIN
atm.enter_pin("1234")       # Correct PIN
atm.check_balance()          # $5000
atm.withdraw(200)            # Dispense $200
atm.check_balance()          # $4800
atm.end_session()
`,
    },
    {
      id: "atm-state-machine",
      slug: "atm-state-machine-flow",
      title: "State Machine & Transaction Flow",
      content: `# ATM System — State Machine & Transaction Flow

## The State Pattern in Detail

The State pattern is the architectural backbone of the ATM system. Instead of using complex if/else chains to check the current state, each state is a class that knows how to handle its own transitions.

### Why State Pattern?

Without it, you'd have code like this everywhere:

\`\`\`python
def withdraw(self, amount):
    if self.state == "IDLE":
        print("Insert card first")
    elif self.state == "HAS_CARD":
        print("Enter PIN first")
    elif self.state == "AUTHENTICATED":
        # actual withdrawal logic
    # ... fragile and hard to extend
\`\`\`

With the State pattern, each state encapsulates its own behavior. Adding a new state (e.g., MaintenanceState) requires zero changes to existing code.

## Transaction Flow — Withdrawal

The withdrawal flow demonstrates how multiple components coordinate:

\`\`\`
Customer          ATM              Account          CashDispenser
   │                │                  │                  │
   │── withdraw ──▶│                  │                  │
   │               │── has_enough? ──▶│                  │
   │               │                  │                  │
   │               │◀── yes ─────────│                  │
   │               │                  │                  │
   │               │── withdraw ─────────────────────▶ │
   │               │◀── success ─────────────────────── │
   │               │                  │                  │
   │               │── dispense ──────────────────────▶│
   │               │◀── bills ────────────────────────│
   │               │                  │                  │
   │◀── receipt ──│                  │                  │
\`\`\`

### Atomicity Concern

What if \`account.withdraw()\` succeeds but \`cash_dispenser.dispense()\` fails? The account is debited but no cash is given. Solutions:

1. **Check dispenser first** — Verify cash availability before debiting the account
2. **Rollback** — If dispense fails, credit the account back
3. **Two-phase commit** — Reserve funds, dispense, then confirm debit

Our implementation uses approach #1 (check first), which is simplest and most common.

## Edge Cases to Discuss in Interview

| Edge Case | How to Handle |
|---|---|
| Power failure mid-transaction | Transaction log enables recovery; pending transactions are rolled back |
| Card reader malfunction | Transition to maintenance state; alert operator |
| Cash dispenser jams | Retain cash record; refund account; alert operator |
| Network timeout to bank | Retry with exponential backoff; fail gracefully after 3 attempts |
| Concurrent access to same account | Bank backend handles locking; ATM doesn't need to worry |

## Extension Points

- **Observer pattern** for notifications (low cash alerts, security events)
- **Strategy pattern** for different cash dispensing algorithms (minimize bills vs. maximize change)
- **Command pattern** for transaction undo/redo and audit logging`,
    },
    {
      id: "atm-walkthrough",
      slug: "atm-code-walkthrough",
      title: "Code Walkthrough & Interview Tips",
      content: `# ATM System — Code Walkthrough & Interview Tips

## Interview Approach (15-minute walkthrough)

### Minutes 0-3: Clarify Requirements
- "Is this a single ATM or a network? I'll start with single and discuss multi-ATM later."
- "Should I focus on the customer-facing flow or the bank backend integration?"
- Establish scope: authentication, balance, withdrawal. Mention deposit and transfer as extensions.

### Minutes 3-7: Core Design
Present the class diagram. Key decisions to call out:
- **State pattern** for ATM lifecycle — explain why it's cleaner than conditionals
- **CashDispenser** as a separate class — Single Responsibility, testable independently
- **Transaction log** — every operation recorded for audit

### Minutes 7-12: Implementation
Walk through the withdrawal flow step by step:
1. State validation (must be authenticated)
2. Cash availability check (ATM-side)
3. Account debit (bank-side)
4. Cash dispensing (hardware-side)
5. Transaction recording (audit)

### Minutes 12-15: Extensions & Trade-offs
- How would you handle multiple ATMs accessing the same account?
- What happens if the ATM runs low on a specific denomination?
- How would you add support for different currencies?

## Design Pattern Summary

| Pattern | Where Used | Why |
|---|---|---|
| **State** | ATMState hierarchy | Clean state transitions without conditionals |
| **Strategy** | Cash dispensing algorithm | Swap algorithms (greedy, minimize bills) |
| **Observer** | Alert system | Notify operator of low cash, security events |
| **Singleton** | ATM instance | One ATM object per physical machine |
| **Command** | Transaction objects | Audit log, potential undo |

## Common Interview Mistakes

1. **Jumping to code** — Always draw the class diagram first
2. **Ignoring the State pattern** — The ATM is a textbook State pattern example; not using it signals lack of design pattern knowledge
3. **Forgetting atomicity** — Not discussing what happens if dispensing fails after debit
4. **Over-engineering** — Don't build the full bank backend. The ATM communicates with a BankAPI interface; the implementation is out of scope
5. **No error handling** — Invalid amounts, insufficient funds, and hardware failures should all be mentioned

## Key Takeaway

The ATM system is primarily a **State pattern** + **Transaction management** problem. The interviewer wants to see clean state transitions, separation of concerns (card reader, dispenser, screen are separate classes), and awareness of failure modes.`,
    },
  ],
};
