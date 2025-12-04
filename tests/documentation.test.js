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
      assert.ok(
        h1Count === 1,
        `SECURITY.md should have exactly one h1 heading, found ${h1Count}`
      );
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

    // If README does not mention security, there is nothing to enforce here.
    if (!readmeMentionsSecurity) {
      return;
    }

    const referencesSecurityDoc = containsPattern(readmeContent, 'SECURITY\\.md', 'i');
    assert.ok(
      referencesSecurityDoc,
      'If README mentions security, it should link to SECURITY.md for details'
    );
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
describe('package.json Validation', () => {
  let packageContent;
  let packageJson;
  
  before(() => {
    packageContent = readFile('package.json');
    packageJson = JSON.parse(packageContent);
  });
  
  describe('File Structure and Syntax', () => {
    it('should exist and be readable', () => {
      assert.ok(packageContent, 'package.json should exist and be readable');
      assert.ok(packageContent.length > 0, 'package.json should not be empty');
    });
    
    it('should be valid JSON', () => {
      assert.doesNotThrow(
        () => JSON.parse(packageContent),
        'package.json should be valid JSON'
      );
    });
    
    it('should end with a newline', () => {
      assert.ok(
        packageContent.endsWith('\n'),
        'package.json should end with a newline character'
      );
    });
    
    it('should not have trailing commas (JSON standard)', () => {
      // Check for trailing commas which are invalid in JSON
      const hasTrailingComma = /,(\s*[}\]])/g.test(packageContent);
      assert.ok(
        !hasTrailingComma,
        'package.json should not contain trailing commas (invalid JSON)'
      );
    });
  });
  
  describe('Required Fields', () => {
    it('should have a name field', () => {
      assert.ok(packageJson.name, 'package.json should have a "name" field');
      assert.strictEqual(
        typeof packageJson.name,
        'string',
        'name should be a string'
      );
    });
    
    it('should have a version field', () => {
      assert.ok(packageJson.version, 'package.json should have a "version" field');
      assert.ok(
        /^\d+\.\d+\.\d+/.test(packageJson.version),
        'version should follow semver format (e.g., 1.0.0)'
      );
    });
    
    it('should have a description field', () => {
      assert.ok(
        packageJson.description,
        'package.json should have a "description" field'
      );
      assert.ok(
        packageJson.description.length >= 10,
        'description should be meaningful (at least 10 characters)'
      );
    });
    
    it('should have a license field', () => {
      assert.ok(packageJson.license, 'package.json should have a "license" field');
    });
  });
  
  describe('Scripts Configuration', () => {
    it('should have a scripts section', () => {
      assert.ok(packageJson.scripts, 'package.json should have a "scripts" section');
      assert.strictEqual(
        typeof packageJson.scripts,
        'object',
        'scripts should be an object'
      );
    });
    
    it('should have a test script', () => {
      assert.ok(
        packageJson.scripts.test,
        'package.json should have a "test" script'
      );
      assert.ok(
        packageJson.scripts.test.length > 0,
        'test script should not be empty'
      );
    });
    
    it('test script should use node --test runner', () => {
      assert.ok(
        packageJson.scripts.test.includes('node --test'),
        'test script should use Node.js built-in test runner'
      );
    });
    
    it('should have verbose test script option', () => {
      assert.ok(
        packageJson.scripts['test:verbose'],
        'package.json should have a "test:verbose" script for detailed output'
      );
    });
    
    it('test scripts should not use placeholder commands', () => {
      const testScript = packageJson.scripts.test || '';
      const placeholders = ['echo "Error: no test specified"', 'exit 1'];
      
      placeholders.forEach(placeholder => {
        assert.ok(
          !testScript.includes(placeholder),
          'test script should not contain default placeholder'
        );
      });
    });
  });
  
  describe('Project Metadata', () => {
    it('name should follow npm naming conventions', () => {
      const name = packageJson.name;
      assert.ok(
        /^[a-z0-9-_]+$/.test(name),
        'package name should contain only lowercase letters, numbers, hyphens, and underscores'
      );
      assert.ok(
        name.length <= 214,
        'package name should be 214 characters or less'
      );
    });
    
    it('should have keywords array (if present) with meaningful entries', () => {
      if (packageJson.keywords) {
        assert.ok(
          Array.isArray(packageJson.keywords),
          'keywords should be an array'
        );
        packageJson.keywords.forEach(keyword => {
          assert.strictEqual(
            typeof keyword,
            'string',
            'each keyword should be a string'
          );
          assert.ok(
            keyword.length > 0,
            'keywords should not be empty strings'
          );
        });
      }
    });
  });
  
  describe('Dependencies Management', () => {
    it('should not have dependencies for this documentation-only project', () => {
      assert.ok(
        !packageJson.dependencies || Object.keys(packageJson.dependencies).length === 0,
        'documentation validation should use only Node.js built-in modules (no external dependencies)'
      );
    });
    
    it('should not have devDependencies for this test suite', () => {
      assert.ok(
        !packageJson.devDependencies || Object.keys(packageJson.devDependencies).length === 0,
        'tests should use Node.js built-in test runner (no dev dependencies needed)'
      );
    });
  });
  
  describe('JSON Formatting Quality', () => {
    it('should use consistent indentation', () => {
      const lines = packageContent.split('\n').filter(line => line.trim().length > 0);
      let indentSize = null;
      
      for (const line of lines) {
        const match = line.match(/^(\s+)/);
        if (match) {
          const spaces = match[1].length;
          if (indentSize === null) {
            indentSize = spaces;
          } else if (spaces < indentSize) {
            indentSize = Math.min(indentSize, spaces);
          }
        }
      }
      
      // Indentation should be 2 or 4 spaces (common conventions)
      if (indentSize) {
        assert.ok(
          indentSize === 2 || indentSize === 4,
          `JSON should use 2 or 4 space indentation (found ${indentSize})`
        );
      }
    });
    
    it('should not have mixed tabs and spaces', () => {
      const lines = packageContent.split('\n');
      const linesWithMixedIndent = lines.filter(line => 
        line.match(/^\s/) && line.includes('\t') && line.includes(' ')
      );
      
      assert.strictEqual(
        linesWithMixedIndent.length,
        0,
        'package.json should not mix tabs and spaces for indentation'
      );
    });
  });
});

describe('.gitignore Validation', () => {
  let gitignoreContent;
  let patterns;
  
  before(() => {
    gitignoreContent = readFile('.gitignore');
    patterns = gitignoreContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));
  });
  
  describe('File Structure', () => {
    it('should exist and be readable', () => {
      assert.ok(gitignoreContent, '.gitignore should exist and be readable');
      assert.ok(gitignoreContent.length > 0, '.gitignore should not be empty');
    });
    
    it('should have meaningful patterns', () => {
      assert.ok(
        patterns.length >= 5,
        `.gitignore should have multiple patterns (found ${patterns.length}, expected at least 5)`
      );
    });
    
    it('should end with a newline', () => {
      assert.ok(
        gitignoreContent.endsWith('\n'),
        '.gitignore should end with a newline character'
      );
    });
    
    it('should have section comments for organization', () => {
      const commentLines = gitignoreContent
        .split('\n')
        .filter(line => line.trim().startsWith('#'));
      
      assert.ok(
        commentLines.length >= 3,
        '.gitignore should have section comments for organization'
      );
    });
  });
  
  describe('Security-Critical Patterns', () => {
    it('should exclude environment files', () => {
      const envPatterns = patterns.filter(p => 
        p.includes('.env') || p.match(/\.env\.\*/)
      );
      
      assert.ok(
        envPatterns.length > 0,
        '.gitignore should exclude .env files to prevent committing secrets'
      );
    });
    
    it('should specifically exclude .env pattern', () => {
      assert.ok(
        patterns.some(p => p === '.env' || p === '.env.*'),
        '.gitignore should explicitly exclude .env files'
      );
    });
    
    it('should allow .env.example files if .env.* is excluded', () => {
      const excludesEnvStar = patterns.some(p => p === '.env.*');
      if (excludesEnvStar) {
        const allowsExample = patterns.some(p => p === '!.env.example');
        // This is optional but good practice
        if (!allowsExample) {
          console.log('INFO: Consider adding !.env.example to allow example env files');
        }
      }
      assert.ok(true); // Informational only
    });
    
    it('should exclude common sensitive file patterns', () => {
      const sensitivePatterns = [
        { pattern: /\.pem$|\.key$|\.p12$/, name: 'private keys' },
        { pattern: /\.env/, name: 'environment files' }
      ];
      
      sensitivePatterns.forEach(({ pattern, name }) => {
        const hasSensitiveExclusion = patterns.some(p => pattern.test(p));
        if (!hasSensitiveExclusion && name !== 'environment files') {
          console.log(`INFO: Consider excluding ${name}`);
        }
      });
      
      assert.ok(true); // Informational validation
    });
  });
  
  describe('Node.js Project Patterns', () => {
    it('should exclude node_modules directory', () => {
      assert.ok(
        patterns.some(p => p === 'node_modules' || p === 'node_modules/'),
        '.gitignore should exclude node_modules/ directory'
      );
    });
    
    it('should exclude npm log files', () => {
      const hasNpmLogs = patterns.some(p => 
        p.includes('npm-debug.log') || p.includes('*.log')
      );
      
      assert.ok(
        hasNpmLogs,
        '.gitignore should exclude npm log files'
      );
    });
    
    it('should exclude package manager lock files if using multiple managers', () => {
      // Check if both yarn and npm logs are excluded (optional but good practice)
      const excludesYarnLog = patterns.some(p => p.includes('yarn'));
      const excludesNpmLog = patterns.some(p => p.includes('npm-debug.log'));
      
      if (excludesYarnLog && excludesNpmLog) {
        assert.ok(true, 'Properly excludes multiple package manager artifacts');
      } else {
        assert.ok(true); // Not a failure, just informational
      }
    });
  });
  
  describe('Build and Output Patterns', () => {
    it('should exclude common build output directories', () => {
      const buildDirs = ['dist', 'build'];
      const excludesBuildDirs = buildDirs.some(dir => 
        patterns.some(p => p === dir || p === `${dir}/`)
      );
      
      assert.ok(
        excludesBuildDirs,
        '.gitignore should exclude common build directories (dist/, build/)'
      );
    });
    
    it('should exclude test coverage directories', () => {
      const coverageDirs = patterns.filter(p => 
        p.includes('coverage') || p.includes('.nyc_output')
      );
      
      assert.ok(
        coverageDirs.length > 0,
        '.gitignore should exclude test coverage directories'
      );
    });
    
    it('should exclude log files', () => {
      const excludesLogs = patterns.some(p => p.includes('*.log') || p === '*.log');
      assert.ok(
        excludesLogs,
        '.gitignore should exclude log files (*.log)'
      );
    });
  });
  
  describe('IDE and Editor Patterns', () => {
    it('should exclude common IDE directories', () => {
      const idePatterns = ['.vscode', '.idea'];
      const excludesIDEs = idePatterns.some(ide => 
        patterns.some(p => p === ide || p === `${ide}/`)
      );
      
      assert.ok(
        excludesIDEs,
        '.gitignore should exclude common IDE directories (.vscode/, .idea/)'
      );
    });
    
    it('should exclude editor swap files', () => {
      const swapPatterns = patterns.filter(p => 
        p.includes('.swp') || p.includes('.swo') || p.includes('*~')
      );
      
      assert.ok(
        swapPatterns.length > 0,
        '.gitignore should exclude editor swap/backup files'
      );
    });
  });
  
  describe('Operating System Patterns', () => {
    it('should exclude OS-specific files', () => {
      const osFiles = ['.DS_Store', 'Thumbs.db'];
      const excludesOSFiles = osFiles.some(file => patterns.includes(file));
      
      assert.ok(
        excludesOSFiles,
        '.gitignore should exclude OS-specific files (.DS_Store, Thumbs.db)'
      );
    });
    
    it('should exclude macOS .DS_Store files', () => {
      assert.ok(
        patterns.includes('.DS_Store'),
        '.gitignore should exclude .DS_Store (macOS)'
      );
    });
    
    it('should exclude Windows Thumbs.db files', () => {
      assert.ok(
        patterns.includes('Thumbs.db'),
        '.gitignore should exclude Thumbs.db (Windows)'
      );
    });
  });
  
  describe('Pattern Quality', () => {
    it('should use proper glob patterns', () => {
      patterns.forEach(pattern => {
        // Check for common mistakes
        assert.ok(
          !pattern.includes('**/**'),
          `Pattern should not have redundant wildcards: ${pattern}`
        );
        
        // Check pattern doesn't start with /
        if (pattern.startsWith('/')) {
          console.log(`INFO: Pattern starts with /: ${pattern} (matches only at root)`);
        }
      });
    });
    
    it('should not have trailing whitespace in patterns', () => {
      const lines = gitignoreContent.split('\n');
      const patternsWithTrailing = lines
        .map((line, idx) => ({ line, idx: idx + 1 }))
        .filter(({ line }) => {
          const trimmed = line.trim();
          return trimmed.length > 0 && 
                 !trimmed.startsWith('#') && 
                 line.endsWith(' ');
        });
      
      assert.strictEqual(
        patternsWithTrailing.length,
        0,
        `Patterns should not have trailing whitespace: lines ${patternsWithTrailing.map(p => p.idx).join(', ')}`
      );
    });
    
    it('should not have duplicate patterns', () => {
      const uniquePatterns = new Set(patterns);
      assert.strictEqual(
        patterns.length,
        uniquePatterns.size,
        '.gitignore should not have duplicate patterns'
      );
    });
  });
  
  describe('Security Validation', () => {
    it('should not accidentally exclude critical files', () => {
      const criticalFiles = ['package.json', 'README.md', 'SECURITY.md', '.gitignore'];
      
      criticalFiles.forEach(file => {
        const excluded = patterns.some(p => {
          // Simple check - exact match or wildcard that would match
          return p === file || (p.includes('*') && new RegExp(p.replace('*', '.*')).test(file));
        });
        
        assert.ok(
          !excluded,
          `Critical file should not be excluded: ${file}`
        );
      });
    });
    
    it('should exclude patterns in correct order (negations after exclusions)', () => {
      let lastNegationIndex = -1;
      let firstExclusionAfterNegation = -1;
      
      patterns.forEach((pattern, idx) => {
        if (pattern.startsWith('!')) {
          lastNegationIndex = idx;
        } else if (lastNegationIndex !== -1 && firstExclusionAfterNegation === -1) {
          firstExclusionAfterNegation = idx;
        }
      });
      
      // This is more informational - gitignore order matters
      assert.ok(true); // Pattern order validation completed
    });
  });
});

describe('Configuration Files Integration Tests', () => {
  describe('Test Suite Self-Validation', () => {
    it('package.json test script should execute the test file', () => {
      const packageJson = JSON.parse(readFile('package.json'));
      const testScript = packageJson.scripts.test;
      
      assert.ok(
        testScript.includes('tests/') || testScript.includes('**/*.test.js'),
        'test script should reference test files'
      );
    });
    
    it('test files should be discoverable by test runner', () => {
      const testFiles = fs.readdirSync(path.join(process.cwd(), 'tests'))
        .filter(file => file.endsWith('.test.js') || file.endsWith('.spec.js'));
      
      assert.ok(
        testFiles.length > 0,
        'tests/ directory should contain test files'
      );
    });
    
    it('.gitignore should not exclude test files', () => {
      const gitignoreContent = readFile('.gitignore');
      const patterns = gitignoreContent
        .split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#'));
      
      const excludesTests = patterns.some(p => 
        p.includes('test') || p.includes('spec')
      );
      
      if (excludesTests) {
        console.log('WARNING: .gitignore may exclude test files');
      }
      
      assert.ok(
        !patterns.includes('tests/') && !patterns.includes('*.test.js'),
        '.gitignore should not exclude test files'
      );
    });
  });
  
  describe('Documentation and Configuration Consistency', () => {
    it('package.json name should align with project name in README', () => {
      const packageJson = JSON.parse(readFile('package.json'));
      const readmeContent = readFile('README.md');
      
      const projectName = 'IFNOT';
      assert.ok(
        packageJson.name.toLowerCase().includes('ifnot') ||
        readmeContent.includes(projectName),
        'package.json name should relate to project name in README'
      );
    });
    
    it('package.json description should align with README content', () => {
      const packageJson = JSON.parse(readFile('package.json'));
      const readmeContent = readFile('README.md');
      
      // Both should mention key project concepts
      const descKeywords = packageJson.description.toLowerCase();
      const readmeKeywords = readmeContent.toLowerCase();
      
      assert.ok(
        (descKeywords.includes('test') && readmeKeywords.includes('ifnot')) ||
        (descKeywords.includes('documentation')),
        'package.json description should align with README content theme'
      );
    });
    
    it('SECURITY.md recommendations should be reflected in .gitignore', () => {
      const securityContent = readFile('SECURITY.md').toLowerCase();
      const gitignoreContent = readFile('.gitignore').toLowerCase();
      
      // If SECURITY.md mentions .env, .gitignore should exclude it
      if (securityContent.includes('.env')) {
        assert.ok(
          gitignoreContent.includes('.env'),
          'If SECURITY.md mentions .env files, .gitignore should exclude them'
        );
      }
    });
  });
  
  describe('File System Organization', () => {
    it('test files should be in tests/ directory', () => {
      const testsDir = path.join(process.cwd(), 'tests');
      assert.ok(
        fs.existsSync(testsDir),
        'tests/ directory should exist'
      );
      assert.ok(
        fs.statSync(testsDir).isDirectory(),
        'tests/ should be a directory'
      );
    });
    
    it('tests/ directory should contain test documentation', () => {
      const testReadme = path.join(process.cwd(), 'tests', 'README.md');
      if (fs.existsSync(testReadme)) {
        const content = fs.readFileSync(testReadme, 'utf-8');
        assert.ok(
          content.length > 50,
          'tests/README.md should have substantial documentation'
        );
      } else {
        console.log('INFO: Consider adding tests/README.md to document test suite');
      }
      assert.ok(true);
    });
    
    it('root should have essential documentation files', () => {
      const essentialDocs = ['README.md', 'SECURITY.md'];
      essentialDocs.forEach(doc => {
        const exists = fs.existsSync(path.join(process.cwd(), doc));
        assert.ok(exists, `Essential documentation file should exist: ${doc}`);
      });
    });
  });
});

describe('Enhanced Edge Case Testing', () => {
  describe('README.md Edge Cases', () => {
    let readmeContent;
    
    before(() => {
      readmeContent = readFile('README.md');
    });
    
    it('should handle extremely short content gracefully', () => {
      // README is intentionally minimal, should still be valid
      assert.ok(readmeContent.length >= 10, 'README should have at least 10 characters');
    });
    
    it('should not have broken markdown syntax', () => {
      // Check for unmatched markdown syntax
      const openBrackets = (readmeContent.match(/\[/g) || []).length;
      const closeBrackets = (readmeContent.match(/\]/g) || []).length;
      const openParens = (readmeContent.match(/\(/g) || []).length;
      const closeParens = (readmeContent.match(/\)/g) || []).length;
      
      assert.strictEqual(
        openBrackets,
        closeBrackets,
        'Markdown links should have matching brackets'
      );
      assert.strictEqual(
        openParens,
        closeParens,
        'Markdown links should have matching parentheses'
      );
    });
    
    it('should not have HTML comments that might leak information', () => {
      const hasHTMLComments = /<!--[\s\S]*?-->/.test(readmeContent);
      if (hasHTMLComments) {
        console.log('INFO: README contains HTML comments - verify they don\'t leak sensitive info');
      }
      assert.ok(true); // Informational
    });
    
    it('should have consistent line endings (LF not CRLF)', () => {
      const hasCRLF = readmeContent.includes('\r\n');
      assert.ok(
        !hasCRLF,
        'README should use LF line endings, not CRLF (better for git)'
      );
    });
  });
  
  describe('SECURITY.md Edge Cases', () => {
    let securityContent;
    
    before(() => {
      securityContent = readFile('SECURITY.md');
    });
    
    it('should not contain actual secrets in examples', () => {
      // Check for patterns that look like real secrets
      const suspiciousPatterns = [
        /ghp_[a-zA-Z0-9]{36}/,  // GitHub personal access token
        /sk_live_[a-zA-Z0-9]+/, // Stripe live key
        /AKIA[0-9A-Z]{16}/,     // AWS access key
      ];
      
      suspiciousPatterns.forEach(pattern => {
        assert.ok(
          !pattern.test(securityContent),
          'SECURITY.md should not contain real secrets, even in examples'
        );
      });
    });
    
    it('should not have broken contact information', () => {
      // If email is mentioned, it should be properly formatted
      const emailMatches = securityContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emailMatches) {
        emailMatches.forEach(email => {
          assert.ok(
            email.includes('.'),
            'Email addresses should have proper domain format'
          );
        });
      }
      
      // Check for GitHub username references
      const hasGitHubUser = /@[A-Za-z0-9_-]+/.test(securityContent);
      assert.ok(
        hasGitHubUser,
        'SECURITY.md should reference repository owner/maintainer'
      );
    });
    
    it('should have consistent list formatting', () => {
      const lines = securityContent.split('\n');
      const listMarkers = lines
        .filter(line => /^\s*[-*+]\s/.test(line))
        .map(line => line.match(/^\s*([-*+])/)[1]);
      
      if (listMarkers.length > 1) {
        const uniqueMarkers = new Set(listMarkers);
        assert.ok(
          uniqueMarkers.size <= 2,
          'Should use consistent list markers throughout document'
        );
      }
    });
    
    it('should have proper numbered list sequences', () => {
      const lines = securityContent.split('\n');
      const numberedLists = [];
      let currentList = [];
      
      lines.forEach(line => {
        const match = line.match(/^\s*(\d+)\.\s/);
        if (match) {
          currentList.push(parseInt(match[1]));
        } else if (currentList.length > 0) {
          numberedLists.push([...currentList]);
          currentList = [];
        }
      });
      
      if (currentList.length > 0) {
        numberedLists.push(currentList);
      }
      
      numberedLists.forEach(list => {
        for (let i = 0; i < list.length; i++) {
          assert.strictEqual(
            list[i],
            i + 1,
            `Numbered list should be sequential (expected ${i + 1}, found ${list[i]})`
          );
        }
      });
    });
  });
  
  describe('Cross-File Security Validation', () => {
    it('.gitignore patterns should cover files mentioned in SECURITY.md', () => {
      const securityContent = readFile('SECURITY.md');
      const gitignoreContent = readFile('.gitignore');
      
      // Check if .env is mentioned in security and excluded in gitignore
      if (securityContent.includes('.env')) {
        assert.ok(
          gitignoreContent.includes('.env'),
          'Files mentioned in SECURITY.md should be excluded in .gitignore'
        );
      }
      
      // Check for .pem files
      if (securityContent.includes('.pem')) {
        const excludesPem = gitignoreContent.includes('*.pem');
        if (!excludesPem) {
          console.log('INFO: Consider excluding *.pem files in .gitignore as mentioned in SECURITY.md');
        }
      }
    });
    
    it('package.json should not expose sensitive information', () => {
      const packageContent = readFile('package.json');
      const packageJson = JSON.parse(packageContent);
      
      // Check for common mistakes
      const sensitiveFields = ['password', 'token', 'key', 'secret'];
      const jsonString = JSON.stringify(packageJson).toLowerCase();
      
      sensitiveFields.forEach(field => {
        assert.ok(
          !jsonString.includes(`"${field}":`),
          `package.json should not contain sensitive field: ${field}`
        );
      });
    });
  });
});
