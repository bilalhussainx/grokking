import { Module } from "../types";

export const movieTicketBookingModule: Module = {
  id: "ood-movie-booking",
  title: "Design a Movie Ticket Booking System",
  description: "Design an object-oriented movie ticket booking system with theaters, shows, seat selection, concurrent booking handling, and payment processing.",
  lessons: [
    {
      id: "ood-movie-1",
      slug: "movie-booking-requirements",
      title: "Movie Ticket Booking: Requirements",
      content: `# Movie Ticket Booking System: Requirements

## Problem Statement

Design a Movie Ticket Booking system (like BookMyShow or Fandango) that allows customers to browse movies, select showings, choose seats, and book tickets.

## Clarifying Questions & Answers

**Q: Who are the actors?**
- **Customer** -- Browse movies, select showtime, choose seats, book tickets
- **Theater Admin** -- Add movies, schedule shows, configure seating, set prices
- **System** -- Handle concurrent bookings, process payments, send confirmations

**Q: What are the core use cases?**
1. Browse movies currently showing
2. View available showtimes for a movie
3. View seat map and select seats for a show
4. Book selected seats and process payment
5. Cancel a booking (with refund policy)
6. Add new movies and schedule shows
7. Configure theater seating layout

**Q: What are the constraints?**
- A theater has **multiple screens** (auditoriums)
- Each screen has a **fixed seating layout** (rows and columns)
- Seats have different types: **Regular, Premium, VIP** with different prices
- A seat can only be booked by **one customer** per show
- **Concurrent booking** must be handled (two users selecting the same seat)
- Booking window: seats are **held for 10 minutes** during checkout
- Cancellation allowed up to **2 hours before showtime**

**Q: Edge cases?**
- Two users try to book the same seat simultaneously
- Payment fails after seats are held
- Customer tries to cancel too close to showtime
- Show is sold out
- Theater screen goes out of service

## Key Entities

\`\`\`
+-------------------+     +-------------------+
|     Customer      |     |   Theater Admin   |
+-------------------+     +-------------------+
| - Browse movies   |     | - Schedule shows  |
| - Select showtime |     | - Set prices      |
| - Choose seats    |     | - View bookings   |
| - Book tickets    |     | - Cancel shows    |
| - Cancel booking  |     |                   |
+-------------------+     +-------------------+
\`\`\`

Core classes:
- **Movie** -- Title, description, duration, genre, rating
- **Theater** -- Name, location, list of screens
- **Screen** -- Screen number, seats, list of shows
- **Seat** -- Row, number, type (Regular/Premium/VIP)
- **Show** -- Movie + Screen + time, seat availability
- **ShowSeat** -- A seat's status for a specific show
- **Booking** -- Customer + Show + seats + payment
- **Payment** -- Amount, method, status

## The Concurrency Challenge

The defining challenge of this system is **concurrent seat booking**. When User A and User B both see Seat 5A as available and try to book it, only one should succeed. This requires:
1. **Temporary hold** -- When a user starts checkout, hold the seat for N minutes
2. **Atomic booking** -- The final booking must be an all-or-nothing operation
3. **Timeout release** -- If the hold expires without payment, release the seat
`,
    },
    {
      id: "ood-movie-2",
      slug: "movie-booking-class-diagram",
      title: "Movie Ticket Booking: Class Diagram",
      content: `# Movie Ticket Booking System: Class Diagram

## Core Classes and Relationships

\`\`\`
+---------------------+
|    SeatType         |
|  <<enumeration>>    |
+---------------------+
| REGULAR             |
| PREMIUM             |
| VIP                 |
+---------------------+

+---------------------+
|   SeatStatus        |
|  <<enumeration>>    |
+---------------------+
| AVAILABLE           |
| HELD                |
| BOOKED              |
+---------------------+

+---------------------+
|  BookingStatus      |
|  <<enumeration>>    |
+---------------------+
| PENDING             |
| CONFIRMED           |
| CANCELLED           |
+---------------------+

+-------------------+         +-------------------+
|     Movie         |         |     Theater       |
+-------------------+    *  1 +-------------------+
| - movie_id: str   |         | - theater_id: str |
| - title: str      |         | - name: str       |
| - duration: int   |         | - location: str   |
| - genre: str      |         | - screens: list   |
| - rating: str     |         +-------------------+
+-------------------+         | + add_screen()    |
                              | + get_shows()     |
                              +-------------------+
                                     |
                                     | 1..*
                                     v
+-------------------+         +-------------------+
|      Show         |         |     Screen        |
+-------------------+  *   1  +-------------------+
| - show_id: str    |---------| - screen_id: str  |
| - movie: Movie    |         | - name: str       |
| - start_time: dt  |         | - seats: list     |
| - end_time: dt    |         | - total_seats: int|
| - show_seats: list|         +-------------------+
| - price_map: dict |         | + get_seat_layout()|
+-------------------+         +-------------------+
| + get_available() |                |
| + hold_seats()    |                | 1..*
| + book_seats()    |                v
| + release_seats() |         +-------------------+
+-------------------+         |      Seat         |
        |                     +-------------------+
        | 1..*                | - seat_id: str    |
        v                     | - row: str        |
+-------------------+         | - number: int     |
|    ShowSeat       |         | - seat_type: Type |
+-------------------+         +-------------------+
| - show: Show      |
| - seat: Seat      |
| - status: Status  |
| - held_by: str    |
| - held_at: dt     |
+-------------------+

+-------------------+         +-------------------+
|     Booking       |         |     Payment       |
+-------------------+  1    1 +-------------------+
| - booking_id: str |---------| - payment_id: str |
| - customer_id: str|         | - amount: float   |
| - show: Show      |         | - status: Status  |
| - seats: list     |         +-------------------+
| - status: Status  |         | + process()       |
| - total: float    |         | + refund()        |
| - payment: Payment|         +-------------------+
+-------------------+
| + confirm()       |
| + cancel()        |
+-------------------+
\`\`\`

## Relationship Details

### Composition
- **Theater *--- Screen**: Screens are part of a theater
- **Screen *--- Seat**: Seats are part of a screen (fixed layout)
- **Show *--- ShowSeat**: ShowSeats are created for each show

### Association
- **Show --> Movie**: A show presents a movie
- **Show --> Screen**: A show happens on a specific screen
- **Booking --> Show**: A booking is for a specific show
- **Booking --> ShowSeat**: A booking reserves specific seats

## The ShowSeat Pattern

The most important design decision is the **ShowSeat** class. A \`Seat\` represents a physical seat in a screen -- it never changes. A \`ShowSeat\` represents that seat's availability **for a specific show**.

Without ShowSeat, we would have to track availability on the Seat itself, which does not work because the same seat is available for the 2:00 PM show but booked for the 5:00 PM show.

\`\`\`
Seat (physical, permanent)     ShowSeat (per-show, ephemeral)
  Row A, Number 5        -->   Show 2PM: AVAILABLE
                         -->   Show 5PM: BOOKED
                         -->   Show 8PM: HELD
\`\`\`

This separation of **static structure** from **dynamic state** is a common OOD pattern you will see in many booking systems.
`,
    },
    {
      id: "ood-movie-3",
      slug: "movie-booking-implementation",
      title: "Movie Ticket Booking: Implementation",
      content: `# Movie Ticket Booking System: Implementation

Implement the movie ticket booking system with theaters, screens, shows, seat selection, and booking management.

## Implementation Goals

- Theater with multiple screens and configurable seating
- Show scheduling with per-show seat availability
- Seat hold mechanism for concurrent booking protection
- Booking with payment and confirmation
- Cancellation with refund support
`,
      starterCode: `from enum import Enum
from datetime import datetime, timedelta
from typing import Optional
import uuid


class SeatType(Enum):
    REGULAR = "regular"
    PREMIUM = "premium"
    VIP = "vip"


class SeatStatus(Enum):
    AVAILABLE = "available"
    HELD = "held"
    BOOKED = "booked"


class BookingStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


SEAT_PRICES = {
    SeatType.REGULAR: 10.00,
    SeatType.PREMIUM: 15.00,
    SeatType.VIP: 25.00,
}

HOLD_TIMEOUT_MINUTES = 10


class Movie:
    def __init__(self, movie_id: str, title: str, duration_minutes: int, genre: str, rating: str):
        self.movie_id = movie_id
        self.title = title
        self.duration_minutes = duration_minutes
        self.genre = genre
        self.rating = rating

    def __repr__(self):
        return f"Movie({self.title})"


class Seat:
    def __init__(self, row: str, number: int, seat_type: SeatType):
        self.seat_id = f"{row}{number}"
        self.row = row
        self.number = number
        self.seat_type = seat_type

    def __repr__(self):
        return f"Seat({self.seat_id}, {self.seat_type.value})"


class ShowSeat:
    def __init__(self, seat: Seat):
        self.seat = seat
        self.status = SeatStatus.AVAILABLE
        self.held_by: Optional[str] = None  # customer_id
        self.held_at: Optional[datetime] = None

    def is_available(self) -> bool:
        # TODO: Return True if AVAILABLE or if HELD but timed out
        pass

    def hold(self, customer_id: str) -> bool:
        # TODO: Hold seat for customer if available
        pass

    def book(self) -> bool:
        # TODO: Book seat (only if HELD)
        pass

    def release(self):
        # TODO: Release seat back to AVAILABLE
        pass


class Screen:
    def __init__(self, screen_id: str, name: str):
        self.screen_id = screen_id
        self.name = name
        self.seats: list[Seat] = []

    def configure_seats(self, rows: dict[str, tuple[int, SeatType]]):
        # TODO: Create seats from configuration
        # rows = {"A": (10, SeatType.VIP), "B": (10, SeatType.PREMIUM), ...}
        pass

    def get_total_seats(self) -> int:
        return len(self.seats)


class Show:
    def __init__(self, show_id: str, movie: Movie, screen: Screen, start_time: datetime):
        self.show_id = show_id
        self.movie = movie
        self.screen = screen
        self.start_time = start_time
        self.end_time = start_time + timedelta(minutes=movie.duration_minutes)
        self.show_seats: dict[str, ShowSeat] = {}  # seat_id -> ShowSeat
        self._initialize_seats()

    def _initialize_seats(self):
        # TODO: Create ShowSeat for each physical seat in the screen
        pass

    def get_available_seats(self) -> list[ShowSeat]:
        # TODO: Return all available show seats
        pass

    def hold_seats(self, seat_ids: list[str], customer_id: str) -> bool:
        # TODO: Hold multiple seats atomically (all or nothing)
        pass

    def book_seats(self, seat_ids: list[str]) -> bool:
        # TODO: Book previously held seats
        pass

    def release_seats(self, seat_ids: list[str]):
        # TODO: Release seats back to available
        pass

    def get_seat_price(self, seat_id: str) -> float:
        # TODO: Return price based on seat type
        pass


class Booking:
    def __init__(self, customer_id: str, show: Show, seat_ids: list[str]):
        self.booking_id = str(uuid.uuid4())[:8]
        self.customer_id = customer_id
        self.show = show
        self.seat_ids = seat_ids
        self.status = BookingStatus.PENDING
        self.total = sum(show.get_seat_price(sid) for sid in seat_ids)
        self.created_at = datetime.now()

    def confirm(self):
        # TODO: Book seats in the show, set status to CONFIRMED
        pass

    def cancel(self) -> bool:
        # TODO: Cancel booking if at least 2 hours before showtime
        pass


class Theater:
    def __init__(self, theater_id: str, name: str, location: str):
        self.theater_id = theater_id
        self.name = name
        self.location = location
        self.screens: list[Screen] = []
        self.shows: list[Show] = []
        self.bookings: dict[str, Booking] = {}

    def add_screen(self, screen: Screen):
        # TODO: Add screen to theater
        pass

    def schedule_show(self, movie: Movie, screen: Screen, start_time: datetime) -> Show:
        # TODO: Create and return a new Show
        pass

    def get_shows_for_movie(self, movie_id: str) -> list[Show]:
        # TODO: Return all shows for a specific movie
        pass

    def book_tickets(self, customer_id: str, show_id: str, seat_ids: list[str]) -> Booking:
        # TODO: Hold seats, create booking, confirm booking
        pass

    def cancel_booking(self, booking_id: str) -> bool:
        # TODO: Cancel a booking and release seats
        pass


# Test the system
if __name__ == "__main__":
    pass
`,
      solutionCode: `from enum import Enum
from datetime import datetime, timedelta
from typing import Optional
import uuid


class SeatType(Enum):
    REGULAR = "regular"
    PREMIUM = "premium"
    VIP = "vip"


class SeatStatus(Enum):
    AVAILABLE = "available"
    HELD = "held"
    BOOKED = "booked"


class BookingStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


SEAT_PRICES = {
    SeatType.REGULAR: 10.00,
    SeatType.PREMIUM: 15.00,
    SeatType.VIP: 25.00,
}

HOLD_TIMEOUT_MINUTES = 10


class Movie:
    def __init__(self, movie_id: str, title: str, duration_minutes: int, genre: str, rating: str):
        self.movie_id = movie_id
        self.title = title
        self.duration_minutes = duration_minutes
        self.genre = genre
        self.rating = rating

    def __repr__(self):
        return f"Movie({self.title})"


class Seat:
    def __init__(self, row: str, number: int, seat_type: SeatType):
        self.seat_id = f"{row}{number}"
        self.row = row
        self.number = number
        self.seat_type = seat_type

    def __repr__(self):
        return f"Seat({self.seat_id}, {self.seat_type.value})"


class ShowSeat:
    def __init__(self, seat: Seat):
        self.seat = seat
        self.status = SeatStatus.AVAILABLE
        self.held_by: Optional[str] = None
        self.held_at: Optional[datetime] = None

    def is_available(self) -> bool:
        if self.status == SeatStatus.AVAILABLE:
            return True
        if self.status == SeatStatus.HELD and self.held_at:
            timeout = self.held_at + timedelta(minutes=HOLD_TIMEOUT_MINUTES)
            if datetime.now() > timeout:
                self.release()
                return True
        return False

    def hold(self, customer_id: str) -> bool:
        if not self.is_available():
            return False
        self.status = SeatStatus.HELD
        self.held_by = customer_id
        self.held_at = datetime.now()
        return True

    def book(self) -> bool:
        if self.status != SeatStatus.HELD:
            return False
        self.status = SeatStatus.BOOKED
        return True

    def release(self):
        self.status = SeatStatus.AVAILABLE
        self.held_by = None
        self.held_at = None

    def __repr__(self):
        return f"ShowSeat({self.seat.seat_id}, {self.status.value})"


class Screen:
    def __init__(self, screen_id: str, name: str):
        self.screen_id = screen_id
        self.name = name
        self.seats: list[Seat] = []

    def configure_seats(self, rows: dict[str, tuple[int, SeatType]]):
        self.seats = []
        for row_letter, (count, seat_type) in sorted(rows.items()):
            for num in range(1, count + 1):
                self.seats.append(Seat(row_letter, num, seat_type))

    def get_total_seats(self) -> int:
        return len(self.seats)

    def __repr__(self):
        return f"Screen({self.name}, {self.get_total_seats()} seats)"


class Show:
    def __init__(self, show_id: str, movie: Movie, screen: Screen, start_time: datetime):
        self.show_id = show_id
        self.movie = movie
        self.screen = screen
        self.start_time = start_time
        self.end_time = start_time + timedelta(minutes=movie.duration_minutes)
        self.show_seats: dict[str, ShowSeat] = {}
        self._initialize_seats()

    def _initialize_seats(self):
        for seat in self.screen.seats:
            self.show_seats[seat.seat_id] = ShowSeat(seat)

    def get_available_seats(self) -> list[ShowSeat]:
        return [ss for ss in self.show_seats.values() if ss.is_available()]

    def hold_seats(self, seat_ids: list[str], customer_id: str) -> bool:
        # Validate all seats exist and are available
        for seat_id in seat_ids:
            if seat_id not in self.show_seats:
                return False
            if not self.show_seats[seat_id].is_available():
                return False

        # Hold all seats atomically
        held = []
        for seat_id in seat_ids:
            if self.show_seats[seat_id].hold(customer_id):
                held.append(seat_id)
            else:
                # Rollback on failure
                for h in held:
                    self.show_seats[h].release()
                return False
        return True

    def book_seats(self, seat_ids: list[str]) -> bool:
        for seat_id in seat_ids:
            if not self.show_seats[seat_id].book():
                return False
        return True

    def release_seats(self, seat_ids: list[str]):
        for seat_id in seat_ids:
            if seat_id in self.show_seats:
                self.show_seats[seat_id].release()

    def get_seat_price(self, seat_id: str) -> float:
        if seat_id not in self.show_seats:
            raise ValueError(f"Seat {seat_id} not found")
        return SEAT_PRICES[self.show_seats[seat_id].seat.seat_type]

    def __repr__(self):
        available = len(self.get_available_seats())
        total = len(self.show_seats)
        return f"Show({self.movie.title}, {self.start_time.strftime('%H:%M')}, {available}/{total} available)"


class Booking:
    def __init__(self, customer_id: str, show: Show, seat_ids: list[str]):
        self.booking_id = str(uuid.uuid4())[:8]
        self.customer_id = customer_id
        self.show = show
        self.seat_ids = seat_ids
        self.status = BookingStatus.PENDING
        self.total = sum(show.get_seat_price(sid) for sid in seat_ids)
        self.created_at = datetime.now()

    def confirm(self):
        if self.show.book_seats(self.seat_ids):
            self.status = BookingStatus.CONFIRMED
            print(f"Booking {self.booking_id} confirmed: {len(self.seat_ids)} seats for "
                  f"{self.show.movie.title} at {self.show.start_time.strftime('%H:%M')}")
        else:
            raise ValueError("Failed to book seats")

    def cancel(self) -> bool:
        if self.status != BookingStatus.CONFIRMED:
            print("Can only cancel confirmed bookings")
            return False
        hours_until_show = (self.show.start_time - datetime.now()).total_seconds() / 3600
        if hours_until_show < 2:
            print("Cannot cancel within 2 hours of showtime")
            return False
        self.show.release_seats(self.seat_ids)
        self.status = BookingStatus.CANCELLED
        print(f"Booking {self.booking_id} cancelled. Refund: \${self.total:.2f}")
        return True

    def __repr__(self):
        return f"Booking({self.booking_id}, {self.status.value}, \${self.total:.2f})"


class Theater:
    def __init__(self, theater_id: str, name: str, location: str):
        self.theater_id = theater_id
        self.name = name
        self.location = location
        self.screens: list[Screen] = []
        self.shows: list[Show] = []
        self.bookings: dict[str, Booking] = {}

    def add_screen(self, screen: Screen):
        self.screens.append(screen)

    def schedule_show(self, movie: Movie, screen: Screen, start_time: datetime) -> Show:
        show_id = str(uuid.uuid4())[:8]
        show = Show(show_id, movie, screen, start_time)
        self.shows.append(show)
        print(f"Scheduled: {movie.title} on {screen.name} at {start_time.strftime('%Y-%m-%d %H:%M')}")
        return show

    def get_shows_for_movie(self, movie_id: str) -> list[Show]:
        return [s for s in self.shows if s.movie.movie_id == movie_id]

    def book_tickets(self, customer_id: str, show_id: str, seat_ids: list[str]) -> Booking:
        show = None
        for s in self.shows:
            if s.show_id == show_id:
                show = s
                break
        if show is None:
            raise ValueError(f"Show {show_id} not found")

        if not show.hold_seats(seat_ids, customer_id):
            raise ValueError("One or more selected seats are not available")

        booking = Booking(customer_id, show, seat_ids)
        booking.confirm()
        self.bookings[booking.booking_id] = booking
        return booking

    def cancel_booking(self, booking_id: str) -> bool:
        if booking_id not in self.bookings:
            raise ValueError(f"Booking {booking_id} not found")
        return self.bookings[booking_id].cancel()


# Test the system
if __name__ == "__main__":
    # Create theater
    theater = Theater("T1", "AMC Downtown", "123 Main St")

    # Configure screen with seats
    screen1 = Screen("S1", "Screen 1")
    screen1.configure_seats({
        "A": (10, SeatType.VIP),
        "B": (12, SeatType.PREMIUM),
        "C": (12, SeatType.PREMIUM),
        "D": (15, SeatType.REGULAR),
        "E": (15, SeatType.REGULAR),
    })
    theater.add_screen(screen1)

    # Add movie and schedule show
    movie = Movie("M1", "The Matrix", 136, "Sci-Fi", "R")
    show = theater.schedule_show(movie, screen1, datetime.now() + timedelta(hours=5))

    # View available seats
    available = show.get_available_seats()
    print(f"Available seats: {len(available)}")

    # Book tickets
    booking = theater.book_tickets("C001", show.show_id, ["A1", "A2", "A3"])
    print(f"Booking: {booking}")
    print(f"Total: \${booking.total:.2f}")

    # Check availability after booking
    available = show.get_available_seats()
    print(f"Available after booking: {len(available)}")

    # Cancel booking
    theater.cancel_booking(booking.booking_id)
`,
    },
    {
      id: "ood-movie-4",
      slug: "movie-booking-concurrency",
      title: "Movie Ticket Booking: Concurrent Bookings",
      content: `# Movie Ticket Booking: Concurrent Bookings

Handling concurrent seat bookings is the most challenging aspect of a ticket booking system. This is the question interviewers are most likely to ask about. Let us examine the problem and its solutions in depth.

## The Problem

Two customers simultaneously select and try to book the same seat:

\`\`\`
Time 0: Seat A1 is AVAILABLE
Time 1: Customer Alice sees A1 as available
Time 2: Customer Bob sees A1 as available
Time 3: Alice clicks "Book" -> Should succeed
Time 4: Bob clicks "Book" -> Should FAIL
\`\`\`

Without concurrency control, both bookings could succeed, resulting in a double booking.

## Solution 1: Temporary Hold with Timeout

Our implementation uses a **hold mechanism**. When a customer starts checkout, the seat is held for 10 minutes:

\`\`\`python
def hold(self, customer_id: str) -> bool:
    if not self.is_available():
        return False
    self.status = SeatStatus.HELD
    self.held_by = customer_id
    self.held_at = datetime.now()
    return True
\`\`\`

The \`is_available()\` method checks if a held seat has timed out:

\`\`\`python
def is_available(self) -> bool:
    if self.status == SeatStatus.AVAILABLE:
        return True
    if self.status == SeatStatus.HELD and self.held_at:
        timeout = self.held_at + timedelta(minutes=HOLD_TIMEOUT_MINUTES)
        if datetime.now() > timeout:
            self.release()
            return True
    return False
\`\`\`

This prevents indefinite locking. If a customer abandons checkout, the seat automatically becomes available after the timeout.

## Solution 2: Atomic Hold with Locking

The hold operation itself must be atomic. In a multi-threaded environment:

\`\`\`python
import threading

class ShowSeat:
    def __init__(self, seat):
        self.seat = seat
        self.status = SeatStatus.AVAILABLE
        self._lock = threading.Lock()

    def hold(self, customer_id: str) -> bool:
        with self._lock:
            if not self._is_available_unsafe():
                return False
            self.status = SeatStatus.HELD
            self.held_by = customer_id
            self.held_at = datetime.now()
            return True
\`\`\`

The lock ensures that checking availability and setting the hold happen **atomically** -- no other thread can interleave between the check and the update.

## Solution 3: Database-Level Optimistic Locking

In a production system with a database:

\`\`\`sql
-- Each ShowSeat row has a version column
UPDATE show_seats
SET status = 'HELD', held_by = :customer_id, version = version + 1
WHERE show_id = :show_id AND seat_id = :seat_id
  AND status = 'AVAILABLE' AND version = :expected_version
\`\`\`

If another transaction changed the seat between the read and update, the version will not match and zero rows will be affected. The application checks the affected row count and returns failure.

## Atomic Multi-Seat Booking

When a customer books multiple seats, all must succeed or all must fail:

\`\`\`python
def hold_seats(self, seat_ids: list[str], customer_id: str) -> bool:
    # Phase 1: Validate all seats are available
    for seat_id in seat_ids:
        if not self.show_seats[seat_id].is_available():
            return False

    # Phase 2: Hold all seats (with rollback on failure)
    held = []
    for seat_id in seat_ids:
        if self.show_seats[seat_id].hold(customer_id):
            held.append(seat_id)
        else:
            for h in held:
                self.show_seats[h].release()
            return False
    return True
\`\`\`

This implements the **all-or-nothing** principle. If the third seat in a group of four fails to hold, the first two are released.

## The Seat Selection Race Condition

Even showing available seats has a race condition -- by the time the customer clicks "Book," the seat might have been taken by someone else. Solutions:

1. **Real-time updates**: Use WebSockets to push seat status changes to all viewing customers
2. **Graceful failure**: When booking fails, show an updated seat map with the taken seats highlighted
3. **Auto-suggest alternatives**: If selected seats are taken, suggest the closest available seats

## Hold Timeout Background Worker

In production, a background worker periodically cleans up expired holds:

\`\`\`python
import time
import threading

def cleanup_expired_holds(show: Show, interval_seconds: int = 60):
    while True:
        time.sleep(interval_seconds)
        for show_seat in show.show_seats.values():
            if show_seat.status == SeatStatus.HELD and show_seat.held_at:
                timeout = show_seat.held_at + timedelta(minutes=HOLD_TIMEOUT_MINUTES)
                if datetime.now() > timeout:
                    show_seat.release()
\`\`\`

## Interview Talking Points

1. **Why not lock at the Show level?** Locking the entire show would prevent all concurrent bookings. Per-seat locking allows multiple customers to book different seats simultaneously.

2. **How does this scale?** For a show with 300 seats and 1000 concurrent users, per-seat locking creates at most 300 lock contentions. Most users select different seats, so actual contention is low.

3. **What about distributed systems?** Use Redis for distributed locks (\`SET seat:A1 HELD NX EX 600\`) or database row-level locks. The concept is the same; the mechanism changes.
`,
    },
    {
      id: "ood-movie-5",
      slug: "movie-booking-walkthrough",
      title: "Movie Ticket Booking: Walkthrough",
      content: `# Movie Ticket Booking System: Code Walkthrough

Let us trace through the complete lifecycle of a movie ticket booking, from theater setup to ticket cancellation.

## Architecture Overview

\`\`\`
Theater
  |
  +-- screens: list[Screen]
  |     |
  |     +-- seats: list[Seat]  (physical, permanent)
  |
  +-- shows: list[Show]
  |     |
  |     +-- movie: Movie
  |     +-- screen: Screen
  |     +-- show_seats: dict[seat_id, ShowSeat]  (per-show state)
  |
  +-- bookings: dict[booking_id, Booking]
        |
        +-- show: Show
        +-- seat_ids: list[str]
        +-- status: BookingStatus
\`\`\`

## Design Patterns Used

### 1. Singleton (Theater could be singleton)
If the system manages one theater, it could be a singleton. For a multi-theater system (like BookMyShow), it is better as a regular class.

### 2. Flyweight (Seat vs ShowSeat)
The \`Seat\` class acts as a **flyweight** -- it holds intrinsic state (row, number, type) that is shared across all shows. \`ShowSeat\` holds extrinsic state (availability for a specific show). This avoids duplicating seat metadata for every show.

### 3. Observer (for real-time updates)
In production, when a seat status changes, all clients viewing the same show should be notified. An Observer/Pub-Sub pattern would handle this.

### 4. State (Booking lifecycle)
The Booking transitions through states: PENDING -> CONFIRMED or CANCELLED. Each state has different valid operations.

## Walkthrough: Complete Booking Flow

### Phase 1: Theater Setup
\`\`\`python
theater = Theater("T1", "AMC Downtown", "123 Main St")
screen1 = Screen("S1", "Screen 1")
screen1.configure_seats({
    "A": (10, SeatType.VIP),        # 10 VIP seats
    "B": (12, SeatType.PREMIUM),    # 12 Premium seats
    "C": (15, SeatType.REGULAR),    # 15 Regular seats
})
theater.add_screen(screen1)
\`\`\`

The screen has a fixed layout of 37 seats across 3 rows.

### Phase 2: Schedule Shows
\`\`\`python
movie = Movie("M1", "The Matrix", 136, "Sci-Fi", "R")
show = theater.schedule_show(movie, screen1, show_time)
\`\`\`

When a Show is created, it calls \`_initialize_seats()\` which creates a ShowSeat for each physical Seat. All 37 ShowSeats start as AVAILABLE.

### Phase 3: Customer Selects Seats
\`\`\`python
available = show.get_available_seats()
# Returns 37 ShowSeat objects, all AVAILABLE
\`\`\`

The customer sees the seat map and selects seats A1, A2, A3 (three VIP seats).

### Phase 4: Book Tickets
\`\`\`python
booking = theater.book_tickets("C001", show.show_id, ["A1", "A2", "A3"])
\`\`\`

What happens internally:
1. Theater finds the Show by ID
2. \`show.hold_seats(["A1", "A2", "A3"], "C001")\` validates all three are available, then holds them
3. A Booking is created with total = 3 x $25.00 (VIP) = $75.00
4. \`booking.confirm()\` calls \`show.book_seats()\` which changes HELD -> BOOKED
5. The booking is stored in the theater's bookings dictionary

### Phase 5: Cancellation (if requested)
\`\`\`python
theater.cancel_booking(booking.booking_id)
\`\`\`

1. Checks the booking exists and is CONFIRMED
2. Checks that showtime is more than 2 hours away
3. Releases all three seats back to AVAILABLE
4. Sets booking status to CANCELLED

## SOLID Principles Applied

| Principle | Application |
|-----------|-------------|
| **SRP** | Movie = metadata, Seat = physical layout, ShowSeat = per-show state, Booking = transaction |
| **OCP** | New seat types (e.g., WHEELCHAIR) require only enum addition and price map update |
| **LSP** | Not heavily used -- composition over inheritance is the right choice here |
| **ISP** | Show exposes seat-related methods; Theater exposes booking methods; no bloated interfaces |
| **DIP** | Theater depends on Show and Booking abstractions |

## Common Interview Questions

**Q: How would you handle a movie running on multiple screens simultaneously?**
A: Already supported. Create multiple Show objects with the same Movie but different Screens. Each Show has its own independent ShowSeats.

**Q: How would you prevent scalping (one person booking all seats)?**
A: Add a MAX_SEATS_PER_BOOKING limit. Also, require identity verification and limit bookings per customer per show.

**Q: How would you implement seat recommendations?**
A: Add a method that considers seat ratings (center > edge, middle rows > front/back). Given the number of tickets requested, find the best contiguous group of available seats.
`,
    },
  ],
};
