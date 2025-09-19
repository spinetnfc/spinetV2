# Spinet Color System Documentation

## Overview

This document describes the comprehensive color system implemented for the Spinet NFC application. The color system provides consistent theming with automatic light/dark mode support.

## Color Palette

### Primary Brand Colors

- **spinet-primary**: `#145FF2` - Main Spinet blue (stays consistent across themes)
- **spinet-navy**: `#082356` - Dark navy blue
- **spinet-dark**: `#010C32` - Darkest background color
- **spinet-light**: `#EEF6FF` - Light text/background color

### Adaptive Colors (Change with theme)

- **spinet-deep**:
  - Light mode: `#1A3B8E` (deep blue for headings)
  - Dark mode: `#EEF6FF` (light text)
- **spinet-muted**:
  - Light mode: `#F1F5F9` (light gray backgrounds)
  - Dark mode: `#082356` (navy backgrounds)
- **spinet-text-primary**:
  - Light mode: `#1A3B8E` (primary text color)
  - Dark mode: `#EEF6FF` (light text)
- **spinet-text-muted**:
  - Light mode: `#1A3B8E` with 80% opacity
  - Dark mode: `#EEF6FF` with 80% opacity

### Accent Colors

- **spinet-accent**: `#8FC8FF` - Light blue accent
- **spinet-soft**: `#DEE3F8` - Soft blue
- **spinet-hover**: Hover states (adapts per theme)
- **spinet-button**: Button colors (adapts per theme)

## Usage Examples

### 1. Automatic Theme Adaptation

Use these classes and they'll automatically adapt to light/dark mode:

```tsx
// Headings that adapt automatically
<h1 className="text-spinet-deep">Main Heading</h1>

// Muted text that adapts
<p className="text-spinet-text-muted">Secondary text</p>

// Backgrounds that adapt
<div className="bg-spinet-muted">Muted background</div>

// Primary brand color (stays blue in both themes)
<button className="bg-spinet-primary text-white">Brand Button</button>
```

### 2. Manual Theme Override

When you need specific colors for light and dark:

```tsx
// Red in light, blue in dark
<div className="bg-red-500 dark:bg-blue-500">Custom colors</div>

// Spinet colors with manual override
<div className="bg-spinet-light dark:bg-spinet-navy">
  Light background in light mode, navy in dark mode
</div>
```

### 3. ShadCN System Colors

Use these for components that should follow the design system:

```tsx
// These automatically adapt with the theme
<div className="bg-background text-foreground">Auto-themed content</div>
<div className="bg-card border-border">Card with border</div>
<button className="bg-primary text-primary-foreground">System button</button>
```

## Migration Guide

### Before (Old hardcoded colors):

```tsx
<h1 className="text-[#1A3B8E] dark:text-white">Heading</h1>
<p className="text-[#1A3B8E]/80 dark:text-white">Text</p>
<div className="bg-[#F1F5F9] dark:bg-[#082356]">Background</div>
```

### After (New color system):

```tsx
<h1 className="text-spinet-deep">Heading</h1>
<p className="text-spinet-text-muted">Text</p>
<div className="bg-spinet-muted">Background</div>
```

## Best Practices

1. **Use adaptive colors first**: Try `spinet-deep`, `spinet-text-muted`, `spinet-muted` before manual overrides
2. **Brand consistency**: Use `spinet-primary` for main brand elements
3. **System integration**: Use ShadCN colors (`primary`, `secondary`, `muted`) for UI components
4. **Manual overrides**: Only use `dark:` prefix when you need specific control

## Legacy Support

The following legacy colors are still available for backward compatibility:

- `azure`: `#145FF2`
- `navy`: `#082356`
- `main`: `#010C32`

## Technical Implementation

Colors are defined in:

- **CSS Variables**: `src/styles/globals.css` (HSL format)
- **Tailwind Config**: `tailwind.config.cjs` (class definitions)
- **Theme Support**: Automatic light/dark switching via CSS variables

The system uses HSL color values for better manipulation and consistency across the application.
