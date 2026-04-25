# Lighthouse Performance Tests

This directory contains automated Lighthouse performance audits that validate the website meets performance requirements.

## Requirements Validated

- **Requirement 6.1**: First Contentful Paint < 1.5s
- **Requirement 6.2**: Time to Interactive < 3s
- **Requirement 6.5**: Performance score >= 90

## Test Structure

### `performance.test.ts`

Runs Lighthouse CLI against the production build and validates:

1. **First Contentful Paint (FCP)**: Measures when the first content is painted to the screen
2. **Time to Interactive (TTI)**: Measures when the page becomes fully interactive
3. **Performance Score**: Overall Lighthouse performance score (0-100)
4. **Additional Metrics**: Logs Speed Index, Largest Contentful Paint, Total Blocking Time, and Cumulative Layout Shift

## Running the Tests

### Prerequisites

1. Build the production site:

   ```bash
   npm run build
   ```

2. Start a local server:

   ```bash
   npm run serve
   ```

3. In a separate terminal, run the Lighthouse tests:
   ```bash
   npm run test:lighthouse
   ```

### Environment Variables

- `LIGHTHOUSE_URL`: URL to test (default: `http://localhost:3000`)

Example:

```bash
LIGHTHOUSE_URL=https://rogeriodocarmo.com npm run test:lighthouse
```

## Test Results

The tests generate a `lighthouse-report.json` file in the project root (automatically cleaned up after tests).

### Current Performance Metrics

Based on the latest test run:

- **First Contentful Paint**: 0.62s ✅ (< 1.5s requirement)
- **Time to Interactive**: 2.42s ✅ (< 3s requirement)
- **Performance Score**: 98 ✅ (>= 90 requirement)
- **Speed Index**: 1.5s
- **Largest Contentful Paint**: 2.4s
- **Total Blocking Time**: 0ms
- **Cumulative Layout Shift**: 0.01

## CI/CD Integration

These tests should be run in the CI/CD pipeline after building the production site:

```yaml
- name: Build production site
  run: npm run build

- name: Start server
  run: npm run serve &

- name: Wait for server
  run: sleep 5

- name: Run Lighthouse tests
  run: npm run test:lighthouse
```

## Troubleshooting

### Server not running

If tests fail with connection errors, ensure the production build is served:

```bash
npm run build
npm run serve
```

### Lighthouse timeout

If Lighthouse times out, increase the timeout in the test file or check server performance.

### Performance degradation

If tests fail due to performance issues:

1. Check bundle size: `npm run build:analyze`
2. Review code splitting and lazy loading
3. Verify image optimization
4. Check for unnecessary dependencies
