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
   APPLICATION STATE
======================================================== */

let salary = loadSalary();

let expenses = loadExpenses();

const savedCurrency =
  localStorage.getItem(
    STORAGE_KEYS.currency
  );

let selectedCurrency =
  currencyConfig[savedCurrency]
    ? savedCurrency
    : "INR";

let chartInstance = null;

let toastTimer = null;


/*
  Fallback currency rates.

  Base currency:
  INR
*/

let currencyRates = {

  INR: 1,

  USD: 0.012,

  EUR: 0.011,

  GBP: 0.0095

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

function loadSalary() {

  const savedSalary =
    localStorage.getItem(
      STORAGE_KEYS.salary
    );

  if (savedSalary === null) {
    return 0;
  }

  const parsedSalary =
    Number(savedSalary);

  if (
    Number.isFinite(parsedSalary) &&
    parsedSalary >= 0
  ) {
    return parsedSalary;
  }

  return 0;
}


function loadExpenses() {

  const savedExpenses =
    localStorage.getItem(
      STORAGE_KEYS.expenses
    );

  if (!savedExpenses) {
    return [];
  }

  try {

    const parsedExpenses =
      JSON.parse(savedExpenses);

    if (!Array.isArray(parsedExpenses)) {
      return [];
    }

    return parsedExpenses.filter(
      function (expense) {

        return (
          expense &&
          typeof expense.name === "string" &&
          Number.isFinite(
            Number(expense.amount)
          ) &&
          Number(expense.amount) > 0 &&
          expense.date
        );

      }
    );

  } catch (error) {

    console.error(
      "Could not parse expenses:",
      error
    );

    return [];
  }
}


function saveState() {

  try {

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

  } catch (error) {

    console.error(
      "Could not save application state:",
      error
    );

    showToast(
      "Could not save data.",
      "error"
    );
  }
}


/* ========================================================
   CALCULATIONS
======================================================== */

function getTotalExpenses() {

  return expenses.reduce(
    function (total, expense) {

      return (
        total +
        Number(expense.amount)
      );

    },
    0
  );
}


function getRemainingBalance() {

  return (
    salary -
    getTotalExpenses()
  );
}


/* ========================================================
   CURRENCY
======================================================== */

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


function updateCurrencyUI() {

  const config =
    currencyConfig[selectedCurrency];

  elements.navCurrency.value =
    selectedCurrency;

  elements.headerCurrency.value =
    selectedCurrency;

  elements.currencySymbol.textContent =
    config.symbol;
}


/* ========================================================
   CATEGORY
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
   DATE
======================================================== */

function formatDate(dateString) {

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "Unknown date";
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
   SUMMARY
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
    Balance
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
    Math.max(
      0,
      percentage
    );


  elements.balancePercentage.textContent =
    `${safePercentage.toFixed(1)}% of salary remaining`;


  /*
    Critical threshold
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
    Chart values
  */

  elements.chartExpenseValue.textContent =
    formatMoney(totalExpenses);

  elements.chartBalanceValue.textContent =
    formatMoney(
      Math.max(
        remaining,
        0
      )
    );
}


/* ========================================================
   EXPENSE LIST
======================================================== */

function renderExpenses() {

  elements.expenseList.innerHTML = "";

  elements.expenseCount.textContent =
    expenses.length;


  if (expenses.length === 0) {

    const empty =
      document.createElement("div");

    empty.className =
      "empty-state";


    const icon =
      document.createElement("div");

    icon.className =
      "empty-icon";

    icon.textContent =
      "🧾";


    const title =
      document.createElement("strong");

    title.textContent =
      "No expenses yet";


    const message =
      document.createElement("span");

    message.textContent =
      "Add your first expense to start tracking.";


    empty.appendChild(icon);
    empty.appendChild(title);
    empty.appendChild(message);

    elements.expenseList.appendChild(
      empty
    );

    return;
  }


  const sortedExpenses =
    [...expenses].sort(
      function (a, b) {

        return (
          new Date(b.date) -
          new Date(a.date)
        );
      }
    );


  sortedExpenses.forEach(
    function (expense) {

      const row =
        createExpenseRow(expense);

      elements.expenseList.appendChild(
        row
      );
    }
  );
}


/* ========================================================
   EXPENSE ROW
======================================================== */

function createExpenseRow(expense) {

  const row =
    document.createElement("div");

  row.className =
    "expense-row";


  /*
    Main
  */

  const main =
    document.createElement("div");

  main.className =
    "expense-main";


  /*
    Category
  */

  const category =
    getCategory(
      expense.name
    );


  const categoryElement =
    document.createElement("div");

  categoryElement.className =
    "expense-category";

  categoryElement.textContent =
    category.icon;

  categoryElement.setAttribute(
    "aria-label",
    category.name
  );


  /*
    Information
  */

  const info =
    document.createElement("div");

  info.className =
    "expense-info";


  const name =
    document.createElement("div");

  name.className =
    "expense-name";

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

  main.appendChild(
    categoryElement
  );

  main.appendChild(
    info
  );


  /*
    Amount
  */

  const amount =
    document.createElement("div");

  amount.className =
    "expense-amount";

  amount.textContent =
    `-${formatMoney(
      expense.amount
    )}`;


  /*
    Delete
  */

  const deleteButton =
    document.createElement("button");

  deleteButton.type =
    "button";

  deleteButton.className =
    "delete-button";

  deleteButton.textContent =
    "🗑";

  deleteButton.setAttribute(
    "aria-label",
    `Delete ${expense.name}`
  );


  deleteButton.addEventListener(
    "click",
    function () {

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


  const deleteButton =
    row.querySelector(
      ".delete-button"
    );

  if (deleteButton) {

    deleteButton.style.display =
      "none";
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

  yes.type =
    "button";

  yes.className =
    "confirm-yes";

  yes.textContent =
    "Yes";


  const no =
    document.createElement("button");

  no.type =
    "button";

  no.className =
    "confirm-no";

  no.textContent =
    "No";


  yes.addEventListener(
    "click",
    function () {

      deleteExpense(
        expenseId
      );
    }
  );


  no.addEventListener(
    "click",
    function () {

      confirmation.remove();

      if (deleteButton) {

        deleteButton.style.display =
          "";
      }
    }
  );


  confirmation.appendChild(text);
  confirmation.appendChild(yes);
  confirmation.appendChild(no);

  row.appendChild(
    confirmation
  );
}


/* ========================================================
   DELETE EXPENSE
======================================================== */

function deleteExpense(id) {

  expenses =
    expenses.filter(
      function (expense) {

        return expense.id !== id;
      }
    );


  saveState();

  renderAll();

  showToast(
    "Expense deleted successfully."
  );
}


/* ========================================================
   CHART
======================================================== */

function renderChart() {

  if (!window.Chart) {

    console.error(
      "Chart.js could not be loaded."
    );

    return;
  }


  const totalExpenses =
    getTotalExpenses();

  const remaining =
    Math.max(
      getRemainingBalance(),
      0
    );


  /*
    Destroy old chart.
  */

  if (chartInstance) {

    chartInstance.destroy();

    chartInstance = null;
  }


  /*
    Empty chart when salary
    is not entered.
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

                label:
                  function (context) {

                    return (
                      `${context.label}: ` +
                      `${formatMoney(
                        context.raw
                      )}`
                    );
                  }
              }
            }
          }
        }
      }
    );
}


/* ========================================================
   VALIDATION
======================================================== */

function validateExpense() {

  let valid = true;


  const name =
    elements.expenseName.value.trim();

  const amountValue =
    elements.expenseAmount.value.trim();


  /*
    Reset errors.
  */

  elements.nameError.textContent =
    "";

  elements.amountError.textContent =
    "";

  elements.expenseName.classList.remove(
    "input-error"
  );

  elements.expenseAmount.classList.remove(
    "input-error"
  );


  /*
    Name
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
    Amount
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
  function (event) {

    event.preventDefault();


    if (!validateExpense()) {
      return;
    }


    const name =
      elements.expenseName.value.trim();

    const amount =
      Number(
        elements.expenseAmount.value
      );


    const expense = {

      id:
        crypto.randomUUID(),

      name,

      amount,

      date:
        new Date().toISOString(),

      category:
        getCategory(name).name
    };


    expenses.push(
      expense
    );


    saveState();


    elements.expenseForm.reset();


    renderAll();


    showToast(
      "Expense added successfully."
    );
  }
);


/* ========================================================
   SALARY
======================================================== */

elements.salaryForm.addEventListener(
  "submit",
  function (event) {

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
  function () {

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
   CURRENCY API
======================================================== */

async function fetchCurrencyRates() {

  try {

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


    if (
      data.rates &&
      typeof data.rates === "object"
    ) {

      currencyRates = {

        INR: 1,

        USD:
          Number(data.rates.USD) ||
          currencyRates.USD,

        EUR:
          Number(data.rates.EUR) ||
          currencyRates.EUR,

        GBP:
          Number(data.rates.GBP) ||
          currencyRates.GBP
      };
    }


    return true;

  } catch (error) {

    console.warn(
      "Currency API failed. Using fallback rates.",
      error
    );

    return false;
  }
}


/* ========================================================
   CHANGE CURRENCY
======================================================== */

async function changeCurrency(
  newCurrency
) {

  if (
    !currencyConfig[newCurrency]
  ) {
    return;
  }


  if (
    newCurrency ===
    selectedCurrency
  ) {
    return;
  }


  elements.currencyLoading.classList.remove(
    "hidden"
  );


  await fetchCurrencyRates();


  selectedCurrency =
    newCurrency;


  saveState();


  updateCurrencyUI();

  renderAll();


  elements.currencyLoading.classList.add(
    "hidden"
  );


  showToast(
    `Amounts converted to ${newCurrency}.`
  );
}


/* ========================================================
   CURRENCY SELECTORS
======================================================== */

elements.navCurrency.addEventListener(
  "change",
  function (event) {

    changeCurrency(
      event.target.value
    );
  }
);


elements.headerCurrency.addEventListener(
  "change",
  function (event) {

    changeCurrency(
      event.target.value
    );
  }
);


/* ========================================================
   PDF REPORT
======================================================== */

function generatePDFReport() {

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


  const pageWidth =
    doc.internal.pageSize.getWidth();

  const pageHeight =
    doc.internal.pageSize.getHeight();

  const margin = 20;


  /*
  =========================================================
  HEADER
  =========================================================
  */

  doc.setFillColor(
    15,
    23,
    42
  );

  doc.rect(
    0,
    0,
    pageWidth,
    42,
    "F"
  );


  doc.setTextColor(
    255,
    255,
    255
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    22
  );

  doc.text(
    "Cash-Flow",
    margin,
    18
  );


  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(
    10
  );

  doc.text(
    "Salary & Expense Report",
    margin,
    27
  );


  const generatedDate =
    new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );


  doc.text(
    `Generated: ${generatedDate}`,
    pageWidth - margin,
    22,
    {
      align: "right"
    }
  );


  /*
  =========================================================
  SUMMARY
  =========================================================
  */

  doc.setTextColor(
    15,
    23,
    42
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    15
  );

  doc.text(
    "Financial Summary",
    margin,
    58
  );


  const cardTop = 66;

  const cardGap = 6;

  const cardWidth =
    (
      pageWidth -
      margin * 2 -
      cardGap * 2
    ) / 3;

  const cardHeight = 35;


  drawSummaryCard(
    doc,
    margin,
    cardTop,
    cardWidth,
    cardHeight,
    "TOTAL SALARY",
    getPDFMoney(salary)
  );


  drawSummaryCard(
    doc,
    margin +
      cardWidth +
      cardGap,
    cardTop,
    cardWidth,
    cardHeight,
    "TOTAL EXPENSES",
    getPDFMoney(totalExpenses)
  );


  drawSummaryCard(
    doc,
    margin +
      (cardWidth + cardGap) * 2,
    cardTop,
    cardWidth,
    cardHeight,
    "REMAINING BALANCE",
    getPDFMoney(remaining)
  );


  /*
  =========================================================
  EXPENSE DETAILS
  =========================================================
  */

  let y = 122;


  doc.setTextColor(
    15,
    23,
    42
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    15
  );

  doc.text(
    "Expense Details",
    margin,
    y
  );


  y += 10;


  const tableX =
    margin;

  const tableWidth =
    pageWidth -
    margin * 2;


  /*
    Table columns
  */

  const colNo = 14;

  const colName = 75;

  const colDate = 42;


  /*
    Table header
  */

  drawTableHeader(
    doc,
    tableX,
    y,
    tableWidth,
    12
  );


  y += 12;


  const sortedExpenses =
    [...expenses].sort(
      function (a, b) {

        return (
          new Date(b.date) -
          new Date(a.date)
        );
      }
    );


  /*
    Empty state
  */

  if (
    sortedExpenses.length === 0
  ) {

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(
      10
    );

    doc.setTextColor(
      100,
      116,
      139
    );

    doc.text(
      "No expenses recorded.",
      tableX + 5,
      y + 8
    );

  } else {

    sortedExpenses.forEach(
      function (expense, index) {

        /*
          New page
        */

        if (
          y >
          pageHeight - 35
        ) {

          addPDFPageFooter(
            doc,
            pageWidth,
            pageHeight
          );

          doc.addPage();

          y = 25;


          drawTableHeader(
            doc,
            tableX,
            y,
            tableWidth,
            12
          );

          y += 12;
        }


        /*
          Alternate row
        */

        if (
          index % 2 === 0
        ) {

          doc.setFillColor(
            248,
            250,
            252
          );

          doc.rect(
            tableX,
            y,
            tableWidth,
            13,
            "F"
          );
        }


        /*
          Row text
        */

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(
          9
        );

        doc.setTextColor(
          15,
          23,
          42
        );


        /*
          Number
        */

        doc.text(
          String(index + 1),
          tableX + 4,
          y + 8
        );


        /*
          Expense name
        */

        const expenseName =
          expense.name.length > 32
            ? expense.name.substring(
                0,
                32
              ) + "..."
            : expense.name;


        doc.text(
          expenseName,
          tableX + colNo,
          y + 8
        );


        /*
          Date
        */

        doc.setTextColor(
          71,
          85,
          105
        );


        doc.text(
          formatDate(
            expense.date
          ),
          tableX +
            colNo +
            colName,
          y + 8
        );


        /*
          Amount
        */

        doc.setTextColor(
          15,
          23,
          42
        );

        doc.setFont(
          "helvetica",
          "bold"
        );


        const pdfAmount =
          getPDFMoney(
            expense.amount
          );


        doc.text(
          pdfAmount,
          pageWidth - margin - 4,
          y + 8,
          {
            align: "right"
          }
        );


        /*
          Row border
        */

        doc.setDrawColor(
          226,
          232,
          240
        );

        doc.setLineWidth(
          0.2
        );

        doc.line(
          tableX,
          y + 13,
          tableX + tableWidth,
          y + 13
        );


        y += 13;
      }
    );
  }


  /*
  =========================================================
  FINAL BALANCE
  =========================================================
  */

  y += 12;


  if (
    y >
    pageHeight - 55
  ) {

    addPDFPageFooter(
      doc,
      pageWidth,
      pageHeight
    );

    doc.addPage();

    y = 30;
  }


  doc.setFillColor(
    239,
    246,
    255
  );


  doc.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    38,
    4,
    4,
    "F"
  );


  doc.setTextColor(
    30,
    41,
    59
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    10
  );


  doc.text(
    "FINAL BALANCE",
    margin + 8,
    y + 12
  );


  doc.setFontSize(
    18
  );


  if (remaining < 0) {

    doc.setTextColor(
      220,
      38,
      38
    );

  } else {

    doc.setTextColor(
      22,
      163,
      74
    );
  }


  doc.text(
    getPDFMoney(remaining),
    margin + 8,
    y + 27
  );


  /*
  =========================================================
  10% WARNING
  =========================================================
  */

  if (
    salary > 0 &&
    remaining < salary * 0.10
  ) {

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(
      9
    );

    doc.setTextColor(
      220,
      38,
      38
    );


    doc.text(
      "Warning: Remaining balance is below 10% of salary.",
      pageWidth - margin,
      y + 12,
      {
        align: "right"
      }
    );
  }


  /*
  =========================================================
  FOOTER
  =========================================================
  */

  addPDFPageFooter(
    doc,
    pageWidth,
    pageHeight
  );


  /*
  =========================================================
  DOWNLOAD
  =========================================================
  */

  doc.save(
    "cash-flow-report.pdf"
  );


  showToast(
    "PDF report downloaded."
  );
}


/* ========================================================
   PDF MONEY
======================================================== */

function getPDFMoney(amount) {

  return (
    `${selectedCurrency} ` +
    `${convertAmount(amount).toFixed(2)}`
  );
}


/* ========================================================
   PDF SUMMARY CARD
======================================================== */

function drawSummaryCard(
  doc,
  x,
  y,
  width,
  height,
  label,
  value
) {

  doc.setFillColor(
    248,
    250,
    252
  );


  doc.roundedRect(
    x,
    y,
    width,
    height,
    4,
    4,
    "F"
  );


  doc.setTextColor(
    100,
    116,
    139
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    7
  );


  doc.text(
    label,
    x + 6,
    y + 10
  );


  doc.setTextColor(
    15,
    23,
    42
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    12
  );


  doc.text(
    value,
    x + 6,
    y + 24
  );
}


/* ========================================================
   PDF TABLE HEADER
======================================================== */

function drawTableHeader(
  doc,
  x,
  y,
  width,
  height
) {

  doc.setFillColor(
    15,
    23,
    42
  );


  doc.roundedRect(
    x,
    y,
    width,
    height,
    2,
    2,
    "F"
  );


  doc.setTextColor(
    255,
    255,
    255
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    8
  );


  doc.text(
    "#",
    x + 4,
    y + 8
  );


  doc.text(
    "EXPENSE",
    x + 14,
    y + 8
  );


  doc.text(
    "DATE",
    x + 89,
    y + 8
  );


  doc.text(
    "AMOUNT",
    x + width - 4,
    y + 8,
    {
      align: "right"
    }
  );
}


/* ========================================================
   PDF FOOTER
======================================================== */

function addPDFPageFooter(
  doc,
  pageWidth,
  pageHeight
) {

  const pageNumber =
    doc.internal.getNumberOfPages();


  doc.setDrawColor(
    226,
    232,
    240
  );


  doc.setLineWidth(
    0.3
  );


  doc.line(
    20,
    pageHeight - 18,
    pageWidth - 20,
    pageHeight - 18
  );


  doc.setTextColor(
    100,
    116,
    139
  );


  doc.setFont(
    "helvetica",
    "normal"
  );


  doc.setFontSize(
    8
  );


  doc.text(
    "Cash-Flow — Salary & Expense Tracker",
    20,
    pageHeight - 10
  );


  doc.text(
    `Page ${pageNumber}`,
    pageWidth - 20,
    pageHeight - 10,
    {
      align: "right"
    }
  );
}


/* ========================================================
   PDF BUTTONS
======================================================== */

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

  clearTimeout(
    toastTimer
  );


  elements.toastMessage.textContent =
    message;


  if (
    type === "error"
  ) {

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
      function () {

        elements.toast.classList.remove(
          "show"
        );

      },
      3500
    );
}



elements.menuButton.addEventListener(
  "click",
  function () {

    const isOpen =
      elements.mobileMenu.classList.toggle(
        "open"
      );


    elements.menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  }
);


document
  .querySelectorAll(".mobile-menu a")
  .forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          elements.mobileMenu.classList.remove(
            "open"
          );

          elements.menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );
    }
  );


elements.expenseName.addEventListener(
  "input",
  function () {

    this.classList.remove(
      "input-error"
    );

    elements.nameError.textContent =
      "";
  }
);


elements.expenseAmount.addEventListener(
  "input",
  function () {

    this.classList.remove(
      "input-error"
    );

    elements.amountError.textContent =
      "";
  }
);




function renderAll() {

  renderSummary();

  renderExpenses();

  renderChart();

  updateCurrencyUI();
}


/* ========================================================
   INITIALIZE
======================================================== */

async function initializeApp() {

  /*
    Get latest currency rates.
  */

  await fetchCurrencyRates();


  /*
    Set currency UI.
  */

  updateCurrencyUI();


  /*
    Render saved data.
  */

  renderAll();


  /*
    Salary field.
  */

  elements.salaryInput.value =
    salary || "";


  /*
    Salary form state.
  */

  if (salary > 0) {

    elements.salaryForm.classList.add(
      "hidden"
    );

    elements.editSalary.classList.remove(
      "hidden"
    );

  } else {

    elements.salaryForm.classList.remove(
      "hidden"
    );

    elements.editSalary.classList.add(
      "hidden"
    );
  }


  console.log(
    "Cash-Flow initialized successfully."
  );
}




initializeApp();