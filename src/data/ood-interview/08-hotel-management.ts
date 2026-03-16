import { Module } from "../types";

export const hotelManagementModule: Module = {
  id: "ood-hotel",
  title: "Design a Hotel Management System",
  description: "Design a hotel management system handling reservations, room types, guest management, and booking conflict resolution.",
  lessons: [
    {
      id: "hotel-requirements",
      slug: "hotel-requirements",
      title: "Requirements & Use Cases",
      content: `# Hotel Management System — Requirements & Use Cases

## Problem Statement

Design a hotel management system that handles room reservations, check-in/check-out, room types, pricing, and guest management.

## Actors

| Actor | Description |
|---|---|
| **Guest** | Makes reservations, checks in/out |
| **Receptionist** | Manages walk-in bookings, handles check-in/out, assigns rooms |
| **Admin** | Manages room inventory, sets pricing, views reports |
| **System** | Sends confirmations, handles automatic cancellations |

## Core Use Cases

1. **Search rooms** — Find available rooms for given dates, room type, and guest count
2. **Make reservation** — Book a room for future dates
3. **Check in** — Assign physical room, collect payment, issue key
4. **Check out** — Process final bill, release room, collect feedback
5. **Cancel reservation** — Handle cancellation policies and refunds
6. **Manage rooms** — Add/remove rooms, set room types and pricing

## Key Design Considerations

- **Availability** — Must handle overlapping date ranges efficiently
- **Room assignment** — Reservation books a *type*, check-in assigns a *specific room*
- **Pricing** — Rates vary by room type, season, and occupancy
- **Conflict resolution** — Overbooking handling (industry standard: overbook by ~5%)
- **Cancellation policy** — Different rules based on timing (24h, 48h, non-refundable)`,
    },
    {
      id: "hotel-class-diagram",
      slug: "hotel-class-diagram",
      title: "Class Diagram & Relationships",
      content: `# Hotel Management System — Class Diagram

## Core Classes

\`\`\`
┌──────────────┐       ┌───────────────┐       ┌──────────────┐
│    Hotel     │──────▶│    Room       │       │   RoomType   │
│──────────────│  has  │───────────────│──────▶│──────────────│
│ name         │ many  │ room_number   │  is   │ type_name    │
│ address      │       │ floor         │  a    │ base_price   │
│ rooms[]      │       │ status        │       │ max_occupancy│
│──────────────│       │ room_type     │       │ amenities[]  │
│ search_rooms()│      │───────────────│       └──────────────┘
│ make_booking()│      │ is_available()│
└──────────────┘       │ check_in()   │
                       │ check_out()  │
                       └───────────────┘
                              │
                              │ assigned to
                              ▼
┌──────────────┐       ┌───────────────┐       ┌──────────────┐
│    Guest     │──────▶│  Reservation  │──────▶│   Payment    │
│──────────────│ makes │───────────────│  has  │──────────────│
│ guest_id     │       │ reservation_id│       │ payment_id   │
│ name         │       │ check_in_date │       │ amount       │
│ email        │       │ check_out_date│       │ method       │
│ phone        │       │ room_type     │       │ status       │
│ id_proof     │       │ room (assigned)│      │ timestamp    │
│──────────────│       │ status        │       └──────────────┘
│ reservations[]│      │ guests[]      │
└──────────────┘       │ total_cost    │
                       │───────────────│
                       │ cancel()      │
                       │ assign_room() │
                       └───────────────┘
\`\`\`

## Reservation Status Flow

\`\`\`
PENDING ──▶ CONFIRMED ──▶ CHECKED_IN ──▶ CHECKED_OUT
   │              │
   ▼              ▼
CANCELLED    CANCELLED (with policy)
\`\`\`

## Key Insight: Room Type vs. Room

A reservation books a **room type** (e.g., "Deluxe King"), not a specific room. The specific room (e.g., Room 305) is assigned at check-in. This is how real hotels work and prevents unnecessary conflicts.`,
    },
    {
      id: "hotel-implementation",
      slug: "hotel-implementation",
      title: "Implementation",
      content: `# Hotel Management System — Implementation

Implement the core classes with room search, reservation management, and check-in/check-out flows.`,
      starterCode: `from enum import Enum
from datetime import date, datetime
from typing import List, Optional

# ─── Enums ───────────────────────────────────────────────
class RoomStatus(Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"

class ReservationStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"

class PaymentStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    REFUNDED = "refunded"

class RoomTypeName(Enum):
    STANDARD = "standard"
    DELUXE = "deluxe"
    SUITE = "suite"
    PRESIDENTIAL = "presidential"

# ─── RoomType ────────────────────────────────────────────
class RoomType:
    def __init__(self, type_name, base_price, max_occupancy, amenities=None):
        self.type_name = type_name
        self.base_price = base_price
        self.max_occupancy = max_occupancy
        self.amenities = amenities or []

# ─── Room ────────────────────────────────────────────────
class Room:
    def __init__(self, room_number, floor, room_type):
        self.room_number = room_number
        self.floor = floor
        self.room_type = room_type
        self.status = RoomStatus.AVAILABLE

    # TODO: Implement is_available(check_in, check_out, reservations)

# ─── Guest ───────────────────────────────────────────────
class Guest:
    def __init__(self, guest_id, name, email, phone):
        self.guest_id = guest_id
        self.name = name
        self.email = email
        self.phone = phone

# ─── Reservation ─────────────────────────────────────────
class Reservation:
    _counter = 0
    def __init__(self, guest, room_type, check_in_date, check_out_date):
        Reservation._counter += 1
        self.reservation_id = Reservation._counter
        self.guest = guest
        self.room_type = room_type
        self.check_in_date = check_in_date
        self.check_out_date = check_out_date
        self.room = None  # assigned at check-in
        self.status = ReservationStatus.CONFIRMED
        # TODO: Calculate total_cost based on nights * base_price

    # TODO: Implement cancel()
    # TODO: Implement assign_room(room)
    # TODO: Implement check_in()
    # TODO: Implement check_out()

# ─── Hotel ───────────────────────────────────────────────
class Hotel:
    def __init__(self, name, address):
        self.name = name
        self.address = address
        self.rooms = []
        self.reservations = []

    def add_room(self, room):
        self.rooms.append(room)

    # TODO: Implement search_available_rooms(room_type, check_in, check_out)
    # TODO: Implement make_reservation(guest, room_type, check_in, check_out)
    # TODO: Implement check_in_guest(reservation_id)
    # TODO: Implement check_out_guest(reservation_id)

# ─── Test ────────────────────────────────────────────────
deluxe = RoomType(RoomTypeName.DELUXE, 200, 2, ["WiFi", "Mini Bar"])
suite = RoomType(RoomTypeName.SUITE, 400, 4, ["WiFi", "Mini Bar", "Jacuzzi"])

hotel = Hotel("Grand Hotel", "123 Main St")
for i in range(301, 306):
    hotel.add_room(Room(str(i), 3, deluxe))
for i in range(401, 403):
    hotel.add_room(Room(str(i), 4, suite))

guest = Guest("G001", "Alice Smith", "alice@example.com", "555-0100")
# Test: search, reserve, check-in, check-out
print("Testing Hotel Management System...")
`,
      solutionCode: `from enum import Enum
from datetime import date, datetime
from typing import List, Optional

class RoomStatus(Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"

class ReservationStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"

class PaymentStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    REFUNDED = "refunded"

class RoomTypeName(Enum):
    STANDARD = "standard"
    DELUXE = "deluxe"
    SUITE = "suite"
    PRESIDENTIAL = "presidential"

class RoomType:
    def __init__(self, type_name, base_price, max_occupancy, amenities=None):
        self.type_name = type_name
        self.base_price = base_price
        self.max_occupancy = max_occupancy
        self.amenities = amenities or []

class Room:
    def __init__(self, room_number, floor, room_type):
        self.room_number = room_number
        self.floor = floor
        self.room_type = room_type
        self.status = RoomStatus.AVAILABLE

    def is_available(self, check_in, check_out, reservations):
        if self.status == RoomStatus.MAINTENANCE:
            return False
        for res in reservations:
            if res.room == self and res.status in (ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN):
                if check_in < res.check_out_date and check_out > res.check_in_date:
                    return False
        return True

class Guest:
    def __init__(self, guest_id, name, email, phone):
        self.guest_id = guest_id
        self.name = name
        self.email = email
        self.phone = phone

class Reservation:
    _counter = 0
    def __init__(self, guest, room_type, check_in_date, check_out_date):
        Reservation._counter += 1
        self.reservation_id = Reservation._counter
        self.guest = guest
        self.room_type = room_type
        self.check_in_date = check_in_date
        self.check_out_date = check_out_date
        self.room = None
        self.status = ReservationStatus.CONFIRMED
        nights = (check_out_date - check_in_date).days
        self.total_cost = nights * room_type.base_price

    def cancel(self):
        if self.status in (ReservationStatus.CONFIRMED, ReservationStatus.PENDING):
            self.status = ReservationStatus.CANCELLED
            self.room = None
            return True
        return False

    def assign_room(self, room):
        self.room = room
        room.status = RoomStatus.OCCUPIED

    def check_in(self):
        if self.status == ReservationStatus.CONFIRMED and self.room:
            self.status = ReservationStatus.CHECKED_IN
            return True
        return False

    def check_out(self):
        if self.status == ReservationStatus.CHECKED_IN:
            self.status = ReservationStatus.CHECKED_OUT
            if self.room:
                self.room.status = RoomStatus.AVAILABLE
                self.room = None
            return True
        return False

class Hotel:
    def __init__(self, name, address):
        self.name = name
        self.address = address
        self.rooms = []
        self.reservations = []

    def add_room(self, room):
        self.rooms.append(room)

    def search_available_rooms(self, room_type, check_in, check_out):
        available = []
        for room in self.rooms:
            if room.room_type.type_name == room_type.type_name:
                if room.is_available(check_in, check_out, self.reservations):
                    available.append(room)
        return available

    def make_reservation(self, guest, room_type, check_in, check_out):
        available = self.search_available_rooms(room_type, check_in, check_out)
        if not available:
            print("No rooms available for requested dates.")
            return None
        reservation = Reservation(guest, room_type, check_in, check_out)
        reservation.assign_room(available[0])
        self.reservations.append(reservation)
        print(f"Reservation #\${reservation.reservation_id} confirmed. Room \${available[0].room_number}. Total: \${reservation.total_cost}")
        return reservation

    def check_in_guest(self, reservation_id):
        for res in self.reservations:
            if res.reservation_id == reservation_id:
                if res.check_in():
                    print(f"Guest \${res.guest.name} checked into room \${res.room.room_number}")
                    return True
                print("Cannot check in — reservation not confirmed or no room assigned.")
                return False
        print("Reservation not found.")
        return False

    def check_out_guest(self, reservation_id):
        for res in self.reservations:
            if res.reservation_id == reservation_id:
                if res.check_out():
                    print(f"Guest \${res.guest.name} checked out. Total: \${res.total_cost}")
                    return True
                print("Cannot check out — guest not checked in.")
                return False
        print("Reservation not found.")
        return False

# ─── Test ────────────────────────────────────────────────
deluxe = RoomType(RoomTypeName.DELUXE, 200, 2, ["WiFi", "Mini Bar"])
suite = RoomType(RoomTypeName.SUITE, 400, 4, ["WiFi", "Mini Bar", "Jacuzzi"])

hotel = Hotel("Grand Hotel", "123 Main St")
for i in range(301, 306):
    hotel.add_room(Room(str(i), 3, deluxe))
for i in range(401, 403):
    hotel.add_room(Room(str(i), 4, suite))

guest = Guest("G001", "Alice Smith", "alice@example.com", "555-0100")

# Search and book
available = hotel.search_available_rooms(deluxe, date(2024, 6, 15), date(2024, 6, 18))
print(f"Available deluxe rooms: \${[r.room_number for r in available]}")

res = hotel.make_reservation(guest, deluxe, date(2024, 6, 15), date(2024, 6, 18))
hotel.check_in_guest(res.reservation_id)
hotel.check_out_guest(res.reservation_id)
`,
    },
    {
      id: "hotel-booking-conflicts",
      slug: "hotel-booking-conflicts",
      title: "Booking Conflicts & Room Types",
      content: `# Hotel Management System — Booking Conflicts & Room Types

## Date Overlap Detection

The most critical algorithm in a hotel system is detecting whether two date ranges overlap. Two reservations conflict if:

\`\`\`
reservation1.check_in < reservation2.check_out AND
reservation1.check_out > reservation2.check_in
\`\`\`

This handles all overlap cases: partial overlap, full containment, and exact match.

## Overbooking Strategy

Real hotels intentionally overbook by 5-10% because ~8% of guests are no-shows. The system should:

1. **Track capacity** — How many rooms of each type exist
2. **Track confirmed reservations** — How many are booked for each date
3. **Allow overbooking up to threshold** — e.g., 105% of capacity
4. **Handle overflow** — Upgrade guest to a higher room type, or offer compensation

## Dynamic Pricing

Room pricing typically varies by:

| Factor | Example |
|---|---|
| **Season** | Summer: 1.3x multiplier, Winter: 0.9x |
| **Day of week** | Weekend: 1.2x, Weekday: 1.0x |
| **Occupancy** | >80% booked: 1.5x, <30% booked: 0.7x |
| **Advance booking** | >30 days: 0.85x, <7 days: 1.2x |

A **PricingStrategy** interface makes this pluggable:

\`\`\`python
class PricingStrategy(ABC):
    @abstractmethod
    def calculate_price(self, room_type, check_in, check_out, occupancy_rate):
        pass

class SeasonalPricing(PricingStrategy):
    def calculate_price(self, room_type, check_in, check_out, occupancy_rate):
        base = room_type.base_price
        nights = (check_out - check_in).days
        # Apply seasonal multiplier
        month = check_in.month
        if month in (6, 7, 8):  # summer
            return base * nights * 1.3
        return base * nights
\`\`\`

## Extension Points for Interview Discussion

- **Room upgrade logic** — When overbooking triggers, automatically upgrade to next tier
- **Group bookings** — Block of rooms with a single reservation and group discount
- **Loyalty program** — Points, tier status, and priority upgrades
- **Housekeeping integration** — Room status transitions: dirty → cleaning → inspected → available
- **Cancellation policy** — Free cancellation 48h+ before, 50% refund 24-48h, non-refundable <24h`,
    },
    {
      id: "hotel-walkthrough",
      slug: "hotel-code-walkthrough",
      title: "Code Walkthrough & Interview Tips",
      content: `# Hotel Management System — Code Walkthrough

## Interview Approach

### Key Design Decisions to Highlight

1. **Reservation books a type, not a room** — This is how real hotels work and dramatically simplifies availability management
2. **Date overlap detection** — The single most important algorithm. Get this right.
3. **Status state machine** — Pending → Confirmed → Checked In → Checked Out (with Cancelled branching)
4. **Separation of concerns** — Hotel manages inventory, Reservation manages booking lifecycle, Room manages physical state

### Common Follow-Up Questions

**Q: How would you handle concurrent reservations?**
Use optimistic locking: when two users try to book the last room simultaneously, the first to complete the transaction wins. The second gets a "room no longer available" message. At the database level, use a version column or SELECT FOR UPDATE.

**Q: How would you scale this for a hotel chain?**
- Each hotel is an independent entity with its own room inventory
- A CentralReservationSystem aggregates availability across hotels
- Caching layer for availability (invalidate on booking/cancellation)
- Event-driven architecture: booking events propagate to pricing, housekeeping, and loyalty systems

**Q: How do you handle no-shows?**
- Reservation status transitions to NO_SHOW after check-in date + grace period
- Charge the first night (or full stay for non-refundable)
- Release the room for walk-in guests

## Design Pattern Summary

| Pattern | Where Used | Why |
|---|---|---|
| **Strategy** | Pricing, Cancellation policy | Different algorithms for different contexts |
| **Observer** | Notifications on booking/cancellation | Decouple booking from email, housekeeping, loyalty |
| **Factory** | Room creation | Different room types with different amenities |
| **State** | Reservation lifecycle | Clean status transitions |

## Checklist Before Ending the Interview

- [ ] Class diagram with clear relationships
- [ ] Date overlap detection explained
- [ ] Reservation vs. Room assignment distinction
- [ ] At least one design pattern explicitly named
- [ ] Scalability consideration mentioned
- [ ] Error handling for common edge cases`,
    },
  ],
};
