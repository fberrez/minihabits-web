# minihabits

A minimalist habit tracking application built with React that helps users build and maintain daily habits through simple, visual tracking.

## Features

- 🎯 Track daily habits with a simple click
- ✨ Celebratory confetti animations for completed habits
- 📊 Detailed statistics and visualizations
  - Current and longest streaks
  - Monthly calendar view
  - Yearly completion overview
  - Monthly completion trends
- 🌙 Dark mode support
- 📱 Responsive design
- 🔒 User authentication

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Calendar**: react-day-picker
- **Animations**: js-confetti

## Getting Started

```bash
git clone https://github.com/fberrez/minihabits.git
cd minihabits
pnpm install
pnpm run dev
```

## Project Structure

```
src/
├── components/ # Reusable UI components
├── contexts/ # React context providers
│ ├── AuthContext.tsx
│ └── HabitContext.tsx
├── pages/ # Main application pages
│ ├── HabitList.tsx
│ └── StatsPage.tsx
└── services/ # API service layer
└── habits.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.