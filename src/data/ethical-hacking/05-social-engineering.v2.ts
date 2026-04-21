import { Module } from "../types";

export const socialEngineeringModule: Module = {
  id: "eh-social-engineering",
  title: "Social Engineering",
  description: "Understand how attackers exploit human psychology to bypass technical defenses. Learn about phishing, pretexting, and social engineering defense strategies that protect organizations.",
  lessons: [
    {
      id: "eh-human-element",
      slug: "the-human-element",
      title: "The Human Element in Security",
      content: `## The Human Element in Security

<!-- voice:section_check -->

Kevin Mitnick, one of the most famous hackers in history, said: "The human factor is truly security's weakest link." No matter how strong your technical defenses, a well-crafted social engineering attack can bypass them all.

### What is Social Engineering?

Social engineering is the manipulation of people into performing actions or divulging confidential information. It exploits human psychology rather than technical vulnerabilities.

### The Psychology of Social Engineering

Robert Cialdini's "Principles of Influence" (from his 1984 book *Influence: The Psychology of Persuasion*) explains why social engineering works:

| Principle | How Attackers Use It |
|-----------|---------------------|
| **Authority** | "This is IT support. I need your password to fix your account." |
| **Urgency** | "Your account will be locked in 24 hours unless you verify now." |
| **Social Proof** | "Everyone in your department has already completed this security update." |
| **Reciprocity** | "I helped you with that issue last week. Could you do me a favor?" |
| **Liking** | Building rapport and trust before making the request |
| **Scarcity** | "This offer expires in 1 hour" or "Only 3 spots left" |

### Types of Social Engineering Attacks

**Phishing**: Mass emails impersonating legitimate organizations

\`\`\`
Subject: [URGENT] Your Account Has Been Compromised
From: security@paypa1.com  <-- note: paypa1 not paypal

Dear Valued Customer,
We detected suspicious activity. Click here to verify your identity.
[Malicious Link]
\`\`\`

<!-- voice:key_insight -->

**Spear Phishing**: Targeted phishing aimed at a specific individual, using personal information gathered through reconnaissance.

**Vishing**: Voice phishing — social engineering over the phone.

**Pretexting**: Creating a fabricated scenario (pretext) to extract information. Example: calling a company pretending to be a new employee who forgot their login credentials.

**Baiting**: Leaving infected USB drives in parking lots, relying on curiosity.

**Tailgating/Piggybacking**: Following an authorized person through a secure door.

### Real-World Examples

- **Twitter (2020)**: Attackers called Twitter employees posing as IT staff, obtaining credentials to internal tools. They hijacked accounts of Barack Obama, Elon Musk, and others to promote a Bitcoin scam. Loss: $120,000 in Bitcoin, massive reputational damage.
- **RSA Security (2011)**: A phishing email with the subject "2011 Recruitment Plan" containing a malicious Excel file compromised RSA's SecurID two-factor authentication product, affecting 40 million tokens.

### Defense Strategies

1. **Security awareness training**: Regular training with simulated phishing exercises
2. **Verification procedures**: Always verify identity through a separate channel before acting on unusual requests
3. **Culture of questioning**: Encourage employees to question unusual requests without fear of retaliation
4. **Technical controls**: Email filtering, URL scanning, MFA (reduces impact even if credentials are stolen)
5. **Reporting mechanisms**: Make it easy and safe to report suspicious communications

### Key Takeaway

Social engineering attacks target humans, not technology. The most effective defense combines security awareness training, verification procedures, and a culture where questioning unusual requests is encouraged, not punished.

### Reflection Questions

- Have you ever received a suspicious email or phone call? What made you suspicious (or not)?
- Why might senior executives be particularly vulnerable to spear phishing?`,
    },
    {
      id: "eh-phishing-analyzer-exercise",
      slug: "phishing-analyzer-exercise",
      title: "Exercise: Phishing Email Analyzer",
      content: `## Exercise: Phishing Email Analyzer

Build a tool that analyzes emails for common phishing indicators. This teaches pattern recognition and defensive security thinking.

### Common Phishing Indicators

- Mismatched sender domains (display name vs. actual email)
- Urgency language ("immediately", "expires", "suspended")
- Suspicious URLs (misspelled domains, IP addresses)
- Generic greetings ("Dear Customer" instead of your name)
- Grammar and spelling errors
- Requests for sensitive information

### Hints

- Use string matching and regex for pattern detection
- Score each indicator and compute an overall risk score
- Real phishing detection uses ML, but rule-based detection catches many obvious attempts`,
      starterCode: `import re

def analyze_sender(from_field):
    """Analyze the sender field for suspicious patterns.

    Args:
        from_field: email From header (e.g., "PayPal <security@paypa1.com>")
    Returns:
        dict: {
            'display_name': str,
            'email': str,
            'domain': str,
            'suspicious': bool,
            'reasons': list of str
        }
    """
    # TODO: Extract display name and email address
    # TODO: Check for domain spoofing (e.g., paypa1 vs paypal)
    # TODO: Check for suspicious TLDs
    # TODO: Check if display name does not match domain
    pass

def analyze_urls(body):
    """Extract and analyze URLs in the email body.

    Args:
        body: email body text
    Returns:
        list of dicts: [{
            'url': str,
            'suspicious': bool,
            'reasons': list of str
        }]
    """
    # TODO: Extract URLs using regex
    # TODO: Check for IP addresses instead of domains
    # TODO: Check for misspelled common domains
    # TODO: Check for excessive subdomains
    pass

def analyze_urgency(body):
    """Detect urgency language commonly used in phishing.

    Args:
        body: email body text
    Returns:
        dict: {
            'urgency_score': int (0-10),
            'phrases_found': list of str
        }
    """
    # TODO: Define urgency phrases
    # TODO: Search for them in the body
    # TODO: Score based on count
    pass

def phishing_score(from_field, subject, body):
    """Compute an overall phishing risk score.

    Args:
        from_field: email From header
        subject: email subject line
        body: email body text
    Returns:
        dict: {
            'score': int (0-100),
            'risk_level': 'safe' | 'suspicious' | 'likely_phishing',
            'indicators': list of str
        }
    """
    # TODO: Combine sender, URL, and urgency analysis
    # TODO: Add points for generic greetings
    # TODO: Add points for requests for sensitive info
    # TODO: Compute overall score and risk level
    pass

# Test cases
print("=== Legitimate Email ===")
legit = phishing_score(
    "John Smith <john.smith@company.com>",
    "Meeting Tomorrow",
    "Hi Alice, can we reschedule our 2pm meeting to 3pm? Thanks, John"
)
print(f"Score: {legit['score']}/100 - {legit['risk_level']}")

print("\\n=== Obvious Phishing ===")
phish = phishing_score(
    "PayPal Security <alert@paypa1-secure.com>",
    "URGENT: Your Account Has Been Suspended",
    """Dear Valued Customer,

Your account has been temporarily suspended due to suspicious activity.
You must verify your identity immediately or your account will be permanently deleted.

Click here to verify: http://192.168.1.1/paypal-verify/login.php

Please provide your password and social security number to confirm your identity.

This is urgent - you have 24 hours to respond.

PayPal Security Team"""
)
print(f"Score: {phish['score']}/100 - {phish['risk_level']}")
print(f"Indicators: {phish['indicators']}")`,
      solutionCode: `import re

def analyze_sender(from_field):
    """Analyze the sender field for suspicious patterns."""
    reasons = []
    match = re.match(r'(.*?)s*<(.+?)>', from_field)
    if match:
        display_name = match.group(1).strip()
        email = match.group(2).strip()
    else:
        display_name = ""
        email = from_field.strip()

    domain = email.split('@')[-1] if '@' in email else ""

    # Check for lookalike domains
    lookalikes = {
        'paypa1': 'paypal', 'paypai': 'paypal', 'amaz0n': 'amazon',
        'g00gle': 'google', 'micros0ft': 'microsoft', 'app1e': 'apple',
    }
    domain_base = domain.split('.')[0].lower()
    for fake, real in lookalikes.items():
        if fake in domain_base:
            reasons.append(f"Lookalike domain: '{domain}' resembles '{real}'")

    # Check for suspicious TLDs
    suspicious_tlds = ['.xyz', '.tk', '.ml', '.ga', '.cf']
    if any(domain.endswith(tld) for tld in suspicious_tlds):
        reasons.append(f"Suspicious TLD in domain: {domain}")

    # Check display name vs. domain mismatch
    if display_name and domain:
        name_lower = display_name.lower()
        known_brands = ['paypal', 'amazon', 'google', 'apple', 'microsoft', 'bank']
        for brand in known_brands:
            if brand in name_lower and brand not in domain.lower():
                reasons.append(f"Display name '{display_name}' does not match domain '{domain}'")

    return {
        'display_name': display_name,
        'email': email,
        'domain': domain,
        'suspicious': len(reasons) > 0,
        'reasons': reasons,
    }

def analyze_urls(body):
    """Extract and analyze URLs in the email body."""
    urls = re.findall(r'https?://[^s<>"]+', body)
    results = []
    for url in urls:
        reasons = []
        # IP address instead of domain
        if re.search(r'https?://d{1,3}.d{1,3}.d{1,3}.d{1,3}', url):
            reasons.append("URL uses IP address instead of domain name")
        # Excessive subdomains
        domain_part = re.search(r'https?://([^/]+)', url)
        if domain_part and domain_part.group(1).count('.') > 3:
            reasons.append("Excessive subdomains")
        # Suspicious path keywords
        if re.search(r'(login|verify|confirm|secure|account|update)', url, re.IGNORECASE):
            reasons.append("Suspicious path keywords (login/verify/confirm)")
        results.append({'url': url, 'suspicious': len(reasons) > 0, 'reasons': reasons})
    return results

def analyze_urgency(body):
    """Detect urgency language commonly used in phishing."""
    urgency_phrases = [
        "immediately", "urgent", "suspended", "expires", "locked",
        "verify your", "confirm your", "24 hours", "act now",
        "permanently deleted", "unauthorized", "suspicious activity",
        "click here", "do not ignore",
    ]
    found = [p for p in urgency_phrases if p.lower() in body.lower()]
    score = min(10, len(found) * 2)
    return {'urgency_score': score, 'phrases_found': found}

def phishing_score(from_field, subject, body):
    """Compute an overall phishing risk score."""
    score = 0
    indicators = []

    sender = analyze_sender(from_field)
    if sender['suspicious']:
        score += 30
        indicators.extend(sender['reasons'])

    urls = analyze_urls(body)
    for u in urls:
        if u['suspicious']:
            score += 15
            indicators.extend(u['reasons'])

    urgency = analyze_urgency(subject + " " + body)
    score += urgency['urgency_score'] * 3
    if urgency['phrases_found']:
        indicators.append(f"Urgency phrases: {', '.join(urgency['phrases_found'])}")

    # Generic greeting
    if re.search(r'dear (valued |loyal )?(customer|user|member|sir|madam)', body, re.IGNORECASE):
        score += 10
        indicators.append("Generic greeting (not personalized)")

    # Requests for sensitive info
    sensitive = ['password', 'social security', 'credit card', 'ssn', 'bank account']
    for term in sensitive:
        if term in body.lower():
            score += 15
            indicators.append(f"Requests sensitive info: '{term}'")

    score = min(100, score)
    if score >= 60:
        risk_level = "likely_phishing"
    elif score >= 30:
        risk_level = "suspicious"
    else:
        risk_level = "safe"

    return {'score': score, 'risk_level': risk_level, 'indicators': indicators}

# Time complexity: O(n) where n is email body length
# Space complexity: O(n) for extracted patterns

# Test cases
print("=== Legitimate Email ===")
legit = phishing_score(
    "John Smith <john.smith@company.com>",
    "Meeting Tomorrow",
    "Hi Alice, can we reschedule our 2pm meeting to 3pm? Thanks, John"
)
print(f"Score: {legit['score']}/100 - {legit['risk_level']}")

print("\\n=== Obvious Phishing ===")
phish = phishing_score(
    "PayPal Security <alert@paypa1-secure.com>",
    "URGENT: Your Account Has Been Suspended",
    """Dear Valued Customer,

Your account has been temporarily suspended due to suspicious activity.
You must verify your identity immediately or your account will be permanently deleted.

Click here to verify: http://192.168.1.1/paypal-verify/login.php

Please provide your password and social security number to confirm your identity.

This is urgent - you have 24 hours to respond.

PayPal Security Team"""
)
print(f"Score: {phish['score']}/100 - {phish['risk_level']}")
print(f"Indicators: {phish['indicators']}")`,
    },
    {
      id: "eh-social-engineering-checkpoint",
      slug: "social-engineering-checkpoint",
      title: "Checkpoint: Social Engineering",
      content: `## Checkpoint: Social Engineering

<!-- voice:section_check -->

Test your understanding of social engineering tactics and defenses.

---

### Question 1
An attacker sends a highly personalized email to the CFO, referencing a real project and requesting a wire transfer. This is an example of:

A) Mass phishing
B) Spear phishing
C) Vishing
D) Baiting

**Answer: B** — Spear phishing targets specific individuals using personal information gathered through reconnaissance. The attacker researched the CFO's projects to make the email credible. This is far more dangerous than mass phishing because it is much harder to detect.

---

### Question 2
Which of Cialdini's influence principles does this message exploit? "Your account will be permanently deleted in 24 hours unless you verify your identity NOW."

A) Authority and Social Proof
B) Urgency and Scarcity
C) Reciprocity and Liking
D) Consistency and Commitment

**Answer: B** — The time pressure ("24 hours") creates urgency, and "permanently deleted" implies scarcity (you will lose something). These principles push people to act quickly without thinking critically.

---

### Question 3
What is the most effective organizational defense against social engineering?

A) Stronger firewalls
B) Regular security awareness training combined with simulated phishing exercises
C) Blocking all external emails
D) Requiring longer passwords

**Answer: B** — Technical controls help but cannot prevent all social engineering. Regular training teaches employees to recognize attacks, and simulated phishing exercises provide practice in a safe environment. Studies show organizations with regular training reduce successful phishing rates by 75%+.

---

### Question 4
An employee receives a call from someone claiming to be from IT support who asks for their password. What should the employee do?

A) Give the password since IT support needs it
B) Hang up and call IT support directly using a known number to verify the request
C) Give a fake password
D) Report it only if it seems suspicious

**Answer: B** — Always verify identity through a separate, trusted channel. Legitimate IT support should never need your password. Calling back on a known number (not the number they called from) confirms whether the request is genuine.

---

### Question 5
The 2020 Twitter hack was primarily executed through:

A) A zero-day exploit in Twitter's servers
B) Social engineering — attackers called employees posing as IT staff to obtain internal tool credentials
C) A brute-force attack on admin passwords
D) A SQL injection vulnerability

**Answer: B** — The attackers called Twitter employees, pretending to be from the IT department, and convinced them to provide credentials to internal admin tools. Despite Twitter's technical sophistication, human manipulation bypassed all technical defenses.`,
    },
  ],
};
