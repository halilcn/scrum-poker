# Scrum Poker — Style Guide

> **Version:** 1.0
> **Stack:** Next.js 15 · React 19 · Tailwind CSS v4 · shadcn/ui · Framer Motion
> **Purpose:** Reference document for all visual design decisions. When implementing new UI or revising existing styles, use this guide as the single source of truth.

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography](#2-typography)
3. [Spacing & Layout](#3-spacing--layout)
4. [Border Radius](#4-border-radius)
5. [Shadows](#5-shadows)
6. [Component Patterns](#6-component-patterns)
7. [Animation & Motion](#7-animation--motion)
8. [Game-Specific Components](#8-game-specific-components)
9. [CSS Variables — Full Mapping](#9-css-variables--full-mapping)
10. [Usage Examples](#10-usage-examples)

---

## 1. Color System

### 1.1 Brand Palette

The palette is built around a clean blue theme with a neutral snow-white background for accessibility and clarity.

| Name | Hex | OKLch | Role |
|---|---|---|---|
| **Primary Blue** | `#3F72AF` | `oklch(0.53 0.11 250)` | Primary — CTA, focus rings, links, hover |
| **Dark Navy** | `#112D4E` | `oklch(0.25 0.07 250)` | Dark — voted cards, break active, headings |
| **Soft Blue** | `#DBE2EF` | `oklch(0.91 0.02 260)` | Secondary — selected states, highlights, badges |
| **Snow** | `#F9F7F7` | `oklch(0.98 0.003 20)` | Background — page surface, card backgrounds |

### 1.2 Extended Neutrals

These neutrals complement the brand palette and are used for text, borders, and subtle surfaces.

| Token | Value | Usage |
|---|---|---|
| `neutral-50` | `#fafafa` | Lightest surface (white-ish) |
| `neutral-100` | `#f5f5f5` | Subtle dividers |
| `neutral-200` | `#e5e5e5` | Borders, input outlines |
| `neutral-300` | `#a3a3a3` | Muted text, placeholder |
| `neutral-400` | `#737373` | Secondary text |
| `neutral-500` | `#525252` | Body text |
| `neutral-600` | `#404040` | Subheadings |
| `neutral-700` | `#262626` | Dark text |
| `neutral-800` | `#171717` | Primary headings |
| `neutral-900` | `#0a0a0a` | Near-black |

### 1.3 Semantic Token Mapping

| Semantic Token | Light Mode | Dark Mode | Description |
|---|---|---|---|
| `--background` | `#F9F7F7` (Snow) | `oklch(0.145 0 0)` | Page and surface background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Default text color |
| `--primary` | `#3F72AF` (Primary Blue) | `oklch(0.91 0.02 260)` | CTAs, buttons, key UI |
| `--primary-foreground` | `#F9F7F7` (Snow) | `oklch(0.205 0 0)` | Text on primary bg |
| `--secondary` | `#DBE2EF` (Soft Blue) | `oklch(0.269 0 0)` | Selected states, chips |
| `--secondary-foreground` | `#112D4E` (Dark Navy) | `oklch(0.985 0 0)` | Text on secondary bg |
| `--accent` | `#DBE2EF` (Soft Blue) | `oklch(0.269 0 0)` | Hover highlights |
| `--accent-foreground` | `#112D4E` (Dark Navy) | `oklch(0.985 0 0)` | Text on accent bg |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Subdued surfaces |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Subdued text |
| `--ring` | `#3F72AF` (Primary Blue) | `oklch(0.556 0 0)` | Focus ring color |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Default border |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Input border |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Error / delete states |
| `--card` | `#F9F7F7` (Snow) | `oklch(0.205 0 0)` | Card background |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Card text |
| `--popover` | `#F9F7F7` (Snow) | `oklch(0.205 0 0)` | Popover/dropdown bg |

### 1.4 Status Colors

| State | Color | Hex | Usage |
|---|---|---|---|
| Success | Emerald | `#10b981` | Consensus reached, completed vote |
| Warning | Amber | `#f59e0b` | Tooltip divergence indicator |
| Error | Red | `oklch(0.577 0.245 27)` | Destructive actions |
| Info | Primary Blue | `#3F72AF` | Informational badges |
| Break (active) | Dark Navy | `#112D4E` | Break button active state |
| New badge | Red-500 | `#ef4444` | "NEW" badge on Raffle button |

### 1.5 Tailwind Custom Colors

Defined in `tailwind.config.js`:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'primary-blue': '#3F72AF',
      'dark-navy':    '#112D4E',
      'soft-blue':    '#DBE2EF',
      'snow':         '#F9F7F7',
    },
  },
}
```

---

## 2. Typography

### 2.1 Font Family

```css
/* System font stack — inherited from Next.js defaults */
font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
font-family: var(--font-geist-mono), ui-monospace, monospace; /* code blocks */
```

### 2.2 Type Scale

| Class | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-xs` | 12px / 0.75rem | 1rem | 400 | Labels, timestamps, badges |
| `text-sm` | 14px / 0.875rem | 1.25rem | 400–500 | Body text, button labels |
| `text-base` | 16px / 1rem | 1.5rem | 400 | Default body |
| `text-lg` | 18px / 1.125rem | 1.75rem | 500–600 | Card values, subheadings |
| `text-xl` | 20px / 1.25rem | 1.75rem | 600–700 | Section titles, playing card value |
| `text-2xl` | 24px / 1.5rem | 2rem | 700 | Page headings |
| `text-3xl` | 30px / 1.875rem | 2.25rem | 700 | Hero headings |

### 2.3 Font Weights

| Weight | Class | Usage |
|---|---|---|
| 400 | `font-normal` | Body text, descriptions |
| 500 | `font-medium` | Labels, usernames, secondary UI |
| 600 | `font-semibold` | Button text, card labels |
| 700 | `font-bold` | Voting card values, headings |

### 2.4 Common Text Patterns

```jsx
// Page heading
<h1 className="text-2xl font-bold" style={{ color: COLORS.gray800 }}>Room Name</h1>

// Username label under player card
<p className="text-sm font-medium truncate" style={{ color: COLORS.gray800 }}>
  {player.username}
</p>

// Muted helper text
<span className="text-xs font-medium text-gray-600">Choose your point</span>

// Voting card value
<span className="text-xl font-bold" style={{ color: COLORS.gray800 }}>
  {value}
</span>
```

---

## 3. Spacing & Layout

### 3.1 Spacing Scale

Uses Tailwind's default 4px base unit. Key values used in this project:

| Token | Value | Common Usage |
|---|---|---|
| `gap-2` | 8px | Tight flex gaps (player card elements) |
| `gap-4` | 16px | Standard component gaps |
| `p-2` | 8px | Compact padding (player card container) |
| `p-3` | 12px | Button padding (break/raffle buttons) |
| `p-4` | 16px | Standard panel padding (voting card tray) |
| `px-4 py-2` | 16px / 8px | Dropdown item padding |
| `px-3 py-2` | 12px / 8px | Tooltip padding |
| `mt-2` | 8px | Small vertical separation |
| `mb-3` | 12px | Label-to-component gap |

### 3.2 Container & Layout Widths

| Component | Width | Class / Value |
|---|---|---|
| Poker table | 300×145px | `w-[300px] h-[145px]` |
| Player card | auto | `w-12 h-16` (48×64px) |
| Action button (round) | 48×48px | `w-12 h-12` |
| Break button (active) | 96×48px | `w-24 h-12` |
| Voting card | 56×64px | `w-14 h-16` |
| Dropdown menu | 192px | `w-48` |
| Tooltip | min 250px | `minWidth: "250px"` |
| Emoji picker container | auto | absolute positioned |

### 3.3 Grid & Flex Patterns

```jsx
// Voting cards row
<div className="flex gap-2">
  {cardValues.map(...)}
</div>

// Player card label row
<div className="flex items-center justify-center gap-2">
  <img ... />
  <p ...>{player.username}</p>
  {onBreak && <Coffee />}
</div>

// Action buttons top-right
<div className="absolute z-50 right-0 top-3 flex items-center gap-2">
  {/* Raffle + Break buttons */}
</div>
```

---

## 4. Border Radius

### 4.1 Scale

`--radius: 0.625rem` (10px) is the base. shadcn/ui derives from it:

| Token | Value | Derived From |
|---|---|---|
| `--radius-sm` | `calc(var(--radius) - 4px)` = 6px | Small inputs, badges |
| `--radius-md` | `calc(var(--radius) - 2px)` = 8px | Cards, dropdowns |
| `--radius-lg` | `var(--radius)` = 10px | Default component radius |
| `--radius-xl` | `calc(var(--radius) + 4px)` = 14px | Large panels, sheets |
| `rounded-full` | 9999px | Avatars, action buttons, badges |
| `rounded-[42px]` | 42px | Poker table (oval shape) |
| `rounded-[34px]` | 34px | Poker table inner border |

### 4.2 Decision Guide

| Component | Radius | Rationale |
|---|---|---|
| Buttons (shadcn) | `--radius-md` | Standard interactive element |
| Cards | `--radius-md` | Consistent with buttons |
| Dialogs / Modals | `--radius-lg` | Larger containment |
| Tooltips | `rounded-lg` | Compact, informational |
| Dropdowns | `rounded-lg` | Panel-like |
| Avatars | `rounded-full` | Circular portrait convention |
| Action buttons (fab) | `rounded-full` | FAB (floating action button) pattern |
| Poker table | `rounded-[42px]` | Custom oval to evoke a real table |
| Badge (NEW) | `rounded-full` | Pill shape for short labels |

---

## 5. Shadows

### 5.1 Scale

| Class | Usage |
|---|---|
| `shadow-sm` | Subtle depth (settings button, emoji picker) |
| `shadow-md` | Selected voting card, elevated dropdown |
| `shadow-lg` | Action buttons (break/raffle), player card, playing card |
| `shadow-xl` | Hovered action button state |
| `shadow-2xl` | Poker table — maximum elevation |

### 5.2 Contextual Usage

| Component | Default Shadow | Hover Shadow |
|---|---|---|
| Playing card | `shadow-lg` | — |
| Voting card (selected) | `shadow-md` | — |
| Break button | `shadow-lg` | `hover:shadow-xl` |
| Raffle button | `shadow-lg` | `hover:shadow-xl` |
| Poker table | `shadow-2xl` | — |
| Tooltip | `shadow-xl` | — |
| Dropdown | `shadow-lg` | — |
| Avatar | `shadow-md` | `hover:shadow-lg` |

### 5.3 Glow Effects

Used only for special states (raffle winner celebration):

```jsx
// Raffle completed glow
<div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-30 blur-xl animate-pulse" />
<div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 blur-lg animate-pulse"
     style={{ animationDelay: "0.5s" }} />
```

---

## 6. Component Patterns

### 6.1 Button

Based on `shadcn/ui Button`. Variants used in this project:

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| `default` | `--primary` (#3F72AF) | `--primary-foreground` (Snow) | none | CTA buttons |
| `outline` | transparent | `--foreground` | `--border` | Voting cards |
| `ghost` | transparent | `--foreground` | none | Icon-only actions |
| `destructive` | `--destructive` | white | none | Delete/remove actions |

**Voting card button (selected state):**
```jsx
className={`w-14 h-16 text-lg font-bold cursor-pointer transition-all duration-200
  ${isSelected
    ? "border-[#3F72AF] text-[#112D4E] -translate-y-2 shadow-md"
    : "hover:border-[#3F72AF] hover:text-[#112D4E]"
  }`}
```

**Unknown card button:**
```jsx
// Unselected
"border-2 border-orange-400 text-orange-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
// Selected
"border-2 border-[#3F72AF] text-[#3F72AF] -translate-y-2 shadow-md"
```

**Round action button (Break / Raffle):**
```jsx
// Default (idle)
"w-12 h-12 rounded-full shadow-lg flex items-center justify-center p-3
 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 border
 cursor-pointer bg-white border-gray-200"

// Active break state
backgroundColor: "#112D4E"  // Dark Navy via inline style
"text-white border-[#112D4E] w-24"

// Active break + hover (clear action)
"hover:bg-red-500 hover:border-red-600"
```

### 6.2 Card

shadcn/ui `Card` wrapper. Used for playing cards and player card containers.

| State | Background | Border | Shadow |
|---|---|---|---|
| Unrevealed (idle) | `neutral-200` (`#e5e5e5`) | `neutral-400` (`#737373`) | `shadow-lg` |
| Voted (hidden) | `#112D4E` (Dark Navy) | `#3F72AF` | `shadow-lg` |
| Revealed | `#F9F7F7` (Snow) | `neutral-300` | `shadow-lg` |

```jsx
// Voted (hidden) card
<Card
  className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
  style={{ backgroundColor: "#112D4E", borderColor: "#3F72AF" }}
>
  <div className="w-6 h-6 rounded-full backdrop-blur-sm"
       style={{ backgroundColor: `${COLORS.white}30` }} />
</Card>

// Revealed card
<Card
  className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
  style={{ backgroundColor: "#F9F7F7", borderColor: COLORS.gray300 }}
>
  <span className="text-xl font-bold" style={{ color: COLORS.gray800 }}>
    {value}
  </span>
</Card>
```

### 6.3 Dialog

Used for user actions (avatar change, kick player). shadcn/ui `Dialog`.

```jsx
// Standard Dialog structure
<Dialog open={isOpen} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold" style={{ color: COLORS.gray800 }}>
        Dialog Title
      </DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Helper text
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 6.4 Badge

Used for "NEW" indicator on Raffle button.

```jsx
// NEW badge — pulse animation
<div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white
                text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
  NEW
</div>
```

For standard shadcn/ui badges:

| Variant | Usage |
|---|---|
| `default` | Primary labels |
| `secondary` | Soft Blue background — selected/active |
| `outline` | Subtle category labels |
| `destructive` | Error states |

### 6.5 Input

```jsx
// Standard input — uses --input and --ring CSS variables
<Input
  className="w-full"  // border-input, focus-visible:ring-ring applied by shadcn
  placeholder="Enter room name..."
/>
```

Focus ring uses `--ring` → `#3F72AF` (Primary Blue), providing a blue glow on focus.

### 6.6 Avatar

```jsx
// Player avatar in PlayerCard
<img
  src={player.imageUrl || DEFAULT_AVATAR_URL}
  alt={`${player.username} avatar`}
  className="w-6 h-6 rounded-full flex-shrink-0 border-1 border-white shadow-md
             ring-1 ring-gray-200 hover:shadow-lg transition-shadow duration-200"
/>

// Larger avatar (settings / profile)
<img className="w-10 h-10 rounded-full ring-2 ring-[#3F72AF]" />
```

### 6.7 Toast

Use shadcn/ui `Sonner` or `Toast`. Position: `bottom-right`.

```jsx
// Success toast
toast.success("Sprint name updated!", {
  duration: 3000,
  style: { backgroundColor: "#F9F7F7", borderColor: "#3F72AF" }
});

// Error toast
toast.error("Failed to update.", { duration: 4000 });
```

### 6.8 Tabs

```jsx
// Room view tabs (if applicable)
<Tabs defaultValue="board">
  <TabsList className="bg-muted">
    <TabsTrigger value="board" className="data-[state=active]:bg-[#3F72AF] data-[state=active]:text-[#F9F7F7]">
      Board
    </TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
  </TabsList>
</Tabs>
```

### 6.9 Sheet (Drawer)

Used for Raffle drawer.

```jsx
// RaffleDrawer pattern
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle style={{ color: COLORS.gray800 }}>Raffle</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

### 6.10 Dropdown

```jsx
// Break options dropdown
<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg
                border border-gray-200 overflow-hidden">
  <div className="py-1">
    {options.map(option => (
      <button key={option.value}
              className="w-full text-left px-4 py-2 text-sm text-gray-700
                         hover:bg-gray-100 hover:text-gray-900
                         transition-colors cursor-pointer">
        {option.label}
      </button>
    ))}
  </div>
</div>
```

### 6.11 Tooltip

Custom `CardTooltip` component — shows vote divergence warning.

```jsx
// CardTooltip visual structure
<div className="absolute z-50 px-3 py-2 text-xs font-light rounded-lg shadow-xl
                transition-opacity duration-200 -top-16 left-1/2 transform -translate-x-1/2
                border animate-in fade-in-0 zoom-in-95 flex items-center gap-2"
     style={{
       backgroundColor: COLORS.white,       // #fafafa
       color: COLORS.gray600,              // #404040
       minWidth: "250px",
       borderColor: COLORS.gray200,        // #d4d4d4
     }}>
  <AmberWarningIcon />
  <span>{message}</span>
  {/* Arrow pointing down */}
  <div className="absolute w-2 h-2 rotate-45 top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b"
       style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }} />
</div>
```

### 6.12 Select

```jsx
// shadcn/ui Select — uses CSS variable tokens
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select a value" />
  </SelectTrigger>
  <SelectContent>
    {cardValues.map(v => (
      <SelectItem key={v} value={v}>{v}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

## 7. Animation & Motion

### 7.1 Framer Motion Spring Configs

**Voting card tray (slide up from bottom):**
```js
transition: {
  type: "spring",
  stiffness: 300,
  damping: 30,
  duration: 0.4,
}
```
Use this config for all panel/tray enter/exit animations.

**Standard spring (snappy):**
```js
transition: { type: "spring", stiffness: 400, damping: 25 }
```

**Gentle spring (smooth):**
```js
transition: { type: "spring", stiffness: 200, damping: 35 }
```

### 7.2 Timing Constants

From `src/constants/index.js`:

```js
export const TIMING = {
  CARD_REVEAL_DELAY:  3125, // ms — delay before cards flip after voting ends
  CONFETTI_DURATION:  3125, // ms — confetti celebration duration
};
```

### 7.3 Standard Transitions

| Use Case | Class / Value |
|---|---|
| Color / background transitions | `transition-colors duration-200` |
| All property transitions | `transition-all duration-200` |
| Transform only | `transition-transform` |
| Scale on hover | `hover:scale-105` |
| Y-axis lift (selected card) | `-translate-y-2` |
| Shadow transition | `transition-shadow duration-200` |

### 7.4 AnimatePresence Patterns

**Sliding panel (VotingCards):**
```jsx
<AnimatePresence>
  {isVotingEnabled && (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
    >
      {/* content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Fade + scale (tooltips, modals):**
```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.15 }}
>
  {/* content */}
</motion.div>
```

**Staggered list:**
```jsx
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
    >
      {item.label}
    </motion.li>
  ))}
</motion.ul>
```

### 7.5 CSS Animations

| Class | Usage |
|---|---|
| `animate-pulse` | Break active status, raffle glow, NEW badge |
| `animate-in fade-in-0 zoom-in-95` | Tooltip enter (shadcn/ui pattern) |
| `tw-animate-css` | Imported via `@import "tw-animate-css"` in globals |

---

## 8. Game-Specific Components

### 8.1 Voting Card States

Voting cards appear as a fixed tray at the bottom of the screen during `status === "voting"`.

| State | Visual |
|---|---|
| **Idle** | `outline` button, default border, neutral text |
| **Hover** | Border → `#3F72AF` (Primary Blue), text → `#112D4E` (Dark Navy) |
| **Selected** | Border → `#3F72AF`, text → `#112D4E`, `-translate-y-2`, `shadow-md` |
| **Unknown (?)** | Orange border/text (`border-orange-400 text-orange-400`) |
| **Unknown selected** | Primary Blue border/text, `-translate-y-2` |
| **Disabled (not voting)** | Tray hidden via `AnimatePresence` exit |

### 8.2 Playing Card States

48×64px cards shown inside `PlayerCard` component.

| State | Background | Border | Content |
|---|---|---|---|
| **Idle (no vote)** | `neutral-200` (#e5e5e5) | `neutral-400` (#737373) | Decorative inner border + circle |
| **Voted (hidden)** | Dark Navy `#112D4E` | `#3F72AF` | Frosted white circle (`opacity: 0.19`) |
| **Revealing** | Dark Navy `#112D4E` | `#3F72AF` | Card flip animation (3.125s delay) |
| **Revealed** | Snow `#F9F7F7` | `neutral-300` (#a3a3a3) | Point value — `text-xl font-bold` |

**Card size:** `w-12 h-16` (48×64px), `border-2`, `rounded-md` (via shadcn Card)

### 8.3 Poker Table

The central oval table element.

```
Width:  300px   (w-[300px])
Height: 145px   (h-[145px])
Radius: 42px    (rounded-[42px])
Border: 3px     (border-3)
Shadow: shadow-2xl
Background: neutral-200 (#e5e5e5)
Border color: neutral-400 (#737373)
```

**Inner decoration border:**
```
Inset: 8px (inset-2)
Radius: 34px (rounded-[34px])
Border: 2px, color: neutral-300 at 31% opacity (#a3a3a330)
```

**Corner dots (4x decorative):**
```
Size: 8px (w-2 h-2)
Shape: rounded-full
Color: neutral-400 at 25% opacity (#73737340)
Positions: top-4 left-4 / top-4 right-4 / bottom-4 left-4 / bottom-4 right-4
```

### 8.4 Status Indicators

**Break status on player label:**
```jsx
{player.breakStatus && player.breakStatus !== "none" && (
  <Coffee className="w-4 h-4 flex-shrink-0"
          style={{ color: COLORS.primaryBlue }} />  // #3F72AF
)}
```

**Break button states:**

| State | Appearance |
|---|---|
| Idle | White bg, gray border, coffee icon |
| Active break | Dark Navy `#112D4E` bg, white text + icon + timer |
| Active + hover | Red-500 bg (`#ef4444`), X icon |

**Tooltip divergence indicator:**
- Warning icon: Amber circle (`#F59E0B`) with white exclamation
- Auto-hides after 15 seconds (`autoHideDelay: 15000`)
- Shows when player's vote diverges significantly from average

---

## 9. CSS Variables — Full Mapping

Drop-in replacement for `:root` and `.dark` in `src/app/globals.css`.
**Copy-paste ready block:**

```css
/* ============================================================
   src/app/globals.css
   Palette: Primary Blue / Dark Navy / Soft Blue / Snow
   ============================================================ */

:root {
  --radius: 0.625rem;

  /* Surfaces */
  --background:         oklch(0.98 0.003 20);     /* #F9F7F7 — Snow */
  --foreground:         oklch(0.145 0 0);

  /* Cards & Popovers */
  --card:               oklch(0.98 0.003 20);     /* #F9F7F7 */
  --card-foreground:    oklch(0.145 0 0);
  --popover:            oklch(0.98 0.003 20);     /* #F9F7F7 */
  --popover-foreground: oklch(0.145 0 0);

  /* Primary — Ocean Blue */
  --primary:            oklch(0.53 0.11 250);     /* #3F72AF */
  --primary-foreground: oklch(0.98 0.003 20);     /* #F9F7F7 Snow */

  /* Secondary — Soft Blue */
  --secondary:          oklch(0.91 0.02 260);     /* #DBE2EF */
  --secondary-foreground: oklch(0.25 0.07 250);  /* #112D4E Dark Navy */

  /* Muted */
  --muted:              oklch(0.97 0 0);
  --muted-foreground:   oklch(0.556 0 0);

  /* Accent — Soft Blue */
  --accent:             oklch(0.91 0.02 260);     /* #DBE2EF */
  --accent-foreground:  oklch(0.25 0.07 250);     /* #112D4E Dark Navy */

  /* Feedback */
  --destructive:        oklch(0.577 0.245 27.325);

  /* Borders & Inputs */
  --border:             oklch(0.922 0 0);
  --input:              oklch(0.922 0 0);

  /* Focus ring — Ocean Blue */
  --ring:               oklch(0.53 0.11 250);     /* #3F72AF */

  /* Charts */
  --chart-1:            oklch(0.646 0.222 41.116);
  --chart-2:            oklch(0.6 0.118 184.704);
  --chart-3:            oklch(0.53 0.11 250);     /* Ocean Blue */
  --chart-4:            oklch(0.828 0.189 84.429);
  --chart-5:            oklch(0.769 0.188 70.08);

  /* Sidebar */
  --sidebar:                         oklch(0.98 0.003 20);
  --sidebar-foreground:              oklch(0.145 0 0);
  --sidebar-primary:                 oklch(0.53 0.11 250);    /* Ocean Blue */
  --sidebar-primary-foreground:      oklch(0.98 0.003 20);    /* Snow */
  --sidebar-accent:                  oklch(0.91 0.02 260);    /* Soft Blue */
  --sidebar-accent-foreground:       oklch(0.25 0.07 250);
  --sidebar-border:                  oklch(0.922 0 0);
  --sidebar-ring:                    oklch(0.53 0.11 250);    /* Ocean Blue */
}

.dark {
  --background:         oklch(0.145 0 0);
  --foreground:         oklch(0.985 0 0);

  --card:               oklch(0.205 0 0);
  --card-foreground:    oklch(0.985 0 0);
  --popover:            oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);

  /* Primary lightens in dark mode */
  --primary:            oklch(0.91 0.02 260);     /* Soft Blue #DBE2EF */
  --primary-foreground: oklch(0.205 0 0);

  --secondary:          oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);

  --muted:              oklch(0.269 0 0);
  --muted-foreground:   oklch(0.708 0 0);

  --accent:             oklch(0.269 0 0);
  --accent-foreground:  oklch(0.985 0 0);

  --destructive:        oklch(0.704 0.191 22.216);

  --border:             oklch(1 0 0 / 10%);
  --input:              oklch(1 0 0 / 15%);
  --ring:               oklch(0.556 0 0);

  --chart-1:            oklch(0.488 0.243 264.376);
  --chart-2:            oklch(0.696 0.17 162.48);
  --chart-3:            oklch(0.769 0.188 70.08);
  --chart-4:            oklch(0.627 0.265 303.9);
  --chart-5:            oklch(0.645 0.246 16.439);

  --sidebar:                         oklch(0.205 0 0);
  --sidebar-foreground:              oklch(0.985 0 0);
  --sidebar-primary:                 oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground:      oklch(0.985 0 0);
  --sidebar-accent:                  oklch(0.269 0 0);
  --sidebar-accent-foreground:       oklch(0.985 0 0);
  --sidebar-border:                  oklch(1 0 0 / 10%);
  --sidebar-ring:                    oklch(0.556 0 0);
}
```

### 9.1 Updated COLORS Constant

When migrating `src/constants/index.js` to use the new palette:

```js
// src/constants/index.js
export const COLORS = {
  // Neutrals (unchanged)
  white:   "#fafafa",
  gray50:  "#f5f5f5",
  gray100: "#e5e5e5",
  gray200: "#d4d4d4",
  gray300: "#a3a3a3",
  gray400: "#737373",
  gray500: "#525252",
  gray600: "#404040",
  gray700: "#262626",
  gray800: "#171717",
  black:   "#0a0a0a",

  // Brand palette
  primaryBlue: "#3F72AF",  // --primary
  darkNavy:    "#112D4E",  // Dark emphasis
  softBlue:    "#DBE2EF",  // --secondary
  snow:        "#F9F7F7",  // --background

  // Legacy (maps to primaryBlue)
  "stori-poi": "#3F72AF",

  // Keep blue utilities
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
};
```

---

## 10. Usage Examples

### Example 1 — Primary CTA Button

```jsx
// Standard CTA using --primary token (Primary Blue)
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Start Voting
</Button>
// Renders as: #3F72AF background, #F9F7F7 text
```

### Example 2 — Selected Voting Card

```jsx
// Voting card with selection lift effect
<Button
  variant="outline"
  size="lg"
  onClick={() => handleCardSelect(value)}
  className={`w-14 h-16 text-lg font-bold cursor-pointer transition-all duration-200
    ${isSelected
      ? "border-[#3F72AF] text-[#112D4E] -translate-y-2 shadow-md"
      : "hover:border-[#3F72AF] hover:text-[#112D4E]"
    }`}
>
  {value}
</Button>
```

### Example 3 — Active Break Button

```jsx
// Break button in active state — Dark Navy background
<button
  className="w-24 h-12 rounded-full shadow-lg flex items-center gap-2
             text-white border-[#112D4E] hover:bg-red-500 hover:border-red-600
             transition-all duration-200 cursor-pointer justify-center p-3"
  style={{ backgroundColor: "#112D4E" }}
>
  <Coffee className="w-5 h-5" />
  <span className="text-sm font-medium">5:00</span>
</button>
```

### Example 4 — Voted (Hidden) Playing Card

```jsx
// Card showing a vote has been cast, value hidden
<Card
  className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
  style={{ backgroundColor: "#112D4E", borderColor: "#3F72AF" }}
>
  <div
    className="w-6 h-6 rounded-full backdrop-blur-sm"
    style={{ backgroundColor: "rgba(250,250,250,0.19)" }}
  />
</Card>
```

### Example 5 — Voting Card Tray AnimatePresence

```jsx
<AnimatePresence>
  {status === "voting" && (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10"
    >
      <div className="p-4">
        <div className="text-center mb-3">
          <span className="text-xs font-medium text-gray-600">Choose your point</span>
        </div>
        <div className="flex gap-2">{/* cards */}</div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### Example 6 — Focus Ring (Primary Blue)

```jsx
// Input with Primary Blue focus ring via --ring variable
<Input
  className="focus-visible:ring-[#3F72AF] focus-visible:border-[#3F72AF]"
  placeholder="Sprint name..."
/>

// Or rely on CSS variable (--ring is set to #3F72AF in :root)
<Input placeholder="Sprint name..." />
// shadcn's outline: ring automatically uses var(--ring)
```

### Example 7 — Player Username Label

```jsx
// Username row under player card
<div className="flex items-center justify-center gap-2">
  <img
    src={player.imageUrl || DEFAULT_AVATAR_URL}
    alt={`${player.username} avatar`}
    className="w-6 h-6 rounded-full flex-shrink-0 border border-white shadow-md
               ring-1 ring-gray-200 hover:shadow-lg transition-shadow duration-200"
  />
  <p
    className="text-sm font-medium truncate"
    style={{ color: COLORS.gray800 }}
    title={player.username}
  >
    {player.username}
  </p>
  {isOnBreak && (
    <Coffee className="w-4 h-4 flex-shrink-0" style={{ color: "#3F72AF" }} />
  )}
</div>
```

### Example 8 — Divergence Tooltip

```jsx
// CardTooltip with amber warning icon
<div
  className="absolute z-50 px-3 py-2 text-xs font-light rounded-lg shadow-xl
             -top-16 left-1/2 -translate-x-1/2 border
             animate-in fade-in-0 zoom-in-95 flex items-center gap-2"
  style={{
    backgroundColor: "#fafafa",
    color: "#404040",
    minWidth: "250px",
    borderColor: "#d4d4d4",
  }}
>
  <AmberWarningIcon />   {/* #F59E0B circle */}
  <span className="flex-1">{message}</span>
  {/* Arrow */}
  <div className="absolute w-2 h-2 rotate-45 top-full left-1/2 -translate-x-1/2 -mt-1
                  border-r border-b bg-[#fafafa] border-[#d4d4d4]" />
</div>
```

### Example 9 — Soft Blue Selected Badge / Chip

```jsx
// Selected state chip using Soft Blue
<span
  className="px-2 py-0.5 rounded-full text-xs font-medium"
  style={{
    backgroundColor: "#DBE2EF",
    color: "#112D4E",
    border: "1px solid #3F72AF",
  }}
>
  Selected
</span>

// Or via Tailwind if colors are added to config:
<span className="bg-soft-blue text-dark-navy border border-primary-blue px-2 py-0.5 rounded-full text-xs font-medium">
  Selected
</span>
```

### Example 10 — Staggered Player List with Motion

```jsx
// Players entering the room with stagger
<div className="flex gap-4">
  {participants.map((player, i) => (
    <motion.div
      key={player.userId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: i * 0.05,
      }}
    >
      <PlayerCard player={player} />
    </motion.div>
  ))}
</div>
```

---

## Appendix — Quick Reference

### Palette at a Glance

```
#3F72AF  Primary Blue  →  Primary / CTAs / Focus rings / Links / Hover
#112D4E  Dark Navy     →  Voted cards / Break active / Dark emphasis
#DBE2EF  Soft Blue     →  Selected states / Secondary chips / Highlights
#F9F7F7  Snow          →  Background / Card surface / Primary foreground
```

### Component → Token Map

```
VotingCard selected    → border: #3F72AF, text: #112D4E
VotingCard hover       → border: #3F72AF, text: #112D4E
Break button active    → bg: #112D4E, text: #F9F7F7
Playing card voted     → bg: #112D4E, border: #3F72AF
Playing card revealed  → bg: #F9F7F7, border: neutral-300
Focus rings            → #3F72AF
Page background        → #F9F7F7
Poker table            → neutral-200 (unchanged)
Avatar ring (selected) → #3F72AF
Break icon             → #3F72AF
```

### Do's and Don'ts

| Do | Don't |
|---|---|
| Use `#3F72AF` for all primary interactive elements | Mix old `#286ddb` stori-poi with new palette |
| Use `#3F72AF` for all hover/focus rings | Use `#5c91e8` (old accent) — replace with `#3F72AF` |
| Use `#F9F7F7` as background in both cards and page | Use pure white `#ffffff` for card surfaces |
| Use `#DBE2EF` for selected/active secondary states | Use Soft Blue for primary CTAs — it's too light |
| Keep Framer Motion spring stiffness 200–400 range | Use `ease` or `linear` for interactive feedback |
| Use `transition-all duration-200` for micro-interactions | Skip transitions on color-changing elements |
| Use `shadow-lg` for floating elements | Use `shadow-sm` for FABs — they need more elevation |
