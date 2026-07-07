---
name: session-storage
description: Manage and compress conversation sessions to optimize context usage. Use when session text becomes too long, context limits are approached, or when the user mentions session management, compression, or context optimization.
---

# Session Storage & Compression

## Overview

This skill provides strategies for managing conversation session length by intelligently compressing content while preserving essential information and context.

## When to Use

- **Automatic trigger**: When session text exceeds 10,000 characters
- **Manual trigger**: User explicitly requests session compression
- **Hybrid mode**: Alert user when approaching limits and offer compression

## Compression Strategies

### 1. Text Summarization (Primary)

**Goal**: Reduce verbosity while maintaining core meaning.

**Techniques**:
- Remove redundant phrases and repetitions
- Simplify complex sentence structures
- Replace verbose explanations with concise equivalents
- Eliminate filler words and unnecessary politeness markers

**Example**:
```
Before: "I think that we should probably consider the possibility of using a different approach, maybe something like..."
After: "Consider using a different approach..."
```

### 2. Key Point Extraction

**Goal**: Convert detailed conversations into structured bullet points.

**Format**:
```markdown
## Session Summary

### Context
- [Core problem/objective]

### Actions Taken
- [Key action 1]
- [Key action 2]

### Decisions Made
- [Decision 1 with rationale]
- [Decision 2 with rationale]

### Current State
- [Where we are now]
- [Next steps]
```

**When to use**:
- Long technical discussions
- Multi-step troubleshooting sessions
- Complex problem-solving conversations

### 3. Secondary Content Removal

**Goal**: Identify and remove outdated, duplicate, or low-value content.

**Remove**:
- ❌ Superseded information (old approaches replaced by new ones)
- ❌ Duplicate explanations (same concept explained multiple times)
- ❌ Failed attempts that aren't relevant to current approach
- ❌ Excessive pleasantries ("Thank you so much!", "You're welcome!")
- ❌ Off-topic tangents

**Preserve**:
- ✅ Current solution/approach
- ✅ Critical context and requirements
- ✅ Important decisions and their rationale
- ✅ Code snippets and technical details
- ✅ Action items and next steps

## Implementation Workflow

### Step 1: Assess Session Length

```javascript
// Check current session length
const sessionText = getConversationHistory();
const charCount = sessionText.length;

if (charCount > 10000) {
  // Auto-trigger compression
  compressSession();
} else if (charCount > 8000) {
  // Warn user
  alertUser('Session approaching limit. Compress?');
}
```

### Step 2: Choose Compression Strategy

| Session Type | Recommended Strategy |
|--------------|---------------------|
| **Technical discussion** | Key Point Extraction + Text Summarization |
| **Code review** | Keep code, summarize comments |
| **Problem solving** | Document solution, remove failed attempts |
| **General chat** | Aggressive summarization |

### Step 3: Apply Compression

**Progressive compression** (apply in order):

1. **Light compression** (reduce 20-30%):
   - Remove pleasantries
   - Simplify sentences
   - Remove obvious redundancies

2. **Medium compression** (reduce 40-50%):
   - Extract key points
   - Summarize long explanations
   - Remove outdated info

3. **Heavy compression** (reduce 60-70%):
   - Convert to structured summary
   - Keep only critical path
   - Remove all but essential context

### Step 4: Validate Compression

**Checklist**:
- [ ] Core objective still clear
- [ ] Current approach documented
- [ ] Critical context preserved
- [ ] Next steps identified
- [ ] Readable and coherent

## Compression Templates

### Template 1: Technical Session

```markdown
## Session: [Topic]

**Objective**: [What we're trying to achieve]

**Current Approach**: 
- [Selected solution/strategy]

**Key Decisions**:
1. [Decision] → [Rationale]
2. [Decision] → [Rationale]

**Code Changes**:
- [File/path]: [Brief description]
- [File/path]: [Brief description]

**Status**: [In progress / Complete / Blocked]

**Next Steps**:
- [ ] [Action item 1]
- [ ] [Action item 2]
```

### Template 2: Problem Solving

```markdown
## Problem: [Description]

**Root Cause**: [Identified cause]

**Solution**: [Approach taken]

**Implementation**:
```[language]
[key code snippet - max 20 lines]
```

**Result**: [Outcome]

**Learnings**:
- [Key insight 1]
- [Key insight 2]
```

### Template 3: Discussion Summary

```markdown
## Discussion: [Topic]

**Participants**: [Who was involved]

**Key Points Discussed**:
- Point 1: [Summary]
- Point 2: [Summary]

**Decisions Made**:
- Decision 1: [What + why]
- Decision 2: [What + why]

**Action Items**:
- [ ] [Person] - [Task]
- [ ] [Person] - [Task]
```

## Quality Guidelines

### What to Always Preserve

1. **Context**: Why are we doing this?
2. **Requirements**: What must be achieved?
3. **Constraints**: What limitations exist?
4. **Decisions**: What was chosen and why?
5. **Actions**: What was done?
6. **Results**: What happened?

### What Can Be Removed

1. **Redundant explanations**: Same idea stated multiple times
2. **Superseded approaches**: Old solutions no longer relevant
3. **Excessive detail**: Overly verbose code comments
4. **Social niceties**: Extended greetings/thanks
5. **Failed experiments**: Dead ends that don't inform current approach

## Examples

### Example 1: Before/After Compression

**Before** (850 chars):
```
User: Hi there! I hope you're doing well. I was wondering if you could help me with something. I'm trying to figure out how to implement authentication in my React app, but I'm not really sure where to start. There seem to be so many different options out there, like JWT, OAuth, session-based auth, and I'm feeling a bit overwhelmed.

Assistant: Hello! I'd be happy to help you with authentication in your React application. You're right that there are several options available. Let me break down the most common approaches for you. First, there's JWT (JSON Web Tokens), which is great for stateless authentication...

[continues for 3 more paragraphs]
```

**After** (200 chars):
```
## Authentication Implementation

**Question**: How to implement auth in React app?

**Options discussed**:
- JWT (stateless)
- OAuth (third-party)
- Session-based (traditional)

**Recommendation**: JWT for simplicity and scalability

**Next**: Review JWT implementation example
```

### Example 2: Code Review Session

**Before** (1200 chars):
```
[Long back-and-forth discussion about code style, multiple code snippets, various suggestions...]
```

**After** (300 chars):
```markdown
## Code Review: UserService.ts

**Changes**:
- Added input validation
- Improved error handling
- Refactored createUser method

**Key feedback**:
- ✅ Good: Comprehensive tests
- ⚠️ Fix: Extract validation logic
- 💡 Suggest: Use TypeScript strict mode

**Action**: Refactor validation into separate module
```

## Monitoring & Alerts

### Threshold Levels

| Level | Character Count | Action |
|-------|----------------|--------|
| 🟢 Normal | < 8,000 | No action needed |
| 🟡 Warning | 8,000 - 10,000 | Suggest compression |
| 🔴 Critical | > 10,000 | Auto-compress |

### Compression Metrics

Track these metrics to optimize compression:

```javascript
const metrics = {
  originalLength: 12000,
  compressedLength: 4000,
  compressionRatio: 0.67,  // 67% reduction
  qualityScore: 0.9,       // User satisfaction
  timeSaved: '2m 30s'      // Estimated token savings
};
```

## Fallback Strategies

If compression loses too much context:

1. **Incremental compression**: Compress older parts first
2. **Selective preservation**: Keep recent 20 messages intact
3. **Modular storage**: Split into topic-based sessions
4. **User confirmation**: Ask before aggressive compression

## Best Practices

1. **Compress early, compress often**: Don't wait until hitting limits
2. **Preserve the why**: Rationale is more important than exact wording
3. **Structure over prose**: Use lists, tables, code blocks
4. **Test readability**: Ensure compressed version makes sense
5. **Get feedback**: Ask user if compression level is appropriate

## Related Resources

- Context window optimization strategies
- Conversation history management
- Token efficiency techniques
