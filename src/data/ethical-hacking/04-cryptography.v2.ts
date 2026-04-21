import { Module } from "../types";

export const cryptographyModule: Module = {
  id: "eh-cryptography",
  title: "Cryptography Basics",
  description: "Understand symmetric and asymmetric encryption, hashing, digital signatures, and how cryptography protects data. Implement classic ciphers and modern hashing from scratch.",
  lessons: [
    {
      id: "eh-crypto-fundamentals",
      slug: "cryptography-fundamentals",
      title: "Cryptography Fundamentals",
      content: `## Cryptography Fundamentals

<!-- voice:section_check -->

Cryptography is the mathematical backbone of information security. It provides confidentiality, integrity, authentication, and non-repudiation.

### Symmetric Encryption

One key encrypts and decrypts. Both parties must share the same secret key.

\`\`\`
Plaintext  --[encrypt with key]--> Ciphertext --[decrypt with key]--> Plaintext
\`\`\`

**AES (Advanced Encryption Standard)**: The gold standard since 2001. Uses 128, 192, or 256-bit keys. Used in HTTPS, file encryption, VPNs, and disk encryption.

Problem: How do you securely share the key? If you already had a secure channel, you would not need encryption.

### Asymmetric Encryption (Public Key)

Two mathematically related keys: a **public key** (shared openly) and a **private key** (kept secret).

\`\`\`
Encrypt with public key  -> Only private key can decrypt
Sign with private key    -> Anyone with public key can verify
\`\`\`

**RSA**: Based on the difficulty of factoring large prime numbers. Used for key exchange and digital signatures.

<!-- voice:key_insight -->

### Hashing

A hash function maps any input to a fixed-size output (digest). Properties:

| Property | Description |
|----------|-------------|
| **Deterministic** | Same input always produces same output |
| **One-way** | Cannot reverse a hash to find the input |
| **Avalanche** | Tiny input change -> completely different output |
| **Collision-resistant** | Hard to find two inputs with the same hash |

Common hash functions:
- **SHA-256**: 256-bit output, used in blockchain, TLS, data integrity
- **bcrypt/scrypt/Argon2**: Designed for password hashing (intentionally slow)
- **MD5/SHA-1**: Broken — do not use for security (collisions found)

### Password Storage

**Never store passwords in plaintext.** The correct approach:

\`\`\`
password + random_salt -> hash_function -> stored_hash
\`\`\`

- **Salt**: Random value added to each password before hashing. Prevents rainbow table attacks.
- **Key stretching**: Apply the hash function thousands of times (bcrypt uses a cost factor) to make brute-force expensive.

### Digital Signatures

Combine hashing and asymmetric encryption:

1. Hash the message -> digest
2. Encrypt the digest with your private key -> signature
3. Anyone can verify by decrypting with your public key and comparing hashes

This proves: the message came from you (authentication) and has not been modified (integrity).

### Key Takeaway

Symmetric encryption is fast but requires key sharing. Asymmetric encryption solves key exchange but is slower. In practice, HTTPS uses asymmetric crypto to exchange a symmetric key, then uses symmetric crypto for the session. Passwords must be stored as salted, slow hashes — never plaintext.

### Reflection Questions

- Why is MD5 considered broken for security purposes even though it still produces a hash?
- Why do password hash functions like bcrypt intentionally slow down the hashing process?`,
    },
    {
      id: "eh-caesar-cipher-exercise",
      slug: "caesar-cipher-exercise",
      title: "Exercise: Caesar Cipher & Password Hashing",
      content: `## Exercise: Caesar Cipher & Password Hashing

Implement the classic Caesar cipher (shift cipher) and a basic password hashing system. These exercises illustrate fundamental cryptographic concepts.

### Caesar Cipher

The Caesar cipher shifts each letter by a fixed number of positions:
- Shift 3: A->D, B->E, ..., X->A, Y->B, Z->C
- To decrypt, shift in the opposite direction

### Password Hashing

Modern password storage uses:
1. Generate a random salt
2. Combine password + salt
3. Hash the combination (we will use SHA-256 for demonstration)
4. Store the salt and hash together

### Hints

- Use \`ord()\` and \`chr()\` to convert between characters and ASCII values
- Handle uppercase and lowercase separately; leave non-letters unchanged
- Use Python's \`hashlib\` for SHA-256 and \`os.urandom()\` for salt generation`,
      starterCode: `import hashlib
import os

def caesar_encrypt(plaintext, shift):
    """Encrypt plaintext using Caesar cipher.

    Args:
        plaintext: string to encrypt
        shift: number of positions to shift (positive = right)
    Returns:
        str: encrypted text
    """
    result = []
    for char in plaintext:
        if char.isalpha():
            # TODO: Determine base (ord('A') or ord('a'))
            # TODO: Shift the character, wrapping around with modulo 26
            # TODO: Append shifted character
            pass
        else:
            result.append(char)
    return ''.join(result)

def caesar_decrypt(ciphertext, shift):
    """Decrypt ciphertext by shifting in the opposite direction.

    Args:
        ciphertext: encrypted string
        shift: the shift used during encryption
    Returns:
        str: decrypted text
    """
    # TODO: Decrypt by encrypting with negative shift
    pass

def caesar_brute_force(ciphertext):
    """Try all 26 possible shifts to crack a Caesar cipher.

    Args:
        ciphertext: encrypted string
    Returns:
        list of tuples: [(shift, decrypted_text), ...]
    """
    # TODO: Try shifts 0-25 and return all possibilities
    pass

def hash_password(password):
    """Hash a password with a random salt using SHA-256.

    Args:
        password: plaintext password string
    Returns:
        tuple: (salt_hex, hash_hex)
    """
    # TODO: Generate 16 bytes of random salt
    # TODO: Combine salt + password bytes
    # TODO: Hash with SHA-256
    # TODO: Return (salt_hex, hash_hex)
    pass

def verify_password(password, salt_hex, hash_hex):
    """Verify a password against a stored salt and hash.

    Args:
        password: plaintext password to verify
        salt_hex: hex-encoded salt
        hash_hex: hex-encoded hash
    Returns:
        bool: True if password matches
    """
    # TODO: Recreate the hash from password + salt
    # TODO: Compare with stored hash
    pass

# Test cases
print("=== Caesar Cipher ===")
encrypted = caesar_encrypt("Hello World", 3)
print(f"Encrypt 'Hello World' shift 3: {encrypted}")
# Expected: Khoor Zruog

decrypted = caesar_decrypt(encrypted, 3)
print(f"Decrypt back: {decrypted}")
# Expected: Hello World

print(f"\\nBrute force 'Khoor':")
results = caesar_brute_force("Khoor")
for shift, text in results[:5]:
    print(f"  Shift {shift}: {text}")

print("\\n=== Password Hashing ===")
salt, hashed = hash_password("mypassword123")
print(f"Salt: {salt[:16]}...")
print(f"Hash: {hashed[:16]}...")

print(f"Verify correct password: {verify_password('mypassword123', salt, hashed)}")
# Expected: True

print(f"Verify wrong password: {verify_password('wrongpassword', salt, hashed)}")
# Expected: False

# Demonstrate salt uniqueness
salt2, hashed2 = hash_password("mypassword123")
print(f"Same password, different salt: {salt != salt2}")
# Expected: True
print(f"Same password, different hash: {hashed != hashed2}")
# Expected: True`,
      solutionCode: `import hashlib
import os

def caesar_encrypt(plaintext, shift):
    """Encrypt plaintext using Caesar cipher."""
    result = []
    for char in plaintext:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            shifted = (ord(char) - base + shift) % 26 + base
            result.append(chr(shifted))
        else:
            result.append(char)
    return ''.join(result)

def caesar_decrypt(ciphertext, shift):
    """Decrypt ciphertext by shifting in the opposite direction."""
    return caesar_encrypt(ciphertext, -shift)

def caesar_brute_force(ciphertext):
    """Try all 26 possible shifts to crack a Caesar cipher."""
    results = []
    for shift in range(26):
        decrypted = caesar_decrypt(ciphertext, shift)
        results.append((shift, decrypted))
    return results

def hash_password(password):
    """Hash a password with a random salt using SHA-256."""
    salt = os.urandom(16)
    combined = salt + password.encode('utf-8')
    hashed = hashlib.sha256(combined).hexdigest()
    return (salt.hex(), hashed)

def verify_password(password, salt_hex, hash_hex):
    """Verify a password against a stored salt and hash."""
    salt = bytes.fromhex(salt_hex)
    combined = salt + password.encode('utf-8')
    computed_hash = hashlib.sha256(combined).hexdigest()
    return computed_hash == hash_hex

# Time complexity: Caesar O(n), Brute force O(26n), Hash O(n)
# Space complexity: O(n) for result strings

# Test cases
print("=== Caesar Cipher ===")
encrypted = caesar_encrypt("Hello World", 3)
print(f"Encrypt 'Hello World' shift 3: {encrypted}")
# Expected: Khoor Zruog

decrypted = caesar_decrypt(encrypted, 3)
print(f"Decrypt back: {decrypted}")
# Expected: Hello World

print(f"\\nBrute force 'Khoor':")
results = caesar_brute_force("Khoor")
for shift, text in results[:5]:
    print(f"  Shift {shift}: {text}")

print("\\n=== Password Hashing ===")
salt, hashed = hash_password("mypassword123")
print(f"Salt: {salt[:16]}...")
print(f"Hash: {hashed[:16]}...")

print(f"Verify correct password: {verify_password('mypassword123', salt, hashed)}")
# Expected: True

print(f"Verify wrong password: {verify_password('wrongpassword', salt, hashed)}")
# Expected: False

# Demonstrate salt uniqueness
salt2, hashed2 = hash_password("mypassword123")
print(f"Same password, different salt: {salt != salt2}")
# Expected: True
print(f"Same password, different hash: {hashed != hashed2}")
# Expected: True`,
    },
    {
      id: "eh-crypto-checkpoint",
      slug: "cryptography-checkpoint",
      title: "Checkpoint: Cryptography",
      content: `## Checkpoint: Cryptography

<!-- voice:section_check -->

Test your understanding of cryptographic concepts.

---

### Question 1
Why is AES (symmetric encryption) used for bulk data encryption instead of RSA (asymmetric)?

A) AES is more secure
B) AES is orders of magnitude faster for encrypting/decrypting large amounts of data
C) RSA cannot encrypt data
D) AES keys are easier to distribute

**Answer: B** — Symmetric encryption is roughly 1000x faster than asymmetric encryption. In practice (e.g., HTTPS), RSA/ECDH is used to exchange a symmetric key, then AES encrypts the session data.

---

### Question 2
A password database is breached. The passwords were stored as unsalted SHA-256 hashes. Why is this vulnerable?

A) SHA-256 is broken
B) An attacker can use precomputed rainbow tables to look up common passwords instantly
C) The hashes can be reversed mathematically
D) SHA-256 produces hashes that are too short

**Answer: B** — Without salts, identical passwords produce identical hashes. Precomputed rainbow tables map common password hashes to their plaintext. Salting ensures each password has a unique hash, making rainbow tables useless.

---

### Question 3
What does a digital signature prove?

A) The message is encrypted and confidential
B) The message came from the claimed sender (authentication) and has not been modified (integrity)
C) The message was received by the intended recipient
D) The message is original and has never been sent before

**Answer: B** — A digital signature is created by hashing the message and encrypting the hash with the sender's private key. Anyone can verify it with the sender's public key, proving both who sent it and that the content is unmodified.

---

### Question 4
The Caesar cipher with shift 3 encrypts "A" as "D". How many unique keys does a Caesar cipher have?

A) 3
B) 13
C) 25
D) 26

**Answer: C** — There are 25 meaningful shifts (1-25). Shift 0 produces no change, and shift 26 is the same as shift 0. This tiny key space makes the Caesar cipher trivially breakable by brute force — try all 25 shifts.

---

### Question 5
Why do modern password hash functions like bcrypt intentionally run slowly?

A) They are poorly implemented
B) Slower hashing makes brute-force attacks computationally expensive, taking years instead of hours
C) They need to encrypt the password, which takes time
D) They are designed for large files, not passwords

**Answer: B** — A fast hash like SHA-256 can compute billions of hashes per second on a GPU, making brute-force feasible. bcrypt/scrypt/Argon2 are designed to be slow (adjustable via cost factor), so each guess takes much longer, making brute-force impractical.`,
    },
  ],
};
