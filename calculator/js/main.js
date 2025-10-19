const display = document.getElementById("display");
const keys = document.getElementById("keys");
const historyList = document.getElementById("history-list");
const themeToggle = document.getElementById("theme-toggle");

const THEME_STORAGE_KEY = "calculator-theme";

let currentInput = "";
let resetNext = false;

// Event delegation for clicks
keys.addEventListener("click", (event) => {
  const button = event.target;
  if (!button.matches("button")) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  handleInput(value, action);
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if ((key >= "0" && key <= "9") || key === ".") {
    handleInput(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleInput(key, "operator");
  } else if (key === "Enter" || key === "=") {
    handleInput(null, "calculate");
  } else if (key === "Backspace") {
    handleInput(null, "backspace");
  } else if (key.toLowerCase() === "c") {
    handleInput(null, "clear");
  }
});

// Theme toggle
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.setAttribute("aria-pressed", isDark);
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
if (savedTheme === "dark" || savedTheme === "light") {
  applyTheme(savedTheme);
} else {
  applyTheme(document.body.classList.contains("dark-theme") ? "dark" : "light");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});

// Main input handler
function handleInput(value, action) {
  if (value) {
    if (resetNext) {
      currentInput = "";
      resetNext = false;
    }
    // Check if the new value is an operator
    const operators = ['+', '-', '*', '/'];
    const lastChar = currentInput.slice(-1);
    if (operators.includes(value)) {
      // If last character was also an operator, replace it
      if (operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + value;
      } else {
        currentInput += value;
      }
    } else {
      currentInput += value;
    }
    updateDisplay(currentInput);
  }

  if (action === "clear") {
    currentInput = "";
    updateDisplay("");
  }

  if (action === "backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  }

  if (action === "calculate") {
    try {
      const result = Function(`"use strict"; return (${currentInput})`)();
      addToHistory(currentInput, result);
      currentInput = result.toString();
      updateDisplay(currentInput);
      resetNext = true;
    } catch {
      currentInput = "";
      updateDisplay("Error");
    }
  }
}

// Update display with animation
function updateDisplay(value) {
  display.value = value;
  display.classList.remove("updated");
  void display.offsetWidth;
  display.classList.add("updated");
}

// Add entries to history
function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;

  li.addEventListener("click", () => {
    currentInput = result.toString();
    updateDisplay(currentInput);
    resetNext = false;
  });

  historyList.prepend(li);

  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}
