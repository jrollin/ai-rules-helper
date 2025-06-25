---
category: Code Quality
tags: [Clean Code, Functions, Responsibility]
---

# Single Responsibility

Each function should do exactly one thing and do it well.

## Guidelines

- Functions should be small and focused
- If a function needs a comment to explain what it does, it should be split
- Extract repeated code into reusable functions
- Maintain single sources of truth

## Examples

```javascript
// Bad
function processUser(user) {
  // Validate user
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  
  // Save user to database
  db.save(user);
  
  // Send welcome email
  emailService.send(user.email, 'Welcome!', 'Welcome to our service');
}

// Good
function validateUser(user) {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
}

function saveUser(user) {
  return db.save(user);
}

function sendWelcomeEmail(user) {
  return emailService.send(user.email, 'Welcome!', 'Welcome to our service');
}

function processUser(user) {
  validateUser(user);
  saveUser(user);
  sendWelcomeEmail(user);
}
```
