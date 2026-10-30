/**
 * ============================================================================
 * Project Title : Password Strength Analyzer Using Hash Tables & String Processing
 * Subject       : Advanced Data Structures & Algorithms (ADSA) - Unit III: Hash Tables
 * Description   : Evaluates password strength based on length, character diversity,
 *                 and checks against a list of common weak passwords stored in a
 *                 custom Hash Table with Separate Chaining for collision resolution.
 * ============================================================================
 */

#include <iostream>
#include <string>
#include <cctype>

// Size of the Hash Table (Prime number to ensure uniform bucket distribution)
const int TABLE_SIZE = 31;

/**
 * Node structure for the Hash Table linked list (Separate Chaining).
 */
struct HashNode {
    std::string key;
    HashNode* next;

    HashNode(const std::string& k) : key(k), next(nullptr) {}
};

/**
 * Custom Hash Table implementation using Separate Chaining.
 * Designed from scratch without std::unordered_map for ADSA demonstration.
 */
class HashTable {
private:
    HashNode* table[TABLE_SIZE];

    /**
     * Polynomial Rolling Hash Function.
     * Computes index = (sum(ch * 31^i)) % TABLE_SIZE
     * Viva Note: Prime multiplier (31) and prime table size (31) reduce collisions.
     */
    int hashFunction(const std::string& key) const {
        unsigned long hash = 0;
        const int primeMultiplier = 31;

        for (size_t i = 0; i < key.length(); ++i) {
            hash = (hash * primeMultiplier + static_cast<unsigned char>(key[i])) % TABLE_SIZE;
        }
        return static_cast<int>(hash);
    }

public:
    // Constructor initializes all bucket heads to nullptr
    HashTable() {
        for (int i = 0; i < TABLE_SIZE; ++i) {
            table[i] = nullptr;
        }
    }

    // Destructor to free dynamically allocated nodes and prevent memory leaks
    ~HashTable() {
        for (int i = 0; i < TABLE_SIZE; ++i) {
            HashNode* current = table[i];
            while (current != nullptr) {
                HashNode* temp = current;
                current = current->next;
                delete temp;
            }
            table[i] = nullptr;
        }
    }

    /**
     * Inserts a weak password string into the hash table.
     * Inserts at the head of the linked list for O(1) average time complexity.
     */
    void insert(const std::string& key) {
        int index = hashFunction(key);

        // Check if key already exists in this bucket chain
        HashNode* current = table[index];
        while (current != nullptr) {
            if (current->key == key) {
                return; // Already present
            }
            current = current->next;
        }

        // Insert new node at head (Separate Chaining)
        HashNode* newNode = new HashNode(key);
        newNode->next = table[index];
        table[index] = newNode;
    }

    /**
     * Checks if a password exists in the common weak passwords hash table.
     * Average time complexity: O(1 + alpha), where alpha is load factor.
     */
    bool contains(const std::string& key) const {
        int index = hashFunction(key);
        HashNode* current = table[index];

        while (current != nullptr) {
            if (current->key == key) {
                return true; // Match found
            }
            current = current->next;
        }
        return false; // Not found in weak password dictionary
    }
};

/**
 * Converts a string to lowercase for case-insensitive common password comparison.
 */
std::string toLowerCase(const std::string& str) {
    std::string lower = str;
    for (size_t i = 0; i < lower.length(); ++i) {
        lower[i] = static_cast<char>(std::tolower(lower[i]));
    }
    return lower;
}

/**
 * Checks if a character is a special symbol.
 */
bool isSpecialChar(char ch) {
    const std::string specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?/~`'\"\\";
    return specialChars.find(ch) != std::string::npos;
}

/**
 * Pre-populates the custom hash table with well-known common weak passwords.
 */
void loadCommonPasswords(HashTable& ht) {
    const std::string weakList[] = {
        "password", "123456", "12345678", "123456789", "qwerty",
        "admin", "welcome", "abc123", "password123", "iloveyou",
        "monkey", "dragon", "master", "sunshine", "football",
        "letmein", "login", "trustno1", "computer", "princess",
        "starwars", "pass123", "test1234", "default", "hello123"
    };

    int count = sizeof(weakList) / sizeof(weakList[0]);
    for (int i = 0; i < count; ++i) {
        ht.insert(weakList[i]);
    }
}

/**
 * Analyzes password and prints the complete report to terminal.
 */
void analyzePassword(const std::string& password, const HashTable& weakTable) {
    bool hasLength = (password.length() >= 8);
    bool hasUpper = false;
    bool hasLower = false;
    bool hasDigit = false;
    bool hasSpecial = false;

    // String processing: inspect each character in the input
    for (size_t i = 0; i < password.length(); ++i) {
        char ch = password[i];
        if (std::isupper(static_cast<unsigned char>(ch))) hasUpper = true;
        else if (std::islower(static_cast<unsigned char>(ch))) hasLower = true;
        else if (std::isdigit(static_cast<unsigned char>(ch))) hasDigit = true;
        else if (isSpecialChar(ch)) hasSpecial = true;
    }

    // Check against custom Hash Table of common passwords (case-insensitive)
    std::string lowerPass = toLowerCase(password);
    bool isCommon = weakTable.contains(lowerPass);

    // Calculate score (0 to 5)
    int score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasDigit) score++;
    if (hasSpecial) score++;

    // Determine classification
    std::string strength;
    if (isCommon || score <= 2) {
        strength = "Weak";
    } else if (score == 3 || score == 4) {
        strength = "Medium";
    } else {
        strength = "Strong";
    }

    // Output formatted report
    std::cout << "\n==========================================" << std::endl;
    std::cout << "        PASSWORD STRENGTH ANALYZER        " << std::endl;
    std::cout << "==========================================" << std::endl;
    std::cout << "Length Check (>= 8)    : " << (hasLength ? "Passed" : "Failed") << std::endl;
    std::cout << "Uppercase Check        : " << (hasUpper ? "Passed" : "Failed") << std::endl;
    std::cout << "Lowercase Check        : " << (hasLower ? "Passed" : "Failed") << std::endl;
    std::cout << "Digit Check            : " << (hasDigit ? "Passed" : "Failed") << std::endl;
    std::cout << "Special Character Check: " << (hasSpecial ? "Passed" : "Failed") << std::endl;
    std::cout << "Common Password        : " << (isCommon ? "Matched (Insecure!)" : "No match") << std::endl;
    std::cout << "Score                  : " << score << " / 5" << std::endl;
    std::cout << "Strength               : " << strength << std::endl;
    std::cout << "------------------------------------------" << std::endl;
    std::cout << "Suggestions:" << std::endl;

    if (isCommon) {
        std::cout << " - CRITICAL: This is a widely known weak password. Avoid using common dictionary words or patterns." << std::endl;
    }
    if (!hasLength) {
        std::cout << " - Increase length to at least 8 characters (12+ is recommended)." << std::endl;
    }
    if (!hasUpper) {
        std::cout << " - Add at least one uppercase letter (A-Z)." << std::endl;
    }
    if (!hasLower) {
        std::cout << " - Add at least one lowercase letter (a-z)." << std::endl;
    }
    if (!hasDigit) {
        std::cout << " - Include at least one number (0-9)." << std::endl;
    }
    if (!hasSpecial) {
        std::cout << " - Include at least one special character (e.g., !, @, #, $, %)." << std::endl;
    }
    if (strength == "Strong" && !isCommon) {
        std::cout << " - Excellent! Your password meets all security criteria." << std::endl;
    }
    std::cout << "==========================================\n" << std::endl;
}

int main() {
    HashTable weakPasswordTable;
    loadCommonPasswords(weakPasswordTable);

    std::cout << "====================================================\n";
    std::cout << "   ADSA Mini Project: Password Strength Analyzer   \n";
    std::cout << "   Topic: Hash Tables & String Processing (Unit III)\n";
    std::cout << "====================================================\n";

    int choice = 0;
    while (true) {
        std::cout << "Menu Options:\n";
        std::cout << " 1. Analyze a custom password\n";
        std::cout << " 2. Run demonstration test cases (Weak, Medium, Strong, Common)\n";
        std::cout << " 3. Exit\n";
        std::cout << "Enter your choice (1-3): ";

        if (!(std::cin >> choice)) {
            std::cin.clear();
            std::string dummy;
            std::getline(std::cin, dummy);
            std::cout << "\n[Error] Invalid input. Please enter 1, 2, or 3.\n\n";
            continue;
        }

        std::cin.ignore(10000, '\n'); // Clear newline character from buffer

        if (choice == 1) {
            std::string userPassword;
            std::cout << "\nEnter password to analyze: ";
            std::getline(std::cin, userPassword);

            if (userPassword.empty()) {
                std::cout << "[Warning] Empty password entered.\n";
            } else {
                analyzePassword(userPassword, weakPasswordTable);
            }
        } else if (choice == 2) {
            std::cout << "\n>>> Running Demonstration Test Cases <<<\n";

            std::cout << "\n[Test Case 1: Known Common Weak Password]";
            analyzePassword("password123", weakPasswordTable);

            std::cout << "\n[Test Case 2: Short Weak Password]";
            analyzePassword("abc", weakPasswordTable);

            std::cout << "\n[Test Case 3: Medium Password (Missing Special Char)]";
            analyzePassword("SecurePass2024", weakPasswordTable);

            std::cout << "\n[Test Case 4: Strong Password]";
            analyzePassword("K9#mQ!vL28$x", weakPasswordTable);
        } else if (choice == 3) {
            std::cout << "\nExiting Password Strength Analyzer. Thank you!\n";
            break;
        } else {
            std::cout << "\n[Error] Invalid option. Please select 1, 2, or 3.\n\n";
        }
    }

    return 0;
}

