import { Module } from "../types";

export const capstoneSecurityAuditModule: Module = {
  id: "eh-capstone",
  title: "Capstone: Security Audit",
  description: "Apply everything you have learned by performing a comprehensive security audit on a simulated web application. Identify vulnerabilities, assess risks, and produce a professional security report.",
  lessons: [
    {
      id: "eh-audit-methodology",
      slug: "audit-methodology",
      title: "Security Audit Methodology",
      content: `## Security Audit Methodology

<!-- voice:section_check -->

A security audit is a systematic evaluation of an organization's information systems. It assesses whether security controls are adequate, identifies vulnerabilities, and recommends improvements.

### The Audit Process

1. **Scope Definition**: What systems, networks, and applications are included?
2. **Information Gathering**: Enumerate assets, services, technologies, and data flows
3. **Vulnerability Assessment**: Identify weaknesses using tools, manual testing, and code review
4. **Risk Assessment**: Rate each finding by likelihood and impact
5. **Reporting**: Document findings, evidence, and recommendations
6. **Remediation Tracking**: Follow up to ensure fixes are implemented

### Risk Rating Matrix

| | Low Impact | Medium Impact | High Impact | Critical Impact |
|---|---|---|---|---|
| **High Likelihood** | Medium | High | Critical | Critical |
| **Medium Likelihood** | Low | Medium | High | Critical |
| **Low Likelihood** | Low | Low | Medium | High |

<!-- voice:key_insight -->

### What Auditors Look For

**Authentication & Access Control**
- Default credentials still active?
- MFA enabled for admin accounts?
- Password policy enforced (minimum length, complexity)?
- Session management secure (timeout, HttpOnly cookies)?

**Input Handling**
- All user input validated server-side?
- Parameterized queries used for database access?
- Output encoding applied to prevent XSS?

**Configuration**
- Debug mode disabled in production?
- Error messages generic (not leaking stack traces)?
- HTTPS enforced with valid certificates?
- Security headers set (CSP, X-Frame-Options, HSTS)?

**Data Protection**
- Sensitive data encrypted at rest?
- Secrets in environment variables, not code?
- Backup and recovery procedures tested?

**Monitoring**
- Logging enabled for authentication events?
- Failed login attempts tracked and alerted?
- Log retention policy in place?

### Professional Report Structure

\`\`\`
1. Executive Summary (non-technical overview for leadership)
2. Scope and Methodology
3. Summary of Findings (table: ID, Title, Risk, Status)
4. Detailed Findings (each with: description, evidence, impact, recommendation)
5. Appendices (tools used, raw scan results, compliance mappings)
\`\`\`

### Key Takeaway

A security audit is only valuable if it leads to action. Clear, prioritized findings with specific, actionable recommendations are more useful than a list of theoretical vulnerabilities.

### Reflection Questions

- Why is scope definition the most important first step of an audit?
- How would you prioritize remediation if you found 50 vulnerabilities with limited engineering time?`,
    },
    {
      id: "eh-audit-exercise",
      slug: "security-audit-exercise",
      title: "Exercise: Automated Security Checker",
      content: `## Exercise: Automated Security Checker

Build a tool that checks a web application configuration for common security issues. This simulates the automated portion of a security audit.

### What You Will Build

A function that takes a dictionary representing a web app's configuration and checks it against security best practices, producing a scored audit report.

### Configuration Fields to Check

- HTTPS enabled, debug mode, CORS policy, CSP headers
- Authentication settings (MFA, password policy, session timeout)
- Database settings (default credentials, encryption)
- Logging and monitoring settings

### Hints

- Each check produces a finding with severity (critical, high, medium, low, info)
- Calculate an overall security score based on findings
- Group findings by category for readability`,
      starterCode: `def check_https(config):
    """Check if HTTPS is properly configured.

    Args:
        config: dict with 'https_enabled', 'hsts_enabled', 'tls_version'
    Returns:
        list of finding dicts
    """
    findings = []
    # TODO: Check if HTTPS is enabled
    # TODO: Check if HSTS is enabled
    # TODO: Check TLS version (>= 1.2 required, 1.3 recommended)
    pass

def check_authentication(config):
    """Check authentication configuration.

    Args:
        config: dict with 'mfa_enabled', 'min_password_length',
                'session_timeout_minutes', 'account_lockout_threshold'
    Returns:
        list of finding dicts
    """
    findings = []
    # TODO: Check MFA is enabled
    # TODO: Check password length >= 12
    # TODO: Check session timeout <= 30 minutes
    # TODO: Check account lockout is configured
    pass

def check_headers(config):
    """Check security headers.

    Args:
        config: dict with 'csp_enabled', 'x_frame_options',
                'x_content_type_options', 'referrer_policy'
    Returns:
        list of finding dicts
    """
    # TODO: Check each security header is configured
    pass

def check_database(config):
    """Check database security.

    Args:
        config: dict with 'db_user', 'db_password', 'encryption_at_rest',
                'backup_enabled'
    Returns:
        list of finding dicts
    """
    # TODO: Check for default credentials (admin/admin, root/root, etc.)
    # TODO: Check encryption at rest
    # TODO: Check backup configuration
    pass

def check_debug_mode(config):
    """Check if debug mode is disabled in production.

    Args:
        config: dict with 'debug_mode', 'environment', 'verbose_errors'
    Returns:
        list of finding dicts
    """
    # TODO: Flag if debug mode is on in production
    # TODO: Flag if verbose errors are enabled in production
    pass

def run_audit(config):
    """Run a complete security audit on the configuration.

    Args:
        config: full application configuration dict
    Returns:
        dict: {
            'score': int (0-100),
            'grade': str ('A' to 'F'),
            'total_findings': int,
            'critical': int,
            'high': int,
            'medium': int,
            'low': int,
            'findings': list of finding dicts,
            'report': str (formatted report)
        }
    """
    # TODO: Run all checks
    # TODO: Compute score (start at 100, deduct per finding)
    # TODO: Assign grade
    # TODO: Generate formatted report
    pass

# Test: Insecure configuration
insecure_config = {
    'https_enabled': False,
    'hsts_enabled': False,
    'tls_version': '1.0',
    'mfa_enabled': False,
    'min_password_length': 6,
    'session_timeout_minutes': 120,
    'account_lockout_threshold': 0,
    'csp_enabled': False,
    'x_frame_options': None,
    'x_content_type_options': None,
    'referrer_policy': None,
    'db_user': 'admin',
    'db_password': 'admin',
    'encryption_at_rest': False,
    'backup_enabled': False,
    'debug_mode': True,
    'environment': 'production',
    'verbose_errors': True,
}

result = run_audit(insecure_config)
print(result['report'])
print(f"\\nScore: {result['score']}/100 (Grade: {result['grade']})")
# Expected: Very low score with many critical/high findings

print("\\n" + "=" * 50)

# Test: Secure configuration
secure_config = {
    'https_enabled': True,
    'hsts_enabled': True,
    'tls_version': '1.3',
    'mfa_enabled': True,
    'min_password_length': 16,
    'session_timeout_minutes': 15,
    'account_lockout_threshold': 5,
    'csp_enabled': True,
    'x_frame_options': 'DENY',
    'x_content_type_options': 'nosniff',
    'referrer_policy': 'strict-origin-when-cross-origin',
    'db_user': 'app_readonly_7f3a',
    'db_password': 'xK9#mP2$vL8nQ4wR',
    'encryption_at_rest': True,
    'backup_enabled': True,
    'debug_mode': False,
    'environment': 'production',
    'verbose_errors': False,
}

result2 = run_audit(secure_config)
print(result2['report'])
print(f"\\nScore: {result2['score']}/100 (Grade: {result2['grade']})")
# Expected: High score with few/no findings`,
      solutionCode: `def check_https(config):
    """Check if HTTPS is properly configured."""
    findings = []
    if not config.get('https_enabled'):
        findings.append({
            'severity': 'critical',
            'category': 'Transport Security',
            'title': 'HTTPS Not Enabled',
            'description': 'Data transmitted in plaintext. All traffic can be intercepted.',
            'recommendation': 'Enable HTTPS with a valid TLS certificate.',
        })
    if not config.get('hsts_enabled'):
        findings.append({
            'severity': 'high',
            'category': 'Transport Security',
            'title': 'HSTS Not Enabled',
            'description': 'Browser may allow HTTP downgrade attacks.',
            'recommendation': 'Enable HSTS header with max-age >= 31536000.',
        })
    tls = config.get('tls_version', '')
    if tls in ('1.0', '1.1'):
        findings.append({
            'severity': 'high',
            'category': 'Transport Security',
            'title': f'Outdated TLS Version ({tls})',
            'description': f'TLS {tls} has known vulnerabilities.',
            'recommendation': 'Upgrade to TLS 1.2 or 1.3.',
        })
    return findings

def check_authentication(config):
    """Check authentication configuration."""
    findings = []
    if not config.get('mfa_enabled'):
        findings.append({
            'severity': 'high',
            'category': 'Authentication',
            'title': 'MFA Not Enabled',
            'description': 'Accounts protected by password only.',
            'recommendation': 'Enable multi-factor authentication for all users.',
        })
    pwd_len = config.get('min_password_length', 0)
    if pwd_len < 8:
        findings.append({
            'severity': 'high',
            'category': 'Authentication',
            'title': f'Weak Password Policy (min {pwd_len} chars)',
            'description': 'Short passwords are vulnerable to brute force.',
            'recommendation': 'Require minimum 12 characters.',
        })
    elif pwd_len < 12:
        findings.append({
            'severity': 'medium',
            'category': 'Authentication',
            'title': f'Password Policy Could Be Stronger (min {pwd_len} chars)',
            'description': 'NIST recommends minimum 12 characters.',
            'recommendation': 'Increase minimum password length to 12+.',
        })
    timeout = config.get('session_timeout_minutes', 0)
    if timeout > 30:
        findings.append({
            'severity': 'medium',
            'category': 'Authentication',
            'title': f'Long Session Timeout ({timeout} min)',
            'description': 'Long sessions increase hijacking risk.',
            'recommendation': 'Set session timeout to 30 minutes or less.',
        })
    if config.get('account_lockout_threshold', 0) == 0:
        findings.append({
            'severity': 'medium',
            'category': 'Authentication',
            'title': 'No Account Lockout',
            'description': 'Unlimited login attempts allow brute force.',
            'recommendation': 'Lock accounts after 5-10 failed attempts.',
        })
    return findings

def check_headers(config):
    """Check security headers."""
    findings = []
    if not config.get('csp_enabled'):
        findings.append({
            'severity': 'medium',
            'category': 'Security Headers',
            'title': 'Content Security Policy Not Set',
            'description': 'No CSP allows inline scripts and XSS.',
            'recommendation': "Set CSP header with restrictive policy.",
        })
    if not config.get('x_frame_options'):
        findings.append({
            'severity': 'medium',
            'category': 'Security Headers',
            'title': 'X-Frame-Options Not Set',
            'description': 'Page can be embedded in iframes (clickjacking).',
            'recommendation': 'Set X-Frame-Options to DENY or SAMEORIGIN.',
        })
    if not config.get('x_content_type_options'):
        findings.append({
            'severity': 'low',
            'category': 'Security Headers',
            'title': 'X-Content-Type-Options Not Set',
            'description': 'Browser may MIME-sniff responses.',
            'recommendation': 'Set X-Content-Type-Options to nosniff.',
        })
    return findings

def check_database(config):
    """Check database security."""
    findings = []
    default_creds = [('admin', 'admin'), ('root', 'root'), ('admin', 'password'),
                     ('root', 'password'), ('sa', 'sa'), ('postgres', 'postgres')]
    user = config.get('db_user', '')
    pwd = config.get('db_password', '')
    if (user, pwd) in default_creds:
        findings.append({
            'severity': 'critical',
            'category': 'Database',
            'title': 'Default Database Credentials',
            'description': f'Using default credentials ({user}/{pwd}).',
            'recommendation': 'Change to unique, strong credentials immediately.',
        })
    if not config.get('encryption_at_rest'):
        findings.append({
            'severity': 'high',
            'category': 'Database',
            'title': 'No Encryption at Rest',
            'description': 'Data stored in plaintext on disk.',
            'recommendation': 'Enable AES-256 encryption at rest.',
        })
    if not config.get('backup_enabled'):
        findings.append({
            'severity': 'medium',
            'category': 'Database',
            'title': 'Backups Not Enabled',
            'description': 'Data loss risk in case of failure or ransomware.',
            'recommendation': 'Enable automated encrypted backups.',
        })
    return findings

def check_debug_mode(config):
    """Check if debug mode is disabled in production."""
    findings = []
    if config.get('environment') == 'production':
        if config.get('debug_mode'):
            findings.append({
                'severity': 'critical',
                'category': 'Configuration',
                'title': 'Debug Mode Enabled in Production',
                'description': 'Exposes stack traces, internal paths, and sensitive data.',
                'recommendation': 'Disable debug mode in production immediately.',
            })
        if config.get('verbose_errors'):
            findings.append({
                'severity': 'high',
                'category': 'Configuration',
                'title': 'Verbose Errors in Production',
                'description': 'Detailed error messages leak implementation details.',
                'recommendation': 'Show generic error messages to users.',
            })
    return findings

def run_audit(config):
    """Run a complete security audit on the configuration."""
    all_findings = []
    all_findings.extend(check_https(config))
    all_findings.extend(check_authentication(config))
    all_findings.extend(check_headers(config))
    all_findings.extend(check_database(config))
    all_findings.extend(check_debug_mode(config))

    severity_counts = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0}
    for f in all_findings:
        severity_counts[f['severity']] = severity_counts.get(f['severity'], 0) + 1

    # Score: start at 100, deduct per finding
    score = 100
    score -= severity_counts.get('critical', 0) * 20
    score -= severity_counts.get('high', 0) * 10
    score -= severity_counts.get('medium', 0) * 5
    score -= severity_counts.get('low', 0) * 2
    score = max(0, min(100, score))

    if score >= 90: grade = 'A'
    elif score >= 80: grade = 'B'
    elif score >= 70: grade = 'C'
    elif score >= 60: grade = 'D'
    else: grade = 'F'

    # Generate report
    lines = ["\\n=== SECURITY AUDIT REPORT ===", "=" * 40]
    lines.append(f"Score: {score}/100 | Grade: {grade}")
    lines.append(f"Total Findings: {len(all_findings)}")
    lines.append(f"  Critical: {severity_counts['critical']} | High: {severity_counts['high']} | Medium: {severity_counts['medium']} | Low: {severity_counts['low']}")
    lines.append("")

    for i, f in enumerate(all_findings, 1):
        sev = f['severity'].upper()
        lines.append(f"[{sev}] #{i}: {f['title']}")
        lines.append(f"  Category: {f['category']}")
        lines.append(f"  Issue: {f['description']}")
        lines.append(f"  Fix: {f['recommendation']}")
        lines.append("")

    return {
        'score': score,
        'grade': grade,
        'total_findings': len(all_findings),
        'critical': severity_counts['critical'],
        'high': severity_counts['high'],
        'medium': severity_counts['medium'],
        'low': severity_counts['low'],
        'findings': all_findings,
        'report': "\\n".join(lines),
    }

# Time complexity: O(n) where n = number of config fields
# Space complexity: O(f) where f = number of findings

# Test: Insecure configuration
insecure_config = {
    'https_enabled': False,
    'hsts_enabled': False,
    'tls_version': '1.0',
    'mfa_enabled': False,
    'min_password_length': 6,
    'session_timeout_minutes': 120,
    'account_lockout_threshold': 0,
    'csp_enabled': False,
    'x_frame_options': None,
    'x_content_type_options': None,
    'referrer_policy': None,
    'db_user': 'admin',
    'db_password': 'admin',
    'encryption_at_rest': False,
    'backup_enabled': False,
    'debug_mode': True,
    'environment': 'production',
    'verbose_errors': True,
}

result = run_audit(insecure_config)
print(result['report'])
print(f"\\nScore: {result['score']}/100 (Grade: {result['grade']})")

print("\\n" + "=" * 50)

# Test: Secure configuration
secure_config = {
    'https_enabled': True,
    'hsts_enabled': True,
    'tls_version': '1.3',
    'mfa_enabled': True,
    'min_password_length': 16,
    'session_timeout_minutes': 15,
    'account_lockout_threshold': 5,
    'csp_enabled': True,
    'x_frame_options': 'DENY',
    'x_content_type_options': 'nosniff',
    'referrer_policy': 'strict-origin-when-cross-origin',
    'db_user': 'app_readonly_7f3a',
    'db_password': 'xK9#mP2vL8nQ4wR',
    'encryption_at_rest': True,
    'backup_enabled': True,
    'debug_mode': False,
    'environment': 'production',
    'verbose_errors': False,
}

result2 = run_audit(secure_config)
print(result2['report'])
print(f"\\nScore: {result2['score']}/100 (Grade: {result2['grade']})")`,
    },
    {
      id: "eh-capstone-checkpoint",
      slug: "capstone-checkpoint",
      title: "Checkpoint: Security Audit Capstone",
      content: `## Checkpoint: Security Audit Capstone

<!-- voice:section_check -->

Congratulations on completing the Ethical Hacking & Cybersecurity course! Review the key concepts across all modules.

---

### Question 1
Put these security audit steps in the correct order:

A) Reporting -> Vulnerability Assessment -> Scope Definition -> Information Gathering
B) Scope Definition -> Information Gathering -> Vulnerability Assessment -> Reporting
C) Vulnerability Assessment -> Scope Definition -> Reporting -> Information Gathering
D) Information Gathering -> Vulnerability Assessment -> Scope Definition -> Reporting

**Answer: B** — A proper audit follows: define scope (what to test), gather information (enumerate assets), assess vulnerabilities (find weaknesses), then report findings. Skipping scope definition leads to incomplete audits or legal issues.

---

### Question 2
You find a web application that returns detailed stack traces when errors occur in production. This vulnerability is categorized as:

A) SQL Injection
B) Security Misconfiguration (OWASP #5)
C) Broken Access Control
D) Cryptographic Failure

**Answer: B** — Verbose error messages in production are a security misconfiguration. Stack traces reveal internal paths, framework versions, and database structure that attackers use for reconnaissance.

---

### Question 3
Rank these findings by severity (most to least critical):

1. Debug mode enabled in production
2. X-Content-Type-Options header missing
3. Default database credentials (admin/admin)
4. Session timeout set to 60 minutes

A) 3, 1, 4, 2
B) 1, 3, 2, 4
C) 3, 1, 2, 4
D) 2, 4, 3, 1

**Answer: A** — Default database credentials (critical: immediate full database compromise) > Debug mode in production (critical: exposes internals) > Long session timeout (medium: increases hijacking risk) > Missing header (low: minor defense-in-depth gap).

---

### Question 4
A security audit finding states: "No rate limiting on the login endpoint." Which attack does this enable?

A) SQL Injection
B) Cross-Site Scripting
C) Brute-force password attacks
D) DNS Spoofing

**Answer: C** — Without rate limiting, an attacker can attempt thousands of password combinations per minute. Rate limiting (e.g., 5 attempts per minute, then lockout) makes brute-force attacks impractical.

---

### Question 5
What is the single most important thing that distinguishes ethical hackers from criminals?

A) The tools they use
B) Their level of skill
C) Written authorization from the system owner defining scope and methods
D) Whether they find vulnerabilities

**Answer: C** — Authorization is everything. The same actions — scanning ports, testing for SQL injection, attempting password guessing — are legal with authorization and criminal without it. Always get written permission before testing.`,
    },
  ],
};
