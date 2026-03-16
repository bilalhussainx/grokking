import { Module } from "../types";

export const securityMindsetModule: Module = {
  id: "eh-security-mindset",
  title: "Security Mindset",
  description:
    "Develop the attacker's perspective to build better defenses. Learn the CIA triad, threat modeling, and the ethical and legal framework that governs security research.",
  lessons: [
    {
      id: "eh-think-like-attacker",
      slug: "think-like-an-attacker",
      title: "Think Like an Attacker",
      content: `## Think Like an Attacker

<!-- voice:section_check -->

The best defenders understand how attackers operate. This does not mean becoming an attacker — it means learning to anticipate threats before they materialize.

### The CIA Triad

Every security decision revolves around three principles:

| Principle | Definition | Example Violation |
|-----------|-----------|-------------------|
| **Confidentiality** | Only authorized parties can access information | Data breach exposing user passwords |
| **Integrity** | Data has not been tampered with | Attacker modifying bank transaction amounts |
| **Availability** | Systems are accessible when needed | DDoS attack taking down a website |

### The Attacker's Methodology

Most attacks follow a predictable pattern, often modeled as the **Cyber Kill Chain** (Lockheed Martin, 2011):

1. **Reconnaissance**: Gather information about the target (public websites, employee LinkedIn profiles, DNS records)
2. **Weaponization**: Create a payload (malware, exploit kit)
3. **Delivery**: Send the weapon to the target (phishing email, compromised website)
4. **Exploitation**: Trigger the vulnerability (user clicks link, software bug is exploited)
5. **Installation**: Establish persistence (backdoor, rootkit)
6. **Command & Control**: Communicate with the compromised system
7. **Actions on Objectives**: Achieve the goal (data theft, ransomware, sabotage)

<!-- voice:key_insight -->

### Defense in Depth

No single security measure is sufficient. **Defense in depth** layers multiple controls:

\`\`\`
Internet -> Firewall -> IDS/IPS -> Web App Firewall -> Application Code -> Database
                                                              |
                                                    Input Validation
                                                    Authentication
                                                    Authorization
                                                    Encryption
                                                    Logging & Monitoring
\`\`\`

Each layer catches what the previous layer missed.

### The Legal Framework

**Ethical hacking** is legal only with explicit authorization:

- **Authorized**: Penetration testing under a signed agreement, bug bounty programs (HackerOne, Bugcrowd), your own systems
- **Unauthorized**: Accessing any system without permission, even if you find a vulnerability and report it

Key laws:
- **CFAA** (Computer Fraud and Abuse Act, US): Unauthorized access to a computer system is a federal crime
- **CMA** (Computer Misuse Act, UK): Similar provisions
- **GDPR** (EU): Handling personal data requires explicit consent and breach notification

### Responsible Disclosure

If you find a vulnerability in someone else's system:
1. Report it to the organization privately
2. Give them reasonable time to fix it (typically 90 days)
3. Do not exploit it or share details publicly until patched

### Key Takeaway

Security is about anticipating threats by understanding the attacker's methodology. Always operate within legal and ethical boundaries. Authorization is the line between ethical hacking and criminal activity.

### Reflection Questions

- Why is "defense in depth" more effective than relying on a single security measure?
- What would you do if you accidentally discovered a vulnerability in a company's website while browsing normally?`,
    },
    {
      id: "eh-threat-modeling",
      slug: "threat-modeling",
      title: "Threat Modeling with STRIDE",
      content: `## Threat Modeling with STRIDE

<!-- voice:section_check -->

**Threat modeling** is the structured process of identifying potential security threats to a system before they are exploited. It is more valuable than any tool because it forces you to think systematically.

### The STRIDE Framework

Microsoft developed STRIDE in 1999 as a mnemonic for the six categories of threats:

| Threat | Definition | CIA Impact | Example |
|--------|-----------|------------|---------|
| **S**poofing | Pretending to be someone else | Confidentiality | Forged login credentials |
| **T**ampering | Modifying data without authorization | Integrity | Altering a database record |
| **R**epudiation | Denying an action occurred | Integrity | User claims they did not make a purchase |
| **I**nformation Disclosure | Exposing data to unauthorized parties | Confidentiality | API returning sensitive data in error messages |
| **D**enial of Service | Making a system unavailable | Availability | Flooding a server with requests |
| **E**levation of Privilege | Gaining unauthorized access level | Confidentiality, Integrity | Regular user accessing admin functions |

### How to Threat Model

1. **Diagram the system**: Draw data flow diagrams showing components, data flows, trust boundaries
2. **Identify threats**: Apply STRIDE to each component and data flow
3. **Rate risks**: Use DREAD (Damage, Reproducibility, Exploitability, Affected users, Discoverability) or CVSS
4. **Plan mitigations**: Determine countermeasures for each threat
5. **Validate**: Verify mitigations are implemented and effective

### Example: Login System

\`\`\`
[User Browser] --HTTPS--> [Web Server] --SQL--> [Database]
      |                        |
  Trust Boundary          Trust Boundary
\`\`\`

Threats for the login flow:
- **Spoofing**: Attacker uses stolen credentials -> Mitigation: MFA
- **Tampering**: Attacker modifies login request -> Mitigation: HTTPS, input validation
- **Information Disclosure**: Error message reveals "user not found" vs. "wrong password" -> Mitigation: Generic error messages
- **Denial of Service**: Brute-force login attempts -> Mitigation: Rate limiting, account lockout
- **Elevation of Privilege**: SQL injection in login form -> Mitigation: Parameterized queries

<!-- voice:key_insight -->

### OWASP Top 10 (2021)

The Open Web Application Security Project maintains the definitive list of the most critical web application security risks:

1. **Broken Access Control** — Users acting outside intended permissions
2. **Cryptographic Failures** — Weak encryption or missing encryption
3. **Injection** — SQL, NoSQL, command injection
4. **Insecure Design** — Flaws in architecture, not implementation
5. **Security Misconfiguration** — Default credentials, open cloud storage
6. **Vulnerable Components** — Using libraries with known CVEs
7. **Authentication Failures** — Weak passwords, missing MFA
8. **Software and Data Integrity Failures** — Untrusted updates, CI/CD compromise
9. **Logging and Monitoring Failures** — Attacks go undetected
10. **SSRF** — Server-Side Request Forgery

### Key Takeaway

Threat modeling is the most cost-effective security activity. Finding and fixing a vulnerability during design costs 30x less than fixing it in production (NIST). STRIDE provides a systematic framework for identifying threats before code is written.

### Further Reading

- Shostack, A. (2014). *Threat Modeling: Designing for Security*. Wiley.
- OWASP Top 10 (2021): https://owasp.org/Top10/`,
    },
    {
      id: "eh-security-mindset-checkpoint",
      slug: "security-mindset-checkpoint",
      title: "Checkpoint: Security Mindset",
      content: `## Checkpoint: Security Mindset

<!-- voice:section_check -->

Test your understanding of security fundamentals before diving into technical topics.

---

### Question 1
A DDoS attack primarily targets which element of the CIA triad?

A) Confidentiality
B) Integrity
C) Availability
D) Authentication

**Answer: C** — A Distributed Denial of Service (DDoS) attack floods a system with traffic to make it unavailable to legitimate users. This directly targets Availability.

---

### Question 2
In the Cyber Kill Chain, which phase involves the attacker gathering information about the target?

A) Weaponization
B) Exploitation
C) Reconnaissance
D) Installation

**Answer: C** — Reconnaissance is the first phase where the attacker collects information about the target (domain names, employee emails, technology stack) to plan the attack.

---

### Question 3
What is the key difference between ethical hacking and criminal hacking?

A) Ethical hackers use different tools
B) Ethical hackers have explicit written authorization from the system owner
C) Ethical hackers only target small companies
D) Ethical hackers never find real vulnerabilities

**Answer: B** — Authorization is the legal dividing line. Ethical hackers operate under signed agreements that define scope, timing, and methods. The same actions without authorization are criminal offenses under laws like the CFAA.

---

### Question 4
In STRIDE, "Elevation of Privilege" refers to:

A) An attacker gaining physical access to a server room
B) A regular user gaining unauthorized access to admin-level functionality
C) An employee getting promoted
D) Encrypting data with a stronger algorithm

**Answer: B** — Elevation of Privilege occurs when a user or process gains access levels beyond what was intended, such as a regular user exploiting a vulnerability to execute admin commands.

---

### Question 5
What is the #1 vulnerability in the OWASP Top 10 (2021)?

A) SQL Injection
B) Cross-Site Scripting (XSS)
C) Broken Access Control
D) Cryptographic Failures

**Answer: C** — Broken Access Control moved to #1 in 2021, reflecting the prevalence of authorization flaws where users can act outside their intended permissions (e.g., accessing other users' data by modifying a URL parameter).`,
    },
  ],
};
