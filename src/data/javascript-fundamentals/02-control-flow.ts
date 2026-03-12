import { Module } from "../types";

export const controlFlowModule: Module = {
  id: "js-control-flow",
  title: "Control Flow",
  description:
    "Master if/else, switch statements, the ternary operator, and understand truthy/falsy values in JavaScript.",
  lessons: [
    {
      id: "js-control-flow-intro",
      slug: "js-control-flow-intro",
      title: "Introduction to Control Flow",
      content: `## Control Flow in JavaScript

Control flow determines the **order** in which your code executes. JavaScript provides several constructs for branching logic.

### if / else if / else

\`\`\`js
if (condition) {
  // runs if condition is truthy
} else if (otherCondition) {
  // runs if otherCondition is truthy
} else {
  // runs if nothing above matched
}
\`\`\`

### Truthy & Falsy Values

JavaScript coerces values to booleans in conditional contexts. These are **falsy**:

\`false\`, \`0\`, \`-0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`

**Everything else is truthy**, including \`[]\`, \`{}\`, and \`"0"\`.

### Switch Statement

Use \`switch\` when comparing a single value against many possible matches:

\`\`\`js
switch (day) {
  case "Mon": console.log("Monday"); break;
  case "Tue": console.log("Tuesday"); break;
  default: console.log("Other day");
}
\`\`\`

**Forgetting \`break\`** causes fall-through to the next case.

### Ternary Operator

A concise one-line conditional: \`condition ? valueIfTrue : valueIfFalse\`

\`\`\`js
const status = age >= 18 ? "adult" : "minor";
\`\`\`

### Nullish Coalescing (??) vs OR (||)

- \`||\` returns the right side for any **falsy** value
- \`??\` returns the right side only for \`null\` or \`undefined\`

\`\`\`js
0 || 10   // 10 (0 is falsy)
0 ?? 10   // 0  (0 is not null/undefined)
\`\`\``,
    },
    {
      id: "js-control-flow-day-of-week",
      slug: "day-of-week",
      title: "Day of Week",
      content: `## Day of Week

### Problem

Write a function \`getDayName\` that takes a number (0-6) and returns the corresponding day name using a **switch statement**. Sunday is 0, Saturday is 6.

Then write \`getDayType\` that returns \`"weekend"\` for Saturday/Sunday and \`"weekday"\` for all others, using **switch fall-through**.

### Examples

\`\`\`js
getDayName(0)  // "Sunday"
getDayName(3)  // "Wednesday"
getDayType(0)  // "weekend"
getDayType(2)  // "weekday"
\`\`\`

### Key Concepts

- Switch cases use strict equality (\`===\`)
- Fall-through: omitting \`break\` lets execution continue to the next case
- Always include a \`default\` case for invalid input`,
      starterCode: `// Day of Week
// Practice switch statements

function getDayName(dayNum) {
  // Use a switch statement to return the day name
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Return "Invalid day" for out-of-range numbers
  // YOUR CODE HERE
}

function getDayType(dayNum) {
  // Use switch with fall-through to return "weekend" or "weekday"
  // 0 (Sunday) and 6 (Saturday) are weekend
  // Return "Invalid day" for out-of-range numbers
  // YOUR CODE HERE
}

// Test cases
console.log(getDayName(0));  // Expected: "Sunday"
console.log(getDayName(3));  // Expected: "Wednesday"
console.log(getDayName(6));  // Expected: "Saturday"
console.log(getDayName(7));  // Expected: "Invalid day"
console.log(getDayType(0));  // Expected: "weekend"
console.log(getDayType(6));  // Expected: "weekend"
console.log(getDayType(2));  // Expected: "weekday"
console.log(getDayType(4));  // Expected: "weekday"`,
      solutionCode: `// Day of Week
// Practice switch statements

function getDayName(dayNum) {
  switch (dayNum) {
    case 0: return "Sunday";
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    default: return "Invalid day";
  }
}

function getDayType(dayNum) {
  switch (dayNum) {
    case 0:
    case 6:
      return "weekend";
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return "weekday";
    default:
      return "Invalid day";
  }
}

// Test cases
console.log(getDayName(0));  // Expected: "Sunday"
console.log(getDayName(3));  // Expected: "Wednesday"
console.log(getDayName(6));  // Expected: "Saturday"
console.log(getDayName(7));  // Expected: "Invalid day"
console.log(getDayType(0));  // Expected: "weekend"
console.log(getDayType(6));  // Expected: "weekend"
console.log(getDayType(2));  // Expected: "weekday"
console.log(getDayType(4));  // Expected: "weekday"`,
    },
    {
      id: "js-control-flow-ticket-price",
      slug: "ticket-price-calculator",
      title: "Ticket Price Calculator",
      content: `## Ticket Price Calculator

### Problem

Write a function \`calculateTicketPrice\` that determines the price of a movie ticket based on:

- **Age**: Child (0-12): $8, Teen (13-17): $10, Adult (18-64): $12, Senior (65+): $9
- **Time**: Matinee showings (before 17:00 / 5 PM) get a $2 discount
- **Day**: Tuesday is discount day — an additional $1 off

The function takes \`age\`, \`hour\` (0-23), and \`day\` (string).

### Examples

\`\`\`js
calculateTicketPrice(25, 20, "Friday")   // 12 (adult, evening, normal day)
calculateTicketPrice(25, 14, "Tuesday")  // 9  (12 - 2 matinee - 1 Tuesday)
calculateTicketPrice(10, 10, "Monday")   // 6  (8 child - 2 matinee)
\`\`\`

### Key Concepts

- Chained if/else for range-based conditions
- Combining multiple conditions with logical operators
- Building up or discounting a price incrementally`,
      starterCode: `// Ticket Price Calculator
// Use if/else chains for age-based pricing with discounts

function calculateTicketPrice(age, hour, day) {
  // 1. Determine base price by age group
  //    Child (0-12): $8, Teen (13-17): $10,
  //    Adult (18-64): $12, Senior (65+): $9
  // 2. Apply $2 matinee discount if hour < 17
  // 3. Apply $1 Tuesday discount if day is "Tuesday"
  // 4. Price cannot go below $0
  // YOUR CODE HERE
}

// Test cases
console.log(calculateTicketPrice(25, 20, "Friday"));   // Expected: 12
console.log(calculateTicketPrice(25, 14, "Tuesday"));  // Expected: 9
console.log(calculateTicketPrice(10, 10, "Monday"));   // Expected: 6
console.log(calculateTicketPrice(10, 10, "Tuesday"));  // Expected: 5
console.log(calculateTicketPrice(15, 19, "Saturday")); // Expected: 10
console.log(calculateTicketPrice(70, 14, "Tuesday"));  // Expected: 6
console.log(calculateTicketPrice(70, 20, "Wednesday"));// Expected: 9`,
      solutionCode: `// Ticket Price Calculator
// Use if/else chains for age-based pricing with discounts

function calculateTicketPrice(age, hour, day) {
  let price;

  if (age <= 12) {
    price = 8;
  } else if (age <= 17) {
    price = 10;
  } else if (age <= 64) {
    price = 12;
  } else {
    price = 9;
  }

  if (hour < 17) {
    price -= 2;
  }

  if (day === "Tuesday") {
    price -= 1;
  }

  return Math.max(0, price);
}

// Test cases
console.log(calculateTicketPrice(25, 20, "Friday"));   // Expected: 12
console.log(calculateTicketPrice(25, 14, "Tuesday"));  // Expected: 9
console.log(calculateTicketPrice(10, 10, "Monday"));   // Expected: 6
console.log(calculateTicketPrice(10, 10, "Tuesday"));  // Expected: 5
console.log(calculateTicketPrice(15, 19, "Saturday")); // Expected: 10
console.log(calculateTicketPrice(70, 14, "Tuesday"));  // Expected: 6
console.log(calculateTicketPrice(70, 20, "Wednesday"));// Expected: 9`,
    },
    {
      id: "js-control-flow-rps",
      slug: "rock-paper-scissors",
      title: "Rock Paper Scissors",
      content: `## Rock Paper Scissors

### Problem

Write a function \`playRPS\` that takes two player choices (\`"rock"\`, \`"paper"\`, or \`"scissors"\`) and returns the result from **Player 1's perspective**: \`"win"\`, \`"lose"\`, or \`"draw"\`.

Then write \`playBestOf\` that simulates a best-of-N series given two arrays of moves and returns the overall winner.

### Examples

\`\`\`js
playRPS("rock", "scissors")    // "win"
playRPS("paper", "rock")       // "win"
playRPS("rock", "paper")       // "lose"
playRPS("rock", "rock")        // "draw"
\`\`\`

### Key Concepts

- Using logical conditions or lookup objects for game logic
- An object/map approach is often cleaner than nested if/else
- Counting wins across multiple rounds`,
      starterCode: `// Rock Paper Scissors
// Implement game logic with conditionals

function playRPS(p1, p2) {
  // Return "win", "lose", or "draw" from Player 1's perspective
  // rock beats scissors, scissors beats paper, paper beats rock
  // YOUR CODE HERE
}

function playBestOf(moves1, moves2) {
  // Given arrays of moves for each player, play each round
  // Return "Player 1", "Player 2", or "Tie"
  // based on who wins more rounds
  // YOUR CODE HERE
}

// Test cases
console.log(playRPS("rock", "scissors"));    // Expected: "win"
console.log(playRPS("paper", "rock"));       // Expected: "win"
console.log(playRPS("scissors", "paper"));   // Expected: "win"
console.log(playRPS("rock", "paper"));       // Expected: "lose"
console.log(playRPS("rock", "rock"));        // Expected: "draw"

console.log(playBestOf(
  ["rock", "rock", "paper"],
  ["scissors", "paper", "scissors"]
)); // Expected: "Player 1" (wins 3-0)

console.log(playBestOf(
  ["rock", "scissors", "rock"],
  ["paper", "rock", "paper"]
)); // Expected: "Player 2" (wins 0-3)

console.log(playBestOf(
  ["rock", "paper"],
  ["scissors", "scissors"]
)); // Expected: "Player 1" (1 win, 1 loss -> but 1 win vs 1 win... let's see)
// Actually: round1: rock vs scissors = P1 win, round2: paper vs scissors = P2 win -> Tie`,
      solutionCode: `// Rock Paper Scissors
// Implement game logic with conditionals

function playRPS(p1, p2) {
  if (p1 === p2) return "draw";

  const wins = {
    rock: "scissors",
    scissors: "paper",
    paper: "rock",
  };

  return wins[p1] === p2 ? "win" : "lose";
}

function playBestOf(moves1, moves2) {
  let p1Wins = 0;
  let p2Wins = 0;

  for (let i = 0; i < moves1.length; i++) {
    const result = playRPS(moves1[i], moves2[i]);
    if (result === "win") p1Wins++;
    else if (result === "lose") p2Wins++;
  }

  if (p1Wins > p2Wins) return "Player 1";
  if (p2Wins > p1Wins) return "Player 2";
  return "Tie";
}

// Test cases
console.log(playRPS("rock", "scissors"));    // Expected: "win"
console.log(playRPS("paper", "rock"));       // Expected: "win"
console.log(playRPS("scissors", "paper"));   // Expected: "win"
console.log(playRPS("rock", "paper"));       // Expected: "lose"
console.log(playRPS("rock", "rock"));        // Expected: "draw"

console.log(playBestOf(
  ["rock", "rock", "paper"],
  ["scissors", "paper", "scissors"]
)); // Expected: "Player 1" (wins 3-0)

console.log(playBestOf(
  ["rock", "scissors", "rock"],
  ["paper", "rock", "paper"]
)); // Expected: "Player 2" (wins 0-3)

console.log(playBestOf(
  ["rock", "paper"],
  ["scissors", "scissors"]
)); // Expected: "Tie" (1-1)`,
    },
  ],
};
