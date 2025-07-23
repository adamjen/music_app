# Common Components Library

Reusable UI components used across multiple projects for consistency and efficiency.

## Button Component

A versatile button component with various styles and sizes.

### Usage

```html
<button class="btn" data-type="primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
```

### Available Styles

- `.btn-primary` - Primary action button (blue)
- `.btn-secondary` - Secondary action button (gray)
- `.btn-success` - Success state button (green)
- `.btn-danger` - Danger/remove action button (red)

## Input Field Component

Standard input field with validation states.

### Usage

```html
<input type="text" class="input" placeholder="Enter text">
<input type="text" class="input input-error" placeholder="Error state">
```

### Validation States

- `.input-error` - Invalid input
- `.input-success` - Valid input
- `.input-disabled` - Disabled input

## Modal Component

Responsive modal dialog for various purposes.

### Usage

```html
<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <h2>Modal Title</h2>
    <p>Content goes here...</p>
  </div>
</div>
```

### JavaScript API

```javascript
// Open modal
document.getElementById('myModal').style.display = 'block';

// Close modal when user clicks on close button
const closeBtns = document.querySelectorAll('.modal-close');
closeBtns.forEach(btn => {
  btn.onclick = function() {
    document.getElementById('myModal').style.display = 'none';
  };
});
```

## Chart Components

Reusable chart components using Chart.js.

### Line Chart Usage

```javascript
const lineChartConfig = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81],
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
};
```

### Bar Chart Usage

```javascript
const barChartConfig = {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54,162,235,1)',
        'rgba(255,206,86,1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
};
```

## Data Table Component

Responsive table component with sorting capabilities.

### HTML Structure

```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th onclick="sortTable(0)">Name</th>
        <th onclick="sortTable(1)">Age</th>
        <th onclick="sortTable(2)">Country</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>28</td>
        <td>USA</td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
</div>
```

### JavaScript API

```javascript
function sortTable(columnIndex) {
  const table = document.querySelector('.data-table');
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].innerText;
    const cellB = b.cells[columnIndex].innerText;

    if (!isNaN(cellA) && !isNaN(cellB)) {
      return Number(cellA) - Number(cellB);
    }

    return cellA.localeCompare(cellB);
  });

  table.querySelector('tbody').append(...rows);
}
```

## Form Components

Collection of form elements with consistent styling.

### Text Input

```html
<div class="form-group">
  <label for="name">Name:</label>
  <input type="text" id="name" class="form-input" required>
</div>
```

### Select Dropdown

```html
<div class="form-group">
  <label for="country">Country:</label>
  <select id="country" class="form-select">
    <option value="usa">United States</option>
    <option value="canada">Canada</option>
    <!-- More options -->
  </select>
</div>
```

### Checkbox

```html
<div class="form-group">
  <input type="checkbox" id="agree" class="form-checkbox">
  <label for="agree">I agree to the terms and conditions</label>
</div>
