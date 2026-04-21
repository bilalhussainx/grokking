import { Module } from "../types";

export const supplyDemandModule: Module = {
  id: "micro-supply-demand",
  title: "Supply & Demand",
  description: "Master the laws of supply and demand, market equilibrium, the distinction between shifts and movements, and price elasticity — the workhorses of economic analysis. Resources: Mankiw Principles of Economics, Varian Intermediate Microeconomics.",
  lessons: [
    {
      id: "micro-sd-law-of-demand",
      slug: "law-of-demand",
      title: "Law of Demand",
      content: `## The Law of Demand

The law of demand is one of the most fundamental and well-established relationships in economics: **all else being equal, as the price of a good rises, the quantity demanded falls; as the price falls, the quantity demanded rises.** This inverse relationship between price and quantity demanded holds for virtually every good and service.

### The Demand Curve

The demand curve is a graphical representation of the law of demand. It slopes downward from left to right, showing the negative relationship between price (vertical axis) and quantity demanded (horizontal axis).

\`\`\`
Price ($)
  |
8 | .
  |   .
6 |      .
  |         .
4 |            .
  |               .
2 |                  .
  |_____________________
  0   10  20  30  40  50  Quantity
\`\`\`

### Why Does Demand Slope Downward?

Three effects explain the law of demand:

**1. The Substitution Effect:** When the price of a good rises, consumers switch to cheaper alternatives. If beef prices increase, consumers buy more chicken. This effect was formalized by Slutsky (1915) and later refined by Hicks (1939, *Value and Capital*, Oxford University Press).

**2. The Income Effect:** When a good's price rises, your real purchasing power decreases — you can afford less of everything. This reduces the quantity demanded of most goods.

**3. Diminishing Marginal Utility:** Each additional unit of a good provides less satisfaction than the previous one. You would pay \\$5 for the first slice of pizza but perhaps only \\$1 for the fifth. This principle, articulated by Jevons (1871), Menger (1871), and Walras (1874) independently, explains why consumers will only buy more at lower prices.

### The Demand Schedule

A demand schedule is a table showing the quantity demanded at each price level:

| Price per Coffee | Quantity Demanded (per week) |
|-----------------|---------------------------|
| \\$6.00 | 200 |
| \\$5.00 | 350 |
| \\$4.00 | 500 |
| \\$3.00 | 700 |
| \\$2.00 | 1,000 |

### Individual vs Market Demand

**Individual demand** is one consumer's demand for a good. **Market demand** is the horizontal sum of all individual demand curves — adding up the quantities demanded by all consumers at each price level.

If there are 1,000 consumers and each demands 3 coffees per week at \\$4, market demand at \\$4 is 3,000 coffees.

### Determinants of Demand (Shift Factors)

The demand curve is drawn holding all factors other than price constant (*ceteris paribus*). When these other factors change, the entire demand curve shifts:

| Factor | Shift Direction | Example |
|--------|----------------|---------|
| Increase in income (normal good) | Right (increase) | Rising wages → more restaurant meals |
| Decrease in income (inferior good) | Right (increase) | Recession → more instant noodles |
| Price of substitutes rises | Right (increase) | Beef price up → more chicken demanded |
| Price of complements rises | Left (decrease) | Gas price up → fewer SUVs demanded |
| Consumer tastes/preferences | Either direction | Health trend → more organic food |
| Population/number of buyers | Right (increase) | Immigration → more housing demanded |
| Expectations of future prices | Right (if prices expected to rise) | Expected shortage → buy now |

### Exceptions to the Law of Demand

**Giffen goods:** Extremely rare goods where quantity demanded rises as price rises because the income effect dominates the substitution effect. Jensen & Miller (2008, *Giffen Behavior and Subsistence Consumption*, American Economic Review) provided the first rigorous empirical evidence of Giffen behavior for rice in Hunan Province, China — poor households spent such a large share of income on rice that a price increase forced them to cut other foods and buy more rice.

**Veblen goods:** Luxury goods where higher prices increase demand because of the prestige associated with expensive items (Veblen, 1899, *The Theory of the Leisure Class*).

### Key Takeaway

The law of demand captures a universal truth about human behavior: people buy less when prices rise and more when prices fall. The demand curve is the single most important tool in the economist's toolkit.

*References: Hicks (1939), Value and Capital (Oxford); Jensen & Miller (2008), American Economic Review; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-sd-law-of-supply",
      slug: "law-of-supply",
      title: "Law of Supply",
      content: `## The Law of Supply

The law of supply states: **all else being equal, as the price of a good rises, the quantity supplied increases; as the price falls, the quantity supplied decreases.** Producers are willing to supply more of a product at higher prices because the potential profit is greater.

### The Supply Curve

The supply curve slopes upward from left to right, reflecting the positive relationship between price and quantity supplied:

\`\`\`
Price ($)
  |                    .
8 |                 .
  |              .
6 |           .
  |        .
4 |     .
  |  .
2 |.
  |_____________________
  0   10  20  30  40  50  Quantity
\`\`\`

### Why Does Supply Slope Upward?

**1. Increasing Marginal Cost:** As production expands, each additional unit becomes more expensive to produce. Firms must use less efficient resources, pay overtime wages, or operate machinery beyond optimal capacity. The upward slope of supply reflects these rising marginal costs.

**2. Profit Incentive:** Higher prices mean higher profit margins, attracting existing firms to produce more and potentially new firms to enter the market.

**3. Law of Diminishing Returns:** In the short run, adding more of one input (labor) to a fixed input (factory space) eventually yields smaller increases in output — requiring higher prices to justify expanded production. This law, first articulated by Turgot (1767) and later formalized by David Ricardo, is one of the most empirically validated relationships in economics.

### The Supply Schedule

| Price per Bushel of Corn | Quantity Supplied (millions of bushels) |
|-------------------------|--------------------------------------|
| \\$2.00 | 5 |
| \\$3.00 | 8 |
| \\$4.00 | 12 |
| \\$5.00 | 15 |
| \\$6.00 | 17 |

Notice that supply increases with price but at a decreasing rate — reflecting increasing marginal cost.

### Determinants of Supply (Shift Factors)

Changes in non-price factors shift the entire supply curve:

| Factor | Shift Direction | Example |
|--------|----------------|---------|
| Input price decrease | Right (increase) | Cheaper steel → more cars supplied |
| Technology improvement | Right (increase) | Better machinery → more output per hour |
| Number of sellers increases | Right (increase) | New firms enter the market |
| Government subsidies | Right (increase) | Solar panel subsidies → more panels |
| Taxes/regulations increase | Left (decrease) | Carbon tax → less fossil fuel supplied |
| Expectations of future prices | Left if prices expected to rise (withhold supply now) | |
| Natural events | Left (decrease) | Drought → less wheat supplied |

### Individual vs Market Supply

Like demand, market supply is the horizontal sum of all individual firm supply curves. If 500 corn farmers each supply 24 bushels at \\$4, market supply at \\$4 is 12,000 bushels.

### Short-Run vs Long-Run Supply

**Short-run supply** is relatively steep (inelastic) — firms cannot quickly adjust capacity. Factory space, specialized equipment, and workforce cannot change overnight.

**Long-run supply** is flatter (more elastic) — firms can build new factories, enter or exit the market, and fully adjust all inputs. In the long run, supply is more responsive to price changes.

Marshall (1890, *Principles of Economics*) distinguished between market period (supply perfectly inelastic), short run (some inputs adjustable), and long run (all inputs adjustable) — a framework still central to microeconomic analysis.

### Exceptions

Some goods have unusual supply characteristics:
- **Fixed supply:** Land in Manhattan — regardless of price, the quantity available cannot increase significantly
- **Backward-bending supply:** Labor supply may decrease at very high wages as workers choose more leisure (empirically observed by Keane, 2011, *Labor Supply and Taxes*, Journal of Economic Literature)

### Key Takeaway

The law of supply reflects the profit motive: higher prices incentivize greater production. Combined with the law of demand, supply creates the framework for understanding market equilibrium — how prices are determined in a free market.

*References: Marshall (1890), Principles of Economics; Keane (2011), Journal of Economic Literature; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-sd-equilibrium",
      slug: "market-equilibrium",
      title: "Market Equilibrium",
      content: `## Market Equilibrium

Market equilibrium occurs where the demand curve intersects the supply curve — the price at which the quantity demanded equals the quantity supplied. At this price, there is no tendency for the market to change: every buyer who wants to buy at that price finds a willing seller, and vice versa.

### Finding Equilibrium

\`\`\`
Price ($)
  |
8 |  D                    S
  |    \\                /
6 |      \\            /
  |        \\        /
4 |          X  ← Equilibrium
  |        /    \\
3 |      /        \\
  |    /            \\
  |  S                D
  |_________________________
  0        Q*         Quantity
\`\`\`

At the equilibrium price P*, Quantity Demanded = Quantity Supplied = Q*.

### Surplus and Shortage

**Surplus (excess supply):** When the market price is above equilibrium, quantity supplied exceeds quantity demanded. Unsold goods accumulate. Sellers compete for buyers by lowering prices, pushing the market back toward equilibrium.

**Shortage (excess demand):** When the market price is below equilibrium, quantity demanded exceeds quantity supplied. Buyers compete for scarce goods, bidding up the price toward equilibrium.

| Condition | Price Relative to Equilibrium | Result | Market Force |
|-----------|------------------------------|--------|-------------|
| Surplus | Price too high | QS > QD | Price falls |
| Equilibrium | Price just right | QS = QD | No change |
| Shortage | Price too low | QD > QS | Price rises |

This self-correcting mechanism is what Adam Smith called the "invisible hand." Markets naturally tend toward equilibrium without any central coordinator (Smith, 1776, *The Wealth of Nations*).

### Mathematical Equilibrium

Given demand function QD = 100 - 2P and supply function QS = 20 + 3P:

Set QD = QS:
\`\`\`
100 - 2P = 20 + 3P
80 = 5P
P* = 16
Q* = 100 - 2(16) = 68
\`\`\`

Equilibrium price is \\$16, equilibrium quantity is 68 units.

### Government Intervention: Price Floors and Ceilings

Governments sometimes intervene to set prices away from equilibrium:

**Price ceiling** (maximum price — e.g., rent control): If set below equilibrium, creates a shortage. New York City's rent control system provides a classic example — economists from Friedman to Krugman agree it reduces housing supply and quality, though they disagree on the policy implications (Diamond, McQuade & Qian, 2019, *The Effects of Rent Control*, American Economic Review).

**Price floor** (minimum price — e.g., minimum wage): If set above equilibrium, creates a surplus (unemployment in the labor market). Card & Krueger (1994, *Minimum Wages and Employment*, American Economic Review) challenged the conventional prediction with their famous New Jersey study, finding that a moderate minimum wage increase did not reduce fast-food employment — sparking decades of debate.

### Dynamic Equilibrium

In the real world, equilibrium is constantly being disturbed and re-established. New technologies, changing tastes, policy shifts, and external shocks continuously shift supply and demand curves. Markets are always moving toward equilibrium but rarely remain there for long.

Walras (1874, *Elements of Pure Economics*) formalized the concept of general equilibrium — the idea that all markets simultaneously reach equilibrium. This framework earned multiple Nobel Prizes and remains the foundation of modern economic theory.

### Key Takeaway

Market equilibrium is the price and quantity where supply equals demand. It is the central organizing concept of microeconomics — the point where the competing interests of buyers and sellers are reconciled through the price mechanism.

> "The theory of supply and demand is the backbone of a market economy." — Gregory Mankiw

*References: Diamond, McQuade & Qian (2019), American Economic Review; Card & Krueger (1994), American Economic Review; Walras (1874), Elements of Pure Economics; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-sd-shifts-movements",
      slug: "shifts-vs-movements",
      title: "Shifts vs Movements Along the Curve",
      content: `## Shifts vs Movements Along the Curve

One of the most common errors in economics is confusing a **movement along** a supply or demand curve with a **shift** of the curve. Understanding this distinction is essential for correctly predicting how markets respond to changes.

### Movement Along a Curve

A **movement along** the demand or supply curve occurs when the price of the good itself changes, causing quantity demanded or supplied to change. The curve does not move — you simply slide to a different point on the same curve.

**Example:** If the price of coffee falls from \\$5 to \\$3, quantity demanded increases from 350 to 700 cups per week. This is a movement along the demand curve — the demand curve itself has not shifted.

**Key rule:** A change in the good's own price causes a movement along the curve, not a shift.

### Shift of a Curve

A **shift** of the demand or supply curve occurs when a non-price factor changes, causing the entire curve to move to a new position. At every price level, the quantity demanded (or supplied) is now different.

**Example:** A medical study reports that coffee reduces the risk of heart disease. Consumer preferences shift in favor of coffee. At \\$5, demand increases from 350 to 500. At \\$3, demand increases from 700 to 900. The entire demand curve has shifted to the right — this is an increase in demand.

### Summary of the Distinction

| What Changes | What Happens | Technical Term |
|-------------|-------------|----------------|
| Price of the good itself | Slide along the existing curve | Change in quantity demanded/supplied |
| A non-price factor (income, tastes, input costs, technology, etc.) | Entire curve shifts left or right | Change in demand/supply |

### Predicting Market Effects

The power of supply and demand analysis lies in predicting what happens to equilibrium price and quantity when curves shift. There are four basic scenarios:

**1. Demand increases (shifts right):** Equilibrium price rises, equilibrium quantity rises.

**2. Demand decreases (shifts left):** Equilibrium price falls, equilibrium quantity falls.

**3. Supply increases (shifts right):** Equilibrium price falls, equilibrium quantity rises.

**4. Supply decreases (shifts left):** Equilibrium price rises, equilibrium quantity falls.

### Simultaneous Shifts

When both supply and demand shift at the same time, the outcome depends on the relative magnitudes of the shifts:

| Demand Shift | Supply Shift | Price Effect | Quantity Effect |
|-------------|-------------|-------------|----------------|
| Increase | Increase | Ambiguous | Increases |
| Increase | Decrease | Increases | Ambiguous |
| Decrease | Increase | Decreases | Ambiguous |
| Decrease | Decrease | Ambiguous | Decreases |

"Ambiguous" means the direction depends on which shift is larger.

### Real-World Application: The Oil Market

The 2020 COVID-19 pandemic provides a textbook case of simultaneous shifts:

1. **Demand shifted left** — lockdowns reduced driving, flying, and industrial activity
2. **Supply initially did not adjust** — OPEC could not agree on production cuts fast enough

Result: Oil prices collapsed to below \\$0 per barrel in April 2020 for the first time in history (a storage-cost phenomenon for futures contracts). This extreme outcome was predicted by the supply-demand framework — a massive leftward demand shift with slow supply adjustment creates an enormous surplus (Baumeister & Hamilton, 2019, *Structural Interpretation of Vector Autoregressions*, Journal of Monetary Economics).

### Common Mistakes to Avoid

1. **"Demand increased because the price fell."** Wrong — that is a movement along the curve. Demand increases only when the curve shifts right due to a non-price factor.

2. **"Supply decreased because quantity fell."** Wrong — quantity supplied fell because of a price decrease (movement along the curve). Supply decreases only when the curve shifts left.

3. **Confusing individual and market effects.** One consumer buying more does not shift market demand. Market shifts require changes affecting many consumers simultaneously.

Becker (1962, *Irrational Behavior and Economic Theory*, Journal of Political Economy) showed that even if individual consumers behave irrationally, the law of demand holds at the market level because budget constraints force aggregate behavior to be consistent with downward-sloping demand.

### Key Takeaway

Movements along curves are caused by price changes. Shifts of curves are caused by everything else. Keeping this distinction clear is the key to using supply and demand analysis correctly.

*References: Baumeister & Hamilton (2019), Journal of Monetary Economics; Becker (1962), Journal of Political Economy; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-sd-elasticity",
      slug: "price-elasticity-of-demand",
      title: "Price Elasticity of Demand",
      content: `## Price Elasticity of Demand

Elasticity measures how responsive quantity demanded is to a change in price. While the law of demand tells us the direction (quantity falls when price rises), elasticity tells us the **magnitude** — how much quantity changes for a given price change.

### The Formula

\`\`\`
Price Elasticity of Demand (Ed) = % Change in Quantity Demanded / % Change in Price
\`\`\`

Because price and quantity move in opposite directions (law of demand), elasticity is technically negative. By convention, we use the absolute value.

### Midpoint (Arc) Method

To avoid getting different elasticities depending on direction of change, economists use the midpoint formula:

\`\`\`
Ed = [(Q2 - Q1) / ((Q2 + Q1)/2)] / [(P2 - P1) / ((P2 + P1)/2)]
\`\`\`

### Interpreting Elasticity Values

| Elasticity | Classification | Meaning |
|-----------|---------------|---------|
| Ed > 1 | **Elastic** | Quantity is highly responsive to price changes |
| Ed = 1 | **Unit elastic** | % change in quantity exactly equals % change in price |
| Ed < 1 | **Inelastic** | Quantity is not very responsive to price changes |
| Ed = 0 | **Perfectly inelastic** | Quantity does not change at all (vertical demand curve) |
| Ed = infinity | **Perfectly elastic** | Any price increase causes quantity to drop to zero (horizontal demand curve) |

### Determinants of Elasticity

**1. Availability of substitutes** — The most important factor. Goods with many close substitutes (Coca-Cola vs Pepsi) have elastic demand. Goods with few substitutes (insulin for diabetics) have inelastic demand.

**2. Necessity vs luxury** — Necessities (food, medicine) tend to be inelastic. Luxuries (vacation travel, jewelry) tend to be elastic.

**3. Proportion of income** — Goods that constitute a large share of the consumer's budget (housing, cars) tend to have more elastic demand than inexpensive items (salt, toothpicks).

**4. Time horizon** — Demand is more elastic in the long run. In the short run, you cannot easily switch from driving to public transit; given time, you can buy a more fuel-efficient car, move closer to work, or change commuting habits.

### Elasticity and Total Revenue

The relationship between elasticity and total revenue (TR = P x Q) is one of the most practical applications:

| Demand Type | Price Increase | Price Decrease |
|------------|---------------|---------------|
| Elastic (Ed > 1) | TR falls | TR rises |
| Unit elastic (Ed = 1) | TR unchanged | TR unchanged |
| Inelastic (Ed < 1) | TR rises | TR falls |

This is why pharmaceutical companies can raise prices on life-saving drugs with inelastic demand — total revenue increases. And why airlines offer discounts to price-sensitive leisure travelers (elastic) while charging high fares to business travelers (inelastic) — a strategy called **price discrimination**.

### Empirical Elasticities

Extensive empirical research has estimated elasticities for hundreds of goods:

| Good | Price Elasticity |
|------|-----------------|
| Insulin | 0.01 (highly inelastic) |
| Gasoline (short-run) | 0.26 |
| Gasoline (long-run) | 0.58 |
| Restaurant meals | 1.63 (elastic) |
| Foreign travel | 1.77 (elastic) |
| Cigarettes | 0.40 |

Source: Compiled from Andreyeva, Long & Brownell (2010, *The Impact of Food Prices on Consumption*, American Journal of Public Health) and Espey (1998, *Gasoline Demand Revisited*, Energy Journal).

### Other Elasticities

**Income Elasticity of Demand:**
\`\`\`
EI = % Change in QD / % Change in Income
\`\`\`
- Normal goods: EI > 0 (demand rises with income)
- Inferior goods: EI < 0 (demand falls with income)
- Luxury goods: EI > 1

**Cross-Price Elasticity:**
\`\`\`
EXY = % Change in QD of Good X / % Change in Price of Good Y
\`\`\`
- Substitutes: EXY > 0 (Coke price up → Pepsi demand up)
- Complements: EXY < 0 (Gas price up → SUV demand down)

### Key Takeaway

Elasticity transforms the qualitative law of demand into a quantitative tool. It tells businesses how price changes affect revenue, helps governments predict the impact of taxes, and enables economists to forecast market responses to policy changes.

*References: Andreyeva, Long & Brownell (2010), American Journal of Public Health; Espey (1998), Energy Journal; Mankiw (2021), Principles of Economics (Cengage); Varian (2014), Intermediate Microeconomics (Norton).*`,
      starterCode: `# Supply & Demand Analysis Tool

def calculate_equilibrium(
    demand_intercept: float,
    demand_slope: float,
    supply_intercept: float,
    supply_slope: float
) -> dict:
    """
    Find market equilibrium given linear demand and supply functions.

    Demand: QD = demand_intercept + demand_slope * P  (slope is negative)
    Supply: QS = supply_intercept + supply_slope * P  (slope is positive)

    Returns dict with:
    - equilibrium_price
    - equilibrium_quantity
    - consumer_surplus (area of triangle above price, below demand)
    - producer_surplus (area of triangle below price, above supply)
    """
    # TODO: Solve for equilibrium price (set QD = QS)
    eq_price = 0

    # TODO: Solve for equilibrium quantity
    eq_quantity = 0

    # TODO: Calculate the price where QD = 0 (demand choke price)
    # demand_intercept + demand_slope * P = 0 => P = -demand_intercept / demand_slope
    choke_price = 0

    # TODO: Calculate consumer surplus = 0.5 * (choke_price - eq_price) * eq_quantity
    consumer_surplus = 0

    # TODO: Calculate the price where QS = 0 (minimum supply price)
    # supply_intercept + supply_slope * P = 0 => P = -supply_intercept / supply_slope
    min_supply_price = 0

    # TODO: Calculate producer surplus = 0.5 * (eq_price - min_supply_price) * eq_quantity
    producer_surplus = 0

    return {
        "equilibrium_price": round(eq_price, 2),
        "equilibrium_quantity": round(eq_quantity, 2),
        "consumer_surplus": round(consumer_surplus, 2),
        "producer_surplus": round(producer_surplus, 2),
    }


def price_elasticity_midpoint(p1: float, q1: float, p2: float, q2: float) -> float:
    """Calculate price elasticity of demand using the midpoint method."""
    # TODO: Implement midpoint formula
    return 0


# Test: QD = 100 - 2P, QS = 20 + 3P
result = calculate_equilibrium(100, -2, 20, 3)
print("Equilibrium:", result)
# Expected: price=16, quantity=68

elas = price_elasticity_midpoint(p1=5, q1=350, p2=3, q2=700)
print(f"Elasticity: {round(abs(elas), 2)}")
# Expected: approximately 1.52`,
      solutionCode: `# Supply & Demand Analysis Tool

def calculate_equilibrium(
    demand_intercept: float,
    demand_slope: float,
    supply_intercept: float,
    supply_slope: float
) -> dict:
    """
    Find market equilibrium given linear demand and supply functions.

    Demand: QD = demand_intercept + demand_slope * P  (slope is negative)
    Supply: QS = supply_intercept + supply_slope * P  (slope is positive)

    Returns dict with:
    - equilibrium_price
    - equilibrium_quantity
    - consumer_surplus
    - producer_surplus
    """
    # Solve for equilibrium price (set QD = QS)
    # demand_intercept + demand_slope * P = supply_intercept + supply_slope * P
    eq_price = (supply_intercept - demand_intercept) / (demand_slope - supply_slope)

    # Solve for equilibrium quantity
    eq_quantity = demand_intercept + demand_slope * eq_price

    # Calculate the price where QD = 0 (demand choke price)
    choke_price = -demand_intercept / demand_slope

    # Calculate consumer surplus = 0.5 * (choke_price - eq_price) * eq_quantity
    consumer_surplus = 0.5 * (choke_price - eq_price) * eq_quantity

    # Calculate the price where QS = 0 (minimum supply price)
    min_supply_price = -supply_intercept / supply_slope

    # Calculate producer surplus = 0.5 * (eq_price - min_supply_price) * eq_quantity
    producer_surplus = 0.5 * (eq_price - min_supply_price) * eq_quantity

    return {
        "equilibrium_price": round(eq_price, 2),
        "equilibrium_quantity": round(eq_quantity, 2),
        "consumer_surplus": round(consumer_surplus, 2),
        "producer_surplus": round(producer_surplus, 2),
    }


def price_elasticity_midpoint(p1: float, q1: float, p2: float, q2: float) -> float:
    """Calculate price elasticity of demand using the midpoint method."""
    pct_q = (q2 - q1) / ((q2 + q1) / 2)
    pct_p = (p2 - p1) / ((p2 + p1) / 2)
    return pct_q / pct_p


# Test: QD = 100 - 2P, QS = 20 + 3P
result = calculate_equilibrium(100, -2, 20, 3)
print("Equilibrium:", result)

elas = price_elasticity_midpoint(p1=5, q1=350, p2=3, q2=700)
print(f"Elasticity: {round(abs(elas), 2)}")`,
    },
  ],
};
