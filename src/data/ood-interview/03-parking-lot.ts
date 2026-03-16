import { Module } from "../types";

export const parkingLotModule: Module = {
  id: "ood-parking-lot",
  title: "Design a Parking Lot System",
  description: "Design an object-oriented parking lot system supporting multiple vehicle types, floors, pricing strategies, and ticket management.",
  lessons: [
    {
      id: "ood-park-1",
      slug: "parking-lot-requirements",
      title: "Parking Lot: Requirements",
      content: `# Parking Lot System: Requirements

## Problem Statement

Design a Parking Lot system that manages multiple floors, supports different vehicle types, issues tickets, calculates fees, and handles entry/exit operations.

## Clarifying Questions & Answers

**Q: Who are the actors?**
- **Driver** -- Parks vehicle, pays fee, retrieves vehicle
- **Parking Attendant** -- Helps drivers, processes payments
- **Admin** -- Configures lot, sets pricing, views reports

**Q: What are the core use cases?**
1. Park a vehicle (assign spot, issue ticket)
2. Remove a vehicle (scan ticket, calculate fee, process payment)
3. Check spot availability by vehicle type
4. Display available spots per floor
5. Support multiple vehicle types (car, truck, motorcycle, handicapped)
6. Calculate parking fee based on duration

**Q: What are the constraints?**
- Parking lot has **multiple floors**
- Each floor has spots of different sizes
- A motorcycle spot can only hold motorcycles
- A compact spot can hold motorcycles or compact cars
- A large spot can hold any vehicle type
- Handicapped spots are reserved for vehicles with handicapped permits
- Pricing varies by vehicle type

**Q: Edge cases?**
- Lot is completely full
- Specific vehicle type spots are full but other spots exist
- Lost ticket scenario
- Vehicle overstays (daily maximum)

## Actors and Use Cases

\`\`\`
+------------------+     +----------------------------+
|     Driver       |     |     Admin                  |
+------------------+     +----------------------------+
| - Enter lot      |     | - Configure floors/spots   |
| - Park vehicle   |     | - Set pricing              |
| - Pay fee        |     | - View occupancy reports   |
| - Exit lot       |     | - Manage attendants        |
+------------------+     +----------------------------+
\`\`\`

## Key Entities

- **ParkingLot** -- The main system (Singleton -- only one lot)
- **ParkingFloor** -- A floor in the lot with multiple spots
- **ParkingSpot** -- An individual spot (has size and status)
- **Vehicle** -- Abstract base (Car, Truck, Motorcycle subclasses)
- **Ticket** -- Issued at entry, used for fee calculation
- **Payment** -- Processes the parking fee
- **EntrancePanel** -- Issues tickets at entry
- **ExitPanel** -- Scans tickets and collects payment
- **DisplayBoard** -- Shows available spots per floor

## Pricing Strategy

| Vehicle Type | Hourly Rate |
|-------------|-------------|
| Motorcycle  | $1.00       |
| Car         | $2.00       |
| Truck       | $3.00       |

Daily maximum: 10x the hourly rate.
`,
    },
    {
      id: "ood-park-2",
      slug: "parking-lot-class-diagram",
      title: "Parking Lot: Class Diagram",
      content: `# Parking Lot System: Class Diagram

## Core Classes and Relationships

\`\`\`mermaid
classDiagram
    ParkingLot "1" *-- "1..*" ParkingFloor
    ParkingFloor "1" *-- "1..*" ParkingSpot
    ParkingSpot --> Vehicle
    ParkingLot --> Ticket
    Ticket --> ParkingSpot
    Ticket --> Vehicle
    Vehicle <|-- Car
    Vehicle <|-- Truck
    Vehicle <|-- Motorcycle
    class ParkingLot {
        +park_vehicle()
        +remove_vehicle()
        +is_full()
    }
    class ParkingFloor {
        +get_free_spot()
    }
    class ParkingSpot {
        +can_fit()
        +park()
    }
    class Vehicle {
        <<abstract>>
        +license_plate
        +vehicle_type
    }
\`\`\`

\`\`\`
+---------------------+
|   VehicleType       |
|  <<enumeration>>    |
+---------------------+
| MOTORCYCLE          |
| CAR                 |
| TRUCK               |
+---------------------+

+---------------------+
|   SpotSize          |
|  <<enumeration>>    |
+---------------------+
| MOTORCYCLE          |
| COMPACT             |
| LARGE               |
| HANDICAPPED         |
+---------------------+

+---------------------+
|  TicketStatus       |
|  <<enumeration>>    |
+---------------------+
| ACTIVE              |
| PAID                |
| LOST                |
+---------------------+

+-----------------------+
|    Vehicle (ABC)      |
+-----------------------+
| - license_plate: str  |
| - vehicle_type: Type  |
+-----------------------+
        ^
        |
  +-----+------+--------+
  |            |         |
+------+ +--------+ +-------+
| Car  | | Truck  | | Moto  |
+------+ +--------+ +-------+

+------------------------+         +---------------------+
|     ParkingLot         |         |    ParkingFloor     |
| (Singleton)            | 1   1..*|                     |
+------------------------+---------+---------------------+
| - name: str            |         | - floor_number: int |
| - floors: list         |         | - spots: list       |
| - entrance_panels: list|         +---------------------+
| - exit_panels: list    |         | + get_free_spot()   |
+------------------------+         | + get_availability()|
| + park_vehicle()       |         +---------------------+
| + remove_vehicle()     |               |
| + get_availability()   |               | 1..*
| + is_full()            |               v
+------------------------+         +---------------------+
         |                         |    ParkingSpot      |
         | 1..*                    +---------------------+
         v                         | - spot_id: str      |
+---------------------+            | - size: SpotSize    |
|      Ticket         |            | - vehicle: Vehicle  |
+---------------------+            | - is_free: bool     |
| - ticket_id: str    |            +---------------------+
| - vehicle: Vehicle  |            | + park(vehicle)     |
| - spot: ParkingSpot |            | + remove_vehicle()  |
| - entry_time: dt    |            | + can_fit(vehicle)  |
| - exit_time: dt     |            +---------------------+
| - status: Status    |
+---------------------+
| + calculate_fee()   |
+---------------------+
\`\`\`

## Relationship Details

### Composition
- **ParkingLot *--- ParkingFloor**: Floors are part of the lot
- **ParkingFloor *--- ParkingSpot**: Spots are part of a floor

### Inheritance
- **Vehicle <|-- Car, Truck, Motorcycle**: Different vehicle types

### Association
- **ParkingSpot --> Vehicle**: A spot may hold one vehicle
- **Ticket --> ParkingSpot**: A ticket references the assigned spot
- **Ticket --> Vehicle**: A ticket records which vehicle is parked

## Design Decisions

1. **Singleton for ParkingLot**: There is only one parking lot instance. This ensures consistent state management.

2. **SpotSize vs VehicleType**: These are separate enums because the mapping between them is not 1:1. A COMPACT spot can fit a MOTORCYCLE or a CAR. A LARGE spot can fit anything.

3. **Ticket as the bridge**: The Ticket connects a Vehicle to a ParkingSpot and records timing information. It is the receipt of the transaction.

4. **ParkingFloor handles spot allocation**: Each floor knows its own spots and can find a free spot for a given vehicle type. This distributes responsibility and avoids a monolithic ParkingLot class.
`,
    },
    {
      id: "ood-park-3",
      slug: "parking-lot-implementation",
      title: "Parking Lot: Implementation",
      content: `# Parking Lot System: Implementation

Implement the parking lot system with support for multiple vehicle types, floor-based spot allocation, ticket management, and fee calculation.

## Implementation Goals

- Singleton ParkingLot with multiple floors
- Vehicle type hierarchy with inheritance
- Smart spot allocation (smallest suitable spot first)
- Time-based fee calculation with hourly rates
- Thread-safe spot assignment
`,
      starterCode: `from abc import ABC, abstractmethod
from enum import Enum
from datetime import datetime, timedelta
from typing import Optional
import uuid


class VehicleType(Enum):
    MOTORCYCLE = "motorcycle"
    CAR = "car"
    TRUCK = "truck"


class SpotSize(Enum):
    MOTORCYCLE = "motorcycle"
    COMPACT = "compact"
    LARGE = "large"
    HANDICAPPED = "handicapped"


class TicketStatus(Enum):
    ACTIVE = "active"
    PAID = "paid"
    LOST = "lost"


# Mapping: which spot sizes can hold which vehicle types
SPOT_VEHICLE_COMPATIBILITY = {
    SpotSize.MOTORCYCLE: [VehicleType.MOTORCYCLE],
    SpotSize.COMPACT: [VehicleType.MOTORCYCLE, VehicleType.CAR],
    SpotSize.LARGE: [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
    SpotSize.HANDICAPPED: [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
}

HOURLY_RATES = {
    VehicleType.MOTORCYCLE: 1.00,
    VehicleType.CAR: 2.00,
    VehicleType.TRUCK: 3.00,
}


class Vehicle(ABC):
    def __init__(self, license_plate: str, vehicle_type: VehicleType):
        self.license_plate = license_plate
        self.vehicle_type = vehicle_type

    def __repr__(self):
        return f"{self.vehicle_type.value}({self.license_plate})"


class Car(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.CAR)


class Truck(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.TRUCK)


class Motorcycle(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.MOTORCYCLE)


class ParkingSpot:
    def __init__(self, spot_id: str, size: SpotSize, floor_number: int):
        self.spot_id = spot_id
        self.size = size
        self.floor_number = floor_number
        self.vehicle: Optional[Vehicle] = None
        self.is_free = True

    def can_fit(self, vehicle: Vehicle) -> bool:
        # TODO: Check if spot is free AND vehicle type is compatible with spot size
        pass

    def park(self, vehicle: Vehicle):
        # TODO: Park vehicle in spot (raise error if cannot fit)
        pass

    def remove_vehicle(self) -> Optional[Vehicle]:
        # TODO: Remove and return the vehicle, mark spot as free
        pass


class Ticket:
    def __init__(self, vehicle: Vehicle, spot: ParkingSpot):
        self.ticket_id = str(uuid.uuid4())[:8]
        self.vehicle = vehicle
        self.spot = spot
        self.entry_time = datetime.now()
        self.exit_time: Optional[datetime] = None
        self.status = TicketStatus.ACTIVE
        self.amount_paid: float = 0.0

    def calculate_fee(self) -> float:
        # TODO: Calculate fee based on duration and vehicle type
        # Use HOURLY_RATES, charge per hour (round up partial hours)
        # Daily max = 10x hourly rate
        pass


class ParkingFloor:
    def __init__(self, floor_number: int, spots: list[ParkingSpot]):
        self.floor_number = floor_number
        self.spots = spots

    def get_free_spot(self, vehicle: Vehicle) -> Optional[ParkingSpot]:
        # TODO: Find first available spot that can fit the vehicle
        # Prefer smallest suitable spot first
        pass

    def get_availability(self) -> dict[str, int]:
        # TODO: Return count of free spots by size type
        pass


class ParkingLot:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, name: str, floors: list[ParkingFloor]):
        if self._initialized:
            return
        self._initialized = True
        self.name = name
        self.floors = floors
        self.active_tickets: dict[str, Ticket] = {}  # ticket_id -> Ticket

    def park_vehicle(self, vehicle: Vehicle) -> Ticket:
        # TODO: Find a spot across all floors, create ticket
        pass

    def remove_vehicle(self, ticket_id: str) -> float:
        # TODO: Calculate fee, remove vehicle from spot, return fee
        pass

    def get_availability(self) -> dict[int, dict[str, int]]:
        # TODO: Return availability per floor
        pass

    def is_full(self) -> bool:
        # TODO: Check if all spots across all floors are taken
        pass


# Test the system
if __name__ == "__main__":
    # Create parking lot with 2 floors
    pass
`,
      solutionCode: `from abc import ABC, abstractmethod
from enum import Enum
from datetime import datetime, timedelta
from typing import Optional
import uuid
import math


class VehicleType(Enum):
    MOTORCYCLE = "motorcycle"
    CAR = "car"
    TRUCK = "truck"


class SpotSize(Enum):
    MOTORCYCLE = "motorcycle"
    COMPACT = "compact"
    LARGE = "large"
    HANDICAPPED = "handicapped"


class TicketStatus(Enum):
    ACTIVE = "active"
    PAID = "paid"
    LOST = "lost"


SPOT_VEHICLE_COMPATIBILITY = {
    SpotSize.MOTORCYCLE: [VehicleType.MOTORCYCLE],
    SpotSize.COMPACT: [VehicleType.MOTORCYCLE, VehicleType.CAR],
    SpotSize.LARGE: [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
    SpotSize.HANDICAPPED: [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
}

HOURLY_RATES = {
    VehicleType.MOTORCYCLE: 1.00,
    VehicleType.CAR: 2.00,
    VehicleType.TRUCK: 3.00,
}

# Priority order: try smallest spot first
SPOT_SIZE_PRIORITY = [SpotSize.MOTORCYCLE, SpotSize.COMPACT, SpotSize.LARGE, SpotSize.HANDICAPPED]


class Vehicle(ABC):
    def __init__(self, license_plate: str, vehicle_type: VehicleType):
        self.license_plate = license_plate
        self.vehicle_type = vehicle_type

    def __repr__(self):
        return f"{self.vehicle_type.value}({self.license_plate})"


class Car(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.CAR)


class Truck(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.TRUCK)


class Motorcycle(Vehicle):
    def __init__(self, license_plate: str):
        super().__init__(license_plate, VehicleType.MOTORCYCLE)


class ParkingSpot:
    def __init__(self, spot_id: str, size: SpotSize, floor_number: int):
        self.spot_id = spot_id
        self.size = size
        self.floor_number = floor_number
        self.vehicle: Optional[Vehicle] = None
        self.is_free = True

    def can_fit(self, vehicle: Vehicle) -> bool:
        return self.is_free and vehicle.vehicle_type in SPOT_VEHICLE_COMPATIBILITY[self.size]

    def park(self, vehicle: Vehicle):
        if not self.can_fit(vehicle):
            raise ValueError(f"Spot {self.spot_id} cannot fit {vehicle}")
        self.vehicle = vehicle
        self.is_free = False

    def remove_vehicle(self) -> Optional[Vehicle]:
        vehicle = self.vehicle
        self.vehicle = None
        self.is_free = True
        return vehicle

    def __repr__(self):
        status = "Free" if self.is_free else f"Occupied({self.vehicle})"
        return f"Spot({self.spot_id}, {self.size.value}, {status})"


class Ticket:
    def __init__(self, vehicle: Vehicle, spot: ParkingSpot):
        self.ticket_id = str(uuid.uuid4())[:8]
        self.vehicle = vehicle
        self.spot = spot
        self.entry_time = datetime.now()
        self.exit_time: Optional[datetime] = None
        self.status = TicketStatus.ACTIVE
        self.amount_paid: float = 0.0

    def calculate_fee(self) -> float:
        exit_time = self.exit_time if self.exit_time else datetime.now()
        duration = exit_time - self.entry_time
        hours = math.ceil(duration.total_seconds() / 3600)
        hours = max(1, hours)  # Minimum 1 hour charge
        hourly_rate = HOURLY_RATES[self.vehicle.vehicle_type]
        daily_max = hourly_rate * 10
        fee = hours * hourly_rate
        return min(fee, daily_max)

    def __repr__(self):
        return f"Ticket({self.ticket_id}, {self.vehicle}, {self.status.value})"


class ParkingFloor:
    def __init__(self, floor_number: int, spots: list[ParkingSpot]):
        self.floor_number = floor_number
        self.spots = spots

    def get_free_spot(self, vehicle: Vehicle) -> Optional[ParkingSpot]:
        # Try smallest compatible spot first
        for size in SPOT_SIZE_PRIORITY:
            for spot in self.spots:
                if spot.size == size and spot.can_fit(vehicle):
                    return spot
        return None

    def get_availability(self) -> dict[str, int]:
        availability = {}
        for size in SpotSize:
            free_count = sum(1 for s in self.spots if s.size == size and s.is_free)
            total_count = sum(1 for s in self.spots if s.size == size)
            if total_count > 0:
                availability[size.value] = free_count
        return availability


class ParkingLot:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, name: str, floors: list[ParkingFloor]):
        if self._initialized:
            return
        self._initialized = True
        self.name = name
        self.floors = floors
        self.active_tickets: dict[str, Ticket] = {}

    @classmethod
    def reset_instance(cls):
        """For testing purposes."""
        cls._instance = None

    def park_vehicle(self, vehicle: Vehicle) -> Ticket:
        for floor in self.floors:
            spot = floor.get_free_spot(vehicle)
            if spot:
                spot.park(vehicle)
                ticket = Ticket(vehicle, spot)
                self.active_tickets[ticket.ticket_id] = ticket
                print(f"Parked {vehicle} at spot {spot.spot_id} (Floor {floor.floor_number})")
                return ticket
        raise ValueError(f"No available spot for {vehicle}. Parking lot is full for this vehicle type.")

    def remove_vehicle(self, ticket_id: str) -> float:
        if ticket_id not in self.active_tickets:
            raise ValueError(f"Invalid ticket: {ticket_id}")
        ticket = self.active_tickets[ticket_id]
        if ticket.status != TicketStatus.ACTIVE:
            raise ValueError(f"Ticket {ticket_id} is already {ticket.status.value}")
        ticket.exit_time = datetime.now()
        fee = ticket.calculate_fee()
        ticket.amount_paid = fee
        ticket.status = TicketStatus.PAID
        ticket.spot.remove_vehicle()
        del self.active_tickets[ticket_id]
        print(f"Vehicle {ticket.vehicle} removed. Fee: \${fee:.2f}")
        return fee

    def get_availability(self) -> dict[int, dict[str, int]]:
        return {floor.floor_number: floor.get_availability() for floor in self.floors}

    def is_full(self) -> bool:
        return all(
            all(not spot.is_free for spot in floor.spots)
            for floor in self.floors
        )


def create_floor(floor_num: int, motorcycle: int, compact: int, large: int, handicapped: int) -> ParkingFloor:
    spots = []
    counter = 1
    for size, count in [
        (SpotSize.MOTORCYCLE, motorcycle),
        (SpotSize.COMPACT, compact),
        (SpotSize.LARGE, large),
        (SpotSize.HANDICAPPED, handicapped),
    ]:
        for _ in range(count):
            spot_id = f"F{floor_num}-{size.value[0].upper()}{counter}"
            spots.append(ParkingSpot(spot_id, size, floor_num))
            counter += 1
    return ParkingFloor(floor_num, spots)


# Test the system
if __name__ == "__main__":
    ParkingLot.reset_instance()

    floor1 = create_floor(1, motorcycle=5, compact=20, large=10, handicapped=3)
    floor2 = create_floor(2, motorcycle=5, compact=20, large=10, handicapped=3)

    lot = ParkingLot("Downtown Parking", [floor1, floor2])

    # Park vehicles
    car1 = Car("ABC-123")
    truck1 = Truck("TRK-456")
    moto1 = Motorcycle("MOT-789")

    t1 = lot.park_vehicle(car1)
    t2 = lot.park_vehicle(truck1)
    t3 = lot.park_vehicle(moto1)

    # Check availability
    print("\\nAvailability:", lot.get_availability())

    # Remove vehicle
    fee = lot.remove_vehicle(t1.ticket_id)
    print(f"\\nCar fee: \${fee:.2f}")
    print("Is full:", lot.is_full())
`,
    },
    {
      id: "ood-park-4",
      slug: "parking-lot-vehicle-types-pricing",
      title: "Parking Lot: Vehicle Types & Pricing",
      content: `# Parking Lot: Vehicle Types & Pricing

This lesson dives deeper into two critical design aspects: the vehicle type hierarchy and the pricing strategy. Both are common follow-up topics in OOD interviews.

## Vehicle Type Hierarchy

Our design uses **inheritance** for vehicle types. The base \`Vehicle\` class is abstract, and each subclass (\`Car\`, \`Truck\`, \`Motorcycle\`) defines its type.

\`\`\`
       Vehicle (ABC)
       /    |     \\
     Car  Truck  Motorcycle
\`\`\`

**Why inheritance here?** Because different vehicle types have fundamentally different **physical properties** (size) that determine which spots they can use. This is a classic "is-a" relationship.

**Alternative: Could we use composition instead?** Yes -- we could have a single Vehicle class with a VehicleType enum attribute. For this problem, either approach works. Inheritance is better if vehicles have type-specific behavior (e.g., trucks need loading docks). Composition is simpler if the only difference is the type label.

## Spot-Vehicle Compatibility

The mapping between spot sizes and vehicle types is a key design decision. We use a compatibility dictionary:

\`\`\`python
SPOT_VEHICLE_COMPATIBILITY = {
    SpotSize.MOTORCYCLE: [VehicleType.MOTORCYCLE],
    SpotSize.COMPACT:    [VehicleType.MOTORCYCLE, VehicleType.CAR],
    SpotSize.LARGE:      [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
    SpotSize.HANDICAPPED:[VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
}
\`\`\`

This makes the system **open for extension** (OCP). To add a new vehicle type like \`Bus\`, you:
1. Add \`BUS\` to VehicleType enum
2. Add a Bus class extending Vehicle
3. Update the compatibility dictionary
4. No existing classes need modification

## Smart Spot Allocation

Our system allocates the **smallest suitable spot** first. This maximizes lot capacity:

\`\`\`python
SPOT_SIZE_PRIORITY = [SpotSize.MOTORCYCLE, SpotSize.COMPACT, SpotSize.LARGE, SpotSize.HANDICAPPED]

def get_free_spot(self, vehicle: Vehicle) -> Optional[ParkingSpot]:
    for size in SPOT_SIZE_PRIORITY:
        for spot in self.spots:
            if spot.size == size and spot.can_fit(vehicle):
                return spot
    return None
\`\`\`

A motorcycle gets a motorcycle spot first, then compact, then large. This prevents small vehicles from taking large spots unnecessarily.

## Pricing Strategy

Our current pricing uses a simple dictionary lookup. But in a real system, pricing may change based on time of day, demand, or vehicle type. This is a perfect case for the **Strategy pattern**:

\`\`\`python
from abc import ABC, abstractmethod

class PricingStrategy(ABC):
    @abstractmethod
    def calculate_fee(self, hours: float, vehicle_type: VehicleType) -> float:
        pass

class FlatRatePricing(PricingStrategy):
    def calculate_fee(self, hours: float, vehicle_type: VehicleType) -> float:
        return math.ceil(hours) * HOURLY_RATES[vehicle_type]

class DynamicPricing(PricingStrategy):
    def __init__(self, surge_multiplier: float = 1.0):
        self.surge_multiplier = surge_multiplier

    def calculate_fee(self, hours: float, vehicle_type: VehicleType) -> float:
        base = math.ceil(hours) * HOURLY_RATES[vehicle_type]
        return base * self.surge_multiplier

class WeekendPricing(PricingStrategy):
    def calculate_fee(self, hours: float, vehicle_type: VehicleType) -> float:
        base = math.ceil(hours) * HOURLY_RATES[vehicle_type]
        if datetime.now().weekday() >= 5:  # Saturday or Sunday
            return base * 1.5
        return base
\`\`\`

Now the ParkingLot can accept a pricing strategy at construction:

\`\`\`python
class ParkingLot:
    def __init__(self, name, floors, pricing: PricingStrategy):
        self.pricing = pricing
\`\`\`

This follows OCP -- new pricing models can be added without modifying existing classes.

## Handicapped Spots

Handicapped spots deserve special consideration. In a real system:
- They should only be assigned to vehicles with handicapped permits
- They should be closest to elevators/entrances
- Misuse may incur penalties

\`\`\`python
class Vehicle(ABC):
    def __init__(self, license_plate, vehicle_type, handicapped_permit=False):
        self.license_plate = license_plate
        self.vehicle_type = vehicle_type
        self.handicapped_permit = handicapped_permit
\`\`\`

The spot allocation logic would check \`vehicle.handicapped_permit\` before assigning a handicapped spot.

## Interview Discussion Points

When the interviewer asks about extensions:
1. **Electric vehicle charging spots** -- Add a ChargingSpot subclass of ParkingSpot with a charge_rate attribute
2. **Valet parking** -- Add a ValetService class that queues vehicles and assigns spots automatically
3. **Monthly passes** -- Add a Subscription class that bypasses per-visit ticketing
4. **Multi-entry discount** -- Track visit history per license plate and apply loyalty pricing
`,
    },
    {
      id: "ood-park-5",
      slug: "parking-lot-walkthrough",
      title: "Parking Lot: Walkthrough",
      content: `# Parking Lot System: Code Walkthrough

Let us trace through the complete lifecycle of a vehicle in our parking lot system, examining how all the components interact.

## Architecture Overview

\`\`\`
ParkingLot (Singleton)
  |
  +-- floors: list[ParkingFloor]
  |     |
  |     +-- spots: list[ParkingSpot]
  |           |
  |           +-- vehicle: Vehicle | None
  |
  +-- active_tickets: dict[ticket_id, Ticket]
        |
        +-- vehicle: Vehicle
        +-- spot: ParkingSpot
        +-- entry_time, exit_time
\`\`\`

## Full Lifecycle: Entry to Exit

### Phase 1: Vehicle Arrives

\`\`\`python
car = Car("ABC-123")
ticket = lot.park_vehicle(car)
\`\`\`

**What happens:**
1. \`ParkingLot.park_vehicle()\` iterates through floors
2. Each \`ParkingFloor.get_free_spot()\` checks spots in size priority order
3. The car gets a COMPACT spot (smallest that fits), not a LARGE spot
4. \`ParkingSpot.park()\` sets \`vehicle\` and \`is_free = False\`
5. A \`Ticket\` is created with the vehicle, spot, and current timestamp
6. The ticket is stored in \`active_tickets\`

### Phase 2: Time Passes

The vehicle occupies the spot. The display board (if implemented) shows reduced availability on that floor. Other vehicles arriving see updated spot counts.

### Phase 3: Vehicle Exits

\`\`\`python
fee = lot.remove_vehicle(ticket.ticket_id)
\`\`\`

**What happens:**
1. \`ParkingLot.remove_vehicle()\` looks up the ticket by ID
2. Validates the ticket is ACTIVE
3. Sets \`exit_time\` to current time
4. \`Ticket.calculate_fee()\` computes: \`ceil(hours) * hourly_rate\`, capped at daily max
5. Ticket status becomes PAID
6. \`ParkingSpot.remove_vehicle()\` clears the vehicle and sets \`is_free = True\`
7. Ticket is removed from active_tickets
8. Fee amount is returned

## Design Patterns Used

### 1. Singleton (ParkingLot)
Only one ParkingLot instance exists. The \`__new__\` method checks if an instance already exists before creating a new one. This ensures all entry/exit operations share the same state.

### 2. Strategy (Pricing -- extensible)
While our implementation uses a simple dictionary lookup, the pricing lesson showed how to apply the Strategy pattern for interchangeable pricing algorithms.

### 3. Template Method (Spot Allocation)
The \`get_free_spot\` method follows a template: iterate sizes in priority order, for each size check each spot. Subclasses could override the priority order or filtering logic.

## Concurrency Considerations

In a real parking lot with multiple entrance gates, two vehicles might simultaneously try to claim the last spot. Solutions:

\`\`\`python
import threading

class ParkingLot:
    def __init__(self, name, floors):
        self._lock = threading.Lock()
        # ...

    def park_vehicle(self, vehicle):
        with self._lock:
            # Atomic spot allocation
            for floor in self.floors:
                spot = floor.get_free_spot(vehicle)
                if spot:
                    spot.park(vehicle)
                    ticket = Ticket(vehicle, spot)
                    self.active_tickets[ticket.ticket_id] = ticket
                    return ticket
            raise ValueError("No spot available")
\`\`\`

A finer-grained approach: lock per floor or per spot, reducing contention.

## SOLID Principles Applied

| Principle | Application |
|-----------|-------------|
| **SRP** | ParkingSpot manages one spot, ParkingFloor manages spot allocation, Ticket handles fees |
| **OCP** | New vehicle types or spot sizes require only enum additions and compatibility updates |
| **LSP** | Car, Truck, Motorcycle all substitute for Vehicle without issues |
| **ISP** | Each class has a focused interface -- ParkingSpot does not know about pricing |
| **DIP** | ParkingLot depends on Vehicle abstraction, not concrete Car/Truck classes |

## Common Interview Follow-ups

**Q: How would you handle a multi-story lot where floors have different spot distributions?**
A: Already handled -- each ParkingFloor is constructed with its own spots. Floor 1 might have more handicapped spots near the entrance.

**Q: How would you implement a display board?**
A: Use the Observer pattern. The DisplayBoard subscribes to ParkingFloor events. When a spot changes state, the floor notifies the board to update its display.

**Q: How would you handle lost tickets?**
A: Charge the daily maximum rate. Create a \`process_lost_ticket\` method that searches active_tickets by license plate, charges the max fee, and releases the spot.

**Q: What if the system crashes mid-operation?**
A: Persist state to a database. Use transactions for atomic operations. On restart, reconcile in-memory state with physical spot sensors (if available).
`,
    },
  ],
};
