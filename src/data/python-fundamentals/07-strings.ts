import { Module } from "../types";

export const stringsModule: Module = {
  id: "strings",
  title: "String Methods & Formatting",
  description:
    "Deep dive into string methods, f-string formatting, slicing techniques, and text processing.",
  lessons: [
    {
      id: "strings-intro",
      slug: "string-methods-intro",
      title: "String Methods Deep Dive",
      content: `## String Methods — A Deeper Look

You have already used basic string operations. Now let's explore the full toolkit Python gives you for text processing.

### Searching and Testing

\`\`\`python
s = "Hello, World!"

s.startswith("Hello")    # True
s.endswith("!")           # True
s.find("World")          # 7 (index where found)
s.find("Python")         # -1 (not found)
s.count("l")             # 3
\`\`\`

### Checking String Content

| Method | Purpose | Example |
|--------|---------|---------|
| \`s.isalpha()\` | All letters? | \`"hello".isalpha()\` -> True |
| \`s.isdigit()\` | All digits? | \`"123".isdigit()\` -> True |
| \`s.isalnum()\` | All alphanumeric? | \`"abc123".isalnum()\` -> True |
| \`s.isspace()\` | All whitespace? | \`"  ".isspace()\` -> True |
| \`s.isupper()\` | All uppercase? | \`"ABC".isupper()\` -> True |
| \`s.islower()\` | All lowercase? | \`"abc".islower()\` -> True |

### Splitting and Joining

\`\`\`python
"a,b,c".split(",")          # ["a", "b", "c"]
" hello  world ".split()    # ["hello", "world"]
"-".join(["a", "b", "c"])   # "a-b-c"
\`\`\`

### Case Transformations

\`\`\`python
"hello world".title()      # "Hello World"
"hello world".capitalize() # "Hello world"
"Hello".swapcase()         # "hELLO"
\`\`\`

### Padding and Alignment

\`\`\`python
"42".zfill(5)              # "00042"
"hi".ljust(10)             # "hi        "
"hi".rjust(10)             # "        hi"
"hi".center(10)            # "    hi    "
\`\`\`

### F-String Formatting

\`\`\`python
pi = 3.14159
f"{pi:.2f}"       # "3.14" (2 decimal places)
f"{42:05d}"       # "00042" (zero-padded)
f"{1000000:,}"    # "1,000,000" (comma separator)
f"{'hi':>10}"     # "        hi" (right-aligned)
\`\`\`

Strings are immutable in Python — every method returns a **new** string.`,
    },
    {
      id: "strings-caesar",
      slug: "caesar-cipher",
      title: "Caesar Cipher",
      content: `## Caesar Cipher

The Caesar Cipher is one of the oldest encryption techniques. It works by shifting each letter in the text by a fixed number of positions in the alphabet.

### How It Works

With a shift of 3:
- A -> D, B -> E, C -> F, ..., X -> A, Y -> B, Z -> C

### Example

\`\`\`
encrypt("HELLO", 3) -> "KHOOR"
decrypt("KHOOR", 3) -> "HELLO"
\`\`\`

### Hints

- Use \`ord()\` to get the ASCII code of a character
- Use \`chr()\` to convert an ASCII code back to a character
- \`ord('A')\` = 65, \`ord('a')\` = 97
- Use modulo (\`% 26\`) to wrap around the alphabet
- Non-letter characters should stay unchanged`,
      starterCode: `def caesar_encrypt(text, shift):
    """Encrypt text using Caesar cipher with the given shift.
    Preserve case. Non-letter characters stay unchanged."""
    # TODO: Loop through each character
    # If it's a letter, shift it by 'shift' positions
    # Use modulo to wrap around the alphabet
    pass

def caesar_decrypt(text, shift):
    """Decrypt Caesar cipher text by shifting in the opposite direction."""
    # TODO: Decrypt is just encrypting with negative shift
    pass

def brute_force_caesar(ciphertext):
    """Try all 26 possible shifts and return a list of
    (shift, decrypted_text) tuples."""
    # TODO: Try shifts 0-25 and collect results
    pass

# Test cases
print(caesar_encrypt("HELLO", 3))
# Expected: KHOOR

print(caesar_encrypt("Hello, World!", 5))
# Expected: Mjqqt, Btwqi!

print(caesar_encrypt("xyz", 3))
# Expected: abc

print(caesar_decrypt("KHOOR", 3))
# Expected: HELLO

print(caesar_decrypt("Mjqqt, Btwqi!", 5))
# Expected: Hello, World!

results = brute_force_caesar("Khoor")
print(results[3])
# Expected: (3, 'Hello')

print(results[0])
# Expected: (0, 'Khoor')`,
      solutionCode: `def caesar_encrypt(text, shift):
    """Encrypt text using Caesar cipher with the given shift.
    Preserve case. Non-letter characters stay unchanged."""
    result = ""
    for ch in text:
        if ch.isalpha():
            base = ord('A') if ch.isupper() else ord('a')
            shifted = (ord(ch) - base + shift) % 26 + base
            result += chr(shifted)
        else:
            result += ch
    return result

def caesar_decrypt(text, shift):
    """Decrypt Caesar cipher text by shifting in the opposite direction."""
    return caesar_encrypt(text, -shift)

def brute_force_caesar(ciphertext):
    """Try all 26 possible shifts and return a list of
    (shift, decrypted_text) tuples."""
    results = []
    for shift in range(26):
        decrypted = caesar_decrypt(ciphertext, shift)
        results.append((shift, decrypted))
    return results

# Test cases
print(caesar_encrypt("HELLO", 3))
# Expected: KHOOR

print(caesar_encrypt("Hello, World!", 5))
# Expected: Mjqqt, Btwqi!

print(caesar_encrypt("xyz", 3))
# Expected: abc

print(caesar_decrypt("KHOOR", 3))
# Expected: HELLO

print(caesar_decrypt("Mjqqt, Btwqi!", 5))
# Expected: Hello, World!

results = brute_force_caesar("Khoor")
print(results[3])
# Expected: (3, 'Hello')

print(results[0])
# Expected: (0, 'Khoor')`,
    },
    {
      id: "strings-email-validator",
      slug: "email-validator",
      title: "Email Validator",
      content: `## Email Validator

Build a function that validates email addresses by checking their format. This is a simplified validator — real email validation is surprisingly complex!

### Rules to Check

1. Must contain exactly one \`@\` symbol
2. The part before \`@\` (local part) must not be empty
3. The part after \`@\` (domain) must contain at least one \`.\`
4. The domain must not start or end with \`.\`
5. No consecutive dots (\`..\`) in the domain
6. Local part can contain letters, digits, dots, underscores, hyphens

### Hints

- Use \`.count()\` to check how many \`@\` symbols exist
- Use \`.split("@")\` to separate local and domain parts
- Use string methods like \`.isalnum()\` for character checks`,
      starterCode: `def is_valid_email(email):
    """Validate an email address. Return True if valid, False otherwise.
    Rules:
    1. Exactly one @ symbol
    2. Local part (before @) is not empty
    3. Domain (after @) contains at least one dot
    4. Domain doesn't start or end with a dot
    5. No consecutive dots in domain
    6. Local part contains only letters, digits, dots, underscores, hyphens
    """
    # TODO: Check each rule step by step
    pass

def extract_domain(email):
    """Extract the domain from a valid email address.
    Return None if the email is invalid."""
    # TODO: Validate first, then extract
    pass

def mask_email(email):
    """Mask an email address for privacy.
    Show first 2 chars of local part, then ***, then @domain.
    Example: 'john.doe@example.com' -> 'jo***@example.com'
    If local part is 1 char, show 1 char + ***."""
    # TODO: Split at @, mask the local part
    pass

# Test cases
print(is_valid_email("user@example.com"))
# Expected: True

print(is_valid_email("user.name@domain.co.uk"))
# Expected: True

print(is_valid_email("user@domain"))
# Expected: False (no dot in domain)

print(is_valid_email("@domain.com"))
# Expected: False (empty local part)

print(is_valid_email("user@@domain.com"))
# Expected: False (two @ symbols)

print(is_valid_email("user@.domain.com"))
# Expected: False (domain starts with dot)

print(is_valid_email("user@domain..com"))
# Expected: False (consecutive dots)

print(is_valid_email("us er@domain.com"))
# Expected: False (space in local part)

print(extract_domain("user@example.com"))
# Expected: example.com

print(extract_domain("invalid"))
# Expected: None

print(mask_email("john.doe@example.com"))
# Expected: jo***@example.com

print(mask_email("a@example.com"))
# Expected: a***@example.com`,
      solutionCode: `def is_valid_email(email):
    """Validate an email address. Return True if valid, False otherwise."""
    # Rule 1: Exactly one @
    if email.count("@") != 1:
        return False

    local, domain = email.split("@")

    # Rule 2: Local part not empty
    if len(local) == 0:
        return False

    # Rule 6: Local part contains only valid characters
    valid_local_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-"
    for ch in local:
        if ch not in valid_local_chars:
            return False

    # Rule 3: Domain contains at least one dot
    if "." not in domain:
        return False

    # Rule 4: Domain doesn't start or end with dot
    if domain.startswith(".") or domain.endswith("."):
        return False

    # Rule 5: No consecutive dots in domain
    if ".." in domain:
        return False

    return True

def extract_domain(email):
    """Extract the domain from a valid email address.
    Return None if the email is invalid."""
    if not is_valid_email(email):
        return None
    return email.split("@")[1]

def mask_email(email):
    """Mask an email address for privacy.
    Show first 2 chars of local part, then ***, then @domain."""
    parts = email.split("@")
    local = parts[0]
    domain = parts[1]
    if len(local) <= 2:
        masked = local + "***"
    else:
        masked = local[:2] + "***"
    return masked + "@" + domain

# Test cases
print(is_valid_email("user@example.com"))
# Expected: True

print(is_valid_email("user.name@domain.co.uk"))
# Expected: True

print(is_valid_email("user@domain"))
# Expected: False (no dot in domain)

print(is_valid_email("@domain.com"))
# Expected: False (empty local part)

print(is_valid_email("user@@domain.com"))
# Expected: False (two @ symbols)

print(is_valid_email("user@.domain.com"))
# Expected: False (domain starts with dot)

print(is_valid_email("user@domain..com"))
# Expected: False (consecutive dots)

print(is_valid_email("us er@domain.com"))
# Expected: False (space in local part)

print(extract_domain("user@example.com"))
# Expected: example.com

print(extract_domain("invalid"))
# Expected: None

print(mask_email("john.doe@example.com"))
# Expected: jo***@example.com

print(mask_email("a@example.com"))
# Expected: a***@example.com`,
    },
    {
      id: "strings-text-analyzer",
      slug: "text-analyzer",
      title: "Text Analyzer",
      content: `## Text Analyzer

Build a comprehensive text analysis tool that reports statistics about a given piece of text.

### Features to Implement

- Word count
- Character count (with and without spaces)
- Sentence count
- Average word length
- Longest word
- Most common word

### Hints

- Sentences can end with \`.\`, \`!\`, or \`?\`
- Use \`.split()\` for words (handles multiple spaces)
- Clean punctuation before analyzing words
- Remember to handle edge cases (empty strings, single words)`,
      starterCode: `def analyze_text(text):
    """Return a dictionary with text statistics:
    - 'word_count': number of words
    - 'char_count': total characters (including spaces)
    - 'char_count_no_spaces': characters without spaces
    - 'sentence_count': number of sentences (end with . ! or ?)
    - 'avg_word_length': average word length (rounded to 2)
    - 'longest_word': the longest word (lowercase, no punctuation)
    """
    # TODO: Calculate all the statistics
    pass

def find_and_replace(text, find, replace, case_sensitive=True):
    """Find and replace text. Support case-insensitive mode.
    Return (new_text, count_of_replacements)."""
    # TODO: Handle both case-sensitive and case-insensitive replacement
    pass

def title_case(text):
    """Convert text to title case, but keep small words
    (a, an, the, in, on, at, to, for, of, and, but, or)
    lowercase unless they are the first word."""
    # TODO: Split into words, capitalize appropriately
    pass

# Test cases
result = analyze_text("Hello world. How are you? I am fine!")
print(result)
# Expected: {'word_count': 8, 'char_count': 36, 'char_count_no_spaces': 29, 'sentence_count': 3, 'avg_word_length': 3.25, 'longest_word': 'hello'}

result2 = analyze_text("Python is great")
print(result2["word_count"])
# Expected: 3
print(result2["sentence_count"])
# Expected: 0

new_text, count = find_and_replace("Hello hello HELLO", "hello", "hi", case_sensitive=True)
print(new_text, count)
# Expected: Hello hi HELLO 1

new_text, count = find_and_replace("Hello hello HELLO", "hello", "hi", case_sensitive=False)
print(new_text, count)
# Expected: hi hi hi 3

print(title_case("the lord of the rings"))
# Expected: The Lord of the Rings

print(title_case("a tale of two cities"))
# Expected: A Tale of Two Cities`,
      solutionCode: `def analyze_text(text):
    """Return a dictionary with text statistics."""
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    char_count_no_spaces = len(text.replace(" ", ""))

    sentence_count = 0
    for ch in text:
        if ch in ".!?":
            sentence_count += 1

    # Clean words for analysis (remove punctuation)
    clean_words = []
    for word in words:
        cleaned = ""
        for ch in word.lower():
            if ch.isalnum():
                cleaned += ch
        if cleaned:
            clean_words.append(cleaned)

    avg_word_length = 0.0
    longest_word = ""
    if clean_words:
        total_length = sum(len(w) for w in clean_words)
        avg_word_length = round(total_length / len(clean_words), 2)
        longest_word = max(clean_words, key=len)

    return {
        'word_count': word_count,
        'char_count': char_count,
        'char_count_no_spaces': char_count_no_spaces,
        'sentence_count': sentence_count,
        'avg_word_length': avg_word_length,
        'longest_word': longest_word,
    }

def find_and_replace(text, find, replace, case_sensitive=True):
    """Find and replace text. Support case-insensitive mode.
    Return (new_text, count_of_replacements)."""
    if case_sensitive:
        count = text.count(find)
        new_text = text.replace(find, replace)
    else:
        count = text.lower().count(find.lower())
        # Case-insensitive replace
        new_text = ""
        i = 0
        while i < len(text):
            if text[i:i+len(find)].lower() == find.lower():
                new_text += replace
                i += len(find)
            else:
                new_text += text[i]
                i += 1
    return new_text, count

def title_case(text):
    """Convert text to title case, but keep small words lowercase
    unless they are the first word."""
    small_words = {"a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "but", "or"}
    words = text.split()
    result = []
    for i, word in enumerate(words):
        if i == 0 or word.lower() not in small_words:
            result.append(word.capitalize())
        else:
            result.append(word.lower())
    return " ".join(result)

# Test cases
result = analyze_text("Hello world. How are you? I am fine!")
print(result)
# Expected: {'word_count': 8, 'char_count': 36, 'char_count_no_spaces': 29, 'sentence_count': 3, 'avg_word_length': 3.25, 'longest_word': 'hello'}

result2 = analyze_text("Python is great")
print(result2["word_count"])
# Expected: 3
print(result2["sentence_count"])
# Expected: 0

new_text, count = find_and_replace("Hello hello HELLO", "hello", "hi", case_sensitive=True)
print(new_text, count)
# Expected: Hello hi HELLO 1

new_text, count = find_and_replace("Hello hello HELLO", "hello", "hi", case_sensitive=False)
print(new_text, count)
# Expected: hi hi hi 3

print(title_case("the lord of the rings"))
# Expected: The Lord of the Rings

print(title_case("a tale of two cities"))
# Expected: A Tale of Two Cities`,
    },
  ],
};
