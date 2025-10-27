# Header Compound Component Pattern

This directory contains a flexible, reusable header system built using the **Compound Component Pattern**. This pattern allows you to compose different header layouts by mixing and matching sub-components.

## Architecture

### Core Component
- **Header**: Base compound component with context and sub-components

### Shared Sub-Components (Reusable Across All Headers)
- **BrandLogo**: Application logo/branding
- **NavLink**: Styled navigation link
- **SignInButton**: Sign-in button with i18n
- **MobileNavItem**: Mobile navigation item with active state
- **LanguageSwitcher**: Language selector (from `@/components`)

### Pre-Composed Headers (Ready to Use)
- **DesktopHeader**: Main site header (desktop navigation)
- **DashboardHeader**: Admin dashboard header (search, notifications, user menu)
- **MobileFooter**: Mobile bottom navigation

## Usage

### Using Pre-Composed Headers

The simplest way is to use the pre-composed headers:

```tsx
import { DesktopHeader } from '@/components/header';

export default function Layout({ children }) {
  return (
    <>
      <DesktopHeader />
      <main>{children}</main>
    </>
  );
}
```

### Creating Custom Compositions

You can create your own header compositions using the compound pattern:

```tsx
import { Header, BrandLogo, NavLink, SignInButton } from '@/components/header';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function CustomHeader() {
  return (
    <Header>
      <Header.Container>
        <Header.Logo>
          <BrandLogo />
        </Header.Logo>

        <Header.Nav hideOnMobile={false}>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <LanguageSwitcher />
        </Header.Nav>

        <Header.Actions>
          <SignInButton variant="solid" />
        </Header.Actions>
      </Header.Container>
    </Header>
  );
}
```

### Dashboard Header with Content Alignment

For dashboard layouts, use `alignContent` to match the dashboard content padding:

```tsx
import { Header } from '@/components/header';
import { Search } from 'lucide-react';

export function CustomDashboardHeader() {
  return (
    <Header variant="dashboard">
      <Header.Container alignContent> {/* Aligns with dashboard content */}
        <Header.Search>
          <Input placeholder="Search..." />
        </Header.Search>

        <Header.Actions>
          <NotificationBell />
          <UserMenu />
        </Header.Actions>
      </Header.Container>
    </Header>
  );
}
```

## API Reference

### Header (Root Component)

```tsx
<Header variant="default" | "dashboard" className="...">
  {children}
</Header>
```

### Header.Container

```tsx
<Header.Container
  alignContent={false}  // true for dashboard content alignment
  className="..."
>
  {children}
</Header.Container>
```

### Header.Logo

```tsx
<Header.Logo className="...">
  {children}
</Header.Logo>
```

### Header.Nav

```tsx
<Header.Nav
  hideOnMobile={true}  // Hide on mobile devices
  className="..."
>
  {children}
</Header.Nav>
```

### Header.Actions

```tsx
<Header.Actions className="...">
  {children}
</Header.Actions>
```

### Header.Search

```tsx
<Header.Search className="...">
  {children}
</Header.Search>
```

### Header.User

```tsx
<Header.User className="...">
  {children}
</Header.User>
```

## Examples

### Desktop Header (Main Site)

```tsx
<Header>
  <Header.Container>
    <Header.Logo>
      <BrandLogo />
    </Header.Logo>
    <Header.Nav hideOnMobile>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/locations">Locations</NavLink>
      <LanguageSwitcher />
      <SignInButton />
    </Header.Nav>
  </Header.Container>
</Header>
```

### Dashboard Header

```tsx
<Header variant="dashboard">
  <Header.Container alignContent>
    <Header.Search>
      <Input placeholder="Search..." />
    </Header.Search>
    <Header.Actions>
      <LanguageSwitcher />
      <NotificationDropdown />
      <UserDropdown />
    </Header.Actions>
  </Header.Container>
</Header>
```

### Mobile Footer

```tsx
<footer className="...">
  <nav>
    <MobileNavItem href="/" label="Home" icon={<HomeIcon />} />
    <MobileNavItem href="/locations" label="Locations" icon={<MapIcon />} />
    <MobileNavItem href="/bookings" label="Bookings" icon={<CalendarIcon />} />
    <MobileNavItem href="/profile" label="Profile" icon={<UserIcon />} />
  </nav>
</footer>
```

## Benefits

1. **Flexibility**: Mix and match sub-components to create different layouts
2. **Reusability**: Shared sub-components reduce code duplication
3. **Consistency**: Same components ensure consistent styling
4. **Maintainability**: Changes propagate to all compositions
5. **Type Safety**: Full TypeScript support with IntelliSense
6. **Composability**: Easy to add new sub-components or compositions

## Backwards Compatibility

The old `Header` and `MobileFooter` components in `/components` are now re-exports of the new composites, ensuring existing code continues to work:

```tsx
// This still works!
import { Header } from '@/components/Header';
import { MobileFooter } from '@/components/MobileFooter';
```

## Adding New Compositions

To create a new header composition:

1. Create a new file in `components/header/`
2. Import the compound component and sub-components
3. Compose your custom header layout
4. Export from `index.ts`

Example:

```tsx
// components/header/MarketingHeader.tsx
export function MarketingHeader() {
  return (
    <Header>
      <Header.Container>
        <Header.Logo>
          <BrandLogo />
        </Header.Logo>
        <Header.Nav>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </Header.Nav>
        <Header.Actions>
          <Button>Get Started</Button>
        </Header.Actions>
      </Header.Container>
    </Header>
  );
}
```

Then export it in `index.ts`:

```tsx
export { MarketingHeader } from './MarketingHeader';
```
