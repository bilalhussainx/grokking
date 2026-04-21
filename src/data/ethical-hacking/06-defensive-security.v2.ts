import { Module } from "../types";

export const defensiveSecurityModule: Module = {
  id: "eh-defensive-security",
  title: "Defensive Security",
  description: "Learn how to protect systems and networks through firewalls, intrusion detection, security hardening, incident response, and security monitoring. Build practical defensive tools.",
  lessons: [
    {
      id: "eh-defense-layers",
      slug: "defense-layers",
      title: "Layered Defense Architecture",
      content: `## Layered Defense Architecture

<!-- voice:section_check -->

Offense gets the headlines, but defense wins the war. A single security control will always fail eventually — defense in depth ensures that when one layer fails, the next catches it.

### The Defense Stack

\`\`\`
Layer 1: Perimeter Defense
  - Firewalls (network + web application)
  - DDoS protection (Cloudflare, AWS Shield)
  - Email gateway filtering

Layer 2: Network Security
  - Network segmentation (VLANs, microsegmentation)
  - Intrusion Detection/Prevention Systems (IDS/IPS)
  - VPN for remote access

Layer 3: Application Security
  - Input validation and output encoding
  - Authentication & authorization (OAuth, RBAC)
  - Secure session management

Layer 4: Data Security
  - Encryption at rest (AES-256)
  - Encryption in transit (TLS 1.3)
  - Database access controls

Layer 5: Monitoring & Response
  - SIEM (Security Information and Event Management)
  - Log aggregation and analysis
  - Incident response procedures
\`\`\`

### Firewalls

A firewall controls traffic based on rules:

\`\`\`
# Simplified firewall rules
ALLOW TCP from ANY to WebServer:443     # HTTPS traffic
ALLOW TCP from AdminNet to Server:22    # SSH from admin network only
DENY  TCP from ANY to Database:3306     # No direct database access
DENY  ALL from ANY to ANY               # Default deny everything else
\`\`\`

**Default deny** is critical: only explicitly allowed traffic passes through. Everything else is blocked.

<!-- voice:key_insight -->

### Intrusion Detection Systems (IDS)

IDS monitors network traffic or system activity for malicious patterns:

**Signature-based**: Matches against known attack patterns (like antivirus signatures)
- Fast and accurate for known attacks
- Cannot detect novel (zero-day) attacks

**Anomaly-based**: Establishes a baseline of "normal" and alerts on deviations
- Can detect unknown attacks
- Higher false positive rate

### Security Hardening Checklist

| Category | Action |
|----------|--------|
| **OS** | Remove unnecessary services, apply patches, disable root login |
| **Network** | Close unused ports, enable firewall, use SSH keys not passwords |
| **Application** | Update dependencies, remove default accounts, configure CSP headers |
| **Database** | Change default passwords, restrict network access, encrypt sensitive columns |
| **Authentication** | Enforce MFA, use strong password policies, implement account lockout |
| **Monitoring** | Enable audit logging, set up alerts, retain logs for 90+ days |

### The Principle of Least Privilege

Every user, process, and system should have only the minimum permissions needed to do its job. If a web server only needs to read from the database, do not give it write access.

### Key Takeaway

Defensive security is about layers, monitoring, and preparation. No single control is sufficient. Combine perimeter defenses, application security, data protection, and continuous monitoring to create a resilient security posture.

### Reflection Questions

- Why is "default deny" considered best practice for firewall rules?
- How would you apply the principle of least privilege to a web application's database user?`,
    },
    {
      id: "eh-log-analyzer-exercise",
      slug: "log-analyzer-exercise",
      title: "Exercise: Security Log Analyzer",
      content: `## Exercise: Security Log Analyzer

Build a tool that analyzes server access logs to detect suspicious activity. Security monitoring is a core defensive skill.

### Common Attack Patterns in Logs

- **Brute force**: Many failed login attempts from the same IP
- **Directory traversal**: Requests containing \`../\` to access files outside the web root
- **SQL injection probes**: Requests containing SQL keywords
- **Port scanning**: Rapid connections to many ports from one IP
- **Unusual hours**: Access from known users at unusual times

### Log Format

We will use a simplified Apache-style log format:
\`\`\`
IP TIMESTAMP METHOD PATH STATUS
192.168.1.100 2024-01-15T10:30:00 GET /index.html 200
\`\`\`

### Hints

- Use dictionaries to count events per IP
- A threshold of 10+ failed requests from one IP suggests brute force
- Check for known attack patterns in the request path`,
      starterCode: `from collections import defaultdict
from datetime import datetime

def parse_log_line(line):
    """Parse a single log line into components.

    Args:
        line: log string like "192.168.1.1 2024-01-15T10:30:00 GET /index.html 200"
    Returns:
        dict with keys: ip, timestamp, method, path, status
    """
    # TODO: Split the line and extract components
    # TODO: Parse timestamp into datetime object
    # TODO: Parse status as integer
    pass

def detect_brute_force(logs, threshold=10):
    """Detect potential brute force attacks.

    An IP with more than 'threshold' failed requests (status 401/403)
    is flagged.

    Args:
        logs: list of parsed log dicts
        threshold: minimum failed attempts to flag
    Returns:
        list of dicts: [{'ip': str, 'failed_attempts': int, 'timespan': str}]
    """
    # TODO: Count failed requests per IP
    # TODO: Flag IPs exceeding threshold
    pass

def detect_directory_traversal(logs):
    """Detect directory traversal attempts (../ in path).

    Args:
        logs: list of parsed log dicts
    Returns:
        list of dicts: [{'ip': str, 'path': str, 'timestamp': str}]
    """
    # TODO: Check each log for ../ patterns in path
    pass

def detect_sqli_probes(logs):
    """Detect SQL injection probes in request paths.

    Args:
        logs: list of parsed log dicts
    Returns:
        list of dicts: [{'ip': str, 'path': str, 'pattern': str}]
    """
    # TODO: Check for SQL keywords in request paths
    pass

def generate_report(logs):
    """Generate a comprehensive security report.

    Args:
        logs: list of raw log line strings
    Returns:
        str: formatted security report
    """
    # TODO: Parse all logs
    # TODO: Run all detection functions
    # TODO: Format into a readable report
    pass

# Test log data
test_logs = [
    "192.168.1.100 2024-01-15T10:30:00 GET /index.html 200",
    "192.168.1.100 2024-01-15T10:30:01 GET /about.html 200",
    "10.0.0.50 2024-01-15T10:31:00 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:01 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:02 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:03 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:04 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:05 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:06 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:07 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:08 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:09 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:10 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:11 POST /login 200",
    "172.16.0.5 2024-01-15T11:00:00 GET /../../etc/passwd 403",
    "172.16.0.5 2024-01-15T11:00:01 GET /..%2F..%2Fetc/shadow 403",
    "172.16.0.5 2024-01-15T11:00:02 GET /admin/../../../etc/hosts 403",
    "192.168.1.200 2024-01-15T12:00:00 GET /search?q=1'+UNION+SELECT+*+FROM+users-- 400",
    "192.168.1.200 2024-01-15T12:00:01 GET /search?q=';DROP+TABLE+users;-- 400",
]

report = generate_report(test_logs)
print(report)`,
      solutionCode: `from collections import defaultdict
from datetime import datetime

def parse_log_line(line):
    """Parse a single log line into components."""
    parts = line.split()
    return {
        'ip': parts[0],
        'timestamp': datetime.fromisoformat(parts[1]),
        'method': parts[2],
        'path': parts[3],
        'status': int(parts[4]),
    }

def detect_brute_force(logs, threshold=10):
    """Detect potential brute force attacks."""
    failed_per_ip = defaultdict(list)
    for log in logs:
        if log['status'] in (401, 403):
            failed_per_ip[log['ip']].append(log['timestamp'])

    flagged = []
    for ip, timestamps in failed_per_ip.items():
        if len(timestamps) >= threshold:
            timespan = f"{timestamps[0]} to {timestamps[-1]}"
            flagged.append({
                'ip': ip,
                'failed_attempts': len(timestamps),
                'timespan': timespan,
            })
    return flagged

def detect_directory_traversal(logs):
    """Detect directory traversal attempts."""
    results = []
    for log in logs:
        if '../' in log['path'] or '..%2F' in log['path'] or '..%2f' in log['path']:
            results.append({
                'ip': log['ip'],
                'path': log['path'],
                'timestamp': str(log['timestamp']),
            })
    return results

def detect_sqli_probes(logs):
    """Detect SQL injection probes in request paths."""
    sqli_patterns = ['UNION', 'SELECT', 'DROP', 'DELETE', 'INSERT', "' OR ", "1=1", "--"]
    results = []
    for log in logs:
        path_upper = log['path'].upper()
        for pattern in sqli_patterns:
            if pattern.upper() in path_upper:
                results.append({
                    'ip': log['ip'],
                    'path': log['path'],
                    'pattern': pattern,
                })
                break
    return results

def generate_report(logs):
    """Generate a comprehensive security report."""
    parsed = [parse_log_line(line) for line in logs]

    brute = detect_brute_force(parsed)
    traversal = detect_directory_traversal(parsed)
    sqli = detect_sqli_probes(parsed)

    lines = ["\\n=== SECURITY LOG ANALYSIS REPORT ===", "=" * 40]
    lines.append(f"Total log entries analyzed: {len(parsed)}")
    lines.append(f"Unique IPs: {len(set(l['ip'] for l in parsed))}")

    lines.append(f"\\n--- Brute Force Attempts ({len(brute)} detected) ---")
    for b in brute:
        lines.append(f"  IP: {b['ip']} | Failed attempts: {b['failed_attempts']} | {b['timespan']}")

    lines.append(f"\\n--- Directory Traversal ({len(traversal)} detected) ---")
    for t in traversal:
        lines.append(f"  IP: {t['ip']} | Path: {t['path']} | Time: {t['timestamp']}")

    lines.append(f"\\n--- SQL Injection Probes ({len(sqli)} detected) ---")
    for s in sqli:
        lines.append(f"  IP: {s['ip']} | Path: {s['path']}")

    total_threats = len(brute) + len(traversal) + len(sqli)
    lines.append(f"\\n--- Summary ---")
    lines.append(f"Total threats detected: {total_threats}")
    if total_threats > 0:
        lines.append("RECOMMENDATION: Block flagged IPs and investigate further.")
    else:
        lines.append("No threats detected in analyzed logs.")

    return "\\n".join(lines)

# Time complexity: O(n * p) where n = log entries, p = patterns
# Space complexity: O(n) for parsed logs

# Test log data
test_logs = [
    "192.168.1.100 2024-01-15T10:30:00 GET /index.html 200",
    "192.168.1.100 2024-01-15T10:30:01 GET /about.html 200",
    "10.0.0.50 2024-01-15T10:31:00 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:01 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:02 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:03 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:04 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:05 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:06 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:07 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:08 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:09 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:10 POST /login 401",
    "10.0.0.50 2024-01-15T10:31:11 POST /login 200",
    "172.16.0.5 2024-01-15T11:00:00 GET /../../etc/passwd 403",
    "172.16.0.5 2024-01-15T11:00:01 GET /..%2F..%2Fetc/shadow 403",
    "172.16.0.5 2024-01-15T11:00:02 GET /admin/../../../etc/hosts 403",
    "192.168.1.200 2024-01-15T12:00:00 GET /search?q=1'+UNION+SELECT+*+FROM+users-- 400",
    "192.168.1.200 2024-01-15T12:00:01 GET /search?q=';DROP+TABLE+users;-- 400",
]

report = generate_report(test_logs)
print(report)`,
    },
    {
      id: "eh-defensive-checkpoint",
      slug: "defensive-security-checkpoint",
      title: "Checkpoint: Defensive Security",
      content: `## Checkpoint: Defensive Security

<!-- voice:section_check -->

Test your understanding of defensive security practices.

---

### Question 1
What does "default deny" mean in firewall configuration?

A) All traffic is allowed unless explicitly blocked
B) All traffic is blocked unless explicitly allowed
C) Only deny rules are used
D) The firewall denies its own existence

**Answer: B** — Default deny means the firewall blocks all traffic by default. Only traffic that matches an explicit "allow" rule passes through. This is far more secure than "default allow," where you must anticipate and block every possible attack.

---

### Question 2
An anomaly-based IDS flags a developer who logs in at 3 AM. Why might this be a false positive?

A) The IDS is broken
B) 3 AM logins deviate from the developer's baseline "normal" behavior, but they might legitimately be working late
C) The developer is definitely an attacker
D) Anomaly-based IDS cannot detect real attacks

**Answer: B** — Anomaly-based detection establishes a baseline of normal activity and flags deviations. A developer pulling an all-nighter legitimately deviates from their normal pattern. This is the fundamental tradeoff: anomaly detection catches unknown attacks but produces more false positives.

---

### Question 3
The principle of least privilege dictates that a web application's database user should:

A) Have full admin access for convenience
B) Have only the specific permissions needed (e.g., SELECT on certain tables, INSERT on others)
C) Share the root database credentials
D) Have read-only access to all tables

**Answer: B** — Each application component should have only the minimum permissions required. If the web app only needs to read user profiles and insert orders, it should not have DROP TABLE or access to the admin_credentials table.

---

### Question 4
A security log shows 500 failed login attempts from IP 10.0.0.50 in 60 seconds. This pattern is most likely:

A) A legitimate user who forgot their password
B) A brute-force password attack
C) A DDoS attack
D) Normal server behavior

**Answer: B** — 500 failed attempts in 60 seconds is a clear automated brute-force pattern. A human might try 5-10 passwords before giving up. Defensive responses: rate limiting, IP blocking, account lockout, and CAPTCHA.

---

### Question 5
Why is network segmentation important for defensive security?

A) It makes the network faster
B) It limits the blast radius of a breach — if one segment is compromised, the attacker cannot easily reach other segments
C) It is required by law
D) It replaces the need for firewalls

**Answer: B** — Segmentation creates boundaries within the network. If an attacker compromises the web server, they cannot directly access the database server in a different segment. This contains breaches and gives defenders time to detect and respond.`,
    },
  ],
};
