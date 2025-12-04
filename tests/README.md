# Documentation Test Suite

This directory contains comprehensive validation tests for the project's documentation files.

## Overview

The test suite validates:
- **README.md**: Structure, content requirements, formatting, and best practices
- **SECURITY.md**: Security policy completeness, required sections, and actionable guidance

## Running Tests

```bash
# Run all tests
npm test

# Run with verbose output
npm run test:verbose

# Run with Node.js test runner directly
node --test tests/documentation.test.js
```

## Test Categories

### README.md Tests
- **File Structure**: Validates presence of title, headings, and content
- **Content Requirements**: Ensures meaningful description and project purpose
- **Markdown Quality**: Checks formatting, whitespace, and consistency
- **Link Validation**: Verifies link syntax and targets
- **Security Considerations**: Detects potential sensitive information

### SECURITY.md Tests
- **File Structure**: Validates title and section organization
- **Required Sections**: Ensures vulnerability reporting process exists
- **Security Best Practices**: Verifies coverage of secret management, rotation, etc.
- **Reporting Process**: Validates response timeline and clear instructions
- **Content Quality**: Checks for substantial, actionable content
- **Tool References**: Ensures specific tools and examples are mentioned

### Cross-Document Tests
- **Consistency**: Validates consistent formatting and style across files
- **Completeness**: Ensures all required documentation exists

## Test Framework

Uses Node.js built-in test runner with no external dependencies:
- Native assertions (assert module)
- Built-in test structure (describe, it, before)
- No npm packages required beyond Node.js v18+

## Requirements

- Node.js v18.0.0 or higher (for native test runner support)
- No external dependencies

## Test Coverage

The suite includes 70+ test cases covering:
- Markdown structure and formatting validation
- Content completeness and quality checks
- Link validation (internal and external)
- Security best practices verification
- Cross-document consistency validation
- UTF-8 encoding verification

## Adding New Tests

To add new validation tests:

1. Add test cases to tests/documentation.test.js
2. Use the existing helper functions for common operations
3. Keep tests focused and specific
4. Use descriptive test names

## Best Practices

- Keep tests focused and specific
- Use descriptive test names that explain what's being validated
- Provide clear assertion messages for failures
- Group related tests using describe blocks
- Use helper functions to avoid repetition
