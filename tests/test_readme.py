"""
Unit tests for README.md validation
Tests markdown structure, links, content requirements, and formatting
"""

import re
import os
import sys
from pathlib import Path
from urllib.parse import urlparse


class TestREADME:
    """Test suite for README.md validation"""
    
    @staticmethod
    def get_readme_content():
        """Read the README.md file content"""
        readme_path = Path(__file__).parent.parent / "README.md"
        with open(readme_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def test_readme_exists(self):
        """Test that README.md file exists"""
        readme_path = Path(__file__).parent.parent / "README.md"
        assert readme_path.exists(), "README.md file must exist"
        assert readme_path.is_file(), "README.md must be a file"
    
    def test_readme_not_empty(self):
        """Test that README.md is not empty"""
        content = self.get_readme_content()
        assert len(content) > 0, "README.md must not be empty"
        assert len(content.strip()) > 0, "README.md must contain non-whitespace content"
    
    def test_has_main_heading(self):
        """Test that README.md has a main heading"""
        content = self.get_readme_content()
        assert re.search(r'^# .+', content, re.MULTILINE), \
            "README.md must have a main heading (# IFNOT)"
    
    def test_main_heading_content(self):
        """Test that the main heading is 'IFNOT'"""
        content = self.get_readme_content()
        match = re.search(r'^# (.+)$', content, re.MULTILINE)
        assert match, "Main heading not found"
        assert match.group(1).strip() == "IFNOT", \
            "Main heading must be '# IFNOT'"
    
    def test_has_subtitle(self):
        """Test that README.md has a subtitle 'The IFNOT fund'"""
        content = self.get_readme_content()
        assert "The IFNOT fund" in content, \
            "README.md must contain 'The IFNOT fund' subtitle"
    
    def test_has_charlie_labs_section(self):
        """Test that README.md has a Charlie Labs AI section"""
        content = self.get_readme_content()
        assert re.search(r'^## .+Charlie Labs AI', content, re.MULTILINE), \
            "README.md must have a Charlie Labs AI section heading"
    
    def test_charlie_labs_section_heading(self):
        """Test the exact heading for Charlie Labs AI section"""
        content = self.get_readme_content()
        assert "## Integration with Charlie Labs AI" in content, \
            "Charlie Labs AI section must be titled '## Integration with Charlie Labs AI'"
    
    def test_has_website_link(self):
        """Test that README.md contains a link to Charlie Labs AI website"""
        content = self.get_readme_content()
        assert "charlielabs.ai" in content.lower(), \
            "README.md must contain a link to charlielabs.ai"
    
    def test_website_link_format(self):
        """Test that the website link is properly formatted"""
        content = self.get_readme_content()
        # Check for markdown link format
        assert re.search(r'\[.*charlielabs\.ai.*\]', content, re.IGNORECASE) or \
               re.search(r'https?://.*charlielabs\.ai', content, re.IGNORECASE), \
            "Website link must be properly formatted"
    
    def test_has_location_information(self):
        """Test that README.md contains location information"""
        content = self.get_readme_content()
        assert "TEXAS" in content.upper(), \
            "README.md must contain location information (TEXAS)"
    
    def test_location_format(self):
        """Test the location line format"""
        content = self.get_readme_content()
        assert re.search(r'\*\*Location:\*\*.*TEXAS', content, re.IGNORECASE), \
            "Location must be in format '**Location:** TEXAS ...'"
    
    def test_has_about_section(self):
        """Test that README.md has an 'About the Integration' section"""
        content = self.get_readme_content()
        assert "About the Integration" in content, \
            "README.md must have an 'About the Integration' section"
    
    def test_about_section_heading_level(self):
        """Test that 'About the Integration' is a level 3 heading"""
        content = self.get_readme_content()
        assert "### About the Integration" in content, \
            "'About the Integration' must be a level 3 heading (###)"
    
    def test_markdown_heading_hierarchy(self):
        """Test that markdown headings follow proper hierarchy"""
        content = self.get_readme_content()
        lines = content.split('\n')
        
        heading_levels = []
        for line in lines:
            match = re.match(r'^(#{1,6}) ', line)
            if match:
                heading_levels.append(len(match.group(1)))
        
        assert len(heading_levels) > 0, "Must have at least one heading"
        assert heading_levels[0] == 1, "First heading must be level 1 (#)"
        
        # Check no heading jumps more than one level
        for i in range(1, len(heading_levels)):
            level_diff = heading_levels[i] - heading_levels[i-1]
            assert level_diff <= 1, \
                f"Heading hierarchy violated: jumped from level {heading_levels[i-1]} to {heading_levels[i]}"
    
    def test_no_empty_sections(self):
        """Test that no section headings are followed immediately by another heading"""
        content = self.get_readme_content()
        lines = content.split('\n')
        
        prev_was_heading = False
        for line in lines:
            line_stripped = line.strip()
            is_heading = line_stripped.startswith('#')
            
            if is_heading and prev_was_heading:
                # Check if there's any content between headings
                assert False, "Found consecutive headings with no content between them"
            
            prev_was_heading = is_heading and len(line_stripped) > 1
    
    def test_url_format(self):
        """Test that URLs are properly formatted"""
        content = self.get_readme_content()
        
        # Find all URLs
        url_pattern = r'https?://[^\s\)]+'
        urls = re.findall(url_pattern, content)
        
        assert len(urls) > 0, "README.md must contain at least one URL"
        
        for url in urls:
            # Basic URL validation
            parsed = urlparse(url)
            assert parsed.scheme in ['http', 'https'], \
                f"URL must use http or https: {url}"
            assert parsed.netloc, f"URL must have a domain: {url}"
    
    def test_charlielabs_url_accessible_format(self):
        """Test that the Charlie Labs AI URL is in accessible format"""
        content = self.get_readme_content()
        
        # Should have www.charlielabs.ai
        assert "www.charlielabs.ai" in content.lower(), \
            "Should include www.charlielabs.ai"
        
        # Check if it's in a markdown link or as direct URL
        has_markdown_link = bool(re.search(r'\[.*\]\(.*charlielabs\.ai.*\)', content, re.IGNORECASE))
        has_direct_link = bool(re.search(r'https?://.*charlielabs\.ai', content, re.IGNORECASE))
        
        assert has_markdown_link or has_direct_link, \
            "Charlie Labs URL must be either a markdown link or direct URL"
    
    def test_no_broken_markdown_links(self):
        """Test that markdown link syntax is not broken"""
        content = self.get_readme_content()
        
        # Check for broken link patterns
        broken_patterns = [
            r'\[(?!.*\])',  # Opening bracket without closing
            r'(?<!\[)\]',   # Closing bracket without opening (context-aware)
            r'\]\(',        # Link with missing URL (we'll check if there's something after)
        ]
        
        # Find all markdown links
        markdown_links = re.findall(r'\[([^\]]+)\]\(([^\)]+)\)', content)
        
        for link_text, link_url in markdown_links:
            assert link_text.strip(), "Link text must not be empty"
            assert link_url.strip(), "Link URL must not be empty"
    
    def test_consistent_bold_formatting(self):
        """Test that bold formatting is used consistently"""
        content = self.get_readme_content()
        
        # Find all bold text markers
        bold_pattern = r'\*\*([^*]+)\*\*'
        bold_texts = re.findall(bold_pattern, content)
        
        for bold_text in bold_texts:
            # Bold text should not be empty
            assert bold_text.strip(), "Bold text markers should not be empty"
            # Bold text should not have leading/trailing spaces
            assert bold_text == bold_text.strip(), \
                f"Bold text should not have leading/trailing spaces: '**{bold_text}**'"
    
    def test_no_trailing_whitespace(self):
        """Test that lines don't have trailing whitespace"""
        content = self.get_readme_content()
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Allow empty lines, but non-empty lines shouldn't end with spaces/tabs
            if line:
                assert line == line.rstrip(), \
                    f"Line {i} has trailing whitespace: '{line}'"
    
    def test_file_ends_with_newline(self):
        """Test that README.md ends with a newline"""
        readme_path = Path(__file__).parent.parent / "README.md"
        with open(readme_path, 'rb') as f:
            content = f.read()
            assert content.endswith(b'\n'), \
                "README.md should end with a newline character"
    
    def test_section_order(self):
        """Test that sections appear in the expected order"""
        content = self.get_readme_content()
        
        # Find positions of key sections
        main_heading_pos = content.find("# IFNOT")
        subtitle_pos = content.find("The IFNOT fund")
        charlie_section_pos = content.find("## Integration with Charlie Labs AI")
        about_pos = content.find("### About the Integration")
        
        assert main_heading_pos >= 0, "Main heading not found"
        assert subtitle_pos >= 0, "Subtitle not found"
        assert charlie_section_pos >= 0, "Charlie Labs section not found"
        assert about_pos >= 0, "About section not found"
        
        # Check order
        assert main_heading_pos < subtitle_pos, \
            "Main heading should come before subtitle"
        assert subtitle_pos < charlie_section_pos, \
            "Subtitle should come before Charlie Labs section"
        assert charlie_section_pos < about_pos, \
            "Charlie Labs section should come before About section"
    
    def test_integration_description_exists(self):
        """Test that there's a description of the integration"""
        content = self.get_readme_content()
        
        # After "About the Integration", there should be descriptive text
        about_section = content.split("### About the Integration")
        assert len(about_section) > 1, "About the Integration section not found"
        
        description = about_section[1].strip()
        assert len(description) > 20, \
            "Integration description should be more than 20 characters"
        assert "AI" in description or "ai" in description, \
            "Integration description should mention AI"
    
    def test_no_html_tags(self):
        """Test that README.md doesn't contain HTML tags (should use markdown)"""
        content = self.get_readme_content()
        
        # Common HTML tags that shouldn't be in pure markdown
        html_pattern = r'<(?:div|span|p|a|img|br|hr|table|tr|td|th)[^>]*>'
        html_matches = re.findall(html_pattern, content, re.IGNORECASE)
        
        assert len(html_matches) == 0, \
            f"README.md should use markdown instead of HTML tags. Found: {html_matches}"
    
    def test_consistent_capitalization(self):
        """Test that key terms are capitalized consistently"""
        content = self.get_readme_content()
        
        # Check specific terms
        ifnot_occurrences = re.findall(r'\bIFNOT\b', content)
        texas_occurrences = re.findall(r'\bTEXAS\b', content)
        
        assert len(ifnot_occurrences) >= 1, "IFNOT should appear at least once (in heading)"
        assert len(texas_occurrences) >= 1, "TEXAS should appear at least once"
    
    def test_no_undefined_references(self):
        """Test that there are no references to deleted files"""
        content = self.get_readme_content()
        
        # Files that were deleted in this diff
        deleted_references = [
            "CONTRIBUTING.md",
            "package.json",
            ".pre-commit-config.yaml",
            "cla.yml",
        ]
        
        for ref in deleted_references:
            assert ref not in content, \
                f"README.md should not reference deleted file: {ref}"
    
    def test_linear_reference_format(self):
        """Test that the Linear reference is properly formatted"""
        content = self.get_readme_content()
        
        # Should have "Linear" in quotes based on the current content
        assert '"Linear"' in content, \
            "Linear reference should be in quotes"


def run_tests():
    """Run all tests and report results"""
    test_class = TestREADME()
    
    # Get all test methods
    test_methods = [method for method in dir(test_class) 
                   if method.startswith('test_') and callable(getattr(test_class, method))]
    
    passed = 0
    failed = 0
    errors = []
    
    print(f"Running {len(test_methods)} tests for README.md...\n")
    
    for test_method in sorted(test_methods):
        try:
            getattr(test_class, test_method)()
            print(f"✓ {test_method}")
            passed += 1
        except AssertionError as e:
            print(f"✗ {test_method}")
            print(f"  Error: {e}")
            failed += 1
            errors.append((test_method, str(e)))
        except Exception as e:
            print(f"✗ {test_method}")
            print(f"  Unexpected error: {e}")
            failed += 1
            errors.append((test_method, f"Unexpected: {str(e)}"))
    
    print(f"\n{'='*60}")
    print(f"Results: {passed} passed, {failed} failed out of {len(test_methods)} tests")
    print(f"{'='*60}")
    
    if failed > 0:
        print("\nFailed tests:")
        for test_name, error in errors:
            print(f"  - {test_name}: {error}")
        sys.exit(1)
    else:
        print("\nAll tests passed! ✓")
        sys.exit(0)


if __name__ == "__main__":
    run_tests()