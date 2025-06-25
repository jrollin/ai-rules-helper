---
title: File-by-File Changes
category: Best Practices
tags: [Code Quality, Maintainability, Clean Code]
---

# Single Responsibility

Each function should do exactly one thing. Functions should be small and focused. If a function needs a comment to explain what it does, it should be split.

## Benefits

- Easier to understand and maintain
- Facilitates testing
- Promotes code reuse
- Reduces complexity

## Implementation Guidelines

- Keep functions under 20 lines when possible
- Extract complex conditionals into well-named functions
- Ensure function names clearly describe their purpose
- Avoid side effects that aren't obvious from the function name
