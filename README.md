# SmartSpend

A modern expense tracking application built with React and Vite. Manage your finances effortlessly with features for tracking transactions, setting budgets, and analyzing spending patterns.

## Features

- **Dashboard**: Overview of your financial status and recent transactions
- **Transactions**: Log and manage all your expenses and income
- **Budget Management**: Set category-based budgets and monitor spending
- **Analytics**: Visualize spending patterns and trends
- **Categories**: Pre-configured spending categories with custom options
- **Settings**: Personalize your experience
- **Data Persistence**: All data is saved locally in your browser

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Context API** - State management
- **CSS3** - Styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/codersurya04/SmartSpend.git
cd SmartSpend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # Reusable components
├── context/          # React Context for state management
├── data/             # Data utilities and categories
├── pages/            # Page components
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Usage

1. **Add Transactions**: Navigate to the Transactions page and add income or expenses
2. **Set Budgets**: Go to Budget page to set spending limits for each category
3. **View Analytics**: Check the Analytics page to see spending insights
4. **Manage Settings**: Customize app preferences in Settings

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.
