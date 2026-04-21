import { Module } from "../types";

export const digitalInformationModule: Module = {
  id: "ap-csp-digital-info",
  title: "Digital Information",
  description: "Understand how computers represent data using binary, and explore how numbers, text, images, and sound are encoded digitally.",
  lessons: [
    {
      id: "ap-csp-binary-basics",
      slug: "binary-basics",
      title: "Binary: The Language of Computers",
      content: `## Binary: The Language of Computers

<!-- voice:key_insight -->

Every piece of data inside your computer -- every photo, song, text message, and video game -- is stored as a sequence of **0s and 1s**. This system is called **binary**, and it is the foundation of all computing.

### Why Binary?

Computers are built from tiny electronic switches called **transistors**. Each transistor can be in one of two states:

- **Off** = 0
- **On** = 1

Each 0 or 1 is called a **bit** (short for "binary digit"). A single bit is not very useful on its own, but when you combine many bits, you can represent anything.

| Unit | Bits | Example |
|------|------|---------|
| 1 bit | 1 | A single yes/no answer |
| 1 byte | 8 | A single character like "A" |
| 1 kilobyte (KB) | ~8,000 | A short email |
| 1 megabyte (MB) | ~8,000,000 | A high-res photo |
| 1 gigabyte (GB) | ~8,000,000,000 | A movie |

### How Binary Counting Works

In decimal (base 10), each position is a power of 10. In binary (base 2), each position is a power of 2:

\`\`\`
Position:  128  64  32  16   8   4   2   1
Binary:      0   1   0   1   0   1   1   0
\`\`\`

To convert binary to decimal, add up the positions where there is a 1:
\`64 + 16 + 4 + 2 = 86\`

So \`01010110\` in binary = **86** in decimal.

\`\`\`mermaid
graph LR
    B["Binary: 01010110"] --> P["Positional Values"]
    P --> P1["0x128=0"]
    P --> P2["1x64=64"]
    P --> P3["0x32=0"]
    P --> P4["1x16=16"]
    P --> P5["0x8=0"]
    P --> P6["1x4=4"]
    P --> P7["1x2=2"]
    P --> P8["0x1=0"]
    P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 --> S["Sum = 86"]
\`\`\`

<!-- voice:section_check -->

### Real-World Connection

When you type a URL into your browser, the website address gets converted to a numeric IP address -- which is just a series of binary numbers that routers use to send your data to the right place.

### Deeper Reading
- *Code: The Hidden Language of Computer Hardware and Software* by Charles Petzold, Chapters 1-3
- Khan Academy: "Binary and Data" unit

### Reflection Questions
1. Why do computers use binary instead of decimal?
2. If you had 4 bits, what is the largest decimal number you could represent?
3. How many different values can 8 bits represent?`,
    },
    {
      id: "ap-csp-binary-conversion",
      slug: "binary-conversion",
      title: "Converting Between Binary and Decimal",
      content: `## Converting Between Binary and Decimal

Now that you understand binary, let's practice converting numbers back and forth. This is a core skill for the AP CSP exam.

### Decimal to Binary Algorithm

Think of it like making change with powers of 2. For the number 45:

1. What is the largest power of 2 that fits? **32** (2^5). Write a 1. Remainder: 45 - 32 = 13
2. Does 16 fit in 13? **No**. Write a 0.
3. Does 8 fit in 13? **Yes**. Write a 1. Remainder: 13 - 8 = 5
4. Does 4 fit in 5? **Yes**. Write a 1. Remainder: 5 - 4 = 1
5. Does 2 fit in 1? **No**. Write a 0.
6. Does 1 fit in 1? **Yes**. Write a 1. Remainder: 0.

Result: **101101**

### Binary to Decimal

Simply multiply each bit by its position value and add:

\`\`\`
1 0 1 1 0 1
32+0+8+4+0+1 = 45
\`\`\`

<!-- voice:key_insight -->

### Analogy: Binary Is Like a Light Switch Panel

Imagine a row of light switches on a wall, each labeled with a power of 2. To represent any number, you flip on the right combination of switches.

### Your Task

Write a program that converts between binary and decimal.`,
      starterCode: `def decimal_to_binary(n):
    """Convert a positive decimal integer to a binary string.

    Example: decimal_to_binary(45) should return '101101'
    """
    # TODO: Use repeated division by 2, collecting remainders
    pass

def binary_to_decimal(binary_str):
    """Convert a binary string to a decimal integer.

    Example: binary_to_decimal('101101') should return 45
    """
    # TODO: Multiply each bit by its position value and sum
    pass

def count_ones(binary_str):
    """Count the number of 1-bits in a binary string.

    Example: count_ones('101101') should return 4
    """
    # TODO: Count the '1' characters
    pass

# Tests
print(decimal_to_binary(45))     # Expected: 101101
print(decimal_to_binary(255))    # Expected: 11111111
print(binary_to_decimal('101101'))  # Expected: 45
print(binary_to_decimal('11111111'))  # Expected: 255
print(count_ones('101101'))      # Expected: 4
`,
      solutionCode: `def decimal_to_binary(n):
    """Convert a positive decimal integer to a binary string."""
    if n == 0:
        return '0'
    bits = []
    while n > 0:
        bits.append(str(n % 2))
        n = n // 2
    return ''.join(reversed(bits))

def binary_to_decimal(binary_str):
    """Convert a binary string to a decimal integer."""
    result = 0
    for i, bit in enumerate(reversed(binary_str)):
        result += int(bit) * (2 ** i)
    return result

def count_ones(binary_str):
    """Count the number of 1-bits in a binary string."""
    return binary_str.count('1')

# Tests
print(decimal_to_binary(45))     # Expected: 101101
print(decimal_to_binary(255))    # Expected: 11111111
print(binary_to_decimal('101101'))  # Expected: 45
print(binary_to_decimal('11111111'))  # Expected: 255
print(count_ones('101101'))      # Expected: 4
`,
    },
    {
      id: "ap-csp-data-representation",
      slug: "data-representation",
      title: "How Computers Represent Text, Images, and Sound",
      content: `## How Computers Represent Text, Images, and Sound

<!-- voice:key_insight -->

Everything in a computer is binary, but we experience text, images, and sound. How does the conversion happen?

### Text: ASCII and Unicode

Each character is assigned a number. The **ASCII** system uses 7 bits to represent 128 characters:

| Character | ASCII Code | Binary |
|-----------|-----------|--------|
| A | 65 | 1000001 |
| a | 97 | 1100001 |
| 0 | 48 | 0110000 |
| ! | 33 | 0100001 |

**Unicode** extends this to over 140,000 characters, covering every language in the world, plus emojis.

### Images: Pixels and Color

A digital image is a grid of tiny dots called **pixels**. Each pixel's color is stored as numbers:

- **RGB** (Red, Green, Blue): each value 0-255 (1 byte each, 3 bytes per pixel)
- Pure red = (255, 0, 0)
- White = (255, 255, 255)
- Black = (0, 0, 0)

A 1920x1080 image has about 2 million pixels, using roughly 6 MB uncompressed.

### Sound: Sampling

Sound is a continuous wave, but computers store it as a series of **samples** -- snapshots of the wave's height taken thousands of times per second.

- **Sample rate**: How many samples per second (CD quality = 44,100 Hz)
- **Bit depth**: How precisely each sample is measured (CD quality = 16 bits)

### Analogy: Sampling Is Like Flip-Book Animation

Just as a flip book creates the illusion of motion by showing many still images quickly, digital audio creates the illusion of continuous sound by playing many tiny samples quickly.

<!-- voice:section_check -->

### Deeper Reading
- Khan Academy: "Representing text, images, and sound"
- AP CSP reference: Big Idea 2 -- Data

### Reflection Questions
1. Why does a higher sample rate produce better quality audio?
2. How many bytes does it take to store one pixel in RGB?
3. Why was Unicode necessary beyond ASCII?`,
    },
    {
      id: "ap-csp-data-compression",
      slug: "data-compression",
      title: "Data Compression: Making Files Smaller",
      content: `## Data Compression: Making Files Smaller

When you send a photo over text or stream a song on Spotify, the files are **compressed** -- made smaller so they transfer faster and take up less storage.

### Lossless vs. Lossy Compression

<!-- voice:key_insight -->

There are two fundamentally different approaches:

**Lossless compression** makes files smaller without losing any data. When you decompress, you get back the exact original. Examples:
- ZIP files
- PNG images
- FLAC audio

**Lossy compression** throws away some data that humans are unlikely to notice. The original cannot be perfectly reconstructed. Examples:
- JPEG images (removes subtle color details)
- MP3 audio (removes frequencies humans can barely hear)
- MP4 video (blurs tiny details between frames)

### How Lossless Compression Works: Run-Length Encoding

Imagine you have the string: \`AAAAAABBBCC\`

Instead of storing 11 characters, you can store: \`6A3B2C\` -- only 6 characters! This is called **run-length encoding (RLE)**.

### The Tradeoff

| | Lossless | Lossy |
|---|----------|-------|
| Quality | Perfect | Slightly reduced |
| File size reduction | Moderate (2-3x) | Large (10-50x) |
| Best for | Text, code, medical images | Photos, music, video |

### Real-World Connection

When you choose photo quality on your phone's camera, you are choosing a compression level. "High quality" means less lossy compression (bigger file, better detail).

### Deeper Reading
- AP CSP reference: "Lossless and Lossy Compression"
- Computerphile (YouTube): "How PNG Works"

### Reflection Questions
1. Why would a hospital use lossless compression for X-ray images?
2. If you compress an MP3 file with ZIP, will it get much smaller? Why or why not?
3. Can you think of a situation where lossy compression could cause problems?`,
    },
    {
      id: "ap-csp-digital-info-checkpoint",
      slug: "digital-info-checkpoint",
      title: "Checkpoint: Digital Information",
      content: `## Checkpoint: Digital Information

Great work completing the Digital Information module! Let's check your understanding with a few review questions.

<!-- voice:section_check -->

### Question 1
Convert the binary number \`11010110\` to decimal.
<details>
<summary>Show Answer</summary>

128 + 64 + 0 + 16 + 0 + 4 + 2 + 0 = **214**
</details>

### Question 2
A photograph is stored as a grid of pixels, each using 3 bytes (RGB). If the image is 800 x 600 pixels, how many bytes does the uncompressed image require?

<details>
<summary>Show Answer</summary>

800 x 600 x 3 = **1,440,000 bytes** (about 1.4 MB)
</details>

### Question 3
Explain the difference between lossless and lossy compression. Give one example of each.

<details>
<summary>Show Answer</summary>

**Lossless** keeps all original data (e.g., ZIP, PNG). **Lossy** discards some data to achieve smaller files (e.g., JPEG, MP3).
</details>

### Question 4
Why do computers use binary (base 2) instead of decimal (base 10)?

<details>
<summary>Show Answer</summary>

Computers are built from transistors that have two states (on/off). Binary maps directly to these two states, making it reliable and simple to implement in hardware.
</details>

### Question 5
A song is recorded at 44,100 samples per second with 16-bit depth in stereo (2 channels). How many bytes does one second of audio require?

<details>
<summary>Show Answer</summary>

44,100 samples x 2 bytes (16 bits) x 2 channels = **176,400 bytes** (about 176 KB per second)
</details>

### You're Doing Great!
You now understand the very foundation of computing -- how all information is represented as binary data. In the next module, you will learn how that data travels across the Internet.`,
    },
  ],
};
