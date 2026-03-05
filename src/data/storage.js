// localStorage keys
const KEYS = {
    TRANSACTIONS: 'smartspend_transactions',
    BUDGET: 'smartspend_budget',
    USER: 'smartspend_user',
};

// --- Transactions ---
export const getTransactions = () => {
    try {
        const raw = localStorage.getItem(KEYS.TRANSACTIONS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveTransactions = (transactions) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const addTransaction = (transaction) => {
    const current = getTransactions();
    const updated = [transaction, ...current];
    saveTransactions(updated);
    return updated;
};

export const updateTransaction = (id, updates) => {
    const current = getTransactions();
    const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTransactions(updated);
    return updated;
};

export const deleteTransaction = (id) => {
    const current = getTransactions();
    const updated = current.filter((t) => t.id !== id);
    saveTransactions(updated);
    return updated;
};

// --- Budget ---
export const getBudget = () => {
    try {
        const raw = localStorage.getItem(KEYS.BUDGET);
        return raw ? JSON.parse(raw) : { monthly: 0 };
    } catch {
        return { monthly: 0 };
    }
};

export const saveBudget = (budget) => {
    localStorage.setItem(KEYS.BUDGET, JSON.stringify(budget));
};

// --- User ---
export const getUser = () => {
    try {
        const raw = localStorage.getItem(KEYS.USER);
        return raw ? JSON.parse(raw) : { name: 'User', currency: '₹' };
    } catch {
        return { name: 'User', currency: '₹' };
    }
};

export const saveUser = (user) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

// --- Seed demo data ---
export const seedDemoData = () => {
    const { v4: uuidv4 } = require('uuid');
    const now = new Date();

    const demoTx = [
        { id: uuidv4(), type: 'income', category: 'pocket_money', amount: 8000, note: 'Monthly allowance', date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'food', amount: 450, note: 'Lunch with friends', date: new Date(now.getFullYear(), now.getMonth(), 2).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'transport', amount: 150, note: 'Metro card recharge', date: new Date(now.getFullYear(), now.getMonth(), 3).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'shopping', amount: 1200, note: 'New headphones', date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'entertainment', amount: 300, note: 'Movie night', date: new Date(now.getFullYear(), now.getMonth(), 7).toISOString() },
        { id: uuidv4(), type: 'income', category: 'freelance', amount: 3500, note: 'Web project', date: new Date(now.getFullYear(), now.getMonth(), 8).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'education', amount: 999, note: 'Online course subscription', date: new Date(now.getFullYear(), now.getMonth(), 10).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'food', amount: 600, note: 'Grocery shopping', date: new Date(now.getFullYear(), now.getMonth(), 12).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'health', amount: 250, note: 'Vitamins & supplements', date: new Date(now.getFullYear(), now.getMonth(), 14).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'personal', amount: 350, note: 'Haircut', date: new Date(now.getFullYear(), now.getMonth(), 15).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'food', amount: 400, note: 'Pizza with roommates', date: new Date(now.getFullYear(), now.getMonth(), 16).toISOString() },
        { id: uuidv4(), type: 'expense', category: 'transport', amount: 200, note: 'Cab rides', date: new Date(now.getFullYear(), now.getMonth(), 18).toISOString() },
    ];

    saveTransactions(demoTx);
    saveBudget({ monthly: 7000 });
};
