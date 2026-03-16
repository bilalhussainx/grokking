import { Module } from "../types";

export const networkFundamentalsModule: Module = {
  id: "eh-network-fundamentals",
  title: "Network Fundamentals",
  description:
    "Understand TCP/IP, DNS, HTTP, and network architecture from a security perspective. Learn how data flows across networks and where vulnerabilities arise at each layer.",
  lessons: [
    {
      id: "eh-tcp-ip-model",
      slug: "tcp-ip-model",
      title: "The TCP/IP Model & Security",
      content: `## The TCP/IP Model & Security

<!-- voice:section_check -->

Every network attack exploits a weakness in how computers communicate. Understanding the TCP/IP model reveals where those weaknesses lie.

### The Four Layers

| Layer | Protocols | Security Concerns |
|-------|----------|-------------------|
| **Application** | HTTP, HTTPS, DNS, SMTP, SSH | Injection attacks, authentication flaws, data exposure |
| **Transport** | TCP, UDP | Port scanning, SYN flood attacks, session hijacking |
| **Internet** | IP, ICMP | IP spoofing, routing attacks, packet sniffing |
| **Network Access** | Ethernet, Wi-Fi, ARP | ARP spoofing, MAC flooding, rogue access points |

### How Data Flows

When you visit a website:

1. **DNS Resolution**: Browser asks "What is the IP for example.com?" -> DNS server responds with 93.184.216.34
2. **TCP Handshake**: Your machine and the server perform a 3-way handshake (SYN -> SYN-ACK -> ACK)
3. **HTTP Request**: Browser sends GET /index.html over the established TCP connection
4. **Response**: Server returns HTML content
5. **Rendering**: Browser displays the page

Security implication: an attacker can intercept or manipulate data at **any** of these steps.

### DNS: The Internet's Phone Book

DNS translates human-readable domain names to IP addresses. It is a prime attack target because:

- **DNS Spoofing**: Attacker provides fake DNS responses, redirecting users to malicious sites
- **DNS Tunneling**: Encoding data in DNS queries to exfiltrate data or bypass firewalls
- **DNS Amplification**: Using open DNS resolvers to amplify DDoS attacks

<!-- voice:key_insight -->

### Ports and Services

Every network service listens on a **port** (0-65535). Well-known ports:

\`\`\`
Port 22  -> SSH (Secure Shell)
Port 53  -> DNS
Port 80  -> HTTP
Port 443 -> HTTPS
Port 3306 -> MySQL
Port 5432 -> PostgreSQL
Port 3389 -> RDP (Remote Desktop)
\`\`\`

An open port is a potential entry point. **Port scanning** (using tools like Nmap) reveals which services are running and may be vulnerable.

### HTTPS and TLS

**HTTPS** = HTTP + TLS encryption. Without it, data travels in plaintext and can be read by anyone on the network (coffee shop Wi-Fi, for example).

TLS provides:
- **Confidentiality**: Encrypted data in transit
- **Integrity**: Detects tampering via message authentication codes
- **Authentication**: Server proves its identity via certificates

### Key Takeaway

Network security starts with understanding how data flows. Every layer of the TCP/IP model has vulnerabilities. HTTPS protects data in transit, but the endpoints (client and server) must also be secured.

### Reflection Questions

- Why is DNS such a common attack target?
- What risks do you face when using public Wi-Fi without a VPN?`,
    },
    {
      id: "eh-port-scanner-exercise",
      slug: "port-scanner-exercise",
      title: "Exercise: Build a Simple Port Scanner",
      content: `## Exercise: Build a Simple Port Scanner

Build an educational port scanner in Python that checks which ports are open on localhost. This teaches you how network services work and how security tools probe for them.

### How Port Scanning Works

A port scanner attempts to establish a TCP connection to each port:
- **Open**: Connection accepted (a service is listening)
- **Closed**: Connection refused (no service, but host responds)
- **Filtered**: No response (firewall blocking)

### Educational Context

Port scanning your own machine is legal and educational. Scanning other people's systems without authorization is illegal.

### Hints

- Use Python's \`socket\` module
- Set a short timeout (0.5 seconds) to avoid hanging on filtered ports
- Common ports to check: 22, 53, 80, 443, 3000, 3306, 5432, 8080`,
      starterCode: `import socket
import time

def scan_port(host, port, timeout=0.5):
    """Check if a specific port is open on the given host.

    Args:
        host: IP address or hostname (e.g., '127.0.0.1')
        port: port number (0-65535)
        timeout: connection timeout in seconds
    Returns:
        bool: True if port is open, False otherwise
    """
    # TODO: Create a socket, set timeout, try to connect
    # TODO: Return True if connection succeeds, False otherwise
    # TODO: Always close the socket
    pass

def scan_ports(host, ports):
    """Scan a list of ports and return open ones.

    Args:
        host: IP address or hostname
        ports: list of port numbers to scan
    Returns:
        list of tuples: [(port, service_name), ...]
    """
    # TODO: Scan each port, collect open ones
    # TODO: Look up service name using get_service_name()
    pass

def get_service_name(port):
    """Return the common service name for a well-known port.

    Args:
        port: port number
    Returns:
        str: service name or 'unknown'
    """
    # TODO: Map common ports to service names
    services = {
        21: "FTP",
        22: "SSH",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        3000: "Dev Server",
        3306: "MySQL",
        5432: "PostgreSQL",
        8080: "HTTP Alt",
        8443: "HTTPS Alt",
    }
    # TODO: Return the service name or 'unknown'
    pass

def format_scan_report(host, results, scan_time):
    """Format scan results into a readable report.

    Args:
        host: scanned host
        results: list of (port, service_name) tuples
        scan_time: time taken in seconds
    Returns:
        str: formatted report
    """
    # TODO: Build a formatted string showing all open ports
    pass

# Test cases (scanning localhost)
host = "127.0.0.1"
common_ports = [22, 53, 80, 443, 3000, 3306, 5432, 8080, 8443]

print(f"Scanning {host}...")
start = time.time()
results = scan_ports(host, common_ports)
elapsed = time.time() - start

report = format_scan_report(host, results, elapsed)
print(report)

# Test service name lookup
print(f"Port 80 service: {get_service_name(80)}")
# Expected: HTTP

print(f"Port 443 service: {get_service_name(443)}")
# Expected: HTTPS

print(f"Port 9999 service: {get_service_name(9999)}")
# Expected: unknown

print(f"\\nScan completed in {elapsed:.2f} seconds")`,
      solutionCode: `import socket
import time

def scan_port(host, port, timeout=0.5):
    """Check if a specific port is open on the given host.

    Args:
        host: IP address or hostname (e.g., '127.0.0.1')
        port: port number (0-65535)
        timeout: connection timeout in seconds
    Returns:
        bool: True if port is open, False otherwise
    """
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except socket.error:
        return False

def scan_ports(host, ports):
    """Scan a list of ports and return open ones.

    Args:
        host: IP address or hostname
        ports: list of port numbers to scan
    Returns:
        list of tuples: [(port, service_name), ...]
    """
    open_ports = []
    for port in ports:
        if scan_port(host, port):
            open_ports.append((port, get_service_name(port)))
    return open_ports

def get_service_name(port):
    """Return the common service name for a well-known port."""
    services = {
        21: "FTP",
        22: "SSH",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        3000: "Dev Server",
        3306: "MySQL",
        5432: "PostgreSQL",
        8080: "HTTP Alt",
        8443: "HTTPS Alt",
    }
    return services.get(port, "unknown")

def format_scan_report(host, results, scan_time):
    """Format scan results into a readable report."""
    lines = [f"\\nScan Report for {host}", "=" * 40]
    if results:
        lines.append(f"{'PORT':<10} {'STATE':<10} {'SERVICE':<15}")
        lines.append("-" * 35)
        for port, service in results:
            lines.append(f"{port:<10} {'open':<10} {service:<15}")
    else:
        lines.append("No open ports found.")
    lines.append(f"\\nScanned in {scan_time:.2f} seconds")
    return "\\n".join(lines)

# Time complexity: O(n_ports * timeout) in worst case
# Space complexity: O(n_open_ports) for results

# Test cases (scanning localhost)
host = "127.0.0.1"
common_ports = [22, 53, 80, 443, 3000, 3306, 5432, 8080, 8443]

print(f"Scanning {host}...")
start = time.time()
results = scan_ports(host, common_ports)
elapsed = time.time() - start

report = format_scan_report(host, results, elapsed)
print(report)

# Test service name lookup
print(f"Port 80 service: {get_service_name(80)}")
# Expected: HTTP

print(f"Port 443 service: {get_service_name(443)}")
# Expected: HTTPS

print(f"Port 9999 service: {get_service_name(9999)}")
# Expected: unknown

print(f"\\nScan completed in {elapsed:.2f} seconds")`,
    },
    {
      id: "eh-network-checkpoint",
      slug: "network-fundamentals-checkpoint",
      title: "Checkpoint: Network Fundamentals",
      content: `## Checkpoint: Network Fundamentals

<!-- voice:section_check -->

Test your understanding of network security concepts.

---

### Question 1
During a TCP three-way handshake, the correct sequence of packets is:

A) ACK -> SYN -> SYN-ACK
B) SYN -> SYN-ACK -> ACK
C) SYN -> ACK -> SYN-ACK
D) SYN-ACK -> SYN -> ACK

**Answer: B** — The client sends SYN, the server responds with SYN-ACK, and the client completes with ACK. This establishes a TCP connection. A SYN flood attack abuses this by sending many SYNs without completing the handshake.

---

### Question 2
What does a port scanner detect?

A) Vulnerabilities in running software
B) Which network services are accepting connections on which ports
C) The physical location of a server
D) Encrypted traffic content

**Answer: B** — A port scanner probes ports to determine which are open (service listening), closed (no service), or filtered (firewall blocking). It reveals the attack surface but does not identify specific vulnerabilities.

---

### Question 3
DNS spoofing is dangerous because:

A) It reveals the target's IP address
B) It redirects users to attacker-controlled servers by providing fake DNS responses
C) It encrypts DNS traffic
D) It speeds up DNS resolution

**Answer: B** — By providing false IP addresses for domain names, an attacker can redirect users to phishing sites or malware distribution servers without the user knowing they are on the wrong site.

---

### Question 4
What does HTTPS protect against that HTTP does not?

A) SQL injection attacks
B) Eavesdropping on data in transit between client and server
C) Cross-site scripting (XSS)
D) Server-side vulnerabilities

**Answer: B** — HTTPS encrypts the communication channel using TLS, preventing anyone on the network path from reading or modifying the data. It does not protect against application-level vulnerabilities like SQL injection or XSS.

---

### Question 5
Port 22 is typically associated with which service?

A) HTTP
B) SMTP (email)
C) SSH (Secure Shell)
D) DNS

**Answer: C** — SSH (Secure Shell) runs on port 22 by default and provides encrypted remote access to systems. Leaving SSH open to the internet with weak passwords is a common security misconfiguration.`,
    },
  ],
};
