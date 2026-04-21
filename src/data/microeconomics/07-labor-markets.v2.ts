import { Module } from "../types";

export const laborMarketsModule: Module = {
  id: "micro-labor",
  title: "Labor Markets",
  description: "Analyze how wages are determined — labor supply and demand, human capital theory, wage discrimination, and the minimum wage debate. Resources: Borjas Labor Economics, Mankiw Principles of Economics, Journal of Labor Economics.",
  lessons: [
    {
      id: "micro-labor-supply-demand",
      slug: "labor-supply-and-demand",
      title: "Labor Supply & Demand",
      content: `## Labor Supply & Demand

The labor market determines wages and employment — two of the most important economic outcomes for most people. While labor markets follow the same supply-and-demand logic as product markets, labor has unique characteristics that create distinctive dynamics.

### Labor Demand

Firms demand labor because workers produce output that can be sold. Labor demand is a **derived demand** — it depends on the demand for the product the labor produces.

**The Marginal Revenue Product of Labor (MRPL):**
\`\`\`
MRPL = Marginal Product of Labor × Price of Output = MPL × P
\`\`\`

A profit-maximizing firm hires workers until MRPL = Wage. This is the labor market analog of MR = MC.

| Workers | MPL (units/day) | Price per Unit | MRPL | Wage | Hire? |
|---------|----------------|---------------|------|------|-------|
| 1 | 20 | \\$10 | \\$200 | \\$120 | Yes |
| 2 | 18 | \\$10 | \\$180 | \\$120 | Yes |
| 3 | 15 | \\$10 | \\$150 | \\$120 | Yes |
| 4 | 12 | \\$10 | \\$120 | \\$120 | Indifferent |
| 5 | 8 | \\$10 | \\$80 | \\$120 | No |

The firm hires 4 workers. The downward-sloping MRPL curve is the firm's labor demand curve.

**Determinants of labor demand shifts:**
- Product demand (more demand for output → more demand for labor)
- Technology (may increase MPL → shift demand right; or replace labor → shift demand left)
- Number of firms in the industry
- Prices of complementary and substitute inputs

### Labor Supply

Individuals supply labor by choosing how many hours to work, weighing the benefit (wages) against the cost (forgone leisure).

**The labor-leisure tradeoff:** Each hour worked earns the wage rate but costs one hour of leisure. The individual maximizes utility by working until the marginal utility of the wage equals the marginal utility of leisure.

**The backward-bending labor supply curve:** At low wages, higher wages increase labor supply (substitution effect dominates — work is more attractive relative to leisure). At high wages, higher wages may decrease labor supply (income effect dominates — the worker is wealthy enough to "buy" more leisure).

Empirical evidence supports the backward bend for high earners. Saez (2001, *Using Elasticities to Derive Optimal Income Tax Rates*, Review of Economic Studies) estimated that the compensated elasticity of labor supply is approximately 0.25 for men, meaning a 10% wage increase leads to only a 2.5% increase in hours worked.

**Determinants of labor supply shifts:**
- Population size and demographics
- Immigration policy
- Social norms (e.g., women's labor force participation rose dramatically from 1960-2000)
- Government policies (welfare programs, childcare availability, retirement age)

### Equilibrium Wage and Employment

Like any market, the labor market reaches equilibrium where supply equals demand:

\`\`\`
At the equilibrium wage:
  Quantity of labor demanded = Quantity of labor supplied
\`\`\`

Above the equilibrium wage: surplus of labor (unemployment)
Below the equilibrium wage: shortage of labor (unfilled positions)

### Wage Differences Across Industries

If labor were homogeneous and perfectly mobile, wages would equalize across all jobs. In reality, wages differ because of:
- **Skill differences** — a brain surgeon is scarcer than a cashier
- **Compensating differentials** — dangerous, unpleasant, or inconvenient jobs pay more to attract workers (Smith, 1776)
- **Efficiency wages** — firms pay above-market wages to reduce turnover, increase effort, or attract better applicants (Shapiro & Stiglitz, 1984, *Equilibrium Unemployment as a Worker Discipline Device*, American Economic Review)
- **Institutional factors** — unions, licensing requirements, minimum wages

### Key Takeaway

Wages are determined by the interaction of labor supply and demand, with the marginal revenue product of labor as the key demand-side concept. Differences in skills, working conditions, and institutional factors explain the vast wage differences we observe across occupations and industries.

*References: Saez (2001), Review of Economic Studies; Shapiro & Stiglitz (1984), American Economic Review; Borjas (2020), Labor Economics (McGraw-Hill); Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-labor-wages",
      slug: "wage-determination",
      title: "Wage Determination",
      content: `## Wage Determination

Why do some workers earn millions while others earn minimum wage? Wage determination is shaped by productivity, bargaining power, institutional factors, and market structure. Understanding these forces is essential for analyzing income inequality, poverty, and labor policy.

### Competitive Wage Theory

In a perfectly competitive labor market, wages equal the **marginal revenue product of labor (MRPL)** — the value of what the last worker produces. High wages reflect high productivity, which in turn reflects skill, experience, and the value of the output.

This theory predicts that workers are paid according to their contribution. While elegant, it assumes frictionless labor markets — which rarely exist in practice.

### Monopsony: Employer Market Power

A **monopsony** exists when there is only one buyer of labor (or a few dominant employers). The monopsonist faces an upward-sloping labor supply curve — to hire more workers, it must offer higher wages to everyone, not just the marginal worker.

\`\`\`
Marginal Cost of Labor > Wage (for a monopsonist)
\`\`\`

The monopsonist hires fewer workers at lower wages than would prevail in a competitive market — creating a deadweight loss analogous to monopoly in product markets.

Manning (2003, *Monopsony in Motion*, Princeton University Press) argued that many labor markets exhibit monopsonistic features due to search frictions, geographic immobility, and employer-specific skills. Even markets with multiple employers can exhibit monopsony power if workers face significant costs of switching jobs.

### Efficiency Wages

Some firms deliberately pay above the market-clearing wage. Why? Efficiency wage theory provides several explanations:

1. **Shirking model** — higher wages increase the cost of being fired, motivating effort (Shapiro & Stiglitz, 1984)
2. **Turnover model** — higher wages reduce employee turnover, saving recruitment and training costs
3. **Adverse selection model** — higher wages attract more productive applicants
4. **Fair wage model** — workers who feel underpaid reduce effort; above-market wages elicit reciprocity (Akerlof & Yellen, 1990, *The Fair Wage-Effort Hypothesis*, Quarterly Journal of Economics)

Henry Ford's famous \\$5/day wage in 1914 (more than double the prevailing rate) is a classic efficiency wage example. Turnover dropped 90%, absenteeism fell, and productivity increased enough to more than offset the higher wage bill (Raff & Summers, 1987, *Did Henry Ford Pay Efficiency Wages?*, Journal of Labor Economics).

### Compensating Differentials

Workers require higher wages to accept jobs with undesirable characteristics:
- Dangerous work (mining, logging, construction)
- Unpleasant conditions (overnight shifts, extreme temperatures)
- Unstable employment (seasonal work, gig economy)
- Remote locations

The theory of compensating differentials dates to Adam Smith (1776). Empirical estimates by Viscusi & Aldy (2003, *The Value of a Statistical Life*, Journal of Risk and Uncertainty) found that U.S. workers require approximately \\$7-9 million in additional lifetime wages per statistical life of risk — the "value of a statistical life" used in cost-benefit analysis of safety regulations.

### Unions and Collective Bargaining

Unions increase wages by bargaining collectively, creating a wage premium of approximately 10-15% in the U.S. (Freeman & Medoff, 1984, *What Do Unions Do?*, Basic Books). However, union membership has declined from 35% of private-sector workers in the 1950s to about 6% today — shifting bargaining power toward employers.

### Tournament Theory

In hierarchical organizations, compensation often follows a tournament structure — large pay gaps between levels motivate competition for promotion. CEO pay is high not necessarily because the CEO is hundreds of times more productive, but because the prize motivates effort at every level below (Lazear & Rosen, 1981, *Rank-Order Tournaments as Optimum Labor Contracts*, Journal of Political Economy).

### Key Takeaway

Wages are determined by a complex interaction of productivity, market power, institutional factors, and non-monetary job characteristics. No single theory explains all wage variation — competitive theory, monopsony, efficiency wages, and bargaining power each capture part of the picture.

*References: Manning (2003), Monopsony in Motion (Princeton); Akerlof & Yellen (1990), Quarterly Journal of Economics; Raff & Summers (1987), Journal of Labor Economics; Viscusi & Aldy (2003), Journal of Risk and Uncertainty.*`,
    },
    {
      id: "micro-labor-human-capital",
      slug: "human-capital",
      title: "Human Capital",
      content: `## Human Capital

Human capital refers to the knowledge, skills, and abilities that workers acquire through education, training, and experience. It is the single most important determinant of individual earnings and a critical driver of economic growth.

### The Human Capital Model

Gary Becker (1964, *Human Capital*, University of Chicago Press; Nobel Prize 1992) formalized the idea that investing in education and training is analogous to investing in physical capital — it costs money today but increases future productivity and earnings.

\`\`\`
Investment decision: Invest in education if PV(increased lifetime earnings) > Cost of education
\`\`\`

### Returns to Education

The **wage premium** for education has been extensively measured. A classic approach estimates the "Mincer equation" (Mincer, 1974, *Schooling, Experience, and Earnings*, Columbia University Press):

\`\`\`
ln(Wage) = alpha + beta_s * Schooling + beta_e * Experience + beta_e2 * Experience^2
\`\`\`

Estimates of beta_s (the return to an additional year of schooling) cluster around 8-13% in developed countries — meaning each additional year of education increases wages by approximately 8-13% (Card, 1999, *The Causal Effect of Education on Earnings*, Handbook of Labor Economics).

### Education Premium Over Time

| Degree | Median Annual Earnings (2023) | Unemployment Rate |
|--------|------------------------------|-------------------|
| Less than high school | \\$35,000 | 5.4% |
| High school diploma | \\$45,760 | 3.7% |
| Bachelor's degree | \\$75,000 | 2.2% |
| Master's degree | \\$85,000 | 1.9% |
| Professional degree (MD, JD) | \\$105,000 | 1.4% |

Source: Bureau of Labor Statistics, Current Population Survey, 2023.

The college wage premium (bachelor's vs high school) has roughly doubled since 1980 — from about 40% to 80% — driven by rising demand for skilled workers and technological change (Goldin & Katz, 2008, *The Race Between Education and Technology*, Harvard University Press).

### General vs Specific Human Capital

**General human capital** (literacy, numeracy, critical thinking) is valuable across all employers. Workers bear the cost (tuition) and capture the return (higher wages from any employer).

**Specific human capital** (knowledge of a particular firm's systems, relationships with specific clients) is valuable only to the current employer. Firms invest in specific training (paying workers during training) because employees cannot take this capital to a competitor.

This distinction, formalized by Becker (1964), explains why firms invest in some training but not others, and why long-tenured employees earn premiums — their firm-specific knowledge makes them more valuable to the current employer than to competitors.

### Signaling vs Human Capital

An ongoing debate: does education actually increase productivity (the human capital view), or does it merely signal pre-existing ability (the signaling view)?

Spence (1973) argued that education signals ability — high-ability workers find school easier, so they obtain more education to differentiate themselves. Under pure signaling, eliminating education would not reduce productivity at all.

The truth likely involves both mechanisms. Lange & Topel (2006, *The Social Value of Education and Human Capital*, Handbook of the Economics of Education) estimated that signaling accounts for 20-30% of the education premium, with genuine skill acquisition accounting for the remainder.

### Health as Human Capital

Grossman (1972, *On the Concept of Health Capital*, Journal of Political Economy) extended human capital theory to health. Healthier workers are more productive, miss fewer days, and have longer working careers. Investment in health (nutrition, exercise, medical care) follows the same logic as investment in education.

### Key Takeaway

Human capital — the skills and knowledge workers bring to the labor market — is the primary determinant of individual earnings and a major driver of economic growth. Education is the most important form of human capital investment, with returns of 8-13% per year of schooling.

*References: Becker (1964), Human Capital (Chicago); Card (1999), Handbook of Labor Economics; Goldin & Katz (2008), The Race Between Education and Technology (Harvard); Mincer (1974), Schooling, Experience, and Earnings (Columbia).*`,
    },
    {
      id: "micro-labor-discrimination",
      slug: "labor-market-discrimination",
      title: "Discrimination in Labor Markets",
      content: `## Discrimination in Labor Markets

Labor market discrimination exists when workers with identical productivity receive different wages or employment opportunities based on characteristics unrelated to their job performance — such as race, gender, age, or ethnicity. Understanding discrimination requires distinguishing between different sources and developing methods to measure its magnitude.

### The Wage Gap: Raw Numbers

In 2023, women working full-time in the United States earned approximately 84 cents for every dollar earned by men (Bureau of Labor Statistics, 2024). The racial wage gap is similarly persistent: Black workers earned approximately 76% of white workers' median income.

However, raw wage gaps overstate discrimination because they do not account for differences in education, experience, occupation, hours worked, and other productivity-related factors.

### The Adjusted Wage Gap

Economists estimate the **unexplained gap** — the portion of the wage difference that remains after controlling for all measurable productivity-related factors:

\`\`\`
Raw Gap = Explained Gap (differences in characteristics) + Unexplained Gap (potential discrimination)
\`\`\`

Blau & Kahn (2017, *The Gender Wage Gap*, Journal of Economic Literature) found that after controlling for education, experience, occupation, industry, and hours, the unexplained gender gap in the U.S. is approximately 8-10%. For race, Charles & Guryan (2008, *Prejudice and Wages*, Journal of Political Economy) estimated an unexplained Black-white gap of 8-12%.

The unexplained gap is an upper bound on discrimination — it may include unmeasured productivity differences. But it is also a lower bound in another sense — if discrimination affects education, occupation choice, or experience, those "explained" factors are themselves partly caused by discrimination.

### Becker's Model of Taste-Based Discrimination

Becker (1957, *The Economics of Discrimination*, University of Chicago Press) modeled discrimination as a "taste" — some employers, workers, or customers prefer not to interact with certain groups and are willing to pay a cost to avoid it.

**Key prediction:** In a competitive market, discrimination is costly for the discriminator. An employer who refuses to hire productive Black workers pays higher wages to less productive white workers. Competitive pressure should drive discriminating firms out of business — implying that persistent discrimination requires market power or collusion.

### Statistical Discrimination

Phelps (1972) and Arrow (1973) proposed that employers may use group characteristics as a proxy for individual productivity when individual information is costly to obtain.

If an employer believes (correctly or not) that Group A has lower average productivity than Group B, they may offer lower wages to all Group A members — even though many individuals in Group A are highly productive. This is rational (profit-maximizing) discrimination based on imperfect information.

Statistical discrimination is especially pernicious because it can be self-reinforcing: if Group A faces lower returns to education (due to discrimination), Group A members invest less in education, confirming the employer's belief.

### Audit Studies

The most convincing evidence of discrimination comes from **audit studies** — experiments that send identical resumes with different names:

Bertrand & Mullainathan (2004, *Are Emily and Greg More Employable Than Lakisha and Jamal?*, American Economic Review) sent 5,000 resumes to job postings in Boston and Chicago. Resumes with "white-sounding" names received 50% more callbacks than identical resumes with "African-American-sounding" names.

Neumark, Bank & Van Nort (1996) sent male and female job applicants with identical qualifications to restaurants. High-price restaurants were 40% more likely to interview male applicants.

### Occupational Segregation

Much of the wage gap reflects **occupational segregation** — the concentration of women and minorities in lower-paying occupations. Whether this reflects free choice, socialization, or barriers to entry is debated. Goldin (2014, *A Grand Gender Convergence*, American Economic Review) argued that the remaining gender gap is driven primarily by the high returns to long, inflexible working hours in certain professions (finance, law, consulting).

### Key Takeaway

Labor market discrimination is real and measurable — audit studies provide direct experimental evidence. The challenge is distinguishing discrimination from other factors and designing policies that address root causes without creating unintended consequences.

*References: Becker (1957), The Economics of Discrimination (Chicago); Bertrand & Mullainathan (2004), American Economic Review; Blau & Kahn (2017), Journal of Economic Literature; Goldin (2014), American Economic Review.*`,
    },
    {
      id: "micro-labor-minimum-wage",
      slug: "minimum-wage-debate",
      title: "The Minimum Wage Debate",
      content: `## The Minimum Wage Debate

The minimum wage is one of the most debated topics in economics. On one side: a minimum wage raises incomes for low-wage workers, reducing poverty. On the other: it may destroy jobs for the very workers it aims to help. Decades of research have not produced a consensus — but they have significantly narrowed the disagreement.

### The Standard Model Prediction

In a competitive labor market, a minimum wage set above the equilibrium wage creates a surplus of labor (unemployment). At the minimum wage:

\`\`\`
Quantity of labor supplied > Quantity of labor demanded = Unemployment
\`\`\`

The jobs lost are concentrated among the least skilled and least experienced workers — precisely the group the policy aims to help. The standard prediction is clear: minimum wages cause unemployment, particularly among teenagers, minorities, and workers with limited education (Stigler, 1946, *The Economics of Minimum Wage Legislation*, American Economic Review).

### The Card-Krueger Revolution

Card & Krueger (1994, *Minimum Wages and Employment*, American Economic Review) challenged the standard model with a natural experiment. They compared fast-food employment in New Jersey (which raised its minimum wage from \\$4.25 to \\$5.05) with neighboring Pennsylvania (which did not). Their finding: **employment in New Jersey fast-food restaurants actually increased slightly** relative to Pennsylvania.

This study was revolutionary and controversial. It suggested that the standard competitive model might not describe low-wage labor markets accurately.

### Why the Standard Model May Be Wrong

Several explanations reconcile the Card-Krueger finding with economic theory:

**1. Monopsony power:** If employers have wage-setting power (monopsony), they already pay below the competitive wage. A moderate minimum wage can increase both wages and employment simultaneously — moving the market closer to the competitive outcome, not away from it (Manning, 2003).

**2. Efficiency wage effects:** Higher minimum wages reduce turnover and increase worker effort, partially or fully offsetting the higher labor cost.

**3. Demand-side effects:** Higher wages for low-income workers increase consumer spending (since low-income workers spend a higher fraction of income), boosting demand for the goods these workers produce.

### The Modern Empirical Literature

Decades of research since Card-Krueger have produced a nuanced picture:

**Studies finding small or zero employment effects:**
- Dube, Lester & Reich (2010, *Minimum Wage Effects Across State Borders*, Review of Economics and Statistics) compared counties on opposite sides of state borders with different minimum wages and found no significant employment effects.
- Cengiz et al. (2019, *The Effect of Minimum Wages on Low-Wage Jobs*, Quarterly Journal of Economics) analyzed 138 state-level minimum wage increases and found that job losses in the below-minimum-wage range were almost exactly offset by job gains just above the minimum wage.

**Studies finding negative employment effects:**
- Neumark & Wascher (2008, *Minimum Wages*, MIT Press) surveyed the literature and concluded that the preponderance of evidence points to negative employment effects for the least skilled.
- Clemens & Wither (2019, *The Minimum Wage and the Great Recession*, Journal of Labor Economics) found that federal minimum wage increases during the Great Recession reduced employment by 6% among affected workers.

### The \\$15 Minimum Wage

The CBO (2019) estimated that raising the federal minimum wage to \\$15 would:
- Lift 1.3 million workers out of poverty
- Raise wages for 17 million workers
- But eliminate approximately 1.3 million jobs (with a wide uncertainty range of 0-3.7 million)

### The Emerging Consensus

Most labor economists now agree on several points:

1. **Moderate minimum wage increases** (up to ~60% of the median wage) have small or negligible employment effects
2. **Large minimum wage increases** may cause measurable job losses, particularly in low-cost regions
3. **The effects vary by context** — a \\$15 minimum wage has different impacts in San Francisco (where the median wage is high) vs rural Mississippi (where it is low)
4. **Some workers gain (higher wages), while others lose (fewer jobs)** — the net welfare effect depends on magnitudes

### Key Takeaway

The minimum wage debate illustrates a broader lesson: simple models give simple predictions, but reality is more complex. The competitive model's prediction of job losses is logically correct — but real labor markets feature monopsony power, search frictions, and efficiency wage effects that complicate the picture.

> "The minimum wage is the most studied topic in economics, and one of the least resolved." — Alan Manning, London School of Economics

*References: Card & Krueger (1994), American Economic Review; Dube, Lester & Reich (2010), Review of Economics and Statistics; Cengiz et al. (2019), Quarterly Journal of Economics; Neumark & Wascher (2008), Minimum Wages (MIT Press).*`,
    },
  ],
};
