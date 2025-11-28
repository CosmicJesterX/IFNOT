#!/usr/bin/env python3
"""
Test runner script for IFNOT repository tests
"""

import sys
import os

# Add the tests directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'tests'))

# Import and run the tests
from test_readme import run_tests

if __name__ == "__main__":
    run_tests()