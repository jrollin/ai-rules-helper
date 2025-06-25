---
category: Documentation
tags: [Comments, Clean Code, Readability]
---

# Smart Comments

Write comments that explain why something is done a certain way, not what the code does.

## Guidelines

- Don't comment on what the code does - make the code self-documenting
- Use comments to explain why something is done a certain way
- Document APIs, complex algorithms, and non-obvious side effects
- Keep comments up-to-date with code changes

## Examples

```javascript
// Bad
// Loop through users
for (let i = 0; i < users.length; i++) {
  // Get the current user
  const user = users[i];
  // Check if user is active
  if (user.status === 'active') {
    // Process the user
    processUser(user);
  }
}

// Good
// Process only active users to avoid overloading the system
for (let i = 0; i < users.length; i++) {
  const user = users[i];
  if (user.status === 'active') {
    processUser(user);
  }
}
```
