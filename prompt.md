# Prompts.md

# Cash-Flow — Sprint 02
## Development & AI Assistance Notes

I worked on this Sprint 02 assignment step by step. My main goal was to understand the required functionality and implement it using Vanilla JavaScript.

I used AI as a learning and development assistant during the process. Whenever I was stuck with a JavaScript concept, debugging issue, API integration, LocalStorage, Chart.js or PDF generation, I used AI to understand the problem and find a suitable approach.

I tested the changes in my own project and checked the functionality in the browser.

---

## 1. Understanding the Assignment

### Prompt

> Explain this Cash-Flow Sprint 02 assignment in simple terms. Tell me what I need to implement in P0, P1 and P2. Do not add features outside the assignment requirements.

### What I understood

I divided the assignment into three parts:

- P0 — Salary, expenses, validation and balance calculation
- P1 — LocalStorage, delete expense and Chart.js
- P2 — PDF report, currency conversion and low-balance alert

I started with P0 and then moved towards P1 and P2.

---

## 2. Basic Salary and Expense Logic

### Prompt

> I am creating a salary and expense tracker using Vanilla JavaScript. Explain how I can store salary and expenses and calculate total expenses and remaining balance in a simple beginner-friendly way.

### Logic

The main calculation is:


Total Expenses = Sum of all expenses

Remaining Balance = Total Salary - Total Expenses


For example:


Salary = ₹50,000

Food = ₹5,000
Travel = ₹3,000
Internet = ₹1,000

Total Expenses = ₹9,000

Remaining Balance = ₹50,000 - ₹9,000
                  = ₹41,000

I implemented this calculation in JavaScript and update it whenever the salary or expenses change.


## 3. Form Validation

### Prompt

> Explain how to validate salary, expense name and expense amount using Vanilla JavaScript. I need to prevent empty and negative values. Keep the code simple.

### What I implemented

I added validation for:

- Empty salary
- Empty expense name
- Empty expense amount
- Negative salary
- Negative expense amount

If invalid data is entered, the application stops the operation and displays an error message.

---

## 4. DOM Manipulation

### Prompt

> Explain how to dynamically add expenses to the page using Vanilla JavaScript DOM manipulation. Explain createElement, textContent and appendChild in simple terms.

### What I learned

Instead of manually writing every expense in HTML, JavaScript creates the expense elements dynamically.

The basic flow is:

```text
User enters expense
       ↓
JavaScript reads the input
       ↓
Expense object is created
       ↓
Expense is added to the array
       ↓
DOM is updated
       ↓
Total expenses are calculated
       ↓
Remaining balance is calculated
```

I used `textContent` when displaying user-entered expense names.

---

## 5. LocalStorage

### Prompt

> Explain LocalStorage in JavaScript in simple terms. Show me how to save salary and an expenses array using JSON.stringify and retrieve them using JSON.parse.

### What I learned

LocalStorage stores data as strings.

Therefore, objects and arrays need to be converted into JSON before storing them.

Example:

```js
localStorage.setItem(
  "cashflow-expenses",
  JSON.stringify(expenses)
);
```

To retrieve the data:

```js
const expenses = JSON.parse(
  localStorage.getItem("cashflow-expenses")
);
```

I used LocalStorage so that the salary and expenses remain available after refreshing the browser.

---

## 6. Delete Expense

### Prompt

> Explain a simple way to delete an expense from an array using its ID and then update LocalStorage and the DOM.

### My approach

Each expense has its own ID.

When the delete button is clicked:

```text
Delete expense
      ↓
Find expense using ID
      ↓
Remove it from array
      ↓
Save updated array
      ↓
Recalculate totals
      ↓
Update the UI
```

This also updates the remaining balance immediately.

---

## 7. Chart.js

### Prompt

> Explain how to create a simple Chart.js doughnut chart showing total expenses and remaining balance. Also explain how to handle the previous chart when the data changes.

### What I implemented

The chart displays:

```text
Total Expenses
+
Remaining Balance
```

Whenever the data changes, the chart is updated.

I destroy the previous Chart.js instance before creating the updated chart so that multiple charts do not appear on the same canvas.

---

## 8. Currency Conversion

### Prompt

> Explain how I can add a currency selector to my salary and expense tracker. The main values are stored in INR and the displayed values should be converted to USD, EUR and GBP using a free currency API.

### What I implemented

The financial values are maintained using INR as the base currency.

The user can select another currency and the displayed values are converted.

The currency API is used to get the exchange rates.

I also added fallback rates so that the application can still work if the API request fails.

---

## 9. Low Balance Alert

### Prompt

> Explain how to check whether the remaining balance is below 10 percent of the salary and show a warning.

### Logic

The condition is:

```text
Remaining Balance < Salary × 10%
```

If this condition is true, the application shows a low-balance warning and changes the balance to a warning state.

---

## 10. PDF Report

### Prompt

> I need to generate a PDF report for my salary and expense tracker using jsPDF. The report should contain salary, total expenses, remaining balance and the expense list. Keep the implementation understandable for a fresher.

### What I implemented

The PDF contains:

- Cash-Flow title
- Generated date
- Total salary
- Total expenses
- Remaining balance
- Expense number
- Expense name
- Expense date
- Expense amount
- Final balance
- Low-balance warning when required
- Page number

I also improved the formatting so that the report is easier to read.

---

## 11. Debugging

During development I faced some issues while connecting different parts of the project.

I used prompts like:

> I am getting this error in my JavaScript code. Explain what is causing it and show me a simple fix without unnecessarily changing the project structure.

I used AI explanations to understand the errors instead of just copying the solution.

After making changes, I tested the application again in the browser.

---

## 12. Code Comments

I also used AI to help me add some comments to the JavaScript code.

### Prompt

> Add simple beginner-friendly comments to this JavaScript code so I can understand what each important section is doing. Do not change the functionality of the code.

I specifically used AI for comments because some parts such as:

- LocalStorage
- Chart.js
- Currency API
- PDF generation

were easier for me to understand when short comments were available.

I reviewed the comments and kept them related to the actual code.

---

## 13. Testing

I tested the main functionality manually in the browser.

### Salary Testing

```text
Enter salary
      ↓
Submit
      ↓
Check dashboard
      ↓
Refresh page
      ↓
Check LocalStorage persistence
```

### Expense Testing

```text
Enter expense name
      ↓
Enter amount
      ↓
Submit
      ↓
Check expense list
      ↓
Check total expenses
      ↓
Check remaining balance
```

### Validation Testing

I tested:

- Empty salary
- Empty expense name
- Empty expense amount
- Negative salary
- Negative expense amount

### Delete Testing

```text
Add expense
      ↓
Delete expense
      ↓
Check expense list
      ↓
Check total expenses
      ↓
Check remaining balance
```

### LocalStorage Testing

```text
Add salary
Add expenses
      ↓
Refresh browser
      ↓
Check saved data
```

### Chart Testing

I checked whether the chart changes when:

- An expense is added
- An expense is deleted
- Salary is changed

### PDF Testing

I checked whether the generated PDF contains:

- Salary
- Total expenses
- Remaining balance
- Expense list
- Dates
- Final balance

---

## 14. Problems I Worked Through

During the development process, I had to understand and fix different types of issues.

Some of the areas that required extra attention were:

- Converting input values from strings to numbers
- Keeping calculations correct after adding and deleting expenses
- Saving and loading data from LocalStorage
- Updating the chart when data changes
- Handling currency conversion
- Formatting the PDF report
- Handling API failures
- Making sure the UI reflects the latest data

These were useful because I understood that changing one part of the application can affect other parts as well.

---

## 15. What I Learned

Through this assignment I improved my understanding of:

- HTML forms
- CSS layout
- JavaScript variables and functions
- Arrays and objects
- DOM manipulation
- Form validation
- Number conversion
- LocalStorage
- JSON.stringify()
- JSON.parse()
- Array methods
- Dynamic rendering
- Chart.js
- Fetch API
- Currency conversion
- jsPDF
- Basic error handling
- Browser testing

The main thing I learned was how the frontend parts work together.

```text
HTML
 ↓
User Input
 ↓
Validation
 ↓
JavaScript Logic
 ↓
Application Data
 ↓
Calculations
 ↓
DOM Update
 ↓
LocalStorage
 ↓
Chart / PDF / Currency Display
```

---

## 16. AI Usage

I used AI during this assignment as a development and learning assistant.

I mainly used AI for:

- Understanding assignment requirements
- Understanding JavaScript concepts
- Debugging errors
- Explaining LocalStorage
- Understanding JSON.stringify() and JSON.parse()
- Understanding Chart.js
- Understanding currency API integration
- Improving PDF formatting
- Adding simple code comments
- Getting help when I was stuck

I did not want the project to become something I could not explain myself, so I checked the changes and tested the functionality in my own project.

The AI-generated comments were added mainly to make the code easier to understand and revise later.

---

## 17. Final Reflection

This sprint helped me understand that building a frontend application is not only about creating the UI.

The main challenge was connecting the UI with JavaScript logic and making sure that the data, calculations and UI remain synchronized.

The most important flow I learned was:

```text
Input
 ↓
Validation
 ↓
JavaScript Logic
 ↓
Data
 ↓
Calculation
 ↓
UI Update
 ↓
Persistence
```

Some parts were easy, while LocalStorage, Chart.js, API integration and jsPDF required more learning and debugging.

I used AI where I needed help, but I also tested and reviewed the implementation myself.

Overall, this sprint gave me practical experience with Vanilla JavaScript and helped me understand how a small frontend application works from input to data storage and final output.
