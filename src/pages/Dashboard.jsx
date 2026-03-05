import { useState } from 'react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { getCategoryInfo } from '../data/categories';
import Icon from '../components/Icon';
import TransactionModal from '../components/TransactionModal';

export default function Dashboard({ onNavigate }) {
    const {
        totalIncome, totalExpense, balance, savingsRate,
        budget, budgetUsed, budgetStatus,
        currentMonthTx, user, seedDemo, transactions,
    } = useApp();

    const [modalOpen, setModalOpen] = useState(false);
    const recentTx = currentMonthTx.slice(0, 5);
    const cur = user.currency;

    const fmt = (n) => `${cur}${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div>
                    <h1>👋 Hello, {user.name}!</h1>
                    <p>Here's your financial overview for {format(new Date(), 'MMMM yyyy')}</p>
                </div>
                <button className="btn btn-primary" id="add-transaction-btn" onClick={() => setModalOpen(true)}>
                    <Icon name="plus" /> Add Transaction
                </button>
            </div>

            {/* Budget alerts */}
            {budgetStatus === 'warn' && budget.monthly > 0 && (
                <div className="alert warn">
                    <Icon name="warn" />
                    <div>
                        <strong>Budget Warning:</strong> You've used {budgetUsed.toFixed(0)}% of your monthly budget.
                        You have {cur}{(budget.monthly - totalExpense).toLocaleString()} remaining.
                    </div>
                </div>
            )}
            {budgetStatus === 'critical' && budget.monthly > 0 && (
                <div className="alert critical">
                    <Icon name="warn" />
                    <div>
                        <strong>Budget Exceeded!</strong> You've gone over your budget by {cur}{(totalExpense - budget.monthly).toLocaleString()}.
                        Consider reviewing your expenses.
                    </div>
                </div>
            )}

            {/* Demo seed */}
            {transactions.length === 0 && (
                <div className="insight-banner" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="insight-banner-icon">🚀</div>
                    <div className="insight-banner-body">
                        <h3>Welcome to SmartSpend!</h3>
                        <p>Start by adding a transaction, or load demo data to explore the app.</p>
                    </div>
                    <button className="btn btn-secondary btn-sm insight-banner-btn" id="load-demo-btn" onClick={seedDemo} style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        Load Demo Data
                    </button>
                </div>
            )}

            {/* Stat Cards */}
            <div className="stat-grid">
                <div className="stat-card income">
                    <div className="stat-card-icon">📈</div>
                    <div className="stat-card-label">Total Income</div>
                    <div className="stat-card-value">{fmt(totalIncome)}</div>
                    <div className="stat-card-sub">This month</div>
                </div>
                <div className="stat-card expense">
                    <div className="stat-card-icon">📉</div>
                    <div className="stat-card-label">Total Expenses</div>
                    <div className="stat-card-value">{fmt(totalExpense)}</div>
                    <div className="stat-card-sub">This month</div>
                </div>
                <div className="stat-card balance">
                    <div className="stat-card-icon">💰</div>
                    <div className="stat-card-label">Current Balance</div>
                    <div className="stat-card-value" style={{ color: balance >= 0 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
                        {balance < 0 ? '-' : ''}{fmt(balance)}
                    </div>
                    <div className="stat-card-sub">{balance >= 0 ? 'You\'re doing great!' : 'Over spending'}</div>
                </div>
                <div className="stat-card savings">
                    <div className="stat-card-icon">🎯</div>
                    <div className="stat-card-label">Savings Rate</div>
                    <div className="stat-card-value">{totalIncome > 0 ? `${savingsRate}%` : '—'}</div>
                    <div className="stat-card-sub">Of income saved</div>
                </div>
            </div>

            {/* Budget Progress */}
            {budget.monthly > 0 && (
                <div className="card card-sm" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Monthly Budget</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {cur}{totalExpense.toLocaleString()} spent of {cur}{budget.monthly.toLocaleString()}
                            </div>
                        </div>
                        <span className={`budget-badge ${budgetStatus}`}>
                            {budgetStatus === 'ok' ? <Icon name="check" /> : <Icon name="warn" />}
                            {budgetUsed.toFixed(0)}% used
                        </span>
                    </div>
                    <div className="budget-bar-wrap">
                        <div
                            className={`budget-bar ${budgetStatus}`}
                            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                        />
                    </div>
                    <div className="budget-labels">
                        <span>{cur}0</span>
                        <span>{cur}{budget.monthly.toLocaleString()}</span>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                    <div>
                        <div className="chart-title">Recent Transactions</div>
                        <div className="chart-subtitle">Last 5 this month</div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('transactions')}>
                        View All
                    </button>
                </div>

                {recentTx.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💸</div>
                        <h3>No transactions yet</h3>
                        <p>Add your first transaction to get started</p>
                        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                            <Icon name="plus" /> Add Transaction
                        </button>
                    </div>
                ) : (
                    <div className="transaction-list">
                        {recentTx.map((tx) => {
                            const cat = getCategoryInfo(tx.category);
                            return (
                                <div key={tx.id} className="transaction-item">
                                    <div className="transaction-icon" style={{ background: `${cat.color}18` }}>
                                        {cat.emoji}
                                    </div>
                                    <div className="transaction-info">
                                        <div className="transaction-name">{tx.note || cat.label}</div>
                                        <div className="transaction-meta">
                                            <span>{format(new Date(tx.date), 'dd MMM')}</span>
                                            <span>·</span>
                                            <span className="meta-tag">{cat.label}</span>
                                        </div>
                                    </div>
                                    <div className={`transaction-amount ${tx.type}`}>
                                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
