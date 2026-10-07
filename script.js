"use strict";

/*
===========================================================
 CASH-FLOW
 Sprint 02 — Vanilla JavaScript
===========================================================

 P0
 - Salary input
 - Expense input
 - Validation
 - DOM manipulation
 - Balance calculation

 P1
 - LocalStorage
 - Delete expense
 - Chart.js

 P2
 - jsPDF report
 - Currency API
 - 10% threshold alert
===========================================================
*/


/* ========================================================
   LOCAL STORAGE KEYS
======================================================== */

const STORAGE_KEYS = {
  salary: "cashflow-salary",
  expenses: "cashflow-expenses",
  currency: "cashflow-currency"
};


/* ========================================================
   APPLICATION STATE
======================================================== */

let salary = loadSalary();

let expenses = loadExpenses();

let selectedCurrency =
  localStorage.getItem(STORAGE_KEYS.currency) || "INR";

let chartInstance = null;

let toastTimer = null;

let currencyRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095
};


/* ========================================================
   CURRENCY CONFIGURATION
======================================================== */

const currencyConfig = {

  INR: {
    symbol: "₹",
    locale: "en-IN"
  },

  USD: {
    symbol: "$",
    locale: "en-US"
  },

  EUR: {
    symbol: "€",
    locale: "de-DE"
  },

  GBP: {
    symbol: "£",
    locale: "en-GB"
  }

};


/* ========================================================
   DOM ELEMENTS
======================================================== */

const elements = {

  salaryDisplay:
    document.getElementById("salaryDisplay"),

  expenseTotal:
    document.getElementById("expenseTotal"),

  remainingBalance:
    document.getElementById("remainingBalance"),

  balancePercentage:
    document.getElementById("balancePercentage"),

  balanceCard:
    document.getElementById("balanceCard"),

  criticalAlert:
    document.getElementById("criticalAlert"),

  expenseForm:
    document.getElementById("expenseForm"),

  expenseName:
    document.getElementById("expenseName"),

  expenseAmount:
    document.getElementById("expenseAmount"),

  nameError:
    document.getElementById("nameError"),

  amountError:
    document.getElementById("amountError"),

  expenseList:
    document.getElementById("expenseList"),

  expenseCount:
    document.getElementById("expenseCount"),

  expenseChart:
    document.getElementById("expenseChart"),

  chartExpenseValue:
    document.getElementById("chartExpenseValue"),

  chartBalanceValue:
    document.getElementById("chartBalanceValue"),

  currencySymbol:
    document.getElementById("currencySymbol"),

  navCurrency:
    document.getElementById("navCurrency"),

  headerCurrency:
    document.getElementById("headerCurrency"),

  editSalary:
    document.getElementById("editSalary"),

  salaryForm:
    document.getElementById("salaryForm"),

  salaryInput:
    document.getElementById("salaryInput"),

  downloadReport:
    document.getElementById("downloadReport"),

  downloadReportBottom:
    document.getElementById("downloadReportBottom"),

  toast:
    document.getElementById("toast"),

  toastMessage:
    document.getElementById("toastMessage"),

  toastIcon:
    document.getElementById("toastIcon"),

  currencyLoading:
    document.getElementById("currencyLoading"),

  menuButton:
    document.getElementById("menuButton"),

  mobileMenu:
    document.getElementById("mobileMenu")
};


/* ========================================================
   LOCAL STORAGE
======================================================== */

/*
  Salary localStorage se retrieve karta hai.
*/

function loadSalary() {

  const savedSalary =
    localStorage.getItem(STORAGE_KEYS.salary);

  if (savedSalary === null) {
    return 0;
  }

  const parsedSalary = Number(savedSalary);

  return Number.isFinite(parsedSalary)
    ? parsedSalary
    : 0;
}


/*
  Expenses array localStorage se retrieve karta hai.

  JSON.parse()
  String → JavaScript Array
*/

function loadExpenses() {

  const savedExpenses =
    localStorage.getItem(STORAGE_KEYS.expenses);

  if (!savedExpenses) {
    return [];
  }

  try {

    const parsedExpenses =
      JSON.parse(savedExpenses);

    return Array.isArray(parsedExpenses)
      ? parsedExpenses
      : [];

  } catch (error) {

    console.error(
      "Could not parse expenses:",
      error
    );

    return [];
  }
}


/*
  Current state ko localStorage mein save karta hai.

  JSON.stringify()
  JavaScript Array → String
*/

function saveState() {

  localStorage.setItem(
    STORAGE_KEYS.salary,
    String(salary)
  );

  localStorage.setItem(
    STORAGE_KEYS.expenses,
    JSON.stringify(expenses)
  );

  localStorage.setItem(
    STORAGE_KEYS.currency,
    selectedCurrency
  );
}


/* ========================================================
   CALCULATIONS
======================================================== */

function getTotalExpenses() {

  return expenses.reduce(
    (total, expense) => {

      return total + Number(expense.amount);

    },
    0
  );
}


function getRemainingBalance() {

  return salary - getTotalExpenses();
}


/*
  Base data INR mein stored hai.

  Example:

  salary = 50000 INR

  USD rate = 0.012

  display =
  50000 × 0.012
  = $600
*/

function convertAmount(amount) {

  const rate =
    currencyRates[selectedCurrency] || 1;

  return amount * rate;
}


function formatMoney(amount) {

  const config =
    currencyConfig[selectedCurrency];

  const converted =
    convertAmount(amount);

  return new Intl.NumberFormat(
    config.locale,
    {
      style: "currency",
      currency: selectedCurrency,
      maximumFractionDigits: 2
    }
  ).format(converted);
}


/* ========================================================
   CATEGORY DETECTION
======================================================== */

function getCategory(name) {

  const value =
    name.toLowerCase();

  if (
    value.includes("rent") ||
    value.includes("home") ||
    value.includes("apartment")
  ) {

    return {
      name: "Home",
      icon: "🏠"
    };

  }


  if (
    value.includes("food") ||
    value.includes("grocery") ||
    value.includes("lunch") ||
    value.includes("dinner")
  ) {

    return {
      name: "Food",
      icon: "🍴"
    };

  }


  if (
    value.includes("internet") ||
    value.includes("software") ||
    value.includes("phone") ||
    value.includes("tech")
  ) {

    return {
      name: "Technology",
      icon: "💻"
    };

  }


  return {
    name: "Other",
    icon: "📦"
  };
}


/* ========================================================
   DATE FORMAT
======================================================== */

function formatDate(dateString) {

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}


/* ========================================================
   RENDER SUMMARY
======================================================== */

function renderSummary() {

  const totalExpenses =
    getTotalExpenses();

  const remaining =
    getRemainingBalance();


  /*
    Salary
  */

  elements.salaryDisplay.textContent =
    formatMoney(salary);


  /*
    Expenses
  */

  elements.expenseTotal.textContent =
    formatMoney(totalExpenses);


  /*
    Remaining balance
  */

  elements.remainingBalance.textContent =
    formatMoney(remaining);


  /*
    Percentage
  */

  let percentage = 0;

  if (salary > 0) {

    percentage =
      (remaining / salary) * 100;

  }


  const safePercentage =
    Math.max(0, percentage);


  elements.balancePercentage.textContent =
    `${safePercentage.toFixed(1)}% of salary remaining`;


  /*
    Critical threshold

    Remaining < 10% salary
  */

  const isCritical =
    salary > 0 &&
    remaining < salary * 0.10;


  if (isCritical) {

    elements.criticalAlert.classList.remove(
      "hidden"
    );

    elements.remainingBalance.style.color =
      "var(--danger)";

    elements.balanceCard.style.borderColor =
      "#fecaca";

  } else {

    elements.criticalAlert.classList.add(
      "hidden"
    );

    elements.remainingBalance.style.color =
      "";

    elements.balanceCard.style.borderColor =
      "";

  }


  /*
    Negative balance
  */

  if (remaining < 0) {

    elements.balancePercentage.textContent =
      `Over budget by ${formatMoney(
        Math.abs(remaining)
      )}`;

  }


  /*
    Chart legend
  */

  elements.chartExpenseValue.textContent =
    formatMoney(totalExpenses);

  elements.chartBalanceValue.textContent =
    formatMoney(Math.max(remaining, 0));
}


/* ========================================================
   RENDER EXPENSE LIST
======================================================== */

function renderExpenses() {

  elements.expenseList.innerHTML = "";

  elements.expenseCount.textContent =
    expenses.length;


  /*
    No expenses
  */

  if (expenses.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "empty-state";

    empty.innerHTML = `
      <div class="empty-icon">🧾</div>

      <strong>No expenses yet</strong>

      <span>
        Add your first expense to start tracking.
      </span>
    `;

    elements.expenseList.appendChild(empty);

    return;
  }


  /*
    Newest first
  */

  const sortedExpenses =
    [...expenses].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );


  sortedExpenses.forEach(
    expense => {

      const row =
        createExpenseRow(expense);

      elements.expenseList.appendChild(row);

    }
  );
}


/* ========================================================
   CREATE EXPENSE ROW
======================================================== */

function createExpenseRow(expense) {

  const row =
    document.createElement("div");

  row.className =
    "expense-row";


  /*
    Main section
  */

  const main =
    document.createElement("div");

  main.className =
    "expense-main";


  /*
    Category icon
  */

  const category =
    getCategory(expense.name);

  const categoryElement =
    document.createElement("div");

  categoryElement.className =
    "expense-category";

  categoryElement.textContent =
    category.icon;


  /*
    Expense info
  */

  const info =
    document.createElement("div");

  info.className =
    "expense-info";


  const name =
    document.createElement("div");

  name.className =
    "expense-name";

  /*
    textContent use kar rahe hain
    taaki user input HTML inject na kar sake.
  */

  name.textContent =
    expense.name;


  const date =
    document.createElement("div");

  date.className =
    "expense-date";

  date.textContent =
    `${category.name} • ${formatDate(
      expense.date
    )}`;


  info.appendChild(name);
  info.appendChild(date);


  main.appendChild(categoryElement);
  main.appendChild(info);


  /*
    Amount
  */

  const amount =
    document.createElement("div");

  amount.className =
    "expense-amount";

  amount.textContent =
    `-${formatMoney(expense.amount)}`;


  /*
    Delete button
  */

  const deleteButton =
    document.createElement("button");

  deleteButton.className =
    "delete-button";

  deleteButton.type =
    "button";

  deleteButton.textContent =
    "🗑";

  deleteButton.setAttribute(
    "aria-label",
    `Delete ${expense.name}`
  );


  deleteButton.addEventListener(
    "click",
    () => {

      showDeleteConfirmation(
        row,
        expense.id
      );

    }
  );


  row.appendChild(main);
  row.appendChild(amount);
  row.appendChild(deleteButton);


  return row;
}


/* ========================================================
   DELETE CONFIRMATION
======================================================== */

function showDeleteConfirmation(
  row,
  expenseId
) {

  const existing =
    row.querySelector(
      ".delete-confirm"
    );

  if (existing) {
    return;
  }


  const button =
    row.querySelector(
      ".delete-button"
    );

  if (button) {
    button.style.display = "none";
  }


  const confirmation =
    document.createElement("div");

  confirmation.className =
    "delete-confirm";


  const text =
    document.createElement("span");

  text.className =
    "confirm-text";

  text.textContent =
    "Delete?";


  const yes =
    document.createElement("button");

  yes.className =
    "confirm-yes";

  yes.textContent =
    "Yes";


  const no =
    document.createElement("button");

  no.className =
    "confirm-no";

  no.textContent =
    "No";


  yes.addEventListener(
    "click",
    () => {

      deleteExpense(expenseId);

    }
  );


  no.addEventListener(
    "click",
    () => {

      confirmation.remove();

      if (button) {
        button.style.display = "";
      }

    }
  );


  confirmation.appendChild(text);
  confirmation.appendChild(yes);
  confirmation.appendChild(no);

  row.appendChild(confirmation);
}


/* ========================================================
   DELETE EXPENSE
======================================================== */

function deleteExpense(id) {

  expenses =
    expenses.filter(
      expense =>
        expense.id !== id
    );


  /*
    Update localStorage
  */

  saveState();


  /*
    Update DOM
  */

  renderAll();


  showToast(
    "Expense deleted successfully."
  );
}


/* ========================================================
   CHART.JS
======================================================== */

function renderChart() {

  const totalExpenses =
    getTotalExpenses();

  const remaining =
    Math.max(
      getRemainingBalance(),
      0
    );


  /*
    Chart already exists.

    Assignment FAQ:
    destroy previous instance
    before creating a new one.
  */

  if (chartInstance) {

    chartInstance.destroy();

    chartInstance = null;

  }


  /*
    If no salary, show empty chart.
  */

  const expenseData =
    salary > 0
      ? totalExpenses
      : 0;

  const remainingData =
    salary > 0
      ? remaining
      : 1;


  chartInstance =
    new Chart(
      elements.expenseChart,
      {
        type: "doughnut",

        data: {

          labels: [
            "Total Expenses",
            "Remaining Balance"
          ],

          datasets: [
            {
              data: [
                expenseData,
                remainingData
              ],

              backgroundColor: [
                "#4f46e5",
                "#cbd5e1"
              ],

              borderWidth: 0,

              hoverOffset: 5
            }
          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          cutout: "72%",

          plugins: {

            legend: {
              display: false
            },

            tooltip: {

              callbacks: {

                label: function(context) {

                  return `${context.label}: ${formatMoney(
                    context.raw
                  )}`;

                }

              }

            }

          }

        }

      }
    );
}


/* ========================================================
   ADD EXPENSE VALIDATION
======================================================== */

function validateExpense() {

  let valid = true;


  const name =
    elements.expenseName.value.trim();

  const amountValue =
    elements.expenseAmount.value.trim();


  /*
    Reset errors
  */

  elements.nameError.textContent = "";

  elements.amountError.textContent = "";

  elements.expenseName.classList.remove(
    "input-error"
  );

  elements.expenseAmount.classList.remove(
    "input-error"
  );


  /*
    Name validation
  */

  if (!name) {

    elements.nameError.textContent =
      "Expense name is required.";

    elements.expenseName.classList.add(
      "input-error"
    );

    valid = false;

  }


  /*
    Amount validation
  */

  if (!amountValue) {

    elements.amountError.textContent =
      "Expense amount is required.";

    elements.expenseAmount.classList.add(
      "input-error"
    );

    valid = false;

  } else {

    const amount =
      Number(amountValue);


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      elements.amountError.textContent =
        "Amount must be greater than 0.";

      elements.expenseAmount.classList.add(
        "input-error"
      );

      valid = false;

    }

  }


  return valid;
}


/* ========================================================
   ADD EXPENSE
======================================================== */

elements.expenseForm.addEventListener(
  "submit",
  function(event) {

    /*
      Prevent browser page reload.
    */

    event.preventDefault();


    /*
      Validation
    */

    if (!validateExpense()) {
      return;
    }


    const name =
      elements.expenseName.value.trim();

    const amount =
      Number(
        elements.expenseAmount.value
      );


    /*
      Create new expense object
    */

    const expense = {

      id:
        Date.now(),

      name,

      amount,

      date:
        new Date().toISOString(),

      category:
        getCategory(name).name

    };


    /*
      Add to state
    */

    expenses.push(expense);


    /*
      Save to localStorage
    */

    saveState();


    /*
      Clear form
    */

    elements.expenseForm.reset();


    /*
      Re-render application
    */

    renderAll();


    /*
      Success message
    */

    showToast(
      "Expense added successfully."
    );

  }
);


/* ========================================================
   SALARY FORM
======================================================== */

elements.salaryForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const value =
      Number(
        elements.salaryInput.value
      );


    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {

      showToast(
        "Salary must be greater than 0.",
        "error"
      );

      return;
    }


    salary = value;


    saveState();

    renderAll();


    elements.salaryForm.classList.add(
      "hidden"
    );

    elements.editSalary.classList.remove(
      "hidden"
    );


    showToast(
      "Salary updated successfully."
    );

  }
);


/* ========================================================
   EDIT SALARY
======================================================== */

elements.editSalary.addEventListener(
  "click",
  function() {

    elements.salaryInput.value =
      salary || "";

    elements.salaryForm.classList.remove(
      "hidden"
    );

    elements.editSalary.classList.add(
      "hidden"
    );

    elements.salaryInput.focus();

  }
);


/* ========================================================
   CURRENCY
======================================================== */

function updateCurrencyUI() {

  const config =
    currencyConfig[selectedCurrency];


  elements.navCurrency.value =
    selectedCurrency;

  elements.headerCurrency.value =
    selectedCurrency;


  elements.currencySymbol.textContent =
    config.symbol;


  renderAll();
}


/*
  Currency API

  Frankfurter free endpoint.

  INR → USD/EUR/GBP
*/

async function fetchCurrencyRates() {

  try {

    /*
      Frankfurter supports
      EUR-based conversion directly.

      For maximum reliability,
      we use the API only for
      USD/EUR/GBP rates when possible.
    */

    const response =
      await fetch(
        "https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP"
      );


    if (!response.ok) {
      throw new Error(
        "Currency API request failed."
      );
    }


    const data =
      await response.json();


    if (data.rates) {

      currencyRates = {

        INR: 1,

        USD:
          data.rates.USD ||
          currencyRates.USD,

        EUR:
          data.rates.EUR ||
          currencyRates.EUR,

        GBP:
          data.rates.GBP ||
          currencyRates.GBP

      };

    }


    return true;

  } catch (error) {

    console.warn(
      "Using fallback currency rates:",
      error
    );

    /*
      Application still works
      using fallback rates.
    */

    return false;
  }
}


/*
  Change currency
*/

async function changeCurrency(
  newCurrency
) {

  if (
    newCurrency ===
    selectedCurrency
  ) {
    return;
  }


  elements.currencyLoading.classList.remove(
    "hidden"
  );


  /*
    API call
  */

  await fetchCurrencyRates();


  /*
    Update selected currency
  */

  selectedCurrency =
    newCurrency;


  /*
    Save state
  */

  saveState();


  /*
    Update UI
  */

  updateCurrencyUI();


  /*
    Hide loading
  */

  elements.currencyLoading.classList.add(
    "hidden"
  );


  showToast(
    `Amounts converted to ${newCurrency}.`
  );
}


/*
  Both currency selectors
*/

elements.navCurrency.addEventListener(
  "change",
  event => {

    changeCurrency(
      event.target.value
    );

  }
);


elements.headerCurrency.addEventListener(
  "change",
  event => {

    changeCurrency(
      event.target.value
    );

  }
);


/* ========================================================
   PDF REPORT — jsPDF
======================================================== */

function generatePDFReport() {

  /*
    Check jsPDF
  */

  if (
    !window.jspdf ||
    !window.jspdf.jsPDF
  ) {

    showToast(
      "PDF library could not be loaded.",
      "error"
    );

    return;
  }


  const {
    jsPDF
  } = window.jspdf;


  const doc =
    new jsPDF();


  const totalExpenses =
    getTotalExpenses();

  const remaining =
    getRemainingBalance();


  /*
    Header
  */

  doc.setFontSize(22);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Cash-Flow Financial Report",
    20,
    25
  );


  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    20,
    34
  );


  /*
    Summary
  */

  doc.setFontSize(14);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Financial Summary",
    20,
    50
  );


  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    `Total Salary: ${formatMoney(salary)}`,
    20,
    62
  );

  doc.text(
    `Total Expenses: ${formatMoney(totalExpenses)}`,
    20,
    71
  );

  doc.text(
    `Remaining Balance: ${formatMoney(remaining)}`,
    20,
    80
  );


  /*
    Expenses
  */

  doc.setFontSize(14);

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.text(
    "Expense List",
    20,
    98
  );


  let y =
    110;


  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );


  if (expenses.length === 0) {

    doc.text(
      "No expenses recorded.",
      20,
      y
    );

  } else {

    expenses.forEach(
      (expense, index) => {

        /*
          New page if needed.
        */

        if (y > 270) {

          doc.addPage();

          y = 20;

        }


        const line =
          `${index + 1}. ${expense.name} — ${formatMoney(
            expense.amount
          )} — ${formatDate(
            expense.date
          )}`;


        doc.text(
          line,
          20,
          y
        );


        y += 9;

      }
    );

  }


  /*
    Save PDF
  */

  doc.save(
    "cash-flow-report.pdf"
  );


  showToast(
    "PDF report downloaded."
  );
}


elements.downloadReport.addEventListener(
  "click",
  generatePDFReport
);


elements.downloadReportBottom.addEventListener(
  "click",
  generatePDFReport
);


/* ========================================================
   TOAST
======================================================== */

function showToast(
  message,
  type = "success"
) {

  clearTimeout(toastTimer);


  elements.toastMessage.textContent =
    message;


  if (type === "error") {

    elements.toastIcon.textContent =
      "!";

    elements.toastIcon.style.background =
      "var(--danger)";

  } else {

    elements.toastIcon.textContent =
      "✓";

    elements.toastIcon.style.background =
      "var(--success)";

  }


  elements.toast.classList.add(
    "show"
  );


  toastTimer =
    setTimeout(
      () => {

        elements.toast.classList.remove(
          "show"
        );

      },
      3500
    );
}


/* ========================================================
   MOBILE MENU
======================================================== */

elements.menuButton.addEventListener(
  "click",
  function() {

    elements.mobileMenu.classList.toggle(
      "open"
    );

  }
);


document
  .querySelectorAll(
    ".mobile-menu a"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          elements.mobileMenu.classList.remove(
            "open"
          );

        }
      );

    }
  );


/* ========================================================
   GLOBAL INPUT ERROR RESET
======================================================== */

elements.expenseName.addEventListener(
  "input",
  function() {

    this.classList.remove(
      "input-error"
    );

    elements.nameError.textContent =
      "";

  }
);


elements.expenseAmount.addEventListener(
  "input",
  function() {

    this.classList.remove(
      "input-error"
    );

    elements.amountError.textContent =
      "";

  }
);


/* ========================================================
   MASTER RENDER FUNCTION
======================================================== */

function renderAll() {

  /*
    P0:
    Calculate and display values.
  */

  renderSummary();


  /*
    P1:
    Render expense list.
  */

  renderExpenses();


  /*
    P1:
    Render Chart.js.
  */

  renderChart();


  /*
    Update currency UI.
  */

  const config =
    currencyConfig[selectedCurrency];

  elements.currencySymbol.textContent =
    config.symbol;
}


/* ========================================================
   INITIALIZE APPLICATION
======================================================== */

async function initializeApp() {

  /*
    Load currency rates.

    If API fails,
    fallback rates remain active.
  */

  await fetchCurrencyRates();


  /*
    Sync currency selectors.
  */

  updateCurrencyUI();


  /*
    Render saved state.
  */

  renderAll();


  /*
    Salary input
  */

  elements.salaryInput.value =
    salary || "";


  console.log(
    "Cash-Flow initialized successfully."
  );

  console.log(
    "Salary:",
    salary
  );

  console.log(
    "Expenses:",
    expenses
  );

}


/*
  Start application
*/

initializeApp();