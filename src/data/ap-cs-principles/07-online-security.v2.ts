import { Module } from "../types";

export const onlineSecurityModule: Module = {
  id: "ap-csp-security",
  title: "Online Security",
  description: "Understand cybersecurity threats and defenses -- encryption, authentication, phishing, and how to stay safe online.",
  lessons: [
    {
      id: "ap-csp-cybersecurity-threats",
      slug: "cybersecurity-threats",
      title: "Cybersecurity Threats",
      content: `## Cybersecurity Threats

<!-- voice:key_insight -->

As more of our lives move online, understanding cybersecurity is essential. Attackers use a variety of techniques to steal data, money, and identities.

### Common Attack Types

**Phishing**: Fake emails or websites that trick you into revealing passwords or personal information. Example: an email that looks like it is from your bank asking you to "verify your account."

**Malware**: Malicious software including:
- **Viruses** -- attach to files and spread when shared
- **Ransomware** -- encrypts your files and demands payment
- **Keyloggers** -- record everything you type (including passwords)
- **Trojans** -- disguise themselves as legitimate software

**DDoS (Distributed Denial of Service)**: Overwhelm a website with millions of fake requests so legitimate users cannot access it.

**Man-in-the-Middle (MITM)**: Attacker secretly intercepts communication between two parties. Like someone secretly reading your mail before delivering it.

**Social Engineering**: Manipulating people rather than technology. Calling IT support while pretending to be an employee to reset a password.

### The Human Factor

Over 90% of successful cyberattacks start with a human mistake -- clicking a bad link, using a weak password, or sharing too much information.

### Analogy: Cybersecurity Is Like Home Security

You lock your doors (passwords), install an alarm (antivirus), do not let strangers in (avoid phishing), and do not leave valuables visible (protect personal data).

### Deeper Reading
- AP CSP: Big Idea 6 -- The Internet (security topics)
- NIST Cybersecurity Framework (simplified version)

### Reflection Questions
1. How would you identify a phishing email?
2. Why is social engineering effective even against companies with good technology?
3. What makes ransomware particularly dangerous?`,
    },
    {
      id: "ap-csp-encryption-passwords",
      slug: "encryption-passwords",
      title: "Encryption and Passwords",
      content: `## Encryption and Passwords

### Symmetric vs. Asymmetric Encryption

<!-- voice:key_insight -->

**Symmetric encryption**: Same key encrypts and decrypts. Fast, but you need a way to share the key safely.
- Like a padlock where sender and receiver both have a copy of the same key

**Asymmetric encryption (public-key)**: Two different keys -- a **public key** (everyone can see) and a **private key** (only you have).
- Anyone can lock a message with your public key
- Only your private key can unlock it
- Like a mailbox: anyone can drop mail through the slot (public key), but only you have the key to open it (private key)

\`\`\`mermaid
graph LR
    A["Plaintext
'Hello'"] -->|"Encrypt
with Key"| B["Ciphertext
'7f3a9c...'"]
    B -->|"Decrypt
with Key"| C["Plaintext
'Hello'"]
    style A fill:#22c55e,color:#fff
    style B fill:#ef4444,color:#fff
    style C fill:#22c55e,color:#fff
\`\`\`

In symmetric encryption, the same key locks and unlocks the message. In asymmetric encryption, one key encrypts (public) and a different key decrypts (private).

### How HTTPS Uses Both

1. Your browser gets the website's **public key**
2. Browser generates a random symmetric key and encrypts it with the public key
3. Only the server's private key can decrypt it
4. Both sides now share the symmetric key and use it for fast encrypted communication

### Password Security

**What makes a password strong?**
- Length (12+ characters is recommended)
- Mix of uppercase, lowercase, numbers, symbols
- NOT based on dictionary words or personal info

**Password hashing**: Websites should never store your actual password. They store a **hash** -- a one-way mathematical transformation:
- \`"mypassword123"\` -> \`"5f4dcc3b5aa765d61d8327deb882cf99"\`
- You cannot reverse a hash to get the original password
- When you log in, the site hashes what you type and compares it to the stored hash

### Multi-Factor Authentication (MFA)

Something you **know** (password) + something you **have** (phone/token) + something you **are** (fingerprint). Using two or more factors makes it much harder for attackers.

### Deeper Reading
- Khan Academy: "Cryptography" course
- Have I Been Pwned (haveibeenpwned.com) -- check if your email appeared in a data breach

### Reflection Questions
1. Why does HTTPS use both symmetric and asymmetric encryption?
2. Why should a website store password hashes instead of actual passwords?
3. How does multi-factor authentication improve security?`,
    },
    {
      id: "ap-csp-security-checkpoint",
      slug: "security-checkpoint",
      title: "Checkpoint: Online Security",
      content: `## Checkpoint: Online Security

<!-- voice:section_check -->

### Question 1
Explain the difference between symmetric and asymmetric encryption.

<details>
<summary>Show Answer</summary>

**Symmetric** uses one shared key for both encryption and decryption. **Asymmetric** uses a pair: a public key (anyone can encrypt) and a private key (only the owner can decrypt). Symmetric is faster; asymmetric solves the key-sharing problem.
</details>

### Question 2
A website stores passwords as plaintext (not hashed). Why is this a major security risk?

<details>
<summary>Show Answer</summary>

If the database is breached, attackers get every user's actual password. Since many people reuse passwords, attackers can use those credentials on other sites (credential stuffing). Hashing prevents this because hashes cannot be reversed.
</details>

### Question 3
You receive an email from "your bank" asking you to click a link and enter your password. What should you do?

<details>
<summary>Show Answer</summary>

Do NOT click the link. This is likely a **phishing** attempt. Instead, open your browser and type the bank's URL directly, or call the bank using the number on your card. Check the sender's email address carefully for misspellings.
</details>

### Question 4
Why is a 20-character password made of random words (like "correct horse battery staple") often stronger than "P@ssw0rd!"?

<details>
<summary>Show Answer</summary>

Password strength comes primarily from **length** and **unpredictability**. A 20-character passphrase has far more possible combinations than a short password with symbol substitutions. Attackers know common substitutions (@ for a, 0 for o) and try them first.
</details>

### Question 5
What is a DDoS attack, and why is it hard to defend against?

<details>
<summary>Show Answer</summary>

A DDoS (Distributed Denial of Service) attack floods a server with traffic from thousands of compromised computers (a botnet). It is hard to defend because the traffic comes from many different sources, making it difficult to distinguish from legitimate users.
</details>

### Almost There!
One more module to go -- AP Exam Prep. You are ready to ace the AP CSP exam!`,
    },
  ],
};
