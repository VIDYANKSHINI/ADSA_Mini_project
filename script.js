/**
 * Password Strength Analyzer - Enhanced Interactive Script
 * Features:
 * - Real-time analysis as the user types
 * - Custom Hash Table with Separate Chaining (mirroring C++ main.cpp logic)
 * - Live Polynomial Hash Value & Target Bucket inspector
 * - Quick Preset Chips for Viva Demonstrations
 * - Show/Hide password toggle & Copy to Clipboard
 */

// Custom Hash Table in JavaScript (ADSA Demonstration)
class JSHashTable {
  constructor(size = 31) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }

  // Polynomial rolling hash function matching C++ implementation
  hash(key) {
    let hashVal = 0;
    const primeMultiplier = 31;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * primeMultiplier + key.charCodeAt(i)) % this.size;
    }
    return hashVal;
  }

  // Returns un-modulo'd representation for viva inspector demonstration
  calculateDebugHash(key) {
    let hashVal = 0;
    const primeMultiplier = 31;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * primeMultiplier + key.charCodeAt(i)) % 1000000007;
    }
    const bucket = this.hash(key);
    return { rawHash: hashVal, bucketIndex: bucket };
  }

  // Insert key into bucket chain
  insert(key) {
    const idx = this.hash(key);
    if (!this.table[idx].includes(key)) {
      this.table[idx].push(key);
    }
  }

  // Check if key exists in hash table
  contains(key) {
    const idx = this.hash(key);
    return this.table[idx].includes(key);
  }
}

// Predefined list of common weak passwords
const weakPasswordTable = new JSHashTable(31);
const commonWeakList = [
  "password", "123456", "12345678", "123456789", "qwerty",
  "admin", "welcome", "abc123", "password123", "iloveyou",
  "monkey", "dragon", "master", "sunshine", "football",
  "letmein", "login", "trustno1", "computer", "princess",
  "starwars", "pass123", "test1234", "default", "hello123"
];
commonWeakList.forEach(pwd => weakPasswordTable.insert(pwd.toLowerCase()));

// DOM Elements
const passwordInput = document.getElementById("passwordInput");
const charCount = document.getElementById("charCount");
const toggleVisibilityBtn = document.getElementById("toggleVisibilityBtn");
const copyBtn = document.getElementById("copyBtn");
const eyeIcon = document.getElementById("eyeIcon");
const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");
const resultsSection = document.getElementById("resultsSection");

// Strength Elements
const strengthText = document.getElementById("strengthText");
const strengthBadge = document.getElementById("strengthBadge");
const scoreNumber = document.getElementById("scoreNumber");
const segments = [
  document.getElementById("seg1"),
  document.getElementById("seg2"),
  document.getElementById("seg3"),
  document.getElementById("seg4"),
  document.getElementById("seg5")
];
const commonWarning = document.getElementById("commonWarning");

// Checklist Items
const checkLength = document.getElementById("checkLength");
const checkUpper = document.getElementById("checkUpper");
const checkLower = document.getElementById("checkLower");
const checkDigit = document.getElementById("checkDigit");
const checkSpecial = document.getElementById("checkSpecial");
const checkCommon = document.getElementById("checkCommon");
const commonStatusText = document.getElementById("commonStatusText");

// Inspector & Suggestions
const hashRawValue = document.getElementById("hashRawValue");
const hashBucketIndex = document.getElementById("hashBucketIndex");
const suggestionsList = document.getElementById("suggestionsList");
const toast = document.getElementById("toast");

// Preset Chips
const presetChips = document.querySelectorAll(".chip");

// Toggle Show/Hide Password
let isPasswordVisible = false;
toggleVisibilityBtn.addEventListener("click", () => {
  isPasswordVisible = !isPasswordVisible;
  passwordInput.type = isPasswordVisible ? "text" : "password";
  
  if (isPasswordVisible) {
    eyeIcon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    `;
    toggleVisibilityBtn.title = "Hide Password";
  } else {
    eyeIcon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    `;
    toggleVisibilityBtn.title = "Show Password";
  }
});

// Copy Password to Clipboard
copyBtn.addEventListener("click", () => {
  const pwd = passwordInput.value;
  if (!pwd) return;
  navigator.clipboard.writeText(pwd).then(() => {
    showToast("Password copied to clipboard!");
  }).catch(() => {
    showToast("Copied!");
  });
});

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

// Preset Chip Clicks
presetChips.forEach(chip => {
  chip.addEventListener("click", () => {
    const sample = chip.getAttribute("data-pwd");
    passwordInput.value = sample;
    analyzePassword();
  });
});

// Live input listener
passwordInput.addEventListener("input", () => {
  const len = passwordInput.value.length;
  charCount.textContent = `${len} character${len === 1 ? '' : 's'}`;
  if (len > 0) {
    analyzePassword();
  } else {
    resultsSection.style.display = "none";
  }
});

// Core Analyzer Function
function analyzePassword() {
  const pwd = passwordInput.value;

  if (!pwd) {
    resultsSection.style.display = "none";
    return;
  }

  resultsSection.style.display = "flex";

  // 1. String Diversity Checks
  const hasLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_\-+=\[\]{}|;:,.<>?/~`'"\\]/.test(pwd);

  // 2. Hash Table Lookup
  const isCommon = weakPasswordTable.contains(pwd.toLowerCase());
  const hashDebug = weakPasswordTable.calculateDebugHash(pwd);

  // Update Live Hash Inspector
  hashRawValue.textContent = hashDebug.rawHash;
  hashBucketIndex.textContent = `Bucket #${hashDebug.bucketIndex}`;

  // Update Check Items UI
  setCheckState(checkLength, hasLength);
  setCheckState(checkUpper, hasUpper);
  setCheckState(checkLower, hasLower);
  setCheckState(checkDigit, hasDigit);
  setCheckState(checkSpecial, hasSpecial);
  
  // Dictionary check state
  if (isCommon) {
    checkCommon.className = "check-item failed";
    commonStatusText.textContent = "Matched common weak dictionary!";
    commonWarning.style.display = "flex";
  } else {
    checkCommon.className = "check-item passed";
    commonStatusText.textContent = "Safe: Not in common weak list";
    commonWarning.style.display = "none";
  }

  // 3. Compute Score
  let score = 0;
  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasDigit) score++;
  if (hasSpecial) score++;

  // 4. Determine Classification
  let strength = "Weak";
  let colorCategory = "weak";

  if (isCommon || score <= 2) {
    strength = "Weak";
    colorCategory = "weak";
  } else if (score === 3 || score === 4) {
    strength = "Medium";
    colorCategory = "medium";
  } else {
    strength = "Strong";
    colorCategory = "strong";
  }

  // Update Score & Header Banner
  scoreNumber.textContent = score;
  strengthText.textContent = `${strength} Password`;
  strengthText.className = `strength-text text-${colorCategory}`;
  
  strengthBadge.textContent = strength;
  strengthBadge.className = `status-badge badge-${colorCategory}`;

  // Update 5-Segment Progress Meter
  updateSegmentMeter(score, colorCategory);

  // 5. Update Suggestions
  renderSuggestions({
    isCommon,
    hasLength,
    hasUpper,
    hasLower,
    hasDigit,
    hasSpecial,
    strength
  });
}

function setCheckState(element, passed) {
  element.className = passed ? "check-item passed" : "check-item failed";
}

function updateSegmentMeter(score, colorCategory) {
  segments.forEach((seg, index) => {
    seg.className = "meter-segment";
    if (index < score) {
      seg.classList.add(`active-${colorCategory}`);
    }
  });
}

function renderSuggestions(status) {
  suggestionsList.innerHTML = "";
  const tips = [];

  if (status.isCommon) {
    tips.push("Avoid standard dictionary passwords, popular culture words, or sequential number patterns.");
  }
  if (!status.hasLength) {
    tips.push("Make it longer: Aim for at least 8 characters (12+ characters provides exponential security).");
  }
  if (!status.hasUpper) {
    tips.push("Include at least one uppercase letter (A-Z) to increase character entropy.");
  }
  if (!status.hasLower) {
    tips.push("Include at least one lowercase letter (a-z).");
  }
  if (!status.hasDigit) {
    tips.push("Insert numeric digits (0-9) within or between words.");
  }
  if (!status.hasSpecial) {
    tips.push("Add special symbols (!@#$%^&*) to prevent brute-force dictionary attacks.");
  }

  if (tips.length === 0 && status.strength === "Strong" && !status.isCommon) {
    const li = document.createElement("li");
    li.className = "success-tip";
    li.textContent = "✔ Excellent! Your password satisfies all character diversity rules and is not in the dictionary.";
    suggestionsList.appendChild(li);
  } else {
    tips.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      suggestionsList.appendChild(li);
    });
  }
}

// Reset Handler
resetBtn.addEventListener("click", () => {
  passwordInput.value = "";
  charCount.textContent = "0 characters";
  resultsSection.style.display = "none";
  commonWarning.style.display = "none";
  passwordInput.focus();
});

// Explicit Analyze button
analyzeBtn.addEventListener("click", () => {
  if (!passwordInput.value) {
    alert("Please enter a password first!");
    passwordInput.focus();
    return;
  }
  analyzePassword();
});
