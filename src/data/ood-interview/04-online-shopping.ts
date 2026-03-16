import { Module } from "../types";

export const onlineShoppingModule: Module = {
  id: "ood-online-shopping",
  title: "Design an Online Shopping System",
  description: "Design an object-oriented e-commerce system with products, shopping cart, orders, inventory management, and payment processing.",
  lessons: [
    {
      id: "ood-shop-1",
      slug: "online-shopping-requirements",
      title: "Online Shopping: Requirements",
      content: `# Online Shopping System: Requirements

## Problem Statement

Design an Online Shopping System (like Amazon) that allows customers to browse products, add items to their cart, place orders, and process payments. The system must manage inventory and track order status.

## Clarifying Questions & Answers

**Q: Who are the actors?**
- **Customer** -- Browse products, manage cart, place orders, track orders
- **Seller** -- List products, manage inventory, fulfill orders
- **Admin** -- Manage users, handle disputes, view analytics
- **System** -- Process payments, update inventory, send notifications

**Q: What are the core use cases?**
1. Search and browse products by name or category
2. Add/remove items to/from shopping cart
3. Update item quantity in cart
4. Place an order (checkout)
5. Process payment (credit card, PayPal)
6. Track order status
7. Manage product inventory
8. Apply discount codes

**Q: What are the constraints?**
- A customer can have only **one active cart**
- Inventory must be checked at checkout time (not when adding to cart)
- Multiple payment methods supported
- Orders go through states: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED
- Products can belong to multiple categories

**Q: Edge cases?**
- Item goes out of stock between adding to cart and checkout
- Concurrent purchases deplete last inventory item
- Payment fails after order is placed
- Customer cancels order after payment

## Key Entities

\`\`\`
+-------------------+     +-------------------+
|     Customer      |     |      Seller       |
+-------------------+     +-------------------+
| - Browse products |     | - List products   |
| - Manage cart     |     | - Manage stock    |
| - Place order     |     | - Fulfill orders  |
| - Track order     |     | - View sales      |
+-------------------+     +-------------------+
\`\`\`

Core classes extracted from requirements:
- **Product** -- Name, description, price, category, seller
- **ProductCategory** -- Hierarchical categories
- **ShoppingCart** -- Items with quantities for a customer
- **CartItem** -- Product reference + quantity
- **Order** -- Placed from a cart, has status lifecycle
- **OrderItem** -- Snapshot of product at time of order (price locked)
- **Payment** -- Amount, method, status
- **Customer** -- Profile, cart, order history
- **Inventory** -- Tracks stock count per product
- **Address** -- Shipping and billing addresses

## State Transitions

Order states follow a strict lifecycle:

\`\`\`
PENDING --> CONFIRMED --> SHIPPED --> DELIVERED
   |           |
   v           v
CANCELLED   CANCELLED (with refund)
\`\`\`

Payment states:

\`\`\`
PENDING --> COMPLETED --> REFUNDED
   |
   v
FAILED
\`\`\`
`,
    },
    {
      id: "ood-shop-2",
      slug: "online-shopping-class-diagram",
      title: "Online Shopping: Class Diagram",
      content: `# Online Shopping System: Class Diagram

## Core Classes and Relationships

\`\`\`
+---------------------+
|   OrderStatus       |
|  <<enumeration>>    |
+---------------------+
| PENDING             |
| CONFIRMED           |
| SHIPPED             |
| DELIVERED           |
| CANCELLED           |
+---------------------+

+---------------------+
|  PaymentStatus      |
|  <<enumeration>>    |
+---------------------+
| PENDING             |
| COMPLETED           |
| FAILED              |
| REFUNDED            |
+---------------------+

+---------------------+
|  PaymentMethod      |
|  <<enumeration>>    |
+---------------------+
| CREDIT_CARD         |
| DEBIT_CARD          |
| PAYPAL              |
+---------------------+

+-------------------+        +-------------------+
|    Customer       |        |     Product       |
+-------------------+  1   * +-------------------+
| - customer_id     |        | - product_id: str |
| - name: str       |        | - name: str       |
| - email: str      |        | - description: str|
| - address: Address|        | - price: float    |
| - cart: Cart      |        | - category: str   |
| - orders: list    |        +-------------------+
+-------------------+        | + get_price()     |
| + add_to_cart()   |        +-------------------+
| + place_order()   |               |
| + view_orders()   |               | 1
+-------------------+               v
        |                    +-------------------+
        | 1                  |    Inventory      |
        v                    +-------------------+
+-------------------+        | - product: Product|
|  ShoppingCart     |        | - quantity: int   |
+-------------------+        +-------------------+
| - items: list     |        | + check_stock()   |
| - customer: Cust. |        | + reserve()       |
+-------------------+        | + release()       |
| + add_item()      |        +-------------------+
| + remove_item()   |
| + update_qty()    |
| + get_total()     |        +-------------------+
| + clear()         |        |    Payment        |
+-------------------+        +-------------------+
        |                    | - payment_id: str |
        | creates            | - amount: float   |
        v                    | - method: Method  |
+-------------------+        | - status: Status  |
|     Order         |        +-------------------+
+-------------------+ 1    1 | + process()       |
| - order_id: str   |--------| + refund()        |
| - items: list     |        +-------------------+
| - status: Status  |
| - total: float    |
| - payment: Payment|
| - shipping_addr   |
| - order_date: dt  |
+-------------------+
| + confirm()       |
| + ship()          |
| + deliver()       |
| + cancel()        |
+-------------------+
\`\`\`

## Relationship Details

### Composition
- **Customer *--- ShoppingCart**: Each customer has exactly one cart. Cart cannot exist without customer.
- **Order *--- OrderItem**: Order items are part of the order.

### Association
- **Order --> Payment**: An order has one payment. Payment can be queried independently.
- **CartItem --> Product**: Cart items reference products from the catalog.
- **Order --> Address**: Shipping address for delivery.

### Aggregation
- **ShoppingCart <>--- CartItem**: Cart contains items, but items reference products that exist independently.

## Key Design Decisions

1. **CartItem vs direct Product reference**: CartItem stores the product reference AND quantity. This separates "what is in the cart" from "what exists in the catalog."

2. **OrderItem snapshots price**: When an order is placed, the price is copied from the Product to the OrderItem. This prevents price changes from affecting existing orders.

3. **Inventory as separate class**: Inventory management is decoupled from Product. This follows SRP -- Product stores metadata, Inventory tracks stock levels.

4. **Payment abstraction**: Payment is its own class with a status lifecycle. This allows different payment methods without changing Order logic.
`,
    },
    {
      id: "ood-shop-3",
      slug: "online-shopping-implementation",
      title: "Online Shopping: Implementation",
      content: `# Online Shopping System: Implementation

Implement the core e-commerce classes: Product catalog, ShoppingCart, Order placement, Payment processing, and Inventory management.

## Implementation Goals

- Product catalog with categories and search
- Shopping cart with add, remove, update quantity
- Order creation from cart with price snapshot
- Payment processing with status tracking
- Inventory validation at checkout time
`,
      starterCode: `from enum import Enum
from datetime import datetime
from typing import Optional
import uuid


class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"


class Address:
    def __init__(self, street: str, city: str, state: str, zip_code: str, country: str):
        self.street = street
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.country = country

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}, {self.country}"


class Product:
    def __init__(self, product_id: str, name: str, description: str, price: float, category: str):
        self.product_id = product_id
        self.name = name
        self.description = description
        self.price = price
        self.category = category

    def get_price(self) -> float:
        return self.price


class Inventory:
    def __init__(self):
        self._stock: dict[str, int] = {}  # product_id -> quantity

    def add_stock(self, product_id: str, quantity: int):
        # TODO: Add quantity to existing stock
        pass

    def check_stock(self, product_id: str) -> int:
        # TODO: Return current stock for product
        pass

    def reserve(self, product_id: str, quantity: int) -> bool:
        # TODO: Reduce stock if available, return True/False
        pass

    def release(self, product_id: str, quantity: int):
        # TODO: Add quantity back to stock (for cancellations)
        pass


class CartItem:
    def __init__(self, product: Product, quantity: int):
        self.product = product
        self.quantity = quantity

    def get_subtotal(self) -> float:
        # TODO: Return product price * quantity
        pass


class ShoppingCart:
    def __init__(self, customer_id: str):
        self.customer_id = customer_id
        self.items: list[CartItem] = []

    def add_item(self, product: Product, quantity: int = 1):
        # TODO: If product already in cart, increase quantity. Otherwise add new CartItem.
        pass

    def remove_item(self, product_id: str):
        # TODO: Remove item with given product_id from cart
        pass

    def update_quantity(self, product_id: str, quantity: int):
        # TODO: Update quantity for product. Remove if quantity <= 0.
        pass

    def get_total(self) -> float:
        # TODO: Sum of all item subtotals
        pass

    def clear(self):
        # TODO: Remove all items from cart
        pass

    def is_empty(self) -> bool:
        # TODO: Return True if no items in cart
        pass


class Payment:
    def __init__(self, amount: float, method: PaymentMethod):
        self.payment_id = str(uuid.uuid4())[:8]
        self.amount = amount
        self.method = method
        self.status = PaymentStatus.PENDING
        self.timestamp: Optional[datetime] = None

    def process(self) -> bool:
        # TODO: Simulate payment processing, set status to COMPLETED, return True
        pass

    def refund(self) -> bool:
        # TODO: If COMPLETED, set to REFUNDED and return True
        pass


class OrderItem:
    """Snapshot of a product at the time of order."""
    def __init__(self, product: Product, quantity: int, price_at_order: float):
        self.product = product
        self.quantity = quantity
        self.price_at_order = price_at_order

    def get_subtotal(self) -> float:
        return self.price_at_order * self.quantity


class Order:
    def __init__(self, order_id: str, customer_id: str, items: list[OrderItem],
                 shipping_address: Address):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items
        self.status = OrderStatus.PENDING
        self.total = sum(item.get_subtotal() for item in items)
        self.payment: Optional[Payment] = None
        self.shipping_address = shipping_address
        self.order_date = datetime.now()

    def confirm(self):
        # TODO: Change status to CONFIRMED (only if PENDING)
        pass

    def ship(self):
        # TODO: Change status to SHIPPED (only if CONFIRMED)
        pass

    def deliver(self):
        # TODO: Change status to DELIVERED (only if SHIPPED)
        pass

    def cancel(self) -> bool:
        # TODO: Cancel order (only if PENDING or CONFIRMED), refund if paid
        pass


class OnlineShoppingSystem:
    def __init__(self):
        self.products: dict[str, Product] = {}
        self.inventory = Inventory()
        self.carts: dict[str, ShoppingCart] = {}  # customer_id -> cart
        self.orders: dict[str, Order] = {}

    def add_product(self, product: Product, stock: int):
        # TODO: Add product to catalog and set initial stock
        pass

    def get_cart(self, customer_id: str) -> ShoppingCart:
        # TODO: Return existing cart or create new one
        pass

    def search_products(self, query: str) -> list[Product]:
        # TODO: Case-insensitive search by name
        pass

    def place_order(self, customer_id: str, shipping_address: Address,
                    payment_method: PaymentMethod) -> Order:
        # TODO: Validate cart, check inventory, create order, process payment
        pass


# Test the system
if __name__ == "__main__":
    system = OnlineShoppingSystem()
    # Test your implementation
    pass
`,
      solutionCode: `from enum import Enum
from datetime import datetime
from typing import Optional
import uuid


class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"


class Address:
    def __init__(self, street: str, city: str, state: str, zip_code: str, country: str):
        self.street = street
        self.city = city
        self.state = state
        self.zip_code = zip_code
        self.country = country

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}, {self.country}"


class Product:
    def __init__(self, product_id: str, name: str, description: str, price: float, category: str):
        self.product_id = product_id
        self.name = name
        self.description = description
        self.price = price
        self.category = category

    def get_price(self) -> float:
        return self.price

    def __repr__(self):
        return f"Product({self.name}, \${self.price:.2f})"


class Inventory:
    def __init__(self):
        self._stock: dict[str, int] = {}

    def add_stock(self, product_id: str, quantity: int):
        self._stock[product_id] = self._stock.get(product_id, 0) + quantity

    def check_stock(self, product_id: str) -> int:
        return self._stock.get(product_id, 0)

    def reserve(self, product_id: str, quantity: int) -> bool:
        current = self._stock.get(product_id, 0)
        if current >= quantity:
            self._stock[product_id] = current - quantity
            return True
        return False

    def release(self, product_id: str, quantity: int):
        self._stock[product_id] = self._stock.get(product_id, 0) + quantity


class CartItem:
    def __init__(self, product: Product, quantity: int):
        self.product = product
        self.quantity = quantity

    def get_subtotal(self) -> float:
        return self.product.get_price() * self.quantity

    def __repr__(self):
        return f"CartItem({self.product.name} x{self.quantity})"


class ShoppingCart:
    def __init__(self, customer_id: str):
        self.customer_id = customer_id
        self.items: list[CartItem] = []

    def add_item(self, product: Product, quantity: int = 1):
        for item in self.items:
            if item.product.product_id == product.product_id:
                item.quantity += quantity
                return
        self.items.append(CartItem(product, quantity))

    def remove_item(self, product_id: str):
        self.items = [item for item in self.items if item.product.product_id != product_id]

    def update_quantity(self, product_id: str, quantity: int):
        if quantity <= 0:
            self.remove_item(product_id)
            return
        for item in self.items:
            if item.product.product_id == product_id:
                item.quantity = quantity
                return
        raise ValueError(f"Product {product_id} not in cart")

    def get_total(self) -> float:
        return sum(item.get_subtotal() for item in self.items)

    def clear(self):
        self.items = []

    def is_empty(self) -> bool:
        return len(self.items) == 0


class Payment:
    def __init__(self, amount: float, method: PaymentMethod):
        self.payment_id = str(uuid.uuid4())[:8]
        self.amount = amount
        self.method = method
        self.status = PaymentStatus.PENDING
        self.timestamp: Optional[datetime] = None

    def process(self) -> bool:
        # In a real system, this would call a payment gateway
        self.status = PaymentStatus.COMPLETED
        self.timestamp = datetime.now()
        print(f"Payment {self.payment_id}: \${self.amount:.2f} via {self.method.value} - {self.status.value}")
        return True

    def refund(self) -> bool:
        if self.status != PaymentStatus.COMPLETED:
            return False
        self.status = PaymentStatus.REFUNDED
        print(f"Payment {self.payment_id}: Refunded \${self.amount:.2f}")
        return True


class OrderItem:
    """Snapshot of a product at the time of order."""
    def __init__(self, product: Product, quantity: int, price_at_order: float):
        self.product = product
        self.quantity = quantity
        self.price_at_order = price_at_order

    def get_subtotal(self) -> float:
        return self.price_at_order * self.quantity


class Order:
    def __init__(self, order_id: str, customer_id: str, items: list[OrderItem],
                 shipping_address: Address):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items
        self.status = OrderStatus.PENDING
        self.total = sum(item.get_subtotal() for item in items)
        self.payment: Optional[Payment] = None
        self.shipping_address = shipping_address
        self.order_date = datetime.now()

    def confirm(self):
        if self.status != OrderStatus.PENDING:
            raise ValueError(f"Cannot confirm order in {self.status.value} state")
        self.status = OrderStatus.CONFIRMED
        print(f"Order {self.order_id} confirmed")

    def ship(self):
        if self.status != OrderStatus.CONFIRMED:
            raise ValueError(f"Cannot ship order in {self.status.value} state")
        self.status = OrderStatus.SHIPPED
        print(f"Order {self.order_id} shipped to {self.shipping_address}")

    def deliver(self):
        if self.status != OrderStatus.SHIPPED:
            raise ValueError(f"Cannot deliver order in {self.status.value} state")
        self.status = OrderStatus.DELIVERED
        print(f"Order {self.order_id} delivered")

    def cancel(self) -> bool:
        if self.status not in (OrderStatus.PENDING, OrderStatus.CONFIRMED):
            print(f"Cannot cancel order in {self.status.value} state")
            return False
        self.status = OrderStatus.CANCELLED
        if self.payment and self.payment.status == PaymentStatus.COMPLETED:
            self.payment.refund()
        print(f"Order {self.order_id} cancelled")
        return True


class OnlineShoppingSystem:
    def __init__(self):
        self.products: dict[str, Product] = {}
        self.inventory = Inventory()
        self.carts: dict[str, ShoppingCart] = {}
        self.orders: dict[str, Order] = {}

    def add_product(self, product: Product, stock: int):
        self.products[product.product_id] = product
        self.inventory.add_stock(product.product_id, stock)

    def get_cart(self, customer_id: str) -> ShoppingCart:
        if customer_id not in self.carts:
            self.carts[customer_id] = ShoppingCart(customer_id)
        return self.carts[customer_id]

    def search_products(self, query: str) -> list[Product]:
        query_lower = query.lower()
        return [
            p for p in self.products.values()
            if query_lower in p.name.lower() or query_lower in p.category.lower()
        ]

    def place_order(self, customer_id: str, shipping_address: Address,
                    payment_method: PaymentMethod) -> Order:
        cart = self.get_cart(customer_id)
        if cart.is_empty():
            raise ValueError("Cart is empty")

        # Check inventory and reserve stock
        reserved_items: list[tuple[str, int]] = []
        try:
            for cart_item in cart.items:
                pid = cart_item.product.product_id
                qty = cart_item.quantity
                if not self.inventory.reserve(pid, qty):
                    raise ValueError(
                        f"Insufficient stock for {cart_item.product.name}: "
                        f"requested {qty}, available {self.inventory.check_stock(pid)}"
                    )
                reserved_items.append((pid, qty))
        except ValueError:
            # Rollback reservations on failure
            for pid, qty in reserved_items:
                self.inventory.release(pid, qty)
            raise

        # Create order items (snapshot prices)
        order_items = [
            OrderItem(item.product, item.quantity, item.product.get_price())
            for item in cart.items
        ]

        # Create order
        order_id = str(uuid.uuid4())[:8]
        order = Order(order_id, customer_id, order_items, shipping_address)

        # Process payment
        payment = Payment(order.total, payment_method)
        if payment.process():
            order.payment = payment
            order.confirm()
        else:
            # Payment failed -- release inventory
            for pid, qty in reserved_items:
                self.inventory.release(pid, qty)
            raise ValueError("Payment failed")

        self.orders[order.order_id] = order
        cart.clear()
        return order


# Test the system
if __name__ == "__main__":
    system = OnlineShoppingSystem()

    # Add products
    laptop = Product("P001", "MacBook Pro", "16-inch laptop", 2499.99, "Electronics")
    phone = Product("P002", "iPhone 15", "Latest iPhone", 999.99, "Electronics")
    book = Product("P003", "Clean Code", "Software engineering book", 39.99, "Books")

    system.add_product(laptop, stock=10)
    system.add_product(phone, stock=25)
    system.add_product(book, stock=50)

    # Search
    results = system.search_products("iphone")
    print(f"Search results: {results}")

    # Add to cart
    cart = system.get_cart("C001")
    cart.add_item(laptop, 1)
    cart.add_item(book, 2)
    print(f"Cart total: \${cart.get_total():.2f}")

    # Place order
    address = Address("123 Main St", "San Francisco", "CA", "94102", "USA")
    order = system.place_order("C001", address, PaymentMethod.CREDIT_CARD)
    print(f"Order {order.order_id}: \${order.total:.2f}")

    # Ship and deliver
    order.ship()
    order.deliver()
`,
    },
    {
      id: "ood-shop-4",
      slug: "online-shopping-inventory-payments",
      title: "Online Shopping: Inventory & Payments",
      content: `# Online Shopping: Inventory & Payments

Inventory management and payment processing are where most of the complexity lives in an e-commerce system. Let us examine the critical design considerations for both.

## Inventory Management

### The Stock Reservation Problem

The most important edge case in e-commerce: **what happens when two customers try to buy the last item simultaneously?**

Our design uses a **reserve-then-commit** pattern:

\`\`\`python
def reserve(self, product_id: str, quantity: int) -> bool:
    current = self._stock.get(product_id, 0)
    if current >= quantity:
        self._stock[product_id] = current - quantity
        return True
    return False
\`\`\`

This is not thread-safe as written. In a production system, you would use one of these approaches:

**Option 1: Locking**
\`\`\`python
import threading

class Inventory:
    def __init__(self):
        self._stock = {}
        self._lock = threading.Lock()

    def reserve(self, product_id, quantity):
        with self._lock:
            current = self._stock.get(product_id, 0)
            if current >= quantity:
                self._stock[product_id] = current - quantity
                return True
            return False
\`\`\`

**Option 2: Database-level atomic operations**
\`\`\`sql
UPDATE inventory
SET quantity = quantity - :requested
WHERE product_id = :pid AND quantity >= :requested
\`\`\`

If zero rows are affected, the reservation failed.

### Reservation Rollback

If payment fails after stock is reserved, we must release the reservation:

\`\`\`python
try:
    for cart_item in cart.items:
        if not self.inventory.reserve(pid, qty):
            raise ValueError("Insufficient stock")
        reserved_items.append((pid, qty))
except ValueError:
    for pid, qty in reserved_items:
        self.inventory.release(pid, qty)
    raise
\`\`\`

This ensures **atomicity** -- either all items are reserved, or none are. This is the **saga pattern** in miniature.

### Inventory Tracking Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Decrement on order** | Stock drops when order is placed | Standard e-commerce |
| **Decrement on ship** | Stock drops when item ships | Warehouse with pick errors |
| **Reservation with timeout** | Stock reserved for N minutes, released if unpaid | Flash sales, concert tickets |

## Payment Processing

### Payment as a Separate Class

Payment is decoupled from Order because:
1. **SRP**: Order tracks items and status; Payment handles money
2. **Multiple payment methods**: Credit card, PayPal, gift card all behave differently
3. **Retry logic**: Payment can be retried without recreating the order
4. **Partial payments**: An order could be split across multiple payments

### Strategy Pattern for Payment Methods

\`\`\`python
class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float, details: dict) -> bool:
        pass

    @abstractmethod
    def refund(self, payment_id: str) -> bool:
        pass

class CreditCardProcessor(PaymentProcessor):
    def charge(self, amount: float, details: dict) -> bool:
        # Call Stripe/Braintree API
        card_number = details["card_number"]
        # ... process payment
        return True

    def refund(self, payment_id: str) -> bool:
        # Call refund API
        return True

class PayPalProcessor(PaymentProcessor):
    def charge(self, amount: float, details: dict) -> bool:
        # Call PayPal API
        email = details["email"]
        return True

    def refund(self, payment_id: str) -> bool:
        return True
\`\`\`

### Idempotency

Payment processing must be **idempotent** -- if the network drops after a successful charge but before the response arrives, retrying must not double-charge. Solutions:
1. Use unique idempotency keys per payment attempt
2. Check payment status before processing
3. Use payment gateway built-in idempotency (Stripe supports this)

## Order Status Transitions

Our Order class enforces valid state transitions:

\`\`\`python
def ship(self):
    if self.status != OrderStatus.CONFIRMED:
        raise ValueError(f"Cannot ship order in {self.status.value} state")
    self.status = OrderStatus.SHIPPED
\`\`\`

This is a simple **state machine**. For more complex flows (returns, partial refunds, exchanges), consider the **State pattern** where each state is a class that defines valid transitions.

## Interview Discussion Points

- **Flash sale scenario**: Use reservation with timeout to prevent cart hoarding
- **Distributed inventory**: When stock is across multiple warehouses, use eventual consistency
- **Price changes during checkout**: Our OrderItem snapshots the price at order time, protecting against mid-checkout price changes
`,
    },
    {
      id: "ood-shop-5",
      slug: "online-shopping-walkthrough",
      title: "Online Shopping: Walkthrough",
      content: `# Online Shopping System: Code Walkthrough

Let us trace through the complete purchase flow, from product browsing to order delivery.

## Architecture Overview

\`\`\`
OnlineShoppingSystem (Facade)
  |
  +-- products: dict[id, Product]
  +-- inventory: Inventory
  |     +-- _stock: dict[product_id, quantity]
  +-- carts: dict[customer_id, ShoppingCart]
  |     +-- items: list[CartItem]
  |           +-- product: Product
  |           +-- quantity: int
  +-- orders: dict[order_id, Order]
        +-- items: list[OrderItem]
        +-- payment: Payment
        +-- status: OrderStatus
\`\`\`

## Complete Purchase Flow

### Step 1: Add Products to Catalog
\`\`\`python
system = OnlineShoppingSystem()
laptop = Product("P001", "MacBook Pro", "16-inch", 2499.99, "Electronics")
system.add_product(laptop, stock=10)
\`\`\`

The product is stored in the catalog and its stock is initialized in the Inventory.

### Step 2: Customer Browses and Searches
\`\`\`python
results = system.search_products("macbook")
# Returns [Product(MacBook Pro, $2499.99)]
\`\`\`

Search is case-insensitive and matches against product name and category.

### Step 3: Add to Cart
\`\`\`python
cart = system.get_cart("C001")
cart.add_item(laptop, 1)
\`\`\`

If the customer already has a cart, the existing one is returned. Adding the same product again increases the quantity rather than creating a duplicate entry.

### Step 4: Place Order (The Critical Path)

\`\`\`python
address = Address("123 Main St", "SF", "CA", "94102", "USA")
order = system.place_order("C001", address, PaymentMethod.CREDIT_CARD)
\`\`\`

This is where the most interesting logic lives:

1. **Validate cart is not empty** -- fail fast
2. **Reserve inventory** for each cart item
   - If any item fails (out of stock), rollback all previous reservations
   - This ensures atomicity
3. **Create OrderItems** with price snapshots
   - Even if the product price changes later, this order has the price locked
4. **Create the Order** with a unique ID
5. **Process payment**
   - If payment fails, release all inventory reservations
   - If payment succeeds, confirm the order
6. **Clear the cart** -- items have moved to the order

### Step 5: Order Fulfillment

\`\`\`python
order.ship()     # CONFIRMED -> SHIPPED
order.deliver()  # SHIPPED -> DELIVERED
\`\`\`

Each transition validates the current state. You cannot ship a PENDING order or deliver a CONFIRMED one.

## Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | OnlineShoppingSystem | Single entry point hiding complexity |
| **Strategy** | PaymentProcessor (extensible) | Swap payment methods without changing Order |
| **State** | Order status transitions | Enforce valid state machine |
| **Snapshot** | OrderItem.price_at_order | Preserve price at time of purchase |
| **Repository** | products/orders dicts | Centralized data access |

## SOLID Analysis

**SRP**: Each class has one job. Product = metadata. Inventory = stock. Cart = shopping session. Order = purchase record. Payment = money handling.

**OCP**: New payment methods or product categories can be added without modifying existing code.

**LSP**: Not heavily used here since we do not have deep inheritance, which is appropriate -- favor composition over inheritance.

**ISP**: The system exposes separate methods for search, cart, and orders. Clients use only what they need.

**DIP**: OnlineShoppingSystem depends on abstractions (Product, not ConcreteProductX). Payment processing could use a PaymentProcessor interface for even better inversion.

## Scaling Considerations

In an interview, mention:
- **Microservices**: Split into Catalog Service, Cart Service, Order Service, Payment Service
- **Event-driven**: Use events (OrderPlaced, PaymentCompleted) for loose coupling
- **Caching**: Cache product catalog (read-heavy), invalidate on price changes
- **Database**: Orders need ACID transactions; catalog can use eventual consistency
`,
    },
  ],
};
