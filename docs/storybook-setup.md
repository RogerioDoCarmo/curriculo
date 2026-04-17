# Storybook Setup Documentation

## Overview

Storybook v10.3.5 has been configured for component development and documentation. This setup includes accessibility testing, Vitest integration, and full Next.js support.

## Installation

Storybook was installed with the following command:

```bash
npx storybook@latest init --yes
```

## Configuration

### Main Configuration (`.storybook/main.ts`)

- **Stories Location**: `components/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- **Framework**: `@storybook/nextjs-vite`
- **Static Assets**: `public/` directory
- **Telemetry**: Disabled

### Addons Installed

1. **@chromatic-com/storybook** - Visual testing and review
2. **@storybook/addon-vitest** - Vitest integration for component testing
3. **@storybook/addon-a11y** - Accessibility testing
4. **@storybook/addon-docs** - Automatic documentation generation
5. **@storybook/addon-onboarding** - Onboarding guide for new users

### Preview Configuration (`.storybook/preview.ts`)

- **Tailwind CSS**: Imported via `app/globals.css`
- **Accessibility Testing**: Configured with `test: "todo"` mode
- **Background Themes**: Light (#ffffff) and Dark (#0a0a0a)
- **Controls**: Automatic matchers for colors and dates

## Running Storybook

### Development Mode

```bash
npm run storybook
```

Starts Storybook on http://localhost:6006/

### Build for Production

```bash
npm run build-storybook
```

Builds static Storybook site in `storybook-static/`

## Features

### Accessibility Testing

- Automatic a11y checks on all stories
- Violations shown in the test UI
- Can be configured to fail CI with `test: "error"`

### Vitest Integration

- All stories can be run as tests
- Run with `npx vitest`
- IDE extension shows stories as tests

### Next.js Support

- Full Next.js 14 compatibility
- Image component support
- Routing support
- Environment variables support

### Theme Support

- Light and dark background options
- Matches project's theme system
- Easy theme switching in UI

## Story File Structure

Stories should be co-located with components:

```
components/
├── Button/
│   ├── index.tsx
│   └── Button.stories.tsx
├── Card/
│   ├── index.tsx
│   └── Card.stories.tsx
└── ...
```

## Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./index";

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls here
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variant: Story = {
  args: {
    // Variant props
  },
};
```

## Documentation

### JSDoc Comments

All components should have JSDoc comments for automatic documentation:

```typescript
/**
 * Button component with multiple variants and sizes
 *
 * @param variant - Visual style: 'primary' | 'secondary' | 'ghost'
 * @param size - Button size: 'sm' | 'md' | 'lg'
 * @param disabled - Whether button is disabled
 * @param loading - Whether button shows loading state
 */
export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}
```

### MDX Documentation

Create `.mdx` files for detailed component documentation:

```mdx
import { Meta } from "@storybook/blocks";

<Meta title="Components/Button/Overview" />

# Button Component

The Button component provides...

## Usage

\`\`\`tsx
import { Button } from '@/components/Button';

<Button variant="primary">Click me</Button>
\`\`\`

## Accessibility

- Keyboard accessible
- Focus indicators
- ARIA labels supported
```

## Troubleshooting

### CSS Import Warning

If you see warnings about `@import` order in CSS, ensure all `@import` statements are at the top of the file before any other CSS rules.

### Version Conflicts

Storybook v10 was installed, which required removing older v8 packages. If you encounter version conflicts:

```bash
npm uninstall @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links @storybook/blocks @storybook/react @storybook/test storybook --force
npm install --save-dev storybook@^10.3.5 --force
```

### Missing Stories

Ensure story files follow the naming convention: `*.stories.tsx` or `*.stories.ts`

## Next Steps

1. Create stories for all UI components (Task 20.2)
2. Add JSDoc comments to all components
3. Write MDX documentation for complex components
4. Configure Chromatic for visual regression testing (optional)

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Next.js Integration](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)
- [Vitest Addon](https://storybook.js.org/addons/@storybook/addon-vitest)
