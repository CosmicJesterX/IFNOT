# Tests for IFNOT Repository

This directory contains validation tests for the IFNOT repository.

## Running Tests

To run all tests:

```bash
python3 run_tests.py
```

Or run the test file directly:

```bash
python3 tests/test_readme.py
```

## Test Coverage

### test_readme.py

Comprehensive validation tests for README.md including:

- **Existence and basic structure**: Verifies the file exists and has content
- **Heading hierarchy**: Validates proper markdown heading levels (H1, H2, H3)
- **Required sections**: Ensures all expected sections are present
  - Main heading (# IFNOT)
  - Subtitle (The IFNOT fund)
  - Charlie Labs AI Integration section
  - About the Integration subsection
- **Content validation**: 
  - Verifies specific text content and descriptions
  - Checks for required information (website, location, etc.)
- **Link validation**:
  - Tests URL format and structure
  - Validates markdown link syntax
  - Checks for broken links
- **Formatting consistency**:
  - Bold text formatting (**text**)
  - Capitalization consistency
  - No trailing whitespace
  - Proper file endings
- **Section ordering**: Ensures logical flow of content
- **Reference integrity**: No references to deleted files
- **Markdown best practices**: Pure markdown without HTML tags

## Test Framework

Tests use pure Python with assertions. No external testing frameworks required.

Each test is independent and validates a specific aspect of the documentation.

## Adding New Tests

To add new tests:

1. Create a new test method in the appropriate test class
2. Name it starting with `test_`
3. Use assertions to validate the expected behavior
4. Add descriptive docstrings explaining what the test validates

Example:

```python
def test_new_feature(self):
    """Test that new feature works correctly"""
    content = self.get_readme_content()
    assert "expected content" in content, "Error message if assertion fails"
```