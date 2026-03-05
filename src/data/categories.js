// Category definitions with emoji, color, and type
export const CATEGORIES = {
    // Expense Categories
    food: { label: 'Food & Dining', emoji: '🍔', color: '#FF6B9D', type: 'expense' },
    transport: { label: 'Transport', emoji: '🚌', color: '#FFB347', type: 'expense' },
    shopping: { label: 'Shopping', emoji: '🛍️', color: '#6C63FF', type: 'expense' },
    entertainment: { label: 'Entertainment', emoji: '🎬', color: '#4ECDC4', type: 'expense' },
    health: { label: 'Health', emoji: '💊', color: '#4CAF88', type: 'expense' },
    education: { label: 'Education', emoji: '📚', color: '#45B7D1', type: 'expense' },
    utilities: { label: 'Utilities', emoji: '💡', color: '#96CEB4', type: 'expense' },
    rent: { label: 'Rent & Housing', emoji: '🏠', color: '#FFEAA7', type: 'expense' },
    personal: { label: 'Personal Care', emoji: '✨', color: '#DDA0DD', type: 'expense' },
    other_expense: { label: 'Other', emoji: '📦', color: '#888', type: 'expense' },

    // Income Categories
    salary: { label: 'Salary', emoji: '💼', color: '#4CAF88', type: 'income' },
    freelance: { label: 'Freelance', emoji: '💻', color: '#45B7AA', type: 'income' },
    pocket_money: { label: 'Pocket Money', emoji: '👛', color: '#6C63FF', type: 'income' },
    bonus: { label: 'Bonus', emoji: '🎁', color: '#FFB347', type: 'income' },
    investment: { label: 'Investment Return', emoji: '📈', color: '#4ECDC4', type: 'income' },
    other_income: { label: 'Other Income', emoji: '💰', color: '#96CEB4', type: 'income' },
};

export const EXPENSE_CATEGORIES = Object.entries(CATEGORIES)
    .filter(([, v]) => v.type === 'expense')
    .map(([k, v]) => ({ key: k, ...v }));

export const INCOME_CATEGORIES = Object.entries(CATEGORIES)
    .filter(([, v]) => v.type === 'income')
    .map(([k, v]) => ({ key: k, ...v }));

export const getCategoryInfo = (key) =>
    CATEGORIES[key] || { label: key, emoji: '📦', color: '#888', type: 'expense' };
