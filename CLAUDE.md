# Time Tracker Dev Guide

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style
- **Imports**: React imports first, followed by UI components using '@/' path aliases
- **Component Structure**: Functional components with useState/useEffect hooks
- **Naming**: 
  - PascalCase for components (TimeTracker, CalendarPopup)
  - camelCase for variables and functions
  - kebab-case for CSS classes and file names
- **State Management**: Use React useState for component state, localStorage for persistence
- **Props**: Destructure props in function parameters
- **Formatting**: 2-space indentation, semicolons required
- **Error Handling**: Use try/catch for async operations
- **Types**: Add descriptive comments for complex data structures
- **CSS**: Use Tailwind utility classes, organize by component

## Architecture
- Component-based UI using React
- Reusable UI components in src/components/ui/
- Main TimeTracker component manages app state