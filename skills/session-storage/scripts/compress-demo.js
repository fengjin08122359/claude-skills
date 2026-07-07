#!/usr/bin/env node

/**
 * Session Compression Demo Script
 * 
 * This script demonstrates how to use the session compression skill
 * to compress long conversation texts.
 * 
 * Usage:
 *   node compress-demo.js [input-file] [output-file]
 * 
 * Examples:
 *   node compress-demo.js session.txt compressed.md
 *   node compress-demo.js --demo
 */

const fs = require('fs');
const path = require('path');

// Demo data - sample long conversation
const demoSession = `
User: Hi there! Hope you're doing well today. I was wondering if you could help me with a problem I'm having with my Node.js application. So basically, I'm trying to implement file upload functionality and I'm running into some issues with memory usage when users try to upload large files, like videos or large datasets. The server keeps crashing with "out of memory" errors.

Assistant: Hello! I'd be happy to help you with file upload issues in your Node.js application. Memory problems with large file uploads are quite common. Let me ask a few questions to better understand your situation. First, what approach are you currently using to handle file uploads? Are you using any libraries like multer or express-fileupload?

User: Oh right, sorry! Yes, I'm using multer. Here's my current code:

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  // Handle the uploaded file
  const fileData = fs.readFileSync(req.file.path);
  // Process the file...
  res.send('File uploaded successfully');
});
```

It works fine for small files, but when someone tries to upload a file larger than about 200MB, the server crashes.

Assistant: I see the issue! You're reading the entire file into memory with \`fs.readFileSync()\`. This is exactly what causes memory problems with large files. The whole point of streams in Node.js is to avoid this. Let me show you a better approach...

[Continues with detailed explanation and code examples...]
`;

class SessionCompressor {
  constructor(options = {}) {
    this.thresholds = {
      warning: 8000,
      critical: 10000,
      ...options.thresholds
    };
    this.strategy = options.strategy || 'auto';
  }

  /**
   * Main compression method
   */
  compress(text) {
    const length = text.length;

    console.log(`\n📊 Session Analysis`);
    console.log(`Original length: ${length.toLocaleString()} characters`);

    if (length < this.thresholds.warning) {
      console.log('✅ No compression needed (under warning threshold)');
      return { text, ratio: 0 };
    }

    console.log(`⚠️  Compression recommended (${this.getThresholdLevel(length)})`);

    // Choose compression strategy
    const strategy = this.selectStrategy(length);
    console.log(`📝 Using strategy: ${strategy}`);

    // Apply compression
    const compressed = this.applyCompression(text, strategy);
    const ratio = ((length - compressed.length) / length * 100).toFixed(1);

    console.log(`\n✨ Compression Results`);
    console.log(`Compressed length: ${compressed.length.toLocaleString()} characters`);
    console.log(`Reduction: ${ratio}%`);
    console.log(`Quality: ${this.assessQuality(ratio)}`);

    return { text: compressed, ratio };
  }

  /**
   * Select appropriate compression strategy based on length
   */
  selectStrategy(length) {
    if (length > 15000) return 'heavy';
    if (length > 10000) return 'medium';
    return 'light';
  }

  /**
   * Apply compression based on strategy
   */
  applyCompression(text, strategy) {
    switch (strategy) {
      case 'light':
        return this.lightCompression(text);
      case 'medium':
        return this.mediumCompression(text);
      case 'heavy':
        return this.heavyCompression(text);
      default:
        return text;
    }
  }

  /**
   * Light compression: Remove pleasantries and simplify
   */
  lightCompression(text) {
    return text
      // Remove excessive greetings
      .replace(/(hi|hello|hey)[.!]?/gi, '')
      .replace(/hope you['']?re doing well/gi, '')
      .replace(/thank you/gi, 'thanks')
      // Simplify verbose phrases
      .replace(/I was wondering if you could help me/gi, 'Need help')
      .replace(/So basically/gi, '')
      .replace(/like/gi, 'such as')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Medium compression: Extract key points
   */
  mediumCompression(text) {
    const lines = text.split('\n');
    const keyPoints = [];
    let currentSection = null;

    for (const line of lines) {
      // Skip empty lines and pleasantries
      if (!line.trim() || line.match(/^(hi|hello|thanks)/i)) continue;

      // Identify important content
      if (line.includes('```')) {
        // Keep code blocks
        keyPoints.push(line);
      } else if (line.match(/issue|problem|solution|fix/i)) {
        // Highlight key terms
        keyPoints.push(`**${line.trim()}**`);
      } else if (line.length > 50 && !line.startsWith(' ')) {
        // Keep substantial sentences
        keyPoints.push(line);
      }
    }

    return keyPoints.join('\n').substring(0, Math.floor(text.length * 0.4));
  }

  /**
   * Heavy compression: Convert to structured summary
   */
  heavyCompression(text) {
    // Extract context
    const context = this.extractContext(text);

    // Extract actions
    const actions = this.extractActions(text);

    // Extract decisions
    const decisions = this.extractDecisions(text);

    return `
## Session Summary

### Context
${context}

### Actions Taken
${actions.map(a => `- ${a}`).join('\n')}

### Decisions Made
${decisions.map(d => `- ${d}`).join('\n')}
`.trim();
  }

  /**
   * Helper methods for heavy compression
   */
  extractContext(text) {
    const match = text.match(/trying to (.*?)(?:\.|$)/i);
    return match ? match[1] : 'Technical implementation';
  }

  extractActions(text) {
    const actions = [];
    if (text.includes('code')) actions.push('Reviewed code');
    if (text.includes('issue') || text.includes('problem')) actions.push('Identified issue');
    if (text.includes('show') || text.includes('example')) actions.push('Provided solution');
    return actions;
  }

  extractDecisions(text) {
    const decisions = [];
    if (text.includes('better approach') || text.includes('should')) {
      decisions.push('Selected improved approach');
    }
    return decisions;
  }

  /**
   * Utility methods
   */
  getThresholdLevel(length) {
    if (length > this.thresholds.critical) return 'CRITICAL';
    if (length > this.thresholds.warning) return 'WARNING';
    return 'NORMAL';
  }

  assessQuality(ratio) {
    if (ratio >= 60 && ratio <= 80) return '⭐⭐⭐⭐⭐ Excellent';
    if (ratio >= 40 && ratio < 60) return '⭐⭐⭐⭐ Good';
    if (ratio >= 20 && ratio < 40) return '⭐⭐⭐ Acceptable';
    return '⭐⭐ Needs improvement';
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  // Demo mode
  if (args.includes('--demo') || args.length === 0) {
    console.log('🎬 Running Session Compression Demo\n');
    console.log('='.repeat(50));

    const compressor = new SessionCompressor({
      strategy: 'auto'
    });

    const result = compressor.compress(demoSession);

    console.log('\n' + '='.repeat(50));
    console.log('📄 Compressed Output:\n');
    console.log(result.text);

    return;
  }

  // File processing mode
  const inputFile = args[0];
  const outputFile = args[1] || 'compressed-output.md';

  try {
    console.log('📥 Reading input file...');
    const inputText = fs.readFileSync(inputFile, 'utf-8');

    const compressor = new SessionCompressor({
      strategy: 'auto'
    });

    const result = compressor.compress(inputText);

    console.log('\n💾 Writing output file...');
    fs.writeFileSync(outputFile, result.text, 'utf-8');

    console.log(`\n✅ Compression complete!`);
    console.log(`Output saved to: ${outputFile}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SessionCompressor, demoSession };
