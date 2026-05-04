# PWA Manifest Implementation

## Overview

Implemented a Web App Manifest to customize how the website appears when installed as a Progressive Web App (PWA) on mobile devices, specifically controlling the home screen shortcut title.

## Problem Solved

When users save the website to their phone's home screen (iOS "Add to Home Screen" or Android "Install app"), the shortcut title was showing the full page title:

- **Before**: "Rogério do Carmo | Desenvolvedor React Native Mobile" (too long, gets truncated)
- **After**: "Rogério do Carmo" (clean, fits perfectly)

**Important**: This change ONLY affects the home screen shortcut. When sharing the link on WhatsApp, social media, or other platforms, the full title is still used (from Open Graph metadata).

## Implementation

### File Created

**File**: `app/manifest.ts`

```typescript
import type { MetadataRoute } from "next";

// Required for static export in Next.js 16
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rogério do Carmo | Desenvolvedor React Native Mobile",
    short_name: "Rogério do Carmo",
    description: "Portifólio e currículo de Rogério do Carmo...",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
```

### How It Works

Next.js automatically:

1. Generates `/manifest.webmanifest` at build time
2. Links it in the HTML `<head>` automatically
3. Serves it to browsers when they request PWA information

### Manifest Properties Explained

| Property           | Value                           | Purpose                                                         |
| ------------------ | ------------------------------- | --------------------------------------------------------------- |
| `name`             | Full title with job description | Shown in app stores, install prompts, and splash screens        |
| `short_name`       | "Rogério do Carmo"              | **Shown under the home screen icon** (this is what you wanted!) |
| `description`      | Portfolio description           | Shown in app stores and install prompts                         |
| `start_url`        | "/"                             | URL to open when launching from home screen                     |
| `display`          | "standalone"                    | Opens in full-screen mode without browser UI                    |
| `background_color` | "#ffffff"                       | Background color of splash screen                               |
| `theme_color`      | "#2563eb"                       | Color of browser UI elements (address bar on Android)           |
| `icons`            | SVG icon                        | Icon shown on home screen and app switcher                      |

## Separation of Concerns

This implementation maintains proper separation between different contexts:

### 1. Home Screen Shortcut (PWA Manifest)

- **Uses**: `short_name` from `manifest.ts`
- **Shows**: "Rogério do Carmo"
- **Context**: Mobile home screen icon label

### 2. Social Media Sharing (Open Graph)

- **Uses**: `title` from `layout.tsx` metadata
- **Shows**: "Rogério do Carmo | Desenvolvedor React Native Mobile"
- **Context**: WhatsApp, Facebook, Twitter, LinkedIn previews

### 3. Browser Tab Title

- **Uses**: `title` from `layout.tsx` metadata
- **Shows**: "Rogério do Carmo | Desenvolvedor React Native Mobile"
- **Context**: Browser tab, bookmarks, history

### 4. Search Engine Results

- **Uses**: `title` from `layout.tsx` metadata
- **Shows**: "Rogério do Carmo | Desenvolvedor React Native Mobile"
- **Context**: Google, Bing search results

## Testing

### Build Verification

✅ Build succeeds without errors  
✅ Manifest generated at `/manifest.webmanifest`  
✅ No TypeScript diagnostics  
✅ Proper JSON format

### How to Test on Mobile

#### iOS (Safari)

1. Open https://rogeriodocarmo.com on Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Verify the name shows as "Rogério do Carmo"
5. Tap "Add"
6. Check home screen - icon should show "Rogério do Carmo" underneath

#### Android (Chrome)

1. Open https://rogeriodocarmo.com on Chrome
2. Tap the three-dot menu
3. Tap "Add to Home screen" or "Install app"
4. Verify the name shows as "Rogério do Carmo"
5. Tap "Add"
6. Check home screen - icon should show "Rogério do Carmo" underneath

### How to Test Social Sharing (Unchanged)

#### WhatsApp

1. Open WhatsApp
2. Paste https://rogeriodocarmo.com in a chat
3. Verify preview shows full title: "Rogério do Carmo | Desenvolvedor React Native Mobile"
4. ✅ This should remain unchanged

#### Facebook/LinkedIn/Twitter

1. Create a post with https://rogeriodocarmo.com
2. Verify preview shows full title with job description
3. ✅ This should remain unchanged

## Browser Support

| Browser           | Support | Notes                                  |
| ----------------- | ------- | -------------------------------------- |
| Chrome (Android)  | ✅ Full | Native PWA support                     |
| Safari (iOS)      | ✅ Full | Uses manifest for "Add to Home Screen" |
| Firefox (Android) | ✅ Full | Native PWA support                     |
| Edge (Android)    | ✅ Full | Native PWA support                     |
| Samsung Internet  | ✅ Full | Native PWA support                     |

## Benefits

1. ✅ **Cleaner Home Screen**: Short, professional name under the icon
2. ✅ **Better UX**: Name fits without truncation on all devices
3. ✅ **Professional Appearance**: Looks like a native app
4. ✅ **Maintains SEO**: Full title still used for search engines
5. ✅ **Maintains Social Sharing**: Full title still used for link previews
6. ✅ **PWA Ready**: Site can now be installed as a Progressive Web App

## Additional PWA Features Enabled

With this manifest, the site now supports:

- **Standalone Mode**: Opens without browser UI (looks like native app)
- **Theme Color**: Customizes browser UI color on Android
- **Splash Screen**: Shows branded splash screen on launch
- **App Switcher**: Appears in app switcher with custom icon
- **Install Prompt**: Browsers can show "Install app" prompt

## Future Enhancements

The manifest can be extended to support:

- Multiple icon sizes for different devices
- Screenshots for app store-like install prompts
- Orientation preferences (portrait/landscape)
- Categories for app stores
- Related applications
- Shortcuts (quick actions from home screen icon)

## Files Modified

- `app/manifest.ts` - Created Web App Manifest

## Related Requirements

- Requirement 10.1: Firebase integration and PWA support
- Requirement 11.7: Multi-language support (can be extended for localized manifests)

## References

- [Next.js Metadata API - Manifest](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [Web App Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [MDN: Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Best Practices](https://web.dev/pwa/)
