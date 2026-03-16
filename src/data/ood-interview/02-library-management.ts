import { Module } from "../types";

export const libraryManagementModule: Module = {
  id: "ood-library",
  title: "Design a Library Management System",
  description: "Design an object-oriented library management system supporting book checkout, returns, member management, and search functionality.",
  lessons: [
    {
      id: "ood-lib-1",
      slug: "library-requirements",
      title: "Library System: Requirements",
      content: `# Library Management System: Requirements

## Problem Statement

Design a Library Management System that allows librarians to manage books, members to borrow and return books, and supports searching the catalog.

## Clarifying Questions & Answers

**Q: Who are the actors?**
- **Members** -- Browse catalog, borrow books, return books, pay fines
- **Librarians** -- Add/remove books, manage members, process checkouts/returns
- **System** -- Track due dates, calculate fines, send notifications

**Q: What are the core use cases?**
1. Search for books by title, author, or ISBN
2. Checkout a book (borrow)
3. Return a book
4. Reserve a book that is currently checked out
5. Add new books to the catalog
6. Register new members
7. Calculate and collect fines for overdue books
8. Track book availability

**Q: What are the constraints?**
- A member can borrow up to **5 books** at a time
- Each book can be borrowed for a maximum of **14 days**
- Fine rate: **$0.50 per day** overdue
- Multiple copies of the same book can exist
- A book copy can only be checked out by one member at a time

**Q: Edge cases to handle?**
- Member tries to borrow when at max limit
- Member tries to borrow a book with no available copies
- Book is reserved by another member
- Member returns a book late (fine calculation)
- Searching for a book that does not exist

## Actors and Use Cases Summary

\`\`\`
+------------------+     +----------------------------+
|     Member       |     |        Librarian           |
+------------------+     +----------------------------+
| - Search books   |     | - Add/remove books         |
| - Borrow book    |     | - Register members         |
| - Return book    |     | - Process checkout/return   |
| - Reserve book   |     | - View overdue books       |
| - Pay fine       |     | - Collect fines            |
+------------------+     +----------------------------+
\`\`\`

## Key Entities (Nouns)

From the requirements, we can extract these core entities:
- **Book** -- Title, author, ISBN, subject, publication date
- **BookCopy** -- Physical copy of a Book (one Book can have many copies)
- **Member** -- Name, ID, borrowed books, active status
- **Librarian** -- Extends Member with admin privileges
- **Library** -- The system itself, manages catalog and operations
- **Loan** -- Tracks a checkout (which copy, which member, dates, fine)
- **Reservation** -- Holds a book for a member

## Key Behaviors (Verbs)

- Book: search by various criteria
- BookCopy: check out, check in, check availability
- Member: borrow, return, reserve, pay fine
- Library: search catalog, process checkout, process return, calculate fines
- Loan: calculate due date, calculate fine, mark returned

This requirements analysis gives us a clear picture of what to model. In the next lesson, we will draw the class diagram.
`,
    },
    {
      id: "ood-lib-2",
      slug: "library-class-diagram",
      title: "Library System: Class Diagram",
      content: `# Library Management System: Class Diagram

## Core Classes and Relationships

Based on our requirements analysis, here is the class diagram for the Library Management System.

\`\`\`mermaid
classDiagram
    Library "1" *-- "0..*" Book
    Book "1" *-- "1..*" BookCopy
    Library --> Member
    Member <|-- Librarian
    Member "1" --> "0..*" Loan
    Loan --> BookCopy
    class Library {
        +search_by_title()
        +checkout_book()
        +return_book()
    }
    class Book {
        +isbn
        +title
        +author
    }
    class Member {
        +can_borrow()
        +return_book()
    }
    class Loan {
        +calculate_fine()
        +is_overdue()
    }
\`\`\`

\`\`\`
+---------------------+
|     BookStatus      |
|   <<enumeration>>   |
+---------------------+
| AVAILABLE           |
| CHECKED_OUT         |
| RESERVED            |
| LOST                |
+---------------------+

+---------------------+
|    AccountStatus    |
|   <<enumeration>>   |
+---------------------+
| ACTIVE              |
| SUSPENDED           |
| CLOSED              |
+---------------------+

+-------------------+        +-------------------+
|       Book        |        |     BookCopy      |
+-------------------+ 1  1..*+-------------------+
| - isbn: str       |--------| - barcode: str    |
| - title: str      |        | - status: Status  |
| - author: str     |        | - rack_location:  |
| - subject: str    |        |   str             |
| - pub_date: str   |        +-------------------+
+-------------------+        | + checkout()      |
| + get_copies()    |        | + checkin()       |
+-------------------+        | + is_available()  |
                             +-------------------+
                                    |
                                    | 0..1
                                    v
+-------------------+        +-------------------+
|      Member       |        |       Loan        |
+-------------------+ 1    * +-------------------+
| - member_id: str  |--------| - loan_date: date |
| - name: str       |        | - due_date: date  |
| - status: Status  |        | - return_date:    |
| - borrowed: list  |        |   date | None     |
+-------------------+        | - fine: float     |
| + borrow(copy)    |        +-------------------+
| + return_book()   |        | + calculate_fine()|
| + can_borrow()    |        | + is_overdue()    |
+-------------------+        +-------------------+
        ^
        |
+-------------------+
|    Librarian      |
+-------------------+
| + add_book()      |
| + remove_book()   |
| + register_member()|
+-------------------+

+----------------------------+
|          Library           |
+----------------------------+
| - books: dict[str, Book]   |
| - members: dict[str, Mem.] |
| - loans: list[Loan]        |
+----------------------------+
| + search_by_title(title)   |
| + search_by_author(author) |
| + checkout_book(isbn, mem) |
| + return_book(barcode, mem)|
| + get_available_copies()   |
+----------------------------+
\`\`\`

## Relationship Details

### Composition (strong ownership)
- **Library *--- Book**: Books belong to the library. If the library is destroyed, books go too.
- **Book *--- BookCopy**: Copies are physical instances of a Book. They cannot exist without the Book record.

### Association
- **BookCopy --> Loan**: A copy may have an active loan. The loan references both the copy and the member.
- **Member --> Loan**: A member can have multiple active loans (up to 5).

### Inheritance
- **Librarian extends Member**: A librarian has all member capabilities plus administrative powers.

## Design Decisions

1. **Book vs BookCopy separation**: A library may have 3 copies of "Clean Code." The \`Book\` holds metadata; each \`BookCopy\` is a physical unit that can be checked out independently.

2. **Loan as a separate class**: Rather than tracking borrow state directly on BookCopy, we create a Loan object. This preserves history, simplifies fine calculation, and follows SRP.

3. **Enums for status**: Using enums for BookStatus and AccountStatus prevents invalid states and makes the code self-documenting.

4. **Library as orchestrator**: The Library class coordinates operations between books, members, and loans. It acts as the facade for all system operations.
`,
    },
    {
      id: "ood-lib-3",
      slug: "library-implementation",
      title: "Library System: Implementation",
      content: `# Library Management System: Implementation

Now let us implement the core classes. Write the class skeletons yourself first, then check the solution.

## Implementation Goals

- Model books with multiple copies
- Support member borrowing with limits
- Track loans and calculate fines
- Search the catalog by title or author
- Handle edge cases: max borrows, no copies available, overdue returns

## Key Implementation Details

**Enums** define the valid states for books and accounts. Using Python's \`enum.Enum\` ensures type safety.

**Book and BookCopy** are separated following the principle that metadata (title, author) is different from physical inventory (barcode, location, status).

**The Loan class** encapsulates all checkout logic: when was it borrowed, when is it due, was it returned, and what is the fine. Fine calculation uses a simple daily rate.

**The Library class** is the main facade. It holds the catalog (books by ISBN) and members (by ID). All operations -- search, checkout, return -- go through Library, which validates business rules before delegating to the appropriate objects.

**Business rules enforced:**
- Cannot borrow if member has 5 active loans
- Cannot borrow if no copies are available
- Fine is calculated on return based on days overdue
- Copy status transitions: AVAILABLE -> CHECKED_OUT -> AVAILABLE
`,
      starterCode: `from enum import Enum
from datetime import datetime, timedelta
from typing import Optional


class BookStatus(Enum):
    AVAILABLE = "available"
    CHECKED_OUT = "checked_out"
    RESERVED = "reserved"
    LOST = "lost"


class AccountStatus(Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CLOSED = "closed"


class Book:
    def __init__(self, isbn: str, title: str, author: str, subject: str):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.subject = subject
        self.copies: list["BookCopy"] = []

    def add_copy(self, barcode: str, rack_location: str) -> "BookCopy":
        # TODO: Create a new BookCopy, append to self.copies, return it
        pass

    def get_available_copies(self) -> list["BookCopy"]:
        # TODO: Return list of copies with AVAILABLE status
        pass


class BookCopy:
    def __init__(self, barcode: str, book: Book, rack_location: str):
        self.barcode = barcode
        self.book = book
        self.rack_location = rack_location
        self.status = BookStatus.AVAILABLE

    def checkout(self):
        # TODO: Set status to CHECKED_OUT (raise error if not available)
        pass

    def checkin(self):
        # TODO: Set status to AVAILABLE
        pass

    def is_available(self) -> bool:
        # TODO: Return True if status is AVAILABLE
        pass


class Loan:
    LOAN_PERIOD_DAYS = 14
    FINE_PER_DAY = 0.50

    def __init__(self, copy: BookCopy, member: "Member"):
        self.copy = copy
        self.member = member
        self.loan_date = datetime.now()
        self.due_date = self.loan_date + timedelta(days=self.LOAN_PERIOD_DAYS)
        self.return_date: Optional[datetime] = None
        self.fine: float = 0.0

    def is_overdue(self) -> bool:
        # TODO: Check if current date or return date is past due date
        pass

    def calculate_fine(self) -> float:
        # TODO: Calculate fine based on days overdue
        pass

    def complete_return(self):
        # TODO: Set return_date, calculate fine, checkin the copy
        pass


class Member:
    MAX_BOOKS = 5

    def __init__(self, member_id: str, name: str):
        self.member_id = member_id
        self.name = name
        self.status = AccountStatus.ACTIVE
        self.active_loans: list[Loan] = []
        self.total_fines: float = 0.0

    def can_borrow(self) -> bool:
        # TODO: Check if member is active and under max books limit
        pass

    def add_loan(self, loan: Loan):
        # TODO: Add loan to active_loans
        pass

    def return_book(self, barcode: str) -> float:
        # TODO: Find loan by barcode, complete return, remove from active, return fine
        pass


class Librarian(Member):
    def __init__(self, member_id: str, name: str, employee_id: str):
        super().__init__(member_id, name)
        self.employee_id = employee_id

    def add_book(self, library: "Library", isbn: str, title: str, author: str, subject: str) -> Book:
        # TODO: Add a book to the library catalog
        pass

    def register_member(self, library: "Library", member_id: str, name: str) -> Member:
        # TODO: Create and register a new member
        pass


class Library:
    def __init__(self, name: str):
        self.name = name
        self.books: dict[str, Book] = {}       # ISBN -> Book
        self.members: dict[str, Member] = {}   # member_id -> Member
        self.loans: list[Loan] = []

    def add_book(self, isbn: str, title: str, author: str, subject: str) -> Book:
        # TODO: Create book if not exists, return it
        pass

    def register_member(self, member_id: str, name: str) -> Member:
        # TODO: Create and store a new member
        pass

    def search_by_title(self, title: str) -> list[Book]:
        # TODO: Case-insensitive search by title
        pass

    def search_by_author(self, author: str) -> list[Book]:
        # TODO: Case-insensitive search by author
        pass

    def checkout_book(self, isbn: str, member_id: str) -> Loan:
        # TODO: Validate member can borrow, find available copy, create loan
        pass

    def return_book(self, barcode: str, member_id: str) -> float:
        # TODO: Process return, return fine amount
        pass


# Test the system
if __name__ == "__main__":
    library = Library("City Public Library")
    # Add books, members, checkout, return -- test your implementation
    pass
`,
      solutionCode: `from enum import Enum
from datetime import datetime, timedelta
from typing import Optional


class BookStatus(Enum):
    AVAILABLE = "available"
    CHECKED_OUT = "checked_out"
    RESERVED = "reserved"
    LOST = "lost"


class AccountStatus(Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CLOSED = "closed"


class Book:
    def __init__(self, isbn: str, title: str, author: str, subject: str):
        self.isbn = isbn
        self.title = title
        self.author = author
        self.subject = subject
        self.copies: list["BookCopy"] = []

    def add_copy(self, barcode: str, rack_location: str) -> "BookCopy":
        copy = BookCopy(barcode, self, rack_location)
        self.copies.append(copy)
        return copy

    def get_available_copies(self) -> list["BookCopy"]:
        return [c for c in self.copies if c.is_available()]

    def __repr__(self):
        return f"Book('{self.title}' by {self.author})"


class BookCopy:
    def __init__(self, barcode: str, book: Book, rack_location: str):
        self.barcode = barcode
        self.book = book
        self.rack_location = rack_location
        self.status = BookStatus.AVAILABLE

    def checkout(self):
        if self.status != BookStatus.AVAILABLE:
            raise ValueError(f"Copy {self.barcode} is not available (status: {self.status.value})")
        self.status = BookStatus.CHECKED_OUT

    def checkin(self):
        self.status = BookStatus.AVAILABLE

    def is_available(self) -> bool:
        return self.status == BookStatus.AVAILABLE

    def __repr__(self):
        return f"BookCopy({self.barcode}, {self.status.value})"


class Loan:
    LOAN_PERIOD_DAYS = 14
    FINE_PER_DAY = 0.50

    def __init__(self, copy: BookCopy, member: "Member"):
        self.copy = copy
        self.member = member
        self.loan_date = datetime.now()
        self.due_date = self.loan_date + timedelta(days=self.LOAN_PERIOD_DAYS)
        self.return_date: Optional[datetime] = None
        self.fine: float = 0.0

    def is_overdue(self) -> bool:
        check_date = self.return_date if self.return_date else datetime.now()
        return check_date > self.due_date

    def calculate_fine(self) -> float:
        if not self.is_overdue():
            return 0.0
        check_date = self.return_date if self.return_date else datetime.now()
        overdue_days = (check_date - self.due_date).days
        self.fine = overdue_days * self.FINE_PER_DAY
        return self.fine

    def complete_return(self):
        self.return_date = datetime.now()
        self.calculate_fine()
        self.copy.checkin()


class Member:
    MAX_BOOKS = 5

    def __init__(self, member_id: str, name: str):
        self.member_id = member_id
        self.name = name
        self.status = AccountStatus.ACTIVE
        self.active_loans: list[Loan] = []
        self.total_fines: float = 0.0

    def can_borrow(self) -> bool:
        return (
            self.status == AccountStatus.ACTIVE
            and len(self.active_loans) < self.MAX_BOOKS
        )

    def add_loan(self, loan: Loan):
        self.active_loans.append(loan)

    def return_book(self, barcode: str) -> float:
        loan = None
        for l in self.active_loans:
            if l.copy.barcode == barcode:
                loan = l
                break
        if loan is None:
            raise ValueError(f"No active loan for barcode {barcode}")
        loan.complete_return()
        self.active_loans.remove(loan)
        self.total_fines += loan.fine
        return loan.fine

    def __repr__(self):
        return f"Member({self.member_id}, {self.name})"


class Librarian(Member):
    def __init__(self, member_id: str, name: str, employee_id: str):
        super().__init__(member_id, name)
        self.employee_id = employee_id

    def add_book(self, library: "Library", isbn: str, title: str, author: str, subject: str) -> Book:
        return library.add_book(isbn, title, author, subject)

    def register_member(self, library: "Library", member_id: str, name: str) -> Member:
        return library.register_member(member_id, name)


class Library:
    def __init__(self, name: str):
        self.name = name
        self.books: dict[str, Book] = {}
        self.members: dict[str, Member] = {}
        self.loans: list[Loan] = []

    def add_book(self, isbn: str, title: str, author: str, subject: str) -> Book:
        if isbn not in self.books:
            self.books[isbn] = Book(isbn, title, author, subject)
        return self.books[isbn]

    def register_member(self, member_id: str, name: str) -> Member:
        if member_id in self.members:
            raise ValueError(f"Member {member_id} already exists")
        member = Member(member_id, name)
        self.members[member_id] = member
        return member

    def search_by_title(self, title: str) -> list[Book]:
        title_lower = title.lower()
        return [b for b in self.books.values() if title_lower in b.title.lower()]

    def search_by_author(self, author: str) -> list[Book]:
        author_lower = author.lower()
        return [b for b in self.books.values() if author_lower in b.author.lower()]

    def checkout_book(self, isbn: str, member_id: str) -> Loan:
        if member_id not in self.members:
            raise ValueError(f"Member {member_id} not found")
        member = self.members[member_id]
        if not member.can_borrow():
            raise ValueError(f"Member {member.name} cannot borrow (limit reached or account inactive)")
        if isbn not in self.books:
            raise ValueError(f"Book with ISBN {isbn} not found")
        book = self.books[isbn]
        available = book.get_available_copies()
        if not available:
            raise ValueError(f"No available copies of '{book.title}'")
        copy = available[0]
        copy.checkout()
        loan = Loan(copy, member)
        member.add_loan(loan)
        self.loans.append(loan)
        print(f"Checked out '{book.title}' (copy {copy.barcode}) to {member.name}")
        return loan

    def return_book(self, barcode: str, member_id: str) -> float:
        if member_id not in self.members:
            raise ValueError(f"Member {member_id} not found")
        member = self.members[member_id]
        fine = member.return_book(barcode)
        if fine > 0:
            print(f"Book returned with fine: \${fine:.2f}")
        else:
            print(f"Book returned successfully. No fine.")
        return fine


# Test the system
if __name__ == "__main__":
    library = Library("City Public Library")

    # Add books
    book1 = library.add_book("978-0132350884", "Clean Code", "Robert C. Martin", "Software Engineering")
    book1.add_copy("CC-001", "A1-S3")
    book1.add_copy("CC-002", "A1-S3")

    book2 = library.add_book("978-0201633610", "Design Patterns", "Gang of Four", "Software Engineering")
    book2.add_copy("DP-001", "A2-S1")

    # Register members
    alice = library.register_member("M001", "Alice Johnson")
    bob = library.register_member("M002", "Bob Smith")

    # Search
    results = library.search_by_title("clean")
    print(f"Search results: {results}")

    # Checkout
    loan = library.checkout_book("978-0132350884", "M001")
    print(f"Due date: {loan.due_date.strftime('%Y-%m-%d')}")

    # Return
    fine = library.return_book("CC-001", "M001")
    print(f"Fine: \${fine:.2f}")
`,
    },
    {
      id: "ood-lib-4",
      slug: "library-edge-cases",
      title: "Library System: Edge Cases",
      content: `# Library Management System: Edge Cases

Handling edge cases separates a good OOD answer from a great one. Let us examine the critical edge cases for our Library Management System and how our design handles them.

## Edge Case 1: Member at Maximum Borrow Limit

When a member already has 5 active loans and tries to borrow another book, the system must reject the request gracefully.

\`\`\`python
def can_borrow(self) -> bool:
    return (
        self.status == AccountStatus.ACTIVE
        and len(self.active_loans) < self.MAX_BOOKS
    )
\`\`\`

The \`checkout_book\` method in Library checks \`member.can_borrow()\` before proceeding. This follows the **fail-fast principle** -- we check preconditions early rather than discovering the problem midway through the operation.

## Edge Case 2: No Available Copies

A book may exist in the catalog but all copies are checked out. The system must distinguish between "book not found" and "book exists but unavailable."

\`\`\`python
available = book.get_available_copies()
if not available:
    raise ValueError(f"No available copies of '{book.title}'")
\`\`\`

**Enhancement opportunity:** When no copies are available, offer to create a **Reservation**. The Reservation class would hold a reference to the Book and Member, and when a copy is returned, the system notifies the member with the oldest reservation.

## Edge Case 3: Overdue Fine Calculation

Fines must be calculated correctly whether checked at return time or during a routine audit. Our Loan class handles both scenarios:

\`\`\`python
def is_overdue(self) -> bool:
    check_date = self.return_date if self.return_date else datetime.now()
    return check_date > self.due_date
\`\`\`

If the book has been returned, we check the return date against the due date. If it has not been returned, we check the current date. This dual behavior makes the method useful for both real-time status checks and historical audits.

## Edge Case 4: Returning a Book Not Borrowed

If a member tries to return a book they did not borrow, the system should raise a clear error:

\`\`\`python
def return_book(self, barcode: str) -> float:
    loan = None
    for l in self.active_loans:
        if l.copy.barcode == barcode:
            loan = l
            break
    if loan is None:
        raise ValueError(f"No active loan for barcode {barcode}")
\`\`\`

## Edge Case 5: Duplicate Registration

Attempting to register a member with an existing ID should be rejected:

\`\`\`python
def register_member(self, member_id: str, name: str) -> Member:
    if member_id in self.members:
        raise ValueError(f"Member {member_id} already exists")
\`\`\`

## Edge Case 6: Concurrent Checkouts

In a real system, two librarians might try to check out the last copy of a book simultaneously. Our current design is **not thread-safe**. In an interview, you should mention this and suggest solutions:

1. **Locking:** Use a lock on the BookCopy before checkout
2. **Optimistic concurrency:** Check-and-set with version numbers
3. **Database transactions:** In a persistent system, use database-level locking

\`\`\`python
import threading

class BookCopy:
    def __init__(self, barcode, book, rack_location):
        # ... existing init ...
        self._lock = threading.Lock()

    def checkout(self):
        with self._lock:
            if self.status != BookStatus.AVAILABLE:
                raise ValueError("Not available")
            self.status = BookStatus.CHECKED_OUT
\`\`\`

## Edge Case 7: Suspended Account

A member whose account is suspended (e.g., unpaid fines exceeding a threshold) should be blocked from borrowing:

\`\`\`python
def can_borrow(self) -> bool:
    return (
        self.status == AccountStatus.ACTIVE  # Blocks SUSPENDED and CLOSED
        and len(self.active_loans) < self.MAX_BOOKS
    )
\`\`\`

## Interview Tip

When discussing edge cases, organize them by **severity**: first, cases that could cause data corruption (concurrency), then cases that violate business rules (limits, invalid state), then user experience issues (clear error messages). This shows the interviewer you think about system reliability.
`,
    },
    {
      id: "ood-lib-5",
      slug: "library-walkthrough",
      title: "Library System: Code Walkthrough",
      content: `# Library Management System: Code Walkthrough

Let us walk through the complete system end-to-end, explaining the design decisions and how each component interacts.

## Architecture Overview

\`\`\`
Library (Facade)
  |
  +-- books: dict[ISBN, Book]
  |     |
  |     +-- copies: list[BookCopy]
  |
  +-- members: dict[ID, Member]
  |     |
  |     +-- active_loans: list[Loan]
  |
  +-- loans: list[Loan] (all loans for history)
\`\`\`

The **Library** class serves as the **Facade pattern** -- it provides a simple interface to the complex subsystem of Books, Copies, Members, and Loans. External code never needs to know about BookCopy or Loan directly.

## Design Patterns Used

### 1. Facade Pattern (Library)
The Library class is the single entry point for all operations. Clients call \`library.checkout_book()\` rather than manually finding copies, creating loans, and updating member state.

### 2. Inheritance (Librarian extends Member)
A Librarian is a Member with extra privileges. This follows LSP -- anywhere you can use a Member, you can use a Librarian. The Librarian adds methods for administrative tasks but inherits the ability to borrow books.

### 3. Enum Pattern (BookStatus, AccountStatus)
Using enums constrains the state space. A BookCopy can only be AVAILABLE, CHECKED_OUT, RESERVED, or LOST -- never an arbitrary string that might have a typo.

## Walkthrough: Checking Out a Book

\`\`\`python
loan = library.checkout_book("978-0132350884", "M001")
\`\`\`

Here is what happens step by step:

1. **Library.checkout_book** validates the member exists
2. Checks **member.can_borrow()** -- is account active and under limit?
3. Finds the **Book** by ISBN
4. Gets **available copies** -- calls \`book.get_available_copies()\`
5. Takes the **first available copy** and calls \`copy.checkout()\`
6. Creates a **Loan** linking the copy to the member
7. Adds the loan to **member.active_loans** and **library.loans**
8. Returns the Loan object

If any validation fails, a **ValueError** is raised with a descriptive message. The caller never sees a partial operation.

## Walkthrough: Returning a Book

\`\`\`python
fine = library.return_book("CC-001", "M001")
\`\`\`

1. **Library.return_book** validates the member exists
2. Calls **member.return_book(barcode)** which finds the matching loan
3. **loan.complete_return()** sets the return date, calculates the fine, and calls \`copy.checkin()\`
4. The loan is removed from **active_loans**
5. Any fine is added to **member.total_fines**
6. The fine amount is returned to the caller

## SOLID Principles Applied

| Principle | How We Applied It |
|-----------|-------------------|
| **SRP** | Book stores metadata, BookCopy tracks physical state, Loan handles checkout logic, Library orchestrates |
| **OCP** | New book types or member types can be added via inheritance without modifying existing classes |
| **LSP** | Librarian can be used anywhere a Member is expected |
| **ISP** | Each class exposes only the methods relevant to its role |
| **DIP** | Library depends on Member and Book abstractions, not concrete implementations |

## Extensibility Discussion

In an interview, mention how you would extend this system:

- **Reservation system:** Add a Reservation class with a queue per Book. When a copy is returned, check the reservation queue first.
- **Notification system:** Use the Observer pattern. When a reserved book becomes available, notify the member via email/SMS.
- **Multiple branches:** Add a Branch class. Each Branch has its own catalog and members, but transfers between branches are supported.
- **Digital books:** Add an EBook subclass that does not have physical copies. It uses a license count instead of BookCopy objects.

## Interview Scoring Rubric

Most interviewers evaluate OOD answers on these criteria:
1. **Requirements gathering** -- Did you ask good questions?
2. **Class identification** -- Are the right classes present?
3. **Relationships** -- Are composition, inheritance, and association used correctly?
4. **API design** -- Are the methods intuitive and well-parameterized?
5. **Edge case handling** -- Did you consider error states?
6. **Extensibility** -- Can the design grow without major rewrites?
7. **Code quality** -- Is the implementation clean, typed, and well-structured?
`,
    },
  ],
};
