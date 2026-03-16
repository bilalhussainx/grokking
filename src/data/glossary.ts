/**
 * Technical glossary — terms auto-highlighted in lessons with hoverable tooltips.
 * Keep definitions concise (under 25 words), plain English for non-native speakers.
 *
 * Entries can be:
 *   - A plain string (backward compatible, single definition for all domains)
 *   - A GlossaryEntry object with a `default` definition and optional `domains` overrides
 */

export interface GlossaryEntry {
  default: string;
  domains?: Record<string, string>;
}

export const glossary: Record<string, string | GlossaryEntry> = {
  // ─── Algorithms & Data Structures ───
  "amortized complexity": "Average cost per operation over a sequence, even if some operations are expensive",
  "dynamic programming": "Solving problems by breaking them into overlapping subproblems and caching results",
  "topological sort": "Ordering graph nodes so every edge points forward — used for dependency resolution",
  "big O notation": "Describes how an algorithm's time or space grows as input size increases",
  "hash map": "A data structure that maps keys to values using a hash function for fast lookups",
  "binary search": "Finding an item in a sorted list by repeatedly halving the search range",
  "breadth-first search": "Exploring a graph level by level, visiting all neighbors before going deeper",
  "depth-first search": "Exploring a graph by going as deep as possible before backtracking",
  "heap": "A tree-based structure where the parent is always smaller (min-heap) or larger (max-heap) than children",
  "trie": "A tree for storing strings where each node represents one character",
  "linked list": "A sequence of nodes where each node points to the next one in the chain",
  "recursion": "A function that calls itself to solve smaller versions of the same problem",
  "memoization": "Caching the results of expensive function calls to avoid repeating work",
  "greedy algorithm": "Making the locally optimal choice at each step, hoping it leads to the global optimum",
  "divide and conquer": "Breaking a problem into smaller pieces, solving each, then combining results",
  "backtracking": "Trying all possibilities and undoing choices that don't lead to a solution",
  "sliding window": "A technique using two pointers to track a range that slides through an array",
  "two pointers": "Using two indices moving through an array to find pairs or ranges efficiently",
  "time complexity": "How the running time of an algorithm grows relative to input size",
  "space complexity": "How much extra memory an algorithm needs relative to input size",
  "merge sort": "A divide-and-conquer sort that splits, sorts halves, then merges — always O(n log n)",
  "quick sort": "A fast sort that picks a pivot and partitions elements — average O(n log n)",
  "adjacency list": "A graph representation where each node stores a list of its neighbors",
  "balanced BST": "A binary search tree that keeps itself roughly balanced for O(log n) operations",
  "collision resolution": "Handling the case when two different keys hash to the same slot",
  "NP-hard": "A class of problems for which no known efficient solution exists",

  // ─── System Design ───
  "load balancer": "Distributes incoming requests across multiple servers to prevent overload",
  "CDN": "Content Delivery Network — serves files from servers geographically close to users",
  "sharding": "Splitting a database across multiple machines, each holding a portion of the data",
  "replication": "Copying data across multiple servers for reliability and faster reads",
  "CAP theorem": "A distributed system can guarantee only two of: Consistency, Availability, Partition tolerance",
  "eventual consistency": "All copies of data will match eventually, but not necessarily immediately",
  "microservices": "Architecture where an app is built as many small, independent services",
  "API gateway": "A single entry point that routes requests to the correct backend service",
  "message queue": "A buffer between services that stores messages until the receiver is ready",
  "rate limiting": "Restricting how many requests a user or service can make in a time period",
  "horizontal scaling": "Adding more machines to handle increased load",
  "vertical scaling": "Upgrading a single machine with more CPU, RAM, or storage",
  "database indexing": "Creating a lookup structure to speed up queries on specific columns",
  "reverse proxy": "A server that sits in front of backend servers and forwards client requests",

  // ─── Programming Concepts ───
  "closure": "A function that remembers variables from the scope where it was created",
  "callback": "A function passed as an argument to another function, called later when needed",
  "promise": "An object representing a value that will be available in the future",
  "async/await": "Syntax for writing asynchronous code that looks like synchronous code",
  "event loop": "The mechanism that handles asynchronous operations in single-threaded environments",
  "garbage collection": "Automatic memory management that frees unused objects",
  "polymorphism": "Using a single interface to represent different underlying types",
  "encapsulation": "Bundling data and methods together while hiding internal details",
  "dependency injection": "Passing dependencies to a component instead of creating them internally",
  "design pattern": "A reusable solution template for common software design problems",
  "singleton": "A pattern ensuring only one instance of a class exists in the application",
  "observer pattern": "Objects subscribe to events and get notified when something changes",

  // ─── Finance & Economics ───
  "compound interest": "Interest earned on both the original amount and previously earned interest",
  "amortization": "Spreading a loan payment equally over time, covering both principal and interest",
  "liquidity": "How quickly an asset can be converted to cash without losing value",
  "equity": "Ownership value — what you own minus what you owe",
  "dividend": "A portion of company profits paid to shareholders",
  "portfolio diversification": "Spreading investments across different assets to reduce risk",
  "market capitalization": "Total value of a company's shares — stock price times shares outstanding",
  "P/E ratio": "Price-to-earnings ratio — how much investors pay per dollar of company earnings",
  "yield curve": "A graph showing interest rates across different loan durations",
  "bull market": "A market where prices are rising or expected to rise",
  "bear market": "A market where prices are falling or expected to fall",
  "arbitrage": "Profiting from price differences for the same asset in different markets",
  "derivatives": "Financial contracts whose value is based on an underlying asset like a stock",

  // ─── General Academic ───
  "heuristic": "A practical approach that finds good-enough solutions when perfect ones are too costly",
  "paradigm": "A fundamental model or framework for thinking about something",
  "deterministic": "Always producing the same output for the same input — no randomness",
  "stochastic": "Involving randomness or probability — outcomes may vary each time",

  // ─── Multi-domain entries ───

  "model": {
    default: "A simplified representation of a system or process",
    domains: {
      "computer-science": "A trained algorithm that makes predictions from data (e.g., neural network model)",
      "finance-business": "A mathematical framework for valuing assets or forecasting (e.g., DCF model)",
      "philosophy": "A theoretical framework for understanding reality (e.g., Platonic model of forms)",
    },
  },

  "function": {
    default: "A reusable block of code that takes input, performs a task, and returns output",
    domains: {
      "computer-science": "A reusable block of code that takes input, performs a task, and returns output",
      "finance-business": "The role or purpose something serves within an organization or system",
      "economics": "A mathematical relationship between variables (e.g., production function, utility function)",
    },
  },

  "class": {
    default: "A blueprint for creating objects that bundles data and behavior together",
    domains: {
      "computer-science": "A blueprint for creating objects that bundles data and behavior together",
      "finance-business": "A category of asset, share, or security (e.g., asset class, share class)",
      "economics": "A socioeconomic grouping of people by wealth, income, or occupation",
    },
  },

  "inheritance": {
    default: "A class taking on properties and methods from a parent class",
    domains: {
      "computer-science": "A class taking on properties and methods from a parent class",
      "finance-business": "Assets or wealth passed from a deceased person to their heirs",
    },
  },

  "abstract": {
    default: "Hiding complexity behind a simpler interface",
    domains: {
      "computer-science": "A class or method that defines a contract but has no implementation itself",
      "philosophy": "Existing as an idea or concept rather than as a concrete physical thing",
    },
  },

  "state": {
    default: "The current condition or stored data of a system at a point in time",
    domains: {
      "computer-science": "The current data held by a component, object, or application at a given moment",
      "finance-business": "The financial condition of an entity (e.g., statement of financial state)",
      "political-strategy": "A sovereign political entity with defined territory and government",
    },
  },

  "tree": {
    default: "A hierarchical data structure with a root node and child branches",
    domains: {
      "computer-science": "A hierarchical data structure with a root node and child branches, no cycles",
      "finance-business": "A decision diagram that maps choices and outcomes (e.g., binomial pricing tree)",
    },
  },

  "graph": {
    default: "A collection of nodes connected by edges, representing relationships",
    domains: {
      "computer-science": "A data structure of nodes (vertices) and edges representing connections",
      "finance-business": "A visual chart plotting data points over time (e.g., stock price graph)",
      "economics": "A diagram showing the relationship between economic variables (e.g., supply-demand graph)",
    },
  },

  "protocol": {
    default: "A set of rules governing how systems communicate or operate",
    domains: {
      "computer-science": "A defined set of rules for data exchange between systems (e.g., HTTP, TCP/IP)",
      "philosophy": "An established procedure or code of conduct for formal interactions",
    },
  },

  "architecture": {
    default: "The high-level structure and organization of a system",
    domains: {
      "computer-science": "The design of a software or hardware system's components and their interactions",
      "finance-business": "The structural design of financial products or organizational systems",
    },
  },

  "pattern": {
    default: "A recurring solution or recognizable structure in a system",
    domains: {
      "computer-science": "A reusable solution template for common software design problems",
      "finance-business": "A recognizable formation in price charts used for technical analysis",
    },
  },

  "risk": {
    default: "The possibility of an undesirable outcome occurring",
    domains: {
      "computer-science": "A potential threat to system security, data integrity, or availability",
      "finance-business": "The chance that an investment's actual return will differ from its expected return",
      "economics": "Uncertainty in economic outcomes that can be measured with probability",
    },
  },

  "hedge": {
    default: "An investment made to reduce risk from price movements in another asset",
    domains: {
      "computer-science": "A safeguard or fallback strategy to protect against system failures",
      "finance-business": "An offsetting position taken to reduce exposure to adverse price movements",
    },
  },

  "yield": {
    default: "The return or output produced by an investment or process",
    domains: {
      "computer-science": "A keyword that pauses a generator function and returns a value to the caller",
      "finance-business": "The income return on an investment, expressed as an annual percentage",
      "economics": "The output or return produced by a factor of production",
    },
  },

  "index": {
    default: "A reference or pointer that helps locate items quickly",
    domains: {
      "computer-science": "A position number in an array, or a database structure for fast lookups",
      "finance-business": "A statistical measure tracking market performance (e.g., S&P 500 index)",
    },
  },

  "cache": {
    default: "A fast storage layer that keeps frequently accessed data close at hand",
    domains: {
      "computer-science": "A fast storage layer (memory or disk) that avoids expensive recomputation or fetches",
      "finance-business": "A reserve of liquid assets held for quick access (e.g., cash cache)",
    },
  },

  "caching": {
    default: "Storing frequently accessed data in fast storage to avoid recomputing or re-fetching",
    domains: {
      "computer-science": "Storing computed results or fetched data in fast memory to speed up future access",
      "finance-business": "Setting aside reserves of assets for quick deployment when needed",
    },
  },

  "pipeline": {
    default: "A sequence of processing stages where output of one feeds into the next",
    domains: {
      "computer-science": "A chain of data processing steps, each transforming and passing data forward",
      "finance-business": "The flow of potential deals or revenue from prospect to close (e.g., sales pipeline)",
    },
  },

  "stack": {
    default: "Last-in, first-out container — like a stack of plates",
    domains: {
      "computer-science": "A LIFO data structure, or the set of technologies used in a project (tech stack)",
      "finance-business": "The layered capital structure of a company (e.g., capital stack, debt stack)",
    },
  },

  "queue": {
    default: "First-in, first-out container — like a line of people waiting",
    domains: {
      "computer-science": "A FIFO data structure, or a message buffer between services",
      "finance-business": "A waiting list for processing transactions or orders in sequence",
    },
  },

  "token": {
    default: "A discrete unit representing something else — a symbol or credential",
    domains: {
      "computer-science": "A unit of text in parsing/NLP, or a credential for API authentication",
      "finance-business": "A digital asset on a blockchain representing value or access rights",
    },
  },

  "node": {
    default: "A single element or point within a larger structure or network",
    domains: {
      "computer-science": "An element in a data structure (tree, graph, linked list) or a server in a network",
      "finance-business": "A decision point in a decision tree or network analysis diagram",
    },
  },

  "fork": {
    default: "A split that creates a separate copy or path from an original",
    domains: {
      "computer-science": "Creating a copy of a repository or process that evolves independently",
      "finance-business": "A divergence in policy or strategy creating two distinct paths forward",
    },
  },

  "branch": {
    default: "A separate line of development or division within a larger structure",
    domains: {
      "computer-science": "An independent line of development in version control (e.g., git branch)",
      "finance-business": "A local office or division of a larger organization (e.g., bank branch)",
    },
  },

  "merge": {
    default: "Combining two or more things into a single unified result",
    domains: {
      "computer-science": "Combining changes from different branches or sorting subarrays back together",
      "finance-business": "The combination of two companies into one entity (mergers & acquisitions)",
    },
  },

  "abstraction": {
    default: "Hiding complexity behind a simpler interface",
    domains: {
      "computer-science": "Hiding implementation details and exposing only essential features to the user",
      "philosophy": "The process of forming general concepts by extracting common qualities from instances",
    },
  },
};

/**
 * Resolve a glossary entry to a plain definition string.
 * If the entry has domain-specific definitions and a domain is provided, use the domain override.
 * Falls back to the default definition.
 */
export function resolveDefinition(
  entry: string | GlossaryEntry,
  domain?: string
): string {
  if (typeof entry === "string") return entry;
  if (domain && entry.domains?.[domain]) return entry.domains[domain];
  return entry.default;
}

/**
 * Get the list of other domains that have definitions for this entry.
 * Returns an empty array for plain string entries or entries without domain overrides.
 */
export function getOtherDomains(
  entry: string | GlossaryEntry,
  currentDomain?: string
): string[] {
  if (typeof entry === "string") return [];
  if (!entry.domains) return [];
  return Object.keys(entry.domains).filter((d) => d !== currentDomain);
}
