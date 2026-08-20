# Contributing to ScamLens

Thank you for your interest in contributing to ScamLens! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Run tests: `npm test`
7. Run the linter: `npm run lint`
8. Submit a pull request

## Development

### Running Locally

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code patterns
- Keep the analysis engine independent from the UI
- Write tests for new analysis patterns
- Use semantic HTML and accessible markup

## Adding New Detection Patterns

The analysis engine is in `src/lib/analysis-engine.ts`. When adding new patterns:

1. Add a new `PatternRule` entry to the `PATTERN_RULES` array
2. Include appropriate regex patterns
3. Set reasonable weight and severity values
4. Add a clear title, explanation, and recommendation
5. Add corresponding test cases in `__tests__/analysis-engine.test.ts`

## Reporting Issues

Please use GitHub Issues to report bugs or suggest features. Include:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Browser and OS information (if applicable)

## Pull Request Guidelines

- Keep PRs focused on a single change
- Write clear commit messages
- Add tests for new features
- Update documentation if needed
- Ensure all tests pass before submitting

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
