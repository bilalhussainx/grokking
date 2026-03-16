import { Module } from "../types";

export const paymentsModule: Module = {
  id: "ft-payments",
  title: "Payment Systems & Digital Payments",
  description:
    "Explore the evolution of payment systems — from SWIFT and ACH to digital wallets, modern payment processors, cross-border solutions, and Buy Now Pay Later.",
  lessons: [
    {
      id: "ft-payment-systems",
      slug: "payment-systems-swift-ach",
      title: "Payment Systems (SWIFT/ACH/Cards)",
      content: `## Payment Systems: SWIFT, ACH, and Card Networks

The global payment infrastructure is a complex web of networks, protocols, and intermediaries that moves trillions of dollars daily. Understanding how money actually moves — from the SWIFT network for international transfers to ACH for domestic payments to card networks for retail transactions — is essential for anyone working in FinTech.

### How Money Moves

When you "send money," you are not moving physical cash. Instead, you are sending messages between financial institutions that update their ledgers. The process typically involves:

1. **Initiation** — The sender authorizes the payment through a bank, app, or card terminal
2. **Clearing** — The payment instruction is validated, matched, and processed
3. **Settlement** — The actual transfer of funds between institutions' accounts at a central bank or correspondent bank

The distinction between clearing and settlement is crucial. Clearing happens quickly (seconds to hours); settlement can take days.

### SWIFT (Society for Worldwide Interbank Financial Telecommunication)

SWIFT is the messaging network that connects over 11,000 financial institutions across 200+ countries. It does not actually move money — it sends standardized messages (MT103 for customer transfers, MT202 for bank-to-bank) that instruct banks to move funds.

**How a SWIFT transfer works:**
1. Your bank sends a SWIFT message to the recipient's bank
2. If the banks do not have a direct relationship, the message routes through correspondent banks
3. Each bank in the chain takes a fee and adds processing time
4. Settlement occurs through correspondent banking accounts (nostro/vostro accounts)

**Pain points:** SWIFT transfers are slow (1-5 business days), expensive (\$25-50 in fees), opaque (you cannot track the transfer in real time), and limited (only works during banking hours). These limitations created the opportunity for FinTech companies like Wise and Ripple.

### ACH (Automated Clearing House)

ACH is the US domestic payment network operated by Nacha (formerly NACHA). It handles direct deposits, bill payments, and bank-to-bank transfers:

- **Volume:** Over 30 billion transactions per year in the US
- **Speed:** Same-day ACH (since 2016) settles within hours; standard ACH settles in 1-2 business days
- **Cost:** Extremely low (\$0.25-0.50 per transaction for businesses)
- **Use cases:** Payroll direct deposits, recurring bill payments, tax refunds, Venmo/PayPal bank transfers

### Card Networks (Visa, Mastercard)

Card networks are the infrastructure that enables credit and debit card payments. The "four-party model" involves:

| Party | Role |
|-------|------|
| **Cardholder** | The consumer paying with a card |
| **Merchant** | The business accepting the card |
| **Issuing bank** | The bank that issued the card to the consumer |
| **Acquiring bank** | The bank that processes payments for the merchant |

The card network (Visa, Mastercard) sits in the middle, setting the rules and routing transactions between issuers and acquirers.

**Fee structure:** The merchant pays the merchant discount rate (typically 1.5-3.5%), which is split between the interchange fee (to the issuer), the assessment fee (to the network), and the processing fee (to the acquirer).

### Real-Time Payment Systems

A new generation of real-time payment systems is replacing or supplementing legacy infrastructure:

- **FedNow** (US, 2023) — Instant, 24/7 bank-to-bank payments
- **UPI** (India, 2016) — Handles 10+ billion monthly transactions with near-zero fees
- **Pix** (Brazil, 2020) — Instant payments between any bank account, 24/7
- **Faster Payments** (UK, 2008) — Near-instant domestic transfers

These systems settle in seconds rather than days, operate around the clock, and charge minimal fees.

### Key Takeaway

The payment infrastructure is a layered system of networks and intermediaries, each adding cost and delay. FinTech innovation is compressing settlement times from days to seconds, cutting fees from percentages to fractions of a cent, and extending access from banking hours to 24/7. Understanding these rails is essential for building on top of them.`,
    },
    {
      id: "ft-digital-wallets",
      slug: "digital-wallets",
      title: "Digital Wallets",
      content: `## Digital Wallets

Digital wallets have become the primary way hundreds of millions of people interact with money. From Apple Pay for contactless payments to PayPal for online transactions to M-Pesa for mobile money in Africa, digital wallets are replacing physical wallets, cash, and even bank accounts as the primary financial interface.

### What is a Digital Wallet?

A digital wallet is a software application that stores payment credentials, facilitates transactions, and often provides additional financial services. Digital wallets can be categorized by their functionality:

**Pass-through wallets** store tokenized card credentials and route payments through existing card networks. Apple Pay, Google Pay, and Samsung Pay are examples. They do not hold a balance — they simply make your existing cards easier to use.

**Stored-value wallets** hold a prepaid balance that users can load and spend. PayPal, Venmo, and Cash App fall into this category. Users can receive money, hold it in the wallet, and spend it without a traditional bank account.

**Super-app wallets** combine payments with a broader ecosystem of services. WeChat Pay and Alipay in China, GrabPay in Southeast Asia, and Paytm in India integrate payments with messaging, e-commerce, ride-hailing, and more.

### How Digital Wallets Work

The technology behind digital wallets involves several layers:

**Tokenization** — Instead of storing your actual card number, the wallet stores a unique token. When you pay, the token is sent instead of your real card details. If the token is compromised, your actual card number remains safe.

**NFC (Near Field Communication)** — Contactless payments use NFC to transmit payment data from your phone to the point-of-sale terminal within a range of about 4 centimeters.

**Biometric authentication** — Face ID, fingerprint scanning, or PIN codes secure the wallet. This often makes digital wallet payments more secure than physical card payments (which may only require a signature or nothing at all for contactless).

### The Global Digital Wallet Landscape

| Region | Dominant Wallets | Characteristics |
|--------|-----------------|-----------------|
| **China** | Alipay, WeChat Pay | Super-apps; QR code payments; 90%+ mobile payment penetration |
| **India** | PhonePe, Google Pay, Paytm | UPI-based; real-time bank transfers; 10B+ monthly transactions |
| **US** | Apple Pay, PayPal/Venmo, Cash App | Card-based; fragmented market; growing contactless adoption |
| **Europe** | Apple Pay, Revolut, local wallets | PSD2-enabled; open banking integration |
| **Africa** | M-Pesa, MTN MoMo | SMS/USSD-based mobile money; financial inclusion driver |
| **LatAm** | Mercado Pago, PicPay, Nequi | E-commerce integration; rapid growth |

### Business Models

Digital wallets monetize through several channels:

- **Transaction fees** — Charging merchants 1-3% per transaction (PayPal, Square)
- **Interchange** — Earning interchange fees on branded debit cards (Cash App Card, Venmo Debit)
- **Float income** — Earning interest on stored balances (significant for wallets with large user bases)
- **Cross-selling** — Offering lending, investing, insurance, and crypto through the wallet
- **Data monetization** — Using transaction data for advertising and merchant analytics

### The M-Pesa Revolution

M-Pesa, launched in Kenya in 2007 by Safaricom, is perhaps the most impactful digital wallet in history. It provides basic financial services (send money, receive money, save, borrow) via simple text messages on feature phones — no smartphone or bank account required.

By 2024, M-Pesa had over 50 million active users across 7 African countries. It processes more transactions annually than PayPal. M-Pesa demonstrated that mobile money could achieve financial inclusion at a scale that traditional banking never could.

### Key Takeaway

Digital wallets are the front door to financial services for billions of people. The winners in each market are determined by distribution (super-app integration, phone pre-installation), user experience, and the strength of the two-sided network between consumers and merchants.`,
    },
    {
      id: "ft-payment-processing",
      slug: "payment-processing",
      title: "Payment Processing (Stripe/Square)",
      content: `## Payment Processing: Stripe and Square

Modern payment processors like Stripe and Square have fundamentally changed how businesses accept payments. By turning complex, multi-party payment infrastructure into simple APIs and hardware, they enabled millions of businesses — from solo freelancers to Fortune 500 companies — to accept payments with minimal friction.

### The Payment Processing Revolution

Before Stripe and Square, accepting payments was painful for businesses:

- **Online payments** required merchant accounts, payment gateway contracts, PCI compliance audits, and weeks of integration work
- **In-person payments** required expensive point-of-sale terminals, contracts with acquiring banks, and monthly minimum fees
- **Small businesses** were often rejected for merchant accounts or charged punitive rates

Stripe (founded 2010) and Square (founded 2009) attacked these pain points from different angles: Stripe focused on online/developer payments, Square focused on in-person/small business payments.

### How Stripe Works

Stripe provides an API-first platform that handles the entire payment flow:

1. **Customer enters payment info** on the merchant's website or app
2. **Stripe.js tokenizes** the card details (the merchant never sees the raw card number)
3. **Stripe routes the transaction** through the card network (Visa, Mastercard) to the issuing bank
4. **Authorization** — The issuing bank approves or declines the transaction
5. **Settlement** — Stripe batches approved transactions and deposits funds to the merchant's bank account (typically 2 business days)

Stripe charges a flat 2.9% + \$0.30 per successful transaction in the US, with no monthly fees or setup costs. This simplicity was revolutionary — previously, payment pricing involved interchange-plus models with dozens of rate categories.

### The Stripe Product Suite

Stripe has expanded far beyond basic payment processing:

| Product | Function |
|---------|----------|
| **Stripe Payments** | Accept cards, wallets, bank transfers |
| **Stripe Connect** | Marketplace and platform payments (split payments, onboard sellers) |
| **Stripe Billing** | Subscription management and recurring payments |
| **Stripe Atlas** | Incorporate a company (LLC or C-Corp) entirely online |
| **Stripe Treasury** | Embedded banking (store funds, issue cards, earn yield) |
| **Stripe Identity** | Identity verification for KYC |
| **Stripe Radar** | ML-powered fraud detection |
| **Stripe Tax** | Automatic tax calculation and reporting |

This expansion reflects Stripe's strategy to become the **financial infrastructure of the internet** — not just processing payments but handling every financial operation a business needs.

### How Square (Block) Works

Square took a hardware-first approach, shipping a small card reader that plugged into a smartphone's headphone jack. This enabled any individual — food truck operators, farmers market vendors, hair stylists — to accept card payments.

Square has since evolved into Block, Inc. and expanded into:

- **Square POS** — Complete point-of-sale system with inventory, staff management, and analytics
- **Cash App** — Consumer payments app with 50M+ monthly active users
- **Square Banking** — Business loans, savings, and checking accounts for merchants
- **Afterpay** — BNPL integration (acquired for \$29B in 2022)
- **TBD** — Open-source Bitcoin and decentralized finance division

### Payment Processor Comparison

| Feature | Stripe | Square | Adyen | PayPal/Braintree |
|---------|--------|--------|-------|-----------------|
| **Primary focus** | Online/API | In-person/SMB | Enterprise omnichannel | Online consumer |
| **Pricing** | 2.9% + \$0.30 | 2.6% + \$0.10 (in-person) | Interchange++ | 2.9% + \$0.30 |
| **Developer experience** | Best-in-class | Good | Good | Moderate |
| **Global coverage** | 46+ countries | 8 countries | 30+ countries | 200+ countries |
| **Hardware** | Terminal (limited) | Extensive POS lineup | Extensive | None |

### The Payment Facilitator Model

Both Stripe and Square operate as **payment facilitators (PayFacs)**. Instead of each merchant applying for their own merchant account, the PayFac aggregates merchants under its own master merchant account. This enables:

- **Instant onboarding** — Merchants can start accepting payments in minutes, not weeks
- **Simplified compliance** — The PayFac handles PCI compliance for the merchant
- **Underwriting at scale** — The PayFac takes on the risk of merchant fraud and chargebacks

### Key Takeaway

Stripe and Square democratized payment acceptance by abstracting away the complexity of the payment stack into simple APIs and hardware. Their expansion into broader financial services — banking, lending, identity, tax — reflects the trend toward platform business models in FinTech.`,
    },
    {
      id: "ft-cross-border",
      slug: "cross-border-payments",
      title: "Cross-Border Payments",
      content: `## Cross-Border Payments

Cross-border payments represent one of the most lucrative and inefficient areas of financial services. Moving money internationally involves multiple intermediaries, each adding fees, delays, and opacity. The global remittance market alone is worth over \$700 billion annually, and total cross-border payment flows exceed \$150 trillion. FinTech companies are aggressively attacking this market.

### Why Cross-Border Payments are Broken

The traditional cross-border payment system (correspondent banking via SWIFT) suffers from fundamental problems:

**High fees:** The World Bank reports that the average cost of sending a \$200 remittance is 6.2% globally. For some corridors (e.g., sending money to Sub-Saharan Africa), fees can exceed 8-9%. These fees disproportionately burden migrant workers sending money home to their families.

**Slow speed:** A typical international wire transfer takes 2-5 business days. The money passes through multiple correspondent banks, each processing the transaction during their own business hours in their own time zone.

**Lack of transparency:** Senders often do not know the exact amount the recipient will receive until the money arrives. Hidden fees are buried in the exchange rate (banks typically add a 2-4% markup to the mid-market rate).

**Compliance friction:** Each bank in the chain performs its own KYC/AML checks, creating duplication and delays. Suspicious transaction reports can freeze funds for days or weeks.

### The Correspondent Banking Model

The traditional model works like this:

\`\`\`
Sender's Bank (US)
    -> Correspondent Bank (US)
        -> Correspondent Bank (UK)
            -> Recipient's Bank (UK)
\`\`\`

Each hop adds cost, time, and risk. The sender's bank may not have a direct relationship with the recipient's bank, requiring one or more intermediary correspondent banks.

### FinTech Solutions

**Wise (formerly TransferWise)** — Pioneered the peer-to-peer matching model. Instead of sending your dollars to the UK, Wise matches your transfer with someone in the UK sending pounds to the US. The money never actually crosses borders — it is transferred locally in each country. This eliminates correspondent bank fees and enables near mid-market exchange rates.

**Ripple/XRP** — Uses its cryptocurrency (XRP) as a bridge currency for cross-border settlement. The theory: convert USD to XRP, send XRP to the destination in seconds, convert XRP to the local currency. Ripple's On-Demand Liquidity product is used by several banks and payment providers, though regulatory uncertainty around XRP has slowed adoption.

**Nium** — Provides B2B cross-border payment infrastructure. Rather than replacing the banking system, Nium connects to local payment networks in 100+ countries, enabling real-time payouts.

**Thunes** — Operates a global payments network connecting mobile wallets, banks, and cash-out points, particularly strong in emerging markets.

### Comparison of Cross-Border Solutions

| Solution | Speed | Cost | Coverage | Technology |
|----------|-------|------|----------|-----------|
| SWIFT (traditional) | 2-5 days | \$25-50 + FX markup | Global | Messaging + correspondent banking |
| Wise | Hours to 1 day | 0.5-1.5% | 80+ countries | Local payment matching |
| Ripple ODL | Seconds | Low | Limited corridors | XRP bridge currency |
| PayPal/Xoom | Minutes to days | 3-5% | 130+ countries | Internal network + banks |
| Western Union | Minutes | 5-10% | 200+ countries | Agent network |

### The Future: Real-Time Cross-Border

Several initiatives aim to create real-time, low-cost cross-border payment networks:

- **SWIFT gpi** — SWIFT's upgrade that provides end-to-end tracking and faster settlement
- **Nexus (BIS)** — A proposed platform connecting domestic real-time payment systems (like FedNow and UPI) to enable instant cross-border payments
- **CBDCs** — Central Bank Digital Currencies could enable direct central bank-to-central bank settlement, eliminating correspondent banks entirely
- **Stablecoins** — USDC and USDT are already used for cross-border settlement by crypto-native businesses

### Key Takeaway

Cross-border payments is a massive market ripe for disruption. The incumbents (SWIFT, Western Union) are slow and expensive; the challengers (Wise, Ripple, stablecoin rails) offer faster, cheaper alternatives. The endgame is likely a world where moving money across borders is as fast and cheap as sending an email.`,
    },
    {
      id: "ft-bnpl",
      slug: "buy-now-pay-later",
      title: "Buy Now, Pay Later (BNPL)",
      content: `## Buy Now, Pay Later (BNPL)

Buy Now, Pay Later has exploded from a niche offering to a mainstream payment method used by hundreds of millions of consumers globally. BNPL allows shoppers to split purchases into installments — typically 4 payments over 6 weeks — with no interest and no traditional credit check. The market was valued at approximately \$30 billion in 2023 and is projected to reach \$120 billion by 2030.

### How BNPL Works

The basic BNPL transaction flow:

1. **At checkout** — The consumer selects BNPL as a payment option (online or in-store)
2. **Soft credit check** — The BNPL provider performs a quick risk assessment (usually a soft inquiry, not a hard credit pull)
3. **Instant approval** — The consumer is approved (or declined) in seconds
4. **First payment** — The consumer pays the first installment (25% of the total) immediately
5. **Remaining payments** — Three more payments are automatically charged every two weeks
6. **Merchant receives full payment** — The BNPL provider pays the merchant upfront (minus a merchant fee)

### Key Players

| Company | Founded | Market | Key Feature |
|---------|---------|--------|-------------|
| **Klarna** | 2005 (Sweden) | Global | Full shopping ecosystem with app, card, and browser extension |
| **Affirm** | 2012 (US) | US, Canada | Longer-term installments (3-60 months), transparent pricing |
| **Afterpay** | 2015 (Australia) | Global (owned by Block) | Pure pay-in-4 model, strong merchant integration |
| **PayPal Pay Later** | 2020 (US) | Global | Leverages PayPal's 400M+ user base |
| **Apple Pay Later** | 2023 (US) | US | Integrated into Apple Pay, uses Mastercard Installments |

### The BNPL Business Model

BNPL providers generate revenue from two main sources:

**Merchant fees** — The primary revenue source. BNPL providers charge merchants 2-8% of the transaction value (compared to 1.5-3% for card processing). Merchants accept these higher fees because BNPL:
- Increases average order value by 20-50%
- Improves conversion rates by 20-30%
- Attracts younger customers who prefer installments over credit cards

**Consumer fees** — Late payment fees (typically \$7-10 per missed payment) and interest on longer-term installment products. For the standard pay-in-4 product, there are no fees if the consumer pays on time.

### BNPL vs. Traditional Credit

| Feature | BNPL (Pay-in-4) | Credit Card | Traditional Installment Loan |
|---------|-----------------|------------|---------------------------|
| **Interest** | 0% (short-term) | 18-28% APR | 6-36% APR |
| **Credit check** | Soft/none | Hard inquiry | Hard inquiry |
| **Approval time** | Seconds | Days to weeks | Days to weeks |
| **Reporting to credit bureaus** | Varies | Yes | Yes |
| **Consumer age** | Skews young (Gen Z, Millennials) | All ages | All ages |

### The Appeal to Young Consumers

BNPL has been adopted most aggressively by Gen Z and Millennials, who:

- Grew up during or after the 2008 financial crisis and distrust credit cards
- Prefer predictable payment schedules over revolving debt
- Value transparency — knowing the exact total cost upfront
- Are comfortable with digital-first financial products

Surveys show that 60% of Gen Z consumers have used BNPL, compared to 35% of Gen X and 20% of Boomers.

### Risks and Controversies

BNPL has attracted significant regulatory scrutiny:

**Consumer debt concerns** — Critics argue that BNPL encourages overspending by making purchases feel cheaper than they are. A 2023 study found that 42% of BNPL users had missed at least one payment.

**Stacking risk** — Consumers can use BNPL with multiple providers simultaneously, accumulating obligations that are invisible to each provider and to traditional credit bureaus.

**Regulatory response** — The US CFPB ruled in 2024 that BNPL providers must comply with credit card regulations, including dispute resolution rights and refund obligations. The UK FCA is implementing similar rules. Australia already requires BNPL providers to perform affordability assessments.

**Merchant dependence** — BNPL providers rely heavily on a small number of large merchants. If a major merchant drops BNPL or negotiates lower fees, revenue can decline sharply.

### The Profitability Challenge

Most BNPL companies have struggled with profitability. The business model is inherently challenging:

- Merchant fees are under pressure as competition increases
- Credit losses (consumer defaults) eat into margins
- Customer acquisition costs are high
- The pay-in-4 model does not generate interest income

Affirm and Klarna both reported significant losses before achieving (or approaching) profitability through diversification into longer-term lending, bank-like products, and advertising.

### Key Takeaway

BNPL has reshaped consumer expectations about payment flexibility and challenged the dominance of credit cards for younger consumers. However, the industry faces mounting regulatory pressure and profitability challenges. The winners will be those who can balance growth with responsible lending and diversify beyond the basic pay-in-4 model.`,
    },
  ],
};
