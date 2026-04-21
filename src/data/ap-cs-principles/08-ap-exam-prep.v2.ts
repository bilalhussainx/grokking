import { Module } from "../types";

export const apExamPrepModule: Module = {
  id: "ap-csp-exam-prep",
  title: "AP Exam Prep",
  description: "Review key concepts, practice AP-style questions, and learn strategies for the AP Computer Science Principles exam.",
  lessons: [
    {
      id: "ap-csp-exam-overview",
      slug: "exam-overview",
      title: "AP CSP Exam Overview",
      content: `## AP CSP Exam Overview

<!-- voice:key_insight -->

The AP Computer Science Principles exam has two parts:

### Part 1: Create Performance Task (30% of score)

You build a program and write about it. Submitted before the exam date.

**Requirements:**
- A program that includes: input, output, a list, a function with a parameter, and an algorithm with sequencing, selection, and iteration
- A video demonstrating your program running
- Written responses explaining your code

**Tips:**
- Start early -- do not wait until the last week
- Choose a project you are genuinely interested in
- Make sure your function does something meaningful (not just \`print\`)
- Test your program thoroughly before recording

### Part 2: Multiple Choice Exam (70% of score)

- 70 questions in 2 hours
- Single-select and multiple-select questions
- Covers all 5 Big Ideas

### The 5 Big Ideas

| Big Idea | Topic | Weight |
|----------|-------|--------|
| 1 | Creative Development | 10-13% |
| 2 | Data | 17-22% |
| 3 | Algorithms and Programming | 30-35% |
| 4 | Computing Systems and Networks | 11-15% |
| 5 | Impact of Computing | 21-26% |

**Big Idea 3 (Algorithms and Programming) is the largest section** -- make sure you are comfortable with code tracing, loops, conditionals, and functions.

### Analogy: The Exam Is Like a Driver's Test

The Create Task is like the driving portion (show you can DO it). The multiple choice is like the written test (show you UNDERSTAND the rules).

### Deeper Reading
- College Board AP CSP Course Description (official)
- AP Classroom practice exams

### Reflection Questions
1. Which Big Idea do you feel most confident about?
2. Which Big Idea needs the most review?
3. What project idea are you considering for the Create Task?`,
    },
    {
      id: "ap-csp-concept-review",
      slug: "concept-review",
      title: "Key Concepts Review",
      content: `## Key Concepts Review

Let's review the most important concepts that appear on the AP CSP exam.

### Binary and Data Representation
- **Binary**: base-2 number system (0s and 1s)
- **Bit**: single binary digit; **Byte**: 8 bits
- **ASCII/Unicode**: maps characters to numbers
- **RGB**: represents color as (Red, Green, Blue) values 0-255
- **Lossless vs. Lossy compression**: lossless preserves all data; lossy discards some for smaller files

### The Internet
- **IP address**: unique identifier for each device
- **DNS**: translates domain names to IP addresses
- **TCP**: reliable, ordered delivery; **UDP**: fast, no guarantees
- **HTTP/HTTPS**: protocol for web communication (HTTPS adds encryption)
- **Packets**: data broken into small pieces for transmission

<!-- voice:key_insight -->

### Algorithms and Programming
- **Algorithm**: step-by-step procedure to solve a problem
- **Linear search**: check each item (O(N)); **Binary search**: halve the list (O(log N))
- **Sequencing**: steps in order; **Selection**: if/else; **Iteration**: loops
- **Abstraction**: hiding complexity (functions are a form of abstraction)
- **Lists**: ordered collections; can iterate, filter, search

### Computing Impact
- **Digital divide**: unequal access to technology
- **Crowdsourcing**: using many people to solve problems (Wikipedia, open source)
- **Bias in algorithms**: algorithms can reflect and amplify human biases
- **Creative Commons**: licensing that allows sharing with conditions
- **Privacy**: cookies, data collection, surveillance concerns

### Security
- **Symmetric encryption**: one shared key
- **Asymmetric encryption**: public key + private key
- **Phishing**: social engineering via fake emails/sites
- **Malware**: viruses, ransomware, trojans
- **Multi-factor authentication**: multiple verification methods

### Deeper Reading
- AP CSP reference sheet (provided during the exam)
- Barron's AP Computer Science Principles review book

### Reflection Questions
1. Can you explain each concept above in your own words?
2. Which concepts connect to each other?
3. What real-world examples can you give for each Big Idea?`,
    },
    {
      id: "ap-csp-practice-questions",
      slug: "practice-questions",
      title: "AP-Style Practice Questions",
      content: `## AP-Style Practice Questions

Practice with questions that match the format and difficulty of the real AP CSP exam.

<!-- voice:section_check -->

### Question 1 (Binary)
The binary number \`10110100\` represents what decimal value?

<details>
<summary>Show Answer</summary>

128 + 0 + 32 + 16 + 0 + 4 + 0 + 0 = **180**
</details>

### Question 2 (Internet)
A student types a URL into their browser. Which of the following best describes the FIRST step?

(A) The browser sends an HTTP request to the server
(B) The browser queries a DNS server to get the IP address
(C) The server sends back the HTML page
(D) TCP establishes a connection with the server

<details>
<summary>Show Answer</summary>

**(B)**. Before the browser can contact the server, it needs to know the server's IP address. DNS lookup comes first.
</details>

### Question 3 (Algorithms)
A sorted list has 2,048 elements. Using binary search, what is the maximum number of comparisons needed?

<details>
<summary>Show Answer</summary>

**11**. log2(2048) = 11. Each step halves the search space: 2048 -> 1024 -> 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1.
</details>

### Question 4 (Programming - Code Tracing)
What is the value of \`result\` after this code runs?
\`\`\`
result = 0
numbers = [3, 1, 4, 1, 5, 9]
for num in numbers:
    if num > 3:
        result = result + num
\`\`\`

<details>
<summary>Show Answer</summary>

**18**. Only numbers greater than 3 are added: 4 + 5 + 9 = 18.
</details>

### Question 5 (Impact)
A company uses an algorithm to screen job applications. The algorithm was trained on data from the past 10 years. Which of the following is a potential concern?

(A) The algorithm will be too slow to process applications
(B) The algorithm may reflect historical biases in hiring practices
(C) The algorithm cannot handle text-based resumes
(D) The algorithm will eliminate the need for human resources

<details>
<summary>Show Answer</summary>

**(B)**. If past hiring was biased (e.g., favoring certain demographics), the algorithm will learn and replicate those biases. This is a key AP CSP topic about algorithmic bias.
</details>

### You Are Ready!
You have covered all the major topics in AP Computer Science Principles. Review your weak areas, practice code tracing, and you will do great on exam day!`,
    },
    {
      id: "ap-csp-exam-prep-checkpoint",
      slug: "exam-prep-checkpoint",
      title: "Checkpoint: AP Exam Prep",
      content: `## Checkpoint: Final Review

<!-- voice:section_check -->

### Question 1
List the 5 Big Ideas in AP CSP.

<details>
<summary>Show Answer</summary>

1. Creative Development
2. Data
3. Algorithms and Programming
4. Computing Systems and Networks
5. Impact of Computing
</details>

### Question 2
What are the two components of the AP CSP exam, and what percentage of the score does each represent?

<details>
<summary>Show Answer</summary>

**Create Performance Task**: 30% (a program + video + written responses, submitted before exam day). **Multiple Choice Exam**: 70% (70 questions in 2 hours).
</details>

### Question 3
Write pseudocode for binary search.

<details>
<summary>Show Answer</summary>

\`\`\`
SET low = 0, high = length - 1
WHILE low <= high:
    SET mid = (low + high) / 2
    IF list[mid] == target:
        RETURN mid
    ELSE IF list[mid] < target:
        SET low = mid + 1
    ELSE:
        SET high = mid - 1
RETURN "not found"
\`\`\`
</details>

### Question 4
Explain one way computing has a positive impact on society and one way it has a negative impact.

<details>
<summary>Show Answer</summary>

**Positive**: Telemedicine allows patients in rural areas to consult with specialists remotely, improving healthcare access.
**Negative**: Social media algorithms can create filter bubbles, where people only see content that reinforces their existing beliefs.
</details>

### Question 5
For your Create Performance Task, what three programming constructs must your program include?

<details>
<summary>Show Answer</summary>

1. **Sequencing, selection (if/else), and iteration (loops)**
2. A **list** (or equivalent collection)
3. A **student-developed function** with at least one parameter
</details>

### Congratulations!
You have completed the entire AP Computer Science Principles course. You have built a strong foundation in how computers work, how to program, and how technology affects the world. Good luck on the exam -- you are well prepared!`,
    },
  ],
};
