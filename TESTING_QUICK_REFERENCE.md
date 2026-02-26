# Testing Quick Reference

## Quick Start

Run all tests:
```bash
python3 run_tests.py
```

## What Was Tested

The git diff showed only **README.md** was modified (all other changes were file deletions).

## Test Coverage: README.md

✅ **27 comprehensive tests** covering:

### Structure & Content
- File exists and has content
- Main heading: "# IFNOT"
- Subtitle: "The IFNOT fund"
- Charlie Labs AI Integration section
- About the Integration section
- Proper heading hierarchy (H1 → H2 → H3)

### Links & URLs
- Charlie Labs AI website link (www.charlielabs.ai)
- Proper URL format (https://)
- Valid markdown link syntax
- No broken links

### Formatting
- Bold text formatting (**text**)
- Consistent capitalization (IFNOT, TEXAS)
- No trailing whitespace
- File ends with newline
- Pure markdown (no HTML tags)

### Content Quality
- Location information (TEXAS "Linear")
- Integration description present
- No references to deleted files
- Proper section ordering

## Test Results

All 27 tests passed successfully! ✓

## Files Created