import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    getTransactions, saveTransactions,
    getBudget, saveBudget,
    getUser, saveUser,
} from '../data/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState({ monthly: 0 });
    const [user, setUser] = useState({ name: 'User', currency: '₹' });

    // Load from localStorage on mount
    useEffect(() => {
        setTransactions(getTransactions());
        setBudget(getBudget());
        setUser(getUser());
    }, []);

    // ---- Transaction ops ----
    const addTransaction = useCallback((data) => {
        const tx = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
        setTransactions((prev) => {
            const updated = [tx, ...prev];
            saveTransactions(updated);
            return updated;
        });
    }, []);

    const editTransaction = useCallback((id, data) => {
        setTransactions((prev) => {
            const updated = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
            saveTransactions(updated);
            return updated;
        });
    }, []);

    const deleteTransaction = useCallback((id) => {
        setTransactions((prev) => {
            const updated = prev.filter((t) => t.id !== id);
            saveTransactions(updated);
            return updated;
        });
    }, []);

    // ---- Budget ops ----
    const updateBudget = useCallback((val) => {
        const b = { monthly: Number(val) };
        setBudget(b);
        saveBudget(b);
    }, []);

    // ---- User ops ----
    const updateUser = useCallback((data) => {
        setUser((prev) => {
            const updated = { ...prev, ...data };
            saveUser(updated);
            return updated;
        });
    }, []);

    // ---- Computed helpers (current month) ----
    const now = new Date();
    const currentMonthTx = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalIncome = currentMonthTx
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);

    const totalExpense = currentMonthTx
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
    const budgetUsed = budget.monthly > 0 ? (totalExpense / budget.monthly) * 100 : 0;
    const budgetStatus = budgetUsed >= 100 ? 'critical' : budgetUsed >= 80 ? 'warn' : 'ok';

    // ---- Seed demo data ----
    const seedDemo = useCallback(() => {
        const demoTx = [];
        const makeDate = (day) => new Date(now.getFullYear(), now.getMonth(), day).toISOString();

        [
            { type: 'income', category: 'pocket_money', amount: 8000, note: 'Monthly allowance', date: makeDate(1) },
            { type: 'income', category: 'freelance', amount: 3500, note: 'Web design project', date: makeDate(8) },
            { type: 'expense', category: 'rent', amount: 2500, note: 'PG accommodation', date: makeDate(1) },
            { type: 'expense', category: 'food', amount: 450, note: 'Lunch with friends', date: makeDate(2) },
            { type: 'expense', category: 'transport', amount: 150, note: 'Metro card recharge', date: makeDate(3) },
            { type: 'expense', category: 'shopping', amount: 1200, note: 'New headphones', date: makeDate(5) },
            { type: 'expense', category: 'entertainment', amount: 300, note: 'Movie night', date: makeDate(7) },
            { type: 'expense', category: 'education', amount: 999, note: 'Online course', date: makeDate(10) },
            { type: 'expense', category: 'food', amount: 600, note: 'Grocery shopping', date: makeDate(12) },
            { type: 'expense', category: 'health', amount: 250, note: 'Vitamins', date: makeDate(14) },
            { type: 'expense', category: 'personal', amount: 350, note: 'Haircut & grooming', date: makeDate(15) },
            { type: 'expense', category: 'food', amount: 400, note: 'Pizza with roommates', date: makeDate(16) },
            { type: 'expense', category: 'transport', amount: 200, note: 'Cab rides', date: makeDate(18) },
        ].forEach((t) => demoTx.push({ ...t, id: uuidv4(), createdAt: new Date().toISOString() }));

        saveTransactions(demoTx);
        saveBudget({ monthly: 7000 });
        saveUser({ name: 'Alex', currency: '₹' });
        setTransactions(demoTx);
        setBudget({ monthly: 7000 });
        setUser({ name: 'Alex', currency: '₹' });
    }, [now]);

    return (
        <AppContext.Provider value={{
            transactions,
            currentMonthTx,
            totalIncome,
            totalExpense,
            balance,
            savingsRate,
            budget,
            budgetUsed,
            budgetStatus,
            user,
            addTransaction,
            editTransaction,
            deleteTransaction,
            updateBudget,
            updateUser,
            seedDemo,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
};
