import { Module } from "../types";

export const theInternetModule: Module = {
  id: "ap-csp-internet",
  title: "The Internet",
  description: "Explore how the Internet works -- from packets and protocols to DNS, HTTP, and how data travels across the globe.",
  lessons: [
    {
      id: "ap-csp-how-internet-works",
      slug: "how-internet-works",
      title: "How the Internet Works",
      content: `## How the Internet Works

<!-- voice:key_insight -->

The Internet is not a single thing -- it is a **network of networks**. Billions of devices connected together, all speaking the same set of rules (called **protocols**).

### The Physical Layer

At the most basic level, the Internet is made of:
- **Copper cables** (phone lines, Ethernet)
- **Fiber optic cables** (light pulses through glass -- most backbone traffic)
- **Radio waves** (Wi-Fi, cellular)
- **Satellites** (for remote areas)

Massive undersea fiber optic cables connect continents. Over 400 submarine cables carry about 99% of intercontinental data.

### IP Addresses: The Internet's Mailing System

Every device on the Internet has a unique **IP address**, like a mailing address:

- **IPv4**: \`192.168.1.1\` (4 numbers, each 0-255, about 4.3 billion addresses)
- **IPv6**: \`2001:0db8:85a3::8a2e:0370:7334\` (much larger address space)

### Packets: How Data Travels

When you send data over the Internet, it doesn't travel as one big chunk. It gets broken into small **packets** (typically 1,000-1,500 bytes each).

Each packet contains:
1. **Header** -- source IP, destination IP, packet number
2. **Payload** -- the actual data
3. **Trailer** -- error-checking information

Packets can take different routes and arrive out of order. The receiving device reassembles them.

\`\`\`mermaid
graph LR
    S["Source
192.168.1.1"] -->|"Pkt 1"| RA["Router A"]
    S -->|"Pkt 2"| RB["Router B"]
    RA -->|"Pkt 1"| RC["Router C"]
    RB -->|"Pkt 2"| RC
    RC -->|"Pkt 1, 2"| D["Destination
142.250.80.68"]
\`\`\`

Packets may travel different paths through the network. Routers forward each packet independently toward the destination, where they are reassembled in order.

### Analogy: Packets Are Like Sending a Book by Mail

Imagine mailing a book one page at a time in separate envelopes. Each envelope has the page number, your address, and the destination. Even if they arrive out of order, the recipient can reassemble the book.

<!-- voice:section_check -->

### Deeper Reading
- Khan Academy: "How the Internet Works"
- Vint Cerf's TED talk on Internet history

### Reflection Questions
1. Why is data sent in packets instead of all at once?
2. What happens if a packet gets lost?
3. Why are we running out of IPv4 addresses?`,
    },
    {
      id: "ap-csp-protocols",
      slug: "internet-protocols",
      title: "Protocols: TCP/IP, HTTP, and DNS",
      content: `## Protocols: TCP/IP, HTTP, and DNS

A **protocol** is a set of rules that devices follow to communicate. Without protocols, devices would be like people speaking different languages.

### The TCP/IP Model (4 Layers)

<!-- voice:key_insight -->

| Layer | Name | Protocols | Job |
|-------|------|-----------|-----|
| 4 | Application | HTTP, HTTPS, SMTP | What the user sees (web pages, email) |
| 3 | Transport | TCP, UDP | Reliable delivery, packet ordering |
| 2 | Internet | IP | Addressing and routing |
| 1 | Network Access | Ethernet, Wi-Fi | Physical transmission |

**TCP (Transmission Control Protocol)** ensures reliable delivery:
1. Establishes a connection (3-way handshake)
2. Numbers every packet
3. Receiver confirms each packet received
4. Missing packets are resent

**UDP (User Datagram Protocol)** is faster but less reliable:
- No confirmation that packets arrived
- Used for video calls, gaming, streaming (where speed matters more than perfection)

### DNS: The Internet's Phone Book

When you type \`www.google.com\`, your browser doesn't know where to send the request. It asks a **DNS server** to translate the name into an IP address:

\`www.google.com\` -> \`142.250.80.68\`

### HTTP and HTTPS

**HTTP** (HyperText Transfer Protocol) is how browsers request and receive web pages:
- \`GET /index.html\` -- "Send me this page"
- \`POST /login\` -- "Here's my username and password"

**HTTPS** adds encryption (the "S" stands for Secure). Your bank uses HTTPS so nobody can intercept your password.

### Real-World Connection

When you load a webpage, dozens of protocols work together in milliseconds: DNS looks up the address, TCP establishes a connection, HTTP requests the page, and your browser renders the result.

### Deeper Reading
- AP CSP: Big Idea 6 -- The Internet
- *Tubes: A Journey to the Center of the Internet* by Andrew Blum

### Reflection Questions
1. Why would a video streaming service use UDP instead of TCP?
2. What would happen if DNS servers went down?
3. Why is HTTPS important for online shopping?`,
    },
    {
      id: "ap-csp-encryption-intro",
      slug: "encryption-intro",
      title: "Simple Encryption: The Caesar Cipher",
      content: `## Simple Encryption: The Caesar Cipher

**Encryption** transforms readable data (plaintext) into scrambled data (ciphertext) so that only authorized people can read it. It is fundamental to Internet security.

### The Caesar Cipher

One of the oldest encryption methods, used by Julius Caesar to send military messages. It works by **shifting** each letter in the alphabet by a fixed number:

With a shift of 3:
- A -> D
- B -> E
- HELLO -> KHOOR

To decrypt, shift back by the same number.

<!-- voice:key_insight -->

### Why the Caesar Cipher Is Weak

There are only 25 possible shifts (26 letters - 1), so an attacker can simply try all 25 and see which produces readable English. This is called a **brute force attack**.

### Modern Encryption Preview

Real encryption algorithms like **AES** use keys that are 128 or 256 bits long. A 256-bit key has 2^256 possible values -- more than the number of atoms in the observable universe. Brute force is not an option.

### Analogy: Encryption Is Like a Lock and Key

Plaintext is like a message in an unlocked box. Encryption locks the box. Only someone with the right key (the decryption key) can open it.

### Your Task

Implement a Caesar cipher in Python.`,
      starterCode: `def caesar_encrypt(text, shift):
    """Encrypt text using Caesar cipher with the given shift.

    Only shift letters (a-z, A-Z). Leave other characters unchanged.
    Example: caesar_encrypt('Hello', 3) should return 'Khoor'
    """
    # TODO: Shift each letter by 'shift' positions, wrapping around the alphabet
    pass

def caesar_decrypt(text, shift):
    """Decrypt text that was encrypted with the given shift.

    Example: caesar_decrypt('Khoor', 3) should return 'Hello'
    """
    # TODO: Shift in the opposite direction
    pass

def brute_force_caesar(ciphertext):
    """Try all 25 possible shifts and print each result.

    This demonstrates why Caesar cipher is insecure.
    """
    # TODO: Loop through shifts 1-25 and print each decryption
    pass

# Tests
print(caesar_encrypt("Hello World", 3))     # Expected: Khoor Zruog
print(caesar_decrypt("Khoor Zruog", 3))     # Expected: Hello World
print(caesar_encrypt("abc xyz", 1))          # Expected: bcd yza
print("--- Brute Force ---")
brute_force_caesar("Lipps Asvph")            # Should reveal 'Hello World' at shift 4
`,
      solutionCode: `def caesar_encrypt(text, shift):
    """Encrypt text using Caesar cipher with the given shift."""
    result = []
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted = (ord(char) - base + shift) % 26 + base
            result.append(chr(shifted))
        else:
            result.append(char)
    return ''.join(result)

def caesar_decrypt(text, shift):
    """Decrypt text that was encrypted with the given shift."""
    return caesar_encrypt(text, -shift)

def brute_force_caesar(ciphertext):
    """Try all 25 possible shifts and print each result."""
    for shift in range(1, 26):
        decrypted = caesar_decrypt(ciphertext, shift)
        print(f"Shift {shift:2d}: {decrypted}")

# Tests
print(caesar_encrypt("Hello World", 3))     # Expected: Khoor Zruog
print(caesar_decrypt("Khoor Zruog", 3))     # Expected: Hello World
print(caesar_encrypt("abc xyz", 1))          # Expected: bcd yza
print("--- Brute Force ---")
brute_force_caesar("Lipps Asvph")            # Should reveal 'Hello World' at shift 4
`,
    },
    {
      id: "ap-csp-internet-checkpoint",
      slug: "internet-checkpoint",
      title: "Checkpoint: The Internet",
      content: `## Checkpoint: The Internet

Nice job finishing the Internet module! Let's make sure the key concepts stuck.

<!-- voice:section_check -->

### Question 1
What is the purpose of DNS?

<details>
<summary>Show Answer</summary>

DNS (Domain Name System) translates human-readable domain names (like \`www.google.com\`) into IP addresses (like \`142.250.80.68\`) that computers use to route data.
</details>

### Question 2
Explain the difference between TCP and UDP. When would you use each?

<details>
<summary>Show Answer</summary>

**TCP** guarantees reliable, ordered delivery by confirming packets. Use it for web pages, email, file transfers. **UDP** skips confirmations for speed. Use it for live video, gaming, and streaming where a lost packet is better than a delayed one.
</details>

### Question 3
A message is encrypted using a Caesar cipher with shift 7. The ciphertext is "Olssv". What is the plaintext?

<details>
<summary>Show Answer</summary>

Shift each letter back by 7: O->H, l->e, s->l, s->l, v->o = **"Hello"**
</details>

### Question 4
Why is data transmitted in packets rather than as one continuous stream?

<details>
<summary>Show Answer</summary>

Packets allow: (1) multiple routes so no single path gets overloaded, (2) only lost packets need to be resent rather than the entire message, and (3) multiple users can share network resources fairly.
</details>

### Question 5
Why is HTTPS more secure than HTTP?

<details>
<summary>Show Answer</summary>

HTTPS encrypts the data between your browser and the server using TLS/SSL, so attackers who intercept the traffic cannot read it. HTTP sends data as plaintext.
</details>

### Keep Going!
You now understand how data travels across the globe. Next, you will start writing your own programs in Python!`,
    },
  ],
};
