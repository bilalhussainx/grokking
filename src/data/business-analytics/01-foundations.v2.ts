import { Module } from "../types";

export const foundationsModule: Module = {
  id: "ba-foundations",
  title: "Foundations of Business Analytics",
  description: "Understand the analytics landscape: descriptive, diagnostic, predictive, and prescriptive analytics, data-driven decisions, and tools.",
  lessons: [
    {
      id: "ba-what-is",
      slug: "what-is-business-analytics",
      title: "What is Business Analytics?",
      content: `## What is Business Analytics?

Business analytics is the practice of **using data, statistical analysis, and quantitative methods to drive business decisions**. Harvard Business School professor Thomas Davenport defined it as "the extensive use of data, statistical and quantitative analysis, explanatory and predictive models, and fact-based management to drive decisions and actions."

### Why Business Analytics Matters

McKinsey research (cited in HBS courses) shows that data-driven organizations are:
- **23x more likely** to acquire customers
- **6x more likely** to retain customers
- **19x more likely** to be profitable

### The Analytics Maturity Model

Organizations progress through four stages of analytics maturity:

**1. Descriptive Analytics**: What happened?
- Dashboards, reports, KPIs
- Example: "Revenue grew 15% last quarter"

**2. Diagnostic Analytics**: Why did it happen?
- Root cause analysis, drill-down analysis
- Example: "Revenue grew because our new product launch drove 40% more trial signups"

**3. Predictive Analytics**: What will happen?
- Forecasting, machine learning, statistical modeling
- Example: "Based on current trends, we predict 20% growth next quarter"

**4. Prescriptive Analytics**: What should we do?
- Optimization, simulation, decision analysis
- Example: "To maximize growth, allocate 60% of marketing budget to digital channels"

### The Analytics Value Chain

\`\`\`
Data Collection -> Data Cleaning -> Analysis -> Insight -> Decision -> Action -> Impact
\`\`\`

Each step adds value, but the final steps (insight to action) are where business value is created. Many organizations invest heavily in data collection and analysis but fail to translate insights into decisions.

### The Data-Driven Decision Process

1. **Define the question**: What specific business decision are you trying to inform?
2. **Identify data needs**: What data would answer this question?
3. **Collect and clean data**: Gather data and ensure quality
4. **Analyze**: Apply appropriate analytical methods
5. **Interpret**: What does the analysis tell us?
6. **Decide**: Make a decision informed by (not determined by) the data
7. **Measure**: Track the outcome to validate the decision

### Key Takeaway

Business analytics is not about technology -- it is about better decision-making. The goal is not to generate reports or build models but to help leaders make decisions that create value.

**Sources**: Davenport, T. H. (2006). "Competing on Analytics." *Harvard Business Review*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-types",
      slug: "types-of-analytics",
      title: "Descriptive, Diagnostic, Predictive & Prescriptive",
      content: `## Types of Analytics

HBS analytics courses organize the field into four types, each answering a different question and requiring different capabilities. Understanding which type is appropriate for your situation is the first step to effective analytics.

### Descriptive Analytics: What Happened?

Descriptive analytics summarizes historical data to understand what has occurred.

**Tools**: Dashboards (Tableau, Power BI), SQL queries, spreadsheets, basic statistics (mean, median, totals).

**Examples**:
- Monthly revenue report
- Customer segmentation by demographics
- Website traffic analysis
- Employee turnover rates

**Limitation**: Tells you what happened but not why or what to do about it.

### Diagnostic Analytics: Why Did It Happen?

Diagnostic analytics explores the causes behind observed patterns.

**Tools**: Drill-down analysis, data discovery, correlation analysis, root cause analysis.

**Techniques**:
- **Drill-down**: Start with an aggregate number and break it into components. Revenue dropped -> Which region? -> Which product? -> Which customer segment?
- **Correlation analysis**: Identify factors that co-occur with the outcome. Do customers who attend webinars convert at higher rates?
- **Anomaly detection**: Find data points that deviate from expected patterns

**Examples**:
- Why did customer churn increase this quarter?
- What factors drive the highest customer satisfaction scores?
- Why did marketing campaign X outperform campaign Y?

### Predictive Analytics: What Will Happen?

Predictive analytics uses statistical models and machine learning to forecast future outcomes based on historical data.

**Tools**: Regression models, time series analysis, machine learning (Python/R), forecasting software.

**Examples**:
- Demand forecasting for inventory planning
- Customer churn prediction
- Credit risk scoring
- Sales pipeline forecasting

**Key insight**: Predictive models are never perfectly accurate. The question is not "is this prediction right?" but "is this prediction good enough to improve our decisions?"

### Prescriptive Analytics: What Should We Do?

Prescriptive analytics recommends optimal actions based on predictions and constraints.

**Tools**: Optimization algorithms, simulation, decision analysis, A/B testing frameworks.

**Examples**:
- Optimal pricing given demand curves and competitor behavior
- Best marketing channel mix given budget constraints
- Optimal staffing schedule given demand forecasts
- Supply chain optimization

### Matching Analytics to Business Questions

| Question | Analytics Type | Complexity | Value |
|----------|---------------|------------|-------|
| What are our sales by region? | Descriptive | Low | Moderate |
| Why did churn increase? | Diagnostic | Medium | Moderate-High |
| Which customers will churn next month? | Predictive | High | High |
| What should we offer to prevent churn? | Prescriptive | Highest | Highest |

### Key Takeaway

Most organizations spend 80% of their analytics effort on descriptive (what happened) and only 20% on predictive and prescriptive (what will happen and what to do). Shifting this balance toward predictive and prescriptive analytics is where the greatest business value lies.

**Sources**: Davenport, T. H. & Harris, J. G. (2007). *Competing on Analytics*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-data-driven",
      slug: "data-driven-decision-making",
      title: "Data-Driven Decision Making",
      content: `## Data-Driven Decision Making

HBS professor Erik Brynjolfsson's research demonstrates that **companies that adopt data-driven decision-making are 5-6% more productive and profitable** than their competitors. Yet most organizations still rely primarily on intuition, experience, and politics for major decisions.

### What Data-Driven Really Means

Data-driven does not mean "let the data decide." It means **using data to inform human judgment**, not replace it. The best decisions combine:

- **Data**: What do the numbers tell us?
- **Experience**: What does our expertise suggest?
- **Judgment**: What factors are not captured in the data?
- **Values**: What do we believe is right?

### The Decision Quality Spectrum

\`\`\`
Poor <------------------------------------------------> Excellent

Gut feel  ->  Anecdotes  ->  Basic data  ->  Analytics  ->  Experimentation
only          and stories     and reports      and models      and A/B tests
\`\`\`

### Building Data-Driven Capability

**1. Ask Better Questions**: The most common analytics failure is answering the wrong question perfectly. Start with the business decision, then identify what data would inform it.

**2. Build Data Literacy**: Ensure that managers across the organization can interpret data, understand basic statistics, and identify common analytical pitfalls.

**3. Democratize Access**: Give teams self-service access to data and analytics tools. When only the data team can pull numbers, decisions wait.

**4. Create Feedback Loops**: Track the outcomes of data-informed decisions. Was the prediction accurate? Did the recommended action work? Continuous learning improves future decisions.

**5. Accept Uncertainty**: Data reduces uncertainty but never eliminates it. Teach the organization to make decisions under uncertainty rather than waiting for perfect information.

### When Data Misleads

- **Survivorship bias**: Analyzing only successes, ignoring failures
- **Correlation vs. causation**: Ice cream sales and drowning deaths correlate, but one does not cause the other
- **Simpson's paradox**: A trend that appears in aggregate data reverses when data is segmented
- **Measurement error**: The data itself may be inaccurate or incomplete
- **Overfitting**: A model that fits historical data perfectly but predicts poorly

### Key Takeaway

Data-driven decision-making is a cultural shift, not a technology purchase. It requires asking better questions, building analytical capability, democratizing data access, and maintaining the humility to know when data should lead and when it should inform.

**Sources**: Brynjolfsson, E. & McElheran, K. (2016). "Data-Driven Decision Making." *American Economic Review*. McAfee, A. & Brynjolfsson, E. (2012). "Big Data." *Harvard Business Review*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-process",
      slug: "the-analytics-process",
      title: "The Analytics Process",
      content: `## The Analytics Process

Effective analytics follows a structured process -- from question to action. HBS teaches a six-step process that ensures analytics efforts are focused on creating business value, not just generating interesting insights.

### The CRISP-DM Framework

The Cross-Industry Standard Process for Data Mining (CRISP-DM) is the most widely used analytics process framework:

**1. Business Understanding**: What is the business problem? What decision needs to be made? What would a good answer look like?

**2. Data Understanding**: What data is available? What is its quality? What additional data is needed?

**3. Data Preparation**: Clean, transform, and organize data for analysis. This typically consumes 60-80% of analytics effort.

**4. Modeling**: Apply appropriate analytical techniques -- statistical models, machine learning, optimization.

**5. Evaluation**: Does the model answer the business question? Is it accurate enough? Does it make sense to domain experts?

**6. Deployment**: Implement the solution -- dashboards, automated systems, recommendations, or decisions.

### Data Quality: The Foundation

"Garbage in, garbage out" is the oldest rule in analytics. Common data quality issues:

| Issue | Example | Impact |
|-------|---------|--------|
| Missing values | Customer records without email | Biased analysis |
| Duplicates | Same customer counted twice | Inflated metrics |
| Inconsistency | "USA" vs "US" vs "United States" | Incorrect aggregation |
| Outliers | A \\$1M transaction in a \\$100 average dataset | Skewed statistics |
| Stale data | Using last year's prices for today's decisions | Bad recommendations |

### The Analytics Team

Effective analytics requires multiple skill sets:

- **Business analysts**: Translate business problems into analytical questions
- **Data engineers**: Build and maintain data infrastructure
- **Data scientists**: Build predictive models and advanced analytics
- **Data analysts**: Create reports, dashboards, and ad hoc analyses
- **Business leaders**: Define questions and act on insights

### Key Takeaway

The analytics process is not linear -- it is iterative. Expect to cycle between understanding, preparation, modeling, and evaluation multiple times. The key is starting with a clear business question and maintaining focus on actionable insights.

**Sources**: Chapman, P. et al. (2000). CRISP-DM 1.0 Step-by-Step Data Mining Guide. Provost, F. & Fawcett, T. (2013). *Data Science for Business*. O'Reilly. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-tools",
      slug: "tools-of-the-trade",
      title: "Tools of the Trade",
      content: `## Tools of the Trade

Business analytics relies on a toolkit that ranges from spreadsheets to machine learning platforms. HBS teaches that **the tool should match the question** -- using a machine learning model for a question that a pivot table can answer wastes time and creates unnecessary complexity.

### The Analytics Tool Stack

**Tier 1: Spreadsheets (Excel, Google Sheets)**
- Best for: Quick analysis, small datasets, ad hoc calculations, sharing with non-technical stakeholders
- Limitations: Slow with large datasets (>100K rows), limited analytical methods, version control issues
- Everyone in business should be proficient here

**Tier 2: SQL (Structured Query Language)**
- Best for: Querying databases, aggregating large datasets, data extraction
- Most business data lives in databases. SQL is the language to access it.
- Essential for: analysts, product managers, marketers, anyone who needs data

**Tier 3: Python / R (Programming Languages)**
- Best for: Statistical analysis, machine learning, automation, visualization
- Python is the most popular choice for business analytics and data science
- Libraries: pandas (data manipulation), scikit-learn (ML), matplotlib/seaborn (visualization), statsmodels (statistics)

**Tier 4: BI Platforms (Tableau, Power BI, Looker)**
- Best for: Interactive dashboards, data visualization, self-service analytics
- Enable non-technical users to explore data visually

**Tier 5: Specialized Tools**
- **Statistical packages**: SPSS, SAS, Stata (academic and enterprise)
- **Optimization**: Gurobi, CPLEX (linear/integer programming)
- **Big data**: Spark, Hadoop (massive datasets)
- **ML platforms**: AWS SageMaker, Google Vertex AI, Azure ML

### Choosing the Right Tool

| Question | Recommended Tool |
|----------|------------------|
| Quick calculation or summary? | Spreadsheet |
| Need data from a database? | SQL |
| Statistical analysis or modeling? | Python/R |
| Recurring dashboard or report? | Tableau/Power BI |
| Large-scale ML model? | Python + ML platform |
| Optimization problem? | Python + specialized solver |

### The Most Important Skill

The most important analytical skill is not mastery of any particular tool -- it is **analytical thinking**: the ability to frame a business problem, identify the right data and method, interpret results critically, and communicate findings clearly. Tools change; thinking endures.

### Key Takeaway

Start with the simplest tool that answers your question. Spreadsheets solve 80% of business analytics problems. SQL handles most data extraction needs. Python/R handle advanced analytics. The tool matters less than the quality of the question and the rigor of the analysis.

**Sources**: HBS Online, "Business Analytics" course. Provost, F. & Fawcett, T. (2013). *Data Science for Business*. O'Reilly. McKinney, W. (2017). *Python for Data Analysis*. O'Reilly.`,
    },
  ],
};
