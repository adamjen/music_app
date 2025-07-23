# Code Style Guide

Consistent coding standards across all projects to ensure maintainability and readability.

## General Principles

- **Readability**: Code should be easy to understand for all team members
- **Consistency**: Follow the same patterns throughout each project
- **Modularity**: Break down code into reusable components and functions

## JavaScript Style Guide

### Formatting

- Use 2 spaces for indentation
- Place opening braces on the same line (ES6 style)
- Semi-colons are optional but preferred for statement termination
- Single quotes for strings, unless double quotes are needed for escaping

Example:

```javascript
const exampleFunction = () => {
  const value = 'example';

  if (value === 'example') {
    return true;
  }

  return false;
};
```

### Naming Conventions

- **Variables and Functions**: camelCase (e.g., `configureSimulator`)
- **Constants**: UPPER_CASE_WITH_UNDERSCORES (e.g., `MAX_PARTICLES`)
- **Classes**: PascalCase (e.g., `ParticleSystem`)

### Best Practices

- Avoid global variables when possible
- Use `const` and `let` instead of `var`
- Prefer arrow functions for non-method functions
- Keep functions short and focused on a single task

## HTML Style Guide

- Indent nested elements by 2 spaces
- Self-closing tags should have a space before the slash (e.g., `<br />`)
- Use lowercase attribute names
- Quote all attribute values, even when not required

Example:

```html
<button class="btn btn-primary" onclick="handleClick()">
  Click me
</button>
```

## CSS Style Guide

### Formatting

- Use 2 spaces for indentation
- Place opening braces on the same line as selector
- One declaration per line
- Alphabetize properties within each rule

Example:

```css
.button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-align: center;
}
```

### Naming Conventions

- Use BEM (Block Element Modifier) methodology
- Avoid overly generic class names like `.red` or `.container`

Example:

```html
<div class="particle-simulator">
  <div class="particle-simulator__canvas"></div>
  <button class="particle-simulator__control">Start</button>
</div>
```

## Documentation Style Guide

- Use Markdown for all documentation files
- Keep sentences concise and to the point
- Use code blocks for any technical content
- Maintain consistent heading levels

## Git Commit Guidelines

- Write commit messages in imperative mood (e.g., "Add feature" instead of "Added feature")
- Limit subject line to 50 characters or less
- Provide detailed explanation if needed after a blank line
- Reference related issues when applicable (e.g., "#123")

Example:

```
Fix: Correct particle collision physics

The previous implementation had an off-by-one error in the
collision detection algorithm, which has been fixed.
```

## Tools and Linters

Use the following tools to enforce coding standards:

- ESLint for JavaScript code style
- Prettier for consistent code formatting across all languages
- Stylelint for CSS styling rules
- HTMLHint for HTML validation
