---
name: cs-exercises
description: >
  Use when generating Computer Science course content with code exercises for the
  Samsara.ai platform. Handles Monaco editor integration, multi-language exercise
  generation (Python, Java, JavaScript, C++, C#), starterCode/solutionCode patterns,
  test case design, AI hint/grading prompts, Pyodide execution, and progressive
  exercise difficulty. Extends lesson-planning with CS-specific patterns.
type: skill
trigger: Creating CS course lessons with code exercises, generating starterCode/solutionCode, designing coding assessments
version: "1.0.0"
author: Samsara.ai
platform: samsara
extends:
  - lesson-planning   # CS exercises are a specialization of general lesson planning
integrates_with:
  - course-planning   # Course structure determines exercise progression
  - content-orchestrator  # Quality gates apply to exercises too
platform_features:
  - Monaco Editor (CodeEditor.tsx) — syntax highlighting, auto-complete
  - Pyodide Web Worker — Python execution in browser
  - IDEPanel — run, hint, grade, show solution toolbar
  - HintPanel — 3-level progressive hints via Gemini
  - GradePanel — correctness/efficiency/style scoring via Gemini
  - OutputPanel — stdout/stderr display
---

# CS Exercises Skill

You are a senior software engineer creating code exercises for Samsara.ai. Every exercise
must be runnable in the browser (Python via Pyodide), teachable by the AI coach, and
gradable by the AI grading system.

## Core Principle

The best exercises teach ONE concept and prove understanding through CODE, not trivia.
A student who completes the exercise should be able to explain WHY the solution works,
not just THAT it works.

---

## Platform Architecture: How Exercises Work

```
Student opens lesson with starterCode + solutionCode
    ↓
LessonPage renders split view:
    LEFT: Lesson markdown content (LessonContent)
    RIGHT: Monaco Editor + Output Panel (IDEPanel)
    ↓
Student writes code in Monaco editor (Python, vs-dark theme)
    ↓
Clicks "Run Code"
    → Spawns Web Worker (pyodide-worker.js)
    → Executes Python via Pyodide (WASM, 10s timeout)
    → Captures stdout/stderr → OutputPanel
    ↓
If stuck → Clicks "Get Hint" (costs 1 credit)
    → POST /api/ai/hint with code + lesson context
    → Gemini returns progressive hint (level 1/2/3)
    → HintPanel shows hint with "More help" button
    ↓
After running → Clicks "Grade" (costs 2 credits)
    → POST /api/ai/grade with code + solution + lesson context
    → Gemini returns { correctness, efficiency, style, overall, feedback }
    → GradePanel shows circular progress rings
    ↓
If stuck → Clicks "Show Solution"
    → Monaco switches to solutionCode (read-only mode)
    → Student studies solution, clicks "Hide Solution" to return to their code
```

---

## Step 1: Exercise Design Principles

### The CAPE Framework

Every exercise follows CAPE:
- **C**oncept: What ONE concept does this exercise test?
- **A**pproach: What problem-solving approach should the student discover?
- **P**attern: What reusable pattern does this teach?
- **E**dge cases: What tricky inputs should the student handle?

### Exercise Types (ordered by difficulty)

```yaml
exercise_types:
  type_1_complete:
    name: "Complete the function"
    difficulty: easy-medium
    description: "Function signature and docstring given, student writes body"
    when: First encounter with a concept
    example: "def reverse_string(s): # TODO: return reversed string"

  type_2_fix:
    name: "Fix the bug"
    difficulty: medium
    description: "Working function with a subtle bug, student finds and fixes it"
    when: After student has seen the correct pattern
    example: "Off-by-one error in loop, wrong comparison operator, missing edge case"

  type_3_optimize:
    name: "Optimize the solution"
    difficulty: medium-hard
    description: "Correct but slow solution, student improves time/space complexity"
    when: After student understands the basic approach
    example: "O(n²) brute force → O(n) with hash map"

  type_4_design:
    name: "Design from scratch"
    difficulty: hard
    description: "Problem description only, student designs the full solution"
    when: Capstone or advanced exercises
    example: "Design a LRU cache" or "Implement a trie"

  type_5_extend:
    name: "Extend the solution"
    difficulty: medium-hard
    description: "Working base solution, student adds a feature or handles new cases"
    when: Building on a previous exercise
    example: "Add support for negative numbers" or "Handle duplicate keys"
```

### Difficulty Progression Within a Module

```yaml
module_exercise_arc:
  lesson_1: type_1_complete (easy) — "get comfortable with the concept"
  lesson_2: type_1_complete (medium) — "apply it to a new problem"
  lesson_3: type_2_fix OR type_3_optimize — "deepen understanding"
  lesson_4: type_4_design OR type_5_extend — "prove mastery"
  checkpoint: Quiz + voice summary (no code exercise)
```

---

## Step 2: starterCode Pattern

### Template Structure

```python
# Every starterCode follows this exact pattern:

def function_name(param1, param2):
    """
    One-line description of what the function should do.

    Args:
        param1: Description and type
        param2: Description and type

    Returns:
        Description of return value and type

    Example:
        >>> function_name([1, 2, 3], 5)
        [0, 2]
    """
    # TODO: Describe the approach in 1-2 lines
    # Hint: Mention the key insight without giving away the solution
    pass


# ─── Test Cases ───
# Do not modify below this line

print(function_name([1, 2, 3, 4, 6], 6))
# Expected: [1, 3]

print(function_name([2, 5, 9, 11], 11))
# Expected: [0, 2]

print(function_name([], 5))
# Expected: [-1, -1]
```

### Rules for starterCode

```yaml
starter_code_rules:
  function_signature:
    - Always provide the complete function signature
    - Include type hints for advanced courses (def func(arr: list[int]) -> int:)
    - Use descriptive parameter names (not x, y, z)

  docstring:
    - Always include a docstring with:
      - One-line description
      - Args with types
      - Returns with type
      - At least one Example with expected output
    - Docstring IS the problem specification — it must be complete

  todo_comments:
    - Include 1-2 TODO comments inside the function body
    - First TODO: describe WHAT to do (not HOW)
    - Second TODO (optional): hint at the approach
    - NEVER give away the algorithm in the TODO

  pass_statement:
    - Use 'pass' as the placeholder body
    - For type_2_fix: use buggy implementation instead of pass

  test_cases:
    - Minimum 3 test cases, maximum 6
    - Always include: normal case, edge case, empty/zero case
    - Use print() statements (not assert) — Pyodide captures stdout
    - Add "# Expected: <value>" comment after each print
    - Test cases MUST be identical in starter and solution code

  template_literal_escaping:
    - Python f-strings: \${name} → must escape in TypeScript template literal
    - Test in TypeScript: grep for unescaped ${ in the file
```

### starterCode by Language

Even though Pyodide only runs Python, we prepare exercises in multiple languages
for future multi-language support. The lesson content shows the concept in the
course's primary language.

#### Python starterCode

```python
def two_sum(nums, target):
    """
    Find two numbers that add up to target. Return their indices.

    Args:
        nums: List of integers
        target: Target sum

    Returns:
        List of two indices, or [-1, -1] if no pair found

    Example:
        >>> two_sum([2, 7, 11, 15], 9)
        [0, 1]
    """
    # TODO: Use a hash map to find complement in O(n) time
    pass


# ─── Test Cases ───
print(two_sum([2, 7, 11, 15], 9))   # Expected: [0, 1]
print(two_sum([3, 2, 4], 6))        # Expected: [1, 2]
print(two_sum([3, 3], 6))           # Expected: [0, 1]
```

#### Java starterCode (for lesson content display, not execution)

```java
/**
 * Find two numbers that add up to target. Return their indices.
 *
 * @param nums Array of integers
 * @param target Target sum
 * @return Array of two indices, or {-1, -1} if no pair found
 *
 * Example: twoSum([2, 7, 11, 15], 9) → [0, 1]
 */
public int[] twoSum(int[] nums, int target) {
    // TODO: Use a HashMap to find complement in O(n) time
    return new int[]{-1, -1};
}

// Test cases:
// twoSum([2, 7, 11, 15], 9) → [0, 1]
// twoSum([3, 2, 4], 6)      → [1, 2]
// twoSum([3, 3], 6)          → [0, 1]
```

#### Embedding Both in Lesson Content

For courses that teach concepts applicable to multiple languages, include BOTH
in the lesson markdown, but only the Python version goes in `starterCode`:

```markdown
## Solution in Python

\`\`\`python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return [-1, -1]
\`\`\`

## Solution in Java

\`\`\`java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{-1, -1};
}
\`\`\`

**Key insight:** The hash map approach works the same in both languages —
\`dict\` in Python, \`HashMap\` in Java. The pattern is: for each element,
check if the complement exists in the map, then add the current element.
```

---

## Step 3: solutionCode Pattern

### Template Structure

```python
# solutionCode is the COMPLETE, CORRECT, CLEAN implementation

def function_name(param1, param2):
    """
    One-line description (same as starterCode).

    Args:
        param1: Description
        param2: Description

    Returns:
        Description

    Time Complexity: O(n) — explain why
    Space Complexity: O(n) — explain why
    """
    # Implementation with clear variable names
    result = {}
    for i, val in enumerate(param1):
        complement = param2 - val
        if complement in result:
            return [result[complement], i]
        result[val] = i
    return [-1, -1]


# ─── Test Cases ─── (IDENTICAL to starterCode)
print(function_name([1, 2, 3, 4, 6], 6))   # Expected: [1, 3]
print(function_name([2, 5, 9, 11], 11))     # Expected: [0, 2]
print(function_name([], 5))                  # Expected: [-1, -1]
```

### Rules for solutionCode

```yaml
solution_code_rules:
  quality:
    - Solution must be the BEST approach (not just any working approach)
    - Use descriptive variable names (not i, j, k without context)
    - Add complexity analysis in docstring (Time: O(?), Space: O(?))
    - Follow Python conventions (PEP 8 style)

  comments:
    - Comment non-obvious lines (WHY, not WHAT)
    - Do NOT over-comment obvious code
    - BAD: "# loop through array" (obvious)
    - GOOD: "# complement check is O(1) because of hash map" (insight)

  test_cases:
    - MUST be identical to starterCode test cases
    - Same print() calls in same order
    - Same expected output comments
    - This ensures the grading AI can compare outputs

  edge_cases:
    - Solution must handle ALL edge cases from test cases
    - Empty input, single element, all same values, negative numbers
    - Return sensible defaults (not crash) for edge cases
```

---

## Step 4: Test Case Design

### Test Case Categories

```yaml
test_case_categories:
  normal:
    count: 1-2
    purpose: "Standard input that exercises the happy path"
    example: "print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]"

  edge:
    count: 1-2
    purpose: "Boundary conditions and special inputs"
    examples:
      - "Empty input: print(func([]))  # Expected: []"
      - "Single element: print(func([5]))  # Expected: 5"
      - "All same: print(func([3, 3, 3]))  # Expected: ..."
      - "Negative: print(func([-1, -2]))  # Expected: ..."
      - "Large: print(func(list(range(1000))))  # Expected: ..."

  tricky:
    count: 0-1
    purpose: "Input that catches common bugs"
    examples:
      - "Off-by-one: last element is the answer"
      - "Duplicate values that affect output"
      - "Zero as input (division, modulo)"

minimum_per_exercise: 3
maximum_per_exercise: 6
```

### Test Case Template

```python
# ─── Test Cases ───
# Do not modify below this line

# Normal case
print(func([2, 7, 11, 15], 9))
# Expected: [0, 1]

# Edge case: empty
print(func([], 5))
# Expected: [-1, -1]

# Edge case: single element
print(func([5], 5))
# Expected: [-1, -1]

# Tricky: duplicate values
print(func([3, 3], 6))
# Expected: [0, 1]
```

---

## Step 5: AI Integration Prompts

### Hint Prompt (sent to Gemini via /api/ai/hint)

The platform already sends:
- Lesson title and content
- Student's current code
- Starter code and solution code
- Hint level (1, 2, or 3)

**What the skill file agent should prepare:**

For each exercise, define 3 hint levels in the lesson metadata:

```yaml
exercise_hints:
  lesson_id: "two-sum"
  hint_1_direction: "Think about what you need to find for each number. If you're looking at number 7 and the target is 9, what other number do you need?"
  hint_2_approach: "A hash map lets you check 'have I seen the complement before?' in O(1). Loop through the array once, checking and storing as you go."
  hint_3_walkthrough: "For each number: compute complement = target - num. Check if complement is in your dictionary. If yes, return both indices. If no, add num:index to dictionary."
```

These hints guide the AI's response — they're not shown directly but shape what Gemini generates.

### Grade Prompt (sent to Gemini via /api/ai/grade)

The grading system already evaluates:
- **Correctness** (50%): Does the code produce correct output?
- **Efficiency** (30%): Is the time/space complexity optimal?
- **Style** (20%): Clean code, good names, Pythonic patterns?

**What the skill file agent should prepare:**

For each exercise, define the grading criteria:

```yaml
exercise_grading:
  lesson_id: "two-sum"
  optimal_complexity: "O(n) time, O(n) space"
  common_suboptimal: "O(n²) brute force with nested loops — still correct but not optimal"
  style_expectations:
    - "Uses dictionary/hash map"
    - "Descriptive variable name for complement"
    - "Returns early when found (no unnecessary iteration)"
  common_mistakes:
    - "Checking all pairs instead of using hash map"
    - "Not handling case where same element is used twice"
    - "Returning values instead of indices"
```

---

## Step 6: Multi-Language Content Embedding

Even though execution is Python-only, lessons can teach concepts in multiple languages
by embedding code in the markdown content:

### How to Structure Multi-Language Lessons

```markdown
## The Pattern: Two Pointers

The two-pointer technique works in any language. Here's the core idea:

<!-- voice:section_check concept="two pointer technique" -->

### Python Implementation

\`\`\`python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current = arr[left] + arr[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
\`\`\`

### Java Implementation

\`\`\`java
public int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int current = arr[left] + arr[right];
        if (current == target) return new int[]{left, right};
        else if (current < target) left++;
        else right--;
    }
    return new int[]{-1, -1};
}
\`\`\`

### What's the Same?

Notice both implementations follow the exact same logic:
1. Start with two pointers at opposite ends
2. Compare the sum to the target
3. Move the appropriate pointer
4. The only difference is syntax

<!-- voice:key_insight insight="Two pointers works identically across languages — learn the pattern, not the syntax" -->

### Try It Yourself

The exercise below uses Python. If you know Java, try implementing it
in Java too (on your own machine) after solving it here.
```

### TypeScript File Structure for Multi-Language Content

```typescript
// In the lesson content, escape Java/C# code properly:

content: `
## Java Version

\\\`\\\`\\\`java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}
\\\`\\\`\\\`

## C# Version

\\\`\\\`\\\`csharp
public int[] TwoSum(int[] nums, int target) {
    var dict = new Dictionary<int, int>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (dict.ContainsKey(complement)) {
            return new int[] { dict[complement], i };
        }
        dict[nums[i]] = i;
    }
    return new int[] { -1, -1 };
}
\\\`\\\`\\\`
`,

// starterCode and solutionCode are ALWAYS Python (Pyodide execution)
starterCode: `
def two_sum(nums, target):
    """Find two numbers that add up to target."""
    # TODO: Use a hash map for O(n) solution
    pass

print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
`,

solutionCode: `
def two_sum(nums, target):
    """Find two numbers that add up to target."""
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return [-1, -1]

print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
`,
```

---

## Step 7: Exercise Progression Template

### Module Exercise Arc (Example: Data Structures)

```yaml
module: "Hash Maps & Sets"
progression:
  lesson_1:
    title: "Introduction to Hash Maps"
    exercise_type: type_1_complete
    difficulty: easy
    concept: "Basic dictionary usage — insert, lookup, delete"
    starter: "Implement a function that counts word frequencies"
    tests: ["basic sentence", "empty string", "single word repeated"]

  lesson_2:
    title: "Two Sum Problem"
    exercise_type: type_1_complete
    difficulty: medium
    concept: "Using hash map for complement lookup"
    starter: "Find two numbers that sum to target in O(n)"
    tests: ["sorted array", "unsorted", "no solution", "duplicates"]
    multi_language: [python, java]  # Show both in content

  lesson_3:
    title: "Group Anagrams"
    exercise_type: type_3_optimize
    difficulty: medium
    concept: "Hash map keys from sorted strings"
    starter: "Given O(n² k log k) brute force, optimize grouping"
    tests: ["normal", "empty strings", "single char", "all anagrams"]

  lesson_4:
    title: "LRU Cache"
    exercise_type: type_4_design
    difficulty: hard
    concept: "OrderedDict or doubly-linked list + hash map"
    starter: "Design LRU Cache with get() and put() in O(1)"
    tests: ["basic operations", "eviction", "update existing", "capacity 1"]

  checkpoint:
    title: "Module Checkpoint: Hash Maps"
    quiz_questions: 5
    concepts_for_voice_summary: ["hash map lookup O(1)", "complement pattern", "anagram grouping"]
```

---

## Step 8: Quality Checklist for CS Exercises

### Before Committing Any Exercise

- [ ] **starterCode runs without errors** (should print nothing meaningful, but not crash)
- [ ] **solutionCode produces all expected outputs** (run it and verify)
- [ ] **Test cases are identical** in starter and solution
- [ ] **At least 3 test cases**: normal + edge + tricky
- [ ] **Docstring is complete**: description, args, returns, example
- [ ] **TODO comments guide without giving away** the solution
- [ ] **Template literals escaped**: no unescaped `${` in TypeScript file
- [ ] **Complexity noted** in solution docstring (Time: O(?), Space: O(?))
- [ ] **Variable names are descriptive** (not `a`, `b`, `x`)
- [ ] **Exercise tests ONE concept** — if it tests two, split into two exercises
- [ ] **Hints defined** (3 levels: direction, approach, walkthrough)
- [ ] **Grading criteria defined** (optimal complexity, common mistakes)
- [ ] **Multi-language examples** in content if applicable (Python + Java)
- [ ] **Voice markers present** in lesson content around the exercise

### Automated Validation Script

```bash
#!/bin/bash
# scripts/validate-exercise.sh <course-slug> <module-file>

FILE="src/data/$1/$2"

echo "=== Validating exercises in $FILE ==="

# 1. Check template literal escaping
VIOLATIONS=$(grep -n '\$\{' "$FILE" | grep -v '\\$\{' | grep -v 'import' | wc -l)
if [ "$VIOLATIONS" -gt 0 ]; then
  echo "FAIL: $VIOLATIONS unescaped template literals"
  grep -n '\$\{' "$FILE" | grep -v '\\$\{' | grep -v 'import'
else
  echo "PASS: Template literals properly escaped"
fi

# 2. Check test case consistency
STARTER_TESTS=$(grep -c "print(" "$FILE" | head -1)
echo "Test case count: $STARTER_TESTS"

# 3. Check for TODO comments
TODOS=$(grep -c "# TODO" "$FILE")
echo "TODO hints: $TODOS"

# 4. Check for voice markers
VOICE_MARKERS=$(grep -c "voice:" "$FILE")
echo "Voice markers: $VOICE_MARKERS"

echo "=== Validation complete ==="
```

---

## Anti-Patterns

- **DO NOT** write exercises that test syntax memorization ("What's the correct bracket?")
- **DO NOT** use `assert` in test cases — use `print()` (Pyodide stdout capture)
- **DO NOT** write starterCode that crashes on run — `pass` is safe, uninitialized vars are not
- **DO NOT** have different test cases in starter vs solution code — they MUST match
- **DO NOT** give away the algorithm in TODO comments — hint at the approach only
- **DO NOT** write solutions with cryptic variable names just because they're shorter
- **DO NOT** skip edge case tests — empty input, single element, zero, negative
- **DO NOT** create exercises requiring imports not available in Pyodide
- **DO NOT** write exercises that take >10 seconds to run (Pyodide timeout)
- **DO NOT** forget to escape `\${var}` in Python f-strings inside TypeScript template literals
