---
name: AIUB-HRMS Institutional Excellence
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#43474f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc74b'
  on-secondary-container: '#715300'
  tertiary: '#001f39'
  on-tertiary: '#ffffff'
  tertiary-container: '#00355c'
  on-tertiary-container: '#50a0ed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#ffdea0'
  secondary-fixed-dim: '#f4be43'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#9dcaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497c'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  metric-value:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 260px
  container_max_width: 1440px
  gutter: 24px
  margin_desktop: 40px
  stack_sm: 8px
  stack_md: 16px
  stack_lg: 24px
---

## Brand & Style

The design system is engineered for the American International University — Bangladesh (AIUB) human resource management ecosystem. It strikes a balance between academic prestige and modern administrative efficiency. The brand personality is **authoritative yet accessible**, fostering a sense of institutional stability and professional growth for faculty and staff.

Drawing inspiration from **Modern Corporate** aesthetics with a **Fluid Card-Based** layout, the system prioritizes clarity and whitespace. It minimizes visual noise to allow administrators to process complex HR data with high focus. The emotional response is one of reliability and "calm productivity"—moving away from dense, legacy ERP styles toward the breezy, spacious feel of modern SaaS platforms like MapleHR.

## Colors

This design system utilizes a high-contrast palette anchored by AIUB’s institutional legacy. 

- **Primary (Deep Navy):** Reserved for high-authority elements including the sidebar, primary action buttons, and top-level headers. This provides the "weight" of the university brand.
- **Accent (AIUB Gold):** Used sparingly for high-visibility triggers, active state indicators, and critical "Attention" badges.
- **Background & Surface:** An off-white background (`#F5F7FA`) ensures that white surface cards (`#FFFFFF`) pop with clear definition, reducing eye strain during long periods of data entry.
- **Semantic Colors:** Emerald, Amber, and Soft Red are utilized for status tracking (e.g., Leave Approval, Payroll Status) with consistent luminosity to ensure they don't clash with the primary navy.

## Typography

The typography system uses **Plus Jakarta Sans** for its contemporary, geometric character which offers superior readability in data-heavy environments. 

- **Hierarchy:** Headings use semi-bold and bold weights (600-700) to create a clear informational scaffold. 
- **Readability:** Body text is set at 14px to 16px with a generous 1.5–1.6 line height to prevent "text crowding" in HR policy documents or employee notes.
- **Functional Labels:** Metadata and table headers use a bold, slightly tracked-out uppercase style to differentiate them from dynamic user data.

## Layout & Spacing

The layout follows a **Fluid Grid with Fixed Anchors**. 

- **The Navigation Anchor:** A fixed 260px sidebar provides constant access to HR modules (Payroll, Recruitment, Attendance). 
- **Content Area:** The main stage uses a 12-column grid with a 24px gutter. For desktop (1440px), cards usually span 3 columns (metrics), 6 columns (charts), or 12 columns (data tables).
- **Rhythm:** A base-8 spacing scale ensures vertical consistency. Whitespace is used as a functional tool to group related employee data without needing heavy dividers.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layering**. 

- **The Base:** The `#F5F7FA` floor.
- **The Surface:** White cards use a soft shadow (`0 2px 8px rgba(0,0,0,0.06)`) to appear slightly lifted. 
- **The Interactive Layer:** Elements like dropdowns or active modals use a more pronounced shadow to indicate they are at the top of the Z-index.
- **The Sidebar:** Uses depth through color (Navy) rather than shadow, acting as a solid "foundation" for the rest of the interface.

## Shapes

The shape language is "Soft-Modern," utilizing rounded corners to make the professional environment feel more approachable.

- **Cards:** Use a `12px` to `16px` radius to reinforce the "container" feel.
- **Interactive Elements:** Buttons and Input fields use a tighter `8px` radius, providing a distinct "clickable" silhouette that contrasts with the larger layout containers.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them from functional buttons.

## Components

### Buttons
- **Primary:** 40px height, Deep Navy background, White text. Hover state transitions to AIUB Gold.
- **Secondary:** Ghost style with Navy border or subtle gray background.

### Metric Cards
- Feature a large bold number (Metric-value).
- Top-left or right contains an icon inside a pill-shaped background with 15% opacity of the icon's semantic color (e.g., Green for "Present Today").

### Tables
- **Styling:** No vertical lines. Horizontal dividers use `#E5E7EB`.
- **Rows:** Alternating "zebra" stripes using a 2% tint of Navy for a very subtle contrast.
- **Badges:** Pill-shaped with low-saturation backgrounds and high-saturation text for readability.

### Form Inputs
- 40px height.
- 8px border-radius.
- Focus state: 2px solid Deep Navy or a subtle Gold glow.

### Sidebar
- Full-height Navy background.
- Active state: A vertical Gold bar on the left edge or a subtle light-blue background highlight for the active menu item.