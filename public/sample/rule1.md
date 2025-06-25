---
category: Code Quality
tags: [Clean Code, Naming, Constants]
---

# Constants Over Magic Numbers

Replace hard-coded values with named constants to improve code readability and maintainability.

## Guidelines

- Use descriptive constant names that explain the value's purpose
- Keep constants at the top of the file or in a dedicated constants file
- Use uppercase for constant names with underscores for multi-word names

## Examples

```javascript
// Bad
if (status === 1) {
  // do something
}

// Good
const STATUS_ACTIVE = 1;
if (status === STATUS_ACTIVE) {
  // do something
}
```
