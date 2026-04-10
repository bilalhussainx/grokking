-- 024_interview_problems.sql
-- Problem bank for live coding interviews

CREATE TABLE IF NOT EXISTS interview_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),

  -- Problem content
  description TEXT NOT NULL,
  constraints TEXT,
  examples JSONB NOT NULL DEFAULT '[]',

  -- Code
  starter_code_python TEXT,
  starter_code_java TEXT,
  solution_code_python TEXT,
  solution_code_java TEXT,

  -- Test cases
  test_cases_visible JSONB NOT NULL DEFAULT '[]',
  test_cases_hidden JSONB NOT NULL DEFAULT '[]',

  -- Metadata for question planner
  topics TEXT[] NOT NULL DEFAULT '{}',
  company_tags TEXT[] NOT NULL DEFAULT '{}',
  pattern TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_problems_difficulty
  ON interview_problems (difficulty);
CREATE INDEX IF NOT EXISTS idx_interview_problems_topics
  ON interview_problems USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_interview_problems_companies
  ON interview_problems USING GIN (company_tags);

-- RLS — problems are public read, admin write
ALTER TABLE interview_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_problems_read_policy ON interview_problems
  FOR SELECT USING (true);

-- Seed 5 classic interview problems
INSERT INTO interview_problems (slug, title, difficulty, description, constraints, examples, starter_code_python, starter_code_java, solution_code_python, topics, company_tags, pattern, test_cases_visible, test_cases_hidden) VALUES

('two-sum', 'Two Sum', 'easy',
 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
 'Only one valid answer exists. 2 <= nums.length <= 10^4. -10^9 <= nums[i] <= 10^9.',
 '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}]',
 E'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass',
 E'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}',
 E'def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []',
 ARRAY['arrays', 'hash-map'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2', 'microsoft-sde2'],
 'hash-map',
 '[{"input": "nums = [2,7,11,15]\ntarget = 9", "expected_output": "[0, 1]"}, {"input": "nums = [3,2,4]\ntarget = 6", "expected_output": "[1, 2]"}]',
 '[{"input": "nums = [3,3]\ntarget = 6", "expected_output": "[0, 1]"}, {"input": "nums = [-1,-2,-3,-4,-5]\ntarget = -8", "expected_output": "[2, 4]"}]'),

('valid-parentheses', 'Valid Parentheses', 'easy',
 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type, and open brackets are closed in the correct order.',
 '1 <= s.length <= 10^4. s consists of parentheses only.',
 '[{"input": "s = \"()\"", "output": "true"}, {"input": "s = \"([)]\"", "output": "false"}]',
 E'def is_valid(s: str) -> bool:\n    # Your code here\n    pass',
 E'class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}',
 E'def is_valid(s: str) -> bool:\n    stack = []\n    pairs = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n    for c in s:\n        if c in pairs:\n            if not stack or stack[-1] != pairs[c]:\n                return False\n            stack.pop()\n        else:\n            stack.append(c)\n    return len(stack) == 0',
 ARRAY['stack', 'strings'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2'],
 'stack',
 '[{"input": "s = \"()\"", "expected_output": "True"}, {"input": "s = \"()[]{}\"", "expected_output": "True"}, {"input": "s = \"(]\"", "expected_output": "False"}]',
 '[{"input": "s = \"([)]\"", "expected_output": "False"}, {"input": "s = \"{[]}\"", "expected_output": "True"}, {"input": "s = \"\"", "expected_output": "True"}]'),

('merge-intervals', 'Merge Intervals', 'medium',
 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
 '1 <= intervals.length <= 10^4. intervals[i].length == 2. 0 <= start_i <= end_i <= 10^4.',
 '[{"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]", "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."}]',
 E'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Your code here\n    pass',
 E'class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[][]{};\n    }\n}',
 E'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged',
 ARRAY['arrays', 'intervals', 'sorting'],
 ARRAY['google-l4', 'meta-e4', 'uber-sde2'],
 'intervals',
 '[{"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "expected_output": "[[1, 6], [8, 10], [15, 18]]"}, {"input": "intervals = [[1,4],[4,5]]", "expected_output": "[[1, 5]]"}]',
 '[{"input": "intervals = [[1,4],[0,4]]", "expected_output": "[[0, 4]]"}, {"input": "intervals = [[1,4],[2,3]]", "expected_output": "[[1, 4]]"}, {"input": "intervals = [[1,4]]", "expected_output": "[[1, 4]]"}]'),

('lru-cache', 'LRU Cache', 'medium',
 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) — initialize with positive capacity. int get(int key) — return value if key exists, else -1. void put(int key, int value) — update or insert. When at capacity, evict the least recently used key.',
 '1 <= capacity <= 3000. 0 <= key <= 10^4. 0 <= value <= 10^5. At most 2 * 10^5 calls to get and put.',
 '[{"input": "ops = [\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"], args = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]", "output": "[null,null,null,1,null,-1,null,-1,3,4]"}]',
 E'class LRUCache:\n    def __init__(self, capacity: int):\n        # Your code here\n        pass\n\n    def get(self, key: int) -> int:\n        # Your code here\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # Your code here\n        pass',
 NULL,
 E'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)',
 ARRAY['hash-map', 'linked-list', 'design'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2', 'netflix-senior'],
 'design',
 '[{"input": "ops = [\"init\",\"put\",\"put\",\"get\",\"put\",\"get\"]\nargs = [[2],[1,1],[2,2],[1],[3,3],[2]]", "expected_output": "[null,null,null,1,null,-1]"}]',
 '[{"input": "ops = [\"init\",\"put\",\"get\",\"put\",\"get\",\"get\"]\nargs = [[1],[2,1],[2],[3,2],[2],[3]]", "expected_output": "[null,null,1,null,-1,2]"}]'),

('number-of-islands', 'Number of Islands', 'medium',
 'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
 'm == grid.length. n == grid[i].length. 1 <= m, n <= 300. grid[i][j] is ''0'' or ''1''.',
 '[{"input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "output": "1"}]',
 E'def num_islands(grid: list[list[str]]) -> int:\n    # Your code here\n    pass',
 NULL,
 E'def num_islands(grid: list[list[str]]) -> int:\n    if not grid:\n        return 0\n    count = 0\n    rows, cols = len(grid), len(grid[0])\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != \"1\":\n            return\n        grid[r][c] = \"0\"\n        dfs(r+1, c)\n        dfs(r-1, c)\n        dfs(r, c+1)\n        dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == \"1\":\n                count += 1\n                dfs(r, c)\n    return count',
 ARRAY['graph', 'bfs', 'dfs', 'matrix'],
 ARRAY['google-l4', 'meta-e4', 'amazon-sde2', 'uber-sde2'],
 'bfs-dfs',
 '[{"input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "expected_output": "3"}]',
 '[{"input": "grid = [[\"1\"]]", "expected_output": "1"}, {"input": "grid = [[\"0\"]]", "expected_output": "0"}, {"input": "grid = [[\"1\",\"0\"],[\"0\",\"1\"]]", "expected_output": "2"}]')

ON CONFLICT (slug) DO NOTHING;
