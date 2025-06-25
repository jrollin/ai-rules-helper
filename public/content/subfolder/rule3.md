---
title: Don't Repeat Yourself (DRY)
category: [Guidelines, Best Practices]
tags: [DRY, Code Structure, Maintainability]
---

# Don't Repeat Yourself (DRY)

Extract repeated code into reusable functions. Share common logic through proper abstraction. Maintain single sources of truth.

## Key Principles

- If you're writing the same code more than once, it should be abstracted
- Changes to logic should only need to be made in one place
- Use functions, classes, and modules to encapsulate reusable logic
- Consider creating utilities for common operations

## Warning Signs

- Copy-pasted code blocks
- Similar logic with slight variations
- Multiple implementations of the same business rule
- Changes requiring updates in multiple places
