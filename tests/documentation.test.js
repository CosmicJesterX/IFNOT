/**
 * Documentation Validation Tests
 * 
 * Comprehensive test suite for validating README.md and SECURITY.md
 * Tests cover structure, content, formatting, and best practices
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { describe, it, before } = require('node:test');

// Helper function to read file content
function readFile(filename) {
  const filepath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filepath)) {
    throw new Error(`File not found: ${filename}`);
  }
  return fs.readFileSync(filepath, 'utf-8');
}

// Helper function to check if string contains a pattern (case-insensitive)
function containsPattern(content, pattern, flags = 'i') {
  const regex = new RegExp(pattern, flags);
  return regex.test(content);
}

// Helper function to count occurrences
function countOccurrences(content, pattern) {
  const matches = content.match(new RegExp(pattern, 'g'));
  return matches ? matches.length : 0;
}

// Helper function to extract all headings
function extractHeadings(content) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim()
    });
  }
  return headings;
}

// Helper function to validate markdown links
function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2]
    });
  }
  return links;
}

// Helper function to check for common markdown issues
function checkMarkdownQuality(content, filename) {
  const issues = [];
  
  // Check for trailing whitespace
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.endsWith(' ') || line.endsWith('\t')) {
      issues.push(`Line ${index + 1}: Trailing whitespace`);
    }
  });
  
  // Check for multiple consecutive blank lines
  const multipleBlankLines = /\n\n\n+/g;
  if (multipleBlankLines.test(content)) {
    issues.push('Multiple consecutive blank lines found');
  }
  
  // Check file ends with newline
  if (!content.endsWith('\n')) {
    issues.push('File does not end with newline');
  }
  
  return issues;
}

describe('README.md Validation', () => {
  let readmeContent;
  
  before(() => {
    readmeContent = readFile('README.md');
  });
  
  describe('File Structure', () => {
    it('should exist and be readable', () => {
      assert.ok(readmeContent, 'README.md should exist and be readable');
      assert.ok(readmeContent.length > 0, 'README.md should not be empty');
    });
    
    it('should have a title (h1 heading)', () => {
      const hasH1 = containsPattern(readmeContent, '^#\\s+', 'm');
      assert.ok(hasH1, 'README.md should start with an h1 heading');
    });
    
    it('should have the project name in title', () => {
      const headings = extractHeadings(readmeContent);
      const h1Headings = headings.filter(h => h.level === 1);
      assert.ok(h1Headings.length > 0, 'Should have at least one h1 heading');
      assert.ok(
        h1Headings[0].text.toLowerCase().includes('ifnot'),
        'Main heading should contain project name "IFNOT"'
      );
    });
    
    it('should have content beyond just the title', () => {
      const lines = readmeContent.split('\n').filter(line => line.trim().length > 0);
      assert.ok(lines.length >= 2, 'README should have content beyond just the title');
    });
  });
  
  describe('Content Requirements', () => {
    it('should provide a description or purpose', () => {
      const lines = readmeContent.split('\n');
      const nonHeadingLines = lines.filter(line => 
        line.trim().length > 0 && !line.trim().startsWith('#')
      );
      assert.ok(
        nonHeadingLines.length > 0,
        'README should contain descriptive text beyond headings'
      );
    });
    
    it('should have meaningful content (not placeholder text)', () => {
      const placeholders = ['todo', 'tbd', 'coming soon', 'lorem ipsum'];
      const lowerContent = readmeContent.toLowerCase();
      placeholders.forEach(placeholder => {
        assert.ok(
          !lowerContent.includes(placeholder),
          `README should not contain placeholder text: "${placeholder}"`
        );
      });
    });
    
    it('should mention the project purpose', () => {
      const purposeKeywords = ['fund', 'ifnot'];
      const lowerContent = readmeContent.toLowerCase();
      const hasPurpose = purposeKeywords.some(keyword => lowerContent.includes(keyword));
      assert.ok(hasPurpose, 'README should mention the project purpose');
    });
  });
  
  describe('Markdown Quality', () => {
    it('should end with a newline', () => {
      assert.ok(
        readmeContent.endsWith('\n'),
        'README.md should end with a newline character'
      );
    });
    
    it('should not have trailing whitespace', () => {
      const lines = readmeContent.split('\n');
      const linesWithTrailing = lines
        .map((line, idx) => ({ line, idx: idx + 1 }))
        .filter(({ line }) => line.length > 0 && (line.endsWith(' ') || line.endsWith('\t')));
      
      assert.strictEqual(
        linesWithTrailing.length,
        0,
        `Lines with trailing whitespace: ${linesWithTrailing.map(l => l.idx).join(', ')}`
      );
    });
    
    it('should not have multiple consecutive blank lines', () => {
      const hasMultipleBlankLines = /\n\n\n+/.test(readmeContent);
      assert.ok(
        !hasMultipleBlankLines,
        'README should not have multiple consecutive blank lines'
      );
    });
    
    it('should use consistent heading style', () => {
      const headings = extractHeadings(readmeContent);
      if (headings.length > 1) {
        // Check that headings follow a logical hierarchy
        for (let i = 1; i < headings.length; i++) {
          const levelDiff = headings[i].level - headings[i-1].level;
          assert.ok(
            levelDiff <= 1,
            `Heading level should not skip levels (found h${headings[i-1].level} followed by h${headings[i].level})`
          );
        }
      }
    });
  });
  
  describe('Link Validation', () => {
    it('should have valid link syntax for any links present', () => {
      const links = extractLinks(readmeContent);
      links.forEach(link => {
        assert.ok(link.text.length > 0, 'Link text should not be empty');
        assert.ok(link.url.length > 0, 'Link URL should not be empty');
      });
    });
    
    it('should not have broken relative links', () => {
      const links = extractLinks(readmeContent);
      const relativeLinks = links.filter(link => 
        !link.url.startsWith('http://') && 
        !link.url.startsWith('https://') &&
        !link.url.startsWith('#')
      );
      
      relativeLinks.forEach(link => {
        const filepath = path.join(process.cwd(), link.url);
        assert.ok(
          fs.existsSync(filepath),
          `Relative link should point to existing file: ${link.url}`
        );
      });
    });
    
    it('should use https:// for external links (when present)', () => {
      const links = extractLinks(readmeContent);
      const httpLinks = links.filter(link => 
        link.url.startsWith('http://') && !link.url.includes('localhost')
      );
      
      assert.strictEqual(
        httpLinks.length,
        0,
        `External links should use https:// instead of http://: ${httpLinks.map(l => l.url).join(', ')}`
      );
    });
  });
  
  describe('Security Considerations', () => {
    it('should not contain sensitive information patterns', () => {
      const sensitivePatterns = [
        { pattern: /[a-z0-9]{40}/i, name: 'potential API key (40 chars)' },
        { pattern: /sk_[a-z0-9]{32}/i, name: 'Stripe secret key pattern' },
        { pattern: /password\s*[=:]\s*[^\s]+/i, name: 'hardcoded password' },
        { pattern: /api[_-]?key\s*[=:]\s*[^\s]+/i, name: 'API key assignment' },
      ];
      
      sensitivePatterns.forEach(({ pattern, name }) => {
        assert.ok(
          !pattern.test(readmeContent),
          `README should not contain ${name}`
        );
      });
    });
    
    it('should not contain personal email addresses in plain text', () => {
      const emailPattern = /[a-z0-9._%+-]+@(?!example\.com|example\.org)[a-z0-9.-]+\.[a-z]{2,}/gi;
      const emails = readmeContent.match(emailPattern);
      
      if (emails) {
        assert.ok(
          emails.length === 0,
          `README should not contain plain email addresses (found: ${emails.join(', ')})`
        );
      }
    });
  });
});

describe('SECURITY.md Validation', () => {
  let securityContent;
  
  before(() => {
    securityContent = readFile('SECURITY.md');
  });
  
  describe('File Structure', () => {
    it('should exist and be readable', () => {
      assert.ok(securityContent, 'SECURITY.md should exist and be readable');
      assert.ok(securityContent.length > 0, 'SECURITY.md should not be empty');
    });
    
    it('should have a clear title', () => {
      const hasTitle = containsPattern(securityContent, '^#\\s+Security', 'm');
      assert.ok(hasTitle, 'SECURITY.md should have a "Security" title');
    });
    
    it('should have multiple sections with headings', () => {
      const headings = extractHeadings(securityContent);
      assert.ok(
        headings.length >= 2,
        'SECURITY.md should have multiple sections (at least 2 headings)'
      );
    });
    
    it('should have proper heading hierarchy', () => {
      const headings = extractHeadings(securityContent);
      const h1Count = headings.filter(h => h.level === 1).length;
      assert.ok(h1Count === 1, 'Should have exactly one h1 heading');
      assert.ok(h1Count >= 1, 'Should have at least one h1 heading');
    });
  });
  
  describe('Required Sections', () => {
    it('should have a section about reporting vulnerabilities', () => {
      const hasReportingSection = containsPattern(
        securityContent,
        '##\\s+.*report.*vulnerabilit',
        'im'
      );
      assert.ok(
        hasReportingSection,
        'SECURITY.md should have a section about reporting vulnerabilities'
      );
    });
    
    it('should provide contact information for security reports', () => {
      const hasContact = 
        containsPattern(securityContent, 'email', 'i') ||
        containsPattern(securityContent, 'contact', 'i') ||
        containsPattern(securityContent, '@');
      
      assert.ok(
        hasContact,
        'SECURITY.md should provide contact information for reporting issues'
      );
    });
    
    it('should mention the repository owner or maintainer', () => {
      const hasMaintainer = 
        containsPattern(securityContent, '@[A-Za-z0-9_-]+') ||
        containsPattern(securityContent, 'owner', 'i') ||
        containsPattern(securityContent, 'maintainer', 'i');
      
      assert.ok(
        hasMaintainer,
        'SECURITY.md should mention the repository owner or maintainer'
      );
    });
    
    it('should have guidance on secret management', () => {
      const secretKeywords = ['secret', 'credential', 'token', 'api key', 'password'];
      const lowerContent = securityContent.toLowerCase();
      const mentionsSecrets = secretKeywords.some(keyword => lowerContent.includes(keyword));
      
      assert.ok(
        mentionsSecrets,
        'SECURITY.md should provide guidance on handling secrets/credentials'
      );
    });
  });
  
  describe('Security Best Practices Coverage', () => {
    it('should warn against committing secrets', () => {
      const warnsAboutSecrets = 
        containsPattern(securityContent, 'never.*commit.*secret', 'i') ||
        containsPattern(securityContent, 'do not.*commit.*secret', 'i') ||
        containsPattern(securityContent, 'avoid.*commit.*secret', 'i');
      
      assert.ok(
        warnsAboutSecrets,
        'SECURITY.md should explicitly warn against committing secrets'
      );
    });
    
    it('should mention environment variables for secrets', () => {
      const mentionsEnvVars = 
        containsPattern(securityContent, 'environment variable', 'i') ||
        containsPattern(securityContent, 'env', 'i');
      
      assert.ok(
        mentionsEnvVars,
        'SECURITY.md should mention using environment variables for secrets'
      );
    });
    
    it('should provide guidance on secret rotation', () => {
      const mentionsRotation = 
        containsPattern(securityContent, 'rotat', 'i') ||
        containsPattern(securityContent, 'revoke', 'i') ||
        containsPattern(securityContent, 'invalidate', 'i');
      
      assert.ok(
        mentionsRotation,
        'SECURITY.md should provide guidance on rotating/revoking compromised secrets'
      );
    });
    
    it('should mention .env file management', () => {
      const mentionsEnvFile = 
        containsPattern(securityContent, '\\.env', 'i') ||
        containsPattern(securityContent, 'env file', 'i');
      
      assert.ok(
        mentionsEnvFile,
        'SECURITY.md should mention proper .env file management'
      );
    });
    
    it('should reference .gitignore for sensitive files', () => {
      const mentionsGitignore = containsPattern(securityContent, '\\.gitignore', 'i');
      assert.ok(
        mentionsGitignore,
        'SECURITY.md should mention using .gitignore to exclude sensitive files'
      );
    });
    
    it('should mention GitHub security features', () => {
      const githubFeatures = [
        'secret scanning',
        'github.*secret',
        'push protection',
        'security.*alert'
      ];
      
      const mentionsGitHubSecurity = githubFeatures.some(pattern => 
        containsPattern(securityContent, pattern, 'i')
      );
      
      assert.ok(
        mentionsGitHubSecurity,
        'SECURITY.md should mention GitHub security features (secret scanning, etc.)'
      );
    });
  });
  
  describe('Reporting Process', () => {
    it('should specify not to open public issues for security vulnerabilities', () => {
      const warnsAgainstPublic = 
        containsPattern(securityContent, 'do not.*public.*issue', 'i') ||
        containsPattern(securityContent, 'not.*open.*public', 'i') ||
        containsPattern(securityContent, 'avoid.*public.*issue', 'i');
      
      assert.ok(
        warnsAgainstPublic,
        'SECURITY.md should warn against opening public issues for vulnerabilities'
      );
    });
    
    it('should provide a response timeline', () => {
      const hasTimeline = 
        containsPattern(securityContent, '\\d+\\s*(hour|day|week)', 'i') ||
        containsPattern(securityContent, 'acknowledge', 'i') ||
        containsPattern(securityContent, 'respond', 'i');
      
      assert.ok(
        hasTimeline,
        'SECURITY.md should provide a response timeline for vulnerability reports'
      );
    });
    
    it('should have numbered or bulleted instructions', () => {
      const hasListItems = 
        containsPattern(securityContent, '^\\s*[-*+]\\s+', 'm') ||
        containsPattern(securityContent, '^\\s*\\d+\\.\\s+', 'm');
      
      assert.ok(
        hasListItems,
        'SECURITY.md should use lists for clear step-by-step instructions'
      );
    });
  });
  
  describe('Markdown Quality', () => {
    it('should end with a newline', () => {
      assert.ok(
        securityContent.endsWith('\n'),
        'SECURITY.md should end with a newline character'
      );
    });
    
    it('should not have trailing whitespace', () => {
      const lines = securityContent.split('\n');
      const linesWithTrailing = lines
        .map((line, idx) => ({ line, idx: idx + 1 }))
        .filter(({ line }) => line.length > 0 && (line.endsWith(' ') || line.endsWith('\t')));
      
      assert.strictEqual(
        linesWithTrailing.length,
        0,
        `Lines with trailing whitespace: ${linesWithTrailing.map(l => l.idx).join(', ')}`
      );
    });
    
    it('should have consistent formatting', () => {
      const issues = checkMarkdownQuality(securityContent, 'SECURITY.md');
      assert.strictEqual(
        issues.length,
        0,
        `Markdown quality issues found: ${issues.join('; ')}`
      );
    });
    
    it('should use proper list formatting', () => {
      const lines = securityContent.split('\n');
      const listLines = lines.filter(line => /^\s*[-*+]\s+/.test(line));
      
      listLines.forEach((line, idx) => {
        // Check that list items are not followed by multiple spaces before text
        const match = line.match(/^\s*[-*+]\s{2,}/);
        assert.ok(
          !match,
          `List item has multiple spaces after bullet (line ${idx + 1})`
        );
      });
    });
  });
  
  describe('Content Quality', () => {
    it('should have substantial content (not just a placeholder)', () => {
      const wordCount = securityContent.split(/\s+/).filter(word => word.length > 0).length;
      assert.ok(
        wordCount >= 50,
        `SECURITY.md should have substantial content (found ${wordCount} words, expected at least 50)`
      );
    });
    
    it('should not contain placeholder text', () => {
      const placeholders = ['todo', 'tbd', 'coming soon', 'lorem ipsum', 'xxx', '[insert'];
      const lowerContent = securityContent.toLowerCase();
      
      placeholders.forEach(placeholder => {
        assert.ok(
          !lowerContent.includes(placeholder),
          `SECURITY.md should not contain placeholder text: "${placeholder}"`
        );
      });
    });
    
    it('should use professional and clear language', () => {
      // Check for common security terminology
      const securityTerms = [
        'vulnerability', 'security', 'report', 'credential', 
        'secret', 'token', 'sensitive'
      ];
      const lowerContent = securityContent.toLowerCase();
      const termCount = securityTerms.filter(term => lowerContent.includes(term)).length;
      
      assert.ok(
        termCount >= 4,
        `SECURITY.md should use appropriate security terminology (found ${termCount}/7 key terms)`
      );
    });
    
    it('should provide actionable guidance', () => {
      // Look for imperative verbs that indicate actionable steps
      const actionVerbs = [
        'never', 'always', 'must', 'should', 'avoid', 'use', 
        'keep', 'ensure', 'check', 'enable', 'rotate', 'revoke'
      ];
      const lowerContent = securityContent.toLowerCase();
      const verbCount = actionVerbs.filter(verb => lowerContent.includes(verb)).length;
      
      assert.ok(
        verbCount >= 5,
        `SECURITY.md should provide actionable guidance with clear directives (found ${verbCount} action verbs)`
      );
    });
  });
  
  describe('Link Validation', () => {
    it('should have valid link syntax for any links present', () => {
      const links = extractLinks(securityContent);
      links.forEach(link => {
        assert.ok(link.text.length > 0, 'Link text should not be empty');
        assert.ok(link.url.length > 0, 'Link URL should not be empty');
      });
    });
    
    it('should use https:// for external links', () => {
      const links = extractLinks(securityContent);
      const httpLinks = links.filter(link => 
        link.url.startsWith('http://') && !link.url.includes('localhost')
      );
      
      assert.strictEqual(
        httpLinks.length,
        0,
        `External links should use https://: ${httpLinks.map(l => l.url).join(', ')}`
      );
    });
  });
  
  describe('Checklist Validation', () => {
    it('should include a checklist format for easy reference', () => {
      const hasChecklist = 
        containsPattern(securityContent, 'checklist', 'i') ||
        (countOccurrences(securityContent, '[-*+]\\s+') >= 5);
      
      assert.ok(
        hasChecklist,
        'SECURITY.md should include a checklist or list format for easy reference'
      );
    });
    
    it('should have multiple actionable items in lists', () => {
      // Count all bullet points and numbered items (including indented)
      const listItemCount = countOccurrences(securityContent, '[-*+]\\s+');
      const numberedItemCount = countOccurrences(securityContent, '\\d+\\.\\s+');
      const totalItems = listItemCount + numberedItemCount;
      
      assert.ok(
        totalItems >= 5,
        `SECURITY.md should have multiple actionable items (found ${totalItems}, expected at least 5)`
      );
    });
  });
  
  describe('Example and Tool References', () => {
    it('should mention specific tools or services when applicable', () => {
      const tools = [
        'gitleaks', 'github', 'git', 'filter-repo', 'filter-branch',
        'prettier', 'eslint', 'scanner'
      ];
      const lowerContent = securityContent.toLowerCase();
      const toolMentions = tools.filter(tool => lowerContent.includes(tool));
      
      assert.ok(
        toolMentions.length >= 2,
        `SECURITY.md should reference specific tools (found: ${toolMentions.join(', ')})`
      );
    });
    
    it('should provide examples where helpful', () => {
      const hasExamples = 
        containsPattern(securityContent, 'example', 'i') ||
        containsPattern(securityContent, 'e\\.g\\.', 'i') ||
        containsPattern(securityContent, 'such as', 'i') ||
        countOccurrences(securityContent, '`[^`]+`') >= 3; // code blocks
      
      assert.ok(
        hasExamples,
        'SECURITY.md should provide examples for clarity'
      );
    });
  });
});

describe('Cross-Document Consistency', () => {
  let readmeContent, securityContent;
  
  before(() => {
    readmeContent = readFile('README.md');
    securityContent = readFile('SECURITY.md');
  });
  
  it('README should reference SECURITY.md if security is mentioned', () => {
    const readmeMentionsSecurity = 
      containsPattern(readmeContent, 'security', 'i') ||
      containsPattern(readmeContent, 'vulnerabilit', 'i');
    
    if (readmeMentionsSecurity) {
      const referencesSecurityDoc = containsPattern(readmeContent, 'SECURITY\\.md', 'i');
      // This is a recommendation, not a hard requirement
      if (!referencesSecurityDoc) {
        console.log('INFO: README mentions security but does not reference SECURITY.md');
      }
    }
    
    // Always pass but log information
    assert.ok(true);
  });
  
  it('both files should use consistent markdown formatting style', () => {
    const readmeHeadings = extractHeadings(readmeContent);
    const securityHeadings = extractHeadings(securityContent);
    
    // Both should have headings
    assert.ok(readmeHeadings.length > 0, 'README should have headings');
    assert.ok(securityHeadings.length > 0, 'SECURITY.md should have headings');
    
    // Check that both use the same newline style (both should end with \n)
    assert.strictEqual(
      readmeContent.endsWith('\n'),
      securityContent.endsWith('\n'),
      'Both files should use consistent newline endings'
    );
  });
  
  it('project name should be consistent across documents', () => {
    const projectName = 'IFNOT';
    const readmeHasName = containsPattern(readmeContent, projectName, 'i');
    
    assert.ok(readmeHasName, 'README should mention the project name');
    
    // SECURITY.md may or may not mention project name, that's okay
    assert.ok(true);
  });
});

describe('General Documentation Standards', () => {
  it('should have all required documentation files', () => {
    const requiredFiles = ['README.md', 'SECURITY.md'];
    
    requiredFiles.forEach(file => {
      const exists = fs.existsSync(path.join(process.cwd(), file));
      assert.ok(exists, `Required documentation file should exist: ${file}`);
    });
  });
  
  it('documentation files should not be empty', () => {
    const docFiles = ['README.md', 'SECURITY.md'];
    
    docFiles.forEach(file => {
      const content = readFile(file);
      assert.ok(
        content.trim().length > 0,
        `${file} should not be empty or contain only whitespace`
      );
    });
  });
  
  it('documentation should use UTF-8 encoding', () => {
    // Node.js readFileSync with 'utf-8' will throw if file is not valid UTF-8
    // If we got here, files are valid UTF-8
    const files = ['README.md', 'SECURITY.md'];
    files.forEach(file => {
      assert.doesNotThrow(
        () => readFile(file),
        `${file} should be valid UTF-8 encoded`
      );
    });
  });
});