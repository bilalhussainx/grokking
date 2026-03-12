# Glassmorphism + Gradient Redesign

## Approach
Full redesign of the Grokking learning platform using glassmorphism aesthetic with gradient accents. Premium SaaS feel (Linear/Vercel/Raycast inspired).

## Design System

### Colors (Dark Mode — Primary)
- Background: `#060B18`
- Surface/Cards: `rgba(255,255,255,0.05)` + `backdrop-blur-xl`
- Border: `rgba(255,255,255,0.08)`
- Primary gradient: `from-blue-500 via-purple-500 to-pink-500`
- Text primary: white, secondary: `#94A3B8`
- Success: emerald-400, Error: rose-400

### Colors (Light Mode)
- Background: `#F8FAFC`
- Cards: white + `shadow-lg`
- Borders: `#E2E8F0`
- Same gradient accents

### Typography
- Inter (body) + JetBrains Mono (code)
- Hero: up to 7xl, tight tracking
- Body: 300-400 weight, headings: 700-800

### Component Patterns
- Glass cards: `bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl`
- Gradient primary buttons, ghost secondary
- Glass inputs with blue focus glow
- Animated gradient background orbs

## Pages

### Landing Page
- Glass navbar with login/signup
- Large gradient hero with floating orbs
- Stats in glass cards
- 3 feature glass cards with gradient icons
- Course catalog with gradient-border hover cards

### Auth Pages (Login/Signup)
- Centered glass card on gradient background
- Floating gradient orbs
- Glass inputs, gradient submit button

### Course Layout
- Glass TopNav with progress gradient bar
- Glass sidebar with gradient active indicator
- Clean lesson content, dark glass IDE panel

## Build Order
1. Global CSS — variables, glass utilities, gradient orbs
2. Landing page components
3. Auth pages
4. TopNav + Sidebar
5. CourseLayout
6. LessonPage + IDE refinements
