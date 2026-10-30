# Password Strength Analyzer Using Hash Tables and String Processing

An individual college-level mini project developed for **Advanced Data Structures and Algorithms (ADSA) - Unit III: Hash Tables**.

---

## 1. Problem Statement
Weak and predictable passwords are among the most common vulnerabilities in computing. Most password evaluation systems only perform rule-based checks without cross-referencing known compromised credentials. This project provides a dual-layer evaluation:
1. **Rule-Based String Analysis:** Evaluates length and character composition (uppercase, lowercase, digits, symbols).
2. **Hash Table Dictionary Verification:** Fast $O(1)$ lookup against a list of commonly cracked weak passwords using a custom-built Hash Table with Separate Chaining.

---

## 2. Objectives
- Implement a custom **Hash Table** data structure in C++ without using library maps (`std::unordered_map`).
- Design a mathematical **Hash Function** using polynomial rolling accumulation to minimize collisions.
- Resolve collisions using **Separate Chaining** (linked list at each bucket).
- Perform string processing to check password quality criteria.
- Provide a clear terminal-based reporting tool in C++ alongside a lightweight, responsive graphical UI in HTML, CSS, and JavaScript.

---

## 3. Technologies Used
- **Core Algorithm / Data Structure:** C++ (Standard C++11)
- **Graphical Demo UI:** HTML5, CSS3, Vanilla JavaScript
- **No External Dependencies:** No databases, no authentication systems, no frameworks (React/Node), and no external APIs.

> **Note on Architecture:** The C++ program (`main.cpp`) contains the primary ADSA data structure implementation and runs in the terminal. The web interface (`index.html`) is a standalone client-side demo showing equivalent logic in the browser. They operate independently.

---

## 4. ADSA Theory & Data Structure Design

### 4.1 Custom Hash Table (`main.cpp`)
Instead of using built-in standard containers, the project implements a custom `HashTable` class using an array of pointers to `HashNode`:

```cpp
struct HashNode {
    std::string key;
    HashNode* next;
    HashNode(const std::string& k) : key(k), next(nullptr) {}
};
```

### 4.2 Hash Function
The hash function maps arbitrary strings to a bucket index within `[0, TABLE_SIZE - 1]`. It uses a **Polynomial Rolling Hash**:

$$\text{hash} = \left(\sum_{i=0}^{L-1} \text{key}[i] \times 31^i \right) \pmod{\text{TABLE\_SIZE}}$$

- **Table Size:** $M = 31$ (a prime number to avoid modular bias).
- **Multiplier:** $31$ (an odd prime number that spreads out ASCII character values).

### 4.3 Collision Resolution: Separate Chaining
When two distinct passwords produce the same hash index (a collision), they are inserted into a singly linked list at that bucket.
- **Insertion:** Inserted at head in $O(1)$ time.
- **Search:** The bucket's linked list is traversed linearly until a match is found or `nullptr` is reached.

---

## 5. Complexity Analysis

| Operation | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Hash Table Insertion** | $O(1)$ | $O(N)$ (all keys collide) | $O(1)$ per element |
| **Hash Table Lookup** | $O(1 + \alpha)$ | $O(N)$ (single chain) | $O(1)$ |
| **String Inspection** | $O(L)$ | $O(L)$ | $O(1)$ |
| **Overall Password Analysis** | $O(L + \alpha)$ | $O(L + N)$ | $O(M + N)$ |

- $L$ = Length of user password.
- $N$ = Number of pre-loaded common weak passwords.
- $M$ = Hash table size (31 buckets).
- $\alpha = N / M$ = Load factor ($\approx 25 / 31 \approx 0.8$, keeping chains very short).

---

## 6. Project Structure

```text
Password-Strength-Analyzer/
├── main.cpp       # C++ source code with custom HashTable & string checks
├── index.html     # Lightweight HTML page for the graphical UI
├── style.css      # Minimal CSS styling
├── script.js      # Vanilla JavaScript demo replicating hash table checks
└── README.md      # Comprehensive project documentation
```

---

## 7. How to Compile and Run

### 7.1 Running the C++ Program

#### Using Windows Command Prompt (CMD) or PowerShell:
1. Navigate to the project folder:
   ```powershell
   cd c:\Users\VIDYANKSHINI\Desktop\project\ADSA_Mini_project
   ```
2. Compile the source code using `g++`:
   ```powershell
   g++ -std=c++11 -Wall main.cpp -o main.exe
   ```
3. Run the compiled executable:
   ```powershell
   .\main.exe
   ```

### 7.2 Running the Graphical UI
- Double-click `index.html` in Windows File Explorer, or open it in any browser (Chrome, Edge, Firefox).
- Alternatively, run from PowerShell:
  ```powershell
  Start-Process index.html
  ```

---

## 8. Test Cases & Sample Output

### Test 1: Known Weak Password (`password123`)
```text
==========================================
        PASSWORD STRENGTH ANALYZER        
==========================================
Length Check (>= 8)    : Passed
Uppercase Check        : Failed
Lowercase Check        : Passed
Digit Check            : Passed
Special Character Check: Failed
Common Password        : Matched (Insecure!)
Score                  : 3 / 5
Strength               : Weak
------------------------------------------
Suggestions:
 - CRITICAL: This is a widely known weak password. Avoid using common dictionary words or patterns.
 - Add at least one uppercase letter (A-Z).
 - Include at least one special character (e.g., !, @, #, $, %).
==========================================
```

### Test 2: Short Password (`abc`)
- **Score:** 1 / 5
- **Strength:** Weak
- **Suggestions:** Increase length to 8+ characters, add uppercase, digits, and special symbols.

### Test 3: Medium Password (`SecurePass2024`)
- **Score:** 4 / 5
- **Strength:** Medium
- **Suggestions:** Include at least one special character.

### Test 4: Strong Password (`K9#mQ!vL28$x`)
- **Score:** 5 / 5
- **Strength:** Strong
- **Suggestions:** None! Password meets all criteria.

---

## 9. Viva Questions & Key Concepts

**Q1: Why did you use a prime number for the table size?**  
*Answer:* Using a prime number (e.g., 31) ensures that the keys are distributed uniformly across buckets when using the modulo operator, minimizing clusters and collisions even when input keys exhibit patterns.

**Q2: What is Separate Chaining and why choose it over Open Addressing?**  
*Answer:* Separate Chaining stores colliding elements in a linked list attached to each bucket. It is simple to implement, handles high load factors gracefully without running out of slots, and avoids clustering problems (like primary clustering in linear probing).

**Q3: What is the load factor $\alpha$?**  
*Answer:* $\alpha = \frac{N}{M}$, where $N$ is the number of keys and $M$ is the table size. Here, $\alpha \approx 25/31 \approx 0.8$, ensuring that the average chain length is less than 1, maintaining $O(1)$ search performance.

**Q4: Why not use a simple array or linear search?**  
*Answer:* Linear search takes $O(N)$ time. As the dictionary of weak passwords grows into thousands of words, linear search becomes slow. A hash table performs lookups in average $O(1)$ time regardless of dictionary size.

---

## 10. Limitations
- Uses an in-memory dictionary rather than a database or external breach service.
- The C++ program and web interface are distinct demonstrations designed for simplicity and college viva evaluation.

