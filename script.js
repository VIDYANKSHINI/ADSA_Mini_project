/**
 * PAY-RIGHT DASHBOARD SCRIPT // ADSA MINI PROJECT
 * - Real-time deterministic analysis on input
 * - Custom Hash Table with Separate Chaining (Unit III)
 * - Live polynomial rolling hash computation
 * - Pay-right cyberpunk styling and instant response
 */

// Custom Hash Table in JavaScript (Separate Chaining demonstration)
class JSHashTable {
  constructor(size = 31) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }

  // Polynomial rolling hash function matching C++ main.cpp
  hash(key) {
    let hashVal = 0;
    const primeMultiplier = 31;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * primeMultiplier + key.charCodeAt(i)) % this.size;
    }
    return hashVal;
  }

  // Un-modulo'd hash accumulator for live inspector display
  calculateInspectorHash(key) {
    let hashVal = 0;
    const primeMultiplier = 31;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * primeMultiplier + key.charCodeAt(i)) % 1000000007;
    }
    const bucket = this.hash(key);
    return { rawHash: hashVal, bucketIndex: bucket };
  }

  insert(key) {
    const idx = this.hash(key);
    if (!this.table[idx].includes(key)) {
      this.table[idx].push(key);
    }
  }

  contains(key) {
    const idx = this.hash(key);
    return this.table[idx].includes(key);
  }
}

// Pre-populate weak passwords into Hash Table
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
const eyeText = document.getElementById("eyeText");
const copyBtn = document.getElementById("copyBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");

// Inspector Elements
const hashRawValue = document.getElementById("hashRawValue");
const hashBucketIndex = document.getElementById("hashBucketIndex");

// Rating Elements
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

// Matrix Checklist Rows
const checkLength = document.getElementById("checkLength");
const checkUpper = document.getElementById("checkUpper");
const checkLower = document.getElementById("checkLower");
const checkDigit = document.getElementById("checkDigit");
const checkSpecial = document.getElementById("checkSpecial");
const checkCommon = document.getElementById("checkCommon");
const commonDesc = document.getElementById("commonDesc");

// Suggestions Terminal & Toast
const suggestionsList = document.getElementById("suggestionsList");
const toast = document.getElementById("toast");

// Presets
const presetBtns = document.querySelectorAll(".preset-btn");

// Toggle Show/Hide
let isPasswordVisible = false;
toggleVisibilityBtn.addEventListener("click", () => {
  isPasswordVisible = !isPasswordVisible;
  passwordInput.type = isPasswordVisible ? "text" : "password";
  eyeText.textContent = isPasswordVisible ? "HIDE" : "SHOW";
});

// Copy Password
copyBtn.addEventListener("click", () => {
  const pwd = passwordInput.value;
  if (!pwd) return;
  navigator.clipboard.writeText(pwd).then(() => {
    showToast("PASSWORD COPIED TO CLIPBOARD");
  }).catch(() => {
    showToast("COPIED!");
  });
});

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1800);
}

// Preset Buttons
presetBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const pwd = btn.getAttribute("data-pwd");
    passwordInput.value = pwd;
    runAnalysis();
  });
});

// Live Input Event
passwordInput.addEventListener("input", () => {
  runAnalysis();
});

// Reset Event
resetBtn.addEventListener("click", () => {
  passwordInput.value = "";
  charCount.textContent = "00 CHARS";
  resetToIdle();
  passwordInput.focus();
});

// Analyze Button Event
analyzeBtn.addEventListener("click", () => {
  if (!passwordInput.value) {
    showToast("PLEASE ENTER PASSWORD FIRST");
    passwordInput.focus();
    return;
  }
  runAnalysis();
});

function resetToIdle() {
  hashRawValue.textContent = "--";
  hashBucketIndex.textContent = "BUCKET [--]";
  
  strengthText.textContent = "AWAITING INPUT";
  strengthText.className = "strength-grade text-muted";
  
  strengthBadge.textContent = "IDLE";
  strengthBadge.className = "grade-pill pill-muted";
  
  scoreNumber.textContent = "0";
  
  segments.forEach(seg => seg.className = "segment");
  commonWarning.style.display = "none";

  setMatrixRow(checkLength, false);
  setMatrixRow(checkUpper, false);
  setMatrixRow(checkLower, false);
  setMatrixRow(checkDigit, false);
  setMatrixRow(checkSpecial, false);
  
  checkCommon.className = "matrix-row passed";
  checkCommon.querySelector(".matrix-status").textContent = "PASS";
  commonDesc.textContent = "Not in common weak hash table";

  suggestionsList.innerHTML = `<li class="log-item idle-msg">&gt; Enter or select a password to trigger security analysis...</li>`;
}

function setMatrixRow(rowElem, isPassed) {
  const statusElem = rowElem.querySelector(".matrix-status");
  if (isPassed) {
    rowElem.className = "matrix-row passed";
    statusElem.textContent = "PASS";
  } else {
    rowElem.className = "matrix-row failed";
    statusElem.textContent = "FAIL";
  }
}

// Main Analysis Function
function runAnalysis() {
  const pwd = passwordInput.value;
  const len = pwd.length;
  charCount.textContent = `${len.toString().padStart(2, '0')} CHARS`;

  if (!pwd) {
    resetToIdle();
    return;
  }

  // 1. Character Diversity
  const hasLength = len >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_\-+=\[\]{}|;:,.<>?/~`'"\\]/.test(pwd);

  // 2. Hash Table Lookup
  const isCommon = weakPasswordTable.contains(pwd.toLowerCase());
  const hashInspector = weakPasswordTable.calculateInspectorHash(pwd);

  // Update Inspector
  hashRawValue.textContent = hashInspector.rawHash;
  hashBucketIndex.textContent = `BUCKET [#${hashInspector.bucketIndex}]`;

  // Update Matrix
  setMatrixRow(checkLength, hasLength);
  setMatrixRow(checkUpper, hasUpper);
  setMatrixRow(checkLower, hasLower);
  setMatrixRow(checkDigit, hasDigit);
  setMatrixRow(checkSpecial, hasSpecial);

  if (isCommon) {
    checkCommon.className = "matrix-row failed";
    checkCommon.querySelector(".matrix-status").textContent = "MATCH";
    commonDesc.textContent = "MATCHED: Common weak password dictionary";
    commonWarning.style.display = "block";
  } else {
    checkCommon.className = "matrix-row passed";
    checkCommon.querySelector(".matrix-status").textContent = "PASS";
    commonDesc.textContent = "Not in common weak hash table";
    commonWarning.style.display = "none";
  }

  // 3. Compute Score
  let score = 0;
  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasDigit) score++;
  if (hasSpecial) score++;

  // 4. Classification
  let grade = "WEAK";
  let gradeClass = "weak";

  if (isCommon || score <= 2) {
    grade = "WEAK";
    gradeClass = "weak";
  } else if (score === 3 || score === 4) {
    grade = "MEDIUM";
    gradeClass = "medium";
  } else {
    grade = "STRONG";
    gradeClass = "strong";
  }

  // Update Grade & Score display
  scoreNumber.textContent = score;
  strengthText.textContent = `${grade} PASSWORD`;
  strengthText.className = `strength-grade text-${gradeClass}`;

  strengthBadge.textContent = grade;
  strengthBadge.className = `grade-pill pill-${gradeClass}`;

  // 5. Update Segments
  segments.forEach((seg, idx) => {
    seg.className = "segment";
    if (idx < score) {
      seg.classList.add(`active-${gradeClass}`);
    }
  });

  // 6. Update Terminal Recommendations Log
  renderTerminalRecommendations({
    isCommon,
    hasLength,
    hasUpper,
    hasLower,
    hasDigit,
    hasSpecial,
    grade
  });
}

function renderTerminalRecommendations(status) {
  suggestionsList.innerHTML = "";
  const logs = [];

  if (status.isCommon) {
    logs.push("&gt; [WARN] Dictionary collision: Password exists in cracked databases. Change immediately.");
  }
  if (!status.hasLength) {
    logs.push("&gt; [TIP] Increase length to &gt;= 8 characters (12+ characters recommended).");
  }
  if (!status.hasUpper) {
    logs.push("&gt; [TIP] Inject uppercase characters [A-Z] to break lowercase pattern.");
  }
  if (!status.hasLower) {
    logs.push("&gt; [TIP] Include lowercase characters [a-z].");
  }
  if (!status.hasDigit) {
    logs.push("&gt; [TIP] Append or embed numeric digits [0-9].");
  }
  if (!status.hasSpecial) {
    logs.push("&gt; [TIP] Include high-entropy symbols [!@#$%^&*].");
  }

  if (logs.length === 0 && status.grade === "STRONG" && !status.isCommon) {
    const li = document.createElement("li");
    li.className = "log-item success-msg";
    li.innerHTML = "&gt; [OPTIMAL] All criteria satisfied. Password meets high security standards.";
    suggestionsList.appendChild(li);
  } else {
    logs.forEach(msg => {
      const li = document.createElement("li");
      li.className = "log-item";
      li.innerHTML = msg;
      suggestionsList.appendChild(li);
    });
  }
}
