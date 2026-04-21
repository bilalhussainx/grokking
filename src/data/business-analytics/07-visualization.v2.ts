import { Module } from "../types";

export const visualizationModule: Module = {
  id: "ba-visualization",
  title: "Data Visualization",
  description: "Master visualization principles, chart selection, dashboard design, storytelling with data, and executive presentations.",
  lessons: [
    {
      id: "ba-viz-principles",
      slug: "principles-of-data-visualization",
      title: "Principles of Data Visualization",
      content: `## Principles of Data Visualization

Edward Tufte, the godfather of data visualization (whose work is required reading in many HBS courses), argues that **excellent graphics are those that give the viewer the greatest number of ideas in the shortest time with the least ink in the smallest space.** Good visualization makes complex data accessible; bad visualization obscures, misleads, or confuses.

### Tufte's Principles

**1. Data-Ink Ratio**: Maximize the proportion of ink devoted to data. Remove chartjunk -- decorative elements that do not convey information (3D effects, unnecessary gridlines, redundant legends).

**2. Show the Data**: Let the data speak. Avoid distorting, hiding, or cherry-picking data to support a predetermined narrative.

**3. Encourage Comparison**: Good visualizations make it easy to compare values across groups, time periods, or categories.

**4. Reveal Multiple Levels**: The best visualizations work at multiple levels -- a quick glance reveals the main message, and deeper examination reveals nuances.

**5. Integrate with Text**: Data visualization should complement text, not replace it. Label directly on the chart rather than forcing readers to decode legends.

### Common Visualization Sins

| Sin | Why It is Bad |
|-----|---------------|
| Truncated Y-axis | Exaggerates small differences |
| 3D charts | Distort proportions and impair reading |
| Pie charts with many slices | Humans are bad at comparing angles |
| Dual Y-axes | Confusing and easy to manipulate |
| Rainbow color palettes | Not accessible, distracting |
| Chartjunk (clipart, shadows, gradients) | Noise that obscures signal |

### The Visual Hierarchy

Humans perceive visual encodings with different accuracy:

1. **Position** (most accurate): Bar charts, scatter plots
2. **Length**: Bar charts
3. **Angle/Slope**: Line charts
4. **Area**: Bubble charts (less accurate)
5. **Color saturation**: Heat maps (least accurate for precise values)

**Implication**: When precision matters, use position (bar charts) over area (bubble charts) or color (heat maps).

### Key Takeaway

Data visualization is not about making charts pretty -- it is about making data understandable. Follow Tufte's principles: maximize data-ink ratio, show the data honestly, facilitate comparison, and integrate text and graphics.

**Sources**: Tufte, E. R. (2001). *The Visual Display of Quantitative Information*. Graphics Press. Few, S. (2012). *Show Me the Numbers*. Analytics Press. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-chart-selection",
      slug: "choosing-the-right-chart",
      title: "Choosing the Right Chart",
      content: `## Choosing the Right Chart

The right chart type depends on what you want to communicate: comparison, composition, distribution, or relationship. Choosing the wrong chart can make clear data confusing or, worse, misleading.

### Chart Selection Guide

**Comparison (comparing values across categories)**:
- **Bar chart**: Best for comparing values across categories. Horizontal for many categories.
- **Grouped bar chart**: Compare multiple series across categories.
- **Line chart**: Compare trends over time for multiple series.

**Composition (parts of a whole)**:
- **Stacked bar chart**: Parts of a whole across categories or time.
- **Pie chart**: Parts of a whole (use only with 2-5 slices; bar chart is usually better).
- **Treemap**: Hierarchical parts of a whole.

**Distribution (how data is spread)**:
- **Histogram**: Distribution of a single variable.
- **Box plot**: Compare distributions across groups.
- **Scatter plot**: Distribution of two continuous variables.

**Relationship (correlation between variables)**:
- **Scatter plot**: Relationship between two continuous variables.
- **Bubble chart**: Three variables (x, y, and size).
- **Heat map**: Relationship across many variables.

**Time (trends over time)**:
- **Line chart**: Trends over time (the default for time series).
- **Area chart**: Trends over time with emphasis on volume.
- **Sparklines**: Compact trend visualization embedded in tables.

### Quick Decision Tree

| What are you showing? | Recommended Chart |
|----------------------|-------------------|
| One number | Big number / KPI card |
| Comparison across categories | Bar chart |
| Trend over time | Line chart |
| Parts of a whole | Stacked bar or pie (2-5 segments only) |
| Relationship between two variables | Scatter plot |
| Distribution of one variable | Histogram |
| Geographic data | Map |

### Key Takeaway

There is almost always one chart type that communicates your message most effectively. When in doubt, use a bar chart (for comparison) or line chart (for trends). Avoid pie charts for more than 5 segments and never use 3D charts.

**Sources**: Knaflic, C. N. (2015). *Storytelling with Data*. Wiley. Few, S. (2012). *Show Me the Numbers*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-dashboards",
      slug: "dashboard-design",
      title: "Dashboard Design",
      content: `## Dashboard Design

A dashboard is a visual display of the most important information needed to achieve one or more objectives, consolidated and arranged on a single screen. Stephen Few's research on dashboard design, referenced in HBS analytics courses, provides principles for creating dashboards that inform rather than overwhelm.

### Dashboard Design Principles

**1. Purpose First**: Every dashboard should answer a specific question or support a specific decision. "Executive KPI dashboard" is too vague. "Track progress toward Q4 revenue target" is actionable.

**2. Five-Second Rule**: A user should understand the main message within 5 seconds of looking at the dashboard. If they need to study it, the design needs work.

**3. Minimize Cognitive Load**: Limit to 5-9 visualizations per dashboard. Use consistent formatting, colors, and labels. Group related metrics together.

**4. Hierarchy of Information**: The most important metric goes top-left (where eyes go first). Supporting details go below and to the right.

**5. Context, Not Just Numbers**: A number without context is meaningless. Show targets, benchmarks, trends, and comparisons to give numbers meaning.

### Dashboard Layout

\`\`\`
+---------------------------+
|  KEY METRIC 1  | KEY 2    |
|  (big number)  | (big #)  |
+---------+-------+---------+
| Trend   | Breakdown        |
| Chart   | by Segment       |
|         |                  |
+---------+------------------+
| Supporting Detail 1 | D2   |
+---------------------+------+
\`\`\`

### Color Usage

- Use color sparingly and with purpose
- Green = good/on track, Red = bad/off track, Gray = neutral
- Use a single accent color to highlight the most important element
- Ensure color-blind accessibility (avoid red/green only; add patterns or labels)

### Dashboard Types

| Type | Purpose | Audience | Update Frequency |
|------|---------|----------|------------------|
| Strategic | Track progress toward goals | Executives | Weekly/Monthly |
| Operational | Monitor day-to-day operations | Managers | Real-time/Daily |
| Analytical | Explore data, find insights | Analysts | On-demand |

### Key Takeaway

A great dashboard is not a collection of charts -- it is a carefully designed communication tool that helps the right people make the right decisions at the right time. Design for the user, not for yourself.

**Sources**: Few, S. (2006). *Information Dashboard Design*. Analytics Press. Knaflic, C. N. (2015). *Storytelling with Data*. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-storytelling-data",
      slug: "storytelling-with-data",
      title: "Storytelling with Data (Knaflic)",
      content: `## Storytelling with Data

Cole Nussbaumer Knaflic's *Storytelling with Data* (2015), widely assigned in HBS analytics courses, argues that **the ability to communicate data effectively is as important as the ability to analyze it**. The best analysis is worthless if the audience does not understand, believe, or act on it.

### The Storytelling with Data Framework

**1. Understand the Context**
- Who is your audience? What do they care about?
- What do you want them to DO after seeing your presentation?
- What data will convince them?

**2. Choose an Appropriate Visual**
Select the chart type that best communicates your message (covered in previous lesson).

**3. Eliminate Clutter**
Remove everything that does not contribute to the message: unnecessary gridlines, borders, colors, labels, and decorative elements. Every pixel should earn its place.

**4. Focus Attention**
Use visual cues (color, size, position) to direct the audience's attention to the most important part of the visualization. Pre-attentive attributes (color, size, position) are processed by the brain before conscious thought.

**5. Tell a Story**
Structure your presentation as a narrative: setup (context and problem), conflict (what the data reveals), and resolution (recommended action).

### The "So What?" Test

For every chart, ask: "So what?" If the answer is not obvious, the visualization is not doing its job.

**Before**: A chart showing monthly revenue by product line.
**After**: The same chart with a title: "Product C is driving 70% of our revenue growth, but Product A is declining -- we need to investigate."

The title transforms a display of data into a piece of communication.

### The Three-Minute Presentation

Knaflic recommends structuring data presentations in three parts:

1. **What**: "Here is what we found" (the key insight, stated clearly)
2. **So what**: "Here is why it matters" (business implications)
3. **Now what**: "Here is what we should do" (recommended action)

### Before and After

**Before (cluttered, confusing)**:
- Title: "Q3 Results"
- 12 data series with different colors
- Gridlines, legends, small text
- No message

**After (clear, actionable)**:
- Title: "Q3 revenue grew 15%, driven by new customer acquisition"
- 2 data series highlighted, others grayed out
- Clean, minimal design
- Clear message with supporting action

### Key Takeaway

Data storytelling is the bridge between analysis and action. The best analysts are not just technically skilled -- they can communicate findings in a way that resonates with their audience and drives decisions. Master the craft of turning data into stories.

**Sources**: Knaflic, C. N. (2015). *Storytelling with Data*. Wiley. Duarte, N. (2010). *Resonate*. Wiley. HBS Online, "Business Analytics" course.`,
    },
    {
      id: "ba-exec-presentations",
      slug: "executive-presentations-with-data",
      title: "Executive Presentations with Data",
      content: `## Executive Presentations with Data

Presenting data to executives requires a fundamentally different approach than presenting to analysts. HBS teaches that **executives do not want data -- they want decisions**. Your job is not to show them everything you analyzed but to tell them what they need to know and what you recommend.

### The Executive Mindset

Executives:
- Have limited time (5-15 minutes, not 60)
- Want the answer first, supporting evidence second
- Care about business impact, not methodology
- Will challenge assumptions and ask probing questions
- Need to make a decision, not admire your analysis

### The Pyramid Structure for Data Presentations

Use Barbara Minto's Pyramid Principle:

\`\`\`
        RECOMMENDATION
       (Answer first)
          /    \\\\
    REASON 1   REASON 2   REASON 3
   (Key insights supporting the recommendation)
      |           |           |
    DATA        DATA        DATA
   (Evidence for each insight)
\`\`\`

**Example**:
- "I recommend we increase digital marketing spend by 30% this quarter."
- "Reason 1: Digital CAC is 40% lower than offline CAC."
- "Reason 2: Digital customers have 2x higher LTV."
- "Reason 3: We have capacity to scale digital without proportional cost increase."

### Slide Design for Executives

**One message per slide**: Each slide should communicate exactly one point. The title should state the message (not describe the chart).

**Bad title**: "Q3 Revenue by Channel"
**Good title**: "Digital revenue grew 35% while retail declined 5%"

**Keep it simple**: No more than one chart per slide. No complex tables. No walls of text.

**Use the appendix**: Put detailed data, methodology, and supporting analysis in appendix slides. Reference them if asked.

### Handling the Q&A

Executives will challenge your analysis. Prepare for:
- "What are the assumptions behind this?" (Know your assumptions cold)
- "What if we're wrong?" (Sensitivity analysis: how much do results change?)
- "How does this compare to competitors?" (Benchmarking data)
- "What's the downside risk?" (Worst-case scenario)
- "What do you recommend?" (Always have a recommendation)

### Common Mistakes

1. **Burying the lead**: Building up to the conclusion instead of starting with it
2. **Too much detail**: Showing every step of the analysis instead of the key findings
3. **No recommendation**: Presenting data without telling the audience what to do
4. **Complex charts**: Using chart types the audience cannot quickly interpret
5. **Reading slides**: Presenting what the audience can read themselves

### Key Takeaway

Presenting data to executives is a communication challenge, not an analytical one. Lead with the recommendation, support it with 2-3 key insights, keep it visual and simple, and be prepared for tough questions. The goal is not to impress with your analysis but to enable a better decision.

**Sources**: Minto, B. (2009). *The Pyramid Principle*. Pearson. Knaflic, C. N. (2015). *Storytelling with Data*. HBS Online, "Business Analytics" course. Duarte, N. (2010). *Resonate*. Wiley.`,
    },
  ],
};
