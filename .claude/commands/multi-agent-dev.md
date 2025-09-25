---
name: Multi-Agent Development
description: Orchestrates a complete development workflow using architect, implementer, and reviewer agents
usage: /multi-agent-dev [story description]
---

This command orchestrates a complete feature development workflow using multiple specialized agents:

1. **Architecture Agent** - Creates the code skeleton from the story
2. **Implementation Agent** - Implements the actual business logic  
3. **Code Review Agent** - Reviews the implementation for quality and standards
4. **Iterative Refinement** - Implementation agent addresses review feedback until approved

## Usage
```
/multi-agent-dev "As a user, I want to be able to cancel my booking up to 24 hours before the scheduled time"
```

## Workflow Steps

### Phase 1: Architecture
- Analyze the user story to identify required components
- Generate architectural skeleton with interfaces, classes, and structure
- Follow Clean Architecture and Vertical Slice patterns
- Create empty method signatures and TODO placeholders

### Phase 2: Implementation  
- Fill in all method implementations with actual business logic
- Implement data access patterns using Entity Framework Core
- Add proper validation, error handling, and logging
- Follow existing codebase conventions and patterns

### Phase 3: Code Review
- Perform comprehensive code review focusing on:
  - Architecture adherence and design quality
  - Security vulnerabilities and best practices
  - Performance considerations and optimizations
  - Code quality, readability, and maintainability
  - Testing strategy and testability

### Phase 4: Iterative Refinement
- If review identifies issues, implementation agent addresses feedback
- Process repeats until code review agent approves the implementation
- Final output includes all refined code ready for integration

## Agent Coordination
The command automatically manages the handoffs between agents, ensuring:
- Each agent receives appropriate context from previous phases
- Review feedback is clearly communicated to the implementation agent
- Iterations continue until quality standards are met
- Final deliverable includes complete, reviewed code

## Expected Output
- Complete feature implementation following Clean Architecture
- All business logic properly implemented and tested
- Code that passes comprehensive review standards
- Ready-to-integrate code with proper documentation