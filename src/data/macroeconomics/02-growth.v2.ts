import { Module } from "../types";

export const growthModule: Module = {
  id: "macro-growth",
  title: "Economic Growth",
  description: "Explore what makes economies grow over the long run — the Solow model, human capital, technological progress, institutions, and growth accounting. Resources: Mankiw Macroeconomics, Acemoglu Introduction to Modern Economic Growth, Jones & Vollrath.",
  lessons: [
    {
      id: "macro-growth-drivers",
      slug: "drivers-of-growth",
      title: "Drivers of Economic Growth",
      content: `## Drivers of Economic Growth

Economic growth — the sustained increase in an economy's output over time — is the most powerful force for improving human welfare. A country growing at 2% per year doubles its living standard every 35 years. A country growing at 7% doubles every 10 years. Understanding what drives growth is arguably the most important question in economics.

### The Power of Compounding

Small differences in growth rates produce enormous differences in living standards over time. If two countries start with the same GDP per capita but one grows at 1% and the other at 3%, after 100 years the faster-growing country will be 7.2 times richer.

As Robert Lucas (1988, *On the Mechanics of Economic Development*, Journal of Monetary Economics) wrote: "The consequences for human welfare involved in questions like these are simply staggering: once one starts to think about them, it is hard to think about anything else."

### The Four Drivers

**1. Physical Capital Accumulation**

Investment in machinery, factories, infrastructure, and technology increases the capital stock, enabling workers to produce more output per hour. Capital investment is financed by saving — either domestic or foreign. Countries with higher saving rates tend to have higher capital stocks and higher GDP per capita.

However, capital accumulation alone cannot sustain growth indefinitely due to diminishing returns — each additional unit of capital produces less additional output than the previous one.

**2. Human Capital (Education and Health)**

Human capital — the knowledge, skills, and health of the workforce — is a critical complement to physical capital. A machine is useless without a trained operator. Barro (1991, *Economic Growth in a Cross Section of Countries*, Quarterly Journal of Economics) found that initial school enrollment rates are one of the strongest predictors of subsequent economic growth across 98 countries.

**3. Technological Progress**

Technology — broadly defined as the knowledge of how to produce goods and services — is the only factor that can sustain growth indefinitely. Unlike physical capital, knowledge does not have diminishing returns — one person's use of an idea does not diminish its availability to others. Romer (1990, *Endogenous Technological Change*, Journal of Political Economy, Nobel Prize 2018) formalized this insight, showing that investment in R&D generates increasing returns at the economy-wide level.

**4. Institutions and Governance**

Property rights, rule of law, contract enforcement, political stability, and inclusive governance create the environment in which the other drivers can flourish. Without secure property rights, no one invests. Without rule of law, contracts are meaningless.

Acemoglu, Johnson & Robinson (2001, *The Colonial Origins of Comparative Development*, American Economic Review) demonstrated that countries with better institutions — measured by protection against expropriation — have dramatically higher GDP per capita, even after controlling for geography and trade.

### The Growth Equation

\`\`\`
GDP Growth = f(Physical Capital, Human Capital, Technology, Institutions)
\`\`\`

All four drivers interact. Technology is useless without human capital to implement it. Capital investment is wasted without institutions to protect it. And institutions do not generate growth without the physical and human capital to exploit opportunities.

### Convergence

Poorer countries with less capital per worker should grow faster (diminishing returns means each unit of capital contributes more when capital is scarce). This is the **convergence hypothesis**. Conditional convergence — controlling for institutions, education, and policies — holds strongly in the data (Barro & Sala-i-Martin, 1992, *Convergence*, Journal of Political Economy).

### Key Takeaway

Economic growth is driven by the accumulation of physical and human capital, technological progress, and the quality of institutions. Of these, technology is the only factor that can sustain growth indefinitely — but it requires the right institutional environment to flourish.

*References: Lucas (1988), Journal of Monetary Economics; Romer (1990), Journal of Political Economy; Acemoglu, Johnson & Robinson (2001), American Economic Review; Barro (1991), Quarterly Journal of Economics.*`,
    },
    {
      id: "macro-growth-solow",
      slug: "solow-growth-model",
      title: "The Solow Growth Model",
      content: `## The Solow Growth Model

The Solow model (Solow, 1956, *A Contribution to the Theory of Economic Growth*, Quarterly Journal of Economics; Nobel Prize 1987) is the foundational model of economic growth. It explains how saving, population growth, and technological progress determine an economy's long-run level of output per worker.

### The Production Function

The Solow model uses an aggregate production function:
\`\`\`
Y = A × F(K, L) = A × K^alpha × L^(1-alpha)
\`\`\`

Where Y = output, A = technology (total factor productivity), K = capital, L = labor, and alpha is capital's share of income (approximately 1/3 in the data).

Per-worker (intensive form):
\`\`\`
y = A × k^alpha
\`\`\`

Where y = Y/L (output per worker) and k = K/L (capital per worker).

### The Capital Accumulation Equation

The change in capital per worker depends on three forces:
\`\`\`
Change in k = s × y - (delta + n) × k
\`\`\`

Where:
- s × y = **investment per worker** (saving rate × output per worker)
- delta × k = **depreciation** (capital wears out)
- n × k = **dilution** (population growth spreads capital thinner)

### The Steady State

The **steady state** is the long-run equilibrium where capital per worker (and thus output per worker) stops changing:

\`\`\`
s × y* = (delta + n) × k*
\`\`\`

Investment exactly replaces depreciated and diluted capital. The economy reaches a constant level of output per worker (without technological progress).

### Key Predictions

**1. Higher saving rate → higher steady-state income per capita.** Countries that save and invest more have more capital per worker and higher output per worker. This explains much of the cross-country income variation.

**2. Diminishing returns to capital → convergence.** Poor countries (low k) have high marginal products of capital, grow faster, and converge toward the steady state. Rich countries (high k) grow more slowly.

**3. Only technological progress can sustain long-run growth in per-capita income.** In the steady state without technology growth, output per worker is constant. Capital accumulation alone hits a ceiling due to diminishing returns.

**4. Population growth reduces per-capita income.** Higher n requires more investment just to maintain capital per worker, leaving less for increasing it.

### The Golden Rule

What saving rate maximizes consumption per worker in the steady state? The **Golden Rule** level of capital (Phelps, 1961):

\`\`\`
MPK = delta + n
\`\`\`

Marginal product of capital equals the depreciation plus population growth rate. Saving too little means inadequate capital; saving too much means sacrificing consumption to maintain capital that yields diminishing returns.

### Empirical Success and Limitations

Mankiw, Romer & Weil (1992, *A Contribution to the Empirics of Economic Growth*, Quarterly Journal of Economics) tested the Solow model augmented with human capital against data from 98 countries. The augmented model explains approximately 80% of cross-country income variation — a remarkable success for such a simple framework.

However, the model does not explain *why* saving rates, population growth, and technology differ across countries — it takes these as exogenous parameters. This limitation motivated the endogenous growth theory of Romer (1990) and Lucas (1988).

### Key Takeaway

The Solow model shows that capital accumulation can raise living standards but cannot sustain growth by itself. Technological progress is the engine of long-run per-capita growth. The model's predictions about convergence and the role of saving are broadly supported by cross-country data.

> "Sustained growth in per capita income can only come from sustained growth in productivity." — Robert Solow

*References: Solow (1956), Quarterly Journal of Economics; Mankiw, Romer & Weil (1992), Quarterly Journal of Economics; Phelps (1961), American Economic Review.*`,
    },
    {
      id: "macro-growth-human-capital-tech",
      slug: "human-capital-and-technology",
      title: "Human Capital & Technology",
      content: `## Human Capital & Technology

While the Solow model identifies technology as the driver of long-run growth, it does not explain where technology comes from. Endogenous growth theory opens the "black box" of technological progress, arguing that innovation is the result of deliberate investment in research, education, and knowledge.

### Endogenous Growth: The Romer Model

Paul Romer (1990, *Endogenous Technological Change*, Journal of Political Economy; Nobel Prize 2018) built a model where technological progress is driven by profit-motivated R&D investment.

Key insight: **Ideas are non-rival.** A physical machine can be used by only one firm at a time, but a design, algorithm, or chemical formula can be used by everyone simultaneously without being "used up." This non-rivalry creates increasing returns to scale at the economy-wide level.

\`\`\`
A(t+1) = A(t) + delta_A × H_A × A(t)
\`\`\`

Where H_A = human capital devoted to research and delta_A = researcher productivity. Technology grows proportionally to the existing stock of ideas (standing on the shoulders of giants) and the number of researchers.

### The Innovation Ecosystem

Technological progress does not happen in isolation. It requires:

1. **Basic research** — understanding fundamental principles (usually publicly funded)
2. **Applied research** — translating basic knowledge into practical applications
3. **Development** — creating commercially viable products and processes
4. **Diffusion** — spreading new technology through adoption and imitation

The United States spends approximately 3.4% of GDP on R&D (OECD, 2023), split between private sector (72%) and government (22%). South Korea and Israel lead globally at 4.8% and 5.4% respectively.

### Human Capital as the Complement to Technology

Technology is embodied in people. An MRI machine is useless without a trained radiologist. Enterprise software requires skilled developers and users. Nelson & Phelps (1966, *Investment in Humans, Technological Diffusion, and Economic Growth*, American Economic Review) showed that countries with higher human capital adopt new technologies faster — even technologies invented elsewhere.

Education has both a **level effect** (more educated workers are more productive) and a **growth effect** (more educated workers innovate faster and adopt technology faster). Cross-country evidence overwhelmingly supports both effects (Hanushek & Woessmann, 2012, *Do Better Schools Lead to More Growth?*, Journal of Economic Growth).

### Intellectual Property and Innovation

Because ideas are non-rival, they are easy to copy. Without protection, firms would underinvest in R&D (they cannot capture the full returns). **Patents** and **copyrights** create temporary monopolies, allowing inventors to recoup their investment. However, they also restrict the diffusion of knowledge — creating a trade-off between incentivizing invention and promoting access.

Nordhaus (1969, *Invention, Growth, and Welfare*, MIT Press) analyzed the optimal patent length, showing it depends on the elasticity of research effort and the social value of diffusion. Too-short patents discourage invention; too-long patents restrict access unnecessarily.

### Technology and Inequality: The Skill Premium

Technological change is often **skill-biased** — it increases demand for skilled workers while reducing demand for routine tasks. Autor, Levy & Murnane (2003, *The Skill Content of Recent Technological Change*, Quarterly Journal of Economics) documented that computerization has automated routine cognitive and manual tasks while complementing non-routine analytical and interpersonal tasks.

This skill-biased technological change is a primary driver of rising income inequality in developed countries since 1980.

### Key Takeaway

Technology does not fall from the sky — it is the product of deliberate investment in R&D, education, and institutions that protect and reward innovation. Human capital is both a direct source of productivity and the essential complement that enables technology adoption and creation.

*References: Romer (1990), Journal of Political Economy; Nelson & Phelps (1966), American Economic Review; Autor, Levy & Murnane (2003), Quarterly Journal of Economics; Hanushek & Woessmann (2012), Journal of Economic Growth.*`,
    },
    {
      id: "macro-growth-institutions",
      slug: "institutions-and-property-rights",
      title: "Institutions & Property Rights",
      content: `## Institutions & Property Rights

Why is South Korea 20 times richer than North Korea? Why did England industrialize before China? The answer, increasingly accepted by economists, is **institutions** — the rules, norms, and enforcement mechanisms that structure economic and political interaction.

### What Are Institutions?

Douglass North (1990, *Institutions, Institutional Change and Economic Performance*, Cambridge University Press; Nobel Prize 1993) defined institutions as "the rules of the game in a society" — both formal (constitutions, laws, property rights, regulations) and informal (customs, traditions, norms of behavior).

Good institutions reduce uncertainty, lower transaction costs, and create incentives for productive activity. Bad institutions create incentives for rent-seeking, corruption, and expropriation.

### Property Rights: The Foundation

Secure property rights are the most fundamental institutional requirement for economic growth. Without assurance that you will keep the fruits of your labor and investment, why work hard or invest?

**Evidence:** Acemoglu, Johnson & Robinson (2001, *The Colonial Origins of Comparative Development*, American Economic Review) exploited a natural experiment: European colonial powers established different institutions in different colonies. In places with high settler mortality (tropical diseases), colonizers established extractive institutions. In places with low settler mortality, they established inclusive institutions with property rights protections. The institutional legacy persists centuries later and explains much of the current cross-country income gap.

De Soto (2000, *The Mystery of Capital*, Basic Books) argued that poor countries often have substantial physical assets but lack the institutional framework (formal property titles, registries) to convert them into capital. He estimated that the world's poor hold approximately \\$9.3 trillion in "dead capital" — assets they cannot leverage because they lack legal title.

### Inclusive vs Extractive Institutions

Acemoglu & Robinson (2012, *Why Nations Fail*, Crown) distinguish between:

**Inclusive institutions:**
- Secure property rights for the broad population
- Enforcement of contracts
- Level playing field for business entry
- Provision of public goods (education, infrastructure)
- Constraints on political power (checks and balances)

**Extractive institutions:**
- Property rights concentrated among elites
- State captures economic surplus for the few
- Barriers to entry protect incumbent firms and oligarchs
- Little investment in public goods

Inclusive institutions create a virtuous cycle: broad property rights → investment and innovation → economic growth → political pressure for further inclusion. Extractive institutions create a vicious cycle: elite capture → underinvestment → stagnation → political instability.

### Rule of Law and Contract Enforcement

Markets cannot function without enforceable contracts. If businesses cannot trust that agreements will be honored, they will not trade, invest, or specialize. The World Bank's Doing Business indicators show strong correlation between ease of contract enforcement and economic development.

### Corruption

Corruption — the misuse of public power for private gain — diverts resources from productive use to rent-seeking. Mauro (1995, *Corruption and Growth*, Quarterly Journal of Economics) found that a one-standard-deviation improvement in a country's corruption index is associated with a 0.8 percentage point increase in GDP growth — a substantial effect over time.

### The Difficulty of Institutional Reform

If institutions are so important, why do not all countries simply adopt good ones? Because existing institutions benefit powerful groups who resist change. Institutional reform is fundamentally a political problem, not a technical one. North (1990) emphasized that institutions evolve through path-dependent processes — small historical accidents can lock countries into inefficient institutional arrangements for centuries.

### Key Takeaway

Institutions — particularly property rights, rule of law, and constraints on political power — are the deepest determinant of economic prosperity. Physical capital, human capital, and technology are the proximate causes of growth, but institutions determine whether those investments are made in the first place.

> "Countries are poor because those who have power make choices that create poverty." — Acemoglu & Robinson, Why Nations Fail

*References: North (1990), Institutions (Cambridge); Acemoglu, Johnson & Robinson (2001), American Economic Review; Acemoglu & Robinson (2012), Why Nations Fail (Crown); Mauro (1995), Quarterly Journal of Economics.*`,
    },
    {
      id: "macro-growth-accounting",
      slug: "growth-accounting",
      title: "Growth Accounting",
      content: `## Growth Accounting

Growth accounting is an empirical method that decomposes economic growth into contributions from capital accumulation, labor growth, and technological progress (total factor productivity). It answers the question: how much of a country's growth came from using more inputs, and how much from using inputs more efficiently?

### The Growth Accounting Framework

Starting from the Cobb-Douglas production function:
\`\`\`
Y = A × K^alpha × L^(1-alpha)
\`\`\`

Taking growth rates:
\`\`\`
Growth in Y = Growth in A + alpha × Growth in K + (1-alpha) × Growth in L
\`\`\`

Rearranging for TFP (the "Solow residual"):
\`\`\`
Growth in A = Growth in Y - alpha × Growth in K - (1-alpha) × Growth in L
\`\`\`

TFP growth is calculated as a residual — the portion of output growth not explained by measured increases in capital and labor. It captures technology, efficiency improvements, institutional changes, and measurement error.

### Solow's Original Finding

Solow (1957, *Technical Change and the Aggregate Production Function*, Review of Economics and Statistics) applied this framework to U.S. data from 1909-1949 and found that approximately 87.5% of output growth per worker was attributable to TFP — not capital accumulation. This stunning result meant that technology and efficiency, not simply building more factories, drove most of American economic growth.

### Modern Growth Accounting Results

| Country/Period | Capital Contribution | Labor Contribution | TFP Contribution |
|---------------|---------------------|-------------------|------------------|
| U.S. (1950-2000) | 35% | 30% | 35% |
| East Asian Tigers (1960-1990) | 55% | 20% | 25% |
| China (1980-2010) | 50% | 10% | 40% |
| Sub-Saharan Africa (1960-2000) | 30% | 45% | 25% |

Source: Compiled from Hall & Jones (1999), Hsieh & Klenow (2010), and World Bank data.

### The East Asian Miracle Debate

Krugman (1994, *The Myth of Asia's Miracle*, Foreign Affairs) argued, based on growth accounting, that the rapid growth of the East Asian Tigers (South Korea, Taiwan, Singapore, Hong Kong) was primarily driven by capital accumulation and labor force growth — not TFP. He compared it to Soviet growth: impressive input-driven growth that eventually hit diminishing returns.

Young (1995, *The Tyranny of Numbers*, Quarterly Journal of Economics) provided detailed growth accounting for the Tigers, confirming that TFP growth was modest (1-2% per year). However, Hsieh (2002) challenged these findings using alternative methodologies, suggesting TFP growth in Singapore was higher than Young estimated.

### Limitations of Growth Accounting

**1. TFP is a residual:** It captures everything not explained by measured inputs — including measurement error, changes in input quality, reallocation of resources, and institutional improvements. Abramovitz (1956) called it "a measure of our ignorance."

**2. Capital quality changes:** A 2024 computer is vastly more productive than a 1990 computer, but standard growth accounting may not fully capture this quality improvement.

**3. Human capital:** Standard growth accounting uses raw labor hours. Augmenting with education and experience — as Mankiw, Romer & Weil (1992) proposed — significantly changes the decomposition, reducing the TFP residual.

**4. Misallocation:** Hsieh & Klenow (2009, *Misallocation and Manufacturing TFP in China and India*, Quarterly Journal of Economics) showed that reallocating resources from less productive to more productive firms within the same industry could increase TFP by 30-50% in China and 40-60% in India — without any new technology.

### Policy Implications

Growth accounting teaches us that policies should focus on:
- **TFP growth** — investing in R&D, education, and institutional quality
- **Efficient allocation** — removing barriers that trap resources in unproductive firms
- **Capital accumulation** — necessary but not sufficient; subject to diminishing returns

### Key Takeaway

Growth accounting reveals that long-run economic growth depends not just on accumulating more inputs but on using them more productively. TFP — the efficiency with which an economy combines capital and labor — is the key differentiator between prosperous and stagnating economies.

*References: Solow (1957), Review of Economics and Statistics; Krugman (1994), Foreign Affairs; Young (1995), Quarterly Journal of Economics; Hsieh & Klenow (2009), Quarterly Journal of Economics.*`,
    },
  ],
};
